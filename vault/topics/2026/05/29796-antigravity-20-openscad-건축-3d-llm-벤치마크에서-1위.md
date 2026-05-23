---
id: 29796
title: Antigravity 2.0, OpenSCAD 건축 3D LLM 벤치마크에서 1위
url: https://modelrift.com/blog/openscad-llm-benchmark/
domain: modelrift.com
author: neo
points: 1
comments_count: 1
posted_at: 2026-05-23T21:48:15+09:00
fetched_at: 2026-05-23T15:49:39.901Z
last_seen_at: 2026-05-23T15:49:39.901Z
tags: []
auto_tags:
  - domain/modelrift.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **OpenSCAD Pantheon 벤치마크**는 참고 이미지 2장과 짧은 프롬프트만으로 AI 코딩 도구가 건축물을 파라메트릭 CAD 코드로 구현하는지 시험함
- **Google Antigravity 2.0 / Gemini 3.5 Flash High**는 품질 4.5/5로 최고점을 받았고, 실제 Pantheon 치수·비문·내부 코퍼 천장 패턴까지 구현함
- Codex 5.5 High는 디테일 밀도가 높았지만 **PNG 미리보기와 최종 STL 불일치**로 감점됐고, Sonnet은 기존 자율 실행 중 가장 깔끔한 모델을 냄
- Cursor는 가장 빨랐지만 품질이 가장 낮았고, ModelRift/Gemini Flash 3.0은 **시각 피드백**을 더한 휴먼 인 더 루프 방식으로 3.8/5에 도달함
- 모든 시스템이 OpenSCAD CLI 렌더링까지 수행했지만, 병목은 도구 접근이 아니라 **기하 판단**과 최종 메시 검증이었음

---

### 벤치마크 목적과 과제
- ModelRift는 모든 3D 모델에 대해 **OpenSCAD 코드**를 생성하므로, LLM의 공간 기하 처리 능력이 실제 모델 품질에 직접 연결됨
- 이번 테스트는 여러 AI 코딩 도구에 같은 과제를 주고, 참고 이미지와 짧은 프롬프트를 바탕으로 **Pantheon**을 OpenSCAD로 구현하게 한 소규모 실전 벤치마크였음
- 목표는 건축 참고 자료를 **파라메트릭 CAD 코드**로 바꾸고, OpenSCAD CLI로 PNG 미리보기를 렌더링하며 반복 개선하는 능력을 확인하는 데 있었음
- 프롬프트는 Pantheon의 로툰다, 돔, 포르티코, 기둥, 페디먼트, 전면 디테일을 포함하도록 요구함
  ```text
  see two ref images and build .scad file with openscad implementation of pantheon. use openscad CLI (available) to preview your work (by rendering openscad model to .png)  and iterate until you are happy with the result.
  ```

