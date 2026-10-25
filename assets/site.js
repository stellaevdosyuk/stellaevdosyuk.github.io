(() => {
  // Table of contents: always open on desktop, collapsible on phones,
  // with the current section highlighted while scrolling.
  const toc = document.querySelector(".toc");
  if (toc) {
    const desktop = matchMedia("(min-width: 960px)");
    const sync = () => {
      toc.open = desktop.matches;
    };
    sync();
    desktop.addEventListener("change", sync);

    toc.querySelector("summary").addEventListener("click", (event) => {
      if (desktop.matches) event.preventDefault();
    });

    toc.addEventListener("click", (event) => {
      if (event.target.closest("a") && !desktop.matches) toc.open = false;
    });

    const links = new Map(
      [...toc.querySelectorAll('a[href^="#"]')].map((a) => [a.hash.slice(1), a])
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          links.forEach((a) => a.classList.remove("is-active"));
          links.get(entry.target.id)?.classList.add("is-active");
        }
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    links.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  // Reading progress bar on long documents.
  const bar = document.querySelector(".progress span");
  if (bar) {
    const update = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      bar.style.transform = `scaleX(${max > 0 ? root.scrollTop / max : 0})`;
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
  }

  // "Copy email" buttons.
  document.querySelectorAll("[data-copy]").forEach((button) => {
    const label = button.querySelector("span");
    const original = label.textContent;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        label.textContent = "Copied";
      } catch {
        label.textContent = button.dataset.copy;
      }
      setTimeout(() => {
        label.textContent = original;
      }, 2000);
    });
  });
})();
