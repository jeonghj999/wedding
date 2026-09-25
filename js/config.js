/* =========================================================
   ✏️ 청첩장 내용 수정은 이 파일만 고치면 됩니다.
   - 따옴표(' ') 안의 글자만 바꾸세요.
   - 줄 끝의 쉼표(,)는 지우지 마세요.
   ========================================================= */
window.WEDDING = {
  // [3] 신랑 · 신부
  groom: { ko: '정연호', en: 'Yeonho', full: 'Jung Yeonho' },
  bride: { ko: '정현진', en: 'Hyeonjin', full: 'Jung Hyeonjin' },

  // [1] 예식 날짜와 시간 (한국 시간, +09:00 은 그대로 두세요)
  date: '2027-03-06T13:00:00+09:00',

  // [2] 감성 문구 — 한 줄에 하나씩. 빈 줄은 '' 로 넣으면 한 줄 띄워집니다.
  //     (지금 문구는 임시 초안이에요. 원하는 문구로 바꿔 주세요.)
  message: [
    '같은 성을 가진 두 사람이',
    '서로에게 가장 가까운 사람이 되었습니다.',
    '',
    '봄이 시작되는 3월의 어느 날,',
    '이제 평생을 함께 걷기로 약속합니다.',
    '',
    '저희의 첫걸음에 함께해 주세요.'
  ],

  // [5] 영상 — 둘 중 하나만 채우면 됩니다.
  //  ① 유튜브: 주소가 https://youtu.be/AbCdEf12345 라면 youtubeId: 'AbCdEf12345'
  //  ② 직접 올린 파일: video 폴더에 넣고 file: 'video/wedding.mp4'
  video: {
    youtubeId: 'xnmh47Bneio',
    file: '',
    poster: 'images/main.jpg',  // 재생 전 보이는 사진
    autoplay: true              // 스크롤로 영상이 보이면 소리 없이 자동재생 (끄려면 false)
  },

  // [6] 갤러리 — images/gallery 폴더에 01.jpg, 02.jpg ... 순서대로 넣으면 자동으로 나타납니다.
  //     첫 번째 사진(01.jpg)이 처음 크게 보이는 대표 사진이 됩니다.
  gallery: {
    folder: 'images/gallery/',
    max: 30,         // 최대 몇 장까지 찾을지
    ext: 'jpg'       // 파일 확장자 (jpg / jpeg / png / webp)
  },

  // [7] 예식장
  venue: {
    name: '당산 그랜드컨벤션센터',
    hall: '',                                  // 홀 이름이 정해지면 예) '5층 그랜드볼룸'
    address: '서울 영등포구 양평로 58',
    tel: '',                                   // 예식장 전화번호 (비워두면 안 보임)

    // 지도 앱 바로가기 — 공유하기로 복사한 주소를 붙여넣으세요. 비워두면 예식장 이름으로 검색합니다.
    links: {
      naver: 'https://naver.me/5suYqk32',
      kakao: 'https://kko.to/9NR5bC5NyW'
    },

    // 네이버 지도 키 — README의 "네이버 지도 켜기"를 보고 발급받아 넣으면 화면에 지도가 나타납니다.
    // 비워두면 지도 대신 '네이버 지도 / 카카오맵 / 티맵으로 보기' 버튼만 보여요.
    // 가장 쉬운 방법: 네이버 지도 앱에서 약도를 캡처해 images/map.jpg 로 저장 → 'images/map.jpg' 입력
    //   (누르면 위의 네이버 지도 링크로 이동합니다)
    mapImage: '',
    naverMapKey: '4peulyo1x9',
    lat: null,     // 위도·경도를 모르면 null 그대로 두세요. 주소로 자동으로 찾습니다.
    lng: null
  },

  // [8] 오시는 길 — 제목을 누르면 아래로 펼쳐집니다. 항목을 더하거나 빼도 됩니다.
  //     icon 은 이모지를 그대로 넣으면 됩니다. lines 안 한 줄 = 화면의 한 줄. 줄 안의 ' > ' 는 화살표로 바뀝니다.
  directions: [
    {
      icon: '🚊', title: '지하철',
      items: [
        { label: '9호선 당산역', color: '#B5A06F', lines: ['13번 출구 > 도보 2분'] }
      ]
    },
    {
      icon: '🅿️', title: '주차',
      items: [
        { label: '본관 (지상 1·2 주차장)', lines: ['약 200대 수용 · 2시간 무료'] },
        { label: '이레빌딩 (제휴)', lines: ['약 450대 수용 · 3시간 무료'] }
      ]
    },
    {
      icon: '🚌', title: '셔틀버스',
      items: [
        { label: '이레빌딩 ↔ 웨딩홀', lines: ['셔틀버스 5대 상시 운행'] }
      ]
    }
  ],

  // [9] 마음 전하실 곳 — 계좌번호를 채우면 '복사' 버튼이 켜집니다.
  //     bank: 은행 이름, number: 계좌번호, holder: 예금주
  accounts: {
    groom: [
      { role: '신랑',   bank: '', number: '', holder: '정연호' },
      { role: '아버지', bank: '', number: '', holder: '' },
      { role: '어머니', bank: '', number: '', holder: '' }
    ],
    bride: [
      { role: '신부',   bank: '', number: '', holder: '정현진' },
      { role: '아버지', bank: '', number: '', holder: '' },
      { role: '어머니', bank: '', number: '', holder: '' }
    ]
  },

  // [10] 엔딩 크레딧 — 맨 아래 어둡게 처리된 사진 위로 한 줄씩 올라옵니다.
  ending: {
    photo: 'images/gallery/01.jpg',   // 세로 사진을 images/ending.jpg 로 넣고 여기 바꾸면 더 예뻐요
    position: 'center 70%',     // 사진에서 보여줄 위치 (가로% 세로) — 예) 'center', '70% center'
    speed: 16,                  // 크레딧이 아래→위로 한 번 올라가는 데 걸리는 초 (클수록 느림)
    credits: [
      ['Directed by', '정현진, 정연호'],
      ['Story begins', '2027.03.06'],
      ['Special thanks to', '축하를 보내주신 분들께']
    ]
  },

  // [11] 공유하기 (맨 아래)
  share: {
    url: 'https://jeonghj999.github.io/wedding/',   // 청첩장 주소 (도메인을 사면 바꿔주세요)
    title: '정연호 ♥ 정현진 결혼합니다',
    description: '2027년 3월 6일 토요일 오후 1시 · 당산 그랜드컨벤션센터',
    image: 'https://jeonghj999.github.io/wedding/images/main.jpg',
    // 카카오 JavaScript 키 — README의 "카카오톡 공유 켜기"를 보고 넣어주세요.
    // 비워두면 휴대폰 기본 공유창(여기서 카카오톡 선택 가능)이 열립니다.
    kakaoKey: ''
  }
};
