---
id: 29779
title: "SSH에서 REST로: 보안 중심의 Slack EMR 데이터 파이프라인 현대화"
url: https://slack.engineering/from-ssh-to-rest-a-security-driven-modernization-of-slacks-emr-data-pipelines/
domain: slack.engineering
author: neo
points: 1
comments_count: 0
posted_at: 2026-05-23T09:24:01+09:00
fetched_at: 2026-05-23T15:50:23.071Z
last_seen_at: 2026-05-23T15:50:23.071Z
tags: []
auto_tags:
  - domain/slack.engineering
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- Slack 데이터 플랫폼에는 **700개 이상의 SSH 기반 Operator**가 일일 검색 인덱싱, 분석 작업 등 핵심 데이터 파이프라인을 운영, 모든 작업이 프로덕션 AWS EMR 클러스터에 **직접 SSH 접속**을 요구해 광범위한 보안 위협 표면 형성  
- 이 SSH 의존성은 보안 위험뿐 아니라 **Spark on Kubernetes, EMR on EKS 전환, Whitecastle 이니셔티브 완료** 등 인프라 현대화를 가로막는 핵심 장애물로 작용  
- 해결책으로 **YARN Distributed Shell**을 활용해 임의의 셸 명령까지 YARN 컨테이너에서 실행 가능하게 만들고, Slack 자체 REST 게이트웨이 **Quarry**를 통해 모든 잡 제출을 통합  
- **8개 데이터 리전에 걸쳐 무중단(zero downtime)으로 700개 이상 잡을 마이그레이션**, 3분기 만에 100% SSH 제거 완료  
- 결과적으로 **공격 표면 축소, 작업 신뢰성 향상, 가시성 개선**과 함께 **Whitecastle 완수 및 Spark on Kubernetes 등 차세대 인프라 기반** 확보  
  
---  
  
### 배경: SSH 기반 데이터 플랫폼의 형성  
- 2017년경 구축된 Slack 데이터 플랫폼은 Airflow가 EMR 클러스터에서 잡을 실행하기 위한 가장 직접적 경로로 **SSH 방식 채택**  
  - `SSHOperator`로 EMR 마스터 노드에 접속 후 `spark-submit` 같은 명령 실행  
- 이후 팀들이 다양한 용도(Spark뿐 아니라 MapReduce, AWS CLI, 커스텀 Python 스크립트)에 맞춰 **커스텀 SSH 기반 Operator를 자체 제작**  
- 결과적으로 프로덕션 환경에 **700개 이상의 SSH 기반 잡 누적**  
  
### SSH 방식의 실제 비용  
- ## 잠재적 보안 위험  
  - 컴퓨트 클러스터로의 직접 SSH 접속이 **공격 표면 확대**  
  - 오케스트레이션 워커 전반에 걸친 **키 배포 및 회전**으로 운영 부담 증가  
  - 세분화된 감사를 위해 **여러 시스템 로그 상관 분석 필요**  
  - **전용 보안 그룹과 커스텀 설정** 등 권한 관리 복잡화  
- ## 운영 측면의 문제  
  - 잡이 분산되지 않고 EMR 마스터 노드에서 직접 실행되어 **리소스 경합 발생**  
  - Kubernetes Pod 재시작 시 **SSH 연결 단절로 잡 실패**  
  - 장시간 잡이 연결 종료 후에도 실행되어 **좀비 프로세스화**  
  - 연결 끊김 시 **잡 성공/실패 여부 확인 불가**  
- ## 현대화 차단 요소  
  - Spark on Kubernetes 및 EMR on EKS 진입 불가 (**SSH 의존성 제거 선행 필요**)  
  - 마지막 메인 계정 EMR 클러스터를 자식 계정으로 옮기지 못해 **Whitecastle 이니셔티브 미완료**  
    - Whitecastle은 보안 및 네트워크 격리 강화를 위해 AWS 인프라를 자식 계정으로 이전하는 Slack의 이니셔티브  
  - 적절한 **잡 모니터링과 가시성 구현 불가**  
