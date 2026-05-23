---
id: 29749
title: Utilyze - GPU가 실제로 유용한 작업을 얼마나 효율적으로 수행하는지 측정하는 도구
url: https://github.com/systalyze/utilyze
domain: github.com
author: xguru
points: 2
comments_count: 0
posted_at: 2026-05-22T09:31:03+09:00
fetched_at: 2026-05-23T15:50:52.108Z
last_seen_at: 2026-05-23T15:50:52.108Z
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
- `nvidia-smi`나 `nvtop`은 GPU에서 커널 실행 여부만 확인해, 실제 하드웨어 용량의 극히 일부만 쓰고 있어도 **100% 활용률을 표시**할 수 있음  
- Utilyze는 **GPU 성능 카운터를 직접 읽어** 실질적인 자원 사용량을 라이브로 보여주며, 오버헤드는 무시할 수 있는 수준  
- 워크로드·모델·하드웨어 조합에서 현실적으로 도달 가능한 최대 활용률인 **Attainable SOL 상한선**을 계산해, 현재 얼마나 더 밀어붙일 수 있는지 파악 가능  
- 실행 중인 추론 서버를 **자동 탐지**하여 각 GPU에 로드된 모델을 감지하며, 현재 백엔드는 **vLLM만 지원** (SGLang 등 추후 추가 예정)  
- 지원 하드웨어는 **NVIDIA Ampere 이상** (A100, H100, H200, B200, RTX 3000+), 현재 H100-80G 및 A100-80G에서 노드 내 최대 8 GPU 구성의 일부 모델 지원  
- Linux에서 프로파일링 서버를 실행하고 macOS/Windows에서는 **WebSocket 기반 원격 클라이언트**로 접속하는 구조  
- 단일 디바이스 ID는 하나의 인스턴스만 모니터링 가능 — NVIDIA **Perf SDK API**의 디바이스 접근 방식 제약  
- sudo 없이 실행하려면 `NVreg_RestrictProfilingToAdminUsers=0` 설정 후 재부팅 필요  
- Apache-2.0 라이선스

<!-- USER:NOTES -->
## 내 메모
