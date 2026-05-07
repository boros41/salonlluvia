import {
  ScrollDispatcher,
  ScrollingModule,
  ViewportRuler
} from "./chunk-NUVP74FZ.js";
import {
  MatRippleLoader,
  MatRippleModule,
  _StructuralStylesLoader
} from "./chunk-5PH2OXTV.js";
import {
  ESCAPE,
  FocusMonitor,
  _IdGenerator,
  _getEventTarget,
  _isTestEnvironment,
  coerceCssPixelValue,
  hasModifierKey
} from "./chunk-VB4O4JSL.js";
import {
  _animationsDisabled,
  coerceArray
} from "./chunk-P6CTBK5W.js";
import {
  supportsScrollBehavior
} from "./chunk-GUGIMSVJ.js";
import {
  BidiModule,
  Directionality
} from "./chunk-T3KXQ2IU.js";
import {
  _CdkPrivateStyleLoader
} from "./chunk-E6FIWLN3.js";
import {
  Platform
} from "./chunk-N67FPHJ2.js";
import {
  Location
} from "./chunk-CRIUJBHX.js";
import {
  ANIMATION_MODULE_TYPE,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  Injectable,
  Input,
  NgModule,
  NgModuleRef$1,
  Output,
  Renderer2,
  RendererFactory2,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation,
  afterNextRender,
  booleanAttribute,
  createComponent,
  numberAttribute,
  setClassMetadata,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineNgModule,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵgetInheritedFactory,
  ɵɵprojection,
  ɵɵprojectionDef
} from "./chunk-3RMIO2CM.js";
import {
  DOCUMENT,
  EnvironmentInjector,
  EventEmitter,
  InjectionToken,
  Injector,
  NgZone,
  Subject,
  Subscription,
  filter,
  inject,
  takeWhile,
  ɵɵdefineInjectable,
  ɵɵdefineInjector
} from "./chunk-AFT2M3WQ.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@angular/cdk/fesm2022/portal.mjs
function throwNullPortalError() {
  throw Error("Must provide a portal to attach");
}
function throwPortalAlreadyAttachedError() {
  throw Error("Host already has a portal attached");
}
function throwPortalOutletAlreadyDisposedError() {
  throw Error("This PortalOutlet has already been disposed");
}
function throwUnknownPortalTypeError() {
  throw Error("Attempting to attach an unknown Portal type. BasePortalOutlet accepts either a ComponentPortal or a TemplatePortal.");
}
function throwNullPortalOutletError() {
  throw Error("Attempting to attach a portal to a null PortalOutlet");
}
function throwNoPortalAttachedError() {
  throw Error("Attempting to detach a portal that is not attached to a host");
}
var Portal = class {
  _attachedHost = null;
  attach(host) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (host == null) {
        throwNullPortalOutletError();
      }
      if (host.hasAttached()) {
        throwPortalAlreadyAttachedError();
      }
    }
    this._attachedHost = host;
    return host.attach(this);
  }
  detach() {
    let host = this._attachedHost;
    if (host != null) {
      this._attachedHost = null;
      host.detach();
    } else if (typeof ngDevMode === "undefined" || ngDevMode) {
      throwNoPortalAttachedError();
    }
  }
  get isAttached() {
    return this._attachedHost != null;
  }
  setAttachedHost(host) {
    this._attachedHost = host;
  }
};
var ComponentPortal = class extends Portal {
  component;
  viewContainerRef;
  injector;
  projectableNodes;
  bindings;
  constructor(component, viewContainerRef, injector, projectableNodes, bindings) {
    super();
    this.component = component;
    this.viewContainerRef = viewContainerRef;
    this.injector = injector;
    this.projectableNodes = projectableNodes;
    this.bindings = bindings || null;
  }
};
var TemplatePortal = class extends Portal {
  templateRef;
  viewContainerRef;
  context;
  injector;
  constructor(templateRef, viewContainerRef, context, injector) {
    super();
    this.templateRef = templateRef;
    this.viewContainerRef = viewContainerRef;
    this.context = context;
    this.injector = injector;
  }
  get origin() {
    return this.templateRef.elementRef;
  }
  attach(host, context = this.context) {
    this.context = context;
    return super.attach(host);
  }
  detach() {
    this.context = void 0;
    return super.detach();
  }
};
var DomPortal = class extends Portal {
  element;
  constructor(element) {
    super();
    this.element = element instanceof ElementRef ? element.nativeElement : element;
  }
};
var BasePortalOutlet = class {
  _attachedPortal = null;
  _disposeFn = null;
  _isDisposed = false;
  hasAttached() {
    return !!this._attachedPortal;
  }
  attach(portal) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (!portal) {
        throwNullPortalError();
      }
      if (this.hasAttached()) {
        throwPortalAlreadyAttachedError();
      }
      if (this._isDisposed) {
        throwPortalOutletAlreadyDisposedError();
      }
    }
    if (portal instanceof ComponentPortal) {
      this._attachedPortal = portal;
      return this.attachComponentPortal(portal);
    } else if (portal instanceof TemplatePortal) {
      this._attachedPortal = portal;
      return this.attachTemplatePortal(portal);
    } else if (this.attachDomPortal && portal instanceof DomPortal) {
      this._attachedPortal = portal;
      return this.attachDomPortal(portal);
    }
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      throwUnknownPortalTypeError();
    }
  }
  attachDomPortal = null;
  detach() {
    if (this._attachedPortal) {
      this._attachedPortal.setAttachedHost(null);
      this._attachedPortal = null;
    }
    this._invokeDisposeFn();
  }
  dispose() {
    if (this.hasAttached()) {
      this.detach();
    }
    this._invokeDisposeFn();
    this._isDisposed = true;
  }
  setDisposeFn(fn) {
    this._disposeFn = fn;
  }
  _invokeDisposeFn() {
    if (this._disposeFn) {
      this._disposeFn();
      this._disposeFn = null;
    }
  }
};
var DomPortalOutlet = class extends BasePortalOutlet {
  outletElement;
  _appRef;
  _defaultInjector;
  constructor(outletElement, _appRef, _defaultInjector) {
    super();
    this.outletElement = outletElement;
    this._appRef = _appRef;
    this._defaultInjector = _defaultInjector;
  }
  attachComponentPortal(portal) {
    let componentRef;
    if (portal.viewContainerRef) {
      const injector = portal.injector || portal.viewContainerRef.injector;
      const ngModuleRef = injector.get(NgModuleRef$1, null, {
        optional: true
      }) || void 0;
      componentRef = portal.viewContainerRef.createComponent(portal.component, {
        index: portal.viewContainerRef.length,
        injector,
        ngModuleRef,
        projectableNodes: portal.projectableNodes || void 0,
        bindings: portal.bindings || void 0
      });
      this.setDisposeFn(() => componentRef.destroy());
    } else {
      if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._appRef) {
        throw Error("Cannot attach component portal to outlet without an ApplicationRef.");
      }
      const appRef = this._appRef;
      const elementInjector = portal.injector || this._defaultInjector || Injector.NULL;
      const environmentInjector = elementInjector.get(EnvironmentInjector, appRef.injector);
      componentRef = createComponent(portal.component, {
        elementInjector,
        environmentInjector,
        projectableNodes: portal.projectableNodes || void 0,
        bindings: portal.bindings || void 0
      });
      appRef.attachView(componentRef.hostView);
      this.setDisposeFn(() => {
        if (appRef.viewCount > 0) {
          appRef.detachView(componentRef.hostView);
        }
        componentRef.destroy();
      });
    }
    this.outletElement.appendChild(this._getComponentRootNode(componentRef));
    this._attachedPortal = portal;
    return componentRef;
  }
  attachTemplatePortal(portal) {
    let viewContainer = portal.viewContainerRef;
    let viewRef = viewContainer.createEmbeddedView(portal.templateRef, portal.context, {
      injector: portal.injector
    });
    viewRef.rootNodes.forEach((rootNode) => this.outletElement.appendChild(rootNode));
    viewRef.detectChanges();
    this.setDisposeFn(() => {
      let index = viewContainer.indexOf(viewRef);
      if (index !== -1) {
        viewContainer.remove(index);
      }
    });
    this._attachedPortal = portal;
    return viewRef;
  }
  attachDomPortal = (portal) => {
    const element = portal.element;
    if (!element.parentNode && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw Error("DOM portal content must be attached to a parent node.");
    }
    const anchorNode = this.outletElement.ownerDocument.createComment("dom-portal");
    element.parentNode.insertBefore(anchorNode, element);
    this.outletElement.appendChild(element);
    this._attachedPortal = portal;
    super.setDisposeFn(() => {
      if (anchorNode.parentNode) {
        anchorNode.parentNode.replaceChild(element, anchorNode);
      }
    });
  };
  dispose() {
    super.dispose();
    this.outletElement.remove();
  }
  _getComponentRootNode(componentRef) {
    return componentRef.hostView.rootNodes[0];
  }
};
var CdkPortal = class _CdkPortal extends TemplatePortal {
  constructor() {
    const templateRef = inject(TemplateRef);
    const viewContainerRef = inject(ViewContainerRef);
    super(templateRef, viewContainerRef);
  }
  static ɵfac = function CdkPortal_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkPortal)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkPortal,
    selectors: [["", "cdkPortal", ""]],
    exportAs: ["cdkPortal"],
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkPortal, [{
    type: Directive,
    args: [{
      selector: "[cdkPortal]",
      exportAs: "cdkPortal"
    }]
  }], () => [], null);
})();
var CdkPortalOutlet = class _CdkPortalOutlet extends BasePortalOutlet {
  _moduleRef = inject(NgModuleRef$1, {
    optional: true
  });
  _document = inject(DOCUMENT);
  _viewContainerRef = inject(ViewContainerRef);
  _isInitialized = false;
  _attachedRef = null;
  constructor() {
    super();
  }
  get portal() {
    return this._attachedPortal;
  }
  set portal(portal) {
    if (this.hasAttached() && !portal && !this._isInitialized) {
      return;
    }
    if (this.hasAttached()) {
      super.detach();
    }
    if (portal) {
      super.attach(portal);
    }
    this._attachedPortal = portal || null;
  }
  attached = new EventEmitter();
  get attachedRef() {
    return this._attachedRef;
  }
  ngOnInit() {
    this._isInitialized = true;
  }
  ngOnDestroy() {
    super.dispose();
    this._attachedRef = this._attachedPortal = null;
  }
  attachComponentPortal(portal) {
    portal.setAttachedHost(this);
    const viewContainerRef = portal.viewContainerRef != null ? portal.viewContainerRef : this._viewContainerRef;
    const ref = viewContainerRef.createComponent(portal.component, {
      index: viewContainerRef.length,
      injector: portal.injector || viewContainerRef.injector,
      projectableNodes: portal.projectableNodes || void 0,
      ngModuleRef: this._moduleRef || void 0,
      bindings: portal.bindings || void 0
    });
    if (viewContainerRef !== this._viewContainerRef) {
      this._getRootNode().appendChild(ref.hostView.rootNodes[0]);
    }
    super.setDisposeFn(() => ref.destroy());
    this._attachedPortal = portal;
    this._attachedRef = ref;
    this.attached.emit(ref);
    return ref;
  }
  attachTemplatePortal(portal) {
    portal.setAttachedHost(this);
    const viewRef = this._viewContainerRef.createEmbeddedView(portal.templateRef, portal.context, {
      injector: portal.injector
    });
    super.setDisposeFn(() => this._viewContainerRef.clear());
    this._attachedPortal = portal;
    this._attachedRef = viewRef;
    this.attached.emit(viewRef);
    return viewRef;
  }
  attachDomPortal = (portal) => {
    const element = portal.element;
    if (!element.parentNode && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw Error("DOM portal content must be attached to a parent node.");
    }
    const anchorNode = this._document.createComment("dom-portal");
    portal.setAttachedHost(this);
    element.parentNode.insertBefore(anchorNode, element);
    this._getRootNode().appendChild(element);
    this._attachedPortal = portal;
    super.setDisposeFn(() => {
      if (anchorNode.parentNode) {
        anchorNode.parentNode.replaceChild(element, anchorNode);
      }
    });
  };
  _getRootNode() {
    const nativeElement = this._viewContainerRef.element.nativeElement;
    return nativeElement.nodeType === nativeElement.ELEMENT_NODE ? nativeElement : nativeElement.parentNode;
  }
  static ɵfac = function CdkPortalOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkPortalOutlet)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkPortalOutlet,
    selectors: [["", "cdkPortalOutlet", ""]],
    inputs: {
      portal: [0, "cdkPortalOutlet", "portal"]
    },
    outputs: {
      attached: "attached"
    },
    exportAs: ["cdkPortalOutlet"],
    features: [ɵɵInheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkPortalOutlet, [{
    type: Directive,
    args: [{
      selector: "[cdkPortalOutlet]",
      exportAs: "cdkPortalOutlet"
    }]
  }], () => [], {
    portal: [{
      type: Input,
      args: ["cdkPortalOutlet"]
    }],
    attached: [{
      type: Output
    }]
  });
})();
var PortalModule = class _PortalModule {
  static ɵfac = function PortalModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PortalModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _PortalModule,
    imports: [CdkPortal, CdkPortalOutlet],
    exports: [CdkPortal, CdkPortalOutlet]
  });
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortalModule, [{
    type: NgModule,
    args: [{
      imports: [CdkPortal, CdkPortalOutlet],
      exports: [CdkPortal, CdkPortalOutlet]
    }]
  }], null, null);
})();