- ## 대표 사례 — Search Infrastructure 팀  
  - 테라바이트 데이터로 일일 Solr 검색 인덱스를 빌드하는 파이프라인, Slack 검색 기능의 핵심  
  - SSH 기반 잡 제출에 의존해 위 신뢰성 문제 모두 노출  
  
### REST 기반 잡 제출의 기본 개념  
- ## SSH의 본질적 한계  
  - SSH 접속은 **상태 유지형 직접 연결**, Pod 재시작 등으로 연결 끊기면 명령이 계속 실행되거나 실패, 또는 고아 프로세스가 잔존  
  - 재접속해 상태 확인할 신뢰성 있는 수단 부재  
- ## REST 대안  
  - YARN, Trino, Snowflake 등 현대 컴퓨트 엔진은 **HTTP API로 잡 제출 지원**  
    - **POST** 잡 요청 → 잡 ID 반환  
    - **GET** 잡 상태 조회 → 실행/완료/실패 확인  
    - **DELETE** 잡 → 정상 취소  
  - 잡 수명주기를 **서버 측에서 관리**, 클라이언트가 재시작해도 잡은 계속 실행되며 상태 조회 가능  
- ## YARN의 역할과 한계  
  - Hadoop 워크로드(MapReduce, Spark, Hive)는 YARN이 리소스 매니저이자 REST API 제공  
  - 그러나 `aws s3 sync`, `hadoop distcp` 등 임의 셸 명령을 실행하는 **300개 이상 CLI 기반 잡은 즉시 사용 가능한 REST API 부재**  
  - 이를 해결한 핵심이 **YARN Distributed Shell**  
  
### 돌파구: YARN Distributed Shell  
- Spark는 Livy REST API, Hive는 HiveServer2가 있어 마이그레이션이 비교적 단순  
- 반면 MapReduce 잡과 300개 이상 CLI 기반 잡은 **즉시 사용 가능한 REST API가 없어 난제**  
- ## 요구 사항  
  - 아키텍처에 자연스럽게 맞는 **단순한 REST 기반 솔루션**  
  - **기존 인증/인가 메커니즘 활용** (커스텀 보안 계층 불필요)  
  - 독점 솔루션이 아닌 **오픈소스 프로토콜(표준 YARN API)** 활용  
  - **최소한의 복잡도**로 커스텀 잡 실행 인프라 구축·운영 회피  
- ## 검토 후 폐기된 방안  
  - 원격 명령 실행용 **커스텀 래퍼 서비스 구축**  
  - **Ansible, Salt** 등 원격 실행 프레임워크 사용  
  - **YARN에 새로운 잡 타입을 처음부터 추가**  
  - 모두 과도한 복잡도, 커스텀 보안 구현, 신규 의존성 도입 등의 문제로 부적합  
- ## YARN Distributed Shell 발견  
  - `org.apache.hadoop.yarn.applications.distributedshell.ApplicationMaster`로 **임의의 셸 스크립트를 YARN 컨테이너 안에서 실행** 가능  
  - 이미 YARN에 포함된 기능으로 동일한 REST API 사용, **커스텀 보안 계층 불필요**  
- ## 동작 방식  
  - **1. 명령 스크립트를 S3에 업로드** (예: `aws s3 sync /tmp/data/ s3://bucket/output/`)  
  - **2. Distributed Shell 설정으로 YARN에 제출**  
    - `application-type`을 `MAPREDUCE`로 지정, `am-container-spec`에 `DISTRIBUTEDSHELLSCRIPTLOCATION`, `DISTRIBUTEDSHELLSCRIPTLEN`, `DISTRIBUTEDSHELLSCRIPTTIMESTAMP` 등 환경변수 포함  
  - **3. YARN이 컨테이너 할당, 스크립트 다운로드 후 실행**  
    - YARN이 메모리/vCore 등 **리소스 제한**, 컨테이너 격리, 재시도와 장애 허용, 정상 취소, YARN UI 기반 로깅 관리  
