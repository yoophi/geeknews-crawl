---
id: 29639
title: Codex의 Goals를 활용하는 법
url: https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex
domain: developers.openai.com
author: neo
points: 23
comments_count: 6
posted_at: 2026-05-19T09:18:01+09:00
fetched_at: 2026-05-23T15:51:25.144Z
last_seen_at: 2026-05-23T15:51:25.144Z
tags: []
auto_tags:
  - domain/developers.openai.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **Goals**는 Codex 스레드가 정의된 결과를 향해 여러 턴에 걸쳐 작업을 지속하도록 만드는 **영속적 목표(persistent objective)** 기능  
- 단일 프롬프트로 처리하기 어려운 **프로파일링, 패치, 벤치마킹, 플레이키 테스트 재현, 근거 기반 감사** 같은 작업에 적합  
- 결과(outcome), 검증 수단(verification surface), 제약(constraints)을 정의하면 Codex가 **증거 기반으로 완료 여부를 자체 판단**  
- `/goal`, `/goal pause`, `/goal resume`, `/goal clear` 명령으로 **수명주기 제어** 가능, Codex 0.128.0부터 지원  
- 스레드 범위로 제한된 **완료 계약(completion contract)** 구조이며, 무제한 자율 실행이 아닌 **사용자 통제 하의 지속성**이 핵심  
  
---  
  
### Goals의 정의와 도입 배경  
  
- Goals는 Codex에 **완료 조건(completion condition)** 을 부여하는 기능으로, 무엇이 참이어야 하는지, 성공을 어떻게 검사할지, 어떤 제약을 유지해야 하는지를 정의  
- Codex는 이미 저장소 점검, 버그 수정, 테스트 추가, 실패 설명, 집중된 변경 구현 같은 **범위가 명확한 코딩 작업**에 잘 동작  
- Goals는 다음 단계가 Codex가 도중에 학습한 내용에 따라 달라지는 작업에 적합  
  - 프로파일링, 패치, 벤치마킹, 플레이키 테스트 재현, 연구 질문을 증거 기반 감사로 전환하는 작업  
- 이러한 작업은 더 큰 프롬프트가 아니라 **영속적 목표**가 필요함  
- Goal이 활성화되면 매 중간 결과마다 목표를 다시 진술하지 않아도 Codex가 목표를 유지하고, 완료 여부를 평가하며, 다음 행동을 선택  
- Goal은 경계 없는 백그라운드 자율성이 아니라, **범위가 지정되고 사용자 통제하의 완료 계약**임  
  
### Quickstart: Goals 사용법  
  
- 종착점은 명확하지만 거기까지의 경로가 불확실한 작업에 Goal 사용  
  - 좋은 후보: 성능 최적화, 플레이키 테스트 조사, 의존성 마이그레이션, 재현이 필요한 버그 추적, 다단계 리팩토링, 벤치마크 기반 튜닝, 최종 산출물이 필요한 연구 작업  
  - 일회성 편집은 일반 프롬프트가 적합  
- ## 설치 및 버전 확인  
  - Goals는 **Codex 0.128.0**부터 사용 가능  
  - npm: `npm install -g @openai/codex@latest` 후 `codex --version`  
  - Homebrew: `brew update && brew upgrade --cask codex` 후 `codex --version`  
- ## Goal 설정 및 수명주기 명령  
  - `/goal <결과>` 형식으로 설정, 예: `/goal Reduce p95 latency below 120 ms without regressing correctness tests`  
  - `/goal`: 현재 Goal 보기  
  - `/goal pause`: 활성 Goal 일시정지  
  - `/goal resume`: 일시정지된 Goal 재개  
  - `/goal clear`: 현재 Goal 제거  
- ## 정지 조건(stopping condition)  
  - 성공, 일시정지, 제거, 중단, 예산 한도 도달, 사용자 입력이 필요한 블로커 발생 시 정지  
- "계속 진행해", "다음으로 가능한 수정 시도해봐", "벤치마크 다시 돌려봐", "이제 테스트 확인해" 같은 반복적 지시를 매 턴마다 해야 하는 상황에서 Goal이 그 의도를 명시적으로 표현  
  
### Goals vs 프롬프트  
  
- 일반 프롬프트: "이 다음 작업을 해라"  
- Goal: "이 결과가 참이 될 때까지 계속 작업해라"  
- ## 동작 차이  
  - 일반 요청에서 Codex는 즉각적 지시를 수행 후 결과를 보고하고 대기  
  - Goal에서는 스레드에 **지속적 목표(durable target)** 가 부착되어, 턴 종료 후 현재 증거를 검사하고 목표 충족 여부를 판단  
  - 충족되지 않고 Goal이 활성 상태이며 예산 내라면 최신 상태에서 작업 지속 가능  