// node_modules/@angular/cdk/fesm2022/_overlay-module-chunk.mjs
var scrollBehaviorSupported = supportsScrollBehavior();
function createBlockScrollStrategy(injector) {
  return new BlockScrollStrategy(injector.get(ViewportRuler), injector.get(DOCUMENT));
}
var BlockScrollStrategy = class {
  _viewportRuler;
  _previousHTMLStyles = {
    top: "",
    left: ""
  };
  _previousScrollPosition;
  _isEnabled = false;
  _document;
  constructor(_viewportRuler, document) {
    this._viewportRuler = _viewportRuler;
    this._document = document;
  }
  attach() {
  }
  enable() {
    if (this._canBeEnabled()) {
      const root = this._document.documentElement;
      this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition();
      this._previousHTMLStyles.left = root.style.left || "";
      this._previousHTMLStyles.top = root.style.top || "";
      root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
      root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
      root.classList.add("cdk-global-scrollblock");
      this._isEnabled = true;
    }
  }
  disable() {
    if (this._isEnabled) {
      const html = this._document.documentElement;
      const body = this._document.body;
      const htmlStyle = html.style;
      const bodyStyle = body.style;
      const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || "";
      const previousBodyScrollBehavior = bodyStyle.scrollBehavior || "";
      this._isEnabled = false;
      htmlStyle.left = this._previousHTMLStyles.left;
      htmlStyle.top = this._previousHTMLStyles.top;
      html.classList.remove("cdk-global-scrollblock");
      if (scrollBehaviorSupported) {
        htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = "auto";
      }
      window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top);
      if (scrollBehaviorSupported) {
        htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
        bodyStyle.scrollBehavior = previousBodyScrollBehavior;
      }
    }
  }
  _canBeEnabled() {
    const html = this._document.documentElement;
    if (html.classList.contains("cdk-global-scrollblock") || this._isEnabled) {
      return false;
    }
    const rootElement = this._document.documentElement;
    const viewport = this._viewportRuler.getViewportSize();
    return rootElement.scrollHeight > viewport.height || rootElement.scrollWidth > viewport.width;
  }
};
function getMatScrollStrategyAlreadyAttachedError() {
  return Error(`Scroll strategy has already been attached.`);
}
function createCloseScrollStrategy(injector, config) {
  return new CloseScrollStrategy(injector.get(ScrollDispatcher), injector.get(NgZone), injector.get(ViewportRuler), config);
}
var CloseScrollStrategy = class {
  _scrollDispatcher;
  _ngZone;
  _viewportRuler;
  _config;
  _scrollSubscription = null;
  _overlayRef;
  _initialScrollPosition;
  constructor(_scrollDispatcher, _ngZone, _viewportRuler, _config) {
    this._scrollDispatcher = _scrollDispatcher;
    this._ngZone = _ngZone;
    this._viewportRuler = _viewportRuler;
    this._config = _config;
  }
  attach(overlayRef) {
    if (this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatScrollStrategyAlreadyAttachedError();
    }
    this._overlayRef = overlayRef;
  }
  enable() {
    if (this._scrollSubscription) {
      return;
    }
    const stream = this._scrollDispatcher.scrolled(0).pipe(filter((scrollable) => {
      return !scrollable || !this._overlayRef.overlayElement.contains(scrollable.getElementRef().nativeElement);
    }));
    if (this._config && this._config.threshold && this._config.threshold > 1) {
      this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top;
      this._scrollSubscription = stream.subscribe(() => {
        const scrollPosition = this._viewportRuler.getViewportScrollPosition().top;
        if (Math.abs(scrollPosition - this._initialScrollPosition) > this._config.threshold) {
          this._detach();
        } else {
          this._overlayRef.updatePosition();
        }
      });
    } else {
      this._scrollSubscription = stream.subscribe(this._detach);
    }
  }
  disable() {
    if (this._scrollSubscription) {
      this._scrollSubscription.unsubscribe();
      this._scrollSubscription = null;
    }
  }
  detach() {
    this.disable();
    this._overlayRef = null;
  }
  _detach = () => {
    this.disable();
    if (this._overlayRef.hasAttached()) {
      this._ngZone.run(() => this._overlayRef.detach());
    }
  };
};
var NoopScrollStrategy = class {
  enable() {
  }
  disable() {
  }
  attach() {
  }
};
function isElementScrolledOutsideView(element, scrollContainers) {
  return scrollContainers.some((containerBounds) => {
    const outsideAbove = element.bottom < containerBounds.top;
    const outsideBelow = element.top > containerBounds.bottom;
    const outsideLeft = element.right < containerBounds.left;
    const outsideRight = element.left > containerBounds.right;
    return outsideAbove || outsideBelow || outsideLeft || outsideRight;
  });
}
function isElementClippedByScrolling(element, scrollContainers) {
  return scrollContainers.some((scrollContainerRect) => {
    const clippedAbove = element.top < scrollContainerRect.top;
    const clippedBelow = element.bottom > scrollContainerRect.bottom;
    const clippedLeft = element.left < scrollContainerRect.left;
    const clippedRight = element.right > scrollContainerRect.right;
    return clippedAbove || clippedBelow || clippedLeft || clippedRight;
  });
}
function createRepositionScrollStrategy(injector, config) {
  return new RepositionScrollStrategy(injector.get(ScrollDispatcher), injector.get(ViewportRuler), injector.get(NgZone), config);
}
var RepositionScrollStrategy = class {
  _scrollDispatcher;
  _viewportRuler;
  _ngZone;
  _config;
  _scrollSubscription = null;
  _overlayRef;
  constructor(_scrollDispatcher, _viewportRuler, _ngZone, _config) {
    this._scrollDispatcher = _scrollDispatcher;
    this._viewportRuler = _viewportRuler;
    this._ngZone = _ngZone;
    this._config = _config;
  }
  attach(overlayRef) {
    if (this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatScrollStrategyAlreadyAttachedError();
    }
    this._overlayRef = overlayRef;
  }
  enable() {
    if (!this._scrollSubscription) {
      const throttle = this._config ? this._config.scrollThrottle : 0;
      this._scrollSubscription = this._scrollDispatcher.scrolled(throttle).subscribe(() => {
        this._overlayRef.updatePosition();
        if (this._config && this._config.autoClose) {
          const overlayRect = this._overlayRef.overlayElement.getBoundingClientRect();
          const {
            width,
            height
          } = this._viewportRuler.getViewportSize();
          const parentRects = [{
            width,
            height,
            bottom: height,
            right: width,
            top: 0,
            left: 0
          }];
          if (isElementScrolledOutsideView(overlayRect, parentRects)) {
            this.disable();
            this._ngZone.run(() => this._overlayRef.detach());
          }
        }
      });
    }
  }
  disable() {
    if (this._scrollSubscription) {
      this._scrollSubscription.unsubscribe();
      this._scrollSubscription = null;
    }
  }
  detach() {
    this.disable();
    this._overlayRef = null;
  }
};
var ScrollStrategyOptions = class _ScrollStrategyOptions {
  _injector = inject(Injector);
  constructor() {
  }
  noop = () => new NoopScrollStrategy();
  close = (config) => createCloseScrollStrategy(this._injector, config);
  block = () => createBlockScrollStrategy(this._injector);
  reposition = (config) => createRepositionScrollStrategy(this._injector, config);
  static ɵfac = function ScrollStrategyOptions_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ScrollStrategyOptions)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _ScrollStrategyOptions,
    factory: _ScrollStrategyOptions.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ScrollStrategyOptions, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var OverlayConfig = class {
  positionStrategy;
  scrollStrategy = new NoopScrollStrategy();
  panelClass = "";
  hasBackdrop = false;
  backdropClass = "cdk-overlay-dark-backdrop";
  disableAnimations;
  width;
  height;
  minWidth;
  minHeight;
  maxWidth;
  maxHeight;
  direction;
  disposeOnNavigation = false;
  usePopover;
  eventPredicate;
  constructor(config) {
    if (config) {
      const configKeys = Object.keys(config);
      for (const key of configKeys) {
        if (config[key] !== void 0) {
          this[key] = config[key];
        }
      }
    }
  }
};
var ConnectedOverlayPositionChange = class {
  connectionPair;
  scrollableViewProperties;
  constructor(connectionPair, scrollableViewProperties) {
    this.connectionPair = connectionPair;
    this.scrollableViewProperties = scrollableViewProperties;
  }
};
function validateVerticalPosition(property, value) {
  if (value !== "top" && value !== "bottom" && value !== "center") {
    throw Error(`ConnectedPosition: Invalid ${property} "${value}". Expected "top", "bottom" or "center".`);
  }
}
function validateHorizontalPosition(property, value) {
  if (value !== "start" && value !== "end" && value !== "center") {
    throw Error(`ConnectedPosition: Invalid ${property} "${value}". Expected "start", "end" or "center".`);
  }
}
var BaseOverlayDispatcher = class _BaseOverlayDispatcher {
  _attachedOverlays = [];
  _document = inject(DOCUMENT);
  _isAttached = false;
  constructor() {
  }
  ngOnDestroy() {
    this.detach();
  }
  add(overlayRef) {
    this.remove(overlayRef);
    this._attachedOverlays.push(overlayRef);
  }
  remove(overlayRef) {
    const index = this._attachedOverlays.indexOf(overlayRef);
    if (index > -1) {
      this._attachedOverlays.splice(index, 1);
    }
    if (this._attachedOverlays.length === 0) {
      this.detach();
    }
  }
  canReceiveEvent(overlayRef, event, stream) {
    if (stream.observers.length < 1) {
      return false;
    }
    if (overlayRef.eventPredicate) {
      return overlayRef.eventPredicate(event);
    }
    return true;
  }
  static ɵfac = function BaseOverlayDispatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BaseOverlayDispatcher)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _BaseOverlayDispatcher,
    factory: _BaseOverlayDispatcher.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseOverlayDispatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var OverlayKeyboardDispatcher = class _OverlayKeyboardDispatcher extends BaseOverlayDispatcher {
  _ngZone = inject(NgZone);
  _renderer = inject(RendererFactory2).createRenderer(null, null);
  _cleanupKeydown;
  add(overlayRef) {
    super.add(overlayRef);
    if (!this._isAttached) {
      this._ngZone.runOutsideAngular(() => {
        this._cleanupKeydown = this._renderer.listen("body", "keydown", this._keydownListener);
      });
      this._isAttached = true;
    }
  }
  detach() {
    if (this._isAttached) {
      this._cleanupKeydown?.();
      this._isAttached = false;
    }
  }
  _keydownListener = (event) => {
    const overlays = this._attachedOverlays;
    for (let i = overlays.length - 1; i > -1; i--) {
      const overlayRef = overlays[i];
      if (this.canReceiveEvent(overlayRef, event, overlayRef._keydownEvents)) {
        this._ngZone.run(() => overlayRef._keydownEvents.next(event));
        break;
      }
    }
  };
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵOverlayKeyboardDispatcher_BaseFactory;
    return function OverlayKeyboardDispatcher_Factory(__ngFactoryType__) {
      return (ɵOverlayKeyboardDispatcher_BaseFactory || (ɵOverlayKeyboardDispatcher_BaseFactory = ɵɵgetInheritedFactory(_OverlayKeyboardDispatcher)))(__ngFactoryType__ || _OverlayKeyboardDispatcher);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _OverlayKeyboardDispatcher,
    factory: _OverlayKeyboardDispatcher.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayKeyboardDispatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var OverlayOutsideClickDispatcher = class _OverlayOutsideClickDispatcher extends BaseOverlayDispatcher {
  _platform = inject(Platform);
  _ngZone = inject(NgZone);
  _renderer = inject(RendererFactory2).createRenderer(null, null);
  _cursorOriginalValue;
  _cursorStyleIsSet = false;
  _pointerDownEventTarget = null;
  _cleanups;
  add(overlayRef) {
    super.add(overlayRef);
    if (!this._isAttached) {
      const body = this._document.body;
      const eventOptions = {
        capture: true
      };
      const renderer = this._renderer;
      this._cleanups = this._ngZone.runOutsideAngular(() => [renderer.listen(body, "pointerdown", this._pointerDownListener, eventOptions), renderer.listen(body, "click", this._clickListener, eventOptions), renderer.listen(body, "auxclick", this._clickListener, eventOptions), renderer.listen(body, "contextmenu", this._clickListener, eventOptions)]);
      if (this._platform.IOS && !this._cursorStyleIsSet) {
        this._cursorOriginalValue = body.style.cursor;
        body.style.cursor = "pointer";
        this._cursorStyleIsSet = true;
      }
      this._isAttached = true;
    }
  }
  detach() {
    if (this._isAttached) {
      this._cleanups?.forEach((cleanup) => cleanup());
      this._cleanups = void 0;
      if (this._platform.IOS && this._cursorStyleIsSet) {
        this._document.body.style.cursor = this._cursorOriginalValue;
        this._cursorStyleIsSet = false;
      }
      this._isAttached = false;
    }
  }
  _pointerDownListener = (event) => {
    this._pointerDownEventTarget = _getEventTarget(event);
  };
  _clickListener = (event) => {
    const target = _getEventTarget(event);
    const origin = event.type === "click" && this._pointerDownEventTarget ? this._pointerDownEventTarget : target;
    this._pointerDownEventTarget = null;
    const overlays = this._attachedOverlays.slice();
    for (let i = overlays.length - 1; i > -1; i--) {
      const overlayRef = overlays[i];
      const outsidePointerEvents = overlayRef._outsidePointerEvents;
      if (!overlayRef.hasAttached() || !this.canReceiveEvent(overlayRef, event, outsidePointerEvents)) {
        continue;
      }
      if (containsPierceShadowDom(overlayRef.overlayElement, target) || containsPierceShadowDom(overlayRef.overlayElement, origin)) {
        break;
      }
      if (this._ngZone) {
        this._ngZone.run(() => outsidePointerEvents.next(event));
      } else {
        outsidePointerEvents.next(event);
      }
    }
  };
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵOverlayOutsideClickDispatcher_BaseFactory;
    return function OverlayOutsideClickDispatcher_Factory(__ngFactoryType__) {
      return (ɵOverlayOutsideClickDispatcher_BaseFactory || (ɵOverlayOutsideClickDispatcher_BaseFactory = ɵɵgetInheritedFactory(_OverlayOutsideClickDispatcher)))(__ngFactoryType__ || _OverlayOutsideClickDispatcher);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _OverlayOutsideClickDispatcher,
    factory: _OverlayOutsideClickDispatcher.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayOutsideClickDispatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function containsPierceShadowDom(parent, child) {
  const supportsShadowRoot = typeof ShadowRoot !== "undefined" && ShadowRoot;
  let current = child;
  while (current) {
    if (current === parent) {
      return true;
    }
    current = supportsShadowRoot && current instanceof ShadowRoot ? current.host : current.parentNode;
  }
  return false;
}
var _CdkOverlayStyleLoader = class __CdkOverlayStyleLoader {
  static ɵfac = function _CdkOverlayStyleLoader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || __CdkOverlayStyleLoader)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: __CdkOverlayStyleLoader,
    selectors: [["ng-component"]],
    hostAttrs: ["cdk-overlay-style-loader", ""],
    decls: 0,
    vars: 0,
    template: function _CdkOverlayStyleLoader_Template(rf, ctx) {
    },
    styles: [".cdk-overlay-container, .cdk-global-overlay-wrapper {\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n\n.cdk-overlay-container {\n  position: fixed;\n}\n@layer cdk-overlay {\n  .cdk-overlay-container {\n    z-index: 1000;\n  }\n}\n.cdk-overlay-container:empty {\n  display: none;\n}\n\n.cdk-global-overlay-wrapper {\n  display: flex;\n  position: absolute;\n}\n@layer cdk-overlay {\n  .cdk-global-overlay-wrapper {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-pane {\n  position: absolute;\n  pointer-events: auto;\n  box-sizing: border-box;\n  display: flex;\n  max-width: 100%;\n  max-height: 100%;\n}\n@layer cdk-overlay {\n  .cdk-overlay-pane {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-backdrop {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  pointer-events: auto;\n  -webkit-tap-highlight-color: transparent;\n  opacity: 0;\n  touch-action: manipulation;\n}\n@layer cdk-overlay {\n  .cdk-overlay-backdrop {\n    z-index: 1000;\n    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  }\n}\n@media (prefers-reduced-motion) {\n  .cdk-overlay-backdrop {\n    transition-duration: 1ms;\n  }\n}\n\n.cdk-overlay-backdrop-showing {\n  opacity: 1;\n}\n@media (forced-colors: active) {\n  .cdk-overlay-backdrop-showing {\n    opacity: 0.6;\n  }\n}\n\n@layer cdk-overlay {\n  .cdk-overlay-dark-backdrop {\n    background: rgba(0, 0, 0, 0.32);\n  }\n}\n\n.cdk-overlay-transparent-backdrop {\n  transition: visibility 1ms linear, opacity 1ms linear;\n  visibility: hidden;\n  opacity: 1;\n}\n.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {\n  opacity: 0;\n  visibility: visible;\n}\n\n.cdk-overlay-backdrop-noop-animation {\n  transition: none;\n}\n\n.cdk-overlay-connected-position-bounding-box {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  min-width: 1px;\n  min-height: 1px;\n}\n@layer cdk-overlay {\n  .cdk-overlay-connected-position-bounding-box {\n    z-index: 1000;\n  }\n}\n\n.cdk-global-scrollblock {\n  position: fixed;\n  width: 100%;\n  overflow-y: scroll;\n}\n\n.cdk-overlay-popover {\n  background: none;\n  border: none;\n  padding: 0;\n  outline: 0;\n  overflow: visible;\n  position: fixed;\n  pointer-events: none;\n  white-space: normal;\n  color: inherit;\n  text-decoration: none;\n  width: 100%;\n  height: 100%;\n  inset: auto;\n  top: 0;\n  left: 0;\n}\n.cdk-overlay-popover::backdrop {\n  display: none;\n}\n.cdk-overlay-popover .cdk-overlay-backdrop {\n  position: fixed;\n  z-index: auto;\n}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_CdkOverlayStyleLoader, [{
    type: Component,
    args: [{
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      host: {
        "cdk-overlay-style-loader": ""
      },
      styles: [".cdk-overlay-container, .cdk-global-overlay-wrapper {\n  pointer-events: none;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n}\n\n.cdk-overlay-container {\n  position: fixed;\n}\n@layer cdk-overlay {\n  .cdk-overlay-container {\n    z-index: 1000;\n  }\n}\n.cdk-overlay-container:empty {\n  display: none;\n}\n\n.cdk-global-overlay-wrapper {\n  display: flex;\n  position: absolute;\n}\n@layer cdk-overlay {\n  .cdk-global-overlay-wrapper {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-pane {\n  position: absolute;\n  pointer-events: auto;\n  box-sizing: border-box;\n  display: flex;\n  max-width: 100%;\n  max-height: 100%;\n}\n@layer cdk-overlay {\n  .cdk-overlay-pane {\n    z-index: 1000;\n  }\n}\n\n.cdk-overlay-backdrop {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  pointer-events: auto;\n  -webkit-tap-highlight-color: transparent;\n  opacity: 0;\n  touch-action: manipulation;\n}\n@layer cdk-overlay {\n  .cdk-overlay-backdrop {\n    z-index: 1000;\n    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  }\n}\n@media (prefers-reduced-motion) {\n  .cdk-overlay-backdrop {\n    transition-duration: 1ms;\n  }\n}\n\n.cdk-overlay-backdrop-showing {\n  opacity: 1;\n}\n@media (forced-colors: active) {\n  .cdk-overlay-backdrop-showing {\n    opacity: 0.6;\n  }\n}\n\n@layer cdk-overlay {\n  .cdk-overlay-dark-backdrop {\n    background: rgba(0, 0, 0, 0.32);\n  }\n}\n\n.cdk-overlay-transparent-backdrop {\n  transition: visibility 1ms linear, opacity 1ms linear;\n  visibility: hidden;\n  opacity: 1;\n}\n.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {\n  opacity: 0;\n  visibility: visible;\n}\n\n.cdk-overlay-backdrop-noop-animation {\n  transition: none;\n}\n\n.cdk-overlay-connected-position-bounding-box {\n  position: absolute;\n  display: flex;\n  flex-direction: column;\n  min-width: 1px;\n  min-height: 1px;\n}\n@layer cdk-overlay {\n  .cdk-overlay-connected-position-bounding-box {\n    z-index: 1000;\n  }\n}\n\n.cdk-global-scrollblock {\n  position: fixed;\n  width: 100%;\n  overflow-y: scroll;\n}\n\n.cdk-overlay-popover {\n  background: none;\n  border: none;\n  padding: 0;\n  outline: 0;\n  overflow: visible;\n  position: fixed;\n  pointer-events: none;\n  white-space: normal;\n  color: inherit;\n  text-decoration: none;\n  width: 100%;\n  height: 100%;\n  inset: auto;\n  top: 0;\n  left: 0;\n}\n.cdk-overlay-popover::backdrop {\n  display: none;\n}\n.cdk-overlay-popover .cdk-overlay-backdrop {\n  position: fixed;\n  z-index: auto;\n}\n"]
    }]
  }], null, null);
})();
var OverlayContainer = class _OverlayContainer {
  _platform = inject(Platform);
  _containerElement;
  _document = inject(DOCUMENT);
  _styleLoader = inject(_CdkPrivateStyleLoader);
  constructor() {
  }
  ngOnDestroy() {
    this._containerElement?.remove();
  }
  getContainerElement() {
    this._loadStyles();
    if (!this._containerElement) {
      this._createContainer();
    }
    return this._containerElement;
  }
  _createContainer() {
    const containerClass = "cdk-overlay-container";
    if (this._platform.isBrowser || _isTestEnvironment()) {
      const oppositePlatformContainers = this._document.querySelectorAll(`.${containerClass}[platform="server"], .${containerClass}[platform="test"]`);
      for (let i = 0; i < oppositePlatformContainers.length; i++) {
        oppositePlatformContainers[i].remove();
      }
    }
    const container = this._document.createElement("div");
    container.classList.add(containerClass);
    if (_isTestEnvironment()) {
      container.setAttribute("platform", "test");
    } else if (!this._platform.isBrowser) {
      container.setAttribute("platform", "server");
    }
    this._document.body.appendChild(container);
    this._containerElement = container;
  }
  _loadStyles() {
    this._styleLoader.load(_CdkOverlayStyleLoader);
  }
  static ɵfac = function OverlayContainer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OverlayContainer)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _OverlayContainer,
    factory: _OverlayContainer.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayContainer, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var BackdropRef = class {
  _renderer;
  _ngZone;
  element;
  _cleanupClick;
  _cleanupTransitionEnd;
  _fallbackTimeout;
  constructor(document, _renderer, _ngZone, onClick) {
    this._renderer = _renderer;
    this._ngZone = _ngZone;
    this.element = document.createElement("div");
    this.element.classList.add("cdk-overlay-backdrop");
    this._cleanupClick = _renderer.listen(this.element, "click", onClick);
  }
  detach() {
    this._ngZone.runOutsideAngular(() => {
      const element = this.element;
      clearTimeout(this._fallbackTimeout);
      this._cleanupTransitionEnd?.();
      this._cleanupTransitionEnd = this._renderer.listen(element, "transitionend", this.dispose);
      this._fallbackTimeout = setTimeout(this.dispose, 500);
      element.style.pointerEvents = "none";
      element.classList.remove("cdk-overlay-backdrop-showing");
    });
  }
  dispose = () => {
    clearTimeout(this._fallbackTimeout);
    this._cleanupClick?.();
    this._cleanupTransitionEnd?.();
    this._cleanupClick = this._cleanupTransitionEnd = this._fallbackTimeout = void 0;
    this.element.remove();
  };
};
function isElement(value) {
  return value && value.nodeType === 1;
}
var OverlayRef = class {
  _portalOutlet;
  _host;
  _pane;
  _config;
  _ngZone;
  _keyboardDispatcher;
  _document;
  _location;
  _outsideClickDispatcher;
  _animationsDisabled;
  _injector;
  _renderer;
  _backdropClick = new Subject();
  _attachments = new Subject();
  _detachments = new Subject();
  _positionStrategy;
  _scrollStrategy;
  _locationChanges = Subscription.EMPTY;
  _backdropRef = null;
  _detachContentMutationObserver;
  _detachContentAfterRenderRef;
  _disposed = false;
  _previousHostParent;
  _keydownEvents = new Subject();
  _outsidePointerEvents = new Subject();
  _afterNextRenderRef;
  constructor(_portalOutlet, _host, _pane, _config, _ngZone, _keyboardDispatcher, _document, _location, _outsideClickDispatcher, _animationsDisabled2 = false, _injector, _renderer) {
    this._portalOutlet = _portalOutlet;
    this._host = _host;
    this._pane = _pane;
    this._config = _config;
    this._ngZone = _ngZone;
    this._keyboardDispatcher = _keyboardDispatcher;
    this._document = _document;
    this._location = _location;
    this._outsideClickDispatcher = _outsideClickDispatcher;
    this._animationsDisabled = _animationsDisabled2;
    this._injector = _injector;
    this._renderer = _renderer;
    if (_config.scrollStrategy) {
      this._scrollStrategy = _config.scrollStrategy;
      this._scrollStrategy.attach(this);
    }
    this._positionStrategy = _config.positionStrategy;
  }
  get overlayElement() {
    return this._pane;
  }
  get backdropElement() {
    return this._backdropRef?.element || null;
  }
  get hostElement() {
    return this._host;
  }
  get eventPredicate() {
    return this._config?.eventPredicate || null;
  }
  attach(portal) {
    if (this._disposed) {
      return null;
    }
    this._attachHost();
    const attachResult = this._portalOutlet.attach(portal);
    this._positionStrategy?.attach(this);
    this._updateStackingOrder();
    this._updateElementSize();
    this._updateElementDirection();
    if (this._scrollStrategy) {
      this._scrollStrategy.enable();
    }
    this._afterNextRenderRef?.destroy();
    this._afterNextRenderRef = afterNextRender(() => {
      if (this.hasAttached()) {
        this.updatePosition();
      }
    }, {
      injector: this._injector
    });
    this._togglePointerEvents(true);
    if (this._config.hasBackdrop) {
      this._attachBackdrop();
    }
    if (this._config.panelClass) {
      this._toggleClasses(this._pane, this._config.panelClass, true);
    }
    this._attachments.next();
    this._completeDetachContent();
    this._keyboardDispatcher.add(this);
    if (this._config.disposeOnNavigation) {
      this._locationChanges = this._location.subscribe(() => this.dispose());
    }
    this._outsideClickDispatcher.add(this);
    if (typeof attachResult?.onDestroy === "function") {
      attachResult.onDestroy(() => {
        if (this.hasAttached()) {
          this._ngZone.runOutsideAngular(() => Promise.resolve().then(() => this.detach()));
        }
      });
    }
    return attachResult;
  }
  detach() {
    if (!this.hasAttached()) {
      return;
    }
    this.detachBackdrop();
    this._togglePointerEvents(false);
    if (this._positionStrategy && this._positionStrategy.detach) {
      this._positionStrategy.detach();
    }
    if (this._scrollStrategy) {
      this._scrollStrategy.disable();
    }
    const detachmentResult = this._portalOutlet.detach();
    this._detachments.next();
    this._completeDetachContent();
    this._keyboardDispatcher.remove(this);
    this._detachContentWhenEmpty();
    this._locationChanges.unsubscribe();
    this._outsideClickDispatcher.remove(this);
    return detachmentResult;
  }
  dispose() {
    if (this._disposed) {
      return;
    }
    const isAttached = this.hasAttached();
    if (this._positionStrategy) {
      this._positionStrategy.dispose();
    }
    this._disposeScrollStrategy();
    this._backdropRef?.dispose();
    this._locationChanges.unsubscribe();
    this._keyboardDispatcher.remove(this);
    this._portalOutlet.dispose();
    this._attachments.complete();
    this._backdropClick.complete();
    this._keydownEvents.complete();
    this._outsidePointerEvents.complete();
    this._outsideClickDispatcher.remove(this);
    this._host?.remove();
    this._afterNextRenderRef?.destroy();
    this._previousHostParent = this._pane = this._host = this._backdropRef = null;
    if (isAttached) {
      this._detachments.next();
    }
    this._detachments.complete();
    this._completeDetachContent();
    this._disposed = true;
  }
  hasAttached() {
    return this._portalOutlet.hasAttached();
  }
  backdropClick() {
    return this._backdropClick;
  }
  attachments() {
    return this._attachments;
  }
  detachments() {
    return this._detachments;
  }
  keydownEvents() {
    return this._keydownEvents;
  }
  outsidePointerEvents() {
    return this._outsidePointerEvents;
  }
  getConfig() {
    return this._config;
  }
  updatePosition() {
    if (this._positionStrategy) {
      this._positionStrategy.apply();
    }
  }
  updatePositionStrategy(strategy) {
    if (strategy === this._positionStrategy) {
      return;
    }
    if (this._positionStrategy) {
      this._positionStrategy.dispose();
    }
    this._positionStrategy = strategy;
    if (this.hasAttached()) {
      strategy.attach(this);
      this.updatePosition();
    }
  }
  updateSize(sizeConfig) {
    this._config = __spreadValues(__spreadValues({}, this._config), sizeConfig);
    this._updateElementSize();
  }
  setDirection(dir) {
    this._config = __spreadProps(__spreadValues({}, this._config), {
      direction: dir
    });
    this._updateElementDirection();
  }
  addPanelClass(classes) {
    if (this._pane) {
      this._toggleClasses(this._pane, classes, true);
    }
  }
  removePanelClass(classes) {
    if (this._pane) {
      this._toggleClasses(this._pane, classes, false);
    }
  }
  getDirection() {
    const direction = this._config.direction;
    if (!direction) {
      return "ltr";
    }
    return typeof direction === "string" ? direction : direction.value;
  }
  updateScrollStrategy(strategy) {
    if (strategy === this._scrollStrategy) {
      return;
    }
    this._disposeScrollStrategy();
    this._scrollStrategy = strategy;
    if (this.hasAttached()) {
      strategy.attach(this);
      strategy.enable();
    }
  }
  _updateElementDirection() {
    this._host.setAttribute("dir", this.getDirection());
  }
  _updateElementSize() {
    if (!this._pane) {
      return;
    }
    const style = this._pane.style;
    style.width = coerceCssPixelValue(this._config.width);
    style.height = coerceCssPixelValue(this._config.height);
    style.minWidth = coerceCssPixelValue(this._config.minWidth);
    style.minHeight = coerceCssPixelValue(this._config.minHeight);
    style.maxWidth = coerceCssPixelValue(this._config.maxWidth);
    style.maxHeight = coerceCssPixelValue(this._config.maxHeight);
  }
  _togglePointerEvents(enablePointer) {
    this._pane.style.pointerEvents = enablePointer ? "" : "none";
  }
  _attachHost() {
    if (!this._host.parentElement) {
      const customInsertionPoint = this._config.usePopover ? this._positionStrategy?.getPopoverInsertionPoint?.() : null;
      if (isElement(customInsertionPoint)) {
        customInsertionPoint.after(this._host);
      } else if (customInsertionPoint?.type === "parent") {
        customInsertionPoint.element.appendChild(this._host);
      } else {
        this._previousHostParent?.appendChild(this._host);
      }
    }
    if (this._config.usePopover) {
      try {
        this._host["showPopover"]();
      } catch {
      }
    }
  }
  _attachBackdrop() {
    const showingClass = "cdk-overlay-backdrop-showing";
    this._backdropRef?.dispose();
    this._backdropRef = new BackdropRef(this._document, this._renderer, this._ngZone, (event) => {
      this._backdropClick.next(event);
    });
    if (this._animationsDisabled) {
      this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation");
    }
    if (this._config.backdropClass) {
      this._toggleClasses(this._backdropRef.element, this._config.backdropClass, true);
    }
    if (this._config.usePopover) {
      this._host.prepend(this._backdropRef.element);
    } else {
      this._host.parentElement.insertBefore(this._backdropRef.element, this._host);
    }
    if (!this._animationsDisabled && typeof requestAnimationFrame !== "undefined") {
      this._ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => this._backdropRef?.element.classList.add(showingClass));
      });
    } else {
      this._backdropRef.element.classList.add(showingClass);
    }
  }
  _updateStackingOrder() {
    if (!this._config.usePopover && this._host.nextSibling) {
      this._host.parentNode.appendChild(this._host);
    }
  }
  detachBackdrop() {
    if (this._animationsDisabled) {
      this._backdropRef?.dispose();
      this._backdropRef = null;
    } else {
      this._backdropRef?.detach();
    }
  }
  _toggleClasses(element, cssClasses, isAdd) {
    const classes = coerceArray(cssClasses || []).filter((c) => !!c);
    if (classes.length) {
      isAdd ? element.classList.add(...classes) : element.classList.remove(...classes);
    }
  }
  _detachContentWhenEmpty() {
    let rethrow = false;
    try {
      this._detachContentAfterRenderRef = afterNextRender(() => {
        rethrow = true;
        this._detachContent();
      }, {
        injector: this._injector
      });
    } catch (e) {
      if (rethrow) {
        throw e;
      }
      this._detachContent();
    }
    if (globalThis.MutationObserver && this._pane) {
      this._detachContentMutationObserver ||= new globalThis.MutationObserver(() => {
        this._detachContent();
      });
      this._detachContentMutationObserver.observe(this._pane, {
        childList: true
      });
    }
  }
  _detachContent() {
    if (!this._pane || !this._host || this._pane.children.length === 0) {
      if (this._pane && this._config.panelClass) {
        this._toggleClasses(this._pane, this._config.panelClass, false);
      }
      if (this._host && this._host.parentElement) {
        this._previousHostParent = this._host.parentElement;
        this._host.remove();
      }
      this._completeDetachContent();
    }
  }
  _completeDetachContent() {
    this._detachContentAfterRenderRef?.destroy();
    this._detachContentAfterRenderRef = void 0;
    this._detachContentMutationObserver?.disconnect();
  }
  _disposeScrollStrategy() {
    const scrollStrategy = this._scrollStrategy;
    scrollStrategy?.disable();
    scrollStrategy?.detach?.();
  }
};
var boundingBoxClass = "cdk-overlay-connected-position-bounding-box";
var cssUnitPattern = /([A-Za-z%]+)$/;
function createFlexibleConnectedPositionStrategy(injector, origin) {
  return new FlexibleConnectedPositionStrategy(origin, injector.get(ViewportRuler), injector.get(DOCUMENT), injector.get(Platform), injector.get(OverlayContainer));
}
var FlexibleConnectedPositionStrategy = class {
  _viewportRuler;
  _document;
  _platform;
  _overlayContainer;
  _overlayRef;
  _isInitialRender = false;
  _lastBoundingBoxSize = {
    width: 0,
    height: 0
  };
  _isPushed = false;
  _canPush = true;
  _growAfterOpen = false;
  _hasFlexibleDimensions = true;
  _positionLocked = false;
  _originRect;
  _overlayRect;
  _viewportRect;
  _containerRect;
  _viewportMargin = 0;
  _scrollables = [];
  _preferredPositions = [];
  _origin;
  _pane;
  _isDisposed = false;
  _boundingBox = null;
  _lastPosition = null;
  _lastScrollVisibility = null;
  _positionChanges = new Subject();
  _resizeSubscription = Subscription.EMPTY;
  _offsetX = 0;
  _offsetY = 0;
  _transformOriginSelector;
  _appliedPanelClasses = [];
  _previousPushAmount = null;
  _popoverLocation = "global";
  positionChanges = this._positionChanges;
  get positions() {
    return this._preferredPositions;
  }
  constructor(connectedTo, _viewportRuler, _document, _platform, _overlayContainer) {
    this._viewportRuler = _viewportRuler;
    this._document = _document;
    this._platform = _platform;
    this._overlayContainer = _overlayContainer;
    this.setOrigin(connectedTo);
  }
  attach(overlayRef) {
    if (this._overlayRef && overlayRef !== this._overlayRef && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw Error("This position strategy is already attached to an overlay");
    }
    this._validatePositions();
    overlayRef.hostElement.classList.add(boundingBoxClass);
    this._overlayRef = overlayRef;
    this._boundingBox = overlayRef.hostElement;
    this._pane = overlayRef.overlayElement;
    this._isDisposed = false;
    this._isInitialRender = true;
    this._lastPosition = null;
    this._resizeSubscription.unsubscribe();
    this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
      this._isInitialRender = true;
      this.apply();
    });
  }
  apply() {
    if (this._isDisposed || !this._platform.isBrowser) {
      return;
    }
    if (!this._isInitialRender && this._positionLocked && this._lastPosition) {
      this.reapplyLastPosition();
      return;
    }
    this._clearPanelClasses();
    this._resetOverlayElementStyles();
    this._resetBoundingBoxStyles();
    this._viewportRect = this._getNarrowedViewportRect();
    this._originRect = this._getOriginRect();
    this._overlayRect = this._pane.getBoundingClientRect();
    this._containerRect = this._getContainerRect();
    const originRect = this._originRect;
    const overlayRect = this._overlayRect;
    const viewportRect = this._viewportRect;
    const containerRect = this._containerRect;
    const flexibleFits = [];
    let fallback;
    for (let pos of this._preferredPositions) {
      let originPoint = this._getOriginPoint(originRect, containerRect, pos);
      let overlayPoint = this._getOverlayPoint(originPoint, overlayRect, pos);
      let overlayFit = this._getOverlayFit(overlayPoint, overlayRect, viewportRect, pos);
      if (overlayFit.isCompletelyWithinViewport) {
        this._isPushed = false;
        this._applyPosition(pos, originPoint);
        return;
      }
      if (this._canFitWithFlexibleDimensions(overlayFit, overlayPoint, viewportRect)) {
        flexibleFits.push({
          position: pos,
          origin: originPoint,
          overlayRect,
          boundingBoxRect: this._calculateBoundingBoxRect(originPoint, pos)
        });
        continue;
      }
      if (!fallback || fallback.overlayFit.visibleArea < overlayFit.visibleArea) {
        fallback = {
          overlayFit,
          overlayPoint,
          originPoint,
          position: pos,
          overlayRect
        };
      }
    }
    if (flexibleFits.length) {
      let bestFit = null;
      let bestScore = -1;
      for (const fit of flexibleFits) {
        const score = fit.boundingBoxRect.width * fit.boundingBoxRect.height * (fit.position.weight || 1);
        if (score > bestScore) {
          bestScore = score;
          bestFit = fit;
        }
      }
      this._isPushed = false;
      this._applyPosition(bestFit.position, bestFit.origin);
      return;
    }
    if (this._canPush) {
      this._isPushed = true;
      this._applyPosition(fallback.position, fallback.originPoint);
      return;
    }
    this._applyPosition(fallback.position, fallback.originPoint);
  }
  detach() {
    this._clearPanelClasses();
    this._lastPosition = null;
    this._previousPushAmount = null;
    this._resizeSubscription.unsubscribe();
  }
  dispose() {
    if (this._isDisposed) {
      return;
    }
    if (this._boundingBox) {
      extendStyles(this._boundingBox.style, {
        top: "",
        left: "",
        right: "",
        bottom: "",
        height: "",
        width: "",
        alignItems: "",
        justifyContent: ""
      });
    }
    if (this._pane) {
      this._resetOverlayElementStyles();
    }
    if (this._overlayRef) {
      this._overlayRef.hostElement.classList.remove(boundingBoxClass);
    }
    this.detach();
    this._positionChanges.complete();
    this._overlayRef = this._boundingBox = null;
    this._isDisposed = true;
  }
  reapplyLastPosition() {
    if (this._isDisposed || !this._platform.isBrowser) {
      return;
    }
    const lastPosition = this._lastPosition;
    if (lastPosition) {
      this._originRect = this._getOriginRect();
      this._overlayRect = this._pane.getBoundingClientRect();
      this._viewportRect = this._getNarrowedViewportRect();
      this._containerRect = this._getContainerRect();
      this._applyPosition(lastPosition, this._getOriginPoint(this._originRect, this._containerRect, lastPosition));
    } else {
      this.apply();
    }
  }
  withScrollableContainers(scrollables) {
    this._scrollables = scrollables;
    return this;
  }
  withPositions(positions) {
    this._preferredPositions = positions;
    if (positions.indexOf(this._lastPosition) === -1) {
      this._lastPosition = null;
    }
    this._validatePositions();
    return this;
  }
  withViewportMargin(margin) {
    this._viewportMargin = margin;
    return this;
  }
  withFlexibleDimensions(flexibleDimensions = true) {
    this._hasFlexibleDimensions = flexibleDimensions;
    return this;
  }
  withGrowAfterOpen(growAfterOpen = true) {
    this._growAfterOpen = growAfterOpen;
    return this;
  }
  withPush(canPush = true) {
    this._canPush = canPush;
    return this;
  }
  withLockedPosition(isLocked = true) {
    this._positionLocked = isLocked;
    return this;
  }
  setOrigin(origin) {
    this._origin = origin;
    return this;
  }
  withDefaultOffsetX(offset) {
    this._offsetX = offset;
    return this;
  }
  withDefaultOffsetY(offset) {
    this._offsetY = offset;
    return this;
  }
  withTransformOriginOn(selector) {
    this._transformOriginSelector = selector;
    return this;
  }
  withPopoverLocation(location) {
    this._popoverLocation = location;
    return this;
  }
  getPopoverInsertionPoint() {
    if (this._popoverLocation === "global") {
      return null;
    } else if (this._popoverLocation !== "inline") {
      return this._popoverLocation;
    }
    if (this._origin instanceof ElementRef) {
      return this._origin.nativeElement;
    } else if (isElement(this._origin)) {
      return this._origin;
    } else {
      return null;
    }
  }
  _getOriginPoint(originRect, containerRect, pos) {
    let x;
    if (pos.originX == "center") {
      x = originRect.left + originRect.width / 2;
    } else {
      const startX = this._isRtl() ? originRect.right : originRect.left;
      const endX = this._isRtl() ? originRect.left : originRect.right;
      x = pos.originX == "start" ? startX : endX;
    }
    if (containerRect.left < 0) {
      x -= containerRect.left;
    }
    let y;
    if (pos.originY == "center") {
      y = originRect.top + originRect.height / 2;
    } else {
      y = pos.originY == "top" ? originRect.top : originRect.bottom;
    }
    if (containerRect.top < 0) {
      y -= containerRect.top;
    }
    return {
      x,
      y
    };
  }
  _getOverlayPoint(originPoint, overlayRect, pos) {
    let overlayStartX;
    if (pos.overlayX == "center") {
      overlayStartX = -overlayRect.width / 2;
    } else if (pos.overlayX === "start") {
      overlayStartX = this._isRtl() ? -overlayRect.width : 0;
    } else {
      overlayStartX = this._isRtl() ? 0 : -overlayRect.width;
    }
    let overlayStartY;
    if (pos.overlayY == "center") {
      overlayStartY = -overlayRect.height / 2;
    } else {
      overlayStartY = pos.overlayY == "top" ? 0 : -overlayRect.height;
    }
    return {
      x: originPoint.x + overlayStartX,
      y: originPoint.y + overlayStartY
    };
  }
  _getOverlayFit(point, rawOverlayRect, viewport, position) {
    const overlay = getRoundedBoundingClientRect(rawOverlayRect);
    let {
      x,
      y
    } = point;
    let offsetX = this._getOffset(position, "x");
    let offsetY = this._getOffset(position, "y");
    if (offsetX) {
      x += offsetX;
    }
    if (offsetY) {
      y += offsetY;
    }
    let leftOverflow = 0 - x;
    let rightOverflow = x + overlay.width - viewport.width;
    let topOverflow = 0 - y;
    let bottomOverflow = y + overlay.height - viewport.height;
    let visibleWidth = this._subtractOverflows(overlay.width, leftOverflow, rightOverflow);
    let visibleHeight = this._subtractOverflows(overlay.height, topOverflow, bottomOverflow);
    let visibleArea = visibleWidth * visibleHeight;
    return {
      visibleArea,
      isCompletelyWithinViewport: overlay.width * overlay.height === visibleArea,
      fitsInViewportVertically: visibleHeight === overlay.height,
      fitsInViewportHorizontally: visibleWidth == overlay.width
    };
  }
  _canFitWithFlexibleDimensions(fit, point, viewport) {
    if (this._hasFlexibleDimensions) {
      const availableHeight = viewport.bottom - point.y;
      const availableWidth = viewport.right - point.x;
      const minHeight = getPixelValue(this._overlayRef.getConfig().minHeight);
      const minWidth = getPixelValue(this._overlayRef.getConfig().minWidth);
      const verticalFit = fit.fitsInViewportVertically || minHeight != null && minHeight <= availableHeight;
      const horizontalFit = fit.fitsInViewportHorizontally || minWidth != null && minWidth <= availableWidth;
      return verticalFit && horizontalFit;
    }
    return false;
  }
  _pushOverlayOnScreen(start, rawOverlayRect, scrollPosition) {
    if (this._previousPushAmount && this._positionLocked) {
      return {
        x: start.x + this._previousPushAmount.x,
        y: start.y + this._previousPushAmount.y
      };
    }
    const overlay = getRoundedBoundingClientRect(rawOverlayRect);
    const viewport = this._viewportRect;
    const overflowRight = Math.max(start.x + overlay.width - viewport.width, 0);
    const overflowBottom = Math.max(start.y + overlay.height - viewport.height, 0);
    const overflowTop = Math.max(viewport.top - scrollPosition.top - start.y, 0);
    const overflowLeft = Math.max(viewport.left - scrollPosition.left - start.x, 0);
    let pushX = 0;
    let pushY = 0;
    if (overlay.width <= viewport.width) {
      pushX = overflowLeft || -overflowRight;
    } else {
      pushX = start.x < this._getViewportMarginStart() ? viewport.left - scrollPosition.left - start.x : 0;
    }
    if (overlay.height <= viewport.height) {
      pushY = overflowTop || -overflowBottom;
    } else {
      pushY = start.y < this._getViewportMarginTop() ? viewport.top - scrollPosition.top - start.y : 0;
    }
    this._previousPushAmount = {
      x: pushX,
      y: pushY
    };
    return {
      x: start.x + pushX,
      y: start.y + pushY
    };
  }
  _applyPosition(position, originPoint) {
    this._setTransformOrigin(position);
    this._setOverlayElementStyles(originPoint, position);
    this._setBoundingBoxStyles(originPoint, position);
    if (position.panelClass) {
      this._addPanelClasses(position.panelClass);
    }
    if (this._positionChanges.observers.length) {
      const scrollVisibility = this._getScrollVisibility();
      if (position !== this._lastPosition || !this._lastScrollVisibility || !compareScrollVisibility(this._lastScrollVisibility, scrollVisibility)) {
        const changeEvent = new ConnectedOverlayPositionChange(position, scrollVisibility);
        this._positionChanges.next(changeEvent);
      }
      this._lastScrollVisibility = scrollVisibility;
    }
    this._lastPosition = position;
    this._isInitialRender = false;
  }
  _setTransformOrigin(position) {
    if (!this._transformOriginSelector) {
      return;
    }
    const elements = this._boundingBox.querySelectorAll(this._transformOriginSelector);
    let xOrigin;
    let yOrigin = position.overlayY;
    if (position.overlayX === "center") {
      xOrigin = "center";
    } else if (this._isRtl()) {
      xOrigin = position.overlayX === "start" ? "right" : "left";
    } else {
      xOrigin = position.overlayX === "start" ? "left" : "right";
    }
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.transformOrigin = `${xOrigin} ${yOrigin}`;
    }
  }
  _calculateBoundingBoxRect(origin, position) {
    const viewport = this._viewportRect;
    const isRtl = this._isRtl();
    let height, top, bottom;
    if (position.overlayY === "top") {
      top = origin.y;
      height = viewport.height - top + this._getViewportMarginBottom();
    } else if (position.overlayY === "bottom") {
      bottom = viewport.height - origin.y + this._getViewportMarginTop() + this._getViewportMarginBottom();
      height = viewport.height - bottom + this._getViewportMarginTop();
    } else {
      const smallestDistanceToViewportEdge = Math.min(viewport.bottom - origin.y + viewport.top, origin.y);
      const previousHeight = this._lastBoundingBoxSize.height;
      height = smallestDistanceToViewportEdge * 2;
      top = origin.y - smallestDistanceToViewportEdge;
      if (height > previousHeight && !this._isInitialRender && !this._growAfterOpen) {
        top = origin.y - previousHeight / 2;
      }
    }
    const isBoundedByRightViewportEdge = position.overlayX === "start" && !isRtl || position.overlayX === "end" && isRtl;
    const isBoundedByLeftViewportEdge = position.overlayX === "end" && !isRtl || position.overlayX === "start" && isRtl;
    let width, left, right;
    if (isBoundedByLeftViewportEdge) {
      right = viewport.width - origin.x + this._getViewportMarginStart() + this._getViewportMarginEnd();
      width = origin.x - this._getViewportMarginStart();
    } else if (isBoundedByRightViewportEdge) {
      left = origin.x;
      width = viewport.right - origin.x - this._getViewportMarginEnd();
    } else {
      const smallestDistanceToViewportEdge = Math.min(viewport.right - origin.x + viewport.left, origin.x);
      const previousWidth = this._lastBoundingBoxSize.width;
      width = smallestDistanceToViewportEdge * 2;
      left = origin.x - smallestDistanceToViewportEdge;
      if (width > previousWidth && !this._isInitialRender && !this._growAfterOpen) {
        left = origin.x - previousWidth / 2;
      }
    }
    return {
      top,
      left,
      bottom,
      right,
      width,
      height
    };
  }
  _setBoundingBoxStyles(origin, position) {
    const boundingBoxRect = this._calculateBoundingBoxRect(origin, position);
    if (!this._isInitialRender && !this._growAfterOpen) {
      boundingBoxRect.height = Math.min(boundingBoxRect.height, this._lastBoundingBoxSize.height);
      boundingBoxRect.width = Math.min(boundingBoxRect.width, this._lastBoundingBoxSize.width);
    }
    const styles = {};
    if (this._hasExactPosition()) {
      styles.top = styles.left = "0";
      styles.bottom = styles.right = "auto";
      styles.maxHeight = styles.maxWidth = "";
      styles.width = styles.height = "100%";
    } else {
      const maxHeight = this._overlayRef.getConfig().maxHeight;
      const maxWidth = this._overlayRef.getConfig().maxWidth;
      styles.width = coerceCssPixelValue(boundingBoxRect.width);
      styles.height = coerceCssPixelValue(boundingBoxRect.height);
      styles.top = coerceCssPixelValue(boundingBoxRect.top) || "auto";
      styles.bottom = coerceCssPixelValue(boundingBoxRect.bottom) || "auto";
      styles.left = coerceCssPixelValue(boundingBoxRect.left) || "auto";
      styles.right = coerceCssPixelValue(boundingBoxRect.right) || "auto";
      if (position.overlayX === "center") {
        styles.alignItems = "center";
      } else {
        styles.alignItems = position.overlayX === "end" ? "flex-end" : "flex-start";
      }
      if (position.overlayY === "center") {
        styles.justifyContent = "center";
      } else {
        styles.justifyContent = position.overlayY === "bottom" ? "flex-end" : "flex-start";
      }
      if (maxHeight) {
        styles.maxHeight = coerceCssPixelValue(maxHeight);
      }
      if (maxWidth) {
        styles.maxWidth = coerceCssPixelValue(maxWidth);
      }
    }
    this._lastBoundingBoxSize = boundingBoxRect;
    extendStyles(this._boundingBox.style, styles);
  }
  _resetBoundingBoxStyles() {
    extendStyles(this._boundingBox.style, {
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      height: "",
      width: "",
      alignItems: "",
      justifyContent: ""
    });
  }
  _resetOverlayElementStyles() {
    extendStyles(this._pane.style, {
      top: "",
      left: "",
      bottom: "",
      right: "",
      position: "",
      transform: ""
    });
  }
  _setOverlayElementStyles(originPoint, position) {
    const styles = {};
    const hasExactPosition = this._hasExactPosition();
    const hasFlexibleDimensions = this._hasFlexibleDimensions;
    const config = this._overlayRef.getConfig();
    if (hasExactPosition) {
      const scrollPosition = this._viewportRuler.getViewportScrollPosition();
      extendStyles(styles, this._getExactOverlayY(position, originPoint, scrollPosition));
      extendStyles(styles, this._getExactOverlayX(position, originPoint, scrollPosition));
    } else {
      styles.position = "static";
    }
    let transformString = "";
    let offsetX = this._getOffset(position, "x");
    let offsetY = this._getOffset(position, "y");
    if (offsetX) {
      transformString += `translateX(${offsetX}px) `;
    }
    if (offsetY) {
      transformString += `translateY(${offsetY}px)`;
    }
    styles.transform = transformString.trim();
    if (config.maxHeight) {
      if (hasExactPosition) {
        styles.maxHeight = coerceCssPixelValue(config.maxHeight);
      } else if (hasFlexibleDimensions) {
        styles.maxHeight = "";
      }
    }
    if (config.maxWidth) {
      if (hasExactPosition) {
        styles.maxWidth = coerceCssPixelValue(config.maxWidth);
      } else if (hasFlexibleDimensions) {
        styles.maxWidth = "";
      }
    }
    extendStyles(this._pane.style, styles);
  }
  _getExactOverlayY(position, originPoint, scrollPosition) {
    let styles = {
      top: "",
      bottom: ""
    };
    let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
    if (this._isPushed) {
      overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
    }
    if (position.overlayY === "bottom") {
      const documentHeight = this._document.documentElement.clientHeight;
      styles.bottom = `${documentHeight - (overlayPoint.y + this._overlayRect.height)}px`;
    } else {
      styles.top = coerceCssPixelValue(overlayPoint.y);
    }
    return styles;
  }
  _getExactOverlayX(position, originPoint, scrollPosition) {
    let styles = {
      left: "",
      right: ""
    };
    let overlayPoint = this._getOverlayPoint(originPoint, this._overlayRect, position);
    if (this._isPushed) {
      overlayPoint = this._pushOverlayOnScreen(overlayPoint, this._overlayRect, scrollPosition);
    }
    let horizontalStyleProperty;
    if (this._isRtl()) {
      horizontalStyleProperty = position.overlayX === "end" ? "left" : "right";
    } else {
      horizontalStyleProperty = position.overlayX === "end" ? "right" : "left";
    }
    if (horizontalStyleProperty === "right") {
      const documentWidth = this._document.documentElement.clientWidth;
      styles.right = `${documentWidth - (overlayPoint.x + this._overlayRect.width)}px`;
    } else {
      styles.left = coerceCssPixelValue(overlayPoint.x);
    }
    return styles;
  }
  _getScrollVisibility() {
    const originBounds = this._getOriginRect();
    const overlayBounds = this._pane.getBoundingClientRect();
    const scrollContainerBounds = this._scrollables.map((scrollable) => {
      return scrollable.getElementRef().nativeElement.getBoundingClientRect();
    });
    return {
      isOriginClipped: isElementClippedByScrolling(originBounds, scrollContainerBounds),
      isOriginOutsideView: isElementScrolledOutsideView(originBounds, scrollContainerBounds),
      isOverlayClipped: isElementClippedByScrolling(overlayBounds, scrollContainerBounds),
      isOverlayOutsideView: isElementScrolledOutsideView(overlayBounds, scrollContainerBounds)
    };
  }
  _subtractOverflows(length, ...overflows) {
    return overflows.reduce((currentValue, currentOverflow) => {
      return currentValue - Math.max(currentOverflow, 0);
    }, length);
  }
  _getNarrowedViewportRect() {
    const width = this._document.documentElement.clientWidth;
    const height = this._document.documentElement.clientHeight;
    const scrollPosition = this._viewportRuler.getViewportScrollPosition();
    return {
      top: scrollPosition.top + this._getViewportMarginTop(),
      left: scrollPosition.left + this._getViewportMarginStart(),
      right: scrollPosition.left + width - this._getViewportMarginEnd(),
      bottom: scrollPosition.top + height - this._getViewportMarginBottom(),
      width: width - this._getViewportMarginStart() - this._getViewportMarginEnd(),
      height: height - this._getViewportMarginTop() - this._getViewportMarginBottom()
    };
  }
  _isRtl() {
    return this._overlayRef.getDirection() === "rtl";
  }
  _hasExactPosition() {
    return !this._hasFlexibleDimensions || this._isPushed;
  }
  _getOffset(position, axis) {
    if (axis === "x") {
      return position.offsetX == null ? this._offsetX : position.offsetX;
    }
    return position.offsetY == null ? this._offsetY : position.offsetY;
  }
  _validatePositions() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (!this._preferredPositions.length) {
        throw Error("FlexibleConnectedPositionStrategy: At least one position is required.");
      }
      this._preferredPositions.forEach((pair) => {
        validateHorizontalPosition("originX", pair.originX);
        validateVerticalPosition("originY", pair.originY);
        validateHorizontalPosition("overlayX", pair.overlayX);
        validateVerticalPosition("overlayY", pair.overlayY);
      });
    }
  }
  _addPanelClasses(cssClasses) {
    if (this._pane) {
      coerceArray(cssClasses).forEach((cssClass) => {
        if (cssClass !== "" && this._appliedPanelClasses.indexOf(cssClass) === -1) {
          this._appliedPanelClasses.push(cssClass);
          this._pane.classList.add(cssClass);
        }
      });
    }
  }
  _clearPanelClasses() {
    if (this._pane) {
      this._appliedPanelClasses.forEach((cssClass) => {
        this._pane.classList.remove(cssClass);
      });
      this._appliedPanelClasses = [];
    }
  }
  _getViewportMarginStart() {
    if (typeof this._viewportMargin === "number") return this._viewportMargin;
    return this._viewportMargin?.start ?? 0;
  }
  _getViewportMarginEnd() {
    if (typeof this._viewportMargin === "number") return this._viewportMargin;
    return this._viewportMargin?.end ?? 0;
  }
  _getViewportMarginTop() {
    if (typeof this._viewportMargin === "number") return this._viewportMargin;
    return this._viewportMargin?.top ?? 0;
  }
  _getViewportMarginBottom() {
    if (typeof this._viewportMargin === "number") return this._viewportMargin;
    return this._viewportMargin?.bottom ?? 0;
  }
  _getOriginRect() {
    const origin = this._origin;
    if (origin instanceof ElementRef) {
      return origin.nativeElement.getBoundingClientRect();
    }
    if (origin instanceof Element) {
      return origin.getBoundingClientRect();
    }
    const width = origin.width || 0;
    const height = origin.height || 0;
    return {
      top: origin.y,
      bottom: origin.y + height,
      left: origin.x,
      right: origin.x + width,
      height,
      width
    };
  }
  _getContainerRect() {
    const isInlinePopover = this._overlayRef.getConfig().usePopover && this._popoverLocation !== "global";
    const element = this._overlayContainer.getContainerElement();
    if (isInlinePopover) {
      element.style.display = "block";
    }
    const dimensions = element.getBoundingClientRect();
    if (isInlinePopover) {
      element.style.display = "";
    }
    return dimensions;
  }
};
function extendStyles(destination, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      destination[key] = source[key];
    }
  }
  return destination;
}
function getPixelValue(input) {
  if (typeof input !== "number" && input != null) {
    const [value, units] = input.split(cssUnitPattern);
    return !units || units === "px" ? parseFloat(value) : null;
  }
  return input || null;
}
function getRoundedBoundingClientRect(clientRect) {
  return {
    top: Math.floor(clientRect.top),
    right: Math.floor(clientRect.right),
    bottom: Math.floor(clientRect.bottom),
    left: Math.floor(clientRect.left),
    width: Math.floor(clientRect.width),
    height: Math.floor(clientRect.height)
  };
}
function compareScrollVisibility(a, b) {
  if (a === b) {
    return true;
  }
  return a.isOriginClipped === b.isOriginClipped && a.isOriginOutsideView === b.isOriginOutsideView && a.isOverlayClipped === b.isOverlayClipped && a.isOverlayOutsideView === b.isOverlayOutsideView;
}
var wrapperClass = "cdk-global-overlay-wrapper";
function createGlobalPositionStrategy(_injector) {
  return new GlobalPositionStrategy();
}
var GlobalPositionStrategy = class {
  _overlayRef;
  _cssPosition = "static";
  _topOffset = "";
  _bottomOffset = "";
  _alignItems = "";
  _xPosition = "";
  _xOffset = "";
  _width = "";
  _height = "";
  _isDisposed = false;
  attach(overlayRef) {
    const config = overlayRef.getConfig();
    this._overlayRef = overlayRef;
    if (this._width && !config.width) {
      overlayRef.updateSize({
        width: this._width
      });
    }
    if (this._height && !config.height) {
      overlayRef.updateSize({
        height: this._height
      });
    }
    overlayRef.hostElement.classList.add(wrapperClass);
    this._isDisposed = false;
  }
  top(value = "") {
    this._bottomOffset = "";
    this._topOffset = value;
    this._alignItems = "flex-start";
    return this;
  }
  left(value = "") {
    this._xOffset = value;
    this._xPosition = "left";
    return this;
  }
  bottom(value = "") {
    this._topOffset = "";
    this._bottomOffset = value;
    this._alignItems = "flex-end";
    return this;
  }
  right(value = "") {
    this._xOffset = value;
    this._xPosition = "right";
    return this;
  }
  start(value = "") {
    this._xOffset = value;
    this._xPosition = "start";
    return this;
  }
  end(value = "") {
    this._xOffset = value;
    this._xPosition = "end";
    return this;
  }
  width(value = "") {
    if (this._overlayRef) {
      this._overlayRef.updateSize({
        width: value
      });
    } else {
      this._width = value;
    }
    return this;
  }
  height(value = "") {
    if (this._overlayRef) {
      this._overlayRef.updateSize({
        height: value
      });
    } else {
      this._height = value;
    }
    return this;
  }
  centerHorizontally(offset = "") {
    this.left(offset);
    this._xPosition = "center";
    return this;
  }
  centerVertically(offset = "") {
    this.top(offset);
    this._alignItems = "center";
    return this;
  }
  apply() {
    if (!this._overlayRef || !this._overlayRef.hasAttached()) {
      return;
    }
    const styles = this._overlayRef.overlayElement.style;
    const parentStyles = this._overlayRef.hostElement.style;
    const config = this._overlayRef.getConfig();
    const {
      width,
      height,
      maxWidth,
      maxHeight
    } = config;
    const shouldBeFlushHorizontally = (width === "100%" || width === "100vw") && (!maxWidth || maxWidth === "100%" || maxWidth === "100vw");
    const shouldBeFlushVertically = (height === "100%" || height === "100vh") && (!maxHeight || maxHeight === "100%" || maxHeight === "100vh");
    const xPosition = this._xPosition;
    const xOffset = this._xOffset;
    const isRtl = this._overlayRef.getConfig().direction === "rtl";
    let marginLeft = "";
    let marginRight = "";
    let justifyContent = "";
    if (shouldBeFlushHorizontally) {
      justifyContent = "flex-start";
    } else if (xPosition === "center") {
      justifyContent = "center";
      if (isRtl) {
        marginRight = xOffset;
      } else {
        marginLeft = xOffset;
      }
    } else if (isRtl) {
      if (xPosition === "left" || xPosition === "end") {
        justifyContent = "flex-end";
        marginLeft = xOffset;
      } else if (xPosition === "right" || xPosition === "start") {
        justifyContent = "flex-start";
        marginRight = xOffset;
      }
    } else if (xPosition === "left" || xPosition === "start") {
      justifyContent = "flex-start";
      marginLeft = xOffset;
    } else if (xPosition === "right" || xPosition === "end") {
      justifyContent = "flex-end";
      marginRight = xOffset;
    }
    styles.position = this._cssPosition;
    styles.marginLeft = shouldBeFlushHorizontally ? "0" : marginLeft;
    styles.marginTop = shouldBeFlushVertically ? "0" : this._topOffset;
    styles.marginBottom = this._bottomOffset;
    styles.marginRight = shouldBeFlushHorizontally ? "0" : marginRight;
    parentStyles.justifyContent = justifyContent;
    parentStyles.alignItems = shouldBeFlushVertically ? "flex-start" : this._alignItems;
  }
  dispose() {
    if (this._isDisposed || !this._overlayRef) {
      return;
    }
    const styles = this._overlayRef.overlayElement.style;
    const parent = this._overlayRef.hostElement;
    const parentStyles = parent.style;
    parent.classList.remove(wrapperClass);
    parentStyles.justifyContent = parentStyles.alignItems = styles.marginTop = styles.marginBottom = styles.marginLeft = styles.marginRight = styles.position = "";
    this._overlayRef = null;
    this._isDisposed = true;
  }
};
var OverlayPositionBuilder = class _OverlayPositionBuilder {
  _injector = inject(Injector);
  constructor() {
  }
  global() {
    return createGlobalPositionStrategy();
  }
  flexibleConnectedTo(origin) {
    return createFlexibleConnectedPositionStrategy(this._injector, origin);
  }
  static ɵfac = function OverlayPositionBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OverlayPositionBuilder)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _OverlayPositionBuilder,
    factory: _OverlayPositionBuilder.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayPositionBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var OVERLAY_DEFAULT_CONFIG = new InjectionToken("OVERLAY_DEFAULT_CONFIG");