- 이 결정으로 Hadoop 워크로드뿐 아니라 `aws s3 sync`, `hadoop distcp`, 커스텀 Python 스크립트까지 **모두 YARN 컨테이너에서 실행 가능**  
  
### 솔루션: Quarry  
- Quarry는 EMR/YARN, Trino, Snowflake 등 다중 컴퓨트 엔진에 잡을 제출하기 위해 만들어진 **Slack의 REST 기반 잡 제출 게이트웨이**  
- 이미 인증, 신뢰성, 가시성 문제를 해결한 상태였고, **SSH 폐기에 정확히 부합**  
- ## Quarry의 기능  
  - **인증**: SSH 키 대신 서비스 간 토큰 사용  
  - **잡 제출**: YARN, Trino, Snowflake에 REST API로 전송  
  - **상태 추적**: 잡 상태를 서버 측에서 모니터링  
  - **수명주기 관리**: REST API 기반 정상 취소 및 정리  
  - **가시성**: 모든 잡 제출에 대한 구조화된 로그, 메트릭, 트레이싱 제공  
- ## 아키텍처 변화  
  - 이전: `Airflow → SSH Connection → EMR Master Node → Execute Command`  
  - 이후: `Airflow → Quarry REST API → YARN ResourceManager → EMR Container`  
  - Airflow Operator는 SSH 연결 대신 Quarry에 HTTP 요청, Quarry가 YARN에 제출 후 상태 폴링  
  - **Airflow Pod 재시작에도 잡은 유지**, Quarry가 연결 보존  
- ## Quarry의 강점  
  - YARN Distributed Shell 지원으로 **범용 잡 제출 게이트웨이화**  
  - Spark 잡, Hive 쿼리, 셸 스크립트 모두 동일한 REST API 경유  
  - SSH 자격증명, 클러스터 직접 접근 모두 제거, **인증·서버 측 잡 추적이 포함된 REST 호출만 사용**  
  
### 마이그레이션 여정  
- 8개 독립 데이터 리전에 걸친 700개 이상 프로덕션 잡, 각기 다른 네트워크 구성과 데이터 주권 요구사항, 검색 인덱싱 등 무중단 필수 워크로드 존재로 **체계적 계획 필요**  
- ## 단계별 접근  
  - **Phase 1 – 개념 증명(PoC)**: 파일럿 잡으로 Quarry 기반 접근 검증, 첫 Quarry Operator 개발 후 dev 환경 테스트  
  - **Phase 2 – 보안 검토**: 보안 팀과 협업해 자격증명 제거 계획 수립, REST 기반 접근이 보안 요건 충족하는지 검증  
  - **Phase 3 – OKR 기반 실행**: Key Result로 지정해 경영진 가시성 확보, 이 단계에서 **80% 마이그레이션 마일스톤 달성**  
  - **Phase 4 – 대량 마이그레이션**: Search Infrastructure, Data Engineering & Analytics, ML Services 등 여러 팀이 병렬로 잔여 워크로드 전 리전 이전  
  - **Phase 5 – 최종 정리**: 누락된 DAG 완료, **모든 레거시 SSH Operator 폐기, 100% 달성**  
- ## 마이그레이션 수치  
  - 7개 Operator 유형에 걸쳐 **700개 이상 잡 이전**  
  - 조율된 롤아웃으로 **8개 독립 데이터 리전 적용**  
  - **5개 팀이 새 Operator로 전환**  
  - 비즈니스 핵심 서비스 **무중단**  
  - 초기 파일럿부터 100% SSH 제거까지 **3분기에 완료**  
  
