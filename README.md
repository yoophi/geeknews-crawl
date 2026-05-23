# geeknews-crawl

[news.hada.io](https://news.hada.io)의 게시물·댓글을 로컬 vault에 백업하고, 메모/태그/연결을 입혀 지식 그래프로 시각화하기 위한 도구.

저장 형식은 **Markdown + YAML frontmatter**. Obsidian/VS Code/grep과 그대로 호환되며, git으로 메모·태그 변경 이력이 자연스럽게 버전 관리된다.

## 구조

```
geeknews-crawl/
├─ src/
│  ├─ lib/          # config, frontmatter 스키마(zod), slug, vault 유틸
│  ├─ crawler/      # fetcher, parser, writer, discovery (RSS+페이지)
│  ├─ graph/        # graph builder
│  └─ cli/          # crawl, lint-vault, tag, link(=relate), note, build-graph
├─ tests/           # 파서/writer 단위 테스트
├─ logs/            # 백필 등 장기 실행 로그
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
| `favorited` | 두 토픽 모두 favorited | 2 |
| `similarity` | 제목 3-gram Jaccard ≥ 0.35 | 점수 |

## 테스트

```bash
pnpm test         # vitest
pnpm typecheck    # tsc --noEmit
```

## 로드맵

- [x] Phase 0: 부트스트랩
- [x] Phase 1: 백필 크롤러 (`backfill` / `incremental` / `ids`)
- [x] Phase 2: lint:vault + tag/relate/note CLI
- [x] Phase 3a: 그래프 빌더 (graph.json)
- [ ] Phase 3b: Next.js 뷰어 (`apps/web` — `/topic/[id]`, `/tags/[name]`, `/graph`, `/search`)
- [ ] Phase 4: 로그인 쿠키로 즐겨찾기 동기화 → `favorited: true` 자동 부여
