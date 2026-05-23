---
id: 29790
title: "Project Glasswing: 초기 업데이트"
url: https://www.anthropic.com/research/glasswing-initial-update
domain: anthropic.com
author: neo
points: 1
comments_count: 1
posted_at: 2026-05-23T17:45:51+09:00
fetched_at: 2026-05-23T15:50:12.062Z
last_seen_at: 2026-05-23T15:50:12.062Z
tags: []
auto_tags:
  - domain/anthropic.com
  - type/GN+
favorited: false
related: []
---

## 요약
_(요약 없음)_

## 본문
- **Project Glasswing**은 강력한 AI 모델 악용에 앞서 중요 소프트웨어를 보호하려는 협력 프로젝트로, 약 50개 파트너가 참여함
- Claude Mythos Preview는 파트너 코드에서 **1만 개 이상**의 높음·치명적 취약점을 찾았고, 여러 파트너의 발견 속도는 10배 이상 빨라짐
- 오픈소스 1,000개 이상에서 **23,019개 취약점**을 추정했으며, 검증된 1,752개 중 90.6%가 실제 양성으로 확인됨
- 병목은 취약점 발견에서 **검증·보고·패치·배포**로 이동했으며, 높은·치명적 버그는 평균 패치까지 2주가 걸림
- Anthropic은 Mythos급 모델을 아직 일반 공개하지 않았고, 개발자와 방어자는 **패치 주기 단축**과 기본 보안 통제 강화가 필요함

---

