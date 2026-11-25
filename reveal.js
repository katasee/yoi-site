(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  var items = document.querySelectorAll(".section-head, .grid > .card, .privacy-box, .checks li, .final .wrap > *");
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px" });
  items.forEach(function (item) {
    var siblings = Array.prototype.indexOf.call(item.parentNode.children, item);
    item.style.setProperty("--delay", Math.min(siblings, 5) * 90 + "ms");
    item.classList.add("reveal");
    observer.observe(item);
  });
})();

