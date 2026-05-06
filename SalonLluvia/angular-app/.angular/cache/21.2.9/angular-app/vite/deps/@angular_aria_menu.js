import "./chunk-EG5KB4IB.js";
import "./chunk-VUWJC3ON.js";
import {
  _IdGenerator
} from "./chunk-EZQETXZ4.js";
import "./chunk-GVJHBFLN.js";
import "./chunk-ST4OSR52.js";
import {
  Directionality
} from "./chunk-XT7CPOMY.js";
import "./chunk-QFMI3UF4.js";
import "./chunk-SISHXUHW.js";
import {
  ContentChildren,
  Directive,
  ElementRef,
  InjectionToken,
  Input,
  Output,
  SIGNAL,
  TemplateRef,
  ViewContainerRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChildren,
  createComputed,
  createSignal,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  setClassMetadata,
  signal,
  untracked,
  ɵɵHostDirectivesFeature,
  ɵɵProvidersFeature,
  ɵɵattribute,
  ɵɵcontentQuerySignal,
  ɵɵdefineDirective,
  ɵɵlistener,
  ɵɵqueryAdvance
} from "./chunk-WNUUFSUI.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// node_modules/@angular/aria/fesm2022/_signal-like-chunk.mjs
var Modifier;
(function(Modifier2) {
  Modifier2[Modifier2["None"] = 0] = "None";
  Modifier2[Modifier2["Ctrl"] = 1] = "Ctrl";
  Modifier2[Modifier2["Shift"] = 2] = "Shift";
  Modifier2[Modifier2["Alt"] = 4] = "Alt";
  Modifier2[Modifier2["Meta"] = 8] = "Meta";
  Modifier2["Any"] = "Any";
})(Modifier || (Modifier = {}));
var EventManager = class {
  configs = [];
  handle(event) {
    for (const config of this.configs) {
      if (config.matcher(event)) {
        config.handler(event);
        if (config.preventDefault) {
          event.preventDefault();
        }
        if (config.stopPropagation) {
          event.stopPropagation();
        }
      }
    }
  }
};
function getModifiers(event) {
  return (+event.ctrlKey && Modifier.Ctrl) | (+event.shiftKey && Modifier.Shift) | (+event.altKey && Modifier.Alt) | (+event.metaKey && Modifier.Meta);
}
function hasModifiers(event, modifiers) {
  const eventModifiers = getModifiers(event);
  const modifiersList = Array.isArray(modifiers) ? modifiers : [modifiers];
  if (modifiersList.includes(Modifier.Any)) {
    return true;
  }
  return modifiersList.some((modifiers2) => eventModifiers === modifiers2);
}
var KeyboardEventManager = class extends EventManager {
  options = {
    ignoreRepeat: true,
    preventDefault: true,
    stopPropagation: true
  };
  on(...args) {
    const {
      modifiers,
      key,
      handler,
      options
    } = this._normalizeInputs(...args);
    this.configs.push(__spreadValues(__spreadValues({
      handler,
      matcher: (event) => this._isMatch(event, key, modifiers, options)
    }, this.options), options));
    return this;
  }
  _normalizeInputs(...args) {
    const withModifiers = Array.isArray(args[0]) || args[0] in Modifier;
    const modifiers = withModifiers ? args[0] : Modifier.None;
    const key = withModifiers ? args[1] : args[0];
    const handler = withModifiers ? args[2] : args[1];
    const options = withModifiers ? args[3] : args[2];
    return {
      key,
      handler,
      modifiers,
      options: options ?? {}
    };
  }
  _isMatch(event, key, modifiers, options) {
    if (!hasModifiers(event, modifiers)) {
      return false;
    }
    if (event.repeat && options?.ignoreRepeat !== false) {
      return false;
    }
    if (key instanceof RegExp) {
      return key.test(event.key);
    }
    const keyStr = typeof key === "string" ? key : key();
    return keyStr.toLowerCase() === event.key.toLowerCase();
  }
};
function computed2(computation) {
  const computed3 = createComputed(computation);
  computed3.toString = () => `[Computed: ${computed3()}]`;
  computed3[SIGNAL].debugName = "";
  return computed3;
}
function signal2(initialValue) {
  const [get, set, update] = createSignal(initialValue);
  get[SIGNAL].debugName = "";
  return Object.assign(get, {
    set,
    update,
    asReadonly: () => get
  });
}

// node_modules/@angular/aria/fesm2022/_list-navigation-chunk.mjs
var ListFocus = class {
  inputs;
  prevActiveItem = signal2(void 0);
  prevActiveIndex = computed2(() => {
    return this.prevActiveItem() ? this.inputs.items().indexOf(this.prevActiveItem()) : -1;
  });
  activeIndex = computed2(() => {
    return this.inputs.activeItem() ? this.inputs.items().indexOf(this.inputs.activeItem()) : -1;
  });
  constructor(inputs) {
    this.inputs = inputs;
  }
  isListDisabled() {
    return this.inputs.disabled() || this.inputs.items().every((i) => i.disabled());
  }
  getActiveDescendant() {
    if (this.isListDisabled()) {
      return void 0;
    }
    if (this.inputs.focusMode() === "roving") {
      return void 0;
    }
    return this.inputs.activeItem()?.id() ?? void 0;
  }
  getListTabIndex() {
    if (this.isListDisabled()) {
      return 0;
    }
    return this.inputs.focusMode() === "activedescendant" ? 0 : -1;
  }
  getItemTabIndex(item) {
    if (this.isListDisabled()) {
      return -1;
    }
    if (this.inputs.focusMode() === "activedescendant") {
      return -1;
    }
    return this.inputs.activeItem() === item ? 0 : -1;
  }
  focus(item, opts) {
    if (this.isListDisabled() || !this.isFocusable(item)) {
      return false;
    }
    this.prevActiveItem.set(this.inputs.activeItem());
    this.inputs.activeItem.set(item);
    if (opts?.focusElement || opts?.focusElement === void 0) {
      this.inputs.focusMode() === "roving" ? item.element()?.focus() : this.inputs.element()?.focus();
    }
    return true;
  }
  isFocusable(item) {
    return !item.disabled() || this.inputs.softDisabled();
  }
};
var ListNavigation = class {
  inputs;
  constructor(inputs) {
    this.inputs = inputs;
  }
  goto(item, opts) {
    return item ? this.inputs.focusManager.focus(item, opts) : false;
  }
  next(opts) {
    return this._advance(1, opts);
  }
  peekNext(opts) {
    return this._peek(1, opts);
  }
  prev(opts) {
    return this._advance(-1, opts);
  }
  peekPrev(opts) {
    return this._peek(-1, opts);
  }
  first(opts) {
    const item = this.peekFirst(opts);
    return item ? this.goto(item, opts) : false;
  }
  last(opts) {
    const item = this.peekLast(opts);
    return item ? this.goto(item, opts) : false;
  }
  peekFirst(opts) {
    const items = opts?.items ?? this.inputs.items();
    return items.find((i) => this.inputs.focusManager.isFocusable(i));
  }
  peekLast(opts) {
    const items = opts?.items ?? this.inputs.items();
    for (let i = items.length - 1; i >= 0; i--) {
      if (this.inputs.focusManager.isFocusable(items[i])) {
        return items[i];
      }
    }
    return;
  }
  _advance(delta, opts) {
    const item = this._peek(delta, opts);
    return item ? this.goto(item, opts) : false;
  }
  _peek(delta, opts) {
    const items = opts?.items ?? this.inputs.items();
    const itemCount = items.length;
    const activeItem = this.inputs.focusManager.inputs.activeItem();
    const startIndex = opts?.items && activeItem ? items.indexOf(activeItem) : this.inputs.focusManager.activeIndex();
    const step = (i) => this.inputs.wrap() ? (i + delta + itemCount) % itemCount : i + delta;
    for (let i = step(startIndex); i !== startIndex && i < itemCount && i >= 0; i = step(i)) {
      if (this.inputs.focusManager.isFocusable(items[i])) {
        return items[i];
      }
    }
    return;
  }
};

