---
id: 29755
title: Google의 Antigravity 미끼와 바꿔치기
url: https://www.0xsid.com/blog/antigravity-bait-n-switch
domain: 0xsid.com
author: neo
points: 1
comments_count: 1
posted_at: 2026-05-22T09:48:38+09:00
fetched_at: 2026-05-23T15:50:46.118Z
last_seen_at: 2026-05-23T15:50:46.118Z
tags: []
auto_tags:
  - domain/0xsid.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **Antigravity 2.0** 자동 업데이트가 기존 IDE를 독립형 Codex 스타일 대화형 도구로 바꾸면서 실행 바로가기에서 IDE가 사라짐
- 기존 Antigravity IDE는 Google AI Ultra 플랜의 일상 도구였고, **계획-검토-구현 루프**가 끊기며 작업 방식이 중단됨
- 다운로드 페이지의 **레거시 IDE** 설치 파일을 실행해도 2.0 챗봇 인터페이스가 열려 두 버전의 공존이 제대로 작동하지 않음
- Antigravity 관련 항목을 모두 삭제한 뒤 독립형 IDE를 다시 설치하자 **깨끗한 설치**는 성공했지만 채팅 기록과 설정이 사라짐
- 개발 도구의 **백그라운드 업데이트**는 성능 패치나 버전 업그레이드에 그쳐야 하며, 사용자가 고른 도구를 몰래 바꾸면 신뢰가 깨짐

---

### Antigravity 2.0 자동 업데이트로 바뀐 실행 환경
- Google은 [I/O 2026](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/)에서 Antigravity 새 버전을 **독립형 Codex 스타일 경험**으로 공개했고, 기존 설치본은 자동으로 새 버전으로 “업데이트”됨
- 몇 달 동안 사용하던 **Antigravity IDE**는 실행 바로가기에서 사라졌고, 대신 단일 대화형 프롬프트 박스가 열림
- 기존 Antigravity는 Google AI Ultra 플랜의 일상 작업 도구였으며, 빠른 데모나 MVP에는 에이전트형 워크플로가 괜찮아도 프로덕션 소프트웨어에는 더 예측 가능한 출력이 필요했음
- Cursor와 이전 Antigravity에서 선호하던 **계획-검토-구현 루프**가 끊기면서 기존 작업 흐름을 유지하기 어려워짐

### 레거시 IDE 복구 시도와 한계
- ## 두 버전의 공존 실패
  - Google은 [Antigravity 다운로드 페이지](https://antigravity.google/download) 하단에 레거시 Antigravity IDE용 별도 다운로드 패키지를 제공함
  - 레거시 IDE 설치 파일을 내려받아 실행해도 같은 **2.0 챗봇 인터페이스**가 다시 열림
  - 2.0 업데이트가 기본 애플리케이션 경로를 강하게 다시 작성해, 두 버전의 Antigravity를 동시에 설치해 정상 작동시키기 어려운 상태가 됨
  - IDE를 다시 설치해도 챗봇이 실행을 계속 가로채는 문제가 반복됨
- ## 전체 삭제 후 재설치
  - Antigravity subreddit에서도 같은 상황을 겪은 사용자들이 있었고, 기기에서 Antigravity 관련 항목을 모두 제거한 뒤 다시 설치하는 방식이 해결책으로 쓰임
  - 2.0 바이너리를 완전히 지운 상태에서 독립형 IDE 설치 파일을 다시 실행하자, 챗봇이 실행 경로를 방해하지 않아 **깨끗한 설치**가 성공함
- ## 설정과 기록 손실
  - 인터페이스는 복구됐지만 강제 업데이트와 전체 삭제 과정에서 **채팅 기록과 설정**이 지워짐
  - 대부분의 설정은 기존 Cursor 구성에서 복사할 수 있었지만, 이전 Antigravity 설치의 프롬프트 기록은 거의 사라진 상태가 됨
  - 업그레이드 과정에서 `antigravity-backup` 폴더가 남았고, 그 안에 예전 기록과 프로필 정보가 들어 있기를 기대하는 상태임
- ## 자동 업데이트에 대한 결론
  - 백그라운드 업데이트는 성능 패치나 버전 업그레이드에 쓰여야 하며, 몰래 완전히 다른 소프트웨어를 배포하는 방식이어서는 안 됨
  - 개발 도구를 다른 도구로 바꿔치기하는 업데이트는 단순한 불편을 넘어 **큰 작업 방해**가 됨
  - 자동 업데이트를 완전히 막을 방법을 찾게 됐고, 사용자가 선택한 도구가 그대로 유지된다는 신뢰가 필요함

<!-- USER:NOTES -->
## 내 메모
