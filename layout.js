(function () {
  'use strict';

  var path = window.location.pathname;
  var hash = window.location.hash;

  var isIndex       = /index\.html$/.test(path) || /\/$/.test(path) || /site\/?$/.test(path);
  var isAfterschool = /afterschool(\.html)?|typing(\.html)?|programming(\.html)?|office(\.html)?|communication(\.html)?/.test(path);
  var isChild       = /child(care|-sensory|-language|-social|-itplay)?\.html/.test(path);
  var isContact     = /contact\.html/.test(path);

  /* ---- アクティブ状態を設定 ---- */
  function setActive() {
    document.querySelectorAll('.bm-nav__item[data-page]').forEach(function (a) {
      var page = a.getAttribute('data-page');
      if (
        (page === 'index'   && isIndex) ||
        (page === 'contact' && isContact)
      ) {
        a.classList.add('is-active');
      }
    });

    if (isAfterschool) {
      var t = document.querySelector('.bm-nav__toggle[data-group="afterschool"]');
      if (t) {
        var gh = t.closest('.bm-nav__group-header');
        (gh || t).classList.add('is-parent-active');
      }
      var st = document.querySelector('.bm-nav__subtoggle[data-group="overview"]');
      if (st) st.classList.add('is-parent-active');
    }
    if (isChild) {
      var tc = document.querySelector('.bm-nav__toggle[data-group="child"]');
      if (tc) {
        var ghc = tc.closest('.bm-nav__group-header');
        (ghc || tc).classList.add('is-parent-active');
      }
    }

    // サブアイテム・深いリンクのアクティブ
    document.querySelectorAll('.bm-nav__subitem[data-hash], .bm-nav__deepitem[data-hash]').forEach(function (a) {
      var itemHash  = a.getAttribute('data-hash');
      var itemGroup = a.getAttribute('data-group');
      var active = false;
      if (itemGroup === 'afterschool' && isAfterschool) {
        active = hash ? hash === itemHash : itemHash === '#overview';
      }
      if (itemGroup === 'child' && isChild) {
        active = hash ? hash === itemHash : itemHash === '#overview';
      }
      if (active) a.classList.add('is-active');
    });
  }

  /* ---- 汎用トグル開閉（第1・第2階層共通） ---- */
  function bindToggle(btn) {
    var group   = btn.closest('.bm-nav__group');
    var subId   = btn.getAttribute('data-target');
    var subList = subId ? document.getElementById(subId) : null;
    if (!group || !subList) return;

    var groupName = btn.getAttribute('data-group');

    // 初期状態
    var startOpen =
      (isAfterschool && groupName === 'afterschool') ||
      (isAfterschool && groupName === 'overview') ||
      (isChild       && groupName === 'child');

    if (startOpen) {
      group.classList.add('is-open');
      subList.style.maxHeight = subList.scrollHeight + 'px';
      setTimeout(function () { subList.style.maxHeight = 'none'; }, 400);
    } else {
      subList.style.maxHeight = '0';
    }

    btn.addEventListener('click', function () {
      var isOpen = group.classList.contains('is-open');
      if (isOpen) {
        subList.style.maxHeight = subList.scrollHeight + 'px';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            subList.style.maxHeight = '0';
            group.classList.remove('is-open');
          });
        });
      } else {
        group.classList.add('is-open');
        subList.style.maxHeight = subList.scrollHeight + 'px';
        setTimeout(function () { subList.style.maxHeight = 'none'; }, 400);
      }
    });
  }

  function setupToggle() {
    document.querySelectorAll('.bm-nav__toggle, .bm-nav__subtoggle').forEach(bindToggle);
  }

  /* ---- スクロール追随（IntersectionObserver） ---- */
  function setupObserver() {
    if (!window.IntersectionObserver) return;
    var sections = document.querySelectorAll('[data-section]');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.getAttribute('data-section');
        document.querySelectorAll('.bm-nav__subitem[data-hash], .bm-nav__deepitem[data-hash]').forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-hash') === id);
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---- ページスワイプナビゲーション ---- */
  function setupSwipe() {
    var pages = ['index.html', 'afterschool.html', 'contact.html'];
    var currentIdx = isIndex ? 0 : isAfterschool ? 1 : isContact ? 2 : -1;
    if (currentIdx === -1) return;

    var startX = 0, startY = 0, startTime = 0;

    document.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      var dt = Date.now() - startTime;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50 && dt < 300) {
        var next = dx < 0 ? currentIdx + 1 : currentIdx - 1;
        if (next >= 0 && next < pages.length) {
          var dir = dx < 0 ? -1 : 1;
          var layout = document.querySelector('.bm-layout');
          if (layout) {
            layout.style.transition = 'transform .25s ease, opacity .25s ease';
            layout.style.transform = 'translateX(' + (dir * -60) + 'px)';
            layout.style.opacity = '0';
          }
          setTimeout(function () { window.location.href = './' + pages[next]; }, 220);
        }
      }
    }, { passive: true });
  }

  /* ---- フッター（index 以外に表示） ---- */
  function setupFooter() {
    if (isIndex) return; // スナップスクロールページはフッター非表示

    var logoImg = document.querySelector('.bm-left .bm-logo img');
    var logoSrc = logoImg ? logoImg.src : '';

    var footer = document.createElement('footer');
    footer.className = 'bm-footer';
    footer.innerHTML = [
      '<div class="bm-footer__inner">',

        /* ブランド */
        '<div class="bm-footer__brand">',
          '<a class="bm-footer__logo" href="./index.html">',
            '<img src="' + logoSrc + '" alt="BLUE MOUSE" />',
          '</a>',
          '<p class="bm-footer__tagline">',
            'ITを活用した療育で、<br>',
            'ひとりひとりの可能性を広げる。<br>',
            '岡山市の放課後等デイサービス・<br>',
            '児童発達支援事業所。',
          '</p>',
          '<a class="bm-footer__insta" href="https://www.instagram.com/blue_mouse_okayama/" target="_blank" rel="noopener">',
            '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
            '@blue_mouse_okayama',
          '</a>',
        '</div>',

        /* サイトマップ */
        '<div>',
          '<p class="bm-footer__col-title">Pages</p>',
          '<ul class="bm-footer__navlist">',
            '<li><a href="./index.html">Front</a></li>',
            '<li><a href="./afterschool.html">放課後等デイサービス</a></li>',
            '<li><a href="./child.html">児童発達支援事業</a></li>',
            '<li><a href="./contact.html">お問い合わせ</a></li>',
          '</ul>',
        '</div>',

        /* 事業所情報 */
        '<div>',
          '<p class="bm-footer__col-title">Facility</p>',
          '<div class="bm-footer__fac">',
            '<p class="bm-footer__fac-name">BLUE MOUSE</p>',
            '<p class="bm-footer__fac-type">放課後等デイサービス</p>',
            '<p class="bm-footer__fac-info">',
              '岡山県岡山市中区<br>徳吉町二丁目11番地25<br>',
              'TEL: 086-273-3880',
            '</p>',
          '</div>',
          '<div class="bm-footer__fac">',
            '<p class="bm-footer__fac-name">LITTLE BLUE MOUSE</p>',
            '<p class="bm-footer__fac-type">児童発達支援事業</p>',
            '<p class="bm-footer__fac-info">',
              '岡山県岡山市北区<br>辰巳２６−１０２',
            '</p>',
          '</div>',
        '</div>',

      '</div>',
      '<p class="bm-footer__bottom">',
        '© ' + new Date().getFullYear() + ' 合同会社C EIGHTY PERCENT All Rights Reserved.',
      '</p>',
    ].join('');

    var layout = document.querySelector('.bm-layout');
    // トップページは body が overflow:hidden で .bm-main が独自スクロールのため
    // フッターを .bm-main の末尾に入れてスクロールで届くようにする
    if (isIndex) {
      var main = document.querySelector('.bm-main');
      if (main) main.appendChild(footer);
    } else {
      if (layout) layout.parentNode.insertBefore(footer, layout.nextSibling);
    }
  }

  /* ---- 左サイドバーにInstagramリンク追加（削除済み） ---- */
  function setupSidebarInsta() {}

  /* ---- モバイルヘッダー & ハンバーガードロワー ---- */
  function setupMobileHeader() {
    // ロゴ情報を左サイドバーから取得
    var logoLink = document.querySelector('.bm-left .bm-logo');
    var logoImg  = logoLink ? logoLink.querySelector('img') : null;
    var logoSrc  = logoImg  ? logoImg.src  : '';
    var logoHref = logoLink ? logoLink.getAttribute('href') : './index.html';

    // ヘッダー生成
    var header = document.createElement('header');
    header.className = 'bm-mobile-header' + (isIndex ? ' bm-mobile-header--hero' : '');
    header.innerHTML =
      '<a class="bm-mobile-header__logo" href="' + logoHref + '">' +
        '<img src="' + logoSrc + '" alt="BLUE MOUSE" />' +
      '</a>' +
      '<button type="button" class="bm-hamburger" id="bm-hamburger" aria-label="メニューを開く">' +
        '<span></span><span></span><span></span>' +
      '</button>';
    document.body.insertBefore(header, document.body.firstChild);

    // オーバーレイ生成
    var overlay = document.createElement('div');
    overlay.className = 'bm-drawer-overlay';
    overlay.id = 'bm-drawer-overlay';
    document.body.appendChild(overlay);

    var drawer = document.querySelector('.bm-left');
    var btn    = document.getElementById('bm-hamburger');

    function openDrawer() {
      drawer.classList.add('is-open');
      btn.classList.add('is-open');
      btn.setAttribute('aria-label', 'メニューを閉じる');
      overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('drawer-open');
    }
    function closeDrawer() {
      drawer.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-label', 'メニューを開く');
      overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
      document.body.classList.remove('drawer-open');
    }

    btn.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) closeDrawer();
      else openDrawer();
    });
    overlay.addEventListener('click', closeDrawer);

    // ドロワー内リンクをタップしたら閉じる
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  /* ---- カスタムカーソル ---- */
  function setupCursor() {
    // タッチデバイスはスキップ
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var dot  = document.createElement('div');
    dot.id   = 'bm-cursor';
    var ring = document.createElement('div');
    ring.id  = 'bm-cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -100, my = -100; // 画面外で初期化
    var rx = -100, ry = -100;

    // ドット：マウスに即追従
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // リング：少し遅れて追従（慣性感）
    (function loop() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    })();

    // ホバー
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button')) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button')) document.body.classList.remove('cursor-hover');
    });

    // ページ外
    document.addEventListener('mouseleave', function () { document.body.classList.add('cursor-out'); });
    document.addEventListener('mouseenter', function () { document.body.classList.remove('cursor-out'); });
  }

  /* ---- ロゴアニメーション（1文字ずつ切り替え・PC＋スマホ同期） ---- */
  function setupLogoAnimation() {
    var BADGE_FILES = [
      './badges/badge-B.png',
      './badges/badge-L.png',
      './badges/badge-U3.png',
      './badges/badge-E4.png',
      './badges/badge-M.png',
      './badges/badge-O.png',
      './badges/badge-U7.png',
      './badges/badge-S.png',
      './badges/badge-E9.png',
    ];
    var LETTERS = 'BLUEMOUSE';
    var N = BADGE_FILES.length;

    /* モバイルヘッダーのみを対象にする（ヒーローバッジはindex.html内の独立スクリプトで制御） */
    var TARGETS = [
      { selector: '.bm-mobile-header__logo',  size: 40, logoW: 'auto',  logoH: '34px', noLogo: true },
    ];

    /* 各ターゲットに要素を生成 */
    var instances = [];
    TARGETS.forEach(function(t) {
      var link = document.querySelector(t.selector);
      if (!link) return;
      var logoImg = link.querySelector('img');
      if (!logoImg) return;

      /* 既存ロゴを非表示に（バッジ完走後に再表示） */
      logoImg.style.cssText = [
        'display:none',
        'width:' + t.logoW, 'height:' + t.logoH, 'opacity:0',
        'transition:opacity .55s ease, transform .55s cubic-bezier(.34,1.56,.64,1)',
        'pointer-events:none',
      ].join(';');
      link.href = './index.html';

      /* バッジを重ねるコンテナ */
      var sz = t.size;
      var wrap = document.createElement('div');
      wrap.style.cssText = [
        'position:relative', 'display:block',
        'width:' + sz + 'px', 'height:' + sz + 'px',
        'cursor:pointer', 'flex-shrink:0',
      ].join(';');
      link.appendChild(wrap);

      /* バッジ画像を絶対配置で全部生成 */
      var badgeEls = BADGE_FILES.map(function(src, i) {
        var el = document.createElement('img');
        el.src = src; el.alt = LETTERS[i]; el.draggable = false;
        el.style.cssText = [
          'position:absolute', 'top:0', 'left:0',
          'border-radius:50%', 'display:block',
          'width:' + sz + 'px', 'height:' + sz + 'px',
          'opacity:0', 'transform:scale(0)',
          'pointer-events:none', 'user-select:none',
        ].join(';');
        wrap.appendChild(el);
        return el;
      });

      instances.push({ logoImg: logoImg, badgeEls: badgeEls, noLogo: !!t.noLogo });
    });

    if (instances.length === 0) return;

    var currentIdx = -1;
    var busy       = false;

    /* ---- 全インスタンスの idx 番バッジを入場 ---- */
    function enterAll(idx, cb) {
      instances.forEach(function(inst) {
        var el = inst.badgeEls[idx];
        el.style.transition = 'none';
        el.style.opacity    = '0';
        el.style.transform  = 'scale(0)';
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            /* オーバーシュートでポンッと登場 */
            el.style.transition = [
              'transform .55s cubic-bezier(.34,2,.64,1)',
              'opacity .2s ease',
            ].join(',');
            el.style.opacity   = '1';
            el.style.transform = 'scale(1)';
          });
        });
      });
      if (cb) setTimeout(cb, 580);
    }

    /* ---- 全インスタンスの idx 番バッジを退場 ---- */
    function exitAll(idx, cb) {
      if (idx < 0) { if (cb) cb(); return; }
      instances.forEach(function(inst) {
        var el = inst.badgeEls[idx];
        el.style.transition = 'transform .2s ease-in, opacity .18s ease';
        el.style.opacity    = '0';
        el.style.transform  = 'scale(0)';
      });
      setTimeout(function() {
        instances.forEach(function(inst) {
          inst.badgeEls[idx].style.transition = 'none';
        });
        if (cb) cb();
      }, 220);
    }

    /* ---- 全インスタンスのロゴを表示／非表示 ---- */
    function showLogo() {
      instances.forEach(function(inst) {
        if (inst.noLogo) return; /* noLogo インスタンスはワードマーク非表示 */
        inst.logoImg.style.transition = 'none';
        inst.logoImg.style.transform  = 'scale(0.72) translateY(8px)';
        inst.logoImg.style.opacity    = '0';
        inst.logoImg.style.display    = 'block';
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            inst.logoImg.style.transition = 'opacity .55s ease, transform .55s cubic-bezier(.34,1.56,.64,1)';
            inst.logoImg.style.opacity    = '1';
            inst.logoImg.style.transform  = 'scale(1) translateY(0px)';
          });
        });
      });
    }

    function hideLogo(cb) {
      var visible = instances.filter(function(inst) { return !inst.noLogo; });
      if (visible.length === 0) { if (cb) cb(); return; }
      visible.forEach(function(inst) {
        inst.logoImg.style.opacity   = '0';
        inst.logoImg.style.transform = 'scale(0.72) translateY(8px)';
      });
      setTimeout(function() {
        visible.forEach(function(inst) { inst.logoImg.style.display = 'none'; });
        if (cb) cb();
      }, 580);
    }

    /* ---- 次の文字へ進む ---- */
    function advance() {
      if (busy) return;
      busy = true;
      var nextIdx = (currentIdx + 1 >= N) ? 0 : currentIdx + 1;

      /* 最後(E)が終わったらロゴ表示→再スタート */
      if (currentIdx === N - 1) {
        showLogoThenRestart();
        return;
      }

      exitAll(currentIdx, function() {
        currentIdx = nextIdx;
        enterAll(currentIdx, function() {
          busy = false;
        });
      });
    }

    /* ---- バッジ完走 → ロゴ5秒 → Bから再スタート ---- */
    function showLogoThenRestart() {
      exitAll(currentIdx, function() {
        currentIdx = -1;
        var hasVisible = instances.some(function(inst) { return !inst.noLogo; });
        if (!hasVisible) {
          /* 全インスタンスがnoLogo → ワードマーク表示スキップしてすぐ再スタート */
          enterAll(0, function() { currentIdx = 0; busy = false; });
          return;
        }
        showLogo();
        setTimeout(function() {
          hideLogo(function() {
            currentIdx = -1;
            enterAll(0, function() {
              currentIdx = 0;
              busy = false;
            });
          });
        }, 5000);
      });
    }

    /* 起動 */
    setTimeout(function() {
      enterAll(0, function() {
        currentIdx = 0;
        busy = false;
      });
    }, 200);

    /* 2秒ごとに自動で次へ */
    setInterval(function() {
      if (busy) return;
      advance();
    }, 2000);

    /* どこかクリック → すぐ次の文字へ */
    document.addEventListener('click', function(e) {
      if (e.target.closest('.bm-logo') || e.target.closest('.bm-mobile-header__logo')) return;
      advance();
    });
  }

  /* ===== モバイル INFO ドロワー ===== */
  function setupInfoDrawer() {
    var drawer = document.querySelector('.bm-right');
    if (!drawer) return;

    /* 閉じるボタンを追加（まだなければ） */
    if (!drawer.querySelector('.bm-drawer-close')) {
      var closeBtn = document.createElement('button');
      closeBtn.className = 'bm-drawer-close';
      closeBtn.setAttribute('aria-label', '閉じる');
      closeBtn.innerHTML = '&times;';
      drawer.insertBefore(closeBtn, drawer.firstChild);
    }

    /* オーバーレイを追加（まだなければ） */
    var overlay = document.getElementById('bm-info-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bm-info-overlay';
      overlay.className = 'bm-info-overlay';
      document.body.appendChild(overlay);
    }

    /* FABボタンを追加（まだなければ） */
    var fab = document.getElementById('bm-info-fab');
    if (!fab) {
      fab = document.createElement('button');
      fab.id = 'bm-info-fab';
      fab.className = 'bm-info-fab';
      fab.setAttribute('aria-label', 'サービス情報');
      fab.innerHTML =
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/>' +
        '<line x1="12" y1="8" x2="12" y2="8"/>' +
        '<line x1="12" y1="12" x2="12" y2="16"/></svg>' +
        '<span class="bm-info-fab__label">info</span>';
      document.body.appendChild(fab);
    }

    function openDrawer() {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    fab.addEventListener('click', openDrawer);
    overlay.addEventListener('click', closeDrawer);
    drawer.querySelector('.bm-drawer-close').addEventListener('click', closeDrawer);
  }

  /* ---- PWA メタタグ / manifest を全ページに注入 ---- */
  function setupPWA() {
    var head = document.head;
    var base = (function() {
      var p = window.location.pathname;
      var m = p.match(/^\/([-\w]+)\//);
      return m ? '/' + m[1] + '/' : '/';
    })();

    function addMeta(name, content) {
      if (document.querySelector('meta[name="' + name + '"]')) return;
      var m = document.createElement('meta');
      m.name = name; m.content = content;
      head.appendChild(m);
    }
    function addLink(rel, href, extra) {
      if (document.querySelector('link[rel="' + rel + '"]')) return;
      var l = document.createElement('link');
      l.rel = rel; l.href = href;
      if (extra) Object.keys(extra).forEach(function(k){ l[k] = extra[k]; });
      head.appendChild(l);
    }

    addLink('manifest', base + 'manifest.json');
    addMeta('apple-mobile-web-app-capable', 'yes');
    addMeta('apple-mobile-web-app-status-bar-style', 'default');
    addMeta('apple-mobile-web-app-title', 'BLUE MOUSE');
    addLink('apple-touch-icon', base + 'logo.png');
  }

  function init() {
    setupPWA();
    setActive();
    setupToggle();
    setupObserver();
    setupSwipe();
    // setupCursor(); /* 一時無効化 */
    setupSidebarInsta();
    setupFooter();
    setupMobileHeader();
    setupLogoAnimation();
    setupInfoDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
