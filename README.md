# 연호 ♥ 현진 모바일 청첩장

## 폴더 구조
```
wedding/
├─ index.html        ← 페이지 뼈대 (보통 안 고쳐도 됨)
├─ js/config.js      ← ✏️ 이름·날짜·문구·영상·갤러리 설정 (여기만 고치면 됨)
├─ js/main.js        ← 달력·카운트다운·갤러리 동작
├─ css/style.css     ← 색·글꼴·디자인
├─ images/main.jpg   ← 표지 메인 사진
├─ images/gallery/   ← 갤러리 사진 (01.jpg, 02.jpg ... 순서대로)
└─ video/            ← 영상 파일을 직접 올릴 경우
```

## 자주 하는 수정
1. **감성 문구** — `js/config.js` 의 `message` 안 글자를 바꾸기
2. **갤러리 사진** — `images/gallery/` 에 `01.jpg` ~ `20.jpg` 로 이름 붙여 넣기 (01번이 대표 사진)
3. **영상** — 유튜브(일부공개)에 올린 뒤 주소 끝 11글자를 `config.js` 의 `youtubeId` 에 넣기
4. **계좌번호** — `config.js` 의 `accounts` 에 은행·계좌번호·예금주 입력 (채우면 복사 버튼이 켜짐)
5. **오시는 길** — `config.js` 의 `directions` 에서 줄을 더하거나 고치기
6. **메인 사진 교체** — `images/main.jpg` 파일을 같은 이름으로 덮어쓰기

## 내 컴퓨터에서 미리 보기
`wedding` 폴더에서 `python3 -m http.server` 실행 후 브라우저에서 http://localhost:8000 열기

## 네이버 지도 켜기 (선택)
키가 없으면 지도 자리에 안내 문구와 '네이버 지도 / 카카오맵 / 티맵' 버튼만 보입니다.
1. [네이버 클라우드 플랫폼](https://www.ncloud.com) 가입 → 콘솔 로그인 (결제수단 등록을 요구할 수 있음, 무료 사용량 안에서는 과금 없음)
2. **Services → Application Services → Maps** → **Application 등록**
3. API 선택: **Dynamic Map**, **Geocoding** 체크
4. **Web 서비스 URL** 에 청첩장 주소 입력 (예: `https://아이디.github.io`)
5. 등록 후 **인증 정보 → Client ID** 를 복사해서 `config.js` 의 `naverMapKey: ''` 따옴표 안에 붙여넣기

## 카카오톡 공유 켜기 (선택)
키가 없어도 버튼은 작동해요(휴대폰 공유창이 열리고 거기서 카카오톡 선택). 키를 넣으면 사진·제목이 들어간 예쁜 카드로 보내져요.
1. [카카오 디벨로퍼스](https://developers.kakao.com) 로그인 → **내 애플리케이션 → 애플리케이션 추가**
2. 앱 설정 → **플랫폼 → Web → 사이트 도메인**에 `https://jeonghj999.github.io` 등록
3. **앱 키 → JavaScript 키** 복사 → `js/config.js` 의 `kakaoKey: ''` 에 붙여넣기