### 마이그레이션 중 직면한 도전들  
- ## Challenge 1 — Virtual Memory Check 실패  
  - 데이터 export DAG 마이그레이션 중 SSH에서 정상이던 잡이 **vmem 체크 오류로 실패**  
  - **원인**: SSH는 마스터 노드에서 직접 실행되어 YARN 리소스 강제를 우회, Quarry는 잡을 정상적으로 YARN에 제출하므로 가상 메모리 한도 초과 컨테이너가 거부됨  
  - **해결**: AWS 모범 사례에 따라 전 클러스터에서 vmem 체크 비활성화 — `"yarn.nodemanager.vmem-check-enabled": "false"`  
    - Linux 가상 메모리 회계가 신뢰할 수 없고, 물리 메모리 한도로 충분하다는 AWS 권고에 부합  
  - **교훈**: SSH는 다수의 문제를 가려왔으므로, 정상 YARN 제출로 전환 시 **이전엔 안 보이던 리소스 한도 이슈 발생 예상 필요**, dev 환경에서 충분히 테스트  
- ## Challenge 2 — 네트워크 분리와 EKM 연결 문제  
  - dev 검색 인프라 잡을 dev 클러스터에서 staging 분석 클러스터로 이전 시 **EKM(Enterprise Key Management) 연결 타임아웃 발생**  
  - 오류: `Unable to execute HTTP request: Connect to sts.amazonaws.com:443 failed: connect timed out`  
  - **원인**: 원래 클러스터는 키 관리 엔드포인트로의 네트워크 라우팅이 구성돼 있었으나, **더 엄격한 네트워크 세그먼트에 있는 staging 분석 클러스터는 동등한 연결성 미보유**, 잡 설정에 명시되지 않은 네트워크 토폴로지 종속성 노출  
  - **해결**: 검색 인프라 작업을 dev 서비스로 라우팅이 가능한 dev ETL 클러스터로 이동, 프로덕션 Hive 카탈로그가 필요한 작업은 staging 유지, dev ETL 클러스터를 스케일업해 추가 워크로드 수용  
  - **교훈**: **네트워크 토폴로지가 매우 중요**, 어떤 클러스터에서 어떤 잡을 돌릴지 결정 전 네트워크 분리·계정 경계를 이해해야 함  
- ## Challenge 3 — 멀티 리전 복잡성  
  - 데이터 주권 요구로 **8개 독립 데이터 리전에서 EMR 클러스터 운영**, SSH 폐기는 사실상 **8개 병렬 마이그레이션**  
  - ### 복잡성 요소  
    - **설정 관리**: 리전마다 별도 Quarry 설정, 클러스터 엔드포인트, 네트워크 라우팅 규칙 필요  
    - **테스트 부담**: 모든 코드 변경을 8개 리전 전체에서 검증  
    - **순차 배포**: 동시 배포 불가, 리전 단위 점진 롤아웃  
    - **리전별 이슈**: 네트워크 구성, 데이터 주권 규칙, 클러스터 버전 차이  
  - ### 대응 방식  
    - 단일 파일럿 리전(주로 US 기반)에서 검증  
    - 리전별 설정 요구사항 문서화  
    - **리전 인식 가능한 Quarry Operator 구축**  
    - 점진적 롤아웃과 리전별 학습 반영  
    - 리전별 마이그레이션 진행 상황 별도 추적  
  - **교훈**: 멀티 리전 인프라는 단순히 N배가 아니라 **리전별 고유 장애 모드까지 N배 어려움**, 교차 리전 조율과 리전별 디버깅에 충분한 시간 배정 필요  
  
### 결과  
- **100% SSH 제거 달성**, 모든 프로덕션 잡이 Quarry를 통한 REST 기반 제출로 전환  
- ## 보안적 성과  
  - 8개 독립 데이터 리전 전 프로덕션 EMR 클러스터에서 **SSH 접근 제거**, 공격 표면 대폭 축소  
  - SSH 키 배포를 **서비스 간 토큰 인증으로 대체**, REST API 로깅으로 정상적 감사 추적 확보  
  - 모든 잡 제출이 Quarry를 통한 **구조화 로그 보유**  
  - 마지막 AWS 메인 계정 EMR 클러스터를 자식 계정으로 이전, **Whitecastle 이니셔티브 완수**  
  - 특수 보안 그룹과 복잡한 권한 관리 제거로 **컴플라이언스 단순화**  
