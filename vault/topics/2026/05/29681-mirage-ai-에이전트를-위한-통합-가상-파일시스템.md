---
id: 29681
title: Mirage - AI 에이전트를 위한 통합 가상 파일시스템
url: https://github.com/strukto-ai/mirage
domain: github.com
author: xguru
points: 19
comments_count: 2
posted_at: 2026-05-20T09:46:02+09:00
fetched_at: 2026-05-23T15:51:17.216Z
last_seen_at: 2026-05-23T15:51:17.216Z
tags: []
auto_tags:
  - domain/github.com
  - type/news
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- S3/구글 드라이브/슬랙/Gmail/Redis 등 다양한 백엔드를 **단일 파일시스템 트리**로 마운트해 AI 에이전트가 동일한 인터페이스로 접근 가능  
- 에이전트가 서비스별 SDK/MCP를 새로 익힐 필요 없이, **Unix 계열 bash 도구**만으로 모든 백엔드를 다루며, 서비스 간 파이프라인을 로컬 디스크처럼 자연스럽게 구성  
- 시뮬레이션 환경으로 동작해 에이전트 입장에서는 **하나의 파일시스템**만 보이는 구조, **bash를 이미 학습한 LLM**이라면 별도 어휘 학습 없이 바로 사용 가능  
- **다중 리소스 마운트**: RAM, Disk, Redis, S3 / R2 / OCI / Supabase / GCS, Gmail / GDrive / GDocs / GSheets / GSlides, GitHub / Linear / Notion / Trello, Slack / Discord / Telegram / Email, MongoDB, SSH 등을 단일 루트 아래에 나란히 배치  
- **이식 가능한 워크스페이스**: 환경을 clone, snapshot, version 가능, 에이전트 실행을 다른 머신으로 옮길 때 재시작·재구성 필요없음  
- **앱 임베드**: Python·TypeScript SDK로 FastAPI, Express, 브라우저 앱 등 모든 async 런타임 내부에 가상 파일시스템을 직접 부여해서 별도 프로세스 필요없음  
- **에이전트 프레임워크 호환**: OpenAI Agents SDK, Vercel AI SDK (TypeScript), LangChain, Pydantic AI, CAMEL, OpenHands 지원  
- **경량 CLI + 데몬**: Claude Code, Codex 같은 코딩 에이전트에 연결되어 친숙한 bash로 마운트 리소스 접근  
- ## 커맨드 확장  
  - `ws.command('summarize', ...)` 로 신규 커맨드를 등록하면 모든 마운트에서 사용 가능  
  - `ws.command('cat', { resource: 's3', filetype: 'parquet' }, ...)` 처럼 **특정 리소스·파일타입에 대한 커맨드 오버라이드** 지원, 예: S3의 Parquet 파일에 cat 실행 시 원시 바이트 대신 JSON 행 출력  
- ## 2계층 캐시  
  - **Index Cache**: 디렉토리 리스팅·메타데이터 캐싱, 첫 탐색은 API 호출, 이후 TTL 만료 전까지 인덱스에서 응답  
  - **File Cache**: 오브젝트 바이트 캐싱, 첫 읽기는 원본 스트리밍, 이후 파이프라인은 캐시에서 읽음  
- **Pluggable Backends**: RAM(기본, 파일 캐시 512MB, 인덱스 TTL 10분) 또는 Redis(워커·프로세스·머신 간 공유, 재시작 후 캐시 유지) 선택 가능  
- Apache-2.0 라이선스

<!-- USER:NOTES -->
## 내 메모
