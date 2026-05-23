---
id: 29719
title: TabPFN - 테이블 데이터를 위한 파운데이션 모델
url: https://github.com/PriorLabs/TabPFN
domain: github.com
author: xguru
points: 9
comments_count: 0
posted_at: 2026-05-21T09:46:01+09:00
fetched_at: 2026-05-23T15:51:05.173Z
last_seen_at: 2026-05-23T15:51:05.173Z
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
- **테이블(정형) 데이터 전용 파운데이션 모델**로, scikit-learn 스타일의 `fit`/`predict` 인터페이스로 분류·회귀 작업을 바로 수행 가능  
- 기본 모델 **TabPFN-2.6**은 순수 합성 데이터로 학습되었으며, 최초 사용 시 체크포인트를 자동 다운로드하여 **별도 학습 파이프라인 구성이 필요없음**  
- **데이터 전처리도 필요 없음**: 스케일링, 원-핫 인코딩 등을 적용하지 않고 원본 데이터를 그대로 입력해야 하며, 결측값도 자체 처리 가능  
- GPU 권장(~8GB VRAM 이상)이며, CPU에서는 약 **1,000개 샘플 이하**만 실행 가능하고, GPU 없는 환경을 위해 **TabPFN Client**(클라우드 추론) 제공  
- 배치 예측 필수: 개별 샘플마다 `predict` 호출 시 학습 세트를 매번 재계산하므로, **단일 호출 대비 약 100배 느림** — 테스트 세트는 1,000개 단위로 분할 권장  
- 최적 성능 범위는 **10만 샘플, 2,000 피처 이하**이며, 5만~10만 샘플은 `ignore_pretraining_limits=True` 설정, 10만 초과 시 Large Datasets Guide 적용  
- **TabPFN Extensions**로 SHAP 해석, 이상치 탐지, 합성 데이터 생성, 임베딩 추출, 하이퍼파라미터 최적화, Post-Hoc 앙상블 등 확장 기능 제공  
- HuggingFace에 **다수의 특화 체크포인트** 제공: 대규모 피처(최대 1,000), 대규모 샘플(3만+), 소규모 샘플(3K 미만), 실제 데이터 파인튜닝 버전 등  
- **Enterprise Edition**에서는 증류 엔진 기반 저지연 추론, 최대 1,000만 행 지원, 상용 라이선스 제공  
- 코드 없이 사용할 수 있는 **TabPFN UX**(노코드 그래픽 인터페이스)도 별도 제공  
- 코드는 Prior Labs License(Apache 2.0 + 귀속 요건), TabPFN-2.5/2.6 모델 가중치는 비상업적 라이선스

<!-- USER:NOTES -->
## 내 메모