- ## 예시: `/goal Reduce p95 checkout latency below 120 ms on the checkout benchmark while keeping the correctness suite green`  
  - 측정 가능한 결과, 검증 수단, 제약을 제공  
  - Codex는 벤치마크 실행 → 핫패스 검사 → 표적 변경 → 벤치마크 재실행 → 정확성 스위트 실행을 반복하며 결과가 부족하면 지속  
- ## 멘탈 모델  
  - 프롬프트: ask → work → result → wait  
  - Goal: work → check → continue or complete  
- Goal은 결승선을 제공하지만, 작업은 여전히 **증거에 대해 감사(audited against evidence)** 되어야 함  
  
### Goal 작성 방법  
  
- 좋은 Goal은 더 큰 프롬프트가 아니라, Codex가 어떻게 작업하고, 무엇이 성공이며, 성공에 도달하지 못할 때 어떻게 해야 하는지에 대한 **간결한 계약**  
- ## 강한 Goal이 정의하는 6가지 요소  
  - **Outcome**: 작업 완료 시 참이어야 할 것  
  - **Verification surface**: 이를 증명하는 테스트, 벤치마크, 보고서, 산출물, 명령 출력, 소스 자료  
  - **Constraints**: Codex 작업 중 회귀(regress)되어선 안 되는 것  
  - **Boundaries**: 사용 가능한 파일, 도구, 데이터, 저장소, 자원  
  - **Iteration policy**: 시도 후 다음에 무엇을 할지 결정하는 방식  
  - **Blocked stop condition**: 현재 한계 내에서 방어 가능한 경로가 없을 때 보고하고 정지하는 시점  
- ## 작성 패턴  
  - `/goal <원하는 종료 상태> verified by <구체적 증거> while preserving <제약>. Use <허용된 입력/도구/경계>. Between iterations, <다음 최선 행동 선택 방식>. If blocked or no valid paths remain, <보고할 내용과 진전을 위해 필요한 입력>.`  
- ## 약한 예시 vs 강한 예시  
  - 약함: `/goal Reduce p95 checkout latency below 120 ms without regressing correctness tests`  
  - 강함: 검증 수단(checkout benchmark), 사용 범위(checkout service, benchmark fixtures, 관련 테스트), 반복 정책(변경 내역·벤치마크 결과·다음 실험 기록), 블로커 보고 조건까지 명시  
- ## 연구·조사용 Goal  
  - 정확한 증명이 불가능할 수 있는 경우 작업 시작 전 **증거 표준(evidence standard)** 을 정의  
  - 예: `/goal Produce the strongest evidence-backed reproduction of the paper using the available materials and local resources. Attempt the headline results where feasible, verify outputs where possible, and end with a report that separates confirmed findings, approximate reconstructions, blocked claims, and remaining uncertainty.`  
- ## Goal 작성을 Codex에 위임  
  - 평이한 언어로 작업 설명 → Codex에 초안 Goal 작성 요청 → 성공 조건·검증 수단·제약·블로커 정지 조건을 다듬은 후 활성화하는 2단계 워크플로우 권장  
  
### Goal 활성 시 변하는 점  
  
- ## 목표가 계속 보임  
  - 테스트가 실패해도 스레드는 원래 목표를 유지  
  - 벤치마크가 개선되었지만 임계값에 못 미치면 Codex가 계속 진행  
  - 연구 경로가 데이터 부족에 부딪히면 연구 표준을 잃지 않고 증거 계획을 조정  
- ## 유휴 스레드에서 지속(continuation) 가능  
  - 다른 턴이 활성 중이거나, 사용자 입력이 큐에 있거나, 다른 스레드 작업이 대기 중일 때는 지속하지 않음  
  - 스레드가 유휴 상태이고 Goal이 활성이며 예산 내일 때만 지속  
- ## 완료는 증거 기반이어야 함  
  - 모델이 "아마 끝났을 것"이라고 믿는 것으로는 완료 처리 불가  
  - 관련 파일, 테스트, 로그, 벤치마크 출력, 생성된 산출물, 기타 구체적 증거에 대해 목표를 검사한 후에만 완료  
- 설계 핵심: Codex는 계속 움직일 수 있지만, **완료 여부는 증거가 결정**  
  
### Codex 내 Goals 설계 구조  
  
- Goals는 **스레드 범위의 영속 상태(persisted thread state)** 로 구현되며, 전역 메모리나 프로젝트 수준 지시사항이 아님  
  - 목표는 관련 컨텍스트(검사한 파일, 실행한 명령, 생성한 diff, 본 로그, 추론 기록)가 있는 스레드에 속함  