function createOverlayRef(injector, config) {
  injector.get(_CdkPrivateStyleLoader).load(_CdkOverlayStyleLoader);
  const overlayContainer = injector.get(OverlayContainer);
  const doc = injector.get(DOCUMENT);
  const idGenerator = injector.get(_IdGenerator);
  const appRef = injector.get(ApplicationRef);
  const directionality = injector.get(Directionality);
  const renderer = injector.get(Renderer2, null, {
    optional: true
  }) || injector.get(RendererFactory2).createRenderer(null, null);
  const overlayConfig = new OverlayConfig(config);
  const defaultUsePopover = injector.get(OVERLAY_DEFAULT_CONFIG, null, {
    optional: true
  })?.usePopover ?? true;
  overlayConfig.direction = overlayConfig.direction || directionality.value;
  if (!("showPopover" in doc.body)) {
    overlayConfig.usePopover = false;
  } else {
    overlayConfig.usePopover = config?.usePopover ?? defaultUsePopover;
  }
  const pane = doc.createElement("div");
  const host = doc.createElement("div");
  pane.id = idGenerator.getId("cdk-overlay-");
  pane.classList.add("cdk-overlay-pane");
  host.appendChild(pane);
  if (overlayConfig.usePopover) {
    host.setAttribute("popover", "manual");
    host.classList.add("cdk-overlay-popover");
  }
  const customInsertionPoint = overlayConfig.usePopover ? overlayConfig.positionStrategy?.getPopoverInsertionPoint?.() : null;
  if (isElement(customInsertionPoint)) {
    customInsertionPoint.after(host);
  } else if (customInsertionPoint?.type === "parent") {
    customInsertionPoint.element.appendChild(host);
  } else {
    overlayContainer.getContainerElement().appendChild(host);
  }
  return new OverlayRef(new DomPortalOutlet(pane, appRef, injector), host, pane, overlayConfig, injector.get(NgZone), injector.get(OverlayKeyboardDispatcher), doc, injector.get(Location), injector.get(OverlayOutsideClickDispatcher), config?.disableAnimations ?? injector.get(ANIMATION_MODULE_TYPE, null, {
    optional: true
  }) === "NoopAnimations", injector.get(EnvironmentInjector), renderer);
}
var Overlay = class _Overlay {
  scrollStrategies = inject(ScrollStrategyOptions);
  _positionBuilder = inject(OverlayPositionBuilder);
  _injector = inject(Injector);
  constructor() {
  }
  create(config) {
    return createOverlayRef(this._injector, config);
  }
  position() {
    return this._positionBuilder;
  }
  static ɵfac = function Overlay_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Overlay)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _Overlay,
    factory: _Overlay.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Overlay, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var defaultPositionList = [{
  originX: "start",
  originY: "bottom",
  overlayX: "start",
  overlayY: "top"
}, {
  originX: "start",
  originY: "top",
  overlayX: "start",
  overlayY: "bottom"
}, {
  originX: "end",
  originY: "top",
  overlayX: "end",
  overlayY: "bottom"
}, {
  originX: "end",
  originY: "bottom",
  overlayX: "end",
  overlayY: "top"
}];
var CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY = new InjectionToken("cdk-connected-overlay-scroll-strategy", {
  providedIn: "root",
  factory: () => {
    const injector = inject(Injector);
    return () => createRepositionScrollStrategy(injector);
  }
});
var CdkOverlayOrigin = class _CdkOverlayOrigin {
  elementRef = inject(ElementRef);
  constructor() {
  }
  static ɵfac = function CdkOverlayOrigin_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkOverlayOrigin)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkOverlayOrigin,
    selectors: [["", "cdk-overlay-origin", ""], ["", "overlay-origin", ""], ["", "cdkOverlayOrigin", ""]],
    exportAs: ["cdkOverlayOrigin"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkOverlayOrigin, [{
    type: Directive,
    args: [{
      selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]",
      exportAs: "cdkOverlayOrigin"
    }]
  }], () => [], null);
})();
var CDK_CONNECTED_OVERLAY_DEFAULT_CONFIG = new InjectionToken("cdk-connected-overlay-default-config");
var CdkConnectedOverlay = class _CdkConnectedOverlay {
  _dir = inject(Directionality, {
    optional: true
  });
  _injector = inject(Injector);
  _overlayRef;
  _templatePortal;
  _backdropSubscription = Subscription.EMPTY;
  _attachSubscription = Subscription.EMPTY;
  _detachSubscription = Subscription.EMPTY;
  _positionSubscription = Subscription.EMPTY;
  _offsetX;
  _offsetY;
  _position;
  _scrollStrategyFactory = inject(CDK_CONNECTED_OVERLAY_SCROLL_STRATEGY);
  _ngZone = inject(NgZone);
  origin;
  positions;
  positionStrategy;
  get offsetX() {
    return this._offsetX;
  }
  set offsetX(offsetX) {
    this._offsetX = offsetX;
    if (this._position) {
      this._updatePositionStrategy(this._position);
    }
  }
  get offsetY() {
    return this._offsetY;
  }
  set offsetY(offsetY) {
    this._offsetY = offsetY;
    if (this._position) {
      this._updatePositionStrategy(this._position);
    }
  }
  width;
  height;
  minWidth;
  minHeight;
  backdropClass;
  panelClass;
  viewportMargin = 0;
  scrollStrategy;
  open = false;
  disableClose = false;
  transformOriginSelector;
  hasBackdrop = false;
  lockPosition = false;
  flexibleDimensions = false;
  growAfterOpen = false;
  push = false;
  disposeOnNavigation = false;
  usePopover;
  matchWidth = false;
  set _config(value) {
    if (typeof value !== "string") {
      this._assignConfig(value);
    }
  }
  backdropClick = new EventEmitter();
  positionChange = new EventEmitter();
  attach = new EventEmitter();
  detach = new EventEmitter();
  overlayKeydown = new EventEmitter();
  overlayOutsideClick = new EventEmitter();
  constructor() {
    const templateRef = inject(TemplateRef);
    const viewContainerRef = inject(ViewContainerRef);
    const defaultConfig = inject(CDK_CONNECTED_OVERLAY_DEFAULT_CONFIG, {
      optional: true
    });
    const globalConfig = inject(OVERLAY_DEFAULT_CONFIG, {
      optional: true
    });
    this.usePopover = globalConfig?.usePopover === false ? null : "global";
    this._templatePortal = new TemplatePortal(templateRef, viewContainerRef);
    this.scrollStrategy = this._scrollStrategyFactory();
    if (defaultConfig) {
      this._assignConfig(defaultConfig);
    }
  }
  get overlayRef() {
    return this._overlayRef;
  }
  get dir() {
    return this._dir ? this._dir.value : "ltr";
  }
  ngOnDestroy() {
    this._attachSubscription.unsubscribe();
    this._detachSubscription.unsubscribe();
    this._backdropSubscription.unsubscribe();
    this._positionSubscription.unsubscribe();
    this._overlayRef?.dispose();
  }
  ngOnChanges(changes) {
    if (this._position) {
      this._updatePositionStrategy(this._position);
      this._overlayRef?.updateSize({
        width: this._getWidth(),
        minWidth: this.minWidth,
        height: this.height,
        minHeight: this.minHeight
      });
      if (changes["origin"] && this.open) {
        this._position.apply();
      }
    }
    if (changes["open"]) {
      this.open ? this.attachOverlay() : this.detachOverlay();
    }
  }
  _createOverlay() {
    if (!this.positions || !this.positions.length) {
      this.positions = defaultPositionList;
    }
    const overlayRef = this._overlayRef = createOverlayRef(this._injector, this._buildConfig());
    this._attachSubscription = overlayRef.attachments().subscribe(() => this.attach.emit());
    this._detachSubscription = overlayRef.detachments().subscribe(() => this.detach.emit());
    overlayRef.keydownEvents().subscribe((event) => {
      this.overlayKeydown.next(event);
      if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
        event.preventDefault();
        this.detachOverlay();
      }
    });
    this._overlayRef.outsidePointerEvents().subscribe((event) => {
      const origin = this._getOriginElement();
      const target = _getEventTarget(event);
      if (!origin || origin !== target && !origin.contains(target)) {
        this.overlayOutsideClick.next(event);
      }
    });
  }
  _buildConfig() {
    const positionStrategy = this._position = this.positionStrategy || this._createPositionStrategy();
    const overlayConfig = new OverlayConfig({
      direction: this._dir || "ltr",
      positionStrategy,
      scrollStrategy: this.scrollStrategy,
      hasBackdrop: this.hasBackdrop,
      disposeOnNavigation: this.disposeOnNavigation,
      usePopover: !!this.usePopover
    });
    if (this.height || this.height === 0) {
      overlayConfig.height = this.height;
    }
    if (this.minWidth || this.minWidth === 0) {
      overlayConfig.minWidth = this.minWidth;
    }
    if (this.minHeight || this.minHeight === 0) {
      overlayConfig.minHeight = this.minHeight;
    }
    if (this.backdropClass) {
      overlayConfig.backdropClass = this.backdropClass;
    }
    if (this.panelClass) {
      overlayConfig.panelClass = this.panelClass;
    }
    return overlayConfig;
  }
  _updatePositionStrategy(positionStrategy) {
    const positions = this.positions.map((currentPosition) => ({
      originX: currentPosition.originX,
      originY: currentPosition.originY,
      overlayX: currentPosition.overlayX,
      overlayY: currentPosition.overlayY,
      offsetX: currentPosition.offsetX || this.offsetX,
      offsetY: currentPosition.offsetY || this.offsetY,
      panelClass: currentPosition.panelClass || void 0
    }));
    return positionStrategy.setOrigin(this._getOrigin()).withPositions(positions).withFlexibleDimensions(this.flexibleDimensions).withPush(this.push).withGrowAfterOpen(this.growAfterOpen).withViewportMargin(this.viewportMargin).withLockedPosition(this.lockPosition).withTransformOriginOn(this.transformOriginSelector).withPopoverLocation(this.usePopover === null ? "global" : this.usePopover);
  }
  _createPositionStrategy() {
    const strategy = createFlexibleConnectedPositionStrategy(this._injector, this._getOrigin());
    this._updatePositionStrategy(strategy);
    return strategy;
  }
  _getOrigin() {
    if (this.origin instanceof CdkOverlayOrigin) {
      return this.origin.elementRef;
    } else {
      return this.origin;
    }
  }
  _getOriginElement() {
    if (this.origin instanceof CdkOverlayOrigin) {
      return this.origin.elementRef.nativeElement;
    }
    if (this.origin instanceof ElementRef) {
      return this.origin.nativeElement;
    }
    if (typeof Element !== "undefined" && this.origin instanceof Element) {
      return this.origin;
    }
    return null;
  }
  _getWidth() {
    if (this.width) {
      return this.width;
    }
    return this.matchWidth ? this._getOriginElement()?.getBoundingClientRect?.().width : void 0;
  }
  attachOverlay() {
    if (!this._overlayRef) {
      this._createOverlay();
    }
    const ref = this._overlayRef;
    ref.getConfig().hasBackdrop = this.hasBackdrop;
    ref.updateSize({
      width: this._getWidth()
    });
    if (!ref.hasAttached()) {
      ref.attach(this._templatePortal);
    }
    if (this.hasBackdrop) {
      this._backdropSubscription = ref.backdropClick().subscribe((event) => this.backdropClick.emit(event));
    } else {
      this._backdropSubscription.unsubscribe();
    }
    this._positionSubscription.unsubscribe();
    if (this.positionChange.observers.length > 0) {
      this._positionSubscription = this._position.positionChanges.pipe(takeWhile(() => this.positionChange.observers.length > 0)).subscribe((position) => {
        this._ngZone.run(() => this.positionChange.emit(position));
        if (this.positionChange.observers.length === 0) {
          this._positionSubscription.unsubscribe();
        }
      });
    }
    this.open = true;
  }
  detachOverlay() {
    this._overlayRef?.detach();
    this._backdropSubscription.unsubscribe();
    this._positionSubscription.unsubscribe();
    this.open = false;
  }
  _assignConfig(config) {
    this.origin = config.origin ?? this.origin;
    this.positions = config.positions ?? this.positions;
    this.positionStrategy = config.positionStrategy ?? this.positionStrategy;
    this.offsetX = config.offsetX ?? this.offsetX;
    this.offsetY = config.offsetY ?? this.offsetY;
    this.width = config.width ?? this.width;
    this.height = config.height ?? this.height;
    this.minWidth = config.minWidth ?? this.minWidth;
    this.minHeight = config.minHeight ?? this.minHeight;
    this.backdropClass = config.backdropClass ?? this.backdropClass;
    this.panelClass = config.panelClass ?? this.panelClass;
    this.viewportMargin = config.viewportMargin ?? this.viewportMargin;
    this.scrollStrategy = config.scrollStrategy ?? this.scrollStrategy;
    this.disableClose = config.disableClose ?? this.disableClose;
    this.transformOriginSelector = config.transformOriginSelector ?? this.transformOriginSelector;
    this.hasBackdrop = config.hasBackdrop ?? this.hasBackdrop;
    this.lockPosition = config.lockPosition ?? this.lockPosition;
    this.flexibleDimensions = config.flexibleDimensions ?? this.flexibleDimensions;
    this.growAfterOpen = config.growAfterOpen ?? this.growAfterOpen;
    this.push = config.push ?? this.push;
    this.disposeOnNavigation = config.disposeOnNavigation ?? this.disposeOnNavigation;
    this.usePopover = config.usePopover ?? this.usePopover;
    this.matchWidth = config.matchWidth ?? this.matchWidth;
  }
  static ɵfac = function CdkConnectedOverlay_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkConnectedOverlay)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _CdkConnectedOverlay,
    selectors: [["", "cdk-connected-overlay", ""], ["", "connected-overlay", ""], ["", "cdkConnectedOverlay", ""]],
    inputs: {
      origin: [0, "cdkConnectedOverlayOrigin", "origin"],
      positions: [0, "cdkConnectedOverlayPositions", "positions"],
      positionStrategy: [0, "cdkConnectedOverlayPositionStrategy", "positionStrategy"],
      offsetX: [0, "cdkConnectedOverlayOffsetX", "offsetX"],
      offsetY: [0, "cdkConnectedOverlayOffsetY", "offsetY"],
      width: [0, "cdkConnectedOverlayWidth", "width"],
      height: [0, "cdkConnectedOverlayHeight", "height"],
      minWidth: [0, "cdkConnectedOverlayMinWidth", "minWidth"],
      minHeight: [0, "cdkConnectedOverlayMinHeight", "minHeight"],
      backdropClass: [0, "cdkConnectedOverlayBackdropClass", "backdropClass"],
      panelClass: [0, "cdkConnectedOverlayPanelClass", "panelClass"],
      viewportMargin: [0, "cdkConnectedOverlayViewportMargin", "viewportMargin"],
      scrollStrategy: [0, "cdkConnectedOverlayScrollStrategy", "scrollStrategy"],
      open: [0, "cdkConnectedOverlayOpen", "open"],
      disableClose: [0, "cdkConnectedOverlayDisableClose", "disableClose"],
      transformOriginSelector: [0, "cdkConnectedOverlayTransformOriginOn", "transformOriginSelector"],
      hasBackdrop: [2, "cdkConnectedOverlayHasBackdrop", "hasBackdrop", booleanAttribute],
      lockPosition: [2, "cdkConnectedOverlayLockPosition", "lockPosition", booleanAttribute],
      flexibleDimensions: [2, "cdkConnectedOverlayFlexibleDimensions", "flexibleDimensions", booleanAttribute],
      growAfterOpen: [2, "cdkConnectedOverlayGrowAfterOpen", "growAfterOpen", booleanAttribute],
      push: [2, "cdkConnectedOverlayPush", "push", booleanAttribute],
      disposeOnNavigation: [2, "cdkConnectedOverlayDisposeOnNavigation", "disposeOnNavigation", booleanAttribute],
      usePopover: [0, "cdkConnectedOverlayUsePopover", "usePopover"],
      matchWidth: [2, "cdkConnectedOverlayMatchWidth", "matchWidth", booleanAttribute],
      _config: [0, "cdkConnectedOverlay", "_config"]
    },
    outputs: {
      backdropClick: "backdropClick",
      positionChange: "positionChange",
      attach: "attach",
      detach: "detach",
      overlayKeydown: "overlayKeydown",
      overlayOutsideClick: "overlayOutsideClick"
    },
    exportAs: ["cdkConnectedOverlay"],
    features: [ɵɵNgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkConnectedOverlay, [{
    type: Directive,
    args: [{
      selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]",
      exportAs: "cdkConnectedOverlay"
    }]
  }], () => [], {
    origin: [{
      type: Input,
      args: ["cdkConnectedOverlayOrigin"]
    }],
    positions: [{
      type: Input,
      args: ["cdkConnectedOverlayPositions"]
    }],
    positionStrategy: [{
      type: Input,
      args: ["cdkConnectedOverlayPositionStrategy"]
    }],
    offsetX: [{
      type: Input,
      args: ["cdkConnectedOverlayOffsetX"]
    }],
    offsetY: [{
      type: Input,
      args: ["cdkConnectedOverlayOffsetY"]
    }],
    width: [{
      type: Input,
      args: ["cdkConnectedOverlayWidth"]
    }],
    height: [{
      type: Input,
      args: ["cdkConnectedOverlayHeight"]
    }],
    minWidth: [{
      type: Input,
      args: ["cdkConnectedOverlayMinWidth"]
    }],
    minHeight: [{
      type: Input,
      args: ["cdkConnectedOverlayMinHeight"]
    }],
    backdropClass: [{
      type: Input,
      args: ["cdkConnectedOverlayBackdropClass"]
    }],
    panelClass: [{
      type: Input,
      args: ["cdkConnectedOverlayPanelClass"]
    }],
    viewportMargin: [{
      type: Input,
      args: ["cdkConnectedOverlayViewportMargin"]
    }],
    scrollStrategy: [{
      type: Input,
      args: ["cdkConnectedOverlayScrollStrategy"]
    }],
    open: [{
      type: Input,
      args: ["cdkConnectedOverlayOpen"]
    }],
    disableClose: [{
      type: Input,
      args: ["cdkConnectedOverlayDisableClose"]
    }],
    transformOriginSelector: [{
      type: Input,
      args: ["cdkConnectedOverlayTransformOriginOn"]
    }],
    hasBackdrop: [{
      type: Input,
      args: [{
        alias: "cdkConnectedOverlayHasBackdrop",
        transform: booleanAttribute
      }]
    }],
    lockPosition: [{
      type: Input,
      args: [{
        alias: "cdkConnectedOverlayLockPosition",
        transform: booleanAttribute
      }]
    }],
    flexibleDimensions: [{
      type: Input,
      args: [{
        alias: "cdkConnectedOverlayFlexibleDimensions",
        transform: booleanAttribute
      }]
    }],
    growAfterOpen: [{
      type: Input,
      args: [{
        alias: "cdkConnectedOverlayGrowAfterOpen",
        transform: booleanAttribute
      }]
    }],
    push: [{
      type: Input,
      args: [{
        alias: "cdkConnectedOverlayPush",
        transform: booleanAttribute
      }]
    }],
    disposeOnNavigation: [{
      type: Input,
      args: [{
        alias: "cdkConnectedOverlayDisposeOnNavigation",
        transform: booleanAttribute
      }]
    }],
    usePopover: [{
      type: Input,
      args: [{
        alias: "cdkConnectedOverlayUsePopover"
      }]
    }],
    matchWidth: [{
      type: Input,
      args: [{
        alias: "cdkConnectedOverlayMatchWidth",
        transform: booleanAttribute
      }]
    }],
    _config: [{
      type: Input,
      args: ["cdkConnectedOverlay"]
    }],
    backdropClick: [{
      type: Output
    }],
    positionChange: [{
      type: Output
    }],
    attach: [{
      type: Output
    }],
    detach: [{
      type: Output
    }],
    overlayKeydown: [{
      type: Output
    }],
    overlayOutsideClick: [{
      type: Output
    }]
  });
})();
var OverlayModule = class _OverlayModule {
  static ɵfac = function OverlayModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OverlayModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _OverlayModule,
    imports: [BidiModule, PortalModule, ScrollingModule, CdkConnectedOverlay, CdkOverlayOrigin],
    exports: [CdkConnectedOverlay, CdkOverlayOrigin, ScrollingModule]
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [Overlay],
    imports: [BidiModule, PortalModule, ScrollingModule, ScrollingModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OverlayModule, [{
    type: NgModule,
    args: [{
      imports: [BidiModule, PortalModule, ScrollingModule, CdkConnectedOverlay, CdkOverlayOrigin],
      exports: [CdkConnectedOverlay, CdkOverlayOrigin, ScrollingModule],
      providers: [Overlay]
    }]
  }], null, null);
})();

