(() => {
  const C = window.GREETING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.registerPlugin(ScrollTrigger);

  // --- Textos derivados de la configuración ---
  const sendersLine = `Od ${C.senders[0]} a ${C.senders[1]}`;
  const sendersSignature = `${C.senders[0]} & ${C.senders[1]}`;
  const sendersCaps = `${C.senders[0]} · ${C.senders[1]}`;
  const texts = {
    eyebrow: C.hero.eyebrow,
    heroTitle: C.hero.title,
    heroSubtitle: C.hero.subtitle,
    sendersLine,
    sendersSignature,
    sendersCaps,
    season: C.season,
    monogram: C.monogram,
    letterTitle: C.letter.title,
    letterClosing: C.letter.closing,
    wishesHeading: C.wishesHeading,
    toastHeading: C.toast.heading,
    toastBody: C.toast.body,
    toastButton: C.toast.buttonLabel
  };
  $$("[data-text]").forEach(el => {
    if (texts[el.dataset.text] !== undefined) el.textContent = texts[el.dataset.text];
  });
  $(".draft").hidden = !C.draft;

  // --- Carta ---
  const letterBody = $("#letterBody");
  C.letter.paragraphs.forEach(text => {
    const p = document.createElement("p");
    p.className = "reveal";
    p.textContent = text;
    letterBody.append(p);
  });

  // --- Deseos (timeline vertical con animación al hacer scroll) ---
  const icon = name => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const tl = $("#timeline");
  C.wishes.forEach(({ title, detail, icon: name }) => {
    const li = document.createElement("li");
    li.className = "reveal";
    li.innerHTML = `<span class="dot"></span>${icon(name)}<span><span class="wish-title"></span><span class="wish-detail"></span></span>`;
    $(".wish-title", li).textContent = title;
    $(".wish-detail", li).textContent = detail;
    tl.append(li);
  });
  const line = document.createElement("div");
  line.className = "line";
  line.setAttribute("aria-hidden", "true");
  tl.append(line);
  const dots = $$(".dot", tl);
  const placeLine = () => {
    if (dots.length < 2) return;
    // Usamos offsetTop del <li> + del punto para ignorar desplazamientos temporales de GSAP.
    const center = d => {
      const li = d.closest("li");
      return (li ? li.offsetTop : 0) + d.offsetTop + d.offsetHeight / 2;
    };
    line.style.top = center(dots[0]) + "px";
    line.style.height = Math.max(0, center(dots[dots.length - 1]) - center(dots[0])) + "px";
  };

  // --- Bordes rasgados de papel ---
  $$("[data-edge]").forEach((el, n) => {
    let seed = n * 97 + 19;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    let tear = "", fibre = "";
    for (let x = 0; x <= 100; x += 2.5) {
      const y = 6 + rnd() * 7;
      tear += ` ${x},${y.toFixed(1)}`;
      fibre += ` ${x},${(y - 2 - rnd() * 2).toFixed(1)}`;
    }
    el.innerHTML = `<svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><polygon fill="#fffdf8" points="0,20${fibre} 100,20"/><polygon fill="${el.dataset.edge}" points="0,20${tear} 100,20"/></svg>`;
  });

  // --- Cuenta atrás inteligente (Navidad -> Año Nuevo -> Felicitación) ---
  const xmasDate = new Date(C.countdown.christmas);
  const nyDate = new Date(C.countdown.newYear);
  const cd = $("#countdown");
  const cdTitle = $("#countdownTitle");
  const units = ["Dní", "Hodin", "Minut", "Sekund"].map(label => {
    const wrap = document.createElement("div");
    wrap.className = "unit";
    wrap.innerHTML = `<span class="num" aria-hidden="true"><span class="val"></span></span><span class="lbl" aria-hidden="true"></span>`;
    $(".lbl", wrap).textContent = label;
    cd.append(wrap);
    return { val: $(".val", wrap), num: $(".num", wrap) };
  });

  function setUnit(u, v) {
    if (u.val.textContent === v) return;
    const old = u.val.textContent;
    u.val.textContent = v;
    if (reduced || !old) return;
    const ghost = document.createElement("span");
    ghost.className = "ghost";
    ghost.textContent = old;
    u.num.append(ghost);
    gsap.to(ghost, { y: "-55%", opacity: 0, filter: "blur(3px)", duration: 0.28, ease: "power1.in", onComplete: () => ghost.remove() });
    gsap.fromTo(u.val, { y: "45%", opacity: 0.25, filter: "blur(2px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.28, ease: "power2.out", overwrite: true });
  }

  let cdTimer, lastLabel = "";
  function tick() {
    const now = Date.now();
    let target = xmasDate;
    let phaseLabel = "Odpočet do Vánoc";

    if (now >= xmasDate.getTime() && now < nyDate.getTime()) {
      target = nyDate;
      phaseLabel = "Odpočet do Nového roku 2027";
    }

    if (now >= nyDate.getTime()) {
      clearInterval(cdTimer);
      cdTitle.hidden = true;
      cd.innerHTML = `<p class="count-done">Šťastný nový rok 2027!</p>`;
      cd.removeAttribute("aria-label");
      return;
    }

    cdTitle.textContent = phaseLabel;
    const diff = target.getTime() - now;
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor(s / 3600) % 24;
    const m = Math.floor(s / 60) % 60;
    const sec = s % 60;
    const p2 = v => String(v).padStart(2, "0");
    [String(d), p2(h), p2(m), p2(sec)].forEach((v, i) => setUnit(units[i], v));
    const label = `${phaseLabel}: zbývá ${d} dní, ${h} hodin a ${m} minut`;
    if (label !== lastLabel) cd.setAttribute("aria-label", (lastLabel = label));
  }
  tick();
  cdTimer = setInterval(tick, 1000);

  // --- Nieve / destellos invernales muy sutiles ---
  function initSnow() {
    if (reduced) return;
    const canvas = $("#snow");
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, raf = 0;
    const flakes = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.9 + Math.random() * 1.9,
      vy: 0.18 + Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() < 0.32
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    let active = true;
    document.addEventListener("visibilitychange", () => {
      active = !document.hidden;
      if (active) raf = requestAnimationFrame(draw);
    });

    function draw(t) {
      if (!active) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy / Math.max(h, 500);
        f.x += (f.vx + Math.sin(t * 0.0006 + f.phase) * 0.14) / Math.max(w, 360);
        if (f.y > 1.02) { f.y = -0.02; f.x = Math.random(); }
        if (f.x > 1.02) f.x = -0.02;
        if (f.x < -0.02) f.x = 1.02;

        ctx.beginPath();
        ctx.arc(f.x * w, f.y * h, f.r, 0, Math.PI * 2);
        ctx.fillStyle = f.gold ? "rgba(222, 192, 128, 0.52)" : "rgba(255, 251, 242, 0.55)";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
  }

  // --- Animaciones ligadas al scroll ---
  function setupScroll() {
    placeLine();
    ScrollTrigger.addEventListener("refresh", placeLine);
    if (reduced) return;
    $$(".reveal").forEach(el =>
      gsap.from(el, { y: 20, opacity: 0, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } })
    );
    gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: tl, start: "top 72%", end: "bottom 72%", scrub: 0.35 } });
    gsap.fromTo("#fotoImg", { yPercent: -4 }, { yPercent: 4, ease: "none", scrollTrigger: { trigger: "#foto", start: "top bottom", end: "bottom top", scrub: true } });
  }

  // --- Apertura 3D del sobre ---
  const intro = $("#intro"), stage = $("#envStage"), sealBtn = $("#seal"), hint = $("#hint"), video = $("#introVideo");
  let opening = false, finished = false, fading = false, master = null;
  const store = {
    get() { try { return sessionStorage.getItem("vanocni-prani-otevreno") === "1"; } catch { return false; } },
    set() { try { sessionStorage.setItem("vanocni-prani-otevreno", "1"); } catch {} }
  };

  // Mantiene el escenario 3D exactamente en proporción 768x1376 cubriendo el contenedor.
  function fitStage() {
    if (!stage || intro.style.display === "none") return;
    const iw = intro.clientWidth, ih = intro.clientHeight;
    if (!iw || !ih) return;
    const ratio = 768 / 1376;
    const sw = (iw / ih > ratio) ? iw : ih * ratio;
    const sh = (iw / ih > ratio) ? iw / ratio : ih;
    stage.style.width = sw + "px";
    stage.style.height = sh + "px";
  }
  fitStage();
  addEventListener("resize", fitStage);

  function showHero(animate) {
    if (animate && !reduced) {
      gsap.fromTo("[data-hero]", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0, stagger: 0.14, ease: "power2.out" });
    } else {
      gsap.set("[data-hero]", { y: 0, opacity: 1 });
    }
  }

  function finish() {
    if (finished) return;
    finished = true;
    if (master) master.kill();
    video.pause();
    intro.style.display = "none";
    document.body.classList.remove("locked");
    store.set();
    if (!fading) showHero(false);
    initSnow();
    ScrollTrigger.refresh();
  }

  function fadeOut() {
    if (fading || finished) return;
    fading = true;
    gsap.to(intro, { opacity: 0, duration: 0.55, ease: "power1.inOut", onComplete: finish });
    showHero(true);
    setTimeout(() => {
      finish();
      showHero(false);
    }, 1400);
  }

  // Apertura física 3D: brillo dorado bajo el sello -> la solapa superior se levanta con el sello ->
  // las solapas laterales e inferior se abren revelando directamente la portada navideña.
  function layeredOpening() {
    fitStage();
    master = gsap.timeline({ onComplete: finish });

    // 1. El sello cede al toque y libera un destello dorado; la foto cerrada da paso sin corte a las solapas 3D.
    master
      .to("#sealImg", { scale: 0.94, duration: 0.13, ease: "power2.in" }, 0)
      .to("#sealImg", { scale: 1.02, duration: 0.24, ease: "power2.out" }, 0.13)
      .to("#envClosed", { opacity: 0, duration: 0.26, ease: "sine.inOut" }, 0.08)
      .to("#sealHalo", { opacity: 1, scale: 1.15, duration: 0.45, ease: "sine.out" }, 0.1)
      .to("#skip", { opacity: 0, duration: 0.32 }, 0.12)

    // 2. La solapa superior con el sello de lacre se levanta suavemente en 3D descubriendo el forro verde.
      .to("#flapTopWrap", { rotateX: 108, duration: 1.18, ease: "power2.inOut" }, 0.36)
      .to("#flapTopWrap", { opacity: 0, duration: 0.24, ease: "power1.in" }, 1.24)
      .to("#sealHalo", { opacity: 0, duration: 0.45, ease: "sine.in" }, 0.8)

    // 3. El resplandor dorado crece en la rendija central y las solapas laterales e inferior se abren en 3D.
      .to("#seamGlow", { opacity: 1, scale: 1.18, duration: 0.72, ease: "sine.inOut" }, 0.95)
      .to("#flapLeft", { rotateY: -102, xPercent: -8, duration: 1.2, ease: "power2.inOut" }, 1.35)
      .to("#flapRight", { rotateY: 102, xPercent: 8, duration: 1.2, ease: "power2.inOut" }, 1.35)
      .to("#flapBottom", { rotateX: -92, yPercent: 8, duration: 1.1, ease: "power2.inOut" }, 1.42)
      .to("#envLiner", { opacity: 0, duration: 0.68, ease: "power1.inOut" }, 1.52)
      .to("#seamGlow", { opacity: 0, scale: 1.72, duration: 0.75, ease: "power1.out" }, 1.72)

    // 4. Entra el texto de la portada justo cuando las solapas despejan la escena.
      .call(() => {
        if (!fading) {
          fading = true;
          showHero(true);
        }
      }, null, 1.92);
  }

  function open() {
    if (opening) return;
    opening = true;
    sealBtn.disabled = true;
    gsap.to(hint, { opacity: 0, duration: 0.3 });
    hint.style.animation = "none";
    startMusic();
    if (reduced) {
      fadeOut();
      return;
    }
    if (!C.introVideo) return layeredOpening();

    let settled = false;
    const fallback = () => {
      if (settled) return;
      settled = true;
      video.hidden = true;
      video.pause();
      layeredOpening();
    };
    const timer = setTimeout(fallback, 4000);
    video.addEventListener("error", fallback, { once: true });
    video.addEventListener("playing", () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.hidden = false;
    }, { once: true });
    video.addEventListener("timeupdate", function near() {
      if (video.hidden || !video.duration || video.currentTime <= video.duration - 0.8) return;
      video.removeEventListener("timeupdate", near);
      fadeOut();
    });
    video.addEventListener("ended", () => { if (!video.hidden) fadeOut(); }, { once: true });
    video.play().catch(fallback);
  }

  if (C.introVideo && !reduced) video.src = C.introVideo;
  gsap.set("[data-hero]", { opacity: 0 });
  sealBtn.addEventListener("click", open);
  $("#skip").addEventListener("click", () => {
    startMusic();
    gsap.killTweensOf(intro);
    fading = false;
    finish();
  });
  $("#replay").addEventListener("click", () => {
    try { sessionStorage.removeItem("vanocni-prani-otevreno"); } catch {}
    scrollTo(0, 0);
    location.reload();
  });

  // --- Brindis interactivo con destellos dorados ---
  const toastBtn = $("#toastBtn"), toastPhrase = $("#toastPhrase"), sparkles = $("#sparkles");
  let toastIndex = 0;

  function burstSparkles() {
    if (reduced) return;
    const box = sparkles.getBoundingClientRect();
    const cx = box.width / 2;
    const cy = box.height * 0.52;
    for (let i = 0; i < 22; i++) {
      const dot = document.createElement("span");
      dot.className = "sparkle";
      const size = 4 + Math.random() * 6;
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.left = cx + "px";
      dot.style.top = cy + "px";
      sparkles.append(dot);
      const angle = (Math.PI * 2 * i) / 22 + (Math.random() - 0.5) * 0.4;
      const dist = 55 + Math.random() * 115;
      gsap.fromTo(
        dot,
        { x: 0, y: 0, scale: 0.4, opacity: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 20,
          scale: 1.2,
          opacity: 0,
          duration: 0.9 + Math.random() * 0.55,
          ease: "power2.out",
          onComplete: () => dot.remove()
        }
      );
    }
  }

  toastBtn.addEventListener("click", () => {
    const phrases = C.toast.phrases;
    toastPhrase.textContent = phrases[toastIndex % phrases.length];
    toastIndex += 1;
    burstSparkles();
    if (!reduced) {
      gsap.fromTo(toastPhrase, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" });
    }
  });

  // --- Música opcional ---
  const audio = $("#audio"), musicBtn = $("#music");
  let wantsMusic = (() => { try { return localStorage.getItem("vanocni-hudba") !== "off"; } catch { return true; } })();
  const paintMusic = () => {
    musicBtn.textContent = audio.paused ? "▶" : "❚❚";
    musicBtn.setAttribute("aria-label", audio.paused ? "Přehrát hudbu" : "Pozastavit hudbu");
  };
  function startMusic() {
    if (!C.music) return;
    musicBtn.hidden = false;
    if (wantsMusic) audio.play().catch(() => {}).finally(paintMusic);
    paintMusic();
  }
  if (C.music) {
    audio.src = C.music;
    musicBtn.addEventListener("click", () => {
      if (audio.paused) { wantsMusic = true; audio.play().finally(paintMusic); }
      else { wantsMusic = false; audio.pause(); paintMusic(); }
      try { localStorage.setItem("vanocni-hudba", wantsMusic ? "on" : "off"); } catch {}
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) audio.pause();
      else if (wantsMusic && !musicBtn.hidden) audio.play().catch(() => {}).finally(paintMusic);
    });
  }

  // --- Inicio ---
  document.fonts.ready.then(() => {
    setupScroll();
    if (store.get()) finish();
    ScrollTrigger.refresh();
  });
  addEventListener("resize", placeLine);
})();