- ## 아키텍처 레이어  
  - 영속적·스레드 범위 상태로서 목표·수명주기·예산·진행 회계를 기록  
  - Goal 상태: active, paused, complete, budget-limited  
  - 상태에 따라 Codex가 계속할지, 사용자를 기다릴지, 새 작업 대신 진행 상황을 요약할지 결정  
- ## 지속(continuation)은 이벤트 기반  
  - 단순 루프가 아니며 안전 경계에서만 검사: 턴 종료 후, 대기 작업 없음, 사용자 입력 큐 없음, 스레드 유휴 상태  
  - 디스패처 동작은 보수적: 계획 전용 작업은 지속을 트리거하지 않음, 중단 시 목표 일시정지, 스레드 재개 시 적절하면 목표 복원, 지속 턴이 도구 호출을 하지 않으면 다음 자동 지속 억제(스핀 방지)  
- ## 프롬프팅 레이어  
  - 지속 프롬프트는 활성 목표 중심으로 Codex를 정렬시키되, 완료 전 감사 요구  
  - 목표를 구체적 증거(변경된 파일, 실행된 명령, 통과한 테스트, 벤치마크 출력, 생성 산출물, 연구 증거)와 비교  
- ## 예산(budget) 처리  
  - 예산 도달 시 실질 작업 중단, 진행 상황과 블로커 요약, 다음 유용 단계 식별  
  - 예산 한도 도달은 목표 완료와 동일하지 않음  
- ## 도구 계약(tool contract)  
  - 모델은 Goal 시작 가능, 증거가 완료를 뒷받침할 때만 기존 Goal을 완료로 표시 가능  
  - 일시정지·재개·제거·예산 한도 전환은 사용자 또는 시스템 통제 유지  
  
### 약한 Goal을 강한 Goal로 전환  
  
- ## 성능 튜닝 예시  
  - 약함: `/goal Improve performance`  
  - 강함: `/goal Reduce p95 latency below 120 ms on the checkout benchmark while keeping the correctness test suite green`  
  - 강한 버전은 결과·검증 방법·제약 제공, 중단하지 않아야 할 때를 인지 가능  
    - p95가 180ms→135ms로 개선되어도 Goal 미완료  
    - 지연이 120ms 미만이지만 정확성 테스트 실패 시 미완료  
    - 벤치마크 실행 불가 시 성공 선언 대신 블로커 표면화  
- ## Goal의 적정 범위  
  - 감사 가능할 만큼 좁고, 다음 행동을 선택할 수 있을 만큼 넓어야 함  
  - "Fix the failing checkout test"는 상류 의존성이 진짜 문제일 경우 너무 좁음  
  - "Improve the whole system"은 감사 표면이 없어 너무 넓음  
  - "Make the checkout test suite pass on the current branch without changing public API behavior"가 적절  
- ## 생성 산출물(generated artifacts)에 동일 원칙 적용  
  - 약함: `/goal Write docs for this feature`  
  - 강함: `/goal Produce a docs page for Goals that explains the lifecycle, command surface, and two examples. Verify that the page builds locally and that all referenced commands match the current CLI behavior.`  
  - 강한 버전은 검사 가능한 페이지·빌드 명령·명령 동작 제공  
- ## 연구 Goal의 증거 표준  
  - 조사 시작 전 정의: 정확한 재현, 부분 재구성, 프록시 지지, 블로커로 처리할 항목  
  - 강한 연구 Goal은 주장 인벤토리 구축, 주장-증거 매핑, 실행 가능한 부분 구현, 블로커 라벨링, 확인된 주장·지지 전용 증거·블로커 주장·남은 불확실성을 분리한 감사 생성 요구  
  
### 복합 연구에 Goals 활용: 퀀트 논문 재현 사례  
  
- ## 사례 개요  
  - 대상: Buehler, Gonon, Teichmann, Wood의 **Deep Hedging** 논문  
  - 논문 주제: 신경망 트레이딩 전략이 위험 선호, 거래 비용, 고차원 시장 설정에서 모델 기반 헤지를 재현할 수 있는지  
  - 올바른 Goal은 추상적 "논문 재현"이 아니라, 헤드라인 수치 주장 시도, 정확한 메커니즘과 근사적 학습 대체물 분리, 사용 가능한 자료로 정확한 재현이 불가능한 부분 명시  
- ## 약한 vs 강한 연구 Goal  
  - 약함: `/goal Reproduce Buehler et al., "Deep Hedging"`  
    - 어느 섹션이 중요한지, 무엇이 재현인지, 학습 상태 부재 처리 방법, 근사 일치와 정확 재생의 구분 기준 미정의  
  - 강함: `/goal Produce the strongest evidence-backed reproduction of Buehler et al., "Deep Hedging," using the available paper materials and local resources. Attempt every headline result, verify the outputs, and end with a report that separates reproduced mechanics, approximate trained results, blocked exact replay, and remaining uncertainty.`  
