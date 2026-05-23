---
id: 29775
title: "LLM 아키텍처의 최근 동향: KV 공유, mHC, 그리고 압축 어텐션"
url: https://magazine.sebastianraschka.com/p/recent-developments-in-llm-architectures
domain: magazine.sebastianraschka.com
author: neo
points: 13
comments_count: 0
posted_at: 2026-05-23T09:15:02+09:00
fetched_at: 2026-05-23T15:50:27.076Z
last_seen_at: 2026-05-23T15:50:27.076Z
tags: []
auto_tags:
  - domain/magazine.sebastianraschka.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- 최근 공개된 오픈 웨이트 LLM들이 **장문 컨텍스트 효율성**에 집중하면서, KV 캐시 크기·메모리 트래픽·어텐션 비용을 줄이기 위한 **아키텍처 트릭**이 빠르게 늘어나는 중  
- Gemma 4는 **계층 간 KV 공유(cross-layer attention)** 와 **per-layer embeddings(PLE)** 로 KV 캐시와 파라미터 효율을 동시에 개선  
- Laguna XS.2는 레이어별로 **쿼리 헤드 수를 다르게 할당**하는 **layer-wise attention budgeting** 도입  
- ZAYA1-8B는 **Compressed Convolutional Attention(CCA)** 으로 압축된 잠재 공간에서 직접 어텐션 연산을 수행, KV 캐시뿐 아니라 어텐션 FLOPs까지 절감  
- DeepSeek V4는 **mHC(Manifold-Constrained Hyper-Connections)** 로 잔차 경로를 확장하고, **CSA/HCA** 로 시퀀스 길이를 압축해 1M 토큰 컨텍스트에서 V3.2 대비 FLOPs·KV 캐시를 대폭 절감  
  
---  
  
### 개요: 장문 컨텍스트 효율성에 집중하는 최신 아키텍처  
  
- 추론(reasoning) 모델과 에이전트 워크플로가 더 많은 토큰을 더 오래 유지하면서, **KV 캐시 크기·메모리 트래픽·어텐션 비용**이 주요 제약으로 부상  
- 4월~5월 공개된 주요 오픈 웨이트 모델에서 새로 등장한 설계 포인트  
  - Gemma 4: **KV sharing**과 **per-layer embeddings**  
  - Laguna XS.2: **layer-wise attention budgeting**  
  - ZAYA1-8B: **compressed convolutional attention**  
  - DeepSeek V4: **mHC + compressed attention**  
- 본문은 데이터 믹스, 학습 일정, 포스트 트레이닝, RL 레시피, 벤치마크는 다루지 않고 **트랜스포머 블록·잔차 스트림·KV 캐시·어텐션 연산** 내부 변화에 집중  
  
### 1. Gemma 4: 계층 간 KV 공유로 캐시 축소  
  
- Google이 4월 초 공개한 Gemma 4 제품군은 3가지 카테고리로 구성  
  - **Gemma 4 E2B/E4B**: 모바일·임베디드 디바이스(IoT)용 소형 모델  
  - **Gemma 4 26B MoE**: 효율적 로컬 추론에 최적화된 MoE 모델  
  - **Gemma 4 31B dense**: 최고 품질과 포스트 트레이닝 편의성을 위한 dense 모델  
- ## KV 공유(cross-layer attention) 도입  
  - 후반부 레이어가 자체 K/V 프로젝션을 계산하지 않고, **같은 어텐션 타입의 가장 가까운 이전 비공유 레이어의 KV 텐서를 재사용**  
  - 슬라이딩 윈도우 레이어는 이전 슬라이딩 윈도우 레이어와, full-attention 레이어는 이전 full-attention 레이어와 KV 공유  
  - 쿼리 프로젝션은 각 레이어가 자체 계산하므로 레이어별 어텐션 패턴은 유지  
  - Gemma 4 E2B는 35개 트랜스포머 레이어 중 **처음 15개만 자체 KV 계산**, 마지막 20개 레이어는 재사용  
  - Gemma 4 E4B는 42개 레이어 중 24개만 자체 KV 계산, 마지막 18개 재사용  
- ## 절감 효과  
  - 약 절반의 KV를 공유, **KV 캐시 크기 약 절반 절감**  
  - 128K 장문 컨텍스트(bfloat16) 기준 E2B는 **2.7 GB**, E4B는 **약 6 GB** 절감  
- ## 한계  
  - KV 공유는 일종의 근사로 **모델 capacity 감소**  
  - cross-layer attention 논문에 따르면 (테스트된 소형 모델에서는) 영향이 최소 수준  