// node_modules/@angular/aria/fesm2022/_list-typeahead-chunk.mjs
var ListSelection = class {
  inputs;
  rangeStartIndex = signal2(0);
  rangeEndIndex = signal2(0);
  selectedItems = computed2(() => this.inputs.items().filter((item) => this.inputs.values().includes(item.value())));
  constructor(inputs) {
    this.inputs = inputs;
  }
  select(item, opts = {
    anchor: true
  }) {
    item = item ?? this.inputs.focusManager.inputs.activeItem();
    if (!item || item.disabled() || !item.selectable() || !this.inputs.focusManager.isFocusable(item) || this.inputs.values().includes(item.value())) {
      return;
    }
    if (!this.inputs.multi()) {
      this.deselectAll();
    }
    const index = this.inputs.items().findIndex((i) => i === item);
    if (opts.anchor) {
      this.beginRangeSelection(index);
    }
    this.inputs.values.update((values) => values.concat(item.value()));
  }
  deselect(item) {
    item = item ?? this.inputs.focusManager.inputs.activeItem();
    if (item && !item.disabled() && item.selectable()) {
      this.inputs.values.update((values) => values.filter((value) => value !== item.value()));
    }
  }
  toggle(item) {
    item = item ?? this.inputs.focusManager.inputs.activeItem();
    if (item) {
      this.inputs.values().includes(item.value()) ? this.deselect(item) : this.select(item);
    }
  }
  toggleOne() {
    const item = this.inputs.focusManager.inputs.activeItem();
    if (item) {
      this.inputs.values().includes(item.value()) ? this.deselect() : this.selectOne();
    }
  }
  selectAll() {
    if (!this.inputs.multi()) {
      return;
    }
    for (const item of this.inputs.items()) {
      this.select(item, {
        anchor: false
      });
    }
    this.beginRangeSelection();
  }
  deselectAll() {
    for (const value of this.inputs.values()) {
      const item = this.inputs.items().find((i) => i.value() === value);
      item ? this.deselect(item) : this.inputs.values.update((values) => values.filter((v) => v !== value));
    }
  }
  toggleAll() {
    const selectableValues = this.inputs.items().filter((i) => !i.disabled() && i.selectable() && this.inputs.focusManager.isFocusable(i)).map((i) => i.value());
    selectableValues.every((i) => this.inputs.values().includes(i)) ? this.deselectAll() : this.selectAll();
  }
  selectOne() {
    const item = this.inputs.focusManager.inputs.activeItem();
    if (item && (item.disabled() || !item.selectable())) {
      return;
    }
    this.deselectAll();
    if (this.inputs.values().length > 0 && !this.inputs.multi()) {
      return;
    }
    this.select();
  }
  selectRange(opts = {
    anchor: true
  }) {
    const isStartOfRange = this.inputs.focusManager.prevActiveIndex() === this.rangeStartIndex();
    if (isStartOfRange && opts.anchor) {
      this.beginRangeSelection(this.inputs.focusManager.prevActiveIndex());
    }
    const itemsInRange = this._getItemsFromIndex(this.rangeStartIndex());
    const itemsOutOfRange = this._getItemsFromIndex(this.rangeEndIndex()).filter((i) => !itemsInRange.includes(i));
    for (const item of itemsOutOfRange) {
      this.deselect(item);
    }
    for (const item of itemsInRange) {
      this.select(item, {
        anchor: false
      });
    }
    if (itemsInRange.length) {
      const item = itemsInRange.pop();
      const index = this.inputs.items().findIndex((i) => i === item);
      this.rangeEndIndex.set(index);
    }
  }
  beginRangeSelection(index = this.inputs.focusManager.activeIndex()) {
    this.rangeStartIndex.set(index);
    this.rangeEndIndex.set(index);
  }
  _getItemsFromIndex(index) {
    if (index === -1) {
      return [];
    }
    const upper = Math.max(this.inputs.focusManager.activeIndex(), index);
    const lower = Math.min(this.inputs.focusManager.activeIndex(), index);
    const items = [];
    for (let i = lower; i <= upper; i++) {
      items.push(this.inputs.items()[i]);
    }
    if (this.inputs.focusManager.activeIndex() < index) {
      return items.reverse();
    }
    return items;
  }
};
var ListTypeahead = class {
  inputs;
  timeout;
  focusManager;
  isTyping = computed2(() => this._query().length > 0);
  _query = signal2("");
  _startIndex = signal2(void 0);
  constructor(inputs) {
    this.inputs = inputs;
    this.focusManager = inputs.focusManager;
  }
  search(char) {
    if (char.length !== 1) {
      return false;
    }
    if (!this.isTyping() && char === " ") {
      return false;
    }
    if (this._startIndex() === void 0) {
      this._startIndex.set(this.focusManager.activeIndex());
    }
    clearTimeout(this.timeout);
    this._query.update((q) => q + char.toLowerCase());
    const item = this._getItem();
    if (item) {
      this.focusManager.focus(item);
    }
    this.timeout = setTimeout(() => {
      this._query.set("");
      this._startIndex.set(void 0);
    }, this.inputs.typeaheadDelay());
    return true;
  }
  _getItem() {
    const items = this.focusManager.inputs.items();
    const itemCount = items.length;
    const startIndex = this._startIndex();
    for (let i = 0; i < itemCount; i++) {
      const index = (startIndex + 1 + i) % itemCount;
      const item = items[index];
      if (this.focusManager.isFocusable(item) && item.searchTerm().toLowerCase().startsWith(this._query())) {
        return item;
      }
    }
    return void 0;
  }
};

