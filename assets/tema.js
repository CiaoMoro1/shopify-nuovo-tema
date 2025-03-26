var script_loaded = false;

function loadJSscripts() {
  if (script_loaded) return;
  script_loaded = true;

  // Lazy load iframe
  document.querySelectorAll("iframe.lazy").forEach(el => {
    if (el.dataset.src) el.src = el.dataset.src;
  });

  // Lazy load script
  document.querySelectorAll("script").forEach(script => {
    if (script.dataset.src) {
      script.src = script.dataset.src;
      delete script.dataset.src;
    }
    if (script.type === "text/lazyload") {
      const newScript = document.createElement("script");
      for (let attr of script.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.type = "text/javascript";
      newScript.text = script.textContent;
      script.parentNode.insertBefore(newScript, script);
      script.remove();
    }
  });

  // Lazy load link (es. CSS)
  document.querySelectorAll("link").forEach(link => {
    if (link.dataset.href) {
      link.href = link.dataset.href;
      delete link.dataset.href;
    }
  });

  // Custom event
  document.dispatchEvent(new CustomEvent("asyncLazyLoad"));
}

[
  "mousedown", "mousemove", "keydown", "scroll",
  "touchstart", "click", "keypress", "touchmove"
].forEach(evt => {
  window.addEventListener(evt, loadJSscripts, { once: true });
});
