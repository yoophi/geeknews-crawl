---
id: 29613
title: whichllm - 내 하드웨어에서 실제로 돌아가고 최고 성능을 내는 로컬 LLM 찾기
url: https://github.com/Andyyyy64/whichllm
domain: github.com
author: xguru
points: 65
comments_count: 3
posted_at: 2026-05-18T10:06:01+09:00
fetched_at: 2026-05-23T15:51:29.142Z
last_seen_at: 2026-05-23T15:51:29.142Z
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
- **파라미터 수가 아닌 실측 벤치마크 기반**으로 사용자 하드웨어에 맞는 로컬 LLM을 자동 추천하는 CLI 도구  
- GPU/CPU/RAM을 자동 감지하고 HuggingFace 모델 중 시스템에 맞는 **상위 모델을 랭킹**으로 제시  
  - NVIDIA, AMD, Apple Silicon, CPU-only 모두 지원  
- VRAM에 맞는 가장 큰 모델이 아니라, **그 중 실제로 가장 좋은 모델**을 골라주는 것이 핵심 목표  
  - 예: RTX 4090 시뮬레이션 시 32B 모델이 들어가도, 신세대인 27B 모델(Qwen3.6-27B)을 1위로 추천  
- **다중 벤치마크 병합 채점**: LiveBench, Artificial Analysis, Aider, multimodal/vision, Chatbot Arena ELO, Open LLM Leaderboard를 통합해 0–100 점수 산출  
- **최신 모델 인식(Recency-aware)**: 오래된 리더보드는 모델 계보를 따라 감점, 2024년 모델이 구버전 점수로 현세대 모델을 추월하지 못하도록 차단  
- **근거 등급화 5단계** - `direct` / `variant` / `base_model` / `line_interp` / `self_reported`로 태그 후 신뢰도 디스카운트  
  - 업로더의 허위 자체 보고와 작은 포크가 큰 베이스 점수를 빌려오는 크로스 패밀리 상속도 차단  
  - 파라미터가 패밀리 dominant member에서 2배 이상 차이나면 상속 거부  
- **아키텍처 인식 VRAM/속도 추정** - VRAM은 가중치 + GQA KV 캐시 + 활성화 + 오버헤드, 속도는 대역폭 바운드에 MoE active vs total 분리와 통합 메모리 vs PCIe 부분 오프로드 반영  
- `whichllm run` 한 줄로 모델 다운로드와 채팅까지 즉시 실행 가능한 **원커맨드 워크플로우** 지원  
  - `uv`로 격리 환경 생성, 의존성 설치, 모델 다운로드, 대화형 채팅까지 자동 처리  
  - GGUF / AWQ / GPTQ / FP16 / BF16 모든 포맷 지원  
- **하드웨어 플래닝 명령**  
  - `whichllm --gpu "RTX 5090"` - 임의 GPU 시뮬레이션으로 구매 전 확인  
  - `whichllm plan "llama 3 70b"` - 특정 모델에 필요한 GPU 역방향 조회  
  - `whichllm upgrade "RTX 4090" "RTX 5090" "H100"` - 현재 머신과 후보 GPU 비교  
- **Ollama 연동**: `whichllm --top 1 --json | jq -r '.models[0].model_id'` 형태로 파이프라인 구성 가능  
- **코드 스니펫 출력**: `whichllm snippet "qwen 7b"`로 `llama_cpp.Llama.from_pretrained` 호출부터 채팅 완성까지 복붙 가능한 Python 코드 제공  
- MIT 라이선스

<!-- USER:NOTES -->
## 내 메모
