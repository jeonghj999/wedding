/* 청첩장 동작 스크립트 — 내용 수정은 config.js 에서 하세요. */
(function () {
  var W = window.WEDDING;
  var $ = function (id) { return document.getElementById(id); };
  var pad = function (n) { return String(n).padStart(2, '0'); };

  /* ---------- 이름 채우기 ---------- */
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    var path = el.getAttribute('data-bind').split('.');
    var v = W[path[0]] && W[path[0]][path[1]];
    if (v) el.textContent = v;
  });

  /* ---------- 날짜 (한국 시간 기준) ---------- */
  var wedding = new Date(W.date);
  var kst = new Date(wedding.getTime() + 9 * 3600e3); // UTC 메서드로 한국 날짜를 읽기 위한 값
  var Y = kst.getUTCFullYear(), M = kst.getUTCMonth(), D = kst.getUTCDate(), H = kst.getUTCHours(), MIN = kst.getUTCMinutes();
  var dow = kst.getUTCDay();
  var DOW_KO = ['일', '월', '화', '수', '목', '금', '토'];
  var DOW_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var MON_EN = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
  var h12 = H % 12 || 12;
  var dotDate = Y + '. ' + pad(M + 1) + '. ' + pad(D);

  $('coverDate').innerHTML = dotDate + ' &nbsp;' + DOW_EN[dow] + '&nbsp; ' + h12 + ':' + pad(MIN) + ' ' + (H < 12 ? 'AM' : 'PM');
  $('dateKo').textContent = Y + '년 ' + (M + 1) + '월 ' + D + '일 ' + DOW_KO[dow] + '요일 ' +
    (H < 12 ? '오전 ' : '오후 ') + h12 + '시' + (MIN ? ' ' + MIN + '분' : '');
  $('calMonth').textContent = MON_EN[M];

  /* ---------- 감성 문구 ---------- */
  $('message').innerHTML = W.message.map(function (line) {
    if (!line) return '<div class="gap"></div>';
    var p = document.createElement('p');
    p.textContent = line;
    return p.outerHTML;
  }).join('');

  /* ---------- 달력 ---------- */
  (function () {
    var first = new Date(Date.UTC(Y, M, 1)).getUTCDay();
    var last = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();
    var html = '<thead><tr>' + ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(function (d, i) {
      return '<th scope="col"' + (i === 0 ? ' class="sun"' : '') + '>' + d + '</th>';
    }).join('') + '</tr></thead><tbody><tr>';
    for (var i = 0; i < first; i++) html += '<td></td>';
    for (var d = 1; d <= last; d++) {
      var col = (first + d - 1) % 7;
      if (col === 0 && d !== 1) html += '</tr><tr>';
      var cls = [];
      if (col === 0) cls.push('sun');
      if (d === D) cls.push('day-mark');
      html += '<td' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' +
        (d === D ? '<span>' + d + '</span>' : d) + '</td>';
    }
    var tail = (7 - ((first + last) % 7)) % 7;
    for (var j = 0; j < tail; j++) html += '<td></td>';
    $('calendar').innerHTML = html + '</tr></tbody>';
  })();

  /* ---------- 카운트다운 ---------- */
  var namesKo = W.groom.ko.slice(1) + ' ♥ ' + W.bride.ko.slice(1); // 성을 뺀 이름: 연호 ♥ 현진
  function kstDayNumber(t) { return Math.floor((t + 9 * 3600e3) / 86400e3); }

  function tick() {
    var now = Date.now();
    var diff = wedding.getTime() - now;
    var days = kstDayNumber(wedding.getTime()) - kstDayNumber(now); // 달력 기준 남은 날짜

    if (diff > 0) {
      $('cdD').textContent = Math.floor(diff / 86400e3);
      $('cdH').textContent = pad(Math.floor(diff / 3600e3) % 24);
      $('cdM').textContent = pad(Math.floor(diff / 60e3) % 60);
      $('cdS').textContent = pad(Math.floor(diff / 1e3) % 60);
    } else {
      $('countdown').hidden = true;
    }

    var text;
    if (days > 0) text = namesKo + '의 결혼식이 <b>' + days + '일</b> 남았습니다.';
    else if (days === 0) text = '오늘, ' + namesKo + ' 두 사람이 결혼합니다.';
    else text = namesKo + ' 두 사람이 부부가 된 지 <b>' + (-days) + '일</b>째입니다.';
    $('ddayText').innerHTML = text;
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- 영상 ---------- */
  var V = W.video || {};
  if (V.poster) $('filmPoster').src = V.poster;
  $('playBtn').addEventListener('click', function () {
    var box = $('filmBox');
    if (V.youtubeId) {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(V.youtubeId) + '?autoplay=1&playsinline=1&rel=0';
      f.title = '웨딩 영상';
      f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.allowFullscreen = true;
      box.appendChild(f);
      // 영상이 안 뜨는 환경(일부 앱 내 브라우저 등)을 위한 유튜브 바로가기
      box.after($('filmNote'));
      $('filmNote').classList.add('below');
      $('filmNote').hidden = false;
      $('filmNote').innerHTML = '<a href="https://youtu.be/' + encodeURIComponent(V.youtubeId) +
        '" target="_blank" rel="noopener">영상이 안 보이면 유튜브에서 보기 ↗</a>';
    } else if (V.file) {
      var v = document.createElement('video');
      v.src = V.file; v.controls = true; v.autoplay = true; v.playsInline = true;
      if (V.poster) v.poster = V.poster;
      box.appendChild(v);
    } else {
      $('filmNote').hidden = false;
    }
  });

  /* ---------- 갤러리 ---------- */
  var G = W.gallery;
  var photos = [];   // 실제 찾은 사진 주소
  var slides = [];   // 화면에 쓰는 목록 (사진 또는 빈 자리)
  var index = 0;

  // 01.jpg, 02.jpg ... 를 순서대로 확인해서 있는 사진만 모읍니다.
  function probe(n) {
    return new Promise(function (resolve) {
      var src = G.folder + pad(n) + '.' + G.ext;
      var img = new Image();
      img.onload = function () { resolve(src); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }
  var checks = [];
  for (var n = 1; n <= G.max; n++) checks.push(probe(n));
  Promise.all(checks).then(function (found) {
    photos = found.filter(Boolean);
    if (photos.length) {
      slides = photos.map(function (src) { return { src: src }; });
    } else {
      // 아직 사진이 없을 때: 메인 사진 + 빈 자리로 모양만 보여줍니다.
      slides = [{ src: 'images/main.jpg' }];
      for (var k = 2; k <= 16; k++) slides.push({ src: null, n: k });
    }
    buildGallery();
  });

  function cell(s) {
    if (s.src) return '<img src="' + s.src + '" alt="" loading="lazy" draggable="false">';
    return '<div class="placeholder"><b>' + pad(s.n) + '</b><span>images/gallery/' + pad(s.n) + '.' + G.ext + '</span></div>';
  }

  function buildGallery() {
    $('viewerTrack').innerHTML = slides.map(function (s, i) {
      return '<div class="slide" data-i="' + i + '">' + cell(s) + '</div>';
    }).join('');
    $('thumbs').innerHTML = slides.map(function (s, i) {
      return '<button class="thumb" type="button" role="tab" data-i="' + i + '" aria-label="사진 ' + (i + 1) + '">' + cell(s) + '</button>';
    }).join('');
    $('thumbs').addEventListener('click', function (e) {
      var b = e.target.closest('.thumb');
      if (b) go(+b.dataset.i);
    });
    go(0, true);
  }

  function go(i, instant) {
    index = (i + slides.length) % slides.length;
    $('viewerTrack').style.transform = 'translateX(' + (-index * 100) + '%)';
    $('counter').textContent = (index + 1) + ' / ' + slides.length;
    var thumbs = $('thumbs'), active = null;
    thumbs.querySelectorAll('.thumb').forEach(function (t, k) {
      t.setAttribute('aria-selected', k === index ? 'true' : 'false');
      if (k === index) active = t;
    });
    if (active && !instant) {
      thumbs.scrollTo({ left: active.offsetLeft - thumbs.clientWidth / 2 + active.clientWidth / 2, behavior: 'smooth' });
    }
  }
  $('prevBtn').addEventListener('click', function () { go(index - 1); });
  $('nextBtn').addEventListener('click', function () { go(index + 1); });

  // 손가락으로 밀어서 넘기기
  function swipe(el, onLeft, onRight, dragTrack) {
    var x0 = null, y0 = 0, dx = 0;
    el.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button')) return;
      x0 = e.clientX; y0 = e.clientY; dx = 0;
      if (dragTrack) dragTrack.classList.add('dragging');
    });
    el.addEventListener('pointermove', function (e) {
      if (x0 === null) return;
      dx = e.clientX - x0;
      if (dragTrack && Math.abs(dx) > Math.abs(e.clientY - y0)) {
        dragTrack.style.transform = 'translateX(calc(' + (-index * 100) + '% + ' + dx + 'px))';
      }
    });
    function end() {
      if (x0 === null) return;
      x0 = null;
      if (dragTrack) dragTrack.classList.remove('dragging');
      if (dx < -40) onLeft();
      else if (dx > 40) onRight();
      else go(index, true);
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', function () { dx = 0; end(); });
  }
  swipe($('viewer'), function () { go(index + 1); }, function () { go(index - 1); }, $('viewerTrack'));

  /* ---------- 공통: 글자 안전하게 넣기 · 복사 · 알림 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  function copy(text, msg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      toast(ok ? msg : '길게 눌러 직접 복사해 주세요');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast(msg); }, fallback);
    } else fallback();
  }

  var ICONS = {
    subway: '<rect x="5" y="3" width="14" height="14" rx="4"/><path d="M5 11h14M8.5 14h.01M15.5 14h.01M8 17l-2 4M16 17l2 4"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 19v2M17 19v2M5 11h14"/>',
    parking: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
    shuttle: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 10h16M8 18v3M16 18v3M8 14h.01M16 14h.01"/>',
    groom: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6"/>',
    bride: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-4 3.6-6 7-6s6.2 2 7 6M8.5 5.5C9 3 15 3 15.5 5.5"/>'
  };
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  function fold(icon, title, body) {
    return '<details class="fold"><summary><svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' +
      (ICONS[icon] || '') + '</svg>' + esc(title) + CHEV + '</summary><div class="fold-body">' + body + '</div></details>';
  }

  /* ---------- 오시는 길 ---------- */
  var VN = W.venue || {};
  $('venueName').textContent = VN.name + (VN.hall ? ' ' + VN.hall : '');
  $('venueAddr').textContent = VN.address;
  if (VN.tel) { $('venueTel').hidden = false; $('venueTel').textContent = VN.tel; }
  $('copyAddr').addEventListener('click', function () { copy(VN.address, '주소가 복사되었어요'); });

  // config.js 의 links 주소를 쓰고, 비어 있으면 예식장 이름으로 검색합니다.
  var q = encodeURIComponent(VN.name);
  var L = VN.links || {};
  $('mapLinks').innerHTML = [
    [L.naver || 'https://map.naver.com/p/search/' + q, '네이버 지도', '#03C75A', 'N'],
    [L.kakao || 'https://map.kakao.com/link/search/' + q, '카카오맵', '#FAE100', 'K'],
    [L.tmap || 'tmap://search?name=' + q, '티맵', '#EF3F48', 'T']
  ].map(function (l) {
    return '<a href="' + l[0] + '" target="_blank" rel="noopener"><i style="background:' + l[2] +
      (l[3] === 'K' ? ';color:#3A1D1D' : '') + '">' + l[3] + '</i>' + l[1] + '</a>';
  }).join('');

  $('directions').innerHTML = (W.directions || []).map(function (g) {
    return fold(g.icon, g.title, g.items.map(function (it) {
      return '<div class="dir-item"><h3' + (it.color ? ' style="color:' + esc(it.color) + '"' : '') + '>' + esc(it.label) + '</h3>' +
        it.lines.map(function (line) {
          return '<p>' + esc(line).split(' &gt; ').join('<span class="arrow">›</span>') + '</p>';
        }).join('') + '</div>';
    }).join(''));
  }).join('');

  // 약도 이미지 (지도 키 없이 쓰는 간단한 방법)
  if (VN.mapImage) {
    var mi = $('mapImage');
    mi.hidden = false;
    mi.href = L.naver || 'https://map.naver.com/p/search/' + q;
    mi.querySelector('img').src = VN.mapImage;
    $('mapFallback').hidden = true;
  }

  // 네이버 지도 (키가 있을 때만)
  window.navermap_authFailure = function () { /* 키 오류 시 대체 화면 유지 */ };
  if (VN.naverMapKey) {
    var s = document.createElement('script');
    s.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=' + encodeURIComponent(VN.naverMapKey) +
      (VN.lat && VN.lng ? '' : '&submodules=geocoder');
    s.onload = function () {
      var nm = window.naver && naver.maps;
      if (!nm) return;
      function draw(pos) {
        var el = document.createElement('div');
        el.className = 'map-canvas';
        $('map').appendChild(el);
        var map = new nm.Map(el, {
          center: pos, zoom: 16,
          zoomControl: true, zoomControlOptions: { position: nm.Position.TOP_RIGHT },
          scaleControl: false, mapDataControl: false
        });
        new nm.Marker({ position: pos, map: map });
        $('mapFallback').hidden = true;
        $('mapImage').hidden = true;
      }
      if (VN.lat && VN.lng) draw(new nm.LatLng(VN.lat, VN.lng));
      else if (nm.Service) {
        nm.Service.geocode({ query: VN.address }, function (status, res) {
          var a = status === nm.Service.Status.OK && res.v2 && res.v2.addresses[0];
          if (a) draw(new nm.LatLng(+a.y, +a.x));
        });
      }
    };
    document.head.appendChild(s);
  }

  /* ---------- 마음 전하실 곳 ---------- */
  var ACC = W.accounts || {};
  var accList = [];
  function accBody(rows) {
    return rows.map(function (r) {
      var i = accList.push(r) - 1;
      var has = r.bank && r.number;
      return '<div class="acc-row"><span class="acc-role">' + esc(r.role) + '</span>' +
        '<span class="acc-num' + (has ? '' : ' empty') + '">' +
        (has ? esc(r.bank) + ' ' + esc(r.number) : '계좌 입력 전') +
        (r.holder ? ' <span class="holder">(' + esc(r.holder) + ')</span>' : '') + '</span>' +
        '<button class="copy-btn" type="button" data-acc="' + i + '"' + (has ? '' : ' disabled') + '>복사</button></div>';
    }).join('');
  }
  $('accounts').innerHTML =
    fold('groom', '신랑 측 계좌번호', accBody(ACC.groom || [])) +
    fold('bride', '신부 측 계좌번호', accBody(ACC.bride || []));
  $('accounts').addEventListener('click', function (e) {
    var b = e.target.closest('.copy-btn');
    if (!b || b.disabled) return;
    var r = accList[+b.dataset.acc];
    copy(r.bank + ' ' + r.number, r.role + ' 계좌번호가 복사되었어요');
  });

  /* ---------- 스크롤하면 순서대로 나타나기 ---------- */
  (function () {
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm || !('IntersectionObserver' in window)) return;
    var items = [];
    document.querySelectorAll('.section, .film').forEach(function (sec) {
      Array.prototype.forEach.call(sec.children, function (el, i) {
        el.classList.add('reveal');
        el.style.setProperty('--i', Math.min(i, 6)); // 같은 구역 안에서는 위→아래로 조금씩 늦게
        items.push(el);
      });
    });
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 엔딩 크레딧 ---------- */
  var E = W.ending || {};
  if (E.photo) $('endingPhoto').src = E.photo;
  if (E.position) $('endingPhoto').style.objectPosition = E.position;
  if (E.speed) $('credits').style.setProperty('--roll', E.speed + 's');
  $('credits').innerHTML = (E.credits || []).map(function (c, i) {
    return '<div class="credit"><dt>' + esc(c[0]) + '</dt><dd>' + esc(c[1]) + '</dd></div>';
  }).join('');
  (function () {
    var end = $('ending');
    if (!('IntersectionObserver' in window)) { end.classList.add('rolling'); return; }
    var io = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      end.classList.add('rolling');   // 화면에 40% 이상 들어오면 크레딧 시작
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(end);
  })();

  /* ---------- 표지 엠보싱 테두리 (모서리가 안으로 파인 이중 선) ---------- */
  function drawFrame() {
    var svg = document.querySelector('.frame');
    var w = svg.clientWidth, h = svg.clientHeight;
    function path(inset, r) {
      var a = inset, b = w - inset, c = h - inset;
      return 'M' + (a + r) + ' ' + a + 'H' + (b - r) +
        'A' + r + ' ' + r + ' 0 0 0 ' + b + ' ' + (a + r) + 'V' + (c - r) +
        'A' + r + ' ' + r + ' 0 0 0 ' + (b - r) + ' ' + c + 'H' + (a + r) +
        'A' + r + ' ' + r + ' 0 0 0 ' + a + ' ' + (c - r) + 'V' + (a + r) +
        'A' + r + ' ' + r + ' 0 0 0 ' + (a + r) + ' ' + a + 'Z';
    }
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.innerHTML = '<path d="' + path(1, 22) + '"/><path class="inner" d="' + path(9, 15) + '"/>';
  }
  drawFrame();
  window.addEventListener('resize', drawFrame);
  if (window.ResizeObserver) new ResizeObserver(drawFrame).observe(document.querySelector('.card'));
})();
