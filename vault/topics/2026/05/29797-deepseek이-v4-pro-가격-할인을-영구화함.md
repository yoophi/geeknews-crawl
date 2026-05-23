---
id: 29797
title: DeepSeek이 V4 Pro 가격 할인을 영구화함
url: https://api-docs.deepseek.com/quick_start/pricing
domain: api-docs.deepseek.com
author: neo
points: 1
comments_count: 1
posted_at: 2026-05-23T21:51:15+09:00
fetched_at: 2026-05-23T15:49:38.944Z
last_seen_at: 2026-05-23T15:49:38.944Z
tags: []
auto_tags:
  - domain/api-docs.deepseek.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **DeepSeek-V4-Pro** API 가격은 75% 할인 프로모션 종료 뒤에도 공식적으로 기존 가격의 **1/4** 수준으로 유지됨
- 과금은 100만 토큰당 가격을 기준으로 하며, **입력 토큰과 출력 토큰** 사용량에 따라 잔액에서 직접 차감됨
- 지원 모델은 **DeepSeek-V4-Flash**와 DeepSeek-V4-Pro이며, 둘 다 비사고 모드와 사고 모드를 지원하고 기본값은 사고 모드임
- 두 모델 모두 **컨텍스트 길이**는 1M, 최대 출력은 384K이며, 동시성 제한은 Flash 2500, Pro 500으로 다름
- 모든 모델의 **입력 캐시 적중 가격**은 출시 가격의 1/10로 낮아졌고, 조정은 2026년 4월 26일 12:15 UTC부터 적용됨

---

### 과금 기준
- **가격 단위**는 100만 토큰당 요금이며, 토큰은 모델이 인식하는 가장 작은 텍스트 단위로 단어, 숫자, 문장부호가 될 수 있음
- **청구 기준**은 모델의 입력 토큰과 출력 토큰 총량임
- 비용은 `토큰 수 × 가격`으로 계산되며, 충전 잔액 또는 지급 잔액에서 직접 차감됨
- 충전 잔액과 지급 잔액이 모두 있으면 **지급 잔액**이 먼저 사용됨
- 제품 가격은 변동될 수 있으며, DeepSeek은 가격 조정 권리를 보유함
- 실제 사용량에 맞춰 충전하고, 최신 가격은 해당 페이지에서 정기적으로 확인하는 방식이 권장됨

### 모델과 가격
- ## 지원 모델
  - **DeepSeek-V4-Flash**와 **DeepSeek-V4-Pro**가 제공됨
  - 두 모델 모두 비사고 모드와 사고 모드를 지원하며, 기본값은 사고 모드임
  - `deepseek-chat`과 `deepseek-reasoner` 모델명은 향후 폐기될 예정임
  - 호환성을 위해 `deepseek-chat`은 `deepseek-v4-flash`의 비사고 모드에, `deepseek-reasoner`는 `deepseek-v4-flash`의 사고 모드에 각각 대응함
- ## 엔드포인트와 기능
  - Anthropic 형식 Base URL은 [https://api.deepseek.com/anthropic](https://api.deepseek.com/anthropic)임
  - 사고 모드 전환 방법은 [Thinking Mode](https://api-docs.deepseek.com/guides/thinking_mode)에서 확인 가능함
  - 관련 기능 문서로 [Json Output](https://api-docs.deepseek.com/guides/json_mode), [Tool Calls](https://api-docs.deepseek.com/guides/tool_calls), [Chat Prefix Completion（Beta）](https://api-docs.deepseek.com/guides/chat_prefix_completion), [FIM Completion（Beta）](https://api-docs.deepseek.com/guides/fim_completion)가 제공됨
- ## 컨텍스트와 출력 한도
  - **컨텍스트 길이**는 1M임
  - **최대 출력**은 384K임

### 100만 토큰당 가격
| 항목 | DeepSeek-V4-Flash | DeepSeek-V4-Pro |
|---|---:|---:|
| 입력 토큰, 캐시 적중 | $0.0028 | $0.003625 |
| 입력 토큰, 캐시 미스 | $0.14 | $0.435 |
| 출력 토큰 | $0.28 | $0.87 |
| 동시성 제한 | 2500 | 500 |

- ## DeepSeek-V4-Pro 할인 조정
  - **DeepSeek-V4-Pro** 가격은 75% 할인 가격으로 표시됨
  - 캐시 적중 입력 토큰 가격은 기존 $0.0145에서 $0.003625로 낮아짐
  - 캐시 미스 입력 토큰 가격은 기존 $1.74에서 $0.435로 낮아짐
  - 출력 토큰 가격은 기존 $3.48에서 $0.87로 낮아짐
  - 75% 할인 프로모션이 2026년 5월 31일 15:59 UTC에 종료된 뒤에도 DeepSeek-V4-Pro API 가격은 공식적으로 기존 가격의 **1/4**로 조정됨
- ## 캐시 적중 가격 인하
  - 모든 모델의 **입력 캐시 적중 가격**은 출시 가격의 1/10로 인하됨
  - 이 가격 조정은 2026년 4월 26일 12:15 UTC부터 적용됨
- ## 동시성 제한
  - DeepSeek-V4-Flash의 동시성 제한은 2500임
  - DeepSeek-V4-Pro의 동시성 제한은 500임
  - 동시성 제한의 자세한 내용은 [Rate Limit & Isolation](https://api-docs.deepseek.com/quick_start/rate_limit)에서 확인 가능함

<!-- USER:NOTES -->
## 내 메모
