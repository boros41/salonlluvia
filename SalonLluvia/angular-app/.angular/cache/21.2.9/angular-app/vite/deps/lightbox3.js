import {
  __spreadProps,
  __spreadValues
} from "./chunk-H2SRQSE4.js";

// node_modules/lightbox3/dist/lightbox3.esm.js
var POSITION_THRESHOLD = 0.01;
var VELOCITY_THRESHOLD = 0.01;
var MAX_DT = 0.02;
var SUB_STEP_DT = 8e-3;
function springStep(config, state, target, dt) {
  const { stiffness: k, damping: c, mass: m = 1 } = config;
  if (dt > MAX_DT) {
    let current = __spreadValues({}, state);
    let remaining = dt;
    while (remaining > 0) {
      const step = Math.min(remaining, SUB_STEP_DT);
      const result = springStepSingle(k, c, m, current, target, step);
      if (result.settled)
        return result;
      current = result;
      remaining -= step;
    }
    return __spreadProps(__spreadValues({}, current), { settled: false });
  }
  return springStepSingle(k, c, m, state, target, dt);
}
function springStepSingle(k, c, m, state, target, dt) {
  const displacement = state.position - target;
  const springForce = -k * displacement;
  const dampingForce = -c * state.velocity;
  const acceleration = (springForce + dampingForce) / m;
  const newVelocity = state.velocity + acceleration * dt;
  const newPosition = state.position + newVelocity * dt;
  const settled = Math.abs(newPosition - target) < POSITION_THRESHOLD && Math.abs(newVelocity) < VELOCITY_THRESHOLD;
  return {
    position: settled ? target : newPosition,
    velocity: settled ? 0 : newVelocity,
    settled
  };
}
var SPRING_OPEN = { stiffness: 260, damping: 26, mass: 1 };
var SPRING_CLOSE = { stiffness: 500, damping: 38, mass: 1 };
var DEFAULTS = {
  selector: "[data-lightbox]",
  springOpen: SPRING_OPEN,
  springClose: SPRING_CLOSE,
  padding: 40,
  debug: false
};
var SPINNER_DELAY_MS = 300;
var TEXT_LINK_OPACITY_THRESHOLD = 0.2;
var DEFAULT_IMAGE_BORDER_RADIUS = 24;
var PRELOAD_DELAY = 80;
var DRAG_THRESHOLD = 4;
var AXIS_LOCK_THRESHOLD = 10;
var RUBBER_BAND_FACTOR = 0.35;
var VELOCITY_WINDOW = 80;
var PAN_SPRING = { stiffness: 170, damping: 26, mass: 1 };
var SNAP_SPRING = { stiffness: 300, damping: 30, mass: 1 };
var PINCH_RUBBER_BAND_FACTOR = 0.4;
var PINCH_DISMISS_RUBBER_BAND_FACTOR = 0.65;
var PINCH_CLOSE_SCALE = 0.8;
var PINCH_CLOSE_VELOCITY = -2;
var SLIDE_GAP = 16;
var SWIPE_VELOCITY_THRESHOLD = 300;
var SWIPE_DISTANCE_THRESHOLD = 0.3;
var PRESS_SPRING = { stiffness: 300, damping: 20, mass: 1 };
var WHEEL_NAV_THRESHOLD = 60;
var WHEEL_DISMISS_THRESHOLD = 150;
var WHEEL_DISMISS_VELOCITY = 600;
var Lightbox = class _Lightbox {
  constructor(opts = {}) {
    this.listeners = /* @__PURE__ */ new Map();
    this.state = {
      isOpen: false,
      isAnimating: false,
      isClosing: false,
      isDismissClosing: false,
      triggerEl: null,
      currentSrc: ""
    };
    this.zoom = this.defaultZoomState();
    this.overlay = null;
    this.backdrop = null;
    this.imgEl = null;
    this.stripEl = null;
    this.currentSlideEl = null;
    this.prevSlideEl = null;
    this.prevSlideImg = null;
    this.nextSlideEl = null;
    this.nextSlideImg = null;
    this.gallery = [];
    this.currentIndex = 0;
    this.userHasNavigated = false;
    this.stripRafId = null;
    this.stripOffset = 0;
    this.pendingNavDirection = null;
    this.swipeNav = this.defaultSwipeNavState();
    this.preloadCache = /* @__PURE__ */ new Map();
    this.preloadTimer = null;
    this.preloadQueue = [];
    this.preloadingActive = false;
    this.velocitySamples = [];
    this.pointerCache = [];
    this.pinch = this.defaultPinchState();
    this.dismiss = this.defaultDismissState();
    this.rafId = null;
    this.bounceRafId = null;
    this.cropInsets = { top: 0, right: 0, bottom: 0, left: 0 };
    this.thumbBorderRadius = 0;
    this.isTextLink = false;
    this.spinnerEl = null;
    this.spinnerTimer = null;
    this.chromeBar = null;
    this.chromeCounter = null;
    this.chromeCaption = null;
    this.chromeClose = null;
    this.chromePrev = null;
    this.chromeNext = null;
    this.chromeRafId = null;
    this.chromeSpring = { position: 0, velocity: 0 };
    this.chromeBaseOpacity = 0;
    this.chromeDriftProgress = 0;
    this.chromeDriftVectors = { bar: { x: 0, y: 0 }, prev: { x: 0, y: 0 }, next: { x: 0, y: 0 } };
    this.chromeFadeSwapped = false;
    this.pressSprings = /* @__PURE__ */ new Map();
    this.pressRafId = null;
    this.fitRafId = null;
    this.previouslyFocusedEl = null;
    this.savedBodyOverflow = "";
    this.savedHtmlPaddingRight = "";
    this.wheelDismissY = 0;
    this.wheelGestureTimer = null;
    this.wheelSnapBackTimer = null;
    this.wheelNavCommitted = false;
    this.wheelNavTotalDelta = 0;
    this.reducedMotion = false;
    this.reducedMotionQuery = null;
    this.debugEl = null;
    this.debugStateEl = null;
    this.debugLogEl = null;
    this.debugRafId = null;
    this.debugLogEntries = [];
    this.debugT0 = 0;
    this.opts = __spreadValues(__spreadValues({}, DEFAULTS), opts);
    this.reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reducedMotion = this.reducedMotionQuery.matches;
    this.reducedMotionQuery.addEventListener("change", (e) => {
      this.reducedMotion = e.matches;
    });
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handlePointerEnter = this.handlePointerEnter.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
    this.handleImagePointerDown = this.handleImagePointerDown.bind(this);
    this.handleOverlayPointerDown = this.handleOverlayPointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.close = this.close.bind(this);
    this.attach();
  }
  static init(opts) {
    if (_Lightbox.instance)
      return _Lightbox.instance;
    _Lightbox.instance = new _Lightbox(opts);
    return _Lightbox.instance;
  }
  on(event, callback) {
    let set = this.listeners.get(event);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      this.listeners.set(event, set);
    }
    set.add(callback);
    return this;
  }
  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
    return this;
  }
  emit(event) {
    const set = this.listeners.get(event);
    if (!set || set.size === 0)
      return;
    const detail = {
      src: this.state.currentSrc,
      triggerEl: this.state.triggerEl,
      index: this.currentIndex,
      total: Math.max(this.gallery.length, 1)
    };
    for (const cb of set) {
      cb(detail);
    }
  }
  attach() {
    document.addEventListener("click", this.handleClick);
    document.addEventListener("pointerenter", this.handlePointerEnter, true);
    document.addEventListener("pointerleave", this.handlePointerLeave, true);
  }
  destroy() {
    this.stopDebugPanel();
    document.removeEventListener("click", this.handleClick);
    document.removeEventListener("pointerenter", this.handlePointerEnter, true);
    document.removeEventListener("pointerleave", this.handlePointerLeave, true);
    this.cancelPreload();
    this.stopSpring();
    this.stopStripSpring();
    this.stopFitTransition();
    this.removeOverlay();
    this.listeners.clear();
    if (_Lightbox.instance === this)
      _Lightbox.instance = null;
  }
  defaultZoomState() {
    return {
      zoomed: false,
      zoomingOut: false,
      fitRect: new DOMRect(),
      naturalWidth: 0,
      naturalHeight: 0,
      scale: 1,
      panX: 0,
      panY: 0,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      dragStartPanX: 0,
      dragStartPanY: 0,
      dragMoved: false
    };
  }
  defaultPinchState() {
    return {
      active: false,
      initialDistance: 0,
      initialScale: 1,
      initialPanX: 0,
      initialPanY: 0,
      initialMidX: 0,
      initialMidY: 0,
      prevScale: 1,
      prevScaleTime: 0
    };
  }
  defaultDismissState() {
    return {
      tracking: false,
      active: false,
      fromOverlay: false,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      opacity: 1
    };
  }
  defaultSwipeNavState() {
    return {
      active: false,
      startX: 0,
      offsetX: 0,
      initialOffset: 0
    };
  }
  // ─── Preloading ────────────────────────────────────────────
  handlePointerEnter(e) {
    if (e.pointerType !== "mouse")
      return;
    if (!(e.target instanceof Element))
      return;
    const trigger = e.target.closest(this.opts.selector);
    if (!trigger)
      return;
    const src = this.getSrcFromTrigger(trigger);
    if (!src || this.preloadCache.has(src))
      return;
    this.preloadTimer = setTimeout(() => this.preloadImage(src), PRELOAD_DELAY);
  }
  handlePointerLeave(e) {
    if (e.pointerType !== "mouse")
      return;
    if (!(e.target instanceof Element))
      return;
    const trigger = e.target.closest(this.opts.selector);
    if (!trigger)
      return;
    this.cancelPreload();
  }
  cancelPreload() {
    if (this.preloadTimer) {
      clearTimeout(this.preloadTimer);
      this.preloadTimer = null;
    }
  }
  preloadImage(src) {
    if (this.preloadCache.has(src))
      return;
    const img = new Image();
    img.src = src;
    this.preloadCache.set(src, img);
  }
  // ─── Gallery preloading ─────────────────────────────────────
  schedulePreloads() {
    if (this.currentIndex > 0) {
      this.preloadImage(this.gallery[this.currentIndex - 1].src);
    }
    if (this.currentIndex < this.gallery.length - 1) {
      this.preloadImage(this.gallery[this.currentIndex + 1].src);
    }
    if (this.userHasNavigated) {
      this.enqueueRemainingPreloads();
    }
  }
  enqueueRemainingPreloads() {
    const queue = [];
    for (let offset = 2; offset < this.gallery.length; offset++) {
      const fwd = this.currentIndex + offset;
      const bwd = this.currentIndex - offset;
      if (fwd < this.gallery.length)
        queue.push(this.gallery[fwd].src);
      if (bwd >= 0)
        queue.push(this.gallery[bwd].src);
    }
    this.preloadQueue = queue.filter((src) => !this.preloadCache.has(src));
    this.processPreloadQueue();
  }
  processPreloadQueue() {
    if (this.preloadingActive || this.preloadQueue.length === 0)
      return;
    const src = this.preloadQueue.shift();
    if (this.preloadCache.has(src)) {
      this.processPreloadQueue();
      return;
    }
    this.preloadingActive = true;
    const img = new Image();
    img.onload = img.onerror = () => {
      this.preloadingActive = false;
      this.processPreloadQueue();
    };
    img.src = src;
    this.preloadCache.set(src, img);
  }
  // ─── Gallery ────────────────────────────────────────────────
  buildGallery(triggerEl) {
    const galleryName = triggerEl.getAttribute("data-lightbox");
    if (!galleryName) {
      this.gallery = [];
      this.currentIndex = 0;
      return;
    }
    const elements = document.querySelectorAll(`[data-lightbox="${CSS.escape(galleryName)}"]`);
    this.gallery = Array.from(elements).map((el) => {
      const htmlEl = el;
      const img = htmlEl.querySelector("img");
      return {
        triggerEl: htmlEl,
        src: this.getSrcFromTrigger(htmlEl),
        thumbSrc: img?.currentSrc || img?.src || "",
        caption: htmlEl.getAttribute("data-caption") || htmlEl.getAttribute("data-title") || "",
        alt: htmlEl.getAttribute("data-alt") || img?.alt || ""
      };
    });
    this.currentIndex = this.gallery.findIndex((item) => item.triggerEl === triggerEl);
    if (this.currentIndex === -1)
      this.currentIndex = 0;
    this.userHasNavigated = false;
  }
  // ─── Event Handlers ──────────────────────────────────────────
  handleClick(e) {
    const trigger = e.target.closest(this.opts.selector);
    if (!trigger)
      return;
    e.preventDefault();
    const src = this.getSrcFromTrigger(trigger);
    if (!src)
      return;
    if (this.state.isOpen || this.state.isAnimating || this.state.isClosing) {
      this.stopSpring();
      this.stopFitTransition();
      this.stopStripSpring();
      this.state.isAnimating = false;
      this.state.isClosing = false;
      this.state.isDismissClosing = false;
      this.finishClose();
    }
    this.buildGallery(trigger);
    this.open(src, trigger);
  }
  handleKeydown(e) {
    if (e.key === "Tab") {
      this.trapFocus(e);
      return;
    }
    if (e.key === "Escape") {
      if (this.dismiss.active) {
        this.dismissClose(0, 0);
        return;
      }
      if (this.zoom.zoomingOut) {
        this.close();
      } else if (this.zoom.zoomed || this.zoom.scale !== 1) {
        this.zoomOut();
      } else {
        this.close();
      }
    } else if (e.key === "ArrowRight") {
      if (this.zoom.scale === 1 && !this.swipeNav.active) {
        this.next();
      }
    } else if (e.key === "ArrowLeft") {
      if (this.zoom.scale === 1 && !this.swipeNav.active) {
        this.prev();
      }
    }
  }
  trapFocus(e) {
    if (!this.overlay)
      return;
    const focusable = this.overlay.querySelectorAll('button:not([disabled]):not([style*="display: none"])');
    if (focusable.length === 0)
      return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !this.overlay.contains(document.activeElement)) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last || !this.overlay.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  getSrcFromTrigger(trigger) {
    const anchor = trigger.closest("a") || trigger;
    return anchor.getAttribute("href") || anchor.querySelector("img")?.src || "";
  }
  // ─── Open / Close ────────────────────────────────────────────
  open(src, triggerEl) {
    if (this.state.isOpen || this.state.isAnimating)
      return;
    this.debugLog("open");
    if (this.bounceRafId !== null) {
      cancelAnimationFrame(this.bounceRafId);
      this.bounceRafId = null;
    }
    this.state.isOpen = true;
    this.state.isAnimating = true;
    this.state.triggerEl = triggerEl || null;
    this.state.currentSrc = src;
    this.previouslyFocusedEl = document.activeElement;
    this.lockBodyScroll();
    this.startDebugPanel();
    this.emit("open");
    const thumbImg = triggerEl?.querySelector("img");
    const thumbSrc = thumbImg?.currentSrc || thumbImg?.src || "";
    this.isTextLink = !thumbImg;
    if (this.isTextLink) {
      this.thumbBorderRadius = 0;
      this.openTextLink(triggerEl || null, src);
      return;
    }
    const thumbRect = this.getThumbRect(triggerEl);
    this.thumbBorderRadius = this.getThumbBorderRadius(triggerEl);
    this.createOverlay(thumbSrc || src);
    this.createChrome();
    this.computeChromeDrift(thumbRect.x + thumbRect.width / 2, thumbRect.y + thumbRect.height / 2);
    document.addEventListener("keydown", this.handleKeydown);
    this.setThumbVisibility(false);
    const thumbNatW = thumbImg.naturalWidth || thumbRect.width;
    const thumbNatH = thumbImg.naturalHeight || thumbRect.height;
    const cached = this.preloadCache.get(src);
    const fullResReady = cached?.complete && cached.naturalWidth > 0;
    const natW = fullResReady ? cached.naturalWidth : thumbNatW;
    const natH = fullResReady ? cached.naturalHeight : thumbNatH;
    const targetRect = fullResReady ? this.computeTargetRect(natW, natH) : this.computeTargetRectFromAspectRatio(natW, natH);
    this.positionImage(targetRect);
    this.zoom = this.defaultZoomState();
    this.zoom.fitRect = targetRect;
    this.zoom.naturalWidth = natW;
    this.zoom.naturalHeight = natH;
    const flipX = thumbRect.x + thumbRect.width / 2 - (targetRect.x + targetRect.width / 2);
    const flipY = thumbRect.y + thumbRect.height / 2 - (targetRect.y + targetRect.height / 2);
    const { flipScale, hasCrop } = this.computeFlipCrop(thumbRect, targetRect, triggerEl, false);
    if (thumbSrc && thumbSrc !== src) {
      this.swapToFullRes(src);
    }
    if (this.gallery.length > 1) {
      this.schedulePreloads();
    }
    this.populateAdjacentSlides();
    const openVisuallyDone = (s) => s.opacity > 0.99;
    this.animateSpring({ translateX: flipX, translateY: flipY, scale: flipScale, opacity: 0, crop: hasCrop ? 1 : 0, borderRadius: this.thumbBorderRadius }, { translateX: 0, translateY: 0, scale: 1, opacity: 1, crop: 0, borderRadius: this.getTargetBorderRadius() }, this.opts.springOpen, () => {
      this.state.isAnimating = false;
      this.updateCursorState();
      this.emit("opened");
    }, void 0, void 0, void 0, openVisuallyDone);
  }
  openTextLink(triggerEl, src) {
    const cached = this.preloadCache.get(src);
    const fullResReady = cached?.complete && cached.naturalWidth > 0;
    if (fullResReady) {
      this.openTextLinkWithImage(triggerEl, src, cached.naturalWidth, cached.naturalHeight);
      return;
    }
    this.createOverlay("");
    this.createChrome();
    const cx = triggerEl ? triggerEl.getBoundingClientRect().x + triggerEl.getBoundingClientRect().width / 2 : window.innerWidth / 2;
    const cy = triggerEl ? triggerEl.getBoundingClientRect().y + triggerEl.getBoundingClientRect().height / 2 : window.innerHeight / 2;
    this.computeChromeDrift(cx, cy);
    document.addEventListener("keydown", this.handleKeydown);
    if (this.imgEl)
      this.imgEl.style.opacity = "0";
    this.spinnerTimer = setTimeout(() => {
      if (this.overlay && this.state.currentSrc === src) {
        const spinner = document.createElement("div");
        spinner.className = "lightbox3-spinner";
        this.overlay.appendChild(spinner);
        this.spinnerEl = spinner;
      }
    }, SPINNER_DELAY_MS);
    const targetBR = this.getTargetBorderRadius();
    this.animateSpring({ translateX: 0, translateY: 0, scale: 1, opacity: 0, crop: 0, borderRadius: targetBR }, { translateX: 0, translateY: 0, scale: 1, opacity: 1, crop: 0, borderRadius: targetBR }, this.opts.springOpen, () => {
    }, void 0);
    this.loadImage(src).then((size) => {
      if (!this.imgEl || this.state.currentSrc !== src)
        return;
      if (this.state.isClosing || !this.state.isOpen)
        return;
      this.removeSpinner();
      this.openTextLinkWithImage(triggerEl, src, size.width, size.height);
    });
  }
  /** Run the FLIP morph for a text-link trigger once image dimensions are known. */
  openTextLinkWithImage(triggerEl, src, natW, natH) {
    const thumbRect = triggerEl ? this.getThumbRect(triggerEl) : new DOMRect(window.innerWidth / 2, window.innerHeight / 2, 0, 0);
    const targetRect = this.computeTargetRect(natW, natH);
    if (!this.overlay) {
      this.createOverlay(src);
      this.createChrome();
      this.computeChromeDrift(thumbRect.x + thumbRect.width / 2, thumbRect.y + thumbRect.height / 2);
      document.addEventListener("keydown", this.handleKeydown);
    } else {
      this.imgEl.src = src;
    }
    this.positionImage(targetRect);
    this.zoom = this.defaultZoomState();
    this.zoom.fitRect = targetRect;
    this.zoom.naturalWidth = natW;
    this.zoom.naturalHeight = natH;
    const flipRect = this.textLinkFlipRect(thumbRect, natW, natH);
    const scaleX = flipRect.width / targetRect.width;
    const scaleY = flipRect.height / targetRect.height;
    const flipScale = Math.min(scaleX, scaleY);
    const flipX = flipRect.x + flipRect.width / 2 - (targetRect.x + targetRect.width / 2);
    const flipY = flipRect.y + flipRect.height / 2 - (targetRect.y + targetRect.height / 2);
    const targetBR = this.getTargetBorderRadius();
    const openVisuallyDone = (s) => s.opacity > 0.99;
    this.animateSpring({ translateX: flipX, translateY: flipY, scale: flipScale, opacity: 0, crop: 0, borderRadius: 0 }, { translateX: 0, translateY: 0, scale: 1, opacity: 1, crop: 0, borderRadius: targetBR }, this.opts.springOpen, () => {
      this.state.isAnimating = false;
      this.updateCursorState();
      this.emit("opened");
    }, void 0, void 0, void 0, openVisuallyDone);
  }
  /**
   * Build a rect centered on the text link with the image's aspect ratio.
   * Sized so the shorter dimension matches the text link's height.
   */
  textLinkFlipRect(linkRect, natW, natH) {
    const aspect = natW / natH;
    const h = linkRect.height;
    const w = h * aspect;
    const cx = linkRect.x + linkRect.width / 2;
    const cy = linkRect.y + linkRect.height / 2;
    return new DOMRect(cx - w / 2, cy - h / 2, w, h);
  }
  removeSpinner() {
    if (this.spinnerTimer) {
      clearTimeout(this.spinnerTimer);
      this.spinnerTimer = null;
    }
    if (this.spinnerEl) {
      this.spinnerEl.remove();
      this.spinnerEl = null;
    }
  }
  swapToFullRes(src) {
    this.loadImage(src).then((size) => {
      if (!this.imgEl || this.state.currentSrc !== src)
        return;
      if (this.state.isClosing || !this.state.isOpen)
        return;
      this.imgEl.src = src;
      this.zoom.naturalWidth = size.width;
      this.zoom.naturalHeight = size.height;
      if (!this.zoom.zoomed) {
        const targetRect = this.computeTargetRect(size.width, size.height);
        const currentRect = this.zoom.fitRect;
        const dx = Math.abs(targetRect.x - currentRect.x);
        const dy = Math.abs(targetRect.y - currentRect.y);
        const dw = Math.abs(targetRect.width - currentRect.width);
        const dh = Math.abs(targetRect.height - currentRect.height);
        if (dx > 1 || dy > 1 || dw > 1 || dh > 1) {
          this.animateFitTransition(currentRect, targetRect);
        } else {
          this.zoom.fitRect = targetRect;
          this.positionImage(targetRect);
        }
      }
      this.updateCursorState();
    });
  }
  /** Spring-animate the image from one fit rect to another (aspect ratio change). */
  animateFitTransition(from, to) {
    this.stopFitTransition();
    if (this.reducedMotion) {
      this.zoom.fitRect = to;
      this.positionImage(to);
      return;
    }
    const img = this.imgEl;
    const config = PAN_SPRING;
    const springs = {
      x: { position: from.x, velocity: 0, settled: false },
      y: { position: from.y, velocity: 0, settled: false },
      w: { position: from.width, velocity: 0, settled: false },
      h: { position: from.height, velocity: 0, settled: false }
    };
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      springs.x = springStep(config, springs.x, to.x, dt);
      springs.y = springStep(config, springs.y, to.y, dt);
      springs.w = springStep(config, springs.w, to.width, dt);
      springs.h = springStep(config, springs.h, to.height, dt);
      Object.assign(img.style, {
        left: `${springs.x.position}px`,
        top: `${springs.y.position}px`,
        width: `${springs.w.position}px`,
        height: `${springs.h.position}px`
      });
      const settled = springs.x.settled && springs.y.settled && springs.w.settled && springs.h.settled;
      if (settled) {
        this.zoom.fitRect = to;
        this.positionImage(to);
        this.fitRafId = null;
        return;
      }
      this.zoom.fitRect = new DOMRect(springs.x.position, springs.y.position, springs.w.position, springs.h.position);
      this.fitRafId = requestAnimationFrame(tick);
    };
    this.fitRafId = requestAnimationFrame(tick);
  }
  stopFitTransition() {
    if (this.fitRafId !== null) {
      cancelAnimationFrame(this.fitRafId);
      this.fitRafId = null;
    }
  }
  close() {
    if (this.state.isClosing)
      return;
    if (!this.state.isOpen && !this.state.isAnimating)
      return;
    if (this.dismiss.active) {
      this.dismissClose(0, 0);
      return;
    }
    if (this.pinch.active && this.zoom.scale < 1) {
      this.pinch.active = false;
      this.pinchClose();
      return;
    }
    this.stopStripSpring();
    this.stripOffset = 0;
    if (this.stripEl)
      this.stripEl.style.transform = "";
    this.swipeNav = this.defaultSwipeNavState();
    this.state.isClosing = true;
    this.emit("close");
    this.stopSpring();
    this.stopFitTransition();
    this.stopChromeSpring();
    this.chromeSpring = { position: 0, velocity: 0 };
    this.state.isAnimating = false;
    this.dismiss = this.defaultDismissState();
    if (this.overlay) {
      const ov = this.overlay;
      setTimeout(() => {
        ov.style.pointerEvents = "none";
      }, 80);
    }
    if (this.zoom.zoomed || this.zoom.zoomingOut || this.zoom.scale !== 1) {
      this.zoom.scale = 1;
      this.zoom.panX = 0;
      this.zoom.panY = 0;
      this.zoom.zoomed = false;
      this.zoom.zoomingOut = false;
      this.imgEl.style.transform = "";
    }
    this.state.isAnimating = true;
    const thumbRect = this.state.triggerEl ? this.getThumbRect(this.state.triggerEl) : null;
    if (thumbRect) {
      this.computeChromeDrift(thumbRect.x + thumbRect.width / 2, thumbRect.y + thumbRect.height / 2);
    }
    const triggerEl = this.state.triggerEl;
    let bounceFired = false;
    const closeWhenInvisible = (s) => {
      if (s.opacity < 0.01) {
        if (!bounceFired && triggerEl) {
          bounceFired = true;
          this.bounceTrigger(triggerEl);
        }
        return true;
      }
      return false;
    };
    const currentBR = this.getTargetBorderRadius();
    if (!thumbRect || !this.isInViewport(thumbRect)) {
      this.animateSpring({ translateX: 0, translateY: 0, scale: 1, opacity: 1, crop: 0, borderRadius: currentBR }, { translateX: 0, translateY: 0, scale: 1, opacity: 0, crop: 0, borderRadius: currentBR }, this.opts.springClose, () => this.finishClose(), closeWhenInvisible);
      return;
    }
    const { fitRect } = this.zoom;
    const morphRect = this.isTextLink ? this.textLinkFlipRect(thumbRect, this.zoom.naturalWidth, this.zoom.naturalHeight) : thumbRect;
    const flipX = morphRect.x + morphRect.width / 2 - (fitRect.x + fitRect.width / 2);
    const flipY = morphRect.y + morphRect.height / 2 - (fitRect.y + fitRect.height / 2);
    const { flipScale, hasCrop } = this.computeFlipCrop(morphRect, fitRect, this.state.triggerEl, this.isTextLink);
    this.animateSpring({ translateX: 0, translateY: 0, scale: 1, opacity: 1, crop: 0, borderRadius: currentBR }, { translateX: flipX, translateY: flipY, scale: flipScale, opacity: 0, crop: hasCrop ? 1 : 0, borderRadius: this.thumbBorderRadius }, this.opts.springClose, () => this.finishClose(), closeWhenInvisible);
  }
  finishClose() {
    this.debugLog("finishClose");
    this.stopDebugPanel();
    this.removeSpinner();
    this.stopFitTransition();
    this.stopChromeSpring();
    this.chromeSpring = { position: 0, velocity: 0 };
    this.chromeBaseOpacity = 0;
    this.resetChromeDrift();
    this.setThumbVisibility(true);
    this.removeOverlay();
    this.unlockBodyScroll();
    document.removeEventListener("keydown", this.handleKeydown);
    if (this.previouslyFocusedEl) {
      this.previouslyFocusedEl.focus();
      this.previouslyFocusedEl = null;
    }
    this.emit("closed");
    this.state.isOpen = false;
    this.state.isAnimating = false;
    this.state.isClosing = false;
    this.state.isDismissClosing = false;
    this.state.triggerEl = null;
    this.zoom = this.defaultZoomState();
    this.pointerCache = [];
    this.pinch = this.defaultPinchState();
    this.dismiss = this.defaultDismissState();
    this.swipeNav = this.defaultSwipeNavState();
    this.pendingNavDirection = null;
    this.gallery = [];
    this.currentIndex = 0;
    this.userHasNavigated = false;
    this.stripOffset = 0;
    this.preloadQueue = [];
    this.preloadingActive = false;
    this.wheelDismissY = 0;
    this.wheelNavCommitted = false;
    this.wheelNavTotalDelta = 0;
    if (this.wheelGestureTimer !== null) {
      clearTimeout(this.wheelGestureTimer);
      this.wheelGestureTimer = null;
    }
    if (this.wheelSnapBackTimer !== null) {
      clearTimeout(this.wheelSnapBackTimer);
      this.wheelSnapBackTimer = null;
    }
  }
  /**
   * "Catch" bounce: the trigger element squishes down slightly then
   * springs back to normal scale, as if catching the lightbox image.
   * Runs on its own rAF loop so it doesn't interfere with the main spring.
   */
  bounceTrigger(el) {
    if (this.reducedMotion)
      return;
    if (this.bounceRafId !== null) {
      cancelAnimationFrame(this.bounceRafId);
      this.bounceRafId = null;
    }
    const config = { stiffness: 900, damping: 80, mass: 1 };
    const spring = { position: 0.98, velocity: 0 };
    const target = 1;
    let lastTime = performance.now();
    el.style.transform = `scale(${spring.position})`;
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      const result = springStep(config, spring, target, dt);
      spring.position = result.position;
      spring.velocity = result.velocity;
      el.style.transform = result.settled ? "" : `scale(${result.position})`;
      if (result.settled) {
        this.bounceRafId = null;
        return;
      }
      this.bounceRafId = requestAnimationFrame(tick);
    };
    this.bounceRafId = requestAnimationFrame(tick);
  }
  // ─── Gallery navigation ────────────────────────────────────
  next() {
    if (this.gallery.length <= 1)
      return;
    if (this.zoom.scale !== 1)
      return;
    this.forceCompleteStripAnimation();
    if (this.currentIndex >= this.gallery.length - 1) {
      this.bounceStrip(-1);
      return;
    }
    this.navigateTo(1);
  }
  prev() {
    if (this.gallery.length <= 1)
      return;
    if (this.zoom.scale !== 1)
      return;
    this.forceCompleteStripAnimation();
    if (this.currentIndex <= 0) {
      this.bounceStrip(1);
      return;
    }
    this.navigateTo(-1);
  }
  navigateTo(direction) {
    this.debugLog(`navigateTo(${direction > 0 ? "next" : "prev"})`);
    this.userHasNavigated = true;
    this.pendingNavDirection = direction;
    const destSlide = direction === 1 ? this.nextSlideEl : this.prevSlideEl;
    if (destSlide)
      destSlide.style.pointerEvents = "auto";
    const slideWidth = window.innerWidth + SLIDE_GAP;
    const targetX = -direction * slideWidth;
    this.animateStrip(this.stripOffset, targetX, this.opts.springOpen, 0, () => this.completeNavigation(direction));
  }
  completeNavigation(direction) {
    this.debugLog(`completeNavigation(${direction > 0 ? "next" : "prev"})`);
    this.pendingNavDirection = null;
    this.setThumbVisibility(true);
    this.currentIndex += direction;
    const item = this.gallery[this.currentIndex];
    this.state.triggerEl = item.triggerEl;
    this.state.currentSrc = item.src;
    this.thumbBorderRadius = this.getThumbBorderRadius(item.triggerEl);
    this.setThumbVisibility(false);
    this.emit("navigate");
    this.updateChromeContent();
    this.chromeFadeSwapped = false;
    if (this.chromeCaption)
      this.chromeCaption.style.opacity = "";
    if (this.chromeCounter)
      this.chromeCounter.style.opacity = "";
    this.stripOffset = 0;
    if (this.stripEl)
      this.stripEl.style.transform = "";
    this.schedulePreloads();
    this.recycleSlots(direction);
    this.setupCurrentImage();
    this.wheelNavCommitted = false;
    this.wheelNavTotalDelta = 0;
  }
  /**
   * After strip animation completes, reposition slide elements so the new
   * current image is at left:0. Remove the old far slide, create a new one
   * at the opposite edge.
   */
  recycleSlots(direction) {
    const slideWidth = window.innerWidth + SLIDE_GAP;
    if (direction === 1) {
      if (this.prevSlideEl)
        this.prevSlideEl.remove();
      this.prevSlideEl = this.currentSlideEl;
      this.prevSlideImg = this.imgEl;
      if (this.prevSlideEl) {
        this.prevSlideEl.style.left = `${-slideWidth}px`;
        this.prevSlideEl.style.pointerEvents = "none";
      }
      this.currentSlideEl = this.nextSlideEl;
      this.imgEl = this.nextSlideImg;
      if (this.currentSlideEl) {
        this.currentSlideEl.style.left = "0";
        this.currentSlideEl.style.pointerEvents = "auto";
      }
      this.nextSlideEl = null;
      this.nextSlideImg = null;
      if (this.currentIndex < this.gallery.length - 1) {
        this.createAdjacentSlide(this.currentIndex + 1, slideWidth);
      }
    } else {
      if (this.nextSlideEl)
        this.nextSlideEl.remove();
      this.nextSlideEl = this.currentSlideEl;
      this.nextSlideImg = this.imgEl;
      if (this.nextSlideEl) {
        this.nextSlideEl.style.left = `${slideWidth}px`;
        this.nextSlideEl.style.pointerEvents = "none";
      }
      this.currentSlideEl = this.prevSlideEl;
      this.imgEl = this.prevSlideImg;
      if (this.currentSlideEl) {
        this.currentSlideEl.style.left = "0";
        this.currentSlideEl.style.pointerEvents = "auto";
      }
      this.prevSlideEl = null;
      this.prevSlideImg = null;
      if (this.currentIndex > 0) {
        this.createAdjacentSlide(this.currentIndex - 1, -slideWidth);
      }
    }
  }
  /** Set up zoom state and image src for the newly-centered current image. */
  setupCurrentImage() {
    this.zoom = this.defaultZoomState();
    this.stopFitTransition();
    const item = this.gallery[this.currentIndex];
    if (!item || !this.imgEl)
      return;
    const cached = this.preloadCache.get(item.src);
    const fullResReady = cached?.complete && cached.naturalWidth > 0;
    const imgHasFullRes = this.imgEl.src === item.src && this.imgEl.complete && this.imgEl.naturalWidth > 0;
    if (fullResReady || imgHasFullRes) {
      const natW = fullResReady ? cached.naturalWidth : this.imgEl.naturalWidth;
      const natH = fullResReady ? cached.naturalHeight : this.imgEl.naturalHeight;
      this.zoom.naturalWidth = natW;
      this.zoom.naturalHeight = natH;
      this.zoom.fitRect = this.computeTargetRect(natW, natH);
      this.imgEl.src = item.src;
      this.positionImage(this.zoom.fitRect);
    } else {
      const thumbImg = item.triggerEl.querySelector("img");
      const natW = thumbImg?.naturalWidth || 400;
      const natH = thumbImg?.naturalHeight || 300;
      this.zoom.naturalWidth = natW;
      this.zoom.naturalHeight = natH;
      this.zoom.fitRect = this.computeTargetRectFromAspectRatio(natW, natH);
      this.positionImage(this.zoom.fitRect);
      this.swapToFullRes(item.src);
    }
    const br = this.getTargetBorderRadius();
    if (this.imgEl) {
      this.imgEl.style.borderRadius = br > 0 ? `${br}px` : "";
    }
    this.updateCursorState();
  }
  /**
   * If a strip spring is running (from a flick or arrow key), resolve it so
   * the user can start a new gesture from a clean state.
   */
  resolveStripAnimation() {
    if (this.stripRafId === null)
      return;
    this.stopStripSpring();
    const slideWidth = window.innerWidth + SLIDE_GAP;
    if (Math.abs(this.stripOffset) > slideWidth / 2) {
      const direction = this.stripOffset < 0 ? 1 : -1;
      const newIndex = this.currentIndex + direction;
      if (newIndex >= 0 && newIndex < this.gallery.length) {
        this.stripOffset += direction * slideWidth;
        this.completeNavigation(direction);
      }
    }
    this.applyStripOffset(this.stripOffset);
  }
  // ─── Spring animation engine (rAF) ──────────────────────────
  animateSpring(from, to, config, onComplete, earlyComplete, initialVelocities, configOverrides, onEarlyComplete) {
    this.stopSpring();
    const img = this.imgEl;
    const backdrop = this.backdrop;
    if (this.reducedMotion) {
      this.applyAnimState(img, backdrop, to);
      onComplete();
      return;
    }
    const springs = [
      {
        key: "translateX",
        state: { position: from.translateX, velocity: initialVelocities?.translateX ?? 0 },
        target: to.translateX,
        config: configOverrides?.translateX ?? config
      },
      {
        key: "translateY",
        state: { position: from.translateY, velocity: initialVelocities?.translateY ?? 0 },
        target: to.translateY,
        config: configOverrides?.translateY ?? config
      },
      {
        key: "scale",
        state: { position: from.scale, velocity: initialVelocities?.scale ?? 0 },
        target: to.scale,
        config: configOverrides?.scale ?? config
      },
      {
        key: "opacity",
        state: { position: from.opacity, velocity: initialVelocities?.opacity ?? 0 },
        target: to.opacity,
        config: configOverrides?.opacity ?? config
      },
      {
        key: "crop",
        state: { position: from.crop, velocity: initialVelocities?.crop ?? 0 },
        target: to.crop,
        config: configOverrides?.crop ?? config
      },
      {
        key: "borderRadius",
        state: { position: from.borderRadius, velocity: initialVelocities?.borderRadius ?? 0 },
        target: to.borderRadius,
        config: configOverrides?.borderRadius ?? config
      }
    ];
    let lastTime = performance.now();
    let firedEarlyComplete = false;
    this.applyAnimState(img, backdrop, from);
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      let allSettled = true;
      const current = {};
      for (const s of springs) {
        const result = springStep(s.config, s.state, s.target, dt);
        s.state = result;
        current[s.key] = result.position;
        if (!result.settled)
          allSettled = false;
      }
      const currentState = current;
      this.applyAnimState(img, backdrop, currentState);
      if (!firedEarlyComplete && onEarlyComplete?.(currentState)) {
        firedEarlyComplete = true;
        onComplete();
      }
      if (allSettled || earlyComplete?.(currentState)) {
        this.applyAnimState(img, backdrop, to);
        this.debugLog(`mainRaf settled${earlyComplete?.(currentState) ? " (early)" : ""}`);
        this.rafId = null;
        if (!firedEarlyComplete)
          onComplete();
        return;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
  applyAnimState(img, backdrop, state) {
    img.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`;
    backdrop.style.opacity = String(state.opacity);
    if (this.isTextLink) {
      img.style.opacity = String(Math.min(1, state.opacity / TEXT_LINK_OPACITY_THRESHOLD));
    } else if (this.state.isClosing && !this.state.isDismissClosing && window.innerWidth <= 600) {
      const CLOSE_IMG_FADE = 0.02;
      img.style.opacity = state.opacity < CLOSE_IMG_FADE ? String(state.opacity / CLOSE_IMG_FADE) : "";
    } else {
      img.style.opacity = "";
    }
    if (state.crop > 1e-3) {
      const { top, right, bottom, left } = this.cropInsets;
      const br = state.borderRadius > 0.1 ? state.borderRadius / Math.max(state.scale, 0.01) : 0;
      img.style.clipPath = `inset(${state.crop * top}px ${state.crop * right}px ${state.crop * bottom}px ${state.crop * left}px round ${br}px)`;
    } else {
      img.style.clipPath = "";
    }
    if (state.crop <= 1e-3) {
      const br = state.borderRadius > 0.1 ? state.borderRadius / Math.max(state.scale, 0.01) : 0;
      img.style.borderRadius = br > 0.1 ? `${br}px` : "";
    } else {
      img.style.borderRadius = "";
    }
    this.chromeBaseOpacity = this.state.isClosing ? Math.pow(state.opacity, 2) : state.opacity;
    this.chromeDriftProgress = 1 - state.opacity;
    this.updateChromeVisuals();
  }
  // ─── Strip spring (gallery slide animation) ─────────────────
  animateStrip(fromX, toX, config, velocity, onComplete) {
    this.stopStripSpring();
    if (this.reducedMotion) {
      this.stripOffset = toX;
      this.applyStripOffset(toX);
      onComplete();
      return;
    }
    let spring = { position: fromX, velocity };
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      const result = springStep(config, spring, toX, dt);
      spring = result;
      this.stripOffset = result.position;
      this.applyStripOffset(result.position);
      const earlyDone = Math.abs(result.position - toX) < 1 && Math.abs(result.velocity) < 5;
      if (result.settled || earlyDone) {
        this.stripOffset = toX;
        this.applyStripOffset(toX);
        this.debugLog("stripRaf settled");
        this.stripRafId = null;
        onComplete();
        return;
      }
      this.stripRafId = requestAnimationFrame(tick);
    };
    this.stripRafId = requestAnimationFrame(tick);
  }
  stopStripSpring() {
    if (this.stripRafId !== null) {
      cancelAnimationFrame(this.stripRafId);
      this.stripRafId = null;
    }
  }
  applyStripOffset(offset) {
    if (this.stripEl) {
      this.stripEl.style.transform = offset ? `translateX(${offset}px)` : "";
    }
    this.updateChromeFade(offset);
  }
  /**
   * Cross-fade caption and counter as the strip slides between images.
   * Opacity follows a V-curve: 1 → 0 at midpoint → 1.
   * Text content swaps at the midpoint so the new caption fades in.
   */
  updateChromeFade(offset) {
    if (this.gallery.length <= 1)
      return;
    if (offset === 0) {
      if (this.chromeCaption)
        this.chromeCaption.style.opacity = "";
      if (this.chromeCounter)
        this.chromeCounter.style.opacity = "";
      this.chromeFadeSwapped = false;
      return;
    }
    const direction = offset < 0 ? 1 : -1;
    const destIndex = this.currentIndex + direction;
    const hasDestination = destIndex >= 0 && destIndex < this.gallery.length;
    if (!hasDestination)
      return;
    const slideWidth = window.innerWidth + SLIDE_GAP;
    const progress = Math.min(1, Math.abs(offset) / slideWidth);
    const fadeOpacity = Math.abs(1 - progress * 2);
    if (progress > 0.5 && !this.chromeFadeSwapped) {
      this.chromeFadeSwapped = true;
      const item = this.gallery[destIndex];
      if (this.chromeCounter) {
        this.chromeCounter.textContent = `${destIndex + 1} / ${this.gallery.length}`;
      }
      if (this.chromeCaption) {
        const cap = item?.caption || "";
        this.chromeCaption.innerHTML = cap;
        this.chromeCaption.style.display = cap ? "" : "none";
      }
    } else if (progress <= 0.5 && this.chromeFadeSwapped) {
      this.chromeFadeSwapped = false;
      const item = this.gallery[this.currentIndex];
      if (this.chromeCounter) {
        this.chromeCounter.textContent = `${this.currentIndex + 1} / ${this.gallery.length}`;
      }
      if (this.chromeCaption) {
        const cap = item?.caption || "";
        this.chromeCaption.innerHTML = cap;
        this.chromeCaption.style.display = cap ? "" : "none";
      }
    }
    if (this.chromeCaption)
      this.chromeCaption.style.opacity = String(fadeOpacity);
    if (this.chromeCounter)
      this.chromeCounter.style.opacity = String(fadeOpacity);
  }
  /**
   * Rubber-band bounce at gallery edges. Kicks the strip with velocity in the
   * attempted direction — the spring overshoots then settles back to 0,
   * hinting that there are no more images that way.
   * direction: 1 = shift right (at first image), -1 = shift left (at last).
   */
  bounceStrip(direction) {
    this.debugLog(`bounceStrip(${direction > 0 ? "right" : "left"})`);
    const BOUNCE_VELOCITY = 1200;
    const BOUNCE_SPRING = { stiffness: 400, damping: 24, mass: 1 };
    this.animateStrip(0, 0, BOUNCE_SPRING, direction * BOUNCE_VELOCITY, () => {
      this.stripOffset = 0;
    });
  }
  /**
   * If a strip animation is in progress, stop it and resolve immediately.
   * Navigation animations are completed (index updated, slots recycled).
   * Bounce animations are just cancelled (strip reset to 0).
   */
  forceCompleteStripAnimation() {
    if (this.stripRafId === null)
      return;
    this.stopStripSpring();
    if (this.pendingNavDirection !== null) {
      this.completeNavigation(this.pendingNavDirection);
    } else {
      this.stripOffset = 0;
      this.applyStripOffset(0);
    }
  }
  // ─── Zoom ────────────────────────────────────────────────────
  isZoomable() {
    const { fitRect, naturalWidth, naturalHeight } = this.zoom;
    return naturalWidth > fitRect.width * 1.05 || naturalHeight > fitRect.height * 1.05;
  }
  getTapZoomScale() {
    const { fitRect, naturalWidth } = this.zoom;
    const nativeScale = naturalWidth / fitRect.width;
    return Math.min(Math.max(nativeScale, 2), 3);
  }
  getMaxZoomScale() {
    const { fitRect, naturalWidth } = this.zoom;
    const nativeScale = naturalWidth / fitRect.width;
    return Math.max(nativeScale, 2);
  }
  zoomIn(clickX, clickY) {
    if (!this.imgEl || !this.isZoomable())
      return;
    this.debugLog("zoomIn");
    this.emit("zoomIn");
    this.stopSpring();
    this.state.isAnimating = true;
    this.animateChrome(1);
    const { fitRect } = this.zoom;
    const targetScale = this.getTapZoomScale();
    const imgCenterX = fitRect.x + fitRect.width / 2;
    const imgCenterY = fitRect.y + fitRect.height / 2;
    const relX = clickX - imgCenterX;
    const relY = clickY - imgCenterY;
    let panX = -(relX * targetScale - relX);
    let panY = -(relY * targetScale - relY);
    const bounds = this.computePanBounds(targetScale);
    panX = clamp(panX, bounds.minX, bounds.maxX);
    panY = clamp(panY, bounds.minY, bounds.maxY);
    if (this.reducedMotion) {
      this.zoom.panX = panX;
      this.zoom.panY = panY;
      this.zoom.scale = targetScale;
      this.zoom.zoomed = true;
      this.applyPanTransform();
      this.state.isAnimating = false;
      this.updateCursorState();
      return;
    }
    const fromPanX = this.zoom.panX;
    const fromPanY = this.zoom.panY;
    const fromScale = this.zoom.scale;
    let sX = { position: fromPanX, velocity: 0 };
    let sY = { position: fromPanY, velocity: 0 };
    let sScale = { position: fromScale, velocity: 0 };
    const config = this.opts.springOpen;
    let lastTime = performance.now();
    let madeInteractive = false;
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      const rX = springStep(config, sX, panX, dt);
      const rY = springStep(config, sY, panY, dt);
      const rS = springStep(config, sScale, targetScale, dt);
      sX = rX;
      sY = rY;
      sScale = rS;
      this.zoom.panX = rX.position;
      this.zoom.panY = rY.position;
      this.zoom.scale = rS.position;
      this.applyPanTransform();
      if (!madeInteractive && rS.position > 1) {
        madeInteractive = true;
        this.zoom.zoomed = true;
        this.state.isAnimating = false;
        this.updateCursorState();
      }
      if (rX.settled && rY.settled && rS.settled) {
        this.zoom.panX = panX;
        this.zoom.panY = panY;
        this.zoom.scale = targetScale;
        this.applyPanTransform();
        this.rafId = null;
        if (!madeInteractive) {
          this.zoom.zoomed = true;
          this.state.isAnimating = false;
          this.updateCursorState();
        }
        return;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
  zoomOut() {
    if (!this.imgEl)
      return;
    this.debugLog("zoomOut");
    this.emit("zoomOut");
    this.stopSpring();
    this.state.isAnimating = true;
    this.zoom.zoomingOut = true;
    this.animateChrome(0);
    if (this.reducedMotion) {
      this.zoom.panX = 0;
      this.zoom.panY = 0;
      this.zoom.scale = 1;
      this.zoom.zoomed = false;
      this.zoom.zoomingOut = false;
      this.applyPanTransform();
      this.state.isAnimating = false;
      this.updateCursorState();
      return;
    }
    const fromPanX = this.zoom.panX;
    const fromPanY = this.zoom.panY;
    const fromScale = this.zoom.scale;
    let sX = { position: fromPanX, velocity: 0 };
    let sY = { position: fromPanY, velocity: 0 };
    let sScale = { position: fromScale, velocity: 0 };
    const config = this.opts.springClose;
    let lastTime = performance.now();
    let madeInteractive = false;
    const VISUAL_THRESHOLD = 5e-3;
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      const rX = springStep(config, sX, 0, dt);
      const rY = springStep(config, sY, 0, dt);
      const rS = springStep(config, sScale, 1, dt);
      sX = rX;
      sY = rY;
      sScale = rS;
      this.zoom.panX = rX.position;
      this.zoom.panY = rY.position;
      this.zoom.scale = rS.position;
      this.applyPanTransform();
      if (!madeInteractive && Math.abs(rS.position - 1) < VISUAL_THRESHOLD && Math.abs(rX.position) < 1 && Math.abs(rY.position) < 1) {
        madeInteractive = true;
        this.zoom.zoomed = false;
        this.zoom.zoomingOut = false;
        this.state.isAnimating = false;
        this.updateCursorState();
      }
      if (rX.settled && rY.settled && rS.settled) {
        this.zoom.panX = 0;
        this.zoom.panY = 0;
        this.zoom.scale = 1;
        this.applyPanTransform();
        this.rafId = null;
        if (!madeInteractive) {
          this.zoom.zoomed = false;
          this.zoom.zoomingOut = false;
          this.state.isAnimating = false;
          this.updateCursorState();
        }
        return;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
  // ─── Pan: drag + momentum via rAF spring ────────────────────
  handleImagePointerDown(e) {
    e.preventDefault();
    this.pointerCache.push(e);
    e.target.setPointerCapture(e.pointerId);
    if (this.pointerCache.length === 2) {
      this.startPinch();
      return;
    }
    const atFitScale = !this.zoom.zoomed || this.zoom.zoomingOut;
    const blockedByAnimation = this.state.isAnimating && !this.zoom.zoomingOut;
    if (atFitScale && !blockedByAnimation) {
      this.resolveStripAnimation();
      this.stopSpring();
      this.zoom.scale = 1;
      this.zoom.panX = 0;
      this.zoom.panY = 0;
      this.zoom.zoomed = false;
      this.zoom.zoomingOut = false;
      this.applyPanTransform();
      this.state.isAnimating = false;
      this.dismiss.tracking = true;
      this.dismiss.startX = e.clientX;
      this.dismiss.startY = e.clientY;
      this.velocitySamples = [];
      this.addVelocitySample(e.clientX, e.clientY);
      return;
    }
    this.stopSpring();
    this.zoom.zoomed = true;
    this.state.isAnimating = false;
    this.zoom.isDragging = true;
    this.zoom.dragMoved = false;
    this.zoom.dragStartX = e.clientX;
    this.zoom.dragStartY = e.clientY;
    this.zoom.dragStartPanX = this.zoom.panX;
    this.zoom.dragStartPanY = this.zoom.panY;
    this.velocitySamples = [];
    this.addVelocitySample(e.clientX, e.clientY);
    this.updateCursorState();
  }
  handleOverlayPointerDown(e) {
    if (e.target === this.imgEl)
      return;
    if (this.chromeBar && this.chromeBar.contains(e.target))
      return;
    const atFitScale = !this.zoom.zoomed || this.zoom.zoomingOut;
    const blockedByAnimation = this.state.isAnimating && !this.zoom.zoomingOut;
    if (!atFitScale || blockedByAnimation)
      return;
    e.preventDefault();
    this.overlay.setPointerCapture(e.pointerId);
    this.resolveStripAnimation();
    this.stopSpring();
    if (this.zoom.zoomingOut) {
      this.zoom.scale = 1;
      this.zoom.panX = 0;
      this.zoom.panY = 0;
      this.zoom.zoomed = false;
      this.zoom.zoomingOut = false;
      this.applyPanTransform();
    }
    this.state.isAnimating = false;
    this.dismiss.tracking = true;
    this.dismiss.fromOverlay = true;
    this.dismiss.startX = e.clientX;
    this.dismiss.startY = e.clientY;
    this.velocitySamples = [];
    this.addVelocitySample(e.clientX, e.clientY);
  }
  handlePointerMove(e) {
    if (!this.imgEl)
      return;
    const idx = this.pointerCache.findIndex((p) => p.pointerId === e.pointerId);
    if (idx >= 0)
      this.pointerCache[idx] = e;
    if (this.pinch.active && this.pointerCache.length === 2) {
      this.updatePinch();
      return;
    }
    if (this.swipeNav.active) {
      this.handleSwipeNavMove(e);
      return;
    }
    if (this.dismiss.tracking || this.dismiss.active) {
      this.handleDismissMove(e);
      return;
    }
    if (!this.zoom.isDragging)
      return;
    const dx = e.clientX - this.zoom.dragStartX;
    const dy = e.clientY - this.zoom.dragStartY;
    if (!this.zoom.dragMoved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      this.zoom.dragMoved = true;
    }
    this.addVelocitySample(e.clientX, e.clientY);
    let newPanX = this.zoom.dragStartPanX + dx;
    let newPanY = this.zoom.dragStartPanY + dy;
    const bounds = this.computePanBounds(this.zoom.scale);
    newPanX = rubberBand(newPanX, bounds.minX, bounds.maxX);
    newPanY = rubberBand(newPanY, bounds.minY, bounds.maxY);
    this.zoom.panX = newPanX;
    this.zoom.panY = newPanY;
    this.applyPanTransform();
  }
  handlePointerUp(e) {
    this.pointerCache = this.pointerCache.filter((p) => p.pointerId !== e.pointerId);
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch {
    }
    if (this.pinch.active) {
      if (this.pointerCache.length < 2) {
        this.endPinch();
      }
      return;
    }
    if (this.swipeNav.active) {
      this.handleSwipeNavRelease();
      return;
    }
    if (this.dismiss.tracking || this.dismiss.active) {
      this.handleDismissRelease();
      return;
    }
    if (!this.zoom.isDragging)
      return;
    const wasDrag = this.zoom.dragMoved;
    this.zoom.isDragging = false;
    this.updateCursorState();
    if (!wasDrag) {
      this.zoomOut();
      this.zoom.dragMoved = true;
      return;
    }
    const velocity = this.computeVelocity();
    this.startPanMomentum(velocity.vx, velocity.vy);
  }
  // ─── Velocity tracking ──────────────────────────────────────
  addVelocitySample(x, y) {
    const now = performance.now();
    this.velocitySamples.push({ x, y, t: now });
    const cutoff = now - VELOCITY_WINDOW;
    while (this.velocitySamples.length > 1 && this.velocitySamples[0].t < cutoff) {
      this.velocitySamples.shift();
    }
  }
  computeVelocity() {
    const samples = this.velocitySamples;
    if (samples.length < 2)
      return { vx: 0, vy: 0 };
    const oldest = samples[0];
    const newest = samples[samples.length - 1];
    const dt = (newest.t - oldest.t) / 1e3;
    if (dt < 1e-3)
      return { vx: 0, vy: 0 };
    return {
      vx: (newest.x - oldest.x) / dt,
      vy: (newest.y - oldest.y) / dt
    };
  }
  // ─── Swipe-to-dismiss ──────────────────────────────────────
  handleDismissMove(e) {
    const dx = e.clientX - this.dismiss.startX;
    const dy = e.clientY - this.dismiss.startY;
    if (!this.dismiss.active) {
      if (Math.hypot(dx, dy) < AXIS_LOCK_THRESHOLD)
        return;
      if (Math.abs(dy) > Math.abs(dx) * 1.5) {
        this.dismiss.active = true;
        this.dismiss.tracking = false;
        this.zoom.dragMoved = true;
        if (this.stripOffset !== 0) {
          this.stripOffset = 0;
          this.applyStripOffset(0);
        }
      } else {
        if (this.gallery.length > 1) {
          const startX = this.dismiss.startX;
          this.dismiss = this.defaultDismissState();
          this.zoom.dragMoved = true;
          this.startSwipeNav(startX, e.clientX);
        } else {
          this.dismiss = this.defaultDismissState();
        }
        return;
      }
    }
    this.addVelocitySample(e.clientX, e.clientY);
    this.dismiss.offsetX = dx;
    this.dismiss.offsetY = dy;
    const vh = window.innerHeight;
    const dist = Math.hypot(dx, dy);
    const progress = dist / vh;
    this.dismiss.scale = Math.max(0.7, 1 - progress * 0.3);
    this.dismiss.opacity = Math.max(0, 1 - progress / 0.4);
    this.applyDismissTransform();
  }
  applyDismissTransform() {
    if (!this.imgEl || !this.backdrop)
      return;
    const { offsetX, offsetY, scale } = this.dismiss;
    this.imgEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    this.backdrop.style.opacity = String(this.dismiss.opacity);
    this.chromeBaseOpacity = this.dismiss.opacity;
    this.updateChromeVisuals();
  }
  handleDismissRelease() {
    if (!this.dismiss.active) {
      const fromOverlay = this.dismiss.fromOverlay;
      this.dismiss = this.defaultDismissState();
      if (fromOverlay)
        this.close();
      return;
    }
    const { vx, vy } = this.computeVelocity();
    const dist = Math.hypot(this.dismiss.offsetX, this.dismiss.offsetY);
    const speed = Math.hypot(vx, vy);
    if (dist < 5 && speed < 50) {
      this.dismissSnapBack(vx, vy);
    } else {
      this.dismissClose(vx, vy);
    }
  }
  dismissClose(velocityX, velocityY) {
    this.debugLog("dismissClose");
    this.state.isClosing = true;
    this.state.isDismissClosing = true;
    this.emit("close");
    this.state.isAnimating = true;
    this.stopFitTransition();
    if (this.overlay) {
      const ov = this.overlay;
      setTimeout(() => {
        ov.style.pointerEvents = "none";
      }, 80);
    }
    const { offsetX, offsetY, scale, opacity } = this.dismiss;
    this.dismiss = this.defaultDismissState();
    const thumbRect = this.state.triggerEl ? this.getThumbRect(this.state.triggerEl) : null;
    const currentBR = this.getTargetBorderRadius();
    if (!thumbRect || !this.isInViewport(thumbRect)) {
      this.animateSpring({ translateX: offsetX, translateY: offsetY, scale, opacity, crop: 0, borderRadius: currentBR }, { translateX: offsetX, translateY: offsetY, scale, opacity: 0, crop: 0, borderRadius: currentBR }, this.opts.springClose, () => this.finishClose(), (s) => s.opacity < 0.01, { translateX: velocityX, translateY: velocityY });
      return;
    }
    const { fitRect } = this.zoom;
    const morphRect = this.isTextLink ? this.textLinkFlipRect(thumbRect, this.zoom.naturalWidth, this.zoom.naturalHeight) : thumbRect;
    const flipX = morphRect.x + morphRect.width / 2 - (fitRect.x + fitRect.width / 2);
    const flipY = morphRect.y + morphRect.height / 2 - (fitRect.y + fitRect.height / 2);
    const { flipScale, hasCrop } = this.computeFlipCrop(morphRect, fitRect, this.state.triggerEl, this.isTextLink);
    const triggerEl = this.state.triggerEl;
    let bounceFired = false;
    const atThumbnail = (s) => {
      const atTarget = Math.abs(s.scale - flipScale) < 0.05 && Math.abs(s.translateX - flipX) < 20 && Math.abs(s.translateY - flipY) < 20;
      if (atTarget && !bounceFired && triggerEl) {
        bounceFired = true;
        this.bounceTrigger(triggerEl);
      }
      return atTarget;
    };
    const base = this.opts.springClose;
    const absVx = Math.abs(velocityX);
    const absVy = Math.abs(velocityY);
    const vRatio = Math.max(absVx, absVy) / (Math.min(absVx, absVy) || 1);
    let dismissConfigs;
    if (vRatio > 1.5 && Math.max(absVx, absVy) > 100) {
      const soft = __spreadProps(__spreadValues({}, base), { stiffness: base.stiffness * 0.55, damping: base.damping * 0.85 });
      dismissConfigs = absVy > absVx ? { translateY: soft } : { translateX: soft };
    }
    this.animateSpring({ translateX: offsetX, translateY: offsetY, scale, opacity, crop: 0, borderRadius: currentBR }, { translateX: flipX, translateY: flipY, scale: flipScale, opacity: 0, crop: hasCrop ? 1 : 0, borderRadius: this.thumbBorderRadius }, this.opts.springClose, () => this.finishClose(), atThumbnail, { translateX: velocityX, translateY: velocityY }, dismissConfigs);
  }
  dismissSnapBack(velocityX, velocityY) {
    const { offsetX, offsetY, scale, opacity } = this.dismiss;
    this.dismiss = this.defaultDismissState();
    const targetBR = this.getTargetBorderRadius();
    this.animateSpring({ translateX: offsetX, translateY: offsetY, scale, opacity, crop: 0, borderRadius: targetBR }, { translateX: 0, translateY: 0, scale: 1, opacity: 1, crop: 0, borderRadius: targetBR }, SNAP_SPRING, () => {
    }, void 0, { translateX: velocityX, translateY: velocityY });
  }
  // ─── Scroll lock ────────────────────────────────────────────
  lockBodyScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    this.savedBodyOverflow = document.body.style.overflow;
    this.savedHtmlPaddingRight = document.documentElement.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  unlockBodyScroll() {
    document.body.style.overflow = this.savedBodyOverflow;
    document.documentElement.style.paddingRight = this.savedHtmlPaddingRight;
  }
  // ─── Wheel handling ────────────────────────────────────────
  handleWheel(e) {
    e.preventDefault();
    if (this.state.isClosing || !this.state.isOpen)
      return;
    if (this.dismiss.active || this.dismiss.tracking)
      return;
    if (this.swipeNav.active)
      return;
    if (this.zoom.isDragging)
      return;
    if (this.wheelGestureTimer !== null)
      clearTimeout(this.wheelGestureTimer);
    this.wheelGestureTimer = setTimeout(() => {
      this.debugLog("gesture timer → reset wheel state");
      this.wheelGestureTimer = null;
      this.wheelDismissY = 0;
      this.wheelNavCommitted = false;
      this.wheelNavTotalDelta = 0;
    }, 80);
    this.handleScroll(e);
  }
  handleScroll(e) {
    const lineScale = e.deltaMode === 1 ? 16 : 1;
    const deltaX = e.deltaX * lineScale;
    const deltaY = e.deltaY * lineScale;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (this.zoom.zoomed || this.zoom.scale !== 1) {
      this.wheelPan(deltaX, deltaY);
      return;
    }
    if (absX > absY && this.gallery.length > 1) {
      this.wheelNavigate(deltaX);
    } else if (absY > 0) {
      this.wheelDismiss(deltaY);
    }
  }
  wheelPan(deltaX, deltaY) {
    this.stopSpring();
    const bounds = this.computePanBounds(this.zoom.scale);
    this.zoom.panX -= deltaX;
    this.zoom.panY -= deltaY;
    if (this.zoom.panX < bounds.minX) {
      const over = bounds.minX - this.zoom.panX;
      this.zoom.panX = bounds.minX - over * RUBBER_BAND_FACTOR;
    } else if (this.zoom.panX > bounds.maxX) {
      const over = this.zoom.panX - bounds.maxX;
      this.zoom.panX = bounds.maxX + over * RUBBER_BAND_FACTOR;
    }
    if (this.zoom.panY < bounds.minY) {
      const over = bounds.minY - this.zoom.panY;
      this.zoom.panY = bounds.minY - over * RUBBER_BAND_FACTOR;
    } else if (this.zoom.panY > bounds.maxY) {
      const over = this.zoom.panY - bounds.maxY;
      this.zoom.panY = bounds.maxY + over * RUBBER_BAND_FACTOR;
    }
    this.applyPanTransform();
    this.scheduleWheelSnapBack();
  }
  scheduleWheelSnapBack() {
    if (this.wheelSnapBackTimer !== null)
      clearTimeout(this.wheelSnapBackTimer);
    this.wheelSnapBackTimer = setTimeout(() => {
      this.wheelSnapBackTimer = null;
      if (this.state.isClosing || !this.state.isOpen)
        return;
      if (!this.zoom.zoomed && this.zoom.scale === 1)
        return;
      const bounds = this.computePanBounds(this.zoom.scale);
      const needsSnap = this.zoom.panX < bounds.minX || this.zoom.panX > bounds.maxX || this.zoom.panY < bounds.minY || this.zoom.panY > bounds.maxY;
      if (needsSnap) {
        this.startPanMomentum(0, 0);
      }
    }, 100);
  }
  wheelNavigate(deltaX) {
    if (this.wheelNavCommitted)
      return;
    this.wheelNavTotalDelta += deltaX;
    if (Math.abs(this.wheelNavTotalDelta) > WHEEL_NAV_THRESHOLD) {
      this.wheelNavCommitted = true;
      const dir = this.wheelNavTotalDelta > 0 ? "next" : "prev";
      this.debugLog(`wheelNav commit → ${dir}`);
      if (this.wheelNavTotalDelta > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }
  wheelDismiss(deltaY) {
    this.wheelDismissY += Math.abs(deltaY);
    if (this.wheelDismissY > WHEEL_DISMISS_THRESHOLD) {
      this.wheelDismissY = 0;
      this.dismissClose(0, WHEEL_DISMISS_VELOCITY);
    }
  }
  // ─── Swipe-to-navigate ──────────────────────────────────────
  startSwipeNav(startX, currentX) {
    const initialOffset = this.stripOffset;
    this.swipeNav = {
      active: true,
      startX,
      offsetX: initialOffset + (currentX - startX),
      initialOffset
    };
    this.applyStripOffset(this.swipeNav.offsetX);
    this.stripOffset = this.swipeNav.offsetX;
  }
  handleSwipeNavMove(e) {
    const dx = e.clientX - this.swipeNav.startX;
    let offset = this.swipeNav.initialOffset + dx;
    const atStart = this.currentIndex === 0;
    const atEnd = this.currentIndex === this.gallery.length - 1;
    if (atStart && offset > 0) {
      offset = offset * RUBBER_BAND_FACTOR;
    }
    if (atEnd && offset < 0) {
      offset = offset * RUBBER_BAND_FACTOR;
    }
    this.swipeNav.offsetX = offset;
    this.stripOffset = offset;
    this.addVelocitySample(e.clientX, e.clientY);
    this.applyStripOffset(offset);
  }
  handleSwipeNavRelease() {
    const { vx } = this.computeVelocity();
    const offset = this.swipeNav.offsetX;
    this.swipeNav = this.defaultSwipeNavState();
    const slideWidth = window.innerWidth + SLIDE_GAP;
    const progress = Math.abs(offset) / slideWidth;
    let shouldNavigate = Math.abs(vx) > SWIPE_VELOCITY_THRESHOLD || progress > SWIPE_DISTANCE_THRESHOLD;
    const direction = offset < 0 ? 1 : -1;
    if (direction === 1 && this.currentIndex >= this.gallery.length - 1)
      shouldNavigate = false;
    if (direction === -1 && this.currentIndex <= 0)
      shouldNavigate = false;
    if (shouldNavigate) {
      this.completeSwipeNav(direction, vx);
    } else {
      this.snapBackSwipeNav(vx);
    }
  }
  completeSwipeNav(direction, velocity) {
    this.pendingNavDirection = direction;
    const destSlide = direction === 1 ? this.nextSlideEl : this.prevSlideEl;
    if (destSlide)
      destSlide.style.pointerEvents = "auto";
    const slideWidth = window.innerWidth + SLIDE_GAP;
    const targetX = -direction * slideWidth;
    this.animateStrip(this.stripOffset, targetX, this.opts.springOpen, velocity, () => this.completeNavigation(direction));
  }
  snapBackSwipeNav(velocity) {
    this.animateStrip(this.stripOffset, 0, SNAP_SPRING, velocity, () => {
      this.stripOffset = 0;
    });
  }
  // ─── Pinch-to-zoom ─────────────────────────────────────────
  startPinch() {
    this.stopSpring();
    this.state.isAnimating = false;
    this.zoom.isDragging = false;
    this.dismiss = this.defaultDismissState();
    const [p1, p2] = this.pointerCache;
    const dist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
    const midX = (p1.clientX + p2.clientX) / 2;
    const midY = (p1.clientY + p2.clientY) / 2;
    this.pinch = {
      active: true,
      initialDistance: dist,
      initialScale: this.zoom.scale,
      initialPanX: this.zoom.panX,
      initialPanY: this.zoom.panY,
      initialMidX: midX,
      initialMidY: midY,
      prevScale: this.zoom.scale,
      prevScaleTime: performance.now()
    };
  }
  updatePinch() {
    const [p1, p2] = this.pointerCache;
    const dist = Math.hypot(p2.clientX - p1.clientX, p2.clientY - p1.clientY);
    const midX = (p1.clientX + p2.clientX) / 2;
    const midY = (p1.clientY + p2.clientY) / 2;
    const ratio = dist / this.pinch.initialDistance;
    const maxScale = this.getMaxZoomScale();
    let newScale = this.pinch.initialScale * ratio;
    if (newScale < 1) {
      newScale = 1 - (1 - newScale) * PINCH_DISMISS_RUBBER_BAND_FACTOR;
    } else if (newScale > maxScale) {
      newScale = maxScale + (newScale - maxScale) * PINCH_RUBBER_BAND_FACTOR;
    }
    const now = performance.now();
    this.pinch.prevScale = this.zoom.scale;
    this.pinch.prevScaleTime = now;
    const { fitRect } = this.zoom;
    const imgCenterX = fitRect.x + fitRect.width / 2;
    const imgCenterY = fitRect.y + fitRect.height / 2;
    const relX = this.pinch.initialMidX - imgCenterX;
    const relY = this.pinch.initialMidY - imgCenterY;
    const scaleRatio = newScale / this.pinch.initialScale;
    const panX = this.pinch.initialPanX + (midX - this.pinch.initialMidX) - (relX - this.pinch.initialPanX) * (scaleRatio - 1);
    const panY = this.pinch.initialPanY + (midY - this.pinch.initialMidY) - (relY - this.pinch.initialPanY) * (scaleRatio - 1);
    this.zoom.scale = newScale;
    this.zoom.panX = panX;
    this.zoom.panY = panY;
    this.applyPanTransform();
    if (newScale < 1) {
      const dismissProgress = 1 - newScale;
      const opacity = Math.max(0, 1 - dismissProgress / 0.35);
      this.backdrop.style.opacity = String(opacity);
      this.chromeBaseOpacity = opacity;
      this.chromeSpring = { position: 0, velocity: 0 };
      this.updateChromeVisuals();
    } else {
      const chromeProgress = Math.min(1, Math.max(0, (newScale - 1) / 0.5));
      this.chromeSpring = { position: chromeProgress, velocity: 0 };
      this.updateChromeVisuals();
    }
  }
  endPinch() {
    this.pinch.active = false;
    this.zoom.dragMoved = true;
    const maxScale = this.getMaxZoomScale();
    if (this.zoom.scale < 1) {
      const dt = (performance.now() - this.pinch.prevScaleTime) / 1e3;
      const scaleVelocity = dt > 1e-3 ? (this.zoom.scale - this.pinch.prevScale) / dt : 0;
      if (this.zoom.scale < PINCH_CLOSE_SCALE || scaleVelocity < PINCH_CLOSE_VELOCITY) {
        this.pinchClose();
      } else {
        this.pinchSnapBack();
      }
    } else if (this.zoom.scale > maxScale) {
      const bounds = this.computePanBounds(maxScale);
      const panX = clamp(this.zoom.panX, bounds.minX, bounds.maxX);
      const panY = clamp(this.zoom.panY, bounds.minY, bounds.maxY);
      this.springToZoomState(maxScale, panX, panY, SNAP_SPRING, true);
      this.animateChrome(1);
    } else {
      this.zoom.zoomed = this.zoom.scale > 1;
      this.animateChrome(this.zoom.scale > 1 ? 1 : 0);
      const bounds = this.computePanBounds(this.zoom.scale);
      const inBoundsX = this.zoom.panX >= bounds.minX && this.zoom.panX <= bounds.maxX;
      const inBoundsY = this.zoom.panY >= bounds.minY && this.zoom.panY <= bounds.maxY;
      if (!inBoundsX || !inBoundsY) {
        const panX = clamp(this.zoom.panX, bounds.minX, bounds.maxX);
        const panY = clamp(this.zoom.panY, bounds.minY, bounds.maxY);
        this.springToZoomState(this.zoom.scale, panX, panY, SNAP_SPRING, this.zoom.scale > 1);
      } else {
        this.updateCursorState();
      }
    }
  }
  pinchClose() {
    this.debugLog("pinchClose");
    this.state.isClosing = true;
    this.state.isDismissClosing = true;
    this.emit("close");
    this.state.isAnimating = true;
    this.stopFitTransition();
    this.stopStripSpring();
    this.stripOffset = 0;
    if (this.stripEl)
      this.stripEl.style.transform = "";
    this.swipeNav = this.defaultSwipeNavState();
    if (this.overlay) {
      const ov = this.overlay;
      setTimeout(() => {
        ov.style.pointerEvents = "none";
      }, 80);
    }
    const { panX, panY, scale } = this.zoom;
    const dismissProgress = 1 - scale;
    const opacity = Math.max(0, 1 - dismissProgress / 0.35);
    this.zoom.scale = 1;
    this.zoom.panX = 0;
    this.zoom.panY = 0;
    this.zoom.zoomed = false;
    const thumbRect = this.state.triggerEl ? this.getThumbRect(this.state.triggerEl) : null;
    const currentBR = this.getTargetBorderRadius();
    if (!thumbRect || !this.isInViewport(thumbRect)) {
      this.animateSpring({ translateX: panX, translateY: panY, scale, opacity, crop: 0, borderRadius: currentBR }, { translateX: panX, translateY: panY, scale, opacity: 0, crop: 0, borderRadius: currentBR }, this.opts.springClose, () => this.finishClose(), (s) => s.opacity < 0.01);
      return;
    }
    const { fitRect } = this.zoom;
    const morphRect = this.isTextLink ? this.textLinkFlipRect(thumbRect, this.zoom.naturalWidth, this.zoom.naturalHeight) : thumbRect;
    const flipX = morphRect.x + morphRect.width / 2 - (fitRect.x + fitRect.width / 2);
    const flipY = morphRect.y + morphRect.height / 2 - (fitRect.y + fitRect.height / 2);
    const { flipScale, hasCrop } = this.computeFlipCrop(morphRect, fitRect, this.state.triggerEl, this.isTextLink);
    const triggerEl = this.state.triggerEl;
    let bounceFired = false;
    const atThumbnail = (s) => {
      const atTarget = Math.abs(s.scale - flipScale) < 0.05 && Math.abs(s.translateX - flipX) < 20 && Math.abs(s.translateY - flipY) < 20;
      if (atTarget && !bounceFired && triggerEl) {
        bounceFired = true;
        this.bounceTrigger(triggerEl);
      }
      return atTarget;
    };
    this.animateSpring({ translateX: panX, translateY: panY, scale, opacity, crop: 0, borderRadius: currentBR }, { translateX: flipX, translateY: flipY, scale: flipScale, opacity: 0, crop: hasCrop ? 1 : 0, borderRadius: this.thumbBorderRadius }, this.opts.springClose, () => this.finishClose(), atThumbnail);
  }
  pinchSnapBack() {
    const { panX, panY, scale } = this.zoom;
    const dismissProgress = 1 - scale;
    const opacity = Math.max(0, 1 - dismissProgress / 0.35);
    this.zoom.scale = 1;
    this.zoom.panX = 0;
    this.zoom.panY = 0;
    this.zoom.zoomed = false;
    const targetBR = this.getTargetBorderRadius();
    this.animateSpring({ translateX: panX, translateY: panY, scale, opacity, crop: 0, borderRadius: targetBR }, { translateX: 0, translateY: 0, scale: 1, opacity: 1, crop: 0, borderRadius: targetBR }, SNAP_SPRING, () => {
    });
  }
  springToZoomState(targetScale, targetPanX, targetPanY, config, zoomed) {
    this.stopSpring();
    this.state.isAnimating = true;
    if (this.reducedMotion) {
      this.zoom.panX = targetPanX;
      this.zoom.panY = targetPanY;
      this.zoom.scale = targetScale;
      this.zoom.zoomed = zoomed;
      this.applyPanTransform();
      this.state.isAnimating = false;
      this.updateCursorState();
      return;
    }
    let sX = { position: this.zoom.panX, velocity: 0 };
    let sY = { position: this.zoom.panY, velocity: 0 };
    let sScale = { position: this.zoom.scale, velocity: 0 };
    let lastTime = performance.now();
    let madeInteractive = false;
    const VISUAL_THRESHOLD = 5e-3;
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      const rX = springStep(config, sX, targetPanX, dt);
      const rY = springStep(config, sY, targetPanY, dt);
      const rS = springStep(config, sScale, targetScale, dt);
      sX = rX;
      sY = rY;
      sScale = rS;
      this.zoom.panX = rX.position;
      this.zoom.panY = rY.position;
      this.zoom.scale = rS.position;
      this.applyPanTransform();
      if (!madeInteractive && Math.abs(rS.position - targetScale) < VISUAL_THRESHOLD * targetScale && Math.abs(rX.position - targetPanX) < 1 && Math.abs(rY.position - targetPanY) < 1) {
        madeInteractive = true;
        this.zoom.zoomed = zoomed;
        this.state.isAnimating = false;
        this.updateCursorState();
      }
      if (rX.settled && rY.settled && rS.settled) {
        this.zoom.panX = targetPanX;
        this.zoom.panY = targetPanY;
        this.zoom.scale = targetScale;
        this.applyPanTransform();
        this.rafId = null;
        if (!madeInteractive) {
          this.zoom.zoomed = zoomed;
          this.state.isAnimating = false;
          this.updateCursorState();
        }
        return;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
  // ─── Pan momentum (rAF spring) ─────────────────────────────
  startPanMomentum(vx, vy) {
    const bounds = this.computePanBounds(this.zoom.scale);
    const inBoundsX = this.zoom.panX >= bounds.minX && this.zoom.panX <= bounds.maxX;
    const inBoundsY = this.zoom.panY >= bounds.minY && this.zoom.panY <= bounds.maxY;
    const targetX = inBoundsX ? clamp(this.zoom.panX + vx * 0.15, bounds.minX, bounds.maxX) : clamp(this.zoom.panX, bounds.minX, bounds.maxX);
    const targetY = inBoundsY ? clamp(this.zoom.panY + vy * 0.15, bounds.minY, bounds.maxY) : clamp(this.zoom.panY, bounds.minY, bounds.maxY);
    if (this.reducedMotion) {
      this.zoom.panX = targetX;
      this.zoom.panY = targetY;
      this.applyPanTransform();
      return;
    }
    let sX = { position: this.zoom.panX, velocity: inBoundsX ? vx : 0 };
    let sY = { position: this.zoom.panY, velocity: inBoundsY ? vy : 0 };
    const configX = inBoundsX ? PAN_SPRING : SNAP_SPRING;
    const configY = inBoundsY ? PAN_SPRING : SNAP_SPRING;
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      const rX = springStep(configX, sX, targetX, dt);
      const rY = springStep(configY, sY, targetY, dt);
      sX = rX;
      sY = rY;
      this.zoom.panX = rX.position;
      this.zoom.panY = rY.position;
      this.applyPanTransform();
      if (rX.settled && rY.settled) {
        this.rafId = null;
        return;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }
  stopSpring() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  applyPanTransform() {
    if (!this.imgEl)
      return;
    this.imgEl.style.transform = `translate(${this.zoom.panX}px, ${this.zoom.panY}px) scale(${this.zoom.scale})`;
  }
  computePanBounds(scale) {
    const { fitRect } = this.zoom;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scaledW = fitRect.width * scale;
    const scaledH = fitRect.height * scale;
    const overflowX = Math.max(0, (scaledW - vw) / 2);
    const overflowY = Math.max(0, (scaledH - vh) / 2);
    return { minX: -overflowX, maxX: overflowX, minY: -overflowY, maxY: overflowY };
  }
  // ─── Image click handler ─────────────────────────────────────
  handleImageClick(e) {
    if (this.zoom.dragMoved) {
      this.zoom.dragMoved = false;
      return;
    }
    if (this.pendingNavDirection !== null) {
      this.forceCompleteStripAnimation();
    }
    if (this.zoom.zoomed || this.zoom.scale !== 1) {
      this.zoomOut();
      return;
    }
    if (this.isZoomable()) {
      this.zoomIn(e.clientX, e.clientY);
    } else {
      this.close();
    }
  }
  // ─── Cursor state ────────────────────────────────────────────
  updateCursorState() {
    if (!this.imgEl)
      return;
    const img = this.imgEl;
    if (this.zoom.isDragging) {
      img.style.cursor = "grabbing";
    } else if (this.zoom.zoomed) {
      img.style.cursor = "grab";
    } else if (this.isZoomable()) {
      img.style.cursor = "zoom-in";
    } else {
      img.style.cursor = "pointer";
    }
  }
  // ─── Chrome UI ──────────────────────────────────────────────
  createChrome() {
    if (!this.overlay)
      return;
    const isGallery = this.gallery.length > 1;
    const caption = this.getCurrentCaption();
    const hasContent = isGallery || !!caption;
    const bar = document.createElement("div");
    bar.className = "lightbox3-chrome";
    if (!hasContent)
      bar.classList.add("lightbox3-chrome--minimal");
    const counter = document.createElement("span");
    counter.className = "lightbox3-counter";
    if (isGallery) {
      counter.textContent = `${this.currentIndex + 1} / ${this.gallery.length}`;
    } else {
      counter.style.display = "none";
    }
    bar.appendChild(counter);
    this.chromeCounter = counter;
    const captionEl = document.createElement("span");
    captionEl.className = "lightbox3-caption";
    captionEl.innerHTML = caption;
    if (!caption)
      captionEl.style.display = "none";
    bar.appendChild(captionEl);
    this.chromeCaption = captionEl;
    const close = document.createElement("button");
    close.className = "lightbox3-close";
    close.setAttribute("aria-label", "Close");
    close.type = "button";
    close.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>';
    close.addEventListener("click", (e) => {
      e.stopPropagation();
      this.close();
    });
    close.addEventListener("pointerdown", (e) => e.stopPropagation());
    bar.appendChild(close);
    this.chromeClose = close;
    this.bindPressSpring(close);
    bar.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    this.overlay.appendChild(bar);
    this.chromeBar = bar;
    this.overlay.focus({ preventScroll: true });
    if (isGallery) {
      const prev = document.createElement("button");
      prev.className = "lightbox3-arrow lightbox3-arrow-prev";
      prev.setAttribute("aria-label", "Previous image");
      prev.type = "button";
      prev.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="12,4 6,10 12,16"/></svg>';
      prev.addEventListener("click", (e) => {
        e.stopPropagation();
        this.prev();
      });
      prev.addEventListener("pointerdown", (e) => e.stopPropagation());
      this.overlay.appendChild(prev);
      this.chromePrev = prev;
      this.bindPressSpring(prev);
      const next = document.createElement("button");
      next.className = "lightbox3-arrow lightbox3-arrow-next";
      next.setAttribute("aria-label", "Next image");
      next.type = "button";
      next.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="8,4 14,10 8,16"/></svg>';
      next.addEventListener("click", (e) => {
        e.stopPropagation();
        this.next();
      });
      next.addEventListener("pointerdown", (e) => e.stopPropagation());
      this.overlay.appendChild(next);
      this.chromeNext = next;
      this.bindPressSpring(next);
      this.updateArrowVisibility();
    }
  }
  getCurrentCaption() {
    if (this.gallery.length > 0) {
      return this.gallery[this.currentIndex]?.caption || "";
    }
    return this.state.triggerEl?.getAttribute("data-caption") || this.state.triggerEl?.getAttribute("data-title") || "";
  }
  getCurrentAlt() {
    if (this.gallery.length > 0) {
      return this.gallery[this.currentIndex]?.alt || "";
    }
    const triggerEl = this.state.triggerEl;
    const img = triggerEl?.querySelector("img");
    return triggerEl?.getAttribute("data-alt") || img?.alt || "";
  }
  updateChromeContent() {
    const caption = this.getCurrentCaption();
    if (this.chromeCounter) {
      this.chromeCounter.textContent = `${this.currentIndex + 1} / ${this.gallery.length}`;
    }
    if (this.chromeCaption) {
      this.chromeCaption.innerHTML = caption;
      this.chromeCaption.style.display = caption ? "" : "none";
    }
    this.updateArrowVisibility();
  }
  updateArrowVisibility() {
    if (this.chromePrev) {
      this.chromePrev.style.display = this.currentIndex > 0 ? "" : "none";
    }
    if (this.chromeNext) {
      this.chromeNext.style.display = this.currentIndex < this.gallery.length - 1 ? "" : "none";
    }
  }
  /**
   * Compute per-element drift vectors from a thumbnail origin point.
   * Each vector points from the element's resting position back toward the origin,
   * scaled by CHROME_DRIFT. During animation, these are multiplied by chromeDriftProgress
   * so elements appear to launch from / return to the thumbnail location.
   */
  computeChromeDrift(originX, originY) {
    const CHROME_DRIFT = 0.05;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const barPos = { x: vw / 2, y: vh - 16 };
    const prevPos = { x: 36, y: vh / 2 };
    const nextPos = { x: vw - 36, y: vh / 2 };
    this.chromeDriftVectors = {
      bar: {
        x: (originX - barPos.x) * CHROME_DRIFT,
        y: (originY - barPos.y) * CHROME_DRIFT
      },
      prev: {
        x: (originX - prevPos.x) * CHROME_DRIFT,
        y: (originY - prevPos.y) * CHROME_DRIFT
      },
      next: {
        x: (originX - nextPos.x) * CHROME_DRIFT,
        y: (originY - nextPos.y) * CHROME_DRIFT
      }
    };
  }
  resetChromeDrift() {
    this.chromeDriftProgress = 0;
    this.chromeDriftVectors = { bar: { x: 0, y: 0 }, prev: { x: 0, y: 0 }, next: { x: 0, y: 0 } };
  }
  animateChrome(target) {
    this.stopChromeSpring();
    this.resetChromeDrift();
    if (this.reducedMotion) {
      this.chromeSpring = { position: target, velocity: 0 };
      this.updateChromeVisuals();
      return;
    }
    const config = target === 1 ? this.opts.springOpen : this.opts.springClose;
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      const result = springStep(config, this.chromeSpring, target, dt);
      this.chromeSpring = result;
      this.updateChromeVisuals();
      if (result.settled) {
        this.chromeRafId = null;
        return;
      }
      this.chromeRafId = requestAnimationFrame(tick);
    };
    this.chromeRafId = requestAnimationFrame(tick);
  }
  updateChromeVisuals() {
    const zoom = this.chromeSpring.position;
    const opacity = this.chromeBaseOpacity;
    const interactive = opacity > 0.1 && zoom < 0.5;
    const barY = zoom * 120;
    const arrowX = zoom * 100;
    const p = this.chromeDriftProgress;
    const d = this.chromeDriftVectors;
    if (this.chromeBar) {
      this.chromeBar.style.opacity = String(opacity);
      this.chromeBar.style.transform = `translateX(calc(-50% + ${d.bar.x * p}px)) translateY(${barY + d.bar.y * p}px)`;
      this.chromeBar.style.pointerEvents = interactive ? "" : "none";
    }
    if (this.chromePrev) {
      const prevScale = this.getPressScale(this.chromePrev);
      this.chromePrev.style.opacity = String(opacity);
      this.chromePrev.style.transform = `translateY(calc(-50% + ${d.prev.y * p}px)) translateX(${-arrowX + d.prev.x * p}px) scale(${prevScale})`;
      this.chromePrev.style.pointerEvents = interactive ? "" : "none";
    }
    if (this.chromeNext) {
      const nextScale = this.getPressScale(this.chromeNext);
      this.chromeNext.style.opacity = String(opacity);
      this.chromeNext.style.transform = `translateY(calc(-50% + ${d.next.y * p}px)) translateX(${arrowX + d.next.x * p}px) scale(${nextScale})`;
      this.chromeNext.style.pointerEvents = interactive ? "" : "none";
    }
    if (this.chromeClose) {
      const closeScale = this.getPressScale(this.chromeClose);
      this.chromeClose.style.transform = `scale(${closeScale})`;
      this.chromeClose.style.pointerEvents = interactive ? "" : "none";
    }
  }
  stopChromeSpring() {
    if (this.chromeRafId !== null) {
      cancelAnimationFrame(this.chromeRafId);
      this.chromeRafId = null;
    }
  }
  // ─── Button press spring ────────────────────────────────────
  bindPressSpring(btn) {
    this.pressSprings.set(btn, { state: { position: 1, velocity: 0 }, target: 1 });
    btn.addEventListener("pointerdown", () => this.animatePressSpring(btn, 0.85));
    btn.addEventListener("pointerup", () => this.animatePressSpring(btn, 1));
    btn.addEventListener("pointerleave", () => this.animatePressSpring(btn, 1));
  }
  getPressScale(btn) {
    if (!btn)
      return 1;
    const entry = this.pressSprings.get(btn);
    return entry ? entry.state.position : 1;
  }
  animatePressSpring(btn, target) {
    const entry = this.pressSprings.get(btn);
    if (!entry)
      return;
    entry.target = target;
    this.startPressLoop();
  }
  startPressLoop() {
    if (this.pressRafId !== null)
      return;
    if (this.reducedMotion) {
      for (const [, entry] of this.pressSprings) {
        entry.state = { position: entry.target, velocity: 0 };
      }
      this.updateChromeVisuals();
      return;
    }
    let lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1e3, 0.064);
      lastTime = now;
      let allSettled = true;
      for (const [, entry] of this.pressSprings) {
        const result = springStep(PRESS_SPRING, entry.state, entry.target, dt);
        entry.state = result;
        if (!result.settled)
          allSettled = false;
      }
      this.updateChromeVisuals();
      if (allSettled) {
        this.pressRafId = null;
        return;
      }
      this.pressRafId = requestAnimationFrame(tick);
    };
    this.pressRafId = requestAnimationFrame(tick);
  }
  // ─── DOM ─────────────────────────────────────────────────────
  createOverlay(src) {
    const overlay = document.createElement("div");
    overlay.className = "lightbox3-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.tabIndex = -1;
    const backdrop = document.createElement("div");
    backdrop.className = "lightbox3-backdrop";
    backdrop.style.opacity = "0";
    backdrop.addEventListener("click", this.close);
    const strip = document.createElement("div");
    strip.className = "lightbox3-strip";
    const { slide, img } = this.createSlide(src, this.getCurrentAlt());
    slide.style.left = "0";
    slide.style.pointerEvents = "auto";
    strip.appendChild(slide);
    overlay.addEventListener("pointerdown", this.handleOverlayPointerDown);
    overlay.addEventListener("pointermove", this.handlePointerMove);
    overlay.addEventListener("pointerup", this.handlePointerUp);
    overlay.addEventListener("pointercancel", this.handlePointerUp);
    overlay.addEventListener("wheel", this.handleWheel, { passive: false });
    overlay.appendChild(backdrop);
    overlay.appendChild(strip);
    document.body.appendChild(overlay);
    this.overlay = overlay;
    this.backdrop = backdrop;
    this.stripEl = strip;
    this.currentSlideEl = slide;
    this.imgEl = img;
  }
  createSlide(src, alt = "") {
    const slide = document.createElement("div");
    slide.className = "lightbox3-slide";
    const img = document.createElement("img");
    img.className = "lightbox3-image";
    if (src)
      img.src = src;
    img.alt = alt;
    img.draggable = false;
    img.addEventListener("click", (e) => this.handleImageClick(e));
    img.addEventListener("pointerdown", this.handleImagePointerDown);
    img.addEventListener("pointermove", this.handlePointerMove);
    img.addEventListener("pointerup", this.handlePointerUp);
    img.addEventListener("pointercancel", this.handlePointerUp);
    slide.appendChild(img);
    return { slide, img };
  }
  /** Create and position an adjacent (prev or next) slide in the strip. */
  createAdjacentSlide(galleryIndex, leftPosition) {
    if (!this.stripEl)
      return;
    const item = this.gallery[galleryIndex];
    if (!item)
      return;
    const { slide, img } = this.createSlide("", item.alt);
    slide.style.left = `${leftPosition}px`;
    slide.style.pointerEvents = "none";
    this.setupSlideImage(img, item);
    this.stripEl.appendChild(slide);
    if (leftPosition < 0) {
      this.prevSlideEl = slide;
      this.prevSlideImg = img;
    } else {
      this.nextSlideEl = slide;
      this.nextSlideImg = img;
    }
  }
  /** Set the src and position for an adjacent slide's image. */
  setupSlideImage(img, item) {
    const br = this.getTargetBorderRadius();
    img.style.borderRadius = br > 0 ? `${br}px` : "";
    const cached = this.preloadCache.get(item.src);
    const fullResReady = cached?.complete && cached.naturalWidth > 0;
    if (fullResReady) {
      img.src = item.src;
      const rect = this.computeTargetRect(cached.naturalWidth, cached.naturalHeight);
      this.positionImageEl(img, rect);
    } else {
      img.src = item.thumbSrc || item.src;
      const thumbImg = item.triggerEl.querySelector("img");
      const natW = thumbImg?.naturalWidth || 400;
      const natH = thumbImg?.naturalHeight || 300;
      const rect = this.computeTargetRectFromAspectRatio(natW, natH);
      this.positionImageEl(img, rect);
      if (cached && !cached.complete) {
        const onLoad = () => {
          cached.removeEventListener("load", onLoad);
          if (this.state.isClosing || !this.state.isOpen)
            return;
          if ((img === this.prevSlideImg || img === this.nextSlideImg) && cached.naturalWidth > 0) {
            img.src = item.src;
            const fullRect = this.computeTargetRect(cached.naturalWidth, cached.naturalHeight);
            this.positionImageEl(img, fullRect);
          }
        };
        cached.addEventListener("load", onLoad);
      }
    }
  }
  /** Position an image element at the given rect. */
  positionImageEl(img, rect) {
    Object.assign(img.style, {
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
  }
  /** Populate prev and next slides for gallery navigation. */
  populateAdjacentSlides() {
    if (!this.stripEl || this.gallery.length <= 1)
      return;
    const slideWidth = window.innerWidth + SLIDE_GAP;
    if (this.currentIndex > 0) {
      this.createAdjacentSlide(this.currentIndex - 1, -slideWidth);
    }
    if (this.currentIndex < this.gallery.length - 1) {
      this.createAdjacentSlide(this.currentIndex + 1, slideWidth);
    }
  }
  removeOverlay() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
      this.backdrop = null;
      this.imgEl = null;
      this.stripEl = null;
      this.currentSlideEl = null;
      this.prevSlideEl = null;
      this.prevSlideImg = null;
      this.nextSlideEl = null;
      this.nextSlideImg = null;
      this.chromeBar = null;
      this.chromeCounter = null;
      this.chromeCaption = null;
      this.chromeClose = null;
      this.chromePrev = null;
      this.chromeNext = null;
      this.pressSprings.clear();
      if (this.pressRafId !== null) {
        cancelAnimationFrame(this.pressRafId);
        this.pressRafId = null;
      }
    }
  }
  positionImage(rect) {
    if (!this.imgEl)
      return;
    Object.assign(this.imgEl.style, {
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
  }
  // ─── Helpers ─────────────────────────────────────────────────
  /** Target border-radius for the lightbox image, read from --lb-image-border-radius CSS property. */
  getTargetBorderRadius() {
    if (this.overlay) {
      const value = getComputedStyle(this.overlay).getPropertyValue("--lb-image-border-radius");
      if (value)
        return parseFloat(value) || 0;
    }
    return DEFAULT_IMAGE_BORDER_RADIUS;
  }
  /** Viewport padding around the lightbox image, read from --lb-image-padding CSS property. */
  getTargetImagePadding() {
    if (this.overlay) {
      const value = getComputedStyle(this.overlay).getPropertyValue("--lb-image-padding");
      if (value)
        return parseFloat(value) || 0;
    }
    return this.opts.padding;
  }
  /** Read the visual border-radius from the thumbnail's trigger element. */
  getThumbBorderRadius(el) {
    const elRadius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
    if (elRadius > 0)
      return elRadius;
    const img = el.querySelector("img");
    return img ? parseFloat(getComputedStyle(img).borderTopLeftRadius) || 0 : 0;
  }
  getThumbRect(el) {
    const img = el.querySelector("img");
    if (!img)
      return el.getBoundingClientRect();
    const elRect = img.getBoundingClientRect();
    const objectFit = getComputedStyle(img).objectFit;
    if (objectFit !== "cover" || !img.naturalWidth || !img.naturalHeight) {
      return elRect;
    }
    const natRatio = img.naturalWidth / img.naturalHeight;
    const elRatio = elRect.width / elRect.height;
    let renderedW, renderedH;
    if (natRatio > elRatio) {
      renderedH = elRect.height;
      renderedW = elRect.height * natRatio;
    } else {
      renderedW = elRect.width;
      renderedH = elRect.width / natRatio;
    }
    const pos = getComputedStyle(img).objectPosition || "50% 50%";
    const parts = pos.split(/\s+/);
    const px = parts[0]?.endsWith("%") ? parseFloat(parts[0]) / 100 : 0.5;
    const py = parts[1]?.endsWith("%") ? parseFloat(parts[1]) / 100 : 0.5;
    const offsetX = (elRect.width - renderedW) * px;
    const offsetY = (elRect.height - renderedH) * py;
    return new DOMRect(elRect.x + offsetX, elRect.y + offsetY, renderedW, renderedH);
  }
  computeCropInsets(el, virtualRect, targetRect) {
    const zero = { top: 0, right: 0, bottom: 0, left: 0 };
    const img = el.querySelector("img");
    if (!img || getComputedStyle(img).objectFit !== "cover")
      return zero;
    const elRect = img.getBoundingClientRect();
    const topFrac = Math.max(0, elRect.top - virtualRect.top) / virtualRect.height;
    const leftFrac = Math.max(0, elRect.left - virtualRect.left) / virtualRect.width;
    const bottomFrac = Math.max(0, virtualRect.bottom - elRect.bottom) / virtualRect.height;
    const rightFrac = Math.max(0, virtualRect.right - elRect.right) / virtualRect.width;
    return {
      top: topFrac * targetRect.height,
      right: rightFrac * targetRect.width,
      bottom: bottomFrac * targetRect.height,
      left: leftFrac * targetRect.width
    };
  }
  /**
   * Compute FLIP scale and crop insets for morphing between the lightbox image
   * and a thumbnail. Handles both CSS object-fit:cover cropping and server-side
   * aspect ratio mismatches (e.g. Unsplash ?fit=crop).
   */
  computeFlipCrop(morphRect, fitRect, triggerEl, isTextLink) {
    const scaleX = morphRect.width / fitRect.width;
    const scaleY = morphRect.height / fitRect.height;
    if (!isTextLink && triggerEl) {
      this.cropInsets = this.computeCropInsets(triggerEl, morphRect, fitRect);
      const cssCrop = this.cropInsets.top + this.cropInsets.right + this.cropInsets.bottom + this.cropInsets.left;
      if (cssCrop > 1) {
        return { flipScale: Math.min(scaleX, scaleY), hasCrop: true };
      }
    }
    const morphRatio = morphRect.width / morphRect.height;
    const fitRatio = fitRect.width / fitRect.height;
    const relDiff = Math.abs(morphRatio - fitRatio) / Math.max(morphRatio, fitRatio);
    if (!isTextLink && relDiff > 0.05) {
      const flipScale = Math.max(scaleX, scaleY);
      const visibleLocalW = morphRect.width / flipScale;
      const visibleLocalH = morphRect.height / flipScale;
      this.cropInsets = {
        top: Math.max(0, (fitRect.height - visibleLocalH) / 2),
        bottom: Math.max(0, (fitRect.height - visibleLocalH) / 2),
        left: Math.max(0, (fitRect.width - visibleLocalW) / 2),
        right: Math.max(0, (fitRect.width - visibleLocalW) / 2)
      };
      return { flipScale, hasCrop: true };
    }
    return { flipScale: Math.min(scaleX, scaleY), hasCrop: false };
  }
  setThumbVisibility(visible) {
    if (window.innerWidth <= 600)
      return;
    const el = this.state.triggerEl;
    if (!el)
      return;
    el.style.visibility = visible ? "" : "hidden";
  }
  computeTargetRect(naturalWidth, naturalHeight) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const p = this.getTargetImagePadding();
    const scale = Math.min((vw - p * 2) / naturalWidth, (vh - p * 2) / naturalHeight, 1);
    const w = naturalWidth * scale;
    const h = naturalHeight * scale;
    return new DOMRect((vw - w) / 2, (vh - h) / 2, w, h);
  }
  /** Like computeTargetRect but without the scale ≤ 1 cap. Used when full-res
   *  dimensions are unknown — fills the viewport based on aspect ratio alone. */
  computeTargetRectFromAspectRatio(width, height) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const p = this.getTargetImagePadding();
    const scale = Math.min((vw - p * 2) / width, (vh - p * 2) / height);
    const w = width * scale;
    const h = height * scale;
    return new DOMRect((vw - w) / 2, (vh - h) / 2, w, h);
  }
  loadImage(src) {
    const cached = this.preloadCache.get(src);
    if (cached?.complete && cached.naturalWidth > 0) {
      return Promise.resolve({ width: cached.naturalWidth, height: cached.naturalHeight });
    }
    return new Promise((resolve) => {
      const img = cached || new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 800, height: 600 });
      if (!cached) {
        img.src = src;
        this.preloadCache.set(src, img);
      }
    });
  }
  isInViewport(rect) {
    return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
  }
  startDebugPanel() {
    if (!this.opts.debug || this.debugEl)
      return;
    this.debugT0 = performance.now();
    this.debugLogEntries = [];
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      top: "8px",
      left: "8px",
      zIndex: "9999999",
      display: "flex",
      gap: "8px",
      fontFamily: "monospace",
      fontSize: "11px",
      lineHeight: "1.5",
      pointerEvents: "none"
    });
    const stateCol = document.createElement("div");
    Object.assign(stateCol.style, {
      background: "rgba(0,0,0,0.85)",
      color: "#0f0",
      padding: "8px 12px",
      borderRadius: "6px",
      whiteSpace: "pre",
      minWidth: "260px"
    });
    const logCol = document.createElement("div");
    Object.assign(logCol.style, {
      background: "rgba(0,0,0,0.85)",
      color: "#ccc",
      padding: "8px 12px",
      borderRadius: "6px",
      whiteSpace: "pre",
      minWidth: "280px",
      maxHeight: "400px",
      overflowY: "auto",
      pointerEvents: "auto"
    });
    logCol.textContent = "── event log ──────────\n";
    el.appendChild(stateCol);
    el.appendChild(logCol);
    document.body.appendChild(el);
    this.debugEl = el;
    this.debugStateEl = stateCol;
    this.debugLogEl = logCol;
    const tick = () => {
      this.updateDebugPanel();
      this.debugRafId = requestAnimationFrame(tick);
    };
    this.debugRafId = requestAnimationFrame(tick);
  }
  stopDebugPanel() {
    if (this.debugRafId !== null) {
      cancelAnimationFrame(this.debugRafId);
      this.debugRafId = null;
    }
    if (this.debugEl) {
      this.debugEl.remove();
      this.debugEl = null;
      this.debugStateEl = null;
      this.debugLogEl = null;
    }
  }
  debugLog(msg) {
    if (!this.debugLogEl)
      return;
    const t = ((performance.now() - this.debugT0) / 1e3).toFixed(2);
    const entry = `${t}s  ${msg}`;
    this.debugLogEntries.push(entry);
    if (this.debugLogEntries.length > 100)
      this.debugLogEntries.shift();
    this.debugLogEl.textContent = "── event log ──────────\n" + this.debugLogEntries.join("\n");
    this.debugLogEl.scrollTop = this.debugLogEl.scrollHeight;
  }
  updateDebugPanel() {
    if (!this.debugStateEl)
      return;
    const on = (v) => v ? "●" : "○";
    const px = (v) => v.toFixed(1);
    const lines = [
      `── state ──────────────`,
      `isOpen:${on(this.state.isOpen)}  isAnim:${on(this.state.isAnimating)}  isClosing:${on(this.state.isClosing)}`,
      `gallery: ${this.currentIndex + 1}/${this.gallery.length || 1}`,
      ``,
      `── springs ────────────`,
      `mainRaf:  ${on(this.rafId !== null)}`,
      `stripRaf: ${on(this.stripRafId !== null)}  offset: ${px(this.stripOffset)}`,
      `chromeRaf:${on(this.chromeRafId !== null)}`,
      `pendingNav: ${this.pendingNavDirection ?? "none"}`,
      ``,
      `── zoom ───────────────`,
      `scale: ${px(this.zoom.scale)}  zoomed:${on(this.zoom.zoomed)}`,
      `pan: ${px(this.zoom.panX)}, ${px(this.zoom.panY)}`,
      `dragging:${on(this.zoom.isDragging)}  dragMoved:${on(this.zoom.dragMoved)}`,
      ``,
      `── gestures ───────────`,
      `dismiss: track:${on(this.dismiss.tracking)} active:${on(this.dismiss.active)}`,
      `swipeNav: ${on(this.swipeNav.active)}`,
      `pinch: ${on(this.pinch.active)}`,
      ``,
      `── wheel nav ──────────`,
      `committed:${on(this.wheelNavCommitted)}`,
      `totalDelta: ${px(this.wheelNavTotalDelta)}`,
      `gestureTimer: ${on(this.wheelGestureTimer !== null)}`,
      `dismissY: ${px(this.wheelDismissY)}`
    ];
    if (this.gallery.length > 1) {
      lines.push("", "── gallery preload ────");
      for (let i = 0; i < this.gallery.length; i++) {
        const item = this.gallery[i];
        const cached = this.preloadCache.get(item.src);
        const isCurrent = i === this.currentIndex;
        const marker = isCurrent ? "▸" : " ";
        let status;
        if (cached?.complete && cached.naturalWidth > 0) {
          status = `● ${cached.naturalWidth}×${cached.naturalHeight}`;
        } else if (cached) {
          status = "◐ loading";
        } else {
          status = "○ pending";
        }
        const filename = item.src.split("/").pop() || item.src;
        const name = filename.length > 20 ? filename.slice(0, 19) + "…" : filename;
        lines.push(`${marker}${String(i + 1).padStart(2)} ${name.padEnd(20)} ${status}`);
      }
    }
    this.debugStateEl.textContent = lines.join("\n");
  }
};
Lightbox.instance = null;
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function rubberBand(value, min, max) {
  if (value < min)
    return min - (min - value) * RUBBER_BAND_FACTOR;
  if (value > max)
    return max + (value - max) * RUBBER_BAND_FACTOR;
  return value;
}
function autoInit() {
  if (!document.querySelector("[data-lightbox]"))
    return;
  const debug = typeof location !== "undefined" && new URLSearchParams(location.search).has("debug");
  Lightbox.init(debug ? { debug: true } : void 0);
}
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
}
export {
  Lightbox
};
//# sourceMappingURL=lightbox3.js.map
