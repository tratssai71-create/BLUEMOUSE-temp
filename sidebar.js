(function () {
  'use strict';

  var path = window.location.pathname;
  var isIndex        = /index\.html$/.test(path) || /\/$/.test(path) || /site\/?$/.test(path);
  var isAfterschool  = /afterschool\.html/.test(path);
  var isChildcare    = /childcare\.html/.test(path);
  var isContact      = /contact\.html/.test(path);
  var isAbout        = /about\.html/.test(path);

  /* ---- サブアイテム生成 ---- */
  function sub(href, label, isParent) {
    var hash = href.indexOf('#') >= 0 ? '#' + href.split('#')[1] : '';
    return '<li><a href="' + href + '" class="snav-sub__item" data-hash="' + hash + '">' + label + '</a></li>';
  }

  /* ---- サイドバー HTML 生成 ---- */
  function buildHTML() {
    return (
      '<aside class="snav" id="snav">' +
        '<div class="snav__inner">' +
          '<ul class="snav__list">' +

            // トップ
            '<li>' +
              '<a href="./index.html" class="snav__item' + (isIndex ? ' is-active' : '') + '">トップページ</a>' +
            '</li>' +

            // 放課後等デイサービス
            '<li class="snav__group' + (isAfterschool ? ' is-open' : '') + '">' +
              '<button type="button" class="snav__toggle' + (isAfterschool ? ' is-parent-active' : '') + '" data-target="snav-after">' +
                '<span class="snav__toggle-label">放課後等デイサービス</span>' +
                '<span class="snav__arrow"></span>' +
              '</button>' +
              '<ul class="snav-sub" id="snav-after">' +
                sub('./afterschool.html#overview',    '事業内容',           isAfterschool) +
                sub('./afterschool.html#schedule',    '1日のスケジュール',   isAfterschool) +
                sub('./afterschool.html#activities',  '活動内容',           isAfterschool) +
                sub('./afterschool.html#pricing',     '料金表',             isAfterschool) +
                sub('./afterschool.html#faq',         'よくある質問',       isAfterschool) +
              '</ul>' +
            '</li>' +

            // 児童発達支援事業
            '<li class="snav__group' + (isChildcare ? ' is-open' : '') + '">' +
              '<button type="button" class="snav__toggle' + (isChildcare ? ' is-parent-active' : '') + '" data-target="snav-child">' +
                '<span class="snav__toggle-label">児童発達支援事業</span>' +
                '<span class="snav__arrow"></span>' +
              '</button>' +
              '<ul class="snav-sub" id="snav-child">' +
                sub('./childcare.html#overview',  '事業内容',         isChildcare) +
                sub('./childcare.html#schedule',  '1日のスケジュール', isChildcare) +
                sub('./childcare.html#program',   'プログラム内容',   isChildcare) +
                sub('./childcare.html#pricing',   '料金表',           isChildcare) +
                sub('./childcare.html#faq',       'よくある質問',     isChildcare) +
              '</ul>' +
            '</li>' +

            // お問い合わせ
            '<li>' +
              '<a href="./contact.html" class="snav__item' + (isContact ? ' is-active' : '') + '">お問い合わせ</a>' +
            '</li>' +

            // 会社概要
            '<li>' +
              '<a href="./about.html" class="snav__item' + (isAbout ? ' is-active' : '') + '">会社概要</a>' +
            '</li>' +

          '</ul>' +
        '</div>' +
      '</aside>'
    );
  }

  /* ---- トグル開閉 ---- */
  function setupToggle(group, subList) {
    var isOpen = group.classList.contains('is-open');
    subList.style.maxHeight  = isOpen ? subList.scrollHeight + 'px' : '0';
    subList.style.overflow   = 'hidden';
    subList.style.transition = 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)';
    if (isOpen) {
      // 開いた後は制約をなくして中身が増えても崩れないようにする
      setTimeout(function () { subList.style.maxHeight = 'none'; }, 360);
    }

    var btn = group.querySelector('.snav__toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = group.classList.contains('is-open');
      if (open) {
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
        setTimeout(function () { subList.style.maxHeight = 'none'; }, 360);
      }
    });
  }

  /* ---- IntersectionObserver でスクロール追随 ---- */
  function setupObserver(sidebar) {
    if (!window.IntersectionObserver) return;
    var sections = document.querySelectorAll('[data-section-id]');
    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('data-section-id');
        var hash = '#' + id;
        sidebar.querySelectorAll('.snav-sub__item').forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-hash') === hash);
        });
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---- 初期化 ---- */
  function init() {
    var pageBody = document.querySelector('.page-body');
    if (!pageBody) return;

    pageBody.insertAdjacentHTML('afterbegin', buildHTML());

    var sidebar = document.getElementById('snav');
    if (!sidebar) return;

    // 各グループのトグルセットアップ
    sidebar.querySelectorAll('.snav__group').forEach(function (group) {
      var targetId = group.querySelector('.snav__toggle') && group.querySelector('.snav__toggle').getAttribute('data-target');
      var subList  = targetId && document.getElementById(targetId);
      if (subList) setupToggle(group, subList);
    });

    setupObserver(sidebar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
