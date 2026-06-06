# AGENTS.md — geeknews-crawl 에이전트 지침

이 파일은 Claude Code, Codex 등 모든 코딩 에이전트가 공유하는 단일 지침서다.
프로젝트 개요·사용법은 [README.md](README.md) 참조. 여기는 **작업 수행 규칙과 자주 쓰는 절차**만 담는다.

## 프로젝트 한 줄 요약

news.hada.io(GeekNews)를 Markdown+frontmatter vault로 백업하고, 메모/태그/즐겨찾기/그래프를 관리하는 모노레포.
루트 = 크롤러 CLI (TypeScript + tsx), `apps/desktop` = Electron 뷰어.

## 절대 규칙

1. **vault의 사용자 영역을 덮어쓰지 않는다.** 토픽 파일에서 다음은 크롤러/스크립트가 보존해야 한다:
   - frontmatter: `tags`, `related`, `favorited`
   - 본문: `<!-- USER:NOTES -->` 마커 이후 전체
   - 모든 frontmatter 수정은 `src/lib/vault.ts`의 `rewriteTopicFile()`을 통해서만.
2. **rate limit 준수**: 사이트 요청은 1 req/sec (`REQUEST_INTERVAL_MS=1000`). 병렬 크롤은 `scripts/crawl-parallel.sh`처럼 워커당 간격을 늘려 총량 ~4 req/sec 이하 유지.
3. **`favorited` 플래그를 일괄 제거하는 코드를 만들지 않는다.** `/faved_topics` 공개 목록은 **최근 ~400개로 캡**되어 있어, 거기 없다고 un-favorite가 아니다. 제거는 `--via-api --prune` 조합으로만 (전체 vault를 viewer API로 검증한 경우에만 안전).
4. vault 파일 대부분은 **git 미추적** 상태다. 파괴적 변경 전에 복구 수단이 있는지 확인할 것.
5. 커밋은 코드와 vault를 분리한다. vault 변경은 별도 커밋 또는 커밋하지 않음 (사용자 판단).

## 자주 쓰는 절차

### "최신 데이터 + favorites 크롤해줘"

```bash
# 1. 신규 토픽 수집 (RSS + 최근 3페이지)
pnpm crawl incremental

# 2. ID 갭 채우기 — incremental은 최근 페이지만 보므로 누락 가능
#    <last-known-max>는 이전 vault max id (아래 명령으로 확인)
find vault/topics -name '*.md' | sed 's|.*/||;s|-.*||' | sort -n | tail -1
pnpm crawl ids <last-known-max>-<new-max>

# 3. 즐겨찾기 동기화 (추가 전용, 공개 페이지 기반)
pnpm sync:favorites            # --dry-run 으로 미리보기 가능

# 4. vault에 없는 즐겨찾기 토픽이 안내되면 받기
pnpm crawl ids <표시된 ID들>

# 5. 그래프 재빌드
pnpm graph:build
```

### 즐겨찾기 전체 복구/검증 (인증 필요)

```bash
# 쿠키 만료 시: Chrome devtools → Network → news.hada.io 요청 → Copy as cURL
# → cookie 헤더 값을 .env의 COOKIE_HEADER에 갱신

pnpm sync:favorites --via-api            # 전체 vault를 viewer API로 대조 (느림: ~100 id/sec)
pnpm sync:favorites --via-api --prune    # 제거까지 동기화 (유일하게 안전한 prune 경로)
```

### 과거 ID 범위 백필

```bash
pnpm crawl backfill --months 12      # posted_at cutoff까지 거꾸로
pnpm crawl ids 7000-14000            # 명시적 범위 (기존 파일 자동 skip)
scripts/crawl-parallel.sh 8 1 30000  # tmux 8-worker 병렬 (워커당 2s 간격)
```

### 검증

```bash
pnpm test          # vitest (파서/writer 단위 테스트)
pnpm typecheck     # 루트 tsc
pnpm lint:vault    # frontmatter 스키마 + 파일명 + wikilink 무결성
cd apps/desktop && pnpm typecheck   # 데스크탑 (node + web 양쪽)
```

## 아키텍처 메모

- **데이터 소스**: `topic/<id>.md` 엔드포인트가 깨끗한 마크다운을 반환 (HTML 파싱 불필요). 파서는 `src/crawler/parser.ts`의 정규식 섹션 분할.
- **파일 규칙**: `vault/topics/YYYY/MM/<id>-<slug>.md`, 댓글은 `vault/comments/<id>.md`, wikilink는 `[[<id>]]` 또는 `[[<id>-<slug>]]`.
- **크롤 상태**: `vault/_state/crawl-state.json` (인간 가독 JSON), 에러는 `vault/_state/crawl-errors.log`.
- **그래프**: `pnpm graph:build` → `vault/_index/graph.json` (gitignored, derived). 엣지: domain/tag/related/favorited/similarity(제목 3-gram Jaccard ≥0.35).
- **gray-matter 함정**: YAML의 ISO 날짜를 `Date` 객체로 자동 변환한다. zod 검증 전 `coerceDates()` 필수 (`src/lib/vault.ts`).
- **404 ID는 정상**: 삭제된 글. `pnpm crawl`은 30회 연속 404면 중단(backfill), 개별 404는 기록 후 진행.
- **pnpm 워크스페이스**: 루트(`.`) + `apps/*`. `pnpm link`는 빌트인과 충돌해서 `pnpm relate`로 명명.
- **Electron 앱**: main 프로세스가 `@core` alias로 루트 `src/`를 직접 import. 장기 실행 명령은 `pnpm` child_process spawn 후 IPC 스트리밍 (`apps/desktop/src/main/ipc/run.ts`).

## 사이트 동작 특이사항 (2026-06 기준)

- `/faved_topics?userid=X&page=N`: 공개(인증 불요), 페이지당 20개, **최근 400개 캡**, 끝 페이지 다음은 404.
- `/api/viewer/topics?ids=a,b,c`: 인증 필요, 임의 ID의 fav/vote 상태 반환 — 전체 동기화의 유일한 신뢰 소스.
- `/auth/nav-state`: 로그인 검증 + userid 반환.
- robots.txt: `/login`, `/comments` 등 차단 — 직접 호출 금지 (댓글은 topic .md에 포함된 것 사용).
- RSS `/rss/news`는 feedburner로 302 → fetcher가 redirect 따라감.
