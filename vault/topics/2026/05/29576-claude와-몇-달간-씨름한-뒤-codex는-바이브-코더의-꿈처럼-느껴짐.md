---
id: 29576
title: Claude와 몇 달간 씨름한 뒤 Codex는 바이브 코더의 꿈처럼 느껴짐
url: https://www.reddit.com/r/codex/comments/1tf4l2i/codex_feels_like_a_vibe_coders_dream_after_months/
domain: reddit.com
author: xguru
points: 23
comments_count: 9
posted_at: 2026-05-17T08:21:25+09:00
fetched_at: 2026-05-23T15:51:36.154Z
last_seen_at: 2026-05-23T15:51:36.154Z
tags: []
auto_tags:
  - domain/reddit.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- 3개월간 **Claude/Anthropic**으로 코딩했지만 repo 규모 작업에서 신뢰성이 낮아져 별도 감시 워크플로가 필요해짐
- **4.7 시기**에는 실제 구현이 약 40%인데 완료됐다고 환각하거나 stub/placeholder 주변에서 과도한 자신감을 보임
- Max x20 비용에도 생산성보다 **토큰 소비**와 감독 부담이 더 커졌고, 5월 12일 GPT-5.5 + Codex로 전환함
- Codex는 과도한 프롬프트 없이 **인접 코드**를 더 잘 이해하고 회귀를 잡아 lint/test 루프와 대규모 리팩터링이 관리 가능해짐
- 마이그레이션은 **CLAUDE.md→AGENTS.md** 이동과 hooks 유지 정도로 끝났고, 해당 워크플로에서는 되돌아갈 생각이 없음

---

### Claude에서 Codex로 전환한 뒤 달라진 개발 흐름
- 지난 3개월 동안 주로 **Claude/Anthropic**으로 코딩했으며, Opus 4.6 출시 당시에는 아키텍처 이해, 큰 컨텍스트 처리, 빠른 기능 구현이 강점으로 다가옴
- 시간이 지나며 **repo 규모 작업**에서 신뢰성이 낮아졌고, 모델을 감시하기 위한 별도 워크플로가 필요해짐
  - 인접 파일 회귀를 확인하는 여러 에이전트
  - 주요 커밋마다 붙는 “senior reviewer” 에이전트
  - 구현 드리프트와 미완성 구현을 확인하는 지속 검증
  - 모델이 완료됐다고 자신 있게 말한 작업을 잡아내는 lint/test 파이프라인
- **4.7 시기**에는 개인 워크플로에서 문제가 더 커짐
  - 실제 구현은 약 40% 수준인데 기능이 완료됐다고 환각함
  - stub/placeholder 주변에서 근거 없는 자신감을 보임
  - 현실적으로 가능한 변경에도 “별도 세션이 필요하다”거나 과도한 일정을 추정하는 회피 행동이 나타남
- Max x20 비용을 내고 있었지만 생산성 향상보다 **토큰 소비 증가**와 감독 부담 증가가 더 크게 다가옴
- 결국 5월 12일에 **GPT-5.5 + Codex**로 전환했고, AI 코딩이 몇 달 만에 스트레스보다 편안함에 가까워짐

### GPT-5.5 + Codex에서 체감한 장점
- Codex는 과도한 프롬프트 없이도 **인접 코드**를 잘 이해하고, 회귀를 더 잘 잡아냄
- lint/test 피드백 루프가 더 빡빡하게 작동하고, **대규모 리팩터링**도 실제로 관리 가능해짐
- 인프라 결정과 아키텍처 변경이 조각난 느낌보다 **일관된 방향**으로 이어지고, 완료된 척하기보다 실제로 작업을 끝내는 쪽에 가까움
- `/fast`는 주간 사용량을 빠르게 소진할 것 같아 대부분 피하지만, high/xhigh만으로도 생산성 향상이 컸음
- 전체 저장소 zip을 **GPT-5.5 Pro extended thinking**에 넣으면 다른 모델들이 반복해서 실패한 문제를 해결하는 데 도움이 됨
- 마이그레이션도 큰 마찰이 없었음
  - [`CLAUDE.md`](http://CLAUDE.md)가 [`AGENTS.md`](http://AGENTS.md)로 옮겨짐
  - hooks가 그대로 이어짐
  - 전체 워크플로는 거의 바꿀 필요가 없었음
- 모두가 즉시 옮겨야 한다는 뜻은 아니지만, 해당 워크플로에서는 당분간 되돌아갈 생각이 없음

<!-- USER:NOTES -->
## 내 메모
