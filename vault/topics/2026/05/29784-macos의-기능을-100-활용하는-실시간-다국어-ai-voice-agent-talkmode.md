---
id: 29784
title: macOS의 기능을 100% 활용하는 실시간 다국어 AI Voice Agent — TalkMode
url: https://talkmode.baryon.ai/
domain: talkmode.baryon.ai
author: fastkoder
points: 2
comments_count: 0
posted_at: 2026-05-23T10:07:27+09:00
fetched_at: 2026-05-23T15:50:18.072Z
last_seen_at: 2026-05-23T15:50:18.072Z
tags: []
auto_tags:
  - domain/talkmode.baryon.ai
  - type/news
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
제목:  
맥 위에서 동작하는 실시간 AI 음성 Agent — TalkMode  
  
부제:  
시선 추적(Gaze), 실시간 STT/TTS, Claude/OpenAI 연동 기반의 Agent-OS 스타일 음성 인터페이스  
  
[TalkMode](https://talkmode.baryon.ai/) 는 단순 음성 챗봇보다는  
“실시간 작업형 AI 음성 Agent”에 가까운 프로젝트입니다.  
  
기술적으로 흥미로운 포인트들:  
  
* macOS 네이티브 기반 저지연 음성 인터랙션  
* 실시간 STT ↔ LLM ↔ TTS 파이프라인  
* 한국어 포함 다국어 음성 대화 최적화  
* gaze(시선) 기반 인터랙션 실험  
* turn-taking(발화 타이밍 제어) 처리  
* OpenAI / Claude / CLI Agent 연동 구조  
* Agent OS 스타일 워크플로우 지향  
* 로컬 우선(local-first) 아키텍처 지향  
  
특히 단순 “질문-응답형 보이스 챗”이 아니라:  
  
* 회의  
* 브레인스토밍  
* 개발 보조  
* 리서치  
* IDE/CLI 연결  
  
같은 “지속 작업 흐름”을 음성으로 연결하려는 방향성이 보입니다.  
  
아래 같은 흐름을 실제로 노리는 느낌:  
  
```text  
Mic Input  
  ↓  
Streaming STT  
  ↓  
Context / Memory  
  ↓  
LLM Agent  
  ↓  
Tool Calls / CLI  
  ↓  
Realtime TTS  
```  
  
또 하나 흥미로운 점은  
기존 Voice Assistant들이 “모바일 비서” 느낌이었다면,  
TalkMode는 Claude Code / Codex / 터미널 문화와 연결된  
“개발자용 음성 Agent”에 더 가까워 보인다는 점입니다.  
  
공식 사이트:  
https://talkmode.baryon.ai/  
  
GitHub:  
https://github.com/baryonlabs

<!-- USER:NOTES -->
## 내 메모