- ## 운영적 개선  
  - 마스터 노드 리소스 경합 제거, 모든 비 Hadoop 잡이 **분산 YARN 컨테이너에서 적절한 리소스 할당**으로 실행  
  - 클라이언트 Kubernetes Pod 재시작에도 잡이 유지되어 **잡 신뢰성 대폭 향상**, 좀비 프로세스 사라짐, REST API 통한 정상 종료 가능  
  - Quarry API로 **구조화된 잡 상태/로그/메트릭** 제공, 잡 수명주기 전체 추적과 YARN 컨테이너 로그 확인, 적절한 도구로 디버깅 가능  
- ## 미래 기반 확보  
  - SSH 의존성 제거로 **Spark on Kubernetes 마이그레이션 가능**  
  - REST 기반 아키텍처가 **클라우드 네이티브 관행과 정합**  
  - 복잡한 SSH 설정 대비 **단순하고 유지보수 쉬운 Quarry Operator**로 팀 온보딩 용이  
  - Airflow를 EMR 인프라 세부사항과 **디커플링**  
  - **모든 잡 제출을 Quarry로 표준화**, 향후 변경 용이  
- 완료 후 2년의 프로덕션 운영을 통해 아키텍처 결정의 타당성 검증, 보안·운영 안정성·인프라 유연성 모두 개선  
  
### 학습된 교훈  
- ## 잘 작동한 점  
  - **점진적 마이그레이션**: Dev → GovDev/CommDev → Prod 순차 롤아웃과 Operator 타입별 이전으로 단계별 학습 누적  
  - **강한 팀 협업**: Search, Analytics, Data Engineering, ML, Marketing 등 다영역 협력, 신속한 코드 리뷰와 공용 채널 소통  
  - **분석 기반 진행 추적**: 전 리전 마이그레이션 진행 대시보드 구축, Airflow 데이터베이스 쿼리로 잔여 SSH 기반 작업 식별  
- ## 다시 한다면 달리할 점  
  - **네트워크 토폴로지 사전 매핑 필요**: EKM 연결 같은 네트워크 분리 이슈를 후반에 발견, Whitecastle 계정 경계와 네트워크 라우팅을 **클러스터 마이그레이션 전 문서화** 필요  
  - **리소스 한도 테스트 조기 수행 필요**: vmem 체크 이슈가 후반에 발생, **초기 파일럿 단계부터 SSH 대비 YARN 리소스 한도 테스트** 포함 필요  
  - **Operator 제한에 대한 사전 소통 강화**: 최종 단계에서 SSHOperator 신규 사용을 제한했을 때 일부 팀이 인지하지 못함, **Airflow 사용자 전체에 대한 사전 공지 강화** 필요  
- ## 대규모 마이그레이션 모범 사례  
  - **마이그레이션 전에 모니터링부터 구축**: 잔여 작업을 항상 파악할 수 있는 대시보드 조기 마련, Airflow DB 쿼리 활용  
  - **다중 환경 테스트**: Dev, CommDev, GovDev에서 테스트해 환경별 이슈를 프로덕션 이전에 포착, 특히 **계정 경계 간 테스트로 네트워크 분리 이슈 사전 발견**  
  - **점진적 Operator 폐기**: CrunchExecOperator, S3SyncOperator 등 **한 번에 하나씩 폐기**, 각 단계가 자체 테스트·검증 포함된 미니 프로젝트로 운영, 속도는 느리지만 위험 크게 완화

<!-- USER:NOTES -->
## 내 메모
