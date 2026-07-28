// responsive-router.js — include in BOTH mobile.html and desktop.html
(function () {
    console.log("Hello from router.js");
  var BREAKPOINT = 600;
  var MOBILE_PAGE = '/mobile.html';
  var DESKTOP_PAGE = '/desktop.html';
  var onMobilePage = window.location.pathname.indexOf('mobile') !== -1;

  var mql = window.matchMedia('(max-width: ' + BREAKPOINT + 'px)');

  function routeIfWrong(shouldBeMobile) {
    if (shouldBeMobile && !onMobilePage) {
      window.location.replace(MOBILE_PAGE);
    } else if (!shouldBeMobile && onMobilePage) {
      window.location.replace(DESKTOP_PAGE);
    }
  }

  routeIfWrong(mql.matches);   // catches someone landing here directly, e.g. a bookmark
  mql.addEventListener('change', function (e) { routeIfWrong(e.matches); });
})();