// node_modules/@angular/cdk/fesm2022/overlay.mjs
var FullscreenOverlayContainer = class _FullscreenOverlayContainer extends OverlayContainer {
  _renderer = inject(RendererFactory2).createRenderer(null, null);
  _fullScreenEventName;
  _cleanupFullScreenListener;
  constructor() {
    super();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._cleanupFullScreenListener?.();
  }
  _createContainer() {
    const eventName = this._getEventName();
    super._createContainer();
    this._adjustParentForFullscreenChange();
    if (eventName) {
      this._cleanupFullScreenListener?.();
      this._cleanupFullScreenListener = this._renderer.listen("document", eventName, () => {
        this._adjustParentForFullscreenChange();
      });
    }
  }
  _adjustParentForFullscreenChange() {
    if (this._containerElement) {
      const fullscreenElement = this.getFullscreenElement();
      const parent = fullscreenElement || this._document.body;
      parent.appendChild(this._containerElement);
    }
  }
  _getEventName() {
    if (!this._fullScreenEventName) {
      const _document = this._document;
      if (_document.fullscreenEnabled) {
        this._fullScreenEventName = "fullscreenchange";
      } else if (_document.webkitFullscreenEnabled) {
        this._fullScreenEventName = "webkitfullscreenchange";
      } else if (_document.mozFullScreenEnabled) {
        this._fullScreenEventName = "mozfullscreenchange";
      } else if (_document.msFullscreenEnabled) {
        this._fullScreenEventName = "MSFullscreenChange";
      }
    }
    return this._fullScreenEventName;
  }
  getFullscreenElement() {
    const _document = this._document;
    return _document.fullscreenElement || _document.webkitFullscreenElement || _document.mozFullScreenElement || _document.msFullscreenElement || null;
  }
  static ɵfac = function FullscreenOverlayContainer_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FullscreenOverlayContainer)();
  };
  static ɵprov = ɵɵdefineInjectable({
    token: _FullscreenOverlayContainer,
    factory: _FullscreenOverlayContainer.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FullscreenOverlayContainer, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// node_modules/@angular/material/fesm2022/_icon-button-chunk.mjs
var _c0 = ["mat-icon-button", ""];
var _c1 = ["*"];
var MAT_BUTTON_CONFIG = new InjectionToken("MAT_BUTTON_CONFIG");
function transformTabIndex(value) {
  return value == null ? void 0 : numberAttribute(value);
}
var MatButtonBase = class _MatButtonBase {
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  _animationsDisabled = _animationsDisabled();
  _config = inject(MAT_BUTTON_CONFIG, {
    optional: true
  });
  _focusMonitor = inject(FocusMonitor);
  _cleanupClick;
  _renderer = inject(Renderer2);
  _rippleLoader = inject(MatRippleLoader);
  _isAnchor;
  _isFab = false;
  color;
  get disableRipple() {
    return this._disableRipple;
  }
  set disableRipple(value) {
    this._disableRipple = value;
    this._updateRippleDisabled();
  }
  _disableRipple = false;
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._updateRippleDisabled();
  }
  _disabled = false;
  ariaDisabled;
  disabledInteractive;
  tabIndex;
  set _tabindex(value) {
    this.tabIndex = value;
  }
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    const element = this._elementRef.nativeElement;
    this._isAnchor = element.tagName === "A";
    this.disabledInteractive = this._config?.disabledInteractive ?? false;
    this.color = this._config?.color ?? null;
    this._rippleLoader?.configureRipple(element, {
      className: "mat-mdc-button-ripple"
    });
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
    if (this._isAnchor) {
      this._setupAsAnchor();
    }
  }
  ngOnDestroy() {
    this._cleanupClick?.();
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
  }
  focus(origin = "program", options) {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef.nativeElement, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }
  _getAriaDisabled() {
    if (this.ariaDisabled != null) {
      return this.ariaDisabled;
    }
    if (this._isAnchor) {
      return this.disabled || null;
    }
    return this.disabled && this.disabledInteractive ? true : null;
  }
  _getDisabledAttribute() {
    return this.disabledInteractive || !this.disabled ? null : true;
  }
  _updateRippleDisabled() {
    this._rippleLoader?.setDisabled(this._elementRef.nativeElement, this.disableRipple || this.disabled);
  }
  _getTabIndex() {
    if (this._isAnchor) {
      return this.disabled && !this.disabledInteractive ? -1 : this.tabIndex;
    }
    return this.tabIndex;
  }
  _setupAsAnchor() {
    this._cleanupClick = this._ngZone.runOutsideAngular(() => this._renderer.listen(this._elementRef.nativeElement, "click", (event) => {
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }));
  }
  static ɵfac = function MatButtonBase_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatButtonBase)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MatButtonBase,
    hostAttrs: [1, "mat-mdc-button-base"],
    hostVars: 13,
    hostBindings: function MatButtonBase_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵattribute("disabled", ctx._getDisabledAttribute())("aria-disabled", ctx._getAriaDisabled())("tabindex", ctx._getTabIndex());
        ɵɵclassMap(ctx.color ? "mat-" + ctx.color : "");
        ɵɵclassProp("mat-mdc-button-disabled", ctx.disabled)("mat-mdc-button-disabled-interactive", ctx.disabledInteractive)("mat-unthemed", !ctx.color)("_mat-animation-noopable", ctx._animationsDisabled);
      }
    },
    inputs: {
      color: "color",
      disableRipple: [2, "disableRipple", "disableRipple", booleanAttribute],
      disabled: [2, "disabled", "disabled", booleanAttribute],
      ariaDisabled: [2, "aria-disabled", "ariaDisabled", booleanAttribute],
      disabledInteractive: [2, "disabledInteractive", "disabledInteractive", booleanAttribute],
      tabIndex: [2, "tabIndex", "tabIndex", transformTabIndex],
      _tabindex: [2, "tabindex", "_tabindex", transformTabIndex]
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonBase, [{
    type: Directive,
    args: [{
      host: {
        "class": "mat-mdc-button-base",
        "[class]": 'color ? "mat-" + color : ""',
        "[attr.disabled]": "_getDisabledAttribute()",
        "[attr.aria-disabled]": "_getAriaDisabled()",
        "[attr.tabindex]": "_getTabIndex()",
        "[class.mat-mdc-button-disabled]": "disabled",
        "[class.mat-mdc-button-disabled-interactive]": "disabledInteractive",
        "[class.mat-unthemed]": "!color",
        "[class._mat-animation-noopable]": "_animationsDisabled"
      }
    }]
  }], () => [], {
    color: [{
      type: Input
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    ariaDisabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute,
        alias: "aria-disabled"
      }]
    }],
    disabledInteractive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: transformTabIndex
      }]
    }],
    _tabindex: [{
      type: Input,
      args: [{
        alias: "tabindex",
        transform: transformTabIndex
      }]
    }]
  });
})();
var MatIconButton = class _MatIconButton extends MatButtonBase {
  constructor() {
    super();
    this._rippleLoader.configureRipple(this._elementRef.nativeElement, {
      centered: true
    });
  }
  static ɵfac = function MatIconButton_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatIconButton)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MatIconButton,
    selectors: [["button", "mat-icon-button", ""], ["a", "mat-icon-button", ""], ["button", "matIconButton", ""], ["a", "matIconButton", ""]],
    hostAttrs: [1, "mdc-icon-button", "mat-mdc-icon-button"],
    exportAs: ["matButton", "matAnchor"],
    features: [ɵɵInheritDefinitionFeature],
    attrs: _c0,
    ngContentSelectors: _c1,
    decls: 4,
    vars: 0,
    consts: [[1, "mat-mdc-button-persistent-ripple", "mdc-icon-button__ripple"], [1, "mat-focus-indicator"], [1, "mat-mdc-button-touch-target"]],
    template: function MatIconButton_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef();
        ɵɵdomElement(0, "span", 0);
        ɵɵprojection(1);
        ɵɵdomElement(2, "span", 1)(3, "span", 2);
      }
    },
    styles: ['.mat-mdc-icon-button {\n  -webkit-user-select: none;\n  user-select: none;\n  display: inline-block;\n  position: relative;\n  box-sizing: border-box;\n  border: none;\n  outline: none;\n  background-color: transparent;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  z-index: 0;\n  overflow: visible;\n  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));\n  flex-shrink: 0;\n  text-align: center;\n  width: var(--mat-icon-button-state-layer-size, 40px);\n  height: var(--mat-icon-button-state-layer-size, 40px);\n  padding: calc(calc(var(--mat-icon-button-state-layer-size, 40px) - var(--mat-icon-button-icon-size, 24px)) / 2);\n  font-size: var(--mat-icon-button-icon-size, 24px);\n  color: var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant));\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-icon-button .mat-mdc-button-ripple,\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-icon-button .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  content: "";\n  opacity: 0;\n}\n.mat-mdc-icon-button .mdc-button__label,\n.mat-mdc-icon-button .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-icon-button .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n}\n.mat-mdc-icon-button:focus-visible > .mat-focus-indicator::before {\n  content: "";\n  border-radius: inherit;\n}\n.mat-mdc-icon-button .mat-ripple-element {\n  background-color: var(--mat-icon-button-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface-variant) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-icon-button-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-icon-button-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-icon-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-icon-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-icon-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-icon-button-touch-target-size, 48px);\n  display: var(--mat-icon-button-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-icon-button-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-icon-button._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-icon-button[disabled], .mat-mdc-icon-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-icon-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-icon-button img,\n.mat-mdc-icon-button svg {\n  width: var(--mat-icon-button-icon-size, 24px);\n  height: var(--mat-icon-button-icon-size, 24px);\n  vertical-align: baseline;\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple {\n  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));\n}\n.mat-mdc-icon-button[hidden] {\n  display: none;\n}\n.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before {\n  background: transparent;\n  opacity: 1;\n}\n', "@media (forced-colors: active) {\n  .mat-mdc-button:not(.mdc-button--outlined),\n  .mat-mdc-unelevated-button:not(.mdc-button--outlined),\n  .mat-mdc-raised-button:not(.mdc-button--outlined),\n  .mat-mdc-outlined-button:not(.mdc-button--outlined),\n  .mat-mdc-button-base.mat-tonal-button,\n  .mat-mdc-icon-button.mat-mdc-icon-button,\n  .mat-mdc-outlined-button .mdc-button__ripple {\n    outline: solid 1px;\n  }\n}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatIconButton, [{
    type: Component,
    args: [{
      selector: `button[mat-icon-button], a[mat-icon-button], button[matIconButton], a[matIconButton]`,
      host: {
        "class": "mdc-icon-button mat-mdc-icon-button"
      },
      exportAs: "matButton, matAnchor",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>

<ng-content></ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`,
      styles: ['.mat-mdc-icon-button {\n  -webkit-user-select: none;\n  user-select: none;\n  display: inline-block;\n  position: relative;\n  box-sizing: border-box;\n  border: none;\n  outline: none;\n  background-color: transparent;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  z-index: 0;\n  overflow: visible;\n  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));\n  flex-shrink: 0;\n  text-align: center;\n  width: var(--mat-icon-button-state-layer-size, 40px);\n  height: var(--mat-icon-button-state-layer-size, 40px);\n  padding: calc(calc(var(--mat-icon-button-state-layer-size, 40px) - var(--mat-icon-button-icon-size, 24px)) / 2);\n  font-size: var(--mat-icon-button-icon-size, 24px);\n  color: var(--mat-icon-button-icon-color, var(--mat-sys-on-surface-variant));\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-icon-button .mat-mdc-button-ripple,\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-icon-button .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  content: "";\n  opacity: 0;\n}\n.mat-mdc-icon-button .mdc-button__label,\n.mat-mdc-icon-button .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-icon-button .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n}\n.mat-mdc-icon-button:focus-visible > .mat-focus-indicator::before {\n  content: "";\n  border-radius: inherit;\n}\n.mat-mdc-icon-button .mat-ripple-element {\n  background-color: var(--mat-icon-button-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface-variant) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-icon-button-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-icon-button-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-icon-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-icon-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-icon-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-icon-button-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-icon-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-icon-button-touch-target-size, 48px);\n  display: var(--mat-icon-button-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-icon-button-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-icon-button._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-icon-button[disabled], .mat-mdc-icon-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-icon-button-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-icon-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-icon-button img,\n.mat-mdc-icon-button svg {\n  width: var(--mat-icon-button-icon-size, 24px);\n  height: var(--mat-icon-button-icon-size, 24px);\n  vertical-align: baseline;\n}\n.mat-mdc-icon-button .mat-mdc-button-persistent-ripple {\n  border-radius: var(--mat-icon-button-container-shape, var(--mat-sys-corner-full, 50%));\n}\n.mat-mdc-icon-button[hidden] {\n  display: none;\n}\n.mat-mdc-icon-button.mat-unthemed:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-primary:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-accent:not(.mdc-ripple-upgraded):focus::before, .mat-mdc-icon-button.mat-warn:not(.mdc-ripple-upgraded):focus::before {\n  background: transparent;\n  opacity: 1;\n}\n', "@media (forced-colors: active) {\n  .mat-mdc-button:not(.mdc-button--outlined),\n  .mat-mdc-unelevated-button:not(.mdc-button--outlined),\n  .mat-mdc-raised-button:not(.mdc-button--outlined),\n  .mat-mdc-outlined-button:not(.mdc-button--outlined),\n  .mat-mdc-button-base.mat-tonal-button,\n  .mat-mdc-icon-button.mat-mdc-icon-button,\n  .mat-mdc-outlined-button .mdc-button__ripple {\n    outline: solid 1px;\n  }\n}\n"]
    }]
  }], () => [], null);
})();

// node_modules/@angular/material/fesm2022/button.mjs
var _c02 = ["matButton", ""];
var _c12 = [[["", 8, "material-icons", 3, "iconPositionEnd", ""], ["mat-icon", 3, "iconPositionEnd", ""], ["", "matButtonIcon", "", 3, "iconPositionEnd", ""]], "*", [["", "iconPositionEnd", "", 8, "material-icons"], ["mat-icon", "iconPositionEnd", ""], ["", "matButtonIcon", "", "iconPositionEnd", ""]]];
var _c2 = [".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])", "*", ".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"];
var _c3 = ["mat-fab", ""];
var _c4 = ["mat-mini-fab", ""];
var _c5 = '.mat-mdc-fab-base {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  border: none;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  overflow: visible;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  flex-shrink: 0;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  content: "";\n  opacity: 0;\n}\n.mat-mdc-fab-base .mdc-button__label,\n.mat-mdc-fab-base .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-fab-base .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n}\n.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {\n  content: "";\n}\n.mat-mdc-fab-base._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-fab-base::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 1px solid transparent;\n  border-radius: inherit;\n  content: "";\n  pointer-events: none;\n}\n.mat-mdc-fab-base[hidden] {\n  display: none;\n}\n.mat-mdc-fab-base::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {\n  outline: none;\n}\n.mat-mdc-fab-base:hover {\n  cursor: pointer;\n}\n.mat-mdc-fab-base > svg {\n  width: 100%;\n}\n.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {\n  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);\n  fill: currentColor;\n  will-change: transform;\n}\n.mat-mdc-fab-base .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-fab {\n  background-color: var(--mat-fab-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-container-shape, var(--mat-sys-corner-large));\n  color: var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-fab:hover {\n    box-shadow: var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-fab:focus {\n  box-shadow: var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab:active, .mat-mdc-fab:focus:active {\n  box-shadow: var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-touch-target-size, 48px);\n  display: var(--mat-fab-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-fab-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-fab .mat-ripple-element {\n  background-color: var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-disabled-state-layer-color);\n}\n.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-mini-fab {\n  width: 40px;\n  height: 40px;\n  background-color: var(--mat-fab-small-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));\n  color: var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-mini-fab:hover {\n    box-shadow: var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-mini-fab:focus {\n  box-shadow: var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {\n  box-shadow: var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-mini-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-small-touch-target-size, 48px);\n  display: var(--mat-fab-small-touch-target-display);\n  left: 50%;\n  width: var(--mat-fab-small-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-mini-fab .mat-ripple-element {\n  background-color: var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-disabled-state-layer-color);\n}\n.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-extended-fab {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: 20px;\n  padding-right: 20px;\n  width: auto;\n  max-width: 100%;\n  line-height: normal;\n  box-shadow: var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));\n  height: var(--mat-fab-extended-container-height, 56px);\n  border-radius: var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));\n  font-family: var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));\n  font-weight: var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));\n  letter-spacing: var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking));\n}\n@media (hover: hover) {\n  .mat-mdc-extended-fab:hover {\n    box-shadow: var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-extended-fab:focus {\n  box-shadow: var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {\n  box-shadow: var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,\n.mat-mdc-extended-fab > .mat-icon,\n.mat-mdc-extended-fab > .material-icons {\n  margin-left: -8px;\n  margin-right: 12px;\n}\n.mat-mdc-extended-fab .mdc-button__label + .mat-icon,\n.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {\n  margin-left: 12px;\n  margin-right: -8px;\n}\n.mat-mdc-extended-fab .mat-mdc-button-touch-target {\n  width: 100%;\n}\n';
var APPEARANCE_CLASSES = /* @__PURE__ */ new Map([["text", ["mat-mdc-button"]], ["filled", ["mdc-button--unelevated", "mat-mdc-unelevated-button"]], ["elevated", ["mdc-button--raised", "mat-mdc-raised-button"]], ["outlined", ["mdc-button--outlined", "mat-mdc-outlined-button"]], ["tonal", ["mat-tonal-button"]]]);
var MatButton = class _MatButton extends MatButtonBase {
  get appearance() {
    return this._appearance;
  }
  set appearance(value) {
    this.setAppearance(value || this._config?.defaultAppearance || "text");
  }
  _appearance = null;
  constructor() {
    super();
    const inferredAppearance = _inferAppearance(this._elementRef.nativeElement);
    if (inferredAppearance) {
      this.setAppearance(inferredAppearance);
    }
  }
  setAppearance(appearance) {
    if (appearance === this._appearance) {
      return;
    }
    const classList = this._elementRef.nativeElement.classList;
    const previousClasses = this._appearance ? APPEARANCE_CLASSES.get(this._appearance) : null;
    const newClasses = APPEARANCE_CLASSES.get(appearance);
    if ((typeof ngDevMode === "undefined" || ngDevMode) && !newClasses) {
      throw new Error(`Unsupported MatButton appearance "${appearance}"`);
    }
    if (previousClasses) {
      classList.remove(...previousClasses);
    }
    classList.add(...newClasses);
    this._appearance = appearance;
  }
  static ɵfac = function MatButton_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatButton)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MatButton,
    selectors: [["button", "matButton", ""], ["a", "matButton", ""], ["button", "mat-button", ""], ["button", "mat-raised-button", ""], ["button", "mat-flat-button", ""], ["button", "mat-stroked-button", ""], ["a", "mat-button", ""], ["a", "mat-raised-button", ""], ["a", "mat-flat-button", ""], ["a", "mat-stroked-button", ""]],
    hostAttrs: [1, "mdc-button"],
    inputs: {
      appearance: [0, "matButton", "appearance"]
    },
    exportAs: ["matButton", "matAnchor"],
    features: [ɵɵInheritDefinitionFeature],
    attrs: _c02,
    ngContentSelectors: _c2,
    decls: 7,
    vars: 4,
    consts: [[1, "mat-mdc-button-persistent-ripple"], [1, "mdc-button__label"], [1, "mat-focus-indicator"], [1, "mat-mdc-button-touch-target"]],
    template: function MatButton_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c12);
        ɵɵdomElement(0, "span", 0);
        ɵɵprojection(1);
        ɵɵdomElementStart(2, "span", 1);
        ɵɵprojection(3, 1);
        ɵɵdomElementEnd();
        ɵɵprojection(4, 2);
        ɵɵdomElement(5, "span", 2)(6, "span", 3);
      }
      if (rf & 2) {
        ɵɵclassProp("mdc-button__ripple", !ctx._isFab)("mdc-fab__ripple", ctx._isFab);
      }
    },
    styles: ['.mat-mdc-button-base {\n  text-decoration: none;\n}\n.mat-mdc-button-base .mat-icon {\n  min-height: fit-content;\n  flex-shrink: 0;\n}\n@media (hover: none) {\n  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {\n    opacity: 0;\n  }\n}\n\n.mdc-button {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  min-width: 64px;\n  border: none;\n  outline: none;\n  line-height: inherit;\n  -webkit-appearance: none;\n  overflow: visible;\n  vertical-align: middle;\n  background: transparent;\n  padding: 0 8px;\n}\n.mdc-button::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mdc-button:active {\n  outline: none;\n}\n.mdc-button:hover {\n  cursor: pointer;\n}\n.mdc-button:disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mdc-button[hidden] {\n  display: none;\n}\n.mdc-button .mdc-button__label {\n  position: relative;\n}\n\n.mat-mdc-button {\n  padding: 0 var(--mat-button-text-horizontal-padding, 12px);\n  height: var(--mat-button-text-container-height, 40px);\n  font-family: var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-text-label-text-transform);\n  font-weight: var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight));\n}\n.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {\n  border-radius: var(--mat-button-text-container-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-button:not(:disabled) {\n  color: var(--mat-button-text-label-text-color, var(--mat-sys-primary));\n}\n.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {\n  padding: 0 var(--mat-button-text-with-icon-horizontal-padding, 16px);\n}\n.mat-mdc-button > .mat-icon {\n  margin-right: var(--mat-button-text-icon-spacing, 8px);\n  margin-left: var(--mat-button-text-icon-offset, -4px);\n}\n[dir=rtl] .mat-mdc-button > .mat-icon {\n  margin-right: var(--mat-button-text-icon-offset, -4px);\n  margin-left: var(--mat-button-text-icon-spacing, 8px);\n}\n.mat-mdc-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-text-icon-offset, -4px);\n  margin-left: var(--mat-button-text-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-text-icon-spacing, 8px);\n  margin-left: var(--mat-button-text-icon-offset, -4px);\n}\n.mat-mdc-button .mat-ripple-element {\n  background-color: var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-text-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-text-touch-target-size, 48px);\n  display: var(--mat-button-text-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n\n.mat-mdc-unelevated-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-filled-container-height, 40px);\n  font-family: var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-filled-label-text-transform);\n  font-weight: var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-filled-horizontal-padding, 24px);\n}\n.mat-mdc-unelevated-button > .mat-icon {\n  margin-right: var(--mat-button-filled-icon-spacing, 8px);\n  margin-left: var(--mat-button-filled-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {\n  margin-right: var(--mat-button-filled-icon-offset, -8px);\n  margin-left: var(--mat-button-filled-icon-spacing, 8px);\n}\n.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-filled-icon-offset, -8px);\n  margin-left: var(--mat-button-filled-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-filled-icon-spacing, 8px);\n  margin-left: var(--mat-button-filled-icon-offset, -8px);\n}\n.mat-mdc-unelevated-button .mat-ripple-element {\n  background-color: var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary));\n}\n.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-filled-touch-target-size, 48px);\n  display: var(--mat-button-filled-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-unelevated-button:not(:disabled) {\n  color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));\n  background-color: var(--mat-button-filled-container-color, var(--mat-sys-primary));\n}\n.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {\n  border-radius: var(--mat-button-filled-container-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-raised-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  box-shadow: var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));\n  height: var(--mat-button-protected-container-height, 40px);\n  font-family: var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-protected-label-text-transform);\n  font-weight: var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-protected-horizontal-padding, 24px);\n}\n.mat-mdc-raised-button > .mat-icon {\n  margin-right: var(--mat-button-protected-icon-spacing, 8px);\n  margin-left: var(--mat-button-protected-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-raised-button > .mat-icon {\n  margin-right: var(--mat-button-protected-icon-offset, -8px);\n  margin-left: var(--mat-button-protected-icon-spacing, 8px);\n}\n.mat-mdc-raised-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-protected-icon-offset, -8px);\n  margin-left: var(--mat-button-protected-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-protected-icon-spacing, 8px);\n  margin-left: var(--mat-button-protected-icon-offset, -8px);\n}\n.mat-mdc-raised-button .mat-ripple-element {\n  background-color: var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-protected-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-raised-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-protected-touch-target-size, 48px);\n  display: var(--mat-button-protected-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-raised-button:not(:disabled) {\n  color: var(--mat-button-protected-label-text-color, var(--mat-sys-primary));\n  background-color: var(--mat-button-protected-container-color, var(--mat-sys-surface));\n}\n.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {\n  border-radius: var(--mat-button-protected-container-shape, var(--mat-sys-corner-full));\n}\n@media (hover: hover) {\n  .mat-mdc-raised-button:hover {\n    box-shadow: var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2));\n  }\n}\n.mat-mdc-raised-button:focus {\n  box-shadow: var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1));\n}\n.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {\n  box-shadow: var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1));\n}\n.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {\n  box-shadow: var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0));\n}\n.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-outlined-button {\n  border-style: solid;\n  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-outlined-container-height, 40px);\n  font-family: var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-outlined-label-text-transform);\n  font-weight: var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));\n  border-radius: var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));\n  border-width: var(--mat-button-outlined-outline-width, 1px);\n  padding: 0 var(--mat-button-outlined-horizontal-padding, 24px);\n}\n.mat-mdc-outlined-button > .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-spacing, 8px);\n  margin-left: var(--mat-button-outlined-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-outlined-button > .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-offset, -8px);\n  margin-left: var(--mat-button-outlined-icon-spacing, 8px);\n}\n.mat-mdc-outlined-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-offset, -8px);\n  margin-left: var(--mat-button-outlined-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-spacing, 8px);\n  margin-left: var(--mat-button-outlined-icon-offset, -8px);\n}\n.mat-mdc-outlined-button .mat-ripple-element {\n  background-color: var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-outlined-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-outlined-touch-target-size, 48px);\n  display: var(--mat-button-outlined-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-outlined-button:not(:disabled) {\n  color: var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));\n  border-color: var(--mat-button-outlined-outline-color, var(--mat-sys-outline));\n}\n.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-tonal-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-tonal-container-height, 40px);\n  font-family: var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-tonal-label-text-transform);\n  font-weight: var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-tonal-horizontal-padding, 24px);\n}\n.mat-tonal-button:not(:disabled) {\n  color: var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));\n  background-color: var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container));\n}\n.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {\n  border-radius: var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full));\n}\n.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-tonal-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-tonal-button > .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-spacing, 8px);\n  margin-left: var(--mat-button-tonal-icon-offset, -8px);\n}\n[dir=rtl] .mat-tonal-button > .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-offset, -8px);\n  margin-left: var(--mat-button-tonal-icon-spacing, 8px);\n}\n.mat-tonal-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-offset, -8px);\n  margin-left: var(--mat-button-tonal-icon-spacing, 8px);\n}\n[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-spacing, 8px);\n  margin-left: var(--mat-button-tonal-icon-offset, -8px);\n}\n.mat-tonal-button .mat-ripple-element {\n  background-color: var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container));\n}\n.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-tonal-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-tonal-touch-target-size, 48px);\n  display: var(--mat-button-tonal-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n\n.mat-mdc-button,\n.mat-mdc-unelevated-button,\n.mat-mdc-raised-button,\n.mat-mdc-outlined-button,\n.mat-tonal-button {\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-button .mat-mdc-button-ripple,\n.mat-mdc-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-unelevated-button .mat-mdc-button-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-raised-button .mat-mdc-button-ripple,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,\n.mat-tonal-button .mat-mdc-button-ripple,\n.mat-tonal-button .mat-mdc-button-persistent-ripple,\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-button .mat-mdc-button-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-ripple,\n.mat-mdc-raised-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-tonal-button .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  content: "";\n  opacity: 0;\n}\n.mat-mdc-button .mdc-button__label,\n.mat-mdc-button .mat-icon,\n.mat-mdc-unelevated-button .mdc-button__label,\n.mat-mdc-unelevated-button .mat-icon,\n.mat-mdc-raised-button .mdc-button__label,\n.mat-mdc-raised-button .mat-icon,\n.mat-mdc-outlined-button .mdc-button__label,\n.mat-mdc-outlined-button .mat-icon,\n.mat-tonal-button .mdc-button__label,\n.mat-tonal-button .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-button .mat-focus-indicator,\n.mat-mdc-unelevated-button .mat-focus-indicator,\n.mat-mdc-raised-button .mat-focus-indicator,\n.mat-mdc-outlined-button .mat-focus-indicator,\n.mat-tonal-button .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n}\n.mat-mdc-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,\n.mat-tonal-button:focus-visible > .mat-focus-indicator::before {\n  content: "";\n  border-radius: inherit;\n}\n.mat-mdc-button._mat-animation-noopable,\n.mat-mdc-unelevated-button._mat-animation-noopable,\n.mat-mdc-raised-button._mat-animation-noopable,\n.mat-mdc-outlined-button._mat-animation-noopable,\n.mat-tonal-button._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-button > .mat-icon,\n.mat-mdc-unelevated-button > .mat-icon,\n.mat-mdc-raised-button > .mat-icon,\n.mat-mdc-outlined-button > .mat-icon,\n.mat-tonal-button > .mat-icon {\n  display: inline-block;\n  position: relative;\n  vertical-align: top;\n  font-size: 1.125rem;\n  height: 1.125rem;\n  width: 1.125rem;\n}\n\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mdc-button__ripple {\n  top: -1px;\n  left: -1px;\n  bottom: -1px;\n  right: -1px;\n}\n\n.mat-mdc-unelevated-button .mat-focus-indicator::before,\n.mat-tonal-button .mat-focus-indicator::before,\n.mat-mdc-raised-button .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n\n.mat-mdc-outlined-button .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1);\n}\n', "@media (forced-colors: active) {\n  .mat-mdc-button:not(.mdc-button--outlined),\n  .mat-mdc-unelevated-button:not(.mdc-button--outlined),\n  .mat-mdc-raised-button:not(.mdc-button--outlined),\n  .mat-mdc-outlined-button:not(.mdc-button--outlined),\n  .mat-mdc-button-base.mat-tonal-button,\n  .mat-mdc-icon-button.mat-mdc-icon-button,\n  .mat-mdc-outlined-button .mdc-button__ripple {\n    outline: solid 1px;\n  }\n}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButton, [{
    type: Component,
    args: [{
      selector: `
    button[matButton], a[matButton], button[mat-button], button[mat-raised-button],
    button[mat-flat-button], button[mat-stroked-button], a[mat-button], a[mat-raised-button],
    a[mat-flat-button], a[mat-stroked-button]
  `,
      host: {
        "class": "mdc-button"
      },
      exportAs: "matButton, matAnchor",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`,
      styles: ['.mat-mdc-button-base {\n  text-decoration: none;\n}\n.mat-mdc-button-base .mat-icon {\n  min-height: fit-content;\n  flex-shrink: 0;\n}\n@media (hover: none) {\n  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {\n    opacity: 0;\n  }\n}\n\n.mdc-button {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  min-width: 64px;\n  border: none;\n  outline: none;\n  line-height: inherit;\n  -webkit-appearance: none;\n  overflow: visible;\n  vertical-align: middle;\n  background: transparent;\n  padding: 0 8px;\n}\n.mdc-button::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mdc-button:active {\n  outline: none;\n}\n.mdc-button:hover {\n  cursor: pointer;\n}\n.mdc-button:disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mdc-button[hidden] {\n  display: none;\n}\n.mdc-button .mdc-button__label {\n  position: relative;\n}\n\n.mat-mdc-button {\n  padding: 0 var(--mat-button-text-horizontal-padding, 12px);\n  height: var(--mat-button-text-container-height, 40px);\n  font-family: var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-text-label-text-transform);\n  font-weight: var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight));\n}\n.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {\n  border-radius: var(--mat-button-text-container-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-button:not(:disabled) {\n  color: var(--mat-button-text-label-text-color, var(--mat-sys-primary));\n}\n.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {\n  padding: 0 var(--mat-button-text-with-icon-horizontal-padding, 16px);\n}\n.mat-mdc-button > .mat-icon {\n  margin-right: var(--mat-button-text-icon-spacing, 8px);\n  margin-left: var(--mat-button-text-icon-offset, -4px);\n}\n[dir=rtl] .mat-mdc-button > .mat-icon {\n  margin-right: var(--mat-button-text-icon-offset, -4px);\n  margin-left: var(--mat-button-text-icon-spacing, 8px);\n}\n.mat-mdc-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-text-icon-offset, -4px);\n  margin-left: var(--mat-button-text-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-text-icon-spacing, 8px);\n  margin-left: var(--mat-button-text-icon-offset, -4px);\n}\n.mat-mdc-button .mat-ripple-element {\n  background-color: var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-text-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-text-touch-target-size, 48px);\n  display: var(--mat-button-text-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n\n.mat-mdc-unelevated-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-filled-container-height, 40px);\n  font-family: var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-filled-label-text-transform);\n  font-weight: var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-filled-horizontal-padding, 24px);\n}\n.mat-mdc-unelevated-button > .mat-icon {\n  margin-right: var(--mat-button-filled-icon-spacing, 8px);\n  margin-left: var(--mat-button-filled-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {\n  margin-right: var(--mat-button-filled-icon-offset, -8px);\n  margin-left: var(--mat-button-filled-icon-spacing, 8px);\n}\n.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-filled-icon-offset, -8px);\n  margin-left: var(--mat-button-filled-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-filled-icon-spacing, 8px);\n  margin-left: var(--mat-button-filled-icon-offset, -8px);\n}\n.mat-mdc-unelevated-button .mat-ripple-element {\n  background-color: var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary));\n}\n.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-unelevated-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-filled-touch-target-size, 48px);\n  display: var(--mat-button-filled-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-unelevated-button:not(:disabled) {\n  color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));\n  background-color: var(--mat-button-filled-container-color, var(--mat-sys-primary));\n}\n.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {\n  border-radius: var(--mat-button-filled-container-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-raised-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  box-shadow: var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));\n  height: var(--mat-button-protected-container-height, 40px);\n  font-family: var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-protected-label-text-transform);\n  font-weight: var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-protected-horizontal-padding, 24px);\n}\n.mat-mdc-raised-button > .mat-icon {\n  margin-right: var(--mat-button-protected-icon-spacing, 8px);\n  margin-left: var(--mat-button-protected-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-raised-button > .mat-icon {\n  margin-right: var(--mat-button-protected-icon-offset, -8px);\n  margin-left: var(--mat-button-protected-icon-spacing, 8px);\n}\n.mat-mdc-raised-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-protected-icon-offset, -8px);\n  margin-left: var(--mat-button-protected-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-protected-icon-spacing, 8px);\n  margin-left: var(--mat-button-protected-icon-offset, -8px);\n}\n.mat-mdc-raised-button .mat-ripple-element {\n  background-color: var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-protected-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-raised-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-protected-touch-target-size, 48px);\n  display: var(--mat-button-protected-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-raised-button:not(:disabled) {\n  color: var(--mat-button-protected-label-text-color, var(--mat-sys-primary));\n  background-color: var(--mat-button-protected-container-color, var(--mat-sys-surface));\n}\n.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {\n  border-radius: var(--mat-button-protected-container-shape, var(--mat-sys-corner-full));\n}\n@media (hover: hover) {\n  .mat-mdc-raised-button:hover {\n    box-shadow: var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2));\n  }\n}\n.mat-mdc-raised-button:focus {\n  box-shadow: var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1));\n}\n.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {\n  box-shadow: var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1));\n}\n.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {\n  box-shadow: var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0));\n}\n.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-outlined-button {\n  border-style: solid;\n  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-outlined-container-height, 40px);\n  font-family: var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-outlined-label-text-transform);\n  font-weight: var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));\n  border-radius: var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));\n  border-width: var(--mat-button-outlined-outline-width, 1px);\n  padding: 0 var(--mat-button-outlined-horizontal-padding, 24px);\n}\n.mat-mdc-outlined-button > .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-spacing, 8px);\n  margin-left: var(--mat-button-outlined-icon-offset, -8px);\n}\n[dir=rtl] .mat-mdc-outlined-button > .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-offset, -8px);\n  margin-left: var(--mat-button-outlined-icon-spacing, 8px);\n}\n.mat-mdc-outlined-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-offset, -8px);\n  margin-left: var(--mat-button-outlined-icon-spacing, 8px);\n}\n[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-outlined-icon-spacing, 8px);\n  margin-left: var(--mat-button-outlined-icon-offset, -8px);\n}\n.mat-mdc-outlined-button .mat-ripple-element {\n  background-color: var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary));\n}\n.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-mdc-outlined-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-outlined-touch-target-size, 48px);\n  display: var(--mat-button-outlined-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n.mat-mdc-outlined-button:not(:disabled) {\n  color: var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));\n  border-color: var(--mat-button-outlined-outline-color, var(--mat-sys-outline));\n}\n.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-tonal-button {\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);\n  height: var(--mat-button-tonal-container-height, 40px);\n  font-family: var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));\n  letter-spacing: var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));\n  text-transform: var(--mat-button-tonal-label-text-transform);\n  font-weight: var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));\n  padding: 0 var(--mat-button-tonal-horizontal-padding, 24px);\n}\n.mat-tonal-button:not(:disabled) {\n  color: var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));\n  background-color: var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container));\n}\n.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {\n  border-radius: var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full));\n}\n.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-tonal-button.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-tonal-button > .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-spacing, 8px);\n  margin-left: var(--mat-button-tonal-icon-offset, -8px);\n}\n[dir=rtl] .mat-tonal-button > .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-offset, -8px);\n  margin-left: var(--mat-button-tonal-icon-spacing, 8px);\n}\n.mat-tonal-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-offset, -8px);\n  margin-left: var(--mat-button-tonal-icon-spacing, 8px);\n}\n[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {\n  margin-right: var(--mat-button-tonal-icon-spacing, 8px);\n  margin-left: var(--mat-button-tonal-icon-offset, -8px);\n}\n.mat-tonal-button .mat-ripple-element {\n  background-color: var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container));\n}\n.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant));\n}\n.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n.mat-tonal-button .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-button-tonal-touch-target-size, 48px);\n  display: var(--mat-button-tonal-touch-target-display, block);\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n}\n\n.mat-mdc-button,\n.mat-mdc-unelevated-button,\n.mat-mdc-raised-button,\n.mat-mdc-outlined-button,\n.mat-tonal-button {\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-button .mat-mdc-button-ripple,\n.mat-mdc-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-unelevated-button .mat-mdc-button-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-raised-button .mat-mdc-button-ripple,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,\n.mat-tonal-button .mat-mdc-button-ripple,\n.mat-tonal-button .mat-mdc-button-persistent-ripple,\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-button .mat-mdc-button-ripple,\n.mat-mdc-unelevated-button .mat-mdc-button-ripple,\n.mat-mdc-raised-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-tonal-button .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,\n.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,\n.mat-tonal-button .mat-mdc-button-persistent-ripple::before {\n  content: "";\n  opacity: 0;\n}\n.mat-mdc-button .mdc-button__label,\n.mat-mdc-button .mat-icon,\n.mat-mdc-unelevated-button .mdc-button__label,\n.mat-mdc-unelevated-button .mat-icon,\n.mat-mdc-raised-button .mdc-button__label,\n.mat-mdc-raised-button .mat-icon,\n.mat-mdc-outlined-button .mdc-button__label,\n.mat-mdc-outlined-button .mat-icon,\n.mat-tonal-button .mdc-button__label,\n.mat-tonal-button .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-button .mat-focus-indicator,\n.mat-mdc-unelevated-button .mat-focus-indicator,\n.mat-mdc-raised-button .mat-focus-indicator,\n.mat-mdc-outlined-button .mat-focus-indicator,\n.mat-tonal-button .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: inherit;\n}\n.mat-mdc-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,\n.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,\n.mat-tonal-button:focus-visible > .mat-focus-indicator::before {\n  content: "";\n  border-radius: inherit;\n}\n.mat-mdc-button._mat-animation-noopable,\n.mat-mdc-unelevated-button._mat-animation-noopable,\n.mat-mdc-raised-button._mat-animation-noopable,\n.mat-mdc-outlined-button._mat-animation-noopable,\n.mat-tonal-button._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-button > .mat-icon,\n.mat-mdc-unelevated-button > .mat-icon,\n.mat-mdc-raised-button > .mat-icon,\n.mat-mdc-outlined-button > .mat-icon,\n.mat-tonal-button > .mat-icon {\n  display: inline-block;\n  position: relative;\n  vertical-align: top;\n  font-size: 1.125rem;\n  height: 1.125rem;\n  width: 1.125rem;\n}\n\n.mat-mdc-outlined-button .mat-mdc-button-ripple,\n.mat-mdc-outlined-button .mdc-button__ripple {\n  top: -1px;\n  left: -1px;\n  bottom: -1px;\n  right: -1px;\n}\n\n.mat-mdc-unelevated-button .mat-focus-indicator::before,\n.mat-tonal-button .mat-focus-indicator::before,\n.mat-mdc-raised-button .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n\n.mat-mdc-outlined-button .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1);\n}\n', "@media (forced-colors: active) {\n  .mat-mdc-button:not(.mdc-button--outlined),\n  .mat-mdc-unelevated-button:not(.mdc-button--outlined),\n  .mat-mdc-raised-button:not(.mdc-button--outlined),\n  .mat-mdc-outlined-button:not(.mdc-button--outlined),\n  .mat-mdc-button-base.mat-tonal-button,\n  .mat-mdc-icon-button.mat-mdc-icon-button,\n  .mat-mdc-outlined-button .mdc-button__ripple {\n    outline: solid 1px;\n  }\n}\n"]
    }]
  }], () => [], {
    appearance: [{
      type: Input,
      args: ["matButton"]
    }]
  });
})();
function _inferAppearance(button) {
  if (button.hasAttribute("mat-raised-button")) {
    return "elevated";
  }
  if (button.hasAttribute("mat-stroked-button")) {
    return "outlined";
  }
  if (button.hasAttribute("mat-flat-button")) {
    return "filled";
  }
  if (button.hasAttribute("mat-button")) {
    return "text";
  }
  return null;
}
var MAT_FAB_DEFAULT_OPTIONS = new InjectionToken("mat-mdc-fab-default-options", {
  providedIn: "root",
  factory: () => defaults
});
var defaults = {
  color: "accent"
};
var MatFabButton = class _MatFabButton extends MatButtonBase {
  _options = inject(MAT_FAB_DEFAULT_OPTIONS, {
    optional: true
  });
  _isFab = true;
  extended = false;
  constructor() {
    super();
    this._options = this._options || defaults;
    this.color = this._options.color || defaults.color;
  }
  static ɵfac = function MatFabButton_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFabButton)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MatFabButton,
    selectors: [["button", "mat-fab", ""], ["a", "mat-fab", ""], ["button", "matFab", ""], ["a", "matFab", ""]],
    hostAttrs: [1, "mdc-fab", "mat-mdc-fab-base", "mat-mdc-fab"],
    hostVars: 4,
    hostBindings: function MatFabButton_HostBindings(rf, ctx) {
      if (rf & 2) {
        ɵɵclassProp("mdc-fab--extended", ctx.extended)("mat-mdc-extended-fab", ctx.extended);
      }
    },
    inputs: {
      extended: [2, "extended", "extended", booleanAttribute]
    },
    exportAs: ["matButton", "matAnchor"],
    features: [ɵɵInheritDefinitionFeature],
    attrs: _c3,
    ngContentSelectors: _c2,
    decls: 7,
    vars: 4,
    consts: [[1, "mat-mdc-button-persistent-ripple"], [1, "mdc-button__label"], [1, "mat-focus-indicator"], [1, "mat-mdc-button-touch-target"]],
    template: function MatFabButton_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c12);
        ɵɵdomElement(0, "span", 0);
        ɵɵprojection(1);
        ɵɵdomElementStart(2, "span", 1);
        ɵɵprojection(3, 1);
        ɵɵdomElementEnd();
        ɵɵprojection(4, 2);
        ɵɵdomElement(5, "span", 2)(6, "span", 3);
      }
      if (rf & 2) {
        ɵɵclassProp("mdc-button__ripple", !ctx._isFab)("mdc-fab__ripple", ctx._isFab);
      }
    },
    styles: ['.mat-mdc-fab-base {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  border: none;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  overflow: visible;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  flex-shrink: 0;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  content: "";\n  opacity: 0;\n}\n.mat-mdc-fab-base .mdc-button__label,\n.mat-mdc-fab-base .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-fab-base .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n}\n.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {\n  content: "";\n}\n.mat-mdc-fab-base._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-fab-base::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 1px solid transparent;\n  border-radius: inherit;\n  content: "";\n  pointer-events: none;\n}\n.mat-mdc-fab-base[hidden] {\n  display: none;\n}\n.mat-mdc-fab-base::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {\n  outline: none;\n}\n.mat-mdc-fab-base:hover {\n  cursor: pointer;\n}\n.mat-mdc-fab-base > svg {\n  width: 100%;\n}\n.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {\n  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);\n  fill: currentColor;\n  will-change: transform;\n}\n.mat-mdc-fab-base .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-fab {\n  background-color: var(--mat-fab-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-container-shape, var(--mat-sys-corner-large));\n  color: var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-fab:hover {\n    box-shadow: var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-fab:focus {\n  box-shadow: var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab:active, .mat-mdc-fab:focus:active {\n  box-shadow: var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-touch-target-size, 48px);\n  display: var(--mat-fab-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-fab-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-fab .mat-ripple-element {\n  background-color: var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-disabled-state-layer-color);\n}\n.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-mini-fab {\n  width: 40px;\n  height: 40px;\n  background-color: var(--mat-fab-small-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));\n  color: var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-mini-fab:hover {\n    box-shadow: var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-mini-fab:focus {\n  box-shadow: var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {\n  box-shadow: var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-mini-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-small-touch-target-size, 48px);\n  display: var(--mat-fab-small-touch-target-display);\n  left: 50%;\n  width: var(--mat-fab-small-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-mini-fab .mat-ripple-element {\n  background-color: var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-disabled-state-layer-color);\n}\n.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-extended-fab {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: 20px;\n  padding-right: 20px;\n  width: auto;\n  max-width: 100%;\n  line-height: normal;\n  box-shadow: var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));\n  height: var(--mat-fab-extended-container-height, 56px);\n  border-radius: var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));\n  font-family: var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));\n  font-weight: var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));\n  letter-spacing: var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking));\n}\n@media (hover: hover) {\n  .mat-mdc-extended-fab:hover {\n    box-shadow: var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-extended-fab:focus {\n  box-shadow: var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {\n  box-shadow: var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,\n.mat-mdc-extended-fab > .mat-icon,\n.mat-mdc-extended-fab > .material-icons {\n  margin-left: -8px;\n  margin-right: 12px;\n}\n.mat-mdc-extended-fab .mdc-button__label + .mat-icon,\n.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {\n  margin-left: 12px;\n  margin-right: -8px;\n}\n.mat-mdc-extended-fab .mat-mdc-button-touch-target {\n  width: 100%;\n}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFabButton, [{
    type: Component,
    args: [{
      selector: `button[mat-fab], a[mat-fab], button[matFab], a[matFab]`,
      host: {
        "class": "mdc-fab mat-mdc-fab-base mat-mdc-fab",
        "[class.mdc-fab--extended]": "extended",
        "[class.mat-mdc-extended-fab]": "extended"
      },
      exportAs: "matButton, matAnchor",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`,
      styles: ['.mat-mdc-fab-base {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  border: none;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  overflow: visible;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  flex-shrink: 0;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  content: "";\n  opacity: 0;\n}\n.mat-mdc-fab-base .mdc-button__label,\n.mat-mdc-fab-base .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-fab-base .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n}\n.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {\n  content: "";\n}\n.mat-mdc-fab-base._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-fab-base::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 1px solid transparent;\n  border-radius: inherit;\n  content: "";\n  pointer-events: none;\n}\n.mat-mdc-fab-base[hidden] {\n  display: none;\n}\n.mat-mdc-fab-base::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {\n  outline: none;\n}\n.mat-mdc-fab-base:hover {\n  cursor: pointer;\n}\n.mat-mdc-fab-base > svg {\n  width: 100%;\n}\n.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {\n  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);\n  fill: currentColor;\n  will-change: transform;\n}\n.mat-mdc-fab-base .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-fab {\n  background-color: var(--mat-fab-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-container-shape, var(--mat-sys-corner-large));\n  color: var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-fab:hover {\n    box-shadow: var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-fab:focus {\n  box-shadow: var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab:active, .mat-mdc-fab:focus:active {\n  box-shadow: var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-touch-target-size, 48px);\n  display: var(--mat-fab-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-fab-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-fab .mat-ripple-element {\n  background-color: var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-disabled-state-layer-color);\n}\n.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-mini-fab {\n  width: 40px;\n  height: 40px;\n  background-color: var(--mat-fab-small-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));\n  color: var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-mini-fab:hover {\n    box-shadow: var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-mini-fab:focus {\n  box-shadow: var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {\n  box-shadow: var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-mini-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-small-touch-target-size, 48px);\n  display: var(--mat-fab-small-touch-target-display);\n  left: 50%;\n  width: var(--mat-fab-small-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-mini-fab .mat-ripple-element {\n  background-color: var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-disabled-state-layer-color);\n}\n.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-extended-fab {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: 20px;\n  padding-right: 20px;\n  width: auto;\n  max-width: 100%;\n  line-height: normal;\n  box-shadow: var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));\n  height: var(--mat-fab-extended-container-height, 56px);\n  border-radius: var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));\n  font-family: var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));\n  font-weight: var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));\n  letter-spacing: var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking));\n}\n@media (hover: hover) {\n  .mat-mdc-extended-fab:hover {\n    box-shadow: var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-extended-fab:focus {\n  box-shadow: var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {\n  box-shadow: var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,\n.mat-mdc-extended-fab > .mat-icon,\n.mat-mdc-extended-fab > .material-icons {\n  margin-left: -8px;\n  margin-right: 12px;\n}\n.mat-mdc-extended-fab .mdc-button__label + .mat-icon,\n.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {\n  margin-left: 12px;\n  margin-right: -8px;\n}\n.mat-mdc-extended-fab .mat-mdc-button-touch-target {\n  width: 100%;\n}\n']
    }]
  }], () => [], {
    extended: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var MatMiniFabButton = class _MatMiniFabButton extends MatButtonBase {
  _options = inject(MAT_FAB_DEFAULT_OPTIONS, {
    optional: true
  });
  _isFab = true;
  constructor() {
    super();
    this._options = this._options || defaults;
    this.color = this._options.color || defaults.color;
  }
  static ɵfac = function MatMiniFabButton_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatMiniFabButton)();
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MatMiniFabButton,
    selectors: [["button", "mat-mini-fab", ""], ["a", "mat-mini-fab", ""], ["button", "matMiniFab", ""], ["a", "matMiniFab", ""]],
    hostAttrs: [1, "mdc-fab", "mat-mdc-fab-base", "mdc-fab--mini", "mat-mdc-mini-fab"],
    exportAs: ["matButton", "matAnchor"],
    features: [ɵɵInheritDefinitionFeature],
    attrs: _c4,
    ngContentSelectors: _c2,
    decls: 7,
    vars: 4,
    consts: [[1, "mat-mdc-button-persistent-ripple"], [1, "mdc-button__label"], [1, "mat-focus-indicator"], [1, "mat-mdc-button-touch-target"]],
    template: function MatMiniFabButton_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵprojectionDef(_c12);
        ɵɵdomElement(0, "span", 0);
        ɵɵprojection(1);
        ɵɵdomElementStart(2, "span", 1);
        ɵɵprojection(3, 1);
        ɵɵdomElementEnd();
        ɵɵprojection(4, 2);
        ɵɵdomElement(5, "span", 2)(6, "span", 3);
      }
      if (rf & 2) {
        ɵɵclassProp("mdc-button__ripple", !ctx._isFab)("mdc-fab__ripple", ctx._isFab);
      }
    },
    styles: [_c5],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatMiniFabButton, [{
    type: Component,
    args: [{
      selector: `button[mat-mini-fab], a[mat-mini-fab], button[matMiniFab], a[matMiniFab]`,
      host: {
        "class": "mdc-fab mat-mdc-fab-base mdc-fab--mini mat-mdc-mini-fab"
      },
      exportAs: "matButton, matAnchor",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<span
    class="mat-mdc-button-persistent-ripple"
    [class.mdc-button__ripple]="!_isFab"
    [class.mdc-fab__ripple]="_isFab"></span>

<ng-content select=".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])">
</ng-content>

<span class="mdc-button__label"><ng-content></ng-content></span>

<ng-content select=".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]">
</ng-content>

<!--
  The indicator can't be directly on the button, because MDC uses ::before for high contrast
  indication and it can't be on the ripple, because it has a border radius and overflow: hidden.
-->
<span class="mat-focus-indicator"></span>

<span class="mat-mdc-button-touch-target"></span>
`,
      styles: ['.mat-mdc-fab-base {\n  -webkit-user-select: none;\n  user-select: none;\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 56px;\n  height: 56px;\n  padding: 0;\n  border: none;\n  fill: currentColor;\n  text-decoration: none;\n  cursor: pointer;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  overflow: visible;\n  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1), opacity 15ms linear 30ms, transform 270ms 0ms cubic-bezier(0, 0, 0.2, 1);\n  flex-shrink: 0;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple,\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: inherit;\n}\n.mat-mdc-fab-base .mat-mdc-button-ripple {\n  overflow: hidden;\n}\n.mat-mdc-fab-base .mat-mdc-button-persistent-ripple::before {\n  content: "";\n  opacity: 0;\n}\n.mat-mdc-fab-base .mdc-button__label,\n.mat-mdc-fab-base .mat-icon {\n  z-index: 1;\n  position: relative;\n}\n.mat-mdc-fab-base .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n}\n.mat-mdc-fab-base:focus-visible > .mat-focus-indicator::before {\n  content: "";\n}\n.mat-mdc-fab-base._mat-animation-noopable {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-fab-base::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  border: 1px solid transparent;\n  border-radius: inherit;\n  content: "";\n  pointer-events: none;\n}\n.mat-mdc-fab-base[hidden] {\n  display: none;\n}\n.mat-mdc-fab-base::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n.mat-mdc-fab-base:active, .mat-mdc-fab-base:focus {\n  outline: none;\n}\n.mat-mdc-fab-base:hover {\n  cursor: pointer;\n}\n.mat-mdc-fab-base > svg {\n  width: 100%;\n}\n.mat-mdc-fab-base .mat-icon, .mat-mdc-fab-base .material-icons {\n  transition: transform 180ms 90ms cubic-bezier(0, 0, 0.2, 1);\n  fill: currentColor;\n  will-change: transform;\n}\n.mat-mdc-fab-base .mat-focus-indicator::before {\n  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-fab-base[disabled], .mat-mdc-fab-base[disabled]:focus, .mat-mdc-fab-base.mat-mdc-button-disabled, .mat-mdc-fab-base.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-fab-base.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-fab {\n  background-color: var(--mat-fab-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-container-shape, var(--mat-sys-corner-large));\n  color: var(--mat-fab-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-fab:hover {\n    box-shadow: var(--mat-fab-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-fab:focus {\n  box-shadow: var(--mat-fab-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab:active, .mat-mdc-fab:focus:active {\n  box-shadow: var(--mat-fab-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-fab[disabled], .mat-mdc-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-touch-target-size, 48px);\n  display: var(--mat-fab-touch-target-display, block);\n  left: 50%;\n  width: var(--mat-fab-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-fab .mat-ripple-element {\n  background-color: var(--mat-fab-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-disabled-state-layer-color);\n}\n.mat-mdc-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-mini-fab {\n  width: 40px;\n  height: 40px;\n  background-color: var(--mat-fab-small-container-color, var(--mat-sys-primary-container));\n  border-radius: var(--mat-fab-small-container-shape, var(--mat-sys-corner-medium));\n  color: var(--mat-fab-small-foreground-color, var(--mat-sys-on-primary-container, inherit));\n  box-shadow: var(--mat-fab-small-container-elevation-shadow, var(--mat-sys-level3));\n}\n@media (hover: hover) {\n  .mat-mdc-mini-fab:hover {\n    box-shadow: var(--mat-fab-small-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-mini-fab:focus {\n  box-shadow: var(--mat-fab-small-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab:active, .mat-mdc-mini-fab:focus:active {\n  box-shadow: var(--mat-fab-small-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-mini-fab[disabled], .mat-mdc-mini-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n  color: var(--mat-fab-small-disabled-state-foreground-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  background-color: var(--mat-fab-small-disabled-state-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-mini-fab .mat-mdc-button-touch-target {\n  position: absolute;\n  top: 50%;\n  height: var(--mat-fab-small-touch-target-size, 48px);\n  display: var(--mat-fab-small-touch-target-display);\n  left: 50%;\n  width: var(--mat-fab-small-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n}\n.mat-mdc-mini-fab .mat-ripple-element {\n  background-color: var(--mat-fab-small-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-mini-fab .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-state-layer-color, var(--mat-sys-on-primary-container));\n}\n.mat-mdc-mini-fab.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {\n  background-color: var(--mat-fab-small-disabled-state-layer-color);\n}\n.mat-mdc-mini-fab:hover > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-mini-fab.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-mini-fab.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n.mat-mdc-mini-fab:active > .mat-mdc-button-persistent-ripple::before {\n  opacity: var(--mat-fab-small-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n}\n\n.mat-mdc-extended-fab {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  padding-left: 20px;\n  padding-right: 20px;\n  width: auto;\n  max-width: 100%;\n  line-height: normal;\n  box-shadow: var(--mat-fab-extended-container-elevation-shadow, var(--mat-sys-level3));\n  height: var(--mat-fab-extended-container-height, 56px);\n  border-radius: var(--mat-fab-extended-container-shape, var(--mat-sys-corner-large));\n  font-family: var(--mat-fab-extended-label-text-font, var(--mat-sys-label-large-font));\n  font-size: var(--mat-fab-extended-label-text-size, var(--mat-sys-label-large-size));\n  font-weight: var(--mat-fab-extended-label-text-weight, var(--mat-sys-label-large-weight));\n  letter-spacing: var(--mat-fab-extended-label-text-tracking, var(--mat-sys-label-large-tracking));\n}\n@media (hover: hover) {\n  .mat-mdc-extended-fab:hover {\n    box-shadow: var(--mat-fab-extended-hover-container-elevation-shadow, var(--mat-sys-level4));\n  }\n}\n.mat-mdc-extended-fab:focus {\n  box-shadow: var(--mat-fab-extended-focus-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab:active, .mat-mdc-extended-fab:focus:active {\n  box-shadow: var(--mat-fab-extended-pressed-container-elevation-shadow, var(--mat-sys-level3));\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab.mat-mdc-button-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-extended-fab[disabled], .mat-mdc-extended-fab[disabled]:focus, .mat-mdc-extended-fab.mat-mdc-button-disabled, .mat-mdc-extended-fab.mat-mdc-button-disabled:focus {\n  box-shadow: none;\n}\n.mat-mdc-extended-fab.mat-mdc-button-disabled-interactive {\n  pointer-events: auto;\n}\n[dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .mat-icon, [dir=rtl] .mat-mdc-extended-fab .mdc-button__label + .material-icons,\n.mat-mdc-extended-fab > .mat-icon,\n.mat-mdc-extended-fab > .material-icons {\n  margin-left: -8px;\n  margin-right: 12px;\n}\n.mat-mdc-extended-fab .mdc-button__label + .mat-icon,\n.mat-mdc-extended-fab .mdc-button__label + .material-icons, [dir=rtl] .mat-mdc-extended-fab > .mat-icon, [dir=rtl] .mat-mdc-extended-fab > .material-icons {\n  margin-left: 12px;\n  margin-right: -8px;\n}\n.mat-mdc-extended-fab .mat-mdc-button-touch-target {\n  width: 100%;\n}\n']
    }]
  }], () => [], null);
})();
var MatButtonModule = class _MatButtonModule {
  static ɵfac = function MatButtonModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatButtonModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatButtonModule,
    imports: [MatRippleModule, MatButton, MatMiniFabButton, MatIconButton, MatFabButton],
    exports: [BidiModule, MatButton, MatMiniFabButton, MatIconButton, MatFabButton]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [MatRippleModule, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatButtonModule, [{
    type: NgModule,
    args: [{
      imports: [MatRippleModule, MatButton, MatMiniFabButton, MatIconButton, MatFabButton],
      exports: [BidiModule, MatButton, MatMiniFabButton, MatIconButton, MatFabButton]
    }]
  }], null, null);
})();

export {
  ComponentPortal,
  TemplatePortal,
  BasePortalOutlet,
  CdkPortalOutlet,
  PortalModule,
  createBlockScrollStrategy,
  createRepositionScrollStrategy,
  OverlayConfig,
  createFlexibleConnectedPositionStrategy,
  FlexibleConnectedPositionStrategy,
  createGlobalPositionStrategy,
  createOverlayRef,
  OverlayModule,
  MatIconButton,
  MatButton,
  MatButtonModule
};
//# sourceMappingURL=chunk-FUOUEXEK.js.map