### 초기 결과와 공개 원칙
- [Project Glasswing](https://www.anthropic.com/glasswing)은 더 강력한 AI 모델이 악용되기 전에 세계적으로 중요한 소프트웨어를 보호하기 위한 협력 프로젝트임
- Anthropic과 약 **50개 파트너**는 Claude Mythos Preview로 중요 소프트웨어에서 심각도 높음 또는 치명적 수준의 취약점을 **1만 개 이상** 찾아냄
- 소프트웨어 보안의 병목은 새 취약점을 찾는 속도에서, AI가 찾아낸 대량의 취약점을 **검증·공개·패치**하는 속도로 옮겨감
- ## 취약점 공개 방식
  - 일반적인 취약점 공개 관행은 새 취약점 발견 후 **90일 뒤** 공개하거나, 90일 전에 패치가 준비되면 패치 제공 후 약 **45일 뒤** 공개하는 방식임
  - Anthropic의 [Coordinated Vulnerability Disclosure policy](https://www.anthropic.com/coordinated-vulnerability-disclosure)도 이 방식을 따르며, 최종 사용자가 공격 전에 업데이트할 시간을 확보하려는 절차임
  - Mythos Preview가 찾은 파트너 취약점의 세부 내용을 조기 공개하면 최종 사용자가 위험해질 수 있어, 현재는 **대표 예시**와 **집계 통계** 중심으로 공유 중
  - 패치가 널리 배포된 뒤에는 더 상세한 기술 내용이 공개될 예정임

### 파트너와 외부 평가에서 드러난 성능
- Project Glasswing의 초기 파트너들은 인터넷과 필수 인프라 작동에 핵심적인 소프트웨어를 만들고 유지함
- 이 코드의 결함을 고치면 해당 소프트웨어에 의존하는 많은 조직과 **수십억 최종 사용자**의 위험이 줄어듦
- 프로젝트 시작 한 달 뒤 대부분의 파트너는 각자 수백 개의 치명적 또는 높은 심각도 취약점을 찾았고, 전체 발견 수는 **1만 개 이상**에 도달함
- 여러 파트너의 버그 발견 속도는 **10배 이상** 빨라짐
- [Cloudflare](https://blog.cloudflare.com/cyber-frontier-models/)는 핵심 경로 시스템에서 **2,000개 버그**를 찾았고, 그중 **400개**는 높은 또는 치명적 심각도였으며, 오탐률은 인간 테스터보다 낫다고 평가함
- ## 외부 테스트와 벤치마크
  - 영국 [AI Security Institute](https://www.aisi.gov.uk/blog/how-fast-is-autonomous-ai-cyber-capability-advancing)는 Mythos Preview를 자사 두 개의 사이버 레인지, 즉 다단계 사이버 공격 시뮬레이션을 처음으로 끝까지 해결한 모델로 평가함
  - [Mozilla](https://blog.mozilla.org/en/privacy-security/ai-security-zero-day-vulnerabilities/)는 Firefox 150 테스트에서 [271개 취약점](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)을 찾아 수정했으며, 이는 Firefox 148에서 Claude Opus 4.6으로 찾은 수보다 **10배 이상** 많음
  - 독립 보안 플랫폼 [XBOW](https://xbow.com/blog/mythos-offensive-security-xbow-evaluation)는 Mythos Preview가 웹 익스플로잇 벤치마크에서 기존 모든 모델보다 “상당한 도약”을 보였고, 토큰당 기준으로 “전례 없는 정밀도”를 제공한다고 평가함
  - [ExploitBench](http://exploitbench.ai)와 [ExploitGym](https://arxiv.org/abs/2605.11086)은 익스플로잇 개발 역량을 측정하는 최근 학술 벤치마크이며, Mythos Preview가 가장 강한 성능을 보임
- ## 패치 배포 속도의 변화
  - Palo Alto Networks의 최신 릴리스에는 평소보다 [5배 이상](https://www.paloaltonetworks.com/blog/2026/05/defenders-guide-frontier-ai-impact-cybersecurity-may-2026-update/) 많은 패치가 포함됨
  - Microsoft는 새 패치 수가 “한동안 계속 증가 추세를 보일 것”이라고 [밝힘](https://www.microsoft.com/en-us/msrc/blog/2026/05/a-note-on-patch-tuesday)
  - Oracle은 제품과 클라우드 전반에서 취약점을 이전보다 [여러 배 빠르게](https://blogs.oracle.com/security/accelerating-vulnerability-detection-and-response-at-oracle) 찾고 수정하는 중
  - Mythos Preview는 취약점 탐지 외 보안 작업에도 쓰였으며, 한 Glasswing 파트너 은행에서는 위협 행위자가 고객 이메일 계정을 침해하고 스푸핑 전화까지 사용한 뒤 시도한 **150만 달러** 규모의 사기 송금을 탐지하고 차단하는 데 기여함

### 오픈소스 스캔 결과
- Anthropic은 최근 몇 달간 Mythos Preview로 인터넷과 자체 인프라의 상당 부분을 떠받치는 **1,000개 이상 오픈소스 프로젝트**를 스캔함
- Mythos Preview는 이 프로젝트들에서 총 **23,019개** 취약점을 추정했으며, 그중 **6,202개**를 높은 또는 치명적 심각도로 평가함
- ## 검증된 취약점 수치
  - 높은 또는 치명적 심각도로 평가된 취약점 중 **1,752개**는 6개 독립 보안 연구 업체 또는 일부 경우 Anthropic이 신중히 평가함
  - 이 중 **90.6%**, 즉 **1,587개**가 실제 양성으로 확인됨
  - 이 중 **62.4%**, 즉 **1,094개**는 높은 또는 치명적 심각도로 확정됨
  - 현재 사후 분류 기준의 실제 양성률을 적용하면, Mythos Preview가 더 이상 새 취약점을 찾지 않아도 오픈소스 코드에서 거의 **3,900개**의 높은 또는 치명적 심각도 취약점이 드러날 전망임
  - Anthropic은 오픈소스 코드 스캔을 당분간 계속할 예정이므로 이 숫자는 더 늘어날 것으로 예상됨
- ## wolfSSL 취약점 예시
  - [wolfSSL](https://www.wolfssl.com/)은 보안성으로 알려진 오픈소스 암호화 라이브러리이며 전 세계 수십억 기기에서 사용됨
  - Mythos Preview는 공격자가 인증서를 위조할 수 있게 하는 [익스플로잇](https://www.wolfssl.com/how-claude-mythos-preview-helped-harden-wolfssl/)을 구성함
  - 이 취약점은 공격자가 은행이나 이메일 제공업체의 가짜 웹사이트를 운영할 수 있게 만들며, 최종 사용자에게는 정상 사이트처럼 보이지만 실제로는 공격자가 제어하는 사이트가 됨
  - 해당 취약점은 이미 패치됐고 [CVE-2026-5194](https://nvd.nist.gov/vuln/detail/CVE-2026-5194)가 부여됨
  - 전체 기술 분석은 향후 몇 주 안에 공개될 예정임

### 검증·공개·패치 병목
- Mythos Preview로 취약점 발견은 크게 쉬워졌지만, 병목은 버그를 **분류·보고·패치 설계·배포**하는 인간 처리 역량에 있음
- Anthropic은 스캔한 [오픈소스 취약점 대시보드](https://red.anthropic.com/2026/cvd/)를 공개해 조율된 공개 절차의 각 단계와 진행 상황을 추적함
- 각 단계에서 수가 크게 줄어드는 현상은 취약점 하나하나를 검증하고 수정하는 데 필요한 **인간 작업량**을 반영함
- Anthropic 또는 외부 보안 업체는 Mythos가 찾은 문제를 재현하고 심각도를 다시 평가한 뒤, 기존 수정 여부를 확인하고 유지관리자에게 보낼 상세 보고서를 작성함
- 오픈소스 유지관리자들은 기존 유지관리 부담에 더해 품질 낮은 AI 생성 버그 보고서의 홍수까지 감당하는 중
- 여러 유지관리자는 처리 역량이 심각하게 제한돼 있으며, 일부는 패치를 설계할 시간이 필요하다며 공개 속도를 늦춰 달라고 요청함
- Mythos Preview가 찾은 높은 또는 치명적 심각도 버그는 평균적으로 **패치까지 2주**가 걸림
- ## 공개와 패치 현황
  - 유지관리자 요청에 따라 추가 평가 없이 버그를 직접 공개하는 경우도 있음
  - 현재까지 검증되지 않은 버그 **1,129개**가 직접 보고됐고, 그중 Mythos Preview가 높은 또는 치명적 심각도로 추정한 것은 **175개**임
  - 현재까지 유지관리자에게 공개한 높은 또는 치명적 심각도 버그는 약 **530개**로 추산됨
  - 추가로 **827개**의 확인된 취약점이 있으며, 같은 방식으로 높은 또는 치명적 심각도로 추정되고 최대한 빠르게 공개될 예정임
  - 보고된 높은 또는 치명적 심각도 버그 **530개** 중 **75개**가 패치됐고, 그중 **65개**에는 공개 권고문이 부여됨
  - [Coordinated Vulnerability Disclosure policy](https://www.anthropic.com/coordinated-vulnerability-disclosure)의 **90일 창구**가 아직 초기 단계라 앞으로 더 많은 패치가 나올 것으로 예상됨
  - 일부 취약점은 공개 권고문 없이 패치되므로, Claude로 직접 패치 여부를 스캔해야 해 패치 수가 과소 집계됐을 가능성이 있음
  - 취약점 발견은 쉬워졌지만 수정은 느린 불균형이 사이버보안의 큰 과제로 떠오르며, 이를 잘 다루면 소프트웨어는 이전보다 훨씬 안전해질 수 있음

### 새로운 사이버보안 국면에 대한 대응
- Mythos Preview와 비슷한 사이버보안 역량을 가진 모델은 곧 더 널리 사용 가능해질 전망임
- 소프트웨어 업계 전반에서 이런 모델들이 만들어낼 대량의 발견 결과를 관리하기 위한 **더 큰 규모의 노력**이 필요함
- 취약점 발견, 패치 작성, 최종 사용자에게 패치가 널리 배포되는 시점 사이에는 지금도 긴 지연이 자주 존재함
- Mythos급 모델은 취약점을 찾고 악용하는 데 필요한 시간과 비용을 크게 줄여, 이러한 지연이 만들어내는 위험을 키움
- 장기적으로 Mythos급 모델은 배포 전에 버그를 잡아 개발자가 훨씬 안전한 소프트웨어를 만들도록 도울 수 있음
- 하지만 취약점은 빠르게 발견되고 패치는 느리게 이뤄지는 중간 시기에는 새로운 위험이 생김
- ## 소프트웨어 개발자에게 필요한 조치
  - 개발자는 **패치 주기**를 줄이고 보안 수정 사항을 가능한 한 빠르게 제공해야 함
  - 공개적으로 이용 가능한 AI 모델을 신중히 활용하면 이 작업에 도움이 될 수 있음
  - 사용자가 최신 버전을 유지하도록 업데이트 설치를 최대한 쉽게 만들어야 함
  - 알려진 취약점이 있는 소프트웨어를 계속 실행하는 사용자에게는 가능한 범위에서 더 끈질기게 업데이트를 유도해야 함
- ## 네트워크 방어자에게 필요한 조치
  - 네트워크 방어자는 패치 테스트와 배포 일정을 단축해야 함
  - [National Institute of Standards and Technology](https://www.nist.gov/cyberframework)와 영국 [National Cyber Security Centre](https://www.ncsc.gov.uk/collection/10-steps/risk-management)가 제시한 핵심 통제는 특정 패치가 제때 적용되는지에 의존하지 않고 보안을 높이므로 더 중요해짐
  - 기본 네트워크 설정 강화, 다중 인증 강제, 탐지와 대응을 위한 포괄적 로그 유지 같은 조치가 여기에 포함됨

### 공개 AI 모델을 활용한 방어 도구
- 일반적으로 이용 가능한 많은 모델도 가장 정교한 취약점을 찾거나 Claude Mythos Preview만큼 효과적으로 악용하지는 못하지만, 이미 많은 소프트웨어 취약점을 찾을 수 있음
- Project Glasswing은 여러 조직이 일반 공개 모델로 자체 코드베이스를 점검하도록 촉진했으며, Anthropic은 이를 더 쉽게 만들기 위한 작업을 진행 중
- ## Claude Security
  - [Claude Security](https://claude.com/product/claude-security)는 Claude Enterprise 고객을 대상으로 공개 베타로 출시됨
  - 팀이 코드베이스의 취약점을 스캔하고 제안 수정안을 생성하도록 돕는 도구임
  - 출시 후 3주 동안 Claude Opus 4.7은 **2,100개 이상 취약점**을 패치하는 데 사용됨
  - 기업은 자체 코드를 고치는 반면 오픈소스 수정은 보통 조율된 공개 절차와 자원봉사 유지관리자가 필요해, Claude Security의 패치 속도가 앞선 오픈소스 패치보다 빠름
- ## Cyber Verification Program
  - [Cyber Verification Program](https://support.claude.com/en/articles/14604842-real-time-cyber-safeguards-on-claude)은 보안 전문가가 합법적 사이버보안 목적에 Anthropic 모델을 사용할 수 있게 함
  - 취약점 연구, 침투 테스트, 레드팀 활동 같은 용도에서는 사이버 오용 방지를 위한 일부 보호장치 없이 모델을 사용할 수 있음
- ## Mythos Preview와 함께 쓰인 도구
  - Anthropic과 파트너가 Mythos Preview와 함께 사용한 도구는 자격을 갖춘 고객 보안팀에 요청 기반으로 제공됨
  - 목표는 복잡한 설정 없이도 강력한 공개 모델의 성능을 더 잘 활용하도록 돕는 것임
  - [skills](https://code.claude.com/docs/en/skills): Anthropic과 파트너가 만들고 공유한 반복 작업용 사용자 지정 지침
  - 하네스(harness): Claude가 코드베이스를 매핑하고, 스캔 하위 에이전트를 띄우고, 발견 사항을 분류하고, 보고서를 작성하도록 돕는 구성
  - 위협 모델 빌더: 코드베이스를 매핑해 잠재적 공격 대상을 식별하고 모델 작업의 우선순위를 정함
  - Cisco는 Project Glasswing 파트너 중 하나이며, 다른 방어자가 Cisco와 유사한 평가 시스템을 만들 수 있도록 [Foundry Security Spec](https://blogs.cisco.com/ai/announcing-foundry-security-spec)을 최근 오픈소스로 공개함

### 생태계 지원과 다음 단계
- Anthropic은 Open Source Security Foundation의 Alpha-Omega 프로젝트와 [파트너십](https://openssf.org/press-release/2026/03/17/linux-foundation-announces-12-5-million-in-grant-funding-from-leading-organizations-to-advance-open-source-security/)을 맺어, 유지관리자가 버그 보고서를 처리하고 분류하는 작업을 지원함
- Anthropic은 프런티어 AI 모델의 익스플로잇 개발 역량을 시간에 따라 추적할 수 있는 새 벤치마크 [ExploitBench](http://exploitbench.ai)와 [ExploitGym](https://rdi.berkeley.edu/blog/exploitgym/) 개발을 지원함
- 이 벤치마크 관련 내용은 [Frontier Red Team blog](https://red.anthropic.com/2026/exploit-evals/)에서 더 다룸
- [External Researcher Access Program](https://support.claude.com/en/articles/9125743-what-is-the-external-researcher-access-program)을 통해 다른 고품질 정량 벤치마크 개발도 지원함
- [Claude for Open Source](https://claude.com/contact-sales/claude-for-oss)는 유지관리자와 기여자를 지원하며, Anthropic은 앞으로 자체적으로 채택하는 모든 오픈소스 패키지를 스캔하겠다고 밝힘
- AI 발전 속도를 고려하면 Mythos Preview만큼 강력한 모델은 곧 여러 AI 회사에서 개발될 전망임
- 현재 Anthropic을 포함한 어떤 회사도 이런 모델이 오용되어 심각한 피해를 일으키는 것을 막을 만큼 강력한 보호장치를 개발하지 못함
- 이 때문에 Anthropic은 아직 **Mythos급 모델**을 일반에 공개하지 않음
- Project Glasswing은 비슷한 역량의 모델이 충분한 보호장치 없이 공개될 경우, 세계 거의 누구에게나 결함 있는 소프트웨어를 악용하는 일이 훨씬 싸고 쉬워질 수 있다는 문제의식에서 시작됨
- Glasswing은 가장 시스템적으로 중요한 사이버 방어자가 **비대칭적 우위**를 얻도록 돕지만, 가능한 한 많은 조직이 방어력을 강화해야 할 긴급한 필요가 있음
- Anthropic은 미국 및 동맹국 정부를 포함한 핵심 파트너와 협력해 Project Glasswing을 추가 파트너로 확대할 예정임
- 필요한 훨씬 강력한 보호장치를 개발한 뒤, 가까운 미래에 Mythos급 모델을 일반 출시 형태로 제공하는 것을 목표로 함
- 장기 목표는 중요한 코드가 현재보다 훨씬 더 강하게 보호되고, 해킹이 훨씬 덜 흔한 환경을 만드는 것임

<!-- USER:NOTES -->
## 내 메모