- ## Codex의 실제 작업 내용  
  - 헤드라인 주장과 지지 주장 분리  
  - 주장을 사용 가능한 증거에 매핑  
  - 로컬에서 테스트 가능한 부분 재구축  
  - 사용 가능한 자료로 정확히 재현할 수 없는 주장 라벨링  
- ## 실행 가능했던 부분  
  - 가격 책정 및 헤지 메커니즘 재구축  
  - Heston 참조 가격 재현  
  - CVaR 헤지 실험용 정책 학습  
  - 메인 히스토그램 및 헤지 표면 산출물 재구축  
  - Black-Scholes 거래 비용 기울기 재현  
  - Heston 거래 비용 및 고차원 예제에 대한 학습된 검사 실행  
- ## 블로커로 남은 부분  
  - 논문이 정확한 랜덤 시드, 생성된 학습 경로, TensorFlow 그래프, 옵티마이저 상태, 체크포인트, 전체 원본 시뮬레이션 상태를 제공하지 않음  
  - 가장 정직한 결과는 **부분적·근사적 재현**이며 정확한 신경망 재생은 아님  
- ## 보고서의 인식론적 지지 수준 보존  
  - 학습된 대체물은 주장을 지지할 수 있고, 근접한 수치 일치는 신뢰도를 높일 수 있으며, 재구축된 그림은 결과 일부를 검증할 수 있으나, 어느 것도 원본 실험을 정확히 복원했다고 기술해선 안 됨  
  - 원장(ledger) 예시:  
    - Claim: Deep hedging approximates complete-market Heston hedge without transaction costs  
    - Route: 모델 메커니즘 재구축, 참조 헤지 비교, 신경망 정책 학습  
    - Evidence surface: 가격 검사, 히스토그램, 헤지 표면  
    - Status: Close approximate reproduction  
    - Remaining uncertainty: 원본 학습 경로, 시드, 체크포인트 사용 불가  
- 연구에서 Goals의 시연 가치는 모호함 속에서 작업을 지속시키면서도 그럴듯한 산출물이 과대 주장된 결론이 되는 것을 방지하는 점, 완료의 의미를 **증거 기반 주장별 감사, 근사에 대한 명시, 재현과 재생 경계에 대한 정직함**으로 정의함  
  
### Goals를 사용하지 않아야 할 때  
  
- 한 줄 편집, 단순 설명, 짧은 코드 리뷰, 한 번의 답변 후 정지를 원하는 질문에는 부적합 → 일반 Codex 프롬프트가 적합  
- 결승선이 모호한 경우 부적합  
  - "Make this better"는 신뢰할 만한 완료 조건을 제공하지 않음  
  - "Refactor this code"도 예상 종료 상태·테스트·제약을 정의하지 않으면 약함  
- 불확실성을 숨기는 용도로 사용 금지  
  - 데이터가 사용 불가능할 수 있으면 Goal에 명시  
  - 벤치마크가 플레이키할 수 있으면 처리 방법 명시  
  - 프록시 증거가 허용되면 라벨링 방법 정의  
- Goals가 가장 강한 경우: **지속적 목표, 증거 기반 결승선, 여러 턴의 조사가 필요한 경로**의 세 속성이 결합된 작업  
  
### 결론: 목표는 지속시키되, 완료는 증거가 결정  
  
- Goals는 Codex의 운영 모델을 변경하여, 스레드를 고립된 프롬프트의 연속에서 정의된 결과를 중심으로 한 **상태 기반 작업 루프**로 전환  
- 아키텍처는 의도적으로 경계가 있음  
  - Goal은 스레드에 범위가 한정되고, 수명주기 상태와 예산 회계를 가지며, 일시정지·재개·제거·완료·예산 정지 가능  
  - Codex는 계속 움직일 수 있으나 사용자가 정의한 계약 내에서만 가능  
- 이미 Codex가 가장 가치 있는 작업, 즉 **디버깅, 최적화, 마이그레이션, 테스트, 연구**에 유용함  
- 사용자가 목표를 제공하고, Codex가 증거를 따라가며, Goal이 작업이 완료되거나 정직하게 블로킹될 때까지 양자를 연결  
- 복합 연구의 경우, 답을 생성하는 것과 **감사(audit)** 를 산출하는 것의 차이를 만들어냄  
- 좋은 Goal은 Codex에게 단순히 끝내라고 요청하는 것이 아니라, **끝났다는 것의 의미**를 알려주는 것

<!-- USER:NOTES -->
## 내 메모
