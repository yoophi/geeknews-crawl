---
id: 29626
title: Semble - grep보다 토큰을 98% 적게 쓰는 에이전트용 코드 검색
url: https://github.com/MinishLab/semble
domain: github.com
author: neo
points: 15
comments_count: 1
posted_at: 2026-05-18T19:36:54+09:00
fetched_at: 2026-05-23T15:51:28.226Z
last_seen_at: 2026-05-23T15:51:28.226Z
tags: []
auto_tags:
  - domain/github.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- 에이전트가 **자연어·코드 쿼리**로 필요한 코드 조각만 즉시 찾도록 만든 코드 검색 라이브러리  
- `grep+read` 대비 **약 98% 적은 토큰**을 사용하며, 전체 파일을 읽는 대신 관련 청크만 반환  
- 평균적으로 Repo를 **약 250ms**에 인덱싱하고 쿼리는 약 1.5ms에 응답하며, CPU에서 API 키·GPU·외부 서비스 없이 동작함  
- 벤치마크 결과 137M 파라미터 **CodeRankEmbed Hybrid 대비 인덱싱은 218배 빠르고**, 검색 품질은 99%를 유지  
- **MCP 서버**로 Claude Code, Cursor, Codex, OpenCode 및 MCP 호환 에이전트에서 사용할 수 있고, 저장소는 필요 시 클론·인덱싱되며 세션 동안 인덱스가 캐시됨  
- Bash 기반 사용도 지원: `AGENTS.md`나 `CLAUDE.md`에 `semble search`와 `semble find-related` 워크플로를 넣을 수 있으며, Claude Code와 Codex CLI의 서브에이전트에서는 이 방식을 사용   
- CLI는 로컬 경로와 `https://` Git URL을 모두 받을 수 있고, `path`를 생략하면 현재 디렉터리를 기본값으로 사용함  
- Python 라이브러리로도 사용할 수 있어 `SembleIndex.from_path`, `SembleIndex.from_git`, `search`, `find_related`로 커스텀 도구에 검색을 통합 가능  
- 동작 원리 :   
  **tree-sitter** 코드 인식 청킹 +   
  **Model2Vec**(potion-code-16M) 의미 임베딩 +   
  **BM25** lexical 매칭을 **RRF(Reciprocal Rank Fusion)** 로 결합  
- 정적 임베딩 모델 사용으로 쿼리 시 트랜스포머 forward pass 없어 **CPU에서 밀리초 단위 실행**  
- MIT 라이선스

<!-- USER:NOTES -->
## 내 메모