- 개념 자체는 Brandon et al., "Reducing Transformer Key-Value Cache Size with Cross-Layer Attention" (NeurIPS 2024)에 기반, Gemma 4가 이를 **널리 알려진 아키텍처에서 처음으로 적용**한 사례  
  
### 2. Gemma 4 E2B/E4B의 Per-Layer Embeddings (PLE)와 "Effective" 사이즈  
  
- PLE는 KV 공유와 **별개의 효율성 설계**로, **파라미터 효율성**에 초점  
- ## "E"는 effective 의미  
  - Gemma 4 E2B: **2.3B effective parameters**, 임베딩 포함 시 5.1B  
  - Gemma 4 E4B: **4.5B effective parameters**, 임베딩 포함 시 8B  
  - 메인 트랜스포머 스택 연산은 작은 수치에 가깝고, 큰 수치는 추가 임베딩 테이블 레이어 포함  
- ## PLE 구조  
  - PLE 벡터는 반복되는 트랜스포머 블록 **외부에서 준비**  
  - 토큰 ID는 per-layer embedding lookup을 거치고, 일반 토큰 임베딩은 동일한 PLE 공간으로 선형 프로젝션  
  - 두 결과를 더하고 스케일링·reshape하여 **레이어별 슬라이스 하나씩 가진 텐서** 생성  
  - 각 레이어 l은 자신의 슬라이스(ple_l)만 수신  
- ## 트랜스포머 블록 내부 동작  
  - 어텐션과 피드포워드 잔차 업데이트를 일반대로 수행  
  - 두 번째 잔차 add 이후 hidden state z가 **레이어별 PLE 벡터를 게이팅**  
  - 게이팅된 PLE 벡터를 모델 hidden size로 다시 프로젝션·정규화 후 **추가 잔차 업데이트로 더함**  
- ## PLE의 목적  
  - 비싼 트랜스포머 블록은 작은 "effective" 사이즈에 가깝게 유지  
  - 추가 capacity는 **per-layer embedding 테이블**에 저장, 룩업 기반이라 어텐션·FFN 가중치 추가보다 훨씬 저렴  
  - 단순히 dense 모델을 작게 만드는 대안과 달리, **메인 연산부의 capacity를 희생하지 않음**  
- PLE가 원칙적으로 소형 모델에만 국한되지는 않으나, 대형 모델은 이미 capacity가 충분하고 MoE로 capacity 확장이 가능  
  
### 3. Laguna XS.2: Layer-Wise Attention Budgeting  
  
- Laguna는 코딩 응용 LLM에 집중하는 유럽 기반 회사 **Poolside**의 첫 오픈 웨이트 모델  
- ## 기본 구성  
  - 총 **40개 레이어**, 그중 **30개는 슬라이딩 윈도우 어텐션**, **10개는 global/full attention**  
  - 슬라이딩 윈도우 레이어 윈도우 크기: **512 토큰**  
  - 슬라이딩 윈도우 + global 혼합 패턴 자체는 Gemma 4 등 다른 아키텍처에서도 사용  
- ## 새로운 점: 레이어별 쿼리 헤드 수 차등화  
  - Hugging Face config.json의 `num_attention_heads_per_layer` 설정으로 레이어마다 다른 쿼리 헤드 수 지정 가능, KV 캐시 모양은 호환 유지  
  - **슬라이딩 윈도우 레이어: KV 헤드당 8개 쿼리 헤드**  
  - **Full attention 레이어: KV 헤드당 6개 쿼리 헤드**  
  - KV 헤드는 8개로 고정  
- ## 설계 의도  
  - 모든 레이어에 동일한 어텐션 예산을 부여하는 대신, **유용한 곳에 어텐션 capacity 집중**  
  - full-attention 레이어는 전체 컨텍스트를 보므로 비싸기 때문에 쿼리 헤드를 더 적게 할당  
- 레이어별 capacity 차등화 아이디어 자체는 적어도 Apple의 2024년 **OpenELM**까지 거슬러 올라가며, Laguna XS.2는 **프로덕션급 오픈 모델 중 가장 두드러진 최근 사례**  
- 부수적으로 Laguna는 **per-head attention-output gating** 도 적용 (Qwen3-Next 등과 유사)  
  
### 4. ZAYA1-8B: Compressed Convolutional Attention (CCA)  
  