### Pantheon과 OpenSCAD를 고른 이유
- Pantheon은 단순한 `difference()`, `cube()`, `cylinder()` 문법 테스트를 넘어서는 과제이면서도, OpenSCAD가 다루기 어려운 유기적 조각이나 캐릭터형 기하는 아님
- 주요 구조는 **원형 로툰다와 돔**, 중앙 오큘러스, 직선형 포르티코, 기둥, 계단식 기단, 삼각 페디먼트로 구성돼 결과 차이를 비교하기 좋음
- 약한 결과도 돔이 있는 건물처럼 보일 수 있지만, 좋은 결과는 둥근 드럼, 직사각형 포르티코, 돔 링, 전면 파사드의 관계를 더 정확히 맞춰야 함
- OpenSCAD는 모델이 **평문 코드**이고 어휘가 작아 LLM 생성 기하의 대상으로 적합함
- “반지름 주변에 28개 기둥 반복”이나 “돔에서 오큘러스 빼기” 같은 지시를 소스 코드로 직접 표현할 수 있음
- 결과물이 검사 가능하고 재현 가능하며 수정하기 쉬워, 기둥 간격 오류도 숨겨진 장면 상태가 아니라 매개변수나 반복문 수정으로 고칠 수 있음
- ModelRift가 OpenSCAD를 기반으로 만들어진 배경은 [Why we built ModelRift on OpenSCAD](https://modelrift.com/blog/why-openscad)에 정리돼 있음
- 단점은 OpenSCAD가 **조각 도구**가 아니라는 점이며, 구성형·파라메트릭·하드서피스 객체에 가장 잘 맞음

### 전체 결과
- 점수는 이 벤치마크 안에서의 상대 평가이며, **일반 모델 순위**가 아님
- 시간 점수는 프로젝트 공개 시각이 아니라 관찰된 **구현 시간**을 반영함
- 품질 점수는 보수적으로 매겨졌고, 최고 결과도 완벽한 Pantheon 모델에 가깝지는 않음
- 도구와 모델별 결과:
  - [Cursor 3.5 / Composer 2.5](https://modelrift.com/models/pantheon-benchmark-cursor-and-composer-25): 시간 5/5, 품질 1.4/5. 가장 빨랐지만 가장 약했으며, 돔과 포르티코의 큰 형태 외에는 비례·색상 통제·건축 디테일이 부족했음
  - [Codex 5.5 High](https://modelrift.com/models/cube-with-six-face-holes): 시간 4/5, 품질 3.0/5. 엔태블러처 비문까지 넣을 만큼 디테일 밀도가 높았지만, 최종 STL이 PNG 미리보기와 달라 감점됨
  - [Claude Code 2.1 / Opus 4.7](https://modelrift.com/models/pantheon-benchmark-claude-code-21-and-opus-47): 시간 2/5, 품질 3.0/5. Cursor보다 구조와 포르티코, 계단식 기단이 명확했지만 색이 지나치게 균일했고 강한 결과보다 덜 설득력 있었음
  - [Claude Code 2.1 / Sonnet 4.6](https://modelrift.com/models/pantheon-benchmark-sonnet-46): 시간 1/5, 품질 3.4/5. 기존 자율 실행 중 가장 그럴듯한 전체 인상과 균형 잡힌 비례를 보였지만 구현 시간이 가장 길었음
  - [Google Antigravity 2.0 / Gemini 3.5 Flash High](https://modelrift.com/models/pantheon-benchmark-antigravity-20-flash-35-high): 시간 1/5, 품질 4.5/5. 실제 Pantheon 치수와 비문을 사용했고, 자율 에이전트 중 유일하게 내부 코퍼 천장 패턴을 구현함
  - [ModelRift / Gemini Flash 3.0](https://modelrift.com/models/pantheon-benchmark-modelrift-gemini-flash-30): 시간 1/5, 품질 3.8/5. ModelRift의 반복 주석 워크플로를 사용한 비자율 결과 중 최고였고 Claude Code 대비 약 2배 시간이 걸림

### 워크플로 관찰
- 클라이언트 워크플로는 모델 자체만큼 중요했음
- Codex Desktop은 LLM이 컨텍스트에 불러온 **이미지**를 대화 안에 직접 보여줘, 시각적 CAD 작업에서 참고 자료 사용 여부를 확인하기 쉬웠음
- Cursor Agent와 Claude Code CLI도 이미지를 사용할 수 있었지만, 처리 과정에서 **시각 컨텍스트**가 덜 명시적으로 보였음
- 테스트한 모든 시스템은 로컬 OpenSCAD 도구체인을 다룰 수 있었고, macOS `PATH`의 OpenSCAD를 호출해 PNG 미리보기를 렌더링함
- 병목은 도구 접근이 아니라 **기하 판단**, 카메라 설정, 미리보기 모델을 깨끗한 최종 메시로 내보낼 수 있는지였음
- Codex는 참고 이미지, OpenSCAD 파일 편집, 생성된 미리보기를 같은 스레드에 노출해 반복 과정을 따라가기 쉬웠음
- 공개 벤치마크 이후 Codex는 지붕과 엔태블러처 내보내기 문제를 수정하려 했지만, 최종 비교는 원래 제출 모델을 기준으로 함
- Cursor는 가장 빠른 상호작용 루프와 유용한 계획·OpenSCAD 코드 병렬 UI를 제공했지만, 출력 품질은 느린 실행들보다 뒤처짐
- Claude Code는 터미널 중심으로 이미지를 읽고 OpenSCAD 명령을 반복했지만, 모델이 만들어지는 과정은 덜 시각적이었음

### Google Antigravity 2.0 / Gemini 3.5 Flash High
- [Explore 3D result](https://modelrift.com/models/pantheon-benchmark-antigravity-20-flash-35-high)
- 이 실행은 [Google이 I/O 2026에서 Antigravity 2.0을 출시](https://techcrunch.com/2026/05/19/google-launches-antigravity-2-0-with-an-updated-desktop-app-and-cli-tool-at-io-2026/)하고 [Gemini 3.5 Flash를 2026년 5월 19일 공개](https://deepmind.google/models/model-cards/gemini-3-5-flash/)한 직후인 2026년 5월 22일 추가됨
- 결과는 이 벤치마크에서 가장 좋은 **완전 자율 모델**이었고, Flash 3.5에 대한 초기 신호도 긍정적이었음
- Antigravity 2.0은 계획, 작업 실행, 미리보기를 갖춘 **에이전트 우선 데스크톱 앱**에 가까웠고, 이전 IDE 경험을 원한 사용자는 다운그레이드나 이전 앱 고정 외에 매끄러운 복귀 경로가 없어 출시 주간에 비판이 많았음
- Flash 3.5 High는 참고 이미지를 눈대중으로만 보지 않고 **실제 Pantheon 매개변수**를 검색함
- 계획과 코드는 로툰다, 돔, 포르티코, 오큘러스에 대해 명시적 치수를 사용하고 이를 파라메트릭 OpenSCAD 값으로 변환함
  ```text
  Implement a detailed, visually stunning, and dimensionally accurate 3D model of the Pantheon in Rome using OpenSCAD.
  ```
- Pantheon의 내부 구조도 반영하기 위해 **컷어웨이 모드**를 제안함
  ```text
  To showcase both the exterior (stepped rings, portico) and the interior (coffers, niches, perfect spherical proportion), I will include a toggle in the code `show_cutaway = false;`.
  ```
- 가장 강한 디테일은 천장이었음
  ```text
  The Pantheon dome interior has 5 rings of 28 coffers. Subtracting these mathematically in OpenSCAD is highly detailed and looks amazing.
  ```
- Antigravity는 자율 에이전트 중 유일하게 오큘러스를 통해 보이는 반복 사각 **코퍼 천장 패턴**을 구현함
- 외부 결과에는 빠른 OpenSCAD 출력에서 자주 생략되는 요소도 포함됨
  - 회색과 붉은색이 섞인 기둥 재질
  - 읽을 수 있는 비문
  - 계단식 지붕 링
  - 로툰다, 중간 블록, 포르티코, 돔 사이의 넓은 관계
- 품질 점수는 4.5/5, 속도 점수는 1/5였음
- 빠르지는 않았지만, 이 벤치마크의 **자율 생성 상한**을 끌어올렸고 Flash 3.5가 계획·렌더링·검사·수정 도구와 결합될 때 공간 코드 생성에 유망해 보임

### ModelRift / Gemini Flash 3.0
- [Explore 3D result](https://modelrift.com/models/pantheon-benchmark-modelrift-gemini-flash-30)
- 이 결과는 ModelRift와 Gemini Flash 3.0을 사용한 **휴먼 인 더 루프** 과정으로 만들어졌으며, 처음 네 개 실행처럼 자율 단일 패스 벤치마크가 아니었음
- 워크플로는 약 10분이 걸렸고 Claude Code 시간의 약 2배였기 때문에 같은 1/5 속도 점수를 받음
- 이 벤치마크는 Gemini 3.5 Flash 공개 직후인 2026년 5월 21일 실행됨
- Antigravity 결과는 3.5 Flash가 강하다는 점을 보였지만, ModelRift의 기본 모델 선택에서는 품질과 비용·지연 시간을 함께 고려해야 함
- [Google의 Gemini API 가격](https://ai.google.dev/gemini-api/docs/pricing)은 Gemini 3.5 Flash 표준 가격을 입력 100만 토큰당 1.50달러, 출력 100만 토큰당 9.00달러로 제시하며, Gemini 3 Flash는 입력 0.50달러, 출력 3.00달러로 제시함
- Gemini 3.5 Flash는 이전 Flash 세대 대비 **3배 비용 증가**이며, 더 오래된 Gemini 1.5 Flash 시대의 비용 기준보다 훨씬 높음
- 품질은 3.8/5로 기존 자율 실행 배치보다 좋았음
- 모델은 완벽하지 않았지만 포르티코, 기둥 배치, 지붕, 돔 리브, 전체 매스가 더 일관됐음
- 핵심 차이는 현재 렌더 위에 **시각 피드백**을 직접 붙일 수 있었다는 점이었음
- ModelRift 워크플로는 모델 생성, 브라우저 검사, 렌더 위 시각 노트 작성, AI에 OpenSCAD 수정 요청을 반복하도록 설계돼 있음
- 공간 CAD 작업에서는 이 루프가 **텍스트만으로 지시**하는 방식보다 훨씬 정밀함

### 주요 자율 실행 결과
- ## Codex 5.5 High
  - [Explore 3D result](https://modelrift.com/models/cube-with-six-face-holes)
  - Codex 5.5 High는 가장 **밀도 높은 모델**을 생성함
  - 포함 요소는 로툰다, 돔 리브, 오큘러스, 층층이 쌓인 석조 밴드, 전면 포르티코, 기둥, 주변 기단 디테일, 엔태블러처 텍스트였음
  - 엔태블러처에는 `M AGRIPPA L F COS TERTIVM FECIT`가 들어감
  - OpenSCAD에서 텍스트는 배치, 돌출, 방향 지정, 얇은 두께 유지가 필요해 모델링 관점에서 까다로운 요소임
  - 반복 중 렌더 미리보기는 최종 내보낸 STL보다 좋아 보였음
  - 최종 결과에서는 엔태블러처와 포르티코 지붕 영역에 문제가 있는 천장 같은 표면이 생겨 전면 조립부 인상이 달라짐
  - Codex는 강한 공간 추론과 높은 디테일 시도를 보였지만, **미리보기 정확성**이 최종 메시 정확성과 같지 않다는 내보내기 리스크도 드러냄
  - 공개된 STL이 아니라 가장 좋은 PNG 미리보기를 기준으로 했다면 Antigravity 2.0 바로 아래에 놓일 정도의 구조와 디테일이 있었음
  - 3.0/5 점수는 모델의 설계 의도보다 최종 내보내기·렌더링 불일치에 대한 벌점이 크게 작용함
- ## Claude Sonnet
  - [Explore 3D result](https://modelrift.com/models/pantheon-benchmark-sonnet-46)
  - Claude Sonnet은 기존 자율 실행 배치 중 가장 **깔끔한 모델**을 생성함
  - Codex만큼 미세 디테일을 시도하지는 않았지만, 실루엣이 더 깨끗하고 주요 건축 부품이 더 자연스럽게 맞물렸음
  - 돔, 드럼, 포르티코, 기둥 배치가 인접한 프리미티브 묶음이 아니라 하나의 건물로 읽힘
  - 비례도 더 절제되어 있었고, Antigravity 실행 이전에는 가장 강한 완전 자율 결과였음
  - Claude Code는 이 벤치마크에서 Codex보다 약 2~3배 느렸고, Sonnet은 좋은 품질에도 불구하고 최저 시간 점수를 받음
  - 품질 점수는 3.4/5로, 여전히 **프로덕션 품질의 건축 복원**이 아니라 근사 모델에 머무름
- ## Cursor Composer
  - [Explore 3D result](https://modelrift.com/models/pantheon-benchmark-cursor-and-composer-25)
  - Cursor와 Composer 2.5 조합은 가장 빠른 실행이었지만 결과는 가장 약했음
  - 로툰다, 돔, 포르티코, 기둥이라는 큰 제스처는 맞췄음
  - Pantheon을 알아볼 수 있게 만드는 **재질 절제**와 건축적 뉘앙스는 놓침
  - 출력은 완성 모델보다 단순화된 플레이스홀더에 가까웠고, 공개 전 재작업이 많이 필요한 수준이었음
- ## Claude Opus
  - [Explore 3D result](https://modelrift.com/models/pantheon-benchmark-claude-code-21-and-opus-47)
  - Claude Opus는 Cursor와 Sonnet 사이에 놓임
  - Cursor보다 더 완성된 건물을 만들었고 포르티코와 계단식 기단이 더 명확했음
  - 하지만 출력이 너무 균일하고 Sonnet보다 덜 설득력 있었음
  - 구조는 있었지만 **시각적 위계** 판단이 부족했음
  - 거의 모든 요소의 색과 무게가 같아 디테일이 시선을 안내하기보다 서로 경쟁함
  - 갱신된 점수는 3.0/5로, 첫 표 버전보다 더 높게 평가받을 만했지만 Sonnet과 Antigravity 뒤에 남음

### 핵심 교훈
- OpenSCAD는 대상 언어로 잘 버텼음
  - 문법이 작고 출력이 결정적이며, CLI가 반복 루프에서 검사 가능한 미리보기를 렌더링함
  - LLM들은 OpenSCAD 사용에 별도 손잡이가 필요하지 않았음
- 도구 사용은 병목이 아니었음
  - 모든 에이전트가 macOS `PATH`의 OpenSCAD를 호출하고 PNG 미리보기를 렌더링함
  - 어려운 부분은 배관이 아니라 **기하 판단**이었음
- 속도는 품질을 예측하지 못했음
  - Cursor는 가장 빨랐지만 가장 약한 결과를 냄
  - Sonnet은 기존 자율 실행 중 가장 오래 걸렸지만 가장 깨끗한 모델을 냄
  - Antigravity도 느렸지만 Gemini 3.5 Flash High가 계획과 반복 시간을 가진 뒤 최고의 자율 결과를 냄
  - ModelRift/Gemini Flash 3.0은 더 오래 걸렸지만, 시각 피드백 덕분에 기존 자율 배치보다 높은 품질에 도달함
- 미리보기와 내보내기는 같지 않음
  - Codex는 렌더 루프에서는 강해 보였지만 최종 STL에서 포르티코 지붕 주변 기하 문제가 생김
  - 프린트 대상 모델은 미리보기뿐 아니라 **내보낸 메시**를 별도로 검사해야 함
- 어떤 출력도 충실한 건축 모델로 통과할 수준은 아니었음
  - Codex의 비문은 좋은 디테일이었음
  - Sonnet의 비례는 일관적이었음
  - Antigravity의 코퍼 천장은 가장 놀라운 디테일이었음
  - ModelRift/Gemini Flash 3.0 결과는 사람이 시각적으로 조정할 때 품질이 어떻게 올라가는지 드러냄
- 두 장의 참고 이미지와 짧은 프롬프트만으로 모든 시스템이 직접 CAD 코드를 손으로 쓰지 않고도 유효하고 렌더 가능한 OpenSCAD에 도달함
- 도구 간 품질 차이는 컸지만, 출발선 자체는 예상보다 높았음
- 완전 자율 생성은 아직 이런 작업의 올바른 워크플로가 아님
  - ModelRift에서는 반복 작업에 여전히 **Annotation Mode**를 사용함
  - 3D 모델 스크린샷에 화살표와 노트를 직접 그려 AI에 되돌려주는 방식임
  - 공간 기하에서는 최상위 모델을 쓰더라도 휴먼 인 더 루프 단계가 중요함
  - 모델이 큰 매스는 맞춰도 기둥 위치나 돔 비례를 틀릴 수 있음
  - 렌더 위에서 문제를 직접 가리키는 방식이 텍스트로 설명하는 것보다 빠르고 정확함

<!-- USER:NOTES -->
## 내 메모
