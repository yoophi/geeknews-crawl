# geeknews-crawl

[news.hada.io](https://news.hada.io)의 게시물·댓글을 로컬 vault에 백업하고, 메모/태그/연결을 입혀 지식 그래프로 시각화하기 위한 도구.

저장 형식은 **Markdown + YAML frontmatter**. Obsidian/VS Code/grep과 그대로 호환되며, git으로 메모·태그 변경 이력이 자연스럽게 버전 관리된다.

## 구조

```
geeknews-crawl/
├─ src/
│  ├─ lib/          # config, frontmatter 스키마(zod), slug, vault 유틸
│  ├─ crawler/      # fetcher, parser, writer, discovery, auth, favorites
│  ├─ graph/        # graph builder
│  └─ cli/          # crawl, lint-vault, tag, relate, note, build-graph, sync-favorites
├─ apps/
│  └─ desktop/      # Electron 데스크탑 앱 (뷰어 + 그래프 + CLI 실행)
├─ scripts/
│  └─ crawl-parallel.sh   # tmux N-worker 병렬 크롤
├─ tests/           # 파서/writer 단위 테스트
├─ AGENTS.md        # 코딩 에이전트(Claude Code/Codex 등) 공용 지침
└─ vault/           # ← 출력물. 그대로 백업 / git 관리 대상
   ├─ topics/YYYY/MM/<id>-<slug>.md     # 게시물 1개 = 파일 1개
   ├─ comments/<id>.md                  # 댓글 트리
   ├─ _attachments/raw/<id>.html.gz     # 원본 HTML 백업 (선택)
   ├─ _state/                           # 크롤 커서/에러 로그
   └─ _index/graph.json                 # 그래프 빌더 산출물 (gitignore)
```

## 토픽 파일 포맷

```markdown
---
id: 12345
title: "..."
url: https://example.com/...
domain: example.com
author: someone
points: 42
comments_count: 17
posted_at: 2026-05-20T09:30:00+09:00
fetched_at: 2026-05-24T01:10:00+09:00
last_seen_at: 2026-05-24T01:10:00+09:00
tags: []                     # 사용자 영역
auto_tags:                   # 크롤러 자동 부여
  - domain/example.com
  - type/news
favorited: false             # 로그인 동기화로 갱신
related: []                  # 수동 wikilinks
---

## 요약
업스트림 AI 요약…

## 본문
원문 미리보기…

<!-- USER:NOTES -->
## 내 메모
```

재크롤 시 보존되는 영역:

- `tags`, `related`, `favorited` (frontmatter)
- `<!-- USER:NOTES -->` 마커 이후의 모든 본문

위 영역은 크롤러가 절대 덮어쓰지 않는다.

## 설치

```bash
pnpm install
cp .env.example .env  # 필요 시 BASE_URL 등 조정
```

요구사항: Node 20+, pnpm.

## 크롤링

```bash
pnpm crawl ids 29797,29796           # 특정 ID 백필
pnpm crawl ids 29000-29100           # 범위 백필
pnpm crawl backfill --months 12      # 최근 12개월 전체 백필 (기본값)
pnpm crawl incremental               # RSS + 최근 3페이지 신규만 흡수
pnpm crawl <cmd> --save-html         # 원본 HTML(gzip)도 함께 백업
pnpm crawl <cmd> --refresh           # 이미 존재하는 토픽도 재크롤
```

큰 범위를 빠르게 돌 때는 tmux 병렬 크롤 (워커당 2초 간격 = 총 ~4 req/sec):

```bash
scripts/crawl-parallel.sh            # 8 worker, 1 ~ vault max id
scripts/crawl-parallel.sh 4 1 30000  # worker 수 / 시작 / 끝 ID
tmux attach -t crawl                 # 진행 확인, kill-session으로 일괄 중지
```

매너:

- 1 req/sec rate limit (`REQUEST_INTERVAL_MS` 환경변수로 조정)
- `User-Agent` 식별 명시 (`USER_AGENT` 환경변수)
- `/topic/<id>.md` 엔드포인트 우선 사용 → HTML 파싱 부하 최소화
- robots.txt에서 차단된 경로(`/login`, `/comments` 등)는 직접 호출하지 않음

## 메모 · 태그 · 연결

```bash
pnpm tag <id> tag1 tag2              # 사용자 태그 추가
pnpm tag <id> tag1 --remove          # 태그 제거
pnpm relate <src-id> <dst-id...>     # 토픽 간 wikilink 추가
pnpm relate <src> <dst> --remove     # 연결 제거
pnpm note <id>                       # 토픽 파일 경로 출력 (편집기 연동용)
```

자유롭게 토픽 파일의 `## 내 메모` 섹션을 직접 편집해도 된다 (Obsidian/VS Code 등).

## Vault 검증

```bash
pnpm lint:vault
```

- frontmatter zod 스키마 검증
- 파일명 ↔ frontmatter `id` 일치
- `related` wikilink가 가리키는 토픽 존재 여부

## 그래프 빌더

```bash
pnpm graph:build
```

`vault/_index/graph.json` 생성. 엣지 종류:

| kind | 의미 | weight |
|---|---|---|
| `domain` | 같은 출처 도메인 | 1 |
| `tag` | 사용자 태그 공유 수 | 공유 태그 개수 |
| `related` | frontmatter `related` 수동 연결 | 2 |
| `similarity` | 제목 3-gram Jaccard ≥ 0.35 | 점수 |

favorited는 엣지가 아닌 **노드 속성**이다 (clique로 만들면 n=1592에서 126만 엣지가 되므로).
뷰어가 주황색 노드 + favorited-only 필터로 표현한다.

## 데스크탑 앱

```bash
cd apps/desktop
pnpm dev          # Electron 개발 모드 (HMR)
pnpm build:mac    # macOS 패키징
```

기능:

- `/` 최근 토픽 리스트 (페이지네이션)
- `/topic/:id` 상세 + 메모 편집(저장 시 frontmatter 보존) + 태그 추가/제거
- `/tags`, `/tags/:name` 태그 탐색
- `/favorited` 즐겨찾기 목록
- `/graph` cytoscape 그래프 (엣지 종류 토글)
- `/tools` CLI 직접 실행 (crawl/sync/graph-rebuild/lint) + 로그 스트리밍

내부적으로 main 프로세스가 vault를 직접 읽고(`@core/lib/vault` 재사용), 장기 실행 명령(`crawl`, `sync:favorites`, `graph:build`, `lint:vault`)은 루트 CLI를 `pnpm exec`로 spawn 해 stdout/stderr를 IPC로 스트리밍한다.

## 테스트

```bash
pnpm test         # vitest
pnpm typecheck    # tsc --noEmit
```

## 즐겨찾기 동기화 (Phase 4)

즐겨찾기 상태를 vault frontmatter(`favorited`)에 반영한다.

인증은 자동이다. `.env`에 자격증명을 넣어두면 쿠키가 없거나 만료됐을 때
`/auth/gn_login`으로 알아서 로그인한다:

```bash
# .env
GEEKNEWS_USERID=...
GEEKNEWS_PASSWORD=...
# (선택) COOKIE_HEADER / COOKIE_FILE — 있으면 우선 사용, 만료 시 위 자격증명으로 폴백
```

실행:

```bash
pnpm sync:favorites --dry-run        # 변경 미리보기
pnpm sync:favorites                  # 기본: 공개 /faved_topics 페이지 기반 — 추가 전용(add-only)
pnpm sync:favorites --userid X       # 다른 사용자의 공개 즐겨찾기 (인증 불요)
pnpm sync:favorites --via-api        # 전체 vault를 viewer API로 대조 — 복구/정합성 검증용
pnpm sync:favorites --via-api --prune  # 즐겨찾기 해제까지 반영 (유일하게 안전한 제거 경로)
```

두 가지 모드가 있는 이유:

| 모드 | 소스 | 커버리지 | 제거 |
|---|---|---|---|
| 기본 (페이지) | `/faved_topics?userid=X&page=N` (공개) | **최근 ~400개로 캡** | 불가 (add-only) |
| `--via-api` | `/api/viewer/topics?ids=...` (인증) | vault 전체 | `--prune`으로 가능 |

공개 목록이 400개로 캡되어 있어서, 거기 없다고 un-favorite로 취급하면 안 된다.
그래서 기본 모드는 추가만 하고, 제거는 전체를 검증하는 `--via-api --prune`에서만 허용한다.

공통 동작:
- vault에 없는 즐겨찾기 토픽 ID는 끝에 안내 (`pnpm crawl ids ...`로 받을 수 있음)
- 변경된 토픽만 `rewriteTopicFile`로 frontmatter 갱신 (`tags`, `related`, 메모 영역은 보존)

이후 `pnpm graph:build`를 다시 돌리면 그래프 노드의 favorited 표시가 갱신된다
(표현 방식은 위 [그래프 빌더](#그래프-빌더) 참조).

## 로드맵

- [x] Phase 0: 부트스트랩
- [x] Phase 1: 백필 크롤러 (`backfill` / `incremental` / `ids`)
- [x] Phase 2: lint:vault + tag/relate/note CLI
- [x] Phase 3a: 그래프 빌더 (graph.json)
- [x] Phase 3b: Electron 데스크탑 앱 (`apps/desktop`)
- [x] Phase 4: 즐겨찾기 동기화 (자동 로그인, add-only 기본 + `--via-api` 전체 대조)