// node_modules/@angular/aria/fesm2022/_list-chunk.mjs
var List = class {
  inputs;
  navigationBehavior;
  selectionBehavior;
  typeaheadBehavior;
  focusBehavior;
  disabled = computed2(() => this.focusBehavior.isListDisabled());
  activeDescendant = computed2(() => this.focusBehavior.getActiveDescendant());
  tabIndex = computed2(() => this.focusBehavior.getListTabIndex());
  activeIndex = computed2(() => this.focusBehavior.activeIndex());
  _anchorIndex = signal2(0);
  _wrap = signal2(true);
  constructor(inputs) {
    this.inputs = inputs;
    this.focusBehavior = new ListFocus(inputs);
    this.selectionBehavior = new ListSelection(__spreadProps(__spreadValues({}, inputs), {
      focusManager: this.focusBehavior
    }));
    this.typeaheadBehavior = new ListTypeahead(__spreadProps(__spreadValues({}, inputs), {
      focusManager: this.focusBehavior
    }));
    this.navigationBehavior = new ListNavigation(__spreadProps(__spreadValues({}, inputs), {
      focusManager: this.focusBehavior,
      wrap: computed2(() => this._wrap() && this.inputs.wrap())
    }));
  }
  getItemTabindex(item) {
    return this.focusBehavior.getItemTabIndex(item);
  }
  first(opts) {
    this._navigate(opts, () => this.navigationBehavior.first(opts));
  }
  last(opts) {
    this._navigate(opts, () => this.navigationBehavior.last(opts));
  }
  next(opts) {
    this._navigate(opts, () => this.navigationBehavior.next(opts));
  }
  prev(opts) {
    this._navigate(opts, () => this.navigationBehavior.prev(opts));
  }
  goto(item, opts) {
    this._navigate(opts, () => this.navigationBehavior.goto(item, opts));
  }
  unfocus() {
    this.inputs.activeItem.set(void 0);
  }
  anchor(index) {
    this._anchorIndex.set(index);
  }
  search(char, opts) {
    this._navigate(opts, () => this.typeaheadBehavior.search(char));
  }
  isTyping() {
    return this.typeaheadBehavior.isTyping();
  }
  select(item) {
    this.selectionBehavior.select(item);
  }
  selectOne() {
    this.selectionBehavior.selectOne();
  }
  deselect(item) {
    this.selectionBehavior.deselect(item);
  }
  deselectAll() {
    this.selectionBehavior.deselectAll();
  }
  toggle(item) {
    this.selectionBehavior.toggle(item);
  }
  toggleOne() {
    this.selectionBehavior.toggleOne();
  }
  toggleAll() {
    this.selectionBehavior.toggleAll();
  }
  isFocusable(item) {
    return this.focusBehavior.isFocusable(item);
  }
  updateSelection(opts = {
    anchor: true
  }) {
    if (opts.toggle) {
      this.selectionBehavior.toggle();
    }
    if (opts.select) {
      this.selectionBehavior.select();
    }
    if (opts.selectOne) {
      this.selectionBehavior.selectOne();
    }
    if (opts.selectRange) {
      this.selectionBehavior.selectRange();
    }
    if (!opts.anchor) {
      this.anchor(this.selectionBehavior.rangeStartIndex());
    }
  }
  _navigate(opts = {}, operation) {
    if (opts?.selectRange) {
      this._wrap.set(false);
      this.selectionBehavior.rangeStartIndex.set(this._anchorIndex());
    }
    const moved = operation();
    if (moved) {
      this.updateSelection(opts);
    }
    this._wrap.set(true);
  }
};

