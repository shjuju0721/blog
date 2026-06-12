// 최신 뉴스(2026년 6월) 기반 블로그 글 10개를 Supabase 에 삽입합니다.
// 실행: node scripts/seed.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env.local 파싱
const env = {};
for (const line of readFileSync(join(__dirname, "..", ".env.local"), "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL || !KEY) {
  console.error("환경변수(.env.local)에서 Supabase URL/KEY 를 찾지 못했습니다.");
  process.exit(1);
}

const posts = [
  {
    title: "AI 빅뱅: Claude Opus 4.8 공개와 Anthropic의 965조 몸값",
    content: `2026년 6월, 인공지능 업계는 그 어느 때보다 빠르게 움직이고 있습니다. 모델 성능 경쟁과 천문학적 투자가 동시에 터지면서 산업의 무게중심이 흔들리는 한 주였습니다.

## 새 모델 경쟁

- **Anthropic Claude Opus 4.8** — SWE-bench Verified에서 **88.6%**를 기록하며 코딩 성능 기록을 갈아치웠습니다. 병렬 서브에이전트 워크플로와 2.5배 빠른 'fast mode'가 핵심입니다.
- **Microsoft MAI** — OpenAI 아키텍처에 의존하지 않고 자체 개발한 독자 모델군을 공개했습니다.

## 돈의 흐름

> Anthropic이 650억 달러 규모 시리즈 H를 마감하며 **9,650억 달러** 기업가치로 세계에서 가장 비싼 AI 스타트업이 되었습니다.

구글도 AI 인프라 확장을 위해 **800억 달러** 규모의 주식 발행에 나섰습니다.

## 흐름의 핵심: 에이전트

올해 가장 큰 변화는 **에이전트형 시스템**입니다. AI가 단순한 채팅을 넘어 리서치·코딩·고객지원·법률·결제·커머스에서 직접 '작업을 끝내는' 단계로 넘어가고 있습니다.

---

*출처: [Crescendo AI News](https://www.crescendo.ai/news/latest-ai-news-and-updates), [BuildFastWithAI](https://www.buildfastwithai.com/blogs/ai-news-today-june-8-2026)*`,
  },
  {
    title: "이스라엘-이란 충돌 격화… 중동 긴장 최고조",
    content: `중동 정세가 다시 한 번 위태로운 국면으로 치닫고 있습니다. 이스라엘의 군사 작전과 이란의 미사일 공격이 맞물리며 주변국까지 휘말리는 모양새입니다.

## 무슨 일이 있었나

- 이스라엘군이 이란을 공격한 직후, 수도 **테헤란**과 **타브리즈·이스파한**에서 폭발이 잇따랐습니다.
- 이는 레바논 공격을 둘러싼 휴전 위반 논란 속에 이란이 이스라엘 북부로 미사일 공격을 퍼부은 데 대한 대응입니다.

## 주변국으로 번지는 불씨

| 국가 | 상황 |
| --- | --- |
| 요르단 | 아즈라크 인근 공군기지를 노린 미사일 5발 요격 |
| 쿠웨이트·바레인 | 방공망이 날아오는 발사체에 대응 |

지역 전체가 전면전 위험에 노출되면서, 국제사회의 중재 노력이 시험대에 올랐습니다.

---

*출처: [Global National](https://www.youtube.com/watch?v=thOp7BerrM4), [Go Local Prov](https://www.golocalprov.com/news/5-big-news-stories-overnight-monday-june-8-2026)*`,
  },
  {
    title: "제임스 웹, '블랙홀 별' 가장 강력한 증거 포착",
    content: `우주를 보는 인류의 눈이 또 한 번 한계를 넓혔습니다. 2026년 6월 천문학계는 블랙홀의 새로운 모습부터 달 탐사 준비까지 굵직한 소식을 쏟아냈습니다.

## 블랙홀 별(Black Hole Star)

천문학자들은 **GLIMPSE-17775**가 부분적으로 이온화된 짙은 가스 고치에 둘러싸인 초대질량 블랙홀이라는 강력한 증거를 찾았습니다. 이른바 *'블랙홀 별'* 시나리오를 뒷받침하는 관측입니다.

## 생명의 기원에 한 걸음

성간 물질(ISM)에서 **사상 최초로 탄소 4개짜리 당(sugar)** 분자가 발견됐습니다. 지구 생명의 출발을 이해하는 또 하나의 단서입니다.

## 달과 인간

- 일본 연구진이 단 2년 만에 달 표면 전체를 지도화할 수 있는 **소형 X선 망원경**을 개발했습니다.
- NASA가 **아르테미스 3** 미션의 4인 승무원을 발표하며 유인 달 착륙 준비에 박차를 가하고 있습니다.

---

*출처: [NASA Science](https://science.nasa.gov/missions/webb/nasa-webb-finds-strongest-evidence-yet-for-black-hole-stars/), [Universe Today](https://www.universetoday.com/)*`,
  },
  {
    title: "세계 경제, 중동發 충격에 코로나 이후 최저 성장 전망",
    content: `지정학적 위기가 곧장 지갑으로 옮겨붙고 있습니다. 세계은행은 중동 분쟁이 글로벌 성장률을 코로나19 이후 최저 수준으로 끌어내릴 것이라 경고했습니다.

## 성장률 둔화

- 개발도상국 성장률은 2025년 4.4%에서 **2026년 3.6%**로 하락할 전망(팬데믹 이후 최저).
- 남아시아는 가장 높은 성장세를 유지하지만, 7% → **6.3%**로 둔화가 불가피합니다.

## 치솟는 유가

> 브렌트유는 2026년 평균 **배럴당 94달러**로 전망되며, 이는 2025년 대비 36% 높은 수준입니다.

호르무즈 해협이 빠르게 정상화되지 않으면 6~7월에 추가 상승 압력이 예상됩니다.

## 증시 충격

6월 초 나스닥은 **4.2% 급락**하며 2025년 4월 이후 최악의 하루를 기록했고, 반도체주가 가장 크게 빠지며 약 1조 달러의 시가총액이 증발했습니다.

---

*출처: [World Bank](https://www.worldbank.org/en/news/press-release/2026/06/11/global-economic-prospects-june-2026-press-release), [Rio Times](https://www.riotimesonline.com/global-economy-briefing-june-10-2026/)*`,
  },
  {
    title: "2026 북중미 월드컵 개막! 48개국 시대 열렸다",
    content: `드디어 공이 굴러갑니다. 캐나다·멕시코·미국이 공동 개최하는 2026 FIFA 월드컵이 **48개국 104경기**라는 역대 최대 규모로 막을 올렸습니다.

## 화려한 개막

- 개막전은 **멕시코 vs 남아프리카공화국**. 멕시코가 2-0으로 승리하며 '개막전 징크스'를 깼습니다.
- 이 경기에서 무려 **3명이 퇴장**당하며 월드컵 역사를 새로 썼습니다.

## 주목할 일정

- 🇺🇸 미국은 금요일 LA에서 **파라과이**와 첫 경기. 명장 **포체티노** 감독이 역대 최강 전력을 이끕니다.
- 🏴 잉글랜드는 코스타리카를 3-0으로 꺾고, 6월 17일 **크로아티아**와 맞붙습니다.

## 옥에 티

소말리아 출신 심판 오마르 압둘카디르 아르탄이 대회 운영 참여를 위해 입국하려다 미국 입국을 거부당하는 일도 있었습니다.

---

*출처: [Al Jazeera](https://www.aljazeera.com/sports/2026/6/11/world-cup-2026-full-match-schedule-groups-teams-and-start-times), [ESPN](https://www.espn.com/soccer/story/_/id/49026257/)*`,
  },
  {
    title: "코스피, 세계 최고 수익률… 반도체 수출이 이끈다",
    content: `한국 증시가 전 세계에서 가장 뜨겁습니다. 2026년 들어 **코스피가 거의 두 배로 뛰며** 주요 지수 중 단연 최고 성과를 내고 있습니다.

## 반도체가 견인차

정부 통계에 따르면 6월 1~10일 한국 반도체 수출은 1년 전보다 **3배 이상 급증한 110억 달러**를 기록했습니다. 같은 기간 전체 수출도 **286억 달러**로 사상 최고, 전년 대비 86% 늘었습니다.

## 개미들의 시대

급등장 속에서 **신규 투자자(개미) 세대**가 대거 유입되고 있다는 분석이 나옵니다.

## 정치·기술 단신

- 서울중앙지법이 윤석열 전 대통령에게 대북 드론 침투 지시 등 혐의로 **징역 30년**을 선고했습니다.
- 이재명 정부 출범 1년을 평가하는 **6·3 지방선거**가 치러졌습니다.
- **샘 올트먼** OpenAI CEO가 방한해 삼성전자·네이버·카카오 경영진과 AI 협력을 논의했습니다.

---

*출처: [Al Jazeera](https://www.aljazeera.com/economy/2026/6/10/south-koreas-booming-stock-market-mints-a-generation-of-novice-investors), [Korea Times](https://www.koreatimes.co.kr/)*`,
  },
  {
    title: "의학의 돌파구: 췌장암 신약부터 AI 설계 백신까지",
    content: `2026년은 의학 혁신이 '폭발하는 순간'으로 기록될지도 모릅니다. 6월 한 달에만 난치병을 겨냥한 굵직한 성과들이 쏟아졌습니다.

## 암 정복에 한 걸음

- **췌장암**: Revolution Medicines의 실험 치료제가 후기 임상에서 표준 항암화학요법 대비 환자 기대수명을 **두 배**로 늘렸습니다.
- **다발성 골수종**: 일라이 릴리가 인수한 체내 세포 편집 약물이 초기 임상에서 **100% 반응률**을 보였습니다.

## 심혈관·대사 질환

작은 초기 임상에서 **단 한 번의 유전자 편집 주입**으로 콜레스테롤을 영구적으로 낮출 가능성이 확인됐습니다. *'한 번으로 끝나는'* 심장병 예방의 문이 열리는 셈입니다.

## 감염병

과학자들이 **AI가 설계한 범용 코로나바이러스 백신**을 사람 대상으로 처음 시험해 안전성과 내약성을 확인했습니다.

---

*출처: [Axios](https://www.axios.com/2026/06/05/medical-innovations-cures-lifespan), [ScienceDaily](https://www.sciencedaily.com/news/health_medicine/)*`,
  },
  {
    title: "세계 환경의 날 2026: 1.5도 한계선 무너지나",
    content: `2026년 6월 5일, 세계는 **환경의 날**을 맞아 기후 위기에 대한 경고음을 다시 한 번 높였습니다. 올해 공식 행사는 아제르바이잔에서 열렸습니다.

## 무너지는 1.5도

> "지난 11년이 역사상 가장 더운 11년이었다. 세계는 1.5도를 일시적으로 넘어서는 길로 향하고 있다." — 안토니우 구테흐스 UN 사무총장

파리협정 목표인 **1.5°C 초과**가 사실상 불가피해지면서, 배출 감축과 적응이 동시에 시급해졌습니다.

## 엘니뇨 경고

- 세계기상기구(WMO)는 6~8월 사이 엘니뇨 발생 가능성을 **80%**로 전망했습니다.
- 최소 11월까지 지속될 확률은 **90%**에 달합니다.

## 숨은 전력 먹는 하마

UN 보고서에 따르면 2025년 전 세계 **데이터센터**가 약 **448 테라와트시**의 전력을 소비했습니다. AI 시대의 그림자입니다.

---

*출처: [UNEP](https://www.unep.org/news-and-stories/press-release/planet-swelters-world-environment-day-2026-focuses-urgent-climate), [Earth.Org](https://earth.org/this-week-in-climate-news-june-2026-week-1/)*`,
  },
  {
    title: "여름 게임 페스트 2026 결산: 킹덤하츠 IV부터 에일리언까지",
    content: `게이머들에게 6월은 축제의 달입니다. **Summer Game Fest 2026**을 비롯한 대형 쇼케이스가 줄줄이 열리며 기대작들이 쏟아졌습니다.

## 쇼케이스 퍼레이드

- **Summer Game Fest** 본 쇼케이스 (6월 5일) — 올해로 6년째
- **Sony State of Play** (6월 2일), **Xbox Games Showcase + Gears of War** (6월 7일)
- **Nintendo Direct** (6월 9일) 깜짝 방송

## 화제의 발표

- 🎮 **킹덤하츠 IV** 트레일러 공개, *파이어 엠블렘: Fortune's Weave*는 9월 17일 스위치2 출시
- 👾 **에일리언: 아이솔레이션 2** 첫 트레일러
- 🧟 캡콤 **레지던트 이블: 코드 베로니카 리메이크** (2027년)
- ⚔️ **스텔라 블레이드** 후속작 *Blood Rain* 공식 발표

## 신작 출시

- **파이널 판타지 VII 리버스**가 6월 3일 Xbox·스위치2로 출시됐습니다.
- 위시리스트 상위권의 코지 게임 **Solarpunk**도 6월 8일 출시됐습니다.

---

*출처: [Engadget](https://www.engadget.com/2192216/summer-game-fest-2026-roundup-all-the-shows-trailers-news-and-reviews/), [PC Gamer](https://www.pcgamer.com/games/pc-game-release-dates-june-2026/)*`,
  },
  {
    title: "빅테크 AI 인프라 투자 경쟁과 미·중 갈등 격화",
    content: `AI 패권 경쟁이 자본과 지정학 두 전선에서 동시에 불붙고 있습니다. 천문학적 인프라 투자와 미·중 갈등이 같은 흐름의 양면을 보여줍니다.

## 인프라에 쏟아붓는 자본

- **구글**: AI 인프라 구축을 위해 **800억 달러** 규모 주식 발행 추진
- **Anthropic**: 650억 달러 조달로 **9,650억 달러** 몸값 달성
- AI가 데이터센터 전력 수요를 끌어올리며 에너지 시장까지 들썩이고 있습니다.

## 규제도 속도

6월 4일, 미국 하원의 제이 오버놀티(공화)·로리 트래한(민주) 의원이 **'2026 위대한 미국 인공지능법(Great American AI Act)'** 초안을 공개했습니다. 269쪽에 달하는 초당적 프레임워크입니다.

## 미·중 갈등

- 미 국방부가 여러 주요 중국 기업을 **'중국 군사기업' 목록**에 추가해 미 국방 계약 참여를 차단했습니다.
- 연방 판사는 신규 H-1B 비자에 부과된 **10만 달러 수수료**를 무효화했습니다.

---

*출처: [Crescendo AI](https://www.crescendo.ai/news/latest-ai-news-and-updates), [NPR World](https://www.npr.org/sections/world/)*`,
  },
];

let ok = 0;
for (const p of posts) {
  const res = await fetch(`${URL}/rest/v1/posts`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(p),
  });
  if (res.ok) {
    ok++;
    console.log(`✓ (${ok}/${posts.length}) ${p.title}`);
  } else {
    console.error(`✗ 실패: ${p.title} — ${res.status} ${await res.text()}`);
  }
}
console.log(`\n완료: ${ok}/${posts.length} 개 삽입됨`);
