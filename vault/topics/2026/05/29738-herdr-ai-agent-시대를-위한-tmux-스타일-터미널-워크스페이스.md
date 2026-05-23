---
id: 29738
title: Herdr - AI Agent 시대를 위한 tmux 스타일 터미널 워크스페이스
url: https://herdr.dev/
domain: herdr.dev
author: nezz1204
points: 16
comments_count: 0
posted_at: 2026-05-22T02:03:01+09:00
fetched_at: 2026-05-23T15:50:59.104Z
last_seen_at: 2026-05-23T15:50:59.104Z
tags: []
auto_tags:
  - domain/herdr.dev
  - type/news
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
Herdr는 터미널 안에서 동작하는 “agent-native” 워크스페이스 매니저입니다. tmux처럼 세션 유지(detach/reattach), pane 분할, SSH 환경 지원을 제공하면서도, Claude Code·Codex·OpenCode 같은 AI coding agent들을 여러 개 동시에 관리하는 데 최적화되어 있습니다.  
  
특히 단순한 terminal multiplexer를 넘어서, 각 agent의 상태를 working / blocked / done 형태로 자동 인식하고 사이드바에서 한눈에 보여주는 점이 인상적입니다. 여러 AI agent를 병렬로 돌리는 개발 workflow에 꽤 잘 맞습니다.  
  
또한 Electron 기반 GUI 앱이 아니라 Rust 기반 단일 바이너리로 동작해서 가볍고, 기존에 사용하던 Ghostty, iTerm, Kitty 같은 터미널 환경을 그대로 유지할 수 있습니다. CLI와 Socket API도 제공해서 agent가 직접 pane 생성·명령 실행·출력 확인까지 자동화할 수 있습니다.

<!-- USER:NOTES -->
## 내 메모
