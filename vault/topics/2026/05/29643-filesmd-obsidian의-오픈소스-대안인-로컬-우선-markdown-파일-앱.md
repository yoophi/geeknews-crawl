---
id: 29643
title: Files.md - Obsidian의 오픈소스 대안인 로컬 우선 Markdown 파일 앱
url: https://github.com/zakirullin/files.md
domain: github.com
author: neo
points: 24
comments_count: 3
posted_at: 2026-05-19T09:52:05+09:00
fetched_at: 2026-05-23T15:51:23.137Z
last_seen_at: 2026-05-23T15:51:23.137Z
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
- 노트·문서·프로젝트·저널·습관·체크리스트·작업을 **plain `.md` 파일**로 저장하는 단순한 개인 지식 관리 앱  
- **로컬 우선**으로 설치도 필요없고, 브라우저만 있으면 동작하며 **오프라인 사용 가능**한 PWA 구조   
- **Cloud 폴더 동기화** 지원: iCloud / Dropbox / Google Drive 기존 클라우드 폴더로 다기기 동기화, 서버 운영 필요없음   
- **셀프 호스트 서버**도 가능: 단일 Go 바이너리로 자체 서버 운영, 완전한 제어 및 **Telegram 봇 통합** 가능  
- **Hosted (app.files.md)** 방식: 매니지드 서버 제공, 설정 없이 즉시 사용  
- 빠른 기록: 채팅창에 메시지를 던지면 모든 기기에 자동 동기화되고, 저장 위치는 즉시 선택하거나 나중에 정리 가능  
  - **노트·작업·일기·체크리스트**가 모두 같은 흐름으로 한 번에 처리됨. `Enter`만 누르면 저장 완료  
- [Telegram Bot](https://t.me/FilesMDBot) 은 이동 중 파일 접근과 저장을 위해 사용 가능, 다른 메신저 지원 예정   
  - 인박스 항목은 **안정적 콘텐츠 해시(`fs.Hash`)** 로 식별되어, 다른 항목이 추가·삭제·완료되어도 버튼이 올바른 라인을 가리킴  
- 지식 관리 방식은 고급 템플릿·플러그인·AI 워크플로보다 **직접 생각하기**를 강조하며, 한 노트에 한 아이디어를 담고 관련 노트를 링크하고 다시 살펴보는 흐름을 권장  
- 파일 구조는 `Chat.md`, `brain/Note.md`, `journal/2024.08 August.md`, `habits/*.md`, `media/*`, `config.json`처럼 미리 정의돼 있지만 원하는 구조를 쓸 수도 있음  
- `files.md/llms.txt`에 구조 스키마가 제공되며, 이를 `CLAUDE.md`나 `AGENTS.md`에 붙여 AI 에이전트가 파일 구조를 이해하게 할 수 있음  
- `[`로 파일 링크 삽입, `Cmd/Ctrl+P`로 파일 검색, `Cmd/Ctrl+N`으로 새 파일 생성 등 Markdown 파일 작업을 위한 단축키를 제공함  
- 코드베이스는 한 사람이나 LLM이 전체를 머릿속에 담을 수 있을 정도의 단순함을 목표로 하며, PR은 기능 추가보다 코드 제거와 단순화를 우선해야 함  
- 프런트엔드는 빌드 시스템 없이 `/web/index.html`이 오래 지나도 그대로 열리도록 하는 방향을 지향하고, 백엔드는 테스트·오류 래핑·의존성 최소화를 중시  
- 저장 형식과 이식성을 위해 모든 것은 일반 `.md` 파일에 저장되며, 표준 Markdown 링크를 사용해 GitHub 같은 다른 환경과의 호환성을 유지하려 함  
- MIT 라이선스

<!-- USER:NOTES -->
## 내 메모