// node_modules/@angular/aria/fesm2022/_menu-chunk.mjs
var MenuPattern = class _MenuPattern {
  inputs;
  id;
  role = () => "menu";
  disabled = () => this.inputs.disabled();
  visible = computed2(() => this.inputs.parent() ? !!this.inputs.parent()?.expanded() : true);
  listBehavior;
  isFocused = signal2(false);
  hasBeenFocused = signal2(false);
  hasBeenHovered = signal2(false);
  _openTimeout;
  _closeTimeout;
  tabIndex = () => this.listBehavior.tabIndex();
  shouldFocus = computed2(() => {
    const root = this.root();
    if (root instanceof MenuTriggerPattern) {
      return true;
    }
    if (root instanceof MenuBarPattern || root instanceof _MenuPattern) {
      return root.isFocused();
    }
    return false;
  });
  _expandKey = computed2(() => {
    return this.inputs.textDirection() === "rtl" ? "ArrowLeft" : "ArrowRight";
  });
  _collapseKey = computed2(() => {
    return this.inputs.textDirection() === "rtl" ? "ArrowRight" : "ArrowLeft";
  });
  dynamicSpaceKey = computed2(() => this.listBehavior.isTyping() ? "" : " ");
  typeaheadRegexp = /^.$/;
  root = computed2(() => {
    const parent = this.inputs.parent();
    if (!parent) {
      return this;
    }
    if (parent instanceof MenuTriggerPattern) {
      return parent;
    }
    const grandparent = parent.inputs.parent();
    if (grandparent instanceof MenuBarPattern) {
      return grandparent;
    }
    return grandparent?.root();
  });
  keydownManager = computed2(() => {
    return new KeyboardEventManager().on("ArrowDown", () => this.next(), {
      ignoreRepeat: false
    }).on("ArrowUp", () => this.prev(), {
      ignoreRepeat: false
    }).on("Home", () => this.first()).on("End", () => this.last()).on("Enter", () => this.trigger()).on("Escape", () => this.closeAll()).on(this._expandKey, () => this.expand()).on(this._collapseKey, () => this.collapse()).on(this.dynamicSpaceKey, () => this.trigger()).on(this.typeaheadRegexp, (e) => this.listBehavior.search(e.key));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.listBehavior = new List(__spreadProps(__spreadValues({}, inputs), {
      values: signal2([])
    }));
  }
  setDefaultState() {
    if (!this.inputs.parent()) {
      this.listBehavior.goto(this.inputs.items()[0], {
        focusElement: false
      });
    }
  }
  onKeydown(event) {
    this.keydownManager().handle(event);
  }
  onMouseOver(event) {
    if (!this.visible()) {
      return;
    }
    this.hasBeenHovered.set(true);
    const item = this.inputs.items().find((i) => i.element()?.contains(event.target));
    if (!item) {
      return;
    }
    const parent = this.inputs.parent();
    const activeItem = this?.inputs.activeItem();
    if (parent instanceof MenuItemPattern) {
      const grandparent = parent.inputs.parent();
      if (grandparent instanceof _MenuPattern) {
        grandparent._clearTimeouts();
        grandparent.listBehavior.goto(parent, {
          focusElement: false
        });
      }
    }
    if (activeItem && activeItem !== item) {
      this._closeItem(activeItem);
    }
    if (item.expanded()) {
      this._clearCloseTimeout();
    }
    this._openItem(item);
    this.listBehavior.goto(item, {
      focusElement: this.shouldFocus()
    });
  }
  _closeItem(item) {
    this._clearOpenTimeout();
    if (!this._closeTimeout) {
      this._closeTimeout = setTimeout(() => {
        item.close();
        this._closeTimeout = void 0;
      }, this.inputs.expansionDelay());
    }
  }
  _openItem(item) {
    this._clearOpenTimeout();
    this._openTimeout = setTimeout(() => {
      item.open();
      this._openTimeout = void 0;
    }, this.inputs.expansionDelay());
  }
  onMouseOut(event) {
    this._clearOpenTimeout();
    if (this.isFocused()) {
      return;
    }
    const root = this.root();
    const parent = this.inputs.parent();
    const relatedTarget = event.relatedTarget;
    if (!root || !parent || parent instanceof MenuTriggerPattern) {
      return;
    }
    const grandparent = parent.inputs.parent();
    if (!grandparent || grandparent instanceof MenuBarPattern) {
      return;
    }
    if (!grandparent.inputs.element()?.contains(relatedTarget)) {
      parent.close();
    }
  }
  onClick(event) {
    const relatedTarget = event.target;
    const item = this.inputs.items().find((i) => i.element()?.contains(relatedTarget));
    if (item) {
      item.open();
      this.listBehavior.goto(item);
      this.submit(item);
    }
  }
  onFocusIn() {
    this.isFocused.set(true);
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    const parent = this.inputs.parent();
    const parentEl = parent?.inputs.element();
    const relatedTarget = event.relatedTarget;
    if (!relatedTarget) {
      this.isFocused.set(false);
      this.inputs.parent()?.close({
        refocus: true
      });
    }
    if (parent instanceof MenuItemPattern) {
      const grandparent = parent.inputs.parent();
      const siblings = grandparent?.inputs.items().filter((i) => i !== parent);
      const item = siblings?.find((i) => i.element()?.contains(relatedTarget));
      if (item) {
        return;
      }
    }
    if (this.visible() && !parentEl?.contains(relatedTarget) && !this.inputs.element()?.contains(relatedTarget)) {
      this.isFocused.set(false);
      this.inputs.parent()?.close();
    }
  }
  prev() {
    this.inputs.activeItem()?.close();
    this.listBehavior.prev();
  }
  next() {
    this.inputs.activeItem()?.close();
    this.listBehavior.next();
  }
  first() {
    this.inputs.activeItem()?.close();
    this.listBehavior.first();
  }
  last() {
    this.inputs.activeItem()?.close();
    this.listBehavior.last();
  }
  trigger() {
    this.inputs.activeItem()?.hasPopup() ? this.inputs.activeItem()?.open({
      first: true
    }) : this.submit();
  }
  submit(item = this.inputs.activeItem()) {
    if (!item || item.disabled() || item.submenu()) {
      return;
    }
    const root = this.root();
    if (root instanceof MenuTriggerPattern) {
      root.close({
        refocus: true
      });
      root?.inputs.menu()?.inputs.itemSelected?.(item.value());
    } else if (root instanceof MenuBarPattern) {
      root.close();
      root?.inputs.itemSelected?.(item.value());
    } else if (root instanceof _MenuPattern) {
      root.inputs.activeItem()?.close({
        refocus: true
      });
      root?.inputs.itemSelected?.(item.value());
    }
  }
  collapse() {
    const root = this.root();
    const parent = this.inputs.parent();
    if (parent instanceof MenuItemPattern && !(parent.inputs.parent() instanceof MenuBarPattern)) {
      parent.close({
        refocus: true
      });
    } else if (root instanceof MenuBarPattern) {
      root.prev();
    }
  }
  expand() {
    const root = this.root();
    const activeItem = this.inputs.activeItem();
    if (activeItem?.submenu()) {
      activeItem.open({
        first: true
      });
    } else if (root instanceof MenuBarPattern) {
      root.next();
    }
  }
  close() {
    this.inputs.parent()?.close();
  }
  closeAll() {
    const root = this.root();
    if (root instanceof MenuTriggerPattern) {
      root.close({
        refocus: true
      });
    }
    if (root instanceof MenuBarPattern) {
      root.close();
    }
    if (root instanceof _MenuPattern) {
      root.inputs.activeItem()?.close({
        refocus: true
      });
    }
  }
  _clearTimeouts() {
    this._clearOpenTimeout();
    this._clearCloseTimeout();
  }
  _clearOpenTimeout() {
    if (this._openTimeout) {
      clearTimeout(this._openTimeout);
      this._openTimeout = void 0;
    }
  }
  _clearCloseTimeout() {
    if (this._closeTimeout) {
      clearTimeout(this._closeTimeout);
      this._closeTimeout = void 0;
    }
  }
};
var MenuBarPattern = class {
  inputs;
  listBehavior;
  tabIndex = () => this.listBehavior.tabIndex();
  _nextKey = computed2(() => {
    return this.inputs.textDirection() === "rtl" ? "ArrowLeft" : "ArrowRight";
  });
  _previousKey = computed2(() => {
    return this.inputs.textDirection() === "rtl" ? "ArrowRight" : "ArrowLeft";
  });
  dynamicSpaceKey = computed2(() => this.listBehavior.isTyping() ? "" : " ");
  typeaheadRegexp = /^.$/;
  isFocused = signal2(false);
  hasBeenFocused = signal2(false);
  disabled = () => this.inputs.disabled();
  keydownManager = computed2(() => {
    return new KeyboardEventManager().on(this._nextKey, () => this.next(), {
      ignoreRepeat: false
    }).on(this._previousKey, () => this.prev(), {
      ignoreRepeat: false
    }).on("End", () => this.listBehavior.last()).on("Home", () => this.listBehavior.first()).on("Enter", () => this.inputs.activeItem()?.open({
      first: true
    })).on("ArrowUp", () => this.inputs.activeItem()?.open({
      last: true
    })).on("ArrowDown", () => this.inputs.activeItem()?.open({
      first: true
    })).on(this.dynamicSpaceKey, () => this.inputs.activeItem()?.open({
      first: true
    })).on(this.typeaheadRegexp, (e) => this.listBehavior.search(e.key));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.listBehavior = new List(inputs);
  }
  setDefaultState() {
    this.inputs.activeItem.set(this.inputs.items()[0]);
  }
  onKeydown(event) {
    this.keydownManager().handle(event);
  }
  onClick(event) {
    const item = this.inputs.items().find((i) => i.element()?.contains(event.target));
    if (!item) {
      return;
    }
    this.goto(item);
    item.expanded() ? item.close() : item.open();
  }
  onMouseOver(event) {
    const item = this.inputs.items().find((i) => i.element()?.contains(event.target));
    if (item) {
      this.goto(item, {
        focusElement: this.isFocused()
      });
    }
  }
  onFocusIn() {
    this.isFocused.set(true);
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    const relatedTarget = event.relatedTarget;
    if (!this.inputs.element()?.contains(relatedTarget)) {
      this.isFocused.set(false);
      this.close();
    }
  }
  goto(item, opts) {
    const prevItem = this.inputs.activeItem();
    this.listBehavior.goto(item, opts);
    if (prevItem?.expanded()) {
      prevItem?.close();
      this.inputs.activeItem()?.open();
    }
    if (item === prevItem) {
      if (item.expanded() && item.submenu()?.inputs.activeItem()) {
        item.submenu()?.inputs.activeItem()?.close();
        item.submenu()?.listBehavior.unfocus();
      }
    }
  }
  next() {
    const prevItem = this.inputs.activeItem();
    this.listBehavior.next();
    if (prevItem?.expanded()) {
      prevItem?.close();
      this.inputs.activeItem()?.open({
        first: true
      });
    }
  }
  prev() {
    const prevItem = this.inputs.activeItem();
    this.listBehavior.prev();
    if (prevItem?.expanded()) {
      prevItem?.close();
      this.inputs.activeItem()?.open({
        first: true
      });
    }
  }
  close() {
    this.inputs.activeItem()?.close({
      refocus: this.isFocused()
    });
  }
};
var MenuTriggerPattern = class {
  inputs;
  expanded = signal2(false);
  hasBeenFocused = signal2(false);
  role = () => "button";
  hasPopup = () => true;
  menu;
  tabIndex = computed2(() => this.expanded() && this.menu()?.inputs.activeItem() ? -1 : 0);
  disabled = () => this.inputs.disabled();
  keydownManager = computed2(() => {
    return new KeyboardEventManager().on(" ", () => this.open({
      first: true
    })).on("Enter", () => this.open({
      first: true
    })).on("ArrowDown", () => this.open({
      first: true
    })).on("ArrowUp", () => this.open({
      last: true
    })).on("Escape", () => this.close({
      refocus: true
    }));
  });
  constructor(inputs) {
    this.inputs = inputs;
    this.menu = this.inputs.menu;
  }
  onKeydown(event) {
    if (!this.inputs.disabled()) {
      this.keydownManager().handle(event);
    }
  }
  onClick() {
    if (!this.inputs.disabled()) {
      this.expanded() ? this.close() : this.open({
        first: true
      });
    }
  }
  onFocusIn() {
    this.hasBeenFocused.set(true);
  }
  onFocusOut(event) {
    const element = this.inputs.element();
    const relatedTarget = event.relatedTarget;
    if (this.expanded() && !element?.contains(relatedTarget) && !this.inputs.menu()?.inputs.element()?.contains(relatedTarget)) {
      this.close();
    }
  }
  open(opts) {
    this.expanded.set(true);
    if (opts?.first) {
      this.inputs.menu()?.first();
    } else if (opts?.last) {
      this.inputs.menu()?.last();
    }
  }
  close(opts = {}) {
    this.expanded.set(false);
    this.menu()?.listBehavior.unfocus();
    if (opts.refocus) {
      this.inputs.element()?.focus();
    }
    let menuitems = this.inputs.menu()?.inputs.items() ?? [];
    while (menuitems.length) {
      const menuitem = menuitems.pop();
      menuitem?._expanded.set(false);
      menuitem?.inputs.parent()?.listBehavior.unfocus();
      menuitems = menuitems.concat(menuitem?.submenu()?.inputs.items() ?? []);
    }
  }
};
var MenuItemPattern = class {
  inputs;
  value;
  id;
  disabled = () => this.inputs.parent()?.disabled() || this.inputs.disabled();
  searchTerm;
  element;
  active = computed2(() => this.inputs.parent()?.inputs.activeItem() === this);
  hasBeenFocused = signal2(false);
  tabIndex = computed2(() => {
    if (this.submenu() && this.submenu()?.inputs.activeItem()) {
      return -1;
    }
    return this.inputs.parent()?.listBehavior.getItemTabindex(this) ?? -1;
  });
  index = computed2(() => this.inputs.parent()?.inputs.items().indexOf(this) ?? -1);
  expanded = computed2(() => this.submenu() ? this._expanded() : null);
  _expanded = signal2(false);
  controls = signal2(void 0);
  role = () => "menuitem";
  hasPopup = computed2(() => !!this.submenu());
  submenu;
  selectable;
  constructor(inputs) {
    this.inputs = inputs;
    this.id = inputs.id;
    this.value = inputs.value;
    this.element = inputs.element;
    this.submenu = this.inputs.submenu;
    this.searchTerm = inputs.searchTerm;
    this.selectable = computed2(() => !this.submenu());
  }
  open(opts) {
    if (this.disabled()) {
      return;
    }
    this._expanded.set(true);
    if (opts?.first) {
      this.submenu()?.first();
    }
    if (opts?.last) {
      this.submenu()?.last();
    }
  }
  close(opts = {}) {
    this._expanded.set(false);
    if (opts.refocus) {
      this.inputs.parent()?.listBehavior.goto(this);
    }
    let menuitems = this.inputs.submenu()?.inputs.items() ?? [];
    while (menuitems.length) {
      const menuitem = menuitems.pop();
      menuitem?._expanded.set(false);
      menuitem?.inputs.parent()?.listBehavior.unfocus();
      menuitems = menuitems.concat(menuitem?.submenu()?.inputs.items() ?? []);
      const parent = menuitem?.inputs.parent();
      if (parent instanceof MenuPattern) {
        parent._clearTimeouts();
      }
    }
  }
  onFocusIn() {
    this.hasBeenFocused.set(true);
  }
};

// node_modules/@angular/aria/fesm2022/_deferred-content-chunk.mjs
var DeferredContentAware = class _DeferredContentAware {
  contentVisible = signal(false, ...ngDevMode ? [{
    debugName: "contentVisible"
  }] : []);
  preserveContent = model(false, ...ngDevMode ? [{
    debugName: "preserveContent"
  }] : []);
  static ɵfac = function DeferredContentAware_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DeferredContentAware)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _DeferredContentAware,
    inputs: {
      preserveContent: [1, "preserveContent"]
    },
    outputs: {
      preserveContent: "preserveContentChange"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DeferredContentAware, [{
    type: Directive
  }], null, {
    preserveContent: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "preserveContent",
        required: false
      }]
    }, {
      type: Output,
      args: ["preserveContentChange"]
    }]
  });
})();
var DeferredContent = class _DeferredContent {
  _deferredContentAware = inject(DeferredContentAware, {
    optional: true
  });
  _templateRef = inject(TemplateRef);
  _viewContainerRef = inject(ViewContainerRef);
  _currentViewRef = null;
  _isRendered = false;
  deferredContentAware = signal(this._deferredContentAware, ...ngDevMode ? [{
    debugName: "deferredContentAware"
  }] : []);
  constructor() {
    afterRenderEffect(() => {
      if (this.deferredContentAware()?.contentVisible()) {
        if (!this._isRendered) {
          this._destroyContent();
          this._currentViewRef = this._viewContainerRef.createEmbeddedView(this._templateRef);
          this._isRendered = true;
        }
      } else if (!this.deferredContentAware()?.preserveContent()) {
        this._destroyContent();
        this._isRendered = false;
      }
    });
  }
  ngOnDestroy() {
    this._destroyContent();
  }
  _destroyContent() {
    const ref = this._currentViewRef;
    if (ref && !ref.destroyed) {
      ref.destroy();
      this._currentViewRef = null;
    }
  }
  static ɵfac = function DeferredContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DeferredContent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _DeferredContent
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DeferredContent, [{
    type: Directive
  }], () => [], null);
})();

