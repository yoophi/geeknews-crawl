---
id: 29693
title: What's new in Chrome from Google I/O 2026
url: https://www.youtube.com/watch?v=cBS2bHhw0Pg
domain: youtube.com
author: ragingwind
points: 7
comments_count: 2
posted_at: 2026-05-20T10:54:36+09:00
fetched_at: 2026-05-23T15:51:12.124Z
last_seen_at: 2026-05-23T15:51:12.124Z
tags: []
auto_tags:
  - domain/youtube.com
  - type/news
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
Chrome 개발자 데브렐팀을 이끄는 Paul Kinlan이 발표한 이번 키노트는 지난 6개월간 웹 개발 환경에 일어난 급격한 변화와, Chrome이 준비 중인 새로운 기술들을 폭넓게 다뤘습니다. 핵심은 세 가지 축으로 정리됩니다. 에이전트(AI 비서)가 사용자 대신 웹을 탐색하는 시대에 사이트를 준비시키는 일, 개발 도구가 최신 웹 표준을 따라가도록 돕는 일, 그리고 앞으로 1~2년간의 플랫폼 로드맵을 미리 공유하는 일입니다.  
  
WebMCP, 에이전트가 웹과 대화하는 새로운 방식  
  
- **개념** WebMCP는 HTML 폼과 자바스크립트 함수를 에이전트가 사용할 수 있는 도구로 노출시키는 제안 명세입니다. 사이트가 에이전트에게 "여기서 검색이 되고, 장바구니에 담을 수 있고, 결제가 가능하다"는 식으로 기능을 알려주는 구조입니다.  
- **작동 방식** MCP(Model Context Protocol)의 도구 부분만 차용해, 별도 서버 없이 현재 브라우저 탭이 직접 도구 목록을 공유합니다. `navigator.modelContext.registerTool` API로 명령형 등록도 가능합니다.  
- **차별점** 브라우저 컨텍스트 안에서 실행되므로 로그인 상태, 쿠키, 로컬 스토리지를 그대로 활용할 수 있습니다. 외부 MCP 서버 방식에서는 얻기 어려운 이점입니다.  
- **현황** Expedia가 "할머니 댁 근처 호텔 찾기" 같은 시나리오로 실험 중이며, Chrome 149(2026년 6월 2일 예정)에서 Origin Trial로 제공됩니다.  
  
Modern Web Guidance, AI 코딩 도구를 위한 최신 웹 가이드  
  
- **문제 인식** AI 모델은 1년 전 웹 지식으로 학습되어 있는데, Chrome은 4주(곧 2주)마다 업데이트됩니다. 이 시차가 코드 품질을 떨어뜨리는 요인이라는 진단입니다.  
- **해결 방식** `npx modern-web-guidance install` 한 줄로 설치하는 스킬 팩으로, 성능·보안·아이덴티티 같은 상위 영역과 100여 개의 구체적 사용 사례에 대한 권장 패턴을 제공합니다.  
- **Baseline 연계** 크로스 브라우저 호환성 기준인 Baseline에 맞춰, 아직 널리 지원되지 않는 기능은 폴백과 점진적 향상까지 함께 안내합니다. Google Analytics 연동으로 실제 방문자 데이터에 기반한 Baseline 타깃 설정도 가능합니다.  
  
Chrome DevTools for Agents, AI에게 개발자 도구를 쥐어주기  
  
- **제공 기능** 콘솔 로그, 네트워크 트래픽, 메모리 트레이스, 접근성 트리에 AI 도구가 직접 접근해 성능 프로파일링과 Lighthouse 감사까지 수행합니다.  
- **추가된 것** DevTools 스킬, 토큰 절약형 CLI, CI 환경용 TypeScript API, 실행 중인 Chrome 인스턴스 연결, 멀티 에이전트 워크플로(여러 Chrome 동시 제어), Chrome 확장 프로그램 자동 설치·디버깅 기능이 새로 들어갔습니다.  
  
플랫폼 신기능, Baseline에 합류한 52가지  
  
- **View Transitions와 Navigation API** 페이지 간 부드러운 전환과 통합된 내비게이션 상태 관리가 표준으로 자리 잡았습니다.  
- **LoAF(Long Animation Frames)** iOS 사용자 포함 모든 브라우저에서 상호작용 성능 측정이 가능해졌습니다.  
- **선언적 부분 업데이트** 자바스크립트 없이 HTML 조각을 순서와 무관하게 DOM에 패치할 수 있어, 느린 데이터 영역을 나중에 채워 넣는 식의 최적화가 가능합니다(Chrome 148).  
- **Streaming HTML API** `streamHTML`, `streamHTMLUnsafe`로 JSON 변환 없이 동적 마크업을 주입할 수 있습니다.  
- **HTML-in-Canvas** 표준 DOM을 캔버스 안에 렌더링해, 3D 게임 엔진이나 PlayCanvas·Three.js 환경에서도 검색·번역·접근성이 살아 있는 UI를 구현할 수 있습니다. 키노트 도입부의 3D 침실 데모가 이 기능으로 만들어졌습니다.  
  
기기 내 AI(Built-in AI)  
  
- **Prompt API** Chrome 148에서 멀티모달을 지원하며, 이미지 분석과 구조화된 JSON 출력이 가능합니다. 영어 외 프랑스어·독일어·일본어·스페인어로 언어 지원이 확대됐습니다.  
- **앞으로** Gemma 모델 패밀리가 도입되면 네이티브 함수 호출이 가능해져, 클라이언트 사이드에서 자율적으로 동작하는 에이전트를 만들 수 있게 됩니다. Reddit, Drupal, Temu 등이 점진적 향상 방식으로 이미 적용 중입니다.  
  
전반적으로 이번 발표는 웹이 "사람이 둘러보고 행동하는 매체"에서 "에이전트에게 일을 위임하는 매체"로 옮겨가는 전환점을, 모바일 전환보다 훨씬 빠른 속도로 맞이하고 있다는 메시지를 담고 있습니다. Chrome은 한쪽에서는 WebMCP로 사이트가 에이전트에 참여할 통로를 열고, 다른 한쪽에서는 Modern Web Guidance와 DevTools for Agents로 AI 개발 도구의 품질을 끌어올리는 양면 전략을 펴고 있습니다. 시맨틱 HTML과 접근성, Baseline 같은 기본기에 다시 충실해질수록 에이전트 시대의 웹에서도 유리하다는 관점은, 화려한 신기술 발표 사이에서도 일관되게 강조된 대목입니다.

<!-- USER:NOTES -->
## 내 메모