- **Zyphra**가 개발한 오픈 웨이트 모델, **NVIDIA GPU나 Google TPU가 아닌 AMD GPU에서 학습**된 점이 특징  
- ## 구조  
  - config.json상 80개의 교대 레이어 항목, CCA/GQA 어텐션과 MoE 피드포워드가 번갈아 등장 (시각적으로는 40개 어텐션+MoE 쌍으로 표현)  
  - **4:1 GQA 레이아웃**과 함께 CCA 사용  
  - MoE는 매우 희소한 설정으로, **토큰당 라우팅 expert 1개만 활성**  
- ## CCA의 핵심  
  - MLA와 유사하게 어텐션 블록에 **압축된 잠재 표현** 도입  
  - 차이점: MLA는 잠재 표현을 주로 **KV 캐시 축소용**으로 사용하고, 실제 어텐션은 어텐션 헤드 공간으로 다시 프로젝션해 수행  
  - CCA는 Q, K, V를 모두 압축한 뒤 **압축된 잠재 공간에서 직접 어텐션 연산** 수행, 결과 어텐션 벡터는 다시 up-projection  
  - 결과적으로 **KV 캐시뿐 아니라 prefill·학습 시 어텐션 FLOPs까지 절감**  
- ## Convolutional Mixing  
  - "Convolutional"이라는 이름은 **압축된 K, Q 표현에 추가 convolutional mixing**이 들어가기 때문  
  - 압축은 Q, K, V를 좁게 만들어 연산·캐시 절감하지만, 어텐션 표현력을 떨어뜨릴 수 있음  
  - convolution은 압축된 Q, K에 **로컬 컨텍스트를 저렴하게 추가**하는 수단  
  - V에는 적용하지 않음 — Q, K는 어텐션 스코어를 결정하고, V는 그 스코어로 평균되는 콘텐츠이기 때문  
  - sequence mixing 외에 **channel mixing 컴포넌트**도 존재  
- ## 성능  
  - CCA는 ZAYA1-8B 기술 보고서보다 앞선 별도 논문 **"Compressed Convolutional Attention: Efficient Attention in a Compressed Latent Space" (2025년 10월)** 에서 도입  
  - CCA 논문 실험 기준, **동일한 압축 설정에서 MLA보다 우수**한 결과 보고  
  
### 5. DeepSeek V4: CSA/HCA, mHC, 압축 어텐션 캐시  
  
- DeepSeek V4는 올해 가장 큰 화제와 모델 규모를 보인 릴리즈, **DeepSeek V4-Pro는 active parameter 비중 기준 가장 희소한 MoE**  
- 본문은 이전 아키텍처 대비 새로운 두 핵심에 집중  
  - **mHC**: 더 넓은 잔차 경로  
  - **CSA/HCA**: 장문 컨텍스트 어텐션 압축·희소화  
  
- ## 5.1 Manifold-Constrained Hyper-Connections (mHC)  
  - 2025년 12월 31일 DeepSeek 팀 논문 "mHC: Manifold-Constrained Hyper-Connections" 기반, 당시 27B 규모에서만 실험되었으나 **이번 플래그십에 본격 적용**  
  - 트랜스포머 블록 내 **잔차 연결 설계를 현대화**하는 것이 목적 — 어텐션/정규화/MoE에 집중되던 변경과 차별화  
  - ## Hyper-Connections (HC) 배경  
    - Zhu et al. (2024) "Hyper-connections" 기반  
    - 단일 잔차 스트림을 **여러 병렬 잔차 스트림과 학습된 매핑**으로 대체  
    - 어텐션·MoE 레이어가 일반 hidden size로 동작하기 위해 **Pre Mapping**(병렬 스트림 → 하나의 hidden vector)과 **Post Mapping**(레이어 출력 → 병렬 스트림 분배) 추가  
    - 잔차 경로를 더 표현력 있게 만들면서 어텐션·MoE 자체는 넓히지 않음  
    - 7B OLMo MoE 실험에서 토큰당 FLOPs는 **13.36G → 13.38G**로 사실상 변화 없음, 학습 토큰 약 절반으로 baseline 성능 도달  
  - ## HC → mHC 변경점  
    - 일반 HC의 Res Mapping은 학습 가능한 행렬로, 여러 층을 거치며 신호 증폭·축소가 예측 불가  
    - mHC는 잔차 매핑을 **doubly stochastic matrices 매니폴드**에 사영 — 모든 항이 비음수, 각 행·열의 합이 1  
    - 잔차 혼합이 스트림 간 **안정적 정보 재분배** 처럼 동작  
    - Pre Mapping, Post Mapping도 비음수·유계로 제약, widened 잔차 상태 읽기/쓰기 시 상쇄 방지  
    - 더 깊은 모델일수록 중요해지는 **스케일링 안정성** 확보  
  - ## 비용  
    - 27B 모델 실험에서 DeepSeek 팀의 최적화 구현(fusion, recomputation, pipeline scheduling)으로 **n=4 잔차 스트림 사용 시 학습 시간 오버헤드 6.7%**  
  