// node_modules/@angular/aria/fesm2022/menu.mjs
var MenuTrigger = class _MenuTrigger {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  textDirection = inject(Directionality).valueSignal;
  menu = input(void 0, ...ngDevMode ? [{
    debugName: "menu"
  }] : []);
  expanded = computed(() => this._pattern.expanded(), ...ngDevMode ? [{
    debugName: "expanded"
  }] : []);
  hasPopup = computed(() => this._pattern.hasPopup(), ...ngDevMode ? [{
    debugName: "hasPopup"
  }] : []);
  disabled = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disabled"
  } : {}), {
    transform: booleanAttribute
  }));
  softDisabled = input(true, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "softDisabled"
  } : {}), {
    transform: booleanAttribute
  }));
  _pattern = new MenuTriggerPattern({
    textDirection: this.textDirection,
    element: computed(() => this._elementRef.nativeElement),
    menu: computed(() => this.menu()?._pattern),
    disabled: () => this.disabled()
  });
  constructor() {
    effect(() => this.menu()?.parent.set(this));
  }
  open() {
    this._pattern.open({
      first: true
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = function MenuTrigger_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MenuTrigger)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MenuTrigger,
    selectors: [["", "ngMenuTrigger", ""]],
    hostVars: 6,
    hostBindings: function MenuTrigger_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("click", function MenuTrigger_click_HostBindingHandler() {
          return ctx._pattern.onClick();
        })("keydown", function MenuTrigger_keydown_HostBindingHandler($event) {
          return ctx._pattern.onKeydown($event);
        })("focusout", function MenuTrigger_focusout_HostBindingHandler($event) {
          return ctx._pattern.onFocusOut($event);
        })("focusin", function MenuTrigger_focusin_HostBindingHandler() {
          return ctx._pattern.onFocusIn();
        });
      }
      if (rf & 2) {
        let tmp_5_0;
        ɵɵattribute("tabindex", ctx._pattern.tabIndex())("disabled", !ctx.softDisabled() && ctx._pattern.disabled() ? true : null)("aria-disabled", ctx._pattern.disabled())("aria-haspopup", ctx.hasPopup())("aria-expanded", ctx.expanded())("aria-controls", (tmp_5_0 = ctx._pattern.menu()) == null ? null : tmp_5_0.id());
      }
    },
    inputs: {
      menu: [1, "menu"],
      disabled: [1, "disabled"],
      softDisabled: [1, "softDisabled"]
    },
    exportAs: ["ngMenuTrigger"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MenuTrigger, [{
    type: Directive,
    args: [{
      selector: "[ngMenuTrigger]",
      exportAs: "ngMenuTrigger",
      host: {
        "[attr.tabindex]": "_pattern.tabIndex()",
        "[attr.disabled]": "!softDisabled() && _pattern.disabled() ? true : null",
        "[attr.aria-disabled]": "_pattern.disabled()",
        "[attr.aria-haspopup]": "hasPopup()",
        "[attr.aria-expanded]": "expanded()",
        "[attr.aria-controls]": "_pattern.menu()?.id()",
        "(click)": "_pattern.onClick()",
        "(keydown)": "_pattern.onKeydown($event)",
        "(focusout)": "_pattern.onFocusOut($event)",
        "(focusin)": "_pattern.onFocusIn()"
      }
    }]
  }], () => [], {
    menu: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "menu",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    softDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "softDisabled",
        required: false
      }]
    }]
  });
})();
var MENU_COMPONENT = new InjectionToken("MENU_COMPONENT");
var MenuItem = class _MenuItem {
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  id = input(inject(_IdGenerator).getId("ng-menu-item-", true), ...ngDevMode ? [{
    debugName: "id"
  }] : []);
  value = input.required(...ngDevMode ? [{
    debugName: "value"
  }] : []);
  disabled = input(false, ...ngDevMode ? [{
    debugName: "disabled"
  }] : []);
  searchTerm = model("", ...ngDevMode ? [{
    debugName: "searchTerm"
  }] : []);
  parent = inject(MENU_COMPONENT, {
    optional: true
  });
  submenu = input(void 0, ...ngDevMode ? [{
    debugName: "submenu"
  }] : []);
  active = computed(() => this._pattern.active(), ...ngDevMode ? [{
    debugName: "active"
  }] : []);
  expanded = computed(() => this._pattern.expanded(), ...ngDevMode ? [{
    debugName: "expanded"
  }] : []);
  hasPopup = computed(() => this._pattern.hasPopup(), ...ngDevMode ? [{
    debugName: "hasPopup"
  }] : []);
  _pattern = new MenuItemPattern({
    id: this.id,
    value: this.value,
    element: computed(() => this._elementRef.nativeElement),
    disabled: this.disabled,
    searchTerm: this.searchTerm,
    parent: computed(() => this.parent?._pattern),
    submenu: computed(() => this.submenu()?._pattern)
  });
  constructor() {
    effect(() => this.submenu()?.parent.set(this));
  }
  open() {
    this._pattern.open({
      first: true
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = function MenuItem_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MenuItem)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MenuItem,
    selectors: [["", "ngMenuItem", ""]],
    hostAttrs: ["role", "menuitem"],
    hostVars: 7,
    hostBindings: function MenuItem_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("focusin", function MenuItem_focusin_HostBindingHandler() {
          return ctx._pattern.onFocusIn();
        });
      }
      if (rf & 2) {
        let tmp_6_0;
        ɵɵattribute("tabindex", ctx._pattern.tabIndex())("data-active", ctx.active())("aria-label", ctx.value())("aria-haspopup", ctx.hasPopup())("aria-expanded", ctx.expanded())("aria-disabled", ctx._pattern.disabled())("aria-controls", (tmp_6_0 = ctx._pattern.submenu()) == null ? null : tmp_6_0.id());
      }
    },
    inputs: {
      id: [1, "id"],
      value: [1, "value"],
      disabled: [1, "disabled"],
      searchTerm: [1, "searchTerm"],
      submenu: [1, "submenu"]
    },
    outputs: {
      searchTerm: "searchTermChange"
    },
    exportAs: ["ngMenuItem"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MenuItem, [{
    type: Directive,
    args: [{
      selector: "[ngMenuItem]",
      exportAs: "ngMenuItem",
      host: {
        "role": "menuitem",
        "(focusin)": "_pattern.onFocusIn()",
        "[attr.tabindex]": "_pattern.tabIndex()",
        "[attr.data-active]": "active()",
        "[attr.aria-label]": "value()",
        "[attr.aria-haspopup]": "hasPopup()",
        "[attr.aria-expanded]": "expanded()",
        "[attr.aria-disabled]": "_pattern.disabled()",
        "[attr.aria-controls]": "_pattern.submenu()?.id()"
      }
    }]
  }], () => [], {
    id: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    value: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "value",
        required: true
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    searchTerm: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "searchTerm",
        required: false
      }]
    }, {
      type: Output,
      args: ["searchTermChange"]
    }],
    submenu: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "submenu",
        required: false
      }]
    }]
  });
})();
var MenuBar = class _MenuBar {
  _allItems = contentChildren(MenuItem, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "_allItems"
  } : {}), {
    descendants: true
  }));
  _items = () => this._allItems().filter((i) => i.parent === this);
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  disabled = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disabled"
  } : {}), {
    transform: booleanAttribute
  }));
  softDisabled = input(true, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "softDisabled"
  } : {}), {
    transform: booleanAttribute
  }));
  textDirection = inject(Directionality).valueSignal;
  values = model([], ...ngDevMode ? [{
    debugName: "values"
  }] : []);
  wrap = input(true, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "wrap"
  } : {}), {
    transform: booleanAttribute
  }));
  typeaheadDelay = input(500, ...ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []);
  _pattern;
  _itemPatterns = signal([], ...ngDevMode ? [{
    debugName: "_itemPatterns"
  }] : []);
  itemSelected = output();
  constructor() {
    this._pattern = new MenuBarPattern(__spreadProps(__spreadValues({}, this), {
      items: this._itemPatterns,
      multi: () => false,
      softDisabled: () => true,
      focusMode: () => "roving",
      orientation: () => "horizontal",
      selectionMode: () => "explicit",
      itemSelected: (value) => this.itemSelected.emit(value),
      activeItem: signal(void 0),
      element: computed(() => this._elementRef.nativeElement)
    }));
    afterRenderEffect(() => {
      this._itemPatterns.set(this._items().map((i) => i._pattern));
    });
    afterRenderEffect(() => {
      if (!this._pattern.hasBeenFocused()) {
        this._pattern.setDefaultState();
      }
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = function MenuBar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MenuBar)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MenuBar,
    selectors: [["", "ngMenuBar", ""]],
    contentQueries: function MenuBar_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx._allItems, MenuItem, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: ["role", "menubar"],
    hostVars: 3,
    hostBindings: function MenuBar_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("keydown", function MenuBar_keydown_HostBindingHandler($event) {
          return ctx._pattern.onKeydown($event);
        })("mouseover", function MenuBar_mouseover_HostBindingHandler($event) {
          return ctx._pattern.onMouseOver($event);
        })("click", function MenuBar_click_HostBindingHandler($event) {
          return ctx._pattern.onClick($event);
        })("focusin", function MenuBar_focusin_HostBindingHandler() {
          return ctx._pattern.onFocusIn();
        })("focusout", function MenuBar_focusout_HostBindingHandler($event) {
          return ctx._pattern.onFocusOut($event);
        });
      }
      if (rf & 2) {
        ɵɵattribute("disabled", !ctx.softDisabled() && ctx._pattern.disabled() ? true : null)("aria-disabled", ctx._pattern.disabled())("tabindex", ctx._pattern.tabIndex());
      }
    },
    inputs: {
      disabled: [1, "disabled"],
      softDisabled: [1, "softDisabled"],
      values: [1, "values"],
      wrap: [1, "wrap"],
      typeaheadDelay: [1, "typeaheadDelay"]
    },
    outputs: {
      values: "valuesChange",
      itemSelected: "itemSelected"
    },
    exportAs: ["ngMenuBar"],
    features: [ɵɵProvidersFeature([{
      provide: MENU_COMPONENT,
      useExisting: _MenuBar
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MenuBar, [{
    type: Directive,
    args: [{
      selector: "[ngMenuBar]",
      exportAs: "ngMenuBar",
      host: {
        "role": "menubar",
        "[attr.disabled]": "!softDisabled() && _pattern.disabled() ? true : null",
        "[attr.aria-disabled]": "_pattern.disabled()",
        "[attr.tabindex]": "_pattern.tabIndex()",
        "(keydown)": "_pattern.onKeydown($event)",
        "(mouseover)": "_pattern.onMouseOver($event)",
        "(click)": "_pattern.onClick($event)",
        "(focusin)": "_pattern.onFocusIn()",
        "(focusout)": "_pattern.onFocusOut($event)"
      },
      providers: [{
        provide: MENU_COMPONENT,
        useExisting: MenuBar
      }]
    }]
  }], () => [], {
    _allItems: [{
      type: ContentChildren,
      args: [forwardRef(() => MenuItem), __spreadProps(__spreadValues({}, {
        descendants: true
      }), {
        isSignal: true
      })]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    softDisabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "softDisabled",
        required: false
      }]
    }],
    values: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "values",
        required: false
      }]
    }, {
      type: Output,
      args: ["valuesChange"]
    }],
    wrap: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "wrap",
        required: false
      }]
    }],
    typeaheadDelay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "typeaheadDelay",
        required: false
      }]
    }],
    itemSelected: [{
      type: Output,
      args: ["itemSelected"]
    }]
  });
})();
var Menu = class _Menu {
  _deferredContentAware = inject(DeferredContentAware, {
    optional: true
  });
  _allItems = contentChildren(MenuItem, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "_allItems"
  } : {}), {
    descendants: true
  }));
  _items = computed(() => this._allItems().filter((i) => i.parent === this), ...ngDevMode ? [{
    debugName: "_items"
  }] : []);
  _elementRef = inject(ElementRef);
  element = this._elementRef.nativeElement;
  textDirection = inject(Directionality).valueSignal;
  id = input(inject(_IdGenerator).getId("ng-menu-", true), ...ngDevMode ? [{
    debugName: "id"
  }] : []);
  wrap = input(true, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "wrap"
  } : {}), {
    transform: booleanAttribute
  }));
  typeaheadDelay = input(500, ...ngDevMode ? [{
    debugName: "typeaheadDelay"
  }] : []);
  disabled = input(false, __spreadProps(__spreadValues({}, ngDevMode ? {
    debugName: "disabled"
  } : {}), {
    transform: booleanAttribute
  }));
  parent = signal(void 0, ...ngDevMode ? [{
    debugName: "parent"
  }] : []);
  _pattern;
  _itemPatterns = computed(() => {
    this._pattern.visible();
    return this._items().map((i) => i._pattern);
  }, ...ngDevMode ? [{
    debugName: "_itemPatterns"
  }] : []);
  visible = computed(() => this._pattern.visible(), ...ngDevMode ? [{
    debugName: "visible"
  }] : []);
  tabIndex = computed(() => this._pattern.tabIndex(), ...ngDevMode ? [{
    debugName: "tabIndex"
  }] : []);
  itemSelected = output();
  expansionDelay = input(100, ...ngDevMode ? [{
    debugName: "expansionDelay"
  }] : []);
  constructor() {
    this._pattern = new MenuPattern(__spreadProps(__spreadValues({}, this), {
      parent: computed(() => this.parent()?._pattern),
      items: this._itemPatterns,
      multi: () => false,
      softDisabled: () => true,
      focusMode: () => "roving",
      orientation: () => "vertical",
      selectionMode: () => "explicit",
      activeItem: signal(void 0),
      element: computed(() => this._elementRef.nativeElement),
      itemSelected: (value) => this.itemSelected.emit(value)
    }));
    afterRenderEffect(() => {
      const parent = this.parent();
      if (parent instanceof MenuItem && parent.parent instanceof MenuBar) {
        this._deferredContentAware?.contentVisible.set(true);
      } else {
        this._deferredContentAware?.contentVisible.set(this._pattern.visible() || !!this.parent()?._pattern.hasBeenFocused());
      }
    });
    afterRenderEffect(() => {
      if (this._pattern.visible()) {
        const activeItem = untracked(() => this._pattern.inputs.activeItem());
        this._pattern.listBehavior.goto(activeItem);
      }
    });
    afterRenderEffect(() => {
      if (!this._pattern.hasBeenFocused() && !this._pattern.hasBeenHovered() && this._items().length) {
        untracked(() => this._pattern.setDefaultState());
      }
    });
  }
  close() {
    this._pattern.close();
  }
  static ɵfac = function Menu_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Menu)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _Menu,
    selectors: [["", "ngMenu", ""]],
    contentQueries: function Menu_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuerySignal(dirIndex, ctx._allItems, MenuItem, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance();
      }
    },
    hostAttrs: ["role", "menu"],
    hostVars: 4,
    hostBindings: function Menu_HostBindings(rf, ctx) {
      if (rf & 1) {
        ɵɵlistener("keydown", function Menu_keydown_HostBindingHandler($event) {
          return ctx._pattern.onKeydown($event);
        })("mouseover", function Menu_mouseover_HostBindingHandler($event) {
          return ctx._pattern.onMouseOver($event);
        })("mouseout", function Menu_mouseout_HostBindingHandler($event) {
          return ctx._pattern.onMouseOut($event);
        })("focusout", function Menu_focusout_HostBindingHandler($event) {
          return ctx._pattern.onFocusOut($event);
        })("focusin", function Menu_focusin_HostBindingHandler() {
          return ctx._pattern.onFocusIn();
        })("click", function Menu_click_HostBindingHandler($event) {
          return ctx._pattern.onClick($event);
        });
      }
      if (rf & 2) {
        ɵɵattribute("id", ctx._pattern.id())("aria-disabled", ctx._pattern.disabled())("tabindex", ctx.tabIndex())("data-visible", ctx.visible());
      }
    },
    inputs: {
      id: [1, "id"],
      wrap: [1, "wrap"],
      typeaheadDelay: [1, "typeaheadDelay"],
      disabled: [1, "disabled"],
      expansionDelay: [1, "expansionDelay"]
    },
    outputs: {
      itemSelected: "itemSelected"
    },
    exportAs: ["ngMenu"],
    features: [ɵɵProvidersFeature([{
      provide: MENU_COMPONENT,
      useExisting: _Menu
    }]), ɵɵHostDirectivesFeature([{
      directive: DeferredContentAware,
      inputs: ["preserveContent", "preserveContent"]
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Menu, [{
    type: Directive,
    args: [{
      selector: "[ngMenu]",
      exportAs: "ngMenu",
      host: {
        "role": "menu",
        "[attr.id]": "_pattern.id()",
        "[attr.aria-disabled]": "_pattern.disabled()",
        "[attr.tabindex]": "tabIndex()",
        "[attr.data-visible]": "visible()",
        "(keydown)": "_pattern.onKeydown($event)",
        "(mouseover)": "_pattern.onMouseOver($event)",
        "(mouseout)": "_pattern.onMouseOut($event)",
        "(focusout)": "_pattern.onFocusOut($event)",
        "(focusin)": "_pattern.onFocusIn()",
        "(click)": "_pattern.onClick($event)"
      },
      hostDirectives: [{
        directive: DeferredContentAware,
        inputs: ["preserveContent"]
      }],
      providers: [{
        provide: MENU_COMPONENT,
        useExisting: Menu
      }]
    }]
  }], () => [], {
    _allItems: [{
      type: ContentChildren,
      args: [forwardRef(() => MenuItem), __spreadProps(__spreadValues({}, {
        descendants: true
      }), {
        isSignal: true
      })]
    }],
    id: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "id",
        required: false
      }]
    }],
    wrap: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "wrap",
        required: false
      }]
    }],
    typeaheadDelay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "typeaheadDelay",
        required: false
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "disabled",
        required: false
      }]
    }],
    itemSelected: [{
      type: Output,
      args: ["itemSelected"]
    }],
    expansionDelay: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "expansionDelay",
        required: false
      }]
    }]
  });
})();
var MenuContent = class _MenuContent {
  static ɵfac = function MenuContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MenuContent)();
  };
  static ɵdir = ɵɵdefineDirective({
    type: _MenuContent,
    selectors: [["ng-template", "ngMenuContent", ""]],
    exportAs: ["ngMenuContent"],
    features: [ɵɵHostDirectivesFeature([DeferredContent])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MenuContent, [{
    type: Directive,
    args: [{
      selector: "ng-template[ngMenuContent]",
      exportAs: "ngMenuContent",
      hostDirectives: [DeferredContent]
    }]
  }], null, null);
})();
export {
  Menu,
  MenuBar,
  MenuContent,
  MenuItem,
  MenuTrigger,
  DeferredContent as ɵɵDeferredContent,
  DeferredContentAware as ɵɵDeferredContentAware
};
//# sourceMappingURL=@angular_aria_menu.js.map