- ## 5.2 CSA와 HCA를 통한 압축 어텐션  
  - 매우 긴 컨텍스트에서 어텐션 스코어 계산뿐 아니라 **KV 캐시가 시퀀스 길이에 비례해 커지는 문제** 해결이 목적  
  - DeepSeek V4는 두 압축 어텐션의 하이브리드 사용: **Compressed Sparse Attention (CSA)** 와 **Heavily Compressed Attention (HCA)**  
  - ## MLA와의 차이  
    - DeepSeek V2/V3의 MLA는 **토큰별 KV 표현을 압축**하되 토큰당 한 개의 잠재 KV 엔트리 유지  
    - CSA/HCA는 **시퀀스 차원을 따라 압축**, 여러 토큰 그룹을 더 적은 압축 KV 엔트리로 요약 → 캐시 자체가 짧아짐  
    - 토큰 단위 정보를 일부 포기하는 대신 **장문 컨텍스트 비용 대폭 절감**  
  - ## CSA vs HCA  
    - **CSA**: 약한 압축률(m=4) + **DeepSeek Sparse Attention (DSA) 스타일 top-k 선택**  
    - **HCA**: 강한 압축(m'=128, **128 토큰을 압축 KV 엔트리 1개로**) + 짧아진 캐시 위에서 **dense attention**  
    - 두 방식 모두 최근 비압축 토큰을 위해 **128 토큰 슬라이딩 윈도우 분기** 유지  
    - CSA는 디테일을 더 살리되 희소 선택, HCA는 엔트리를 크게 줄여 dense attention 가능 → **상호 보완적**이므로 DeepSeek V4는 두 레이어를 교차 배치  
  - ## 효율성 결과 (1M 토큰 컨텍스트, DeepSeek V3.2 대비)  
    - **DeepSeek V4-Pro**: 단일 토큰 추론 FLOPs **27%**, KV 캐시 크기 **10%**  
    - **DeepSeek V4-Flash**: FLOPs **10%**, KV 캐시 크기 **7%**  
  - ## 평가 주의점  
    - CSA/HCA가 MLA보다 일반적으로 "더 좋다"고 단정하기 어려움, **더 공격적인 장문 컨텍스트 설계이자 더 복잡**  
    - 논문에 ablation study 없음  
    - DeepSeek V4-Flash-Base가 다수 base 벤치마크에서 V3.2-Base를 능가하고 1M 토큰 retrieval에서 강한 결과를 보였으나, 이는 더 나은 데이터·Muon 기반 최적화·mHC·정밀도/저장 최적화·학습/추론 시스템 변경을 포함한 **전체 레시피 결과**  
  
### 6. 결론  
  
- 올해 새 오픈 웨이트 모델들의 공통 패턴은 **총 파라미터 수를 줄이지 않으면서 장문 컨텍스트 추론 비용을 낮추는 것**  
  - Gemma 4: **cross-layer KV sharing**으로 KV 캐시 축소, **per-layer embeddings**로 capacity 추가  
  - Laguna XS.2: 레이어별 어텐션 capacity 차등화  
  - ZAYA1-8B: 어텐션을 **압축 잠재 공간**으로 이동  
  - DeepSeek V4: 제약된 잔차 스트림 혼합 + 압축 장문 어텐션  
- 트랜스포머 블록은 여전히 변화 중이나 **타깃이 명확한 방식의 수정**, 기본 골격은 GPT decoder-only 아키텍처를 유지  
- 정성적 모델링 성능은 주로 **데이터 품질·양과 학습 레시피**가 견인  
- 현재까지는 **트랜스포머가 SOTA 아키텍처의 현상태(status quo)** 로 유지, diffusion 모델 등 대안 존재  
- 기본 트랜스포머 블록은 PyTorch 50~100줄로 구현 가능했으나, 최근 어텐션 변형 등으로 **코드 복잡도가 약 10배** 증가  
- 복잡도 증가 자체는 런타임 비용을 줄이므로 부정적이지만은 않으며, 개별 컴포넌트와 상호작용에 대한 **명확한 이해는 점점 어려워짐**  
- 학습 권장 접근: 원조 decoder-style LLM(GPT/GPT-2)에서 출발해 새 컴포넌트를 하나씩 추가해 가며 학습

<!-- USER:NOTES -->
## 내 메모
