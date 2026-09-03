const W = globalThis, at = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lt = /* @__PURE__ */ Symbol(), gt = /* @__PURE__ */ new WeakMap();
let It = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== lt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (at && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = gt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && gt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Kt = (i) => new It(typeof i == "string" ? i : i + "", void 0, lt), Rt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new It(e, i, lt);
}, Qt = (i, t) => {
  if (at) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = W.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, ft = at ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Kt(e);
})(i) : i;
const { is: Gt, defineProperty: te, getOwnPropertyDescriptor: ee, getOwnPropertyNames: se, getOwnPropertySymbols: ie, getPrototypeOf: re } = Object, J = globalThis, _t = J.trustedTypes, oe = _t ? _t.emptyScript : "", ne = J.reactiveElementPolyfillSupport, F = (i, t) => i, it = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? oe : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, Tt = (i, t) => !Gt(i, t), mt = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: Tt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), J.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = mt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && te(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: o } = ee(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? mt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(F("elementProperties"))) return;
    const t = re(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(F("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(F("properties"))) {
      const e = this.properties, s = [...se(e), ...ie(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(ft(r));
    } else t !== void 0 && e.push(ft(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Qt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : it).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : it;
      this._$Em = r;
      const l = n.fromAttribute(e, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? Tt)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[F("elementProperties")] = /* @__PURE__ */ new Map(), P[F("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: P }), (J.reactiveElementVersions ??= []).push("2.1.2");
const ct = globalThis, $t = (i) => i, q = ct.trustedTypes, vt = q ? q.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Nt = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + A, ae = `<${Ut}>`, C = document, j = () => C.createComment(""), D = (i) => i === null || typeof i != "object" && typeof i != "function", dt = Array.isArray, le = (i) => dt(i) || typeof i?.[Symbol.iterator] == "function", tt = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, bt = /-->/g, yt = />/g, E = RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), xt = /'/g, wt = /"/g, Ft = /^(?:script|style|textarea|title)$/i, Ot = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), f = Ot(1), $ = Ot(2), R = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), At = /* @__PURE__ */ new WeakMap(), M = C.createTreeWalker(C, 129);
function Ht(i, t) {
  if (!dt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return vt !== void 0 ? vt.createHTML(t) : t;
}
const ce = (i, t) => {
  const e = i.length - 1, s = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = N;
  for (let l = 0; l < e; l++) {
    const a = i[l];
    let p, h, c = -1, g = 0;
    for (; g < a.length && (n.lastIndex = g, h = n.exec(a), h !== null); ) g = n.lastIndex, n === N ? h[1] === "!--" ? n = bt : h[1] !== void 0 ? n = yt : h[2] !== void 0 ? (Ft.test(h[2]) && (r = RegExp("</" + h[2], "g")), n = E) : h[3] !== void 0 && (n = E) : n === E ? h[0] === ">" ? (n = r ?? N, c = -1) : h[1] === void 0 ? c = -2 : (c = n.lastIndex - h[2].length, p = h[1], n = h[3] === void 0 ? E : h[3] === '"' ? wt : xt) : n === wt || n === xt ? n = E : n === bt || n === yt ? n = N : (n = E, r = void 0);
    const _ = n === E && i[l + 1].startsWith("/>") ? " " : "";
    o += n === N ? a + ae : c >= 0 ? (s.push(p), a.slice(0, c) + Nt + a.slice(c) + A + _) : a + A + (c === -2 ? l : _);
  }
  return [Ht(i, o + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class B {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [p, h] = ce(t, e);
    if (this.el = B.createElement(p, s), M.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = M.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(Nt)) {
          const g = h[n++], _ = r.getAttribute(c).split(A), y = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: o, name: y[2], strings: _, ctor: y[1] === "." ? he : y[1] === "?" ? pe : y[1] === "@" ? ue : K }), r.removeAttribute(c);
        } else c.startsWith(A) && (a.push({ type: 6, index: o }), r.removeAttribute(c));
        if (Ft.test(r.tagName)) {
          const c = r.textContent.split(A), g = c.length - 1;
          if (g > 0) {
            r.textContent = q ? q.emptyScript : "";
            for (let _ = 0; _ < g; _++) r.append(c[_], j()), M.nextNode(), a.push({ type: 2, index: ++o });
            r.append(c[g], j());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ut) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(A, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += A.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = C.createElement("template");
    return s.innerHTML = t, s;
  }
}
function T(i, t, e = i, s) {
  if (t === R) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = D(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = T(i, r._$AS(i, t.values), r, s)), t;
}
class de {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? C).importNode(e, !0);
    M.currentNode = r;
    let o = M.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let p;
        a.type === 2 ? p = new L(o, o.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (p = new ge(o, this, t)), this._$AV.push(p), a = s[++l];
      }
      n !== a?.index && (o = M.nextNode(), n++);
    }
    return M.currentNode = C, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class L {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = T(this, t, e), D(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== R && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : le(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && D(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = B.createElement(Ht(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const o = new de(r, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = At.get(t.strings);
    return e === void 0 && At.set(t.strings, e = new B(t)), e;
  }
  k(t) {
    dt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const o of t) r === e.length ? e.push(s = new L(this.O(j()), this.O(j()), this, this.options)) : s = e[r], s._$AI(o), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = $t(t).nextSibling;
      $t(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class K {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = T(this, t, e, 0), n = !D(t) || t !== this._$AH && t !== R, n && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = o[0], a = 0; a < o.length - 1; a++) p = T(this, l[s + a], e, a), p === R && (p = this._$AH[a]), n ||= !D(p) || p !== this._$AH[a], p === d ? t = d : t !== d && (t += (p ?? "") + o[a + 1]), this._$AH[a] = p;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class he extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class pe extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class ue extends K {
  constructor(t, e, s, r, o) {
    super(t, e, s, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = T(this, t, e, 0) ?? d) === R) return;
    const s = this._$AH, r = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== d && (s === d || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ge {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    T(this, t);
  }
}
const fe = ct.litHtmlPolyfillSupport;
fe?.(B, L), (ct.litHtmlVersions ??= []).push("3.3.3");
const _e = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = r = new L(t.insertBefore(j(), o), o, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
const ht = globalThis;
class I extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = _e(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return R;
  }
}
I._$litElement$ = !0, I.finalized = !0, ht.litElementHydrateSupport?.({ LitElement: I });
const me = ht.litElementPolyfillSupport;
me?.({ LitElement: I });
(ht.litElementVersions ??= []).push("4.2.2");
function pt(i, t) {
  return i.callWS ? i.callWS(t) : Promise.reject(
    new Error("Spatial Presence integration is not connected")
  );
}
function $e(i, t) {
  return pt(i, { type: "spatial_presence/map/get", map_id: t });
}
function ve(i, t, e) {
  const s = jt(e);
  return pt(i, {
    type: "spatial_presence/map/save",
    map_id: t,
    title: e.title ?? t,
    config: { ...s, schema_version: "0.1" }
  });
}
function jt(i) {
  const { type: t, backend_map_id: e, ...s } = i;
  return { ...s, schema_version: "0.1" };
}
function be(i, t) {
  return pt(i, {
    type: "spatial_presence/map/restore_previous",
    map_id: t
  });
}
const Dt = Math.PI / 180;
function rt(i) {
  return (i % 360 + 360) % 360;
}
function ye(i, t, e, s) {
  const r = s / 1e3, o = t * r, n = -e * r, l = rt(i.heading) * Dt;
  return {
    x: i.x + o * Math.cos(l) - n * Math.sin(l),
    y: i.y + o * Math.sin(l) + n * Math.cos(l)
  };
}
function et(i, t, e = 1) {
  const s = (i.range_m ?? 6) * t * e, r = (i.fov_degrees ?? 120) / 2, o = St(i, s, -r), n = St(i, s, r), l = r * 2 > 180 ? 1 : 0;
  return [
    `M ${w(i.x)} ${w(i.y)}`,
    `L ${w(o.x)} ${w(o.y)}`,
    `A ${w(s)} ${w(s)} 0 ${l} 1 ${w(n.x)} ${w(n.y)}`,
    "Z"
  ].join(" ");
}
function St(i, t, e) {
  const s = (i.heading + e - 90) * Dt;
  return {
    x: i.x + t * Math.cos(s),
    y: i.y + t * Math.sin(s)
  };
}
function w(i) {
  return Math.round(i * 100) / 100;
}
function xe(i, t, e, s) {
  const r = kt(i.width * e, s.width * 0.08, s.width * 4), o = kt(
    i.height * e,
    s.height * 0.08,
    s.height * 4
  ), n = (t.x - i.x) / i.width, l = (t.y - i.y) / i.height;
  return {
    x: t.x - n * r,
    y: t.y - l * o,
    width: r,
    height: o
  };
}
function U(i) {
  return i.map((t) => `${t.x},${t.y}`).join(" ");
}
function st(i, t, e, s) {
  return {
    x: s.x + (i - e.left) / e.width * s.width,
    y: s.y + (t - e.top) / e.height * s.height
  };
}
function kt(i, t, e) {
  return Math.min(e, Math.max(t, i));
}
const we = /^sensor\.(.+)_target_([1-9]\d*)_x$/;
function Ae(i) {
  const t = /* @__PURE__ */ new Set();
  for (const e of Object.keys(i.states)) {
    const s = we.exec(e);
    if (!s) continue;
    const r = s[1], o = s[2];
    r && o && i.states[`sensor.${r}_target_${o}_y`] && t.add(r);
  }
  return [...t].sort();
}
function Et(i, t, e = !0, s = Date.now()) {
  const r = [...t.sensors ?? []], o = new Set(
    r.map((n) => n.entity_prefix ?? n.id)
  );
  if (e)
    for (const n of Ae(i))
      o.has(n) || r.push({
        id: n,
        name: Bt(n),
        entity_prefix: n,
        x: t.width / 2,
        y: t.height * 0.85,
        heading: 0,
        range_m: 6,
        fov_degrees: 120,
        mount: "wall"
      });
  return r.map((n) => Se(i, t, n, s));
}
function Se(i, t, e, s) {
  const r = e.entity_prefix ?? e.id, o = [];
  for (let a = 1; a <= 9; a += 1) {
    const p = i.states[`sensor.${r}_target_${a}_x`], h = i.states[`sensor.${r}_target_${a}_y`];
    if (!p || !h) continue;
    const c = Mt(p), g = Mt(h);
    c === void 0 || g === void 0 || c === 0 && g === 0 || o.push({
      id: `${e.id}:${a}`,
      sensorId: e.id,
      sensorName: e.name ?? Bt(r),
      index: a,
      localXmm: c,
      localYmm: g,
      floorPoint: ye(
        e,
        c,
        g,
        t.pixels_per_meter
      ),
      updatedAt: s
    });
  }
  const n = ot(i.states[`sensor.${r}_temperature`]), l = ot(i.states[`sensor.${r}_humidity`]);
  return {
    sensor: e,
    targets: o,
    ...n === void 0 ? {} : { temperature: n },
    ...l === void 0 ? {} : { humidity: l },
    online: ke(i, r),
    discovered: !(t.sensors ?? []).some((a) => a.id === e.id)
  };
}
function ke(i, t) {
  const e = i.states[`binary_sensor.${t}_online`] ?? i.states[`binary_sensor.${t}_status`];
  if (e) return e.state === "on";
  const s = i.states[`binary_sensor.${t}_presence`];
  return s ? !["unavailable", "unknown"].includes(s.state) : !0;
}
function Mt(i) {
  const t = ot(i);
  if (t === void 0) return;
  const e = String(i.attributes.unit_of_measurement ?? "mm").toLowerCase();
  return e === "m" ? t * 1e3 : e === "cm" ? t * 10 : t;
}
function ot(i) {
  if (!i || ["unknown", "unavailable"].includes(i.state)) return;
  const t = Number(i.state);
  return Number.isFinite(t) ? t : void 0;
}
function Bt(i) {
  return i.split("_").filter(Boolean).map((t) => t[0]?.toUpperCase() + t.slice(1)).join(" ");
}
function Ee(i, t = 100) {
  if (!v(i)) throw new Error("Easy Floorplan configuration must be an object");
  const e = i, s = O(e.width, 1e3), r = O(e.height, 700), o = Array.isArray(e.floors) && e.floors.length ? e.floors : [e], n = [], l = /* @__PURE__ */ new Set(), a = o.map((c, g) => {
    const _ = H(c.id ?? `floor-${g + 1}`, l), y = /* @__PURE__ */ new Set(), Q = /* @__PURE__ */ new Set(), G = (c.walls ?? []).flatMap((u, b) => [u.x1, u.y1, u.x2, u.y2].every(S) ? [{
      id: H(String(u.id ?? `wall-${b + 1}`), y),
      points: [
        { x: Number(u.x1), y: Number(u.y1) },
        { x: Number(u.x2), y: Number(u.y2) }
      ]
    }] : (n.push(`${_}: skipped wall ${u.id ?? b + 1} with invalid coordinates`), [])), ut = (c.areas ?? []).flatMap((u, b) => {
      const m = Lt(u.points);
      return m.length < 3 ? (n.push(`${_}: skipped area ${u.id ?? b + 1} with fewer than three points`), []) : [{
        id: H(String(u.id ?? `room-${b + 1}`), Q),
        ...u.name ? { name: u.name } : {},
        ...u.haArea ? { area_id: u.haArea } : {},
        points: m
      }];
    });
    for (const u of ["openings", "items", "texts", "furniture", "trackers"]) {
      const b = c[u]?.length ?? 0;
      b && n.push(`${_}: ${b} ${u} retained only by Easy Floorplan`);
    }
    return {
      id: _,
      name: c.name ?? `Floor ${g + 1}`,
      width: s,
      height: r,
      pixels_per_meter: O(t, 100),
      ...Wt(c.image) ? { background: c.image } : {},
      walls: G,
      rooms: ut,
      zones: [],
      sensors: []
    };
  });
  n.unshift("Easy Floorplan has no physical scale; verify pixels per metre after import");
  const p = o.findIndex(
    (c) => c.id === e.defaultFloor
  ), h = a[Math.max(0, p)]?.id ?? a[0].id;
  return {
    map: {
      schema_version: "0.1",
      title: e.title ?? "Imported Easy Floorplan",
      default_floor: h,
      auto_discover: !0,
      target_trail_seconds: 8,
      floors: a
    },
    warnings: n
  };
}
function Me(i) {
  const t = i.floors[0];
  if (!t) throw new Error("Spatial map has no floors");
  return {
    type: "custom:easy-floorplan-card",
    title: i.title,
    width: t.width,
    height: t.height,
    defaultFloor: i.default_floor,
    floors: i.floors.map((e) => ({
      id: e.id,
      name: e.name,
      ...e.background ? { image: e.background, imageFit: "contain" } : {},
      walls: (e.walls ?? []).flatMap(
        (s) => s.points.slice(0, -1).map((r, o) => {
          const n = s.points[o + 1];
          return {
            id: `${s.id}-${o + 1}`,
            x1: r.x,
            y1: r.y,
            x2: n.x,
            y2: n.y
          };
        })
      ),
      areas: (e.rooms ?? []).map((s) => ({
        id: s.id,
        name: s.name,
        haArea: s.area_id,
        points: s.points
      })),
      openings: [],
      items: [],
      texts: [],
      furniture: [],
      trackers: []
    }))
  };
}
function Ce(i) {
  if (!v(i)) throw new Error("Radar Map Manager backup must be an object");
  const t = v(i.maps) ? i.maps : {}, e = Object.keys(t).length ? t : { default: {} }, s = v(i.radars) ? i.radars : {}, r = [
    "Radar Map Manager uses percentage coordinates; verify floor scale and background alignment",
    "Fusion and smoothing settings stay in Radar Map Manager and are not imported"
  ], o = /* @__PURE__ */ new Set();
  return {
    map: {
      schema_version: "0.1",
      title: "Imported Radar Map Manager map",
      auto_discover: !0,
      target_trail_seconds: 8,
      floors: Object.entries(e).map(([l, a], p) => {
        const h = v(a) ? a : {}, c = v(h.config) ? h.config : {}, g = 1e3, _ = 1e3, y = /* @__PURE__ */ new Set(), Q = Object.entries(s).flatMap(([m, x]) => {
          if (!v(x) || String(x.map_group ?? "default") !== l) return [];
          const k = v(x.layout) ? x.layout : {}, Zt = O(k.scale_x, 5), Jt = O(k.scale_y, 5);
          return Math.abs(Zt - Jt) > 0.01 && r.push(`${l}/${m}: non-uniform RMM scale requires manual calibration`), Array.isArray(x.monitor_zones) && x.monitor_zones.length && r.push(`${l}/${m}: radar-local monitor zones require manual review`), [{
            id: H(m, y),
            name: m,
            entity_prefix: Yt(m),
            x: Ct(k.origin_x, 50) * g,
            y: Ct(k.origin_y, 50) * _,
            heading: S(k.rotation) ? Number(k.rotation) : 0,
            range_m: 6,
            fov_degrees: 120,
            mount: k.ceiling_mount ? "ceiling" : "wall"
          }];
        }), G = v(h.zones) ? h.zones : {}, u = [
          ["include_zones", "detection"],
          ["exclude_zones", "exclusion"],
          ["entrance_zones", "entrance"],
          ["stationary_zones", "stationary"]
        ].flatMap(
          ([m, x]) => Pe(G[m], m, g, _, x, r)
        ), b = [c.bg_image, c.background_image, c.background].find((m) => Wt(m));
        return {
          id: H(l || `floor-${p + 1}`, o),
          name: l === "default" ? "Main floor" : l,
          width: g,
          height: _,
          pixels_per_meter: 100,
          ...typeof b == "string" ? { background: b } : {},
          walls: [],
          rooms: [],
          zones: u,
          sensors: Q
        };
      })
    },
    warnings: r
  };
}
function Pe(i, t, e, s, r, o) {
  return Array.isArray(i) ? i.flatMap((n, l) => {
    const a = v(n) && Array.isArray(n.points) ? n.points : n, p = Lt(a).map((h) => ({
      x: Math.abs(h.x) <= 100 ? h.x / 100 * e : h.x,
      y: Math.abs(h.y) <= 100 ? h.y / 100 * s : h.y
    }));
    return p.length < 3 ? (o.push(`${t}[${l}]: skipped zone with fewer than three points`), []) : [{
      id: `${t}-${l + 1}`,
      name: v(n) && typeof n.name == "string" ? n.name : `${r} ${l + 1}`,
      kind: r,
      points: p
    }];
  }) : [];
}
function Lt(i) {
  return Array.isArray(i) ? i.flatMap((t) => Array.isArray(t) && S(t[0]) && S(t[1]) ? [{ x: Number(t[0]), y: Number(t[1]) }] : v(t) && S(t.x) && S(t.y) ? [{ x: Number(t.x), y: Number(t.y) }] : []) : [];
}
function v(i) {
  return typeof i == "object" && i !== null && !Array.isArray(i);
}
function S(i) {
  return typeof i == "number" && Number.isFinite(i);
}
function O(i, t) {
  return S(i) && Number(i) > 0 ? Number(i) : t;
}
function Ct(i, t) {
  const e = S(i) ? Number(i) : t;
  return Math.max(0, Math.min(100, e)) / 100;
}
function Yt(i) {
  return i.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "item";
}
function H(i, t) {
  const e = Yt(i);
  let s = e, r = 2;
  for (; t.has(s); ) s = `${e}_${r++}`;
  return t.add(s), s;
}
function Wt(i) {
  return typeof i == "string" && /^(\/|https?:\/\/)/i.test(i.trim());
}
const ze = "0.1.0-alpha.2", qt = { states: {} }, V = class V extends I {
  constructor() {
    super(...arguments), this.hass = qt, this.editorMode = !1, this._floorId = "", this._view = { x: 0, y: 0, width: 1200, height: 800 }, this._tool = "pan", this._draftPoints = [], this._showCoverage = !0, this._showTrails = !0, this._pointerMoved = !1, this._trails = /* @__PURE__ */ new Map(), this._fit = () => {
      const t = this._floor;
      t && (this._view = { x: 0, y: 0, width: t.width, height: t.height });
    };
  }
  static getConfigElement() {
    return document.createElement("spatial-presence-card-editor");
  }
  static getStubConfig() {
    return {
      schema_version: "0.1",
      title: "Spatial presence",
      auto_discover: !0,
      target_trail_seconds: 8,
      floors: [Xt()]
    };
  }
  setConfig(t) {
    if (!Array.isArray(t.floors) || t.floors.length === 0)
      throw new Error("Add at least one floor to Spatial Presence.");
    this._config = z(t);
    const e = t.default_floor;
    (!this._floorId || !this._config.floors.some((s) => s.id === this._floorId)) && (this._floorId = (e && this._config.floors.some((s) => s.id === e) ? e : this._config.floors[0]?.id) ?? "", this._fit());
  }
  getCardSize() {
    return 8;
  }
  getGridOptions() {
    return { rows: 8, columns: 12, min_rows: 4 };
  }
  updated(t) {
    t.has("hass") && this._captureTrails();
  }
  render() {
    const t = this._config, e = this._floor;
    if (!t || !e)
      return f`<ha-card><p class="empty">Add a floor to begin.</p></ha-card>`;
    const s = Et(
      this.hass,
      e,
      t.auto_discover !== !1
    ), r = s.find(
      (o) => o.sensor.id === this._selectedSensorId
    );
    return f`
      <ha-card>
        <section class="shell" aria-label=${t.title ?? "Spatial presence"}>
          ${this._renderToolbar(t, e)}
          <div class="workspace">
            ${this._renderMap(e, s)}
            ${r ? this._renderInspector(r, e) : d}
          </div>
          ${this.editorMode ? this._renderEditorHint() : d}
        </section>
      </ha-card>
    `;
  }
  _renderToolbar(t, e) {
    return f`
      <header class="toolbar">
        <label class="floor-select">
          <span class="sr-only">Floor</span>
          <select @change=${this._changeFloor} .value=${e.id}>
            ${t.floors.map(
      (s) => f`<option value=${s.id}>${s.name}</option>`
    )}
          </select>
        </label>
        <div class="toolbar-actions">
          <button type="button" @click=${this._fit} title="Fit entire floor">Fit</button>
          <button
            type="button"
            class=${this._showCoverage ? "active" : ""}
            @click=${() => this._showCoverage = !this._showCoverage}
            aria-pressed=${this._showCoverage}
          >Coverage</button>
          <button
            type="button"
            class=${this._showTrails ? "active" : ""}
            @click=${() => this._showTrails = !this._showTrails}
            aria-pressed=${this._showTrails}
          >Trails</button>
          ${this.editorMode ? f`
                <span class="tool-separator" aria-hidden="true"></span>
                ${this._toolButton("pan", "Move")}
                ${this._toolButton("wall", "Draw wall")}
                ${this._toolButton("room", "Draw room")}
                ${this._toolButton("zone", "Draw zone")}
                ${this._draftPoints.length > 0 ? f`<button type="button" class="commit" @click=${this._finishDrawing}>
                      Finish ${this._tool}
                    </button>` : d}
              ` : d}
        </div>
      </header>
    `;
  }
  _toolButton(t, e) {
    return f`<button
      type="button"
      class=${this._tool === t ? "active" : ""}
      aria-pressed=${this._tool === t}
      @click=${() => {
      this._tool = t, this._draftPoints = [];
    }}
    >${e}</button>`;
  }
  _renderMap(t, e) {
    const s = this._view;
    return f`
      <div class="map-frame">
        <svg
          class="map"
          role="img"
          aria-label="${t.name} live presence map"
          viewBox="${s.x} ${s.y} ${s.width} ${s.height}"
          preserveAspectRatio="xMidYMid meet"
          @wheel=${this._wheel}
          @pointerdown=${this._pointerDown}
          @pointermove=${this._pointerMove}
          @pointerup=${this._pointerUp}
          @pointercancel=${this._pointerUp}
          @click=${this._mapClick}
        >
          <rect class="paper" width=${t.width} height=${t.height}></rect>
          ${t.background ? $`<image
                class="background"
                href=${t.background}
                width=${t.width}
                height=${t.height}
                preserveAspectRatio="xMidYMid meet"
              ></image>` : d}
          <g class="rooms">${(t.rooms ?? []).map((r) => this._renderRoom(r))}</g>
          <g class="zones">${(t.zones ?? []).map((r) => this._renderZone(r))}</g>
          <g class="walls">${(t.walls ?? []).map((r) => this._renderWall(r))}</g>
          ${this._showCoverage ? $`<g class="coverage">${e.map((r) => this._renderCoverage(r, t))}</g>` : d}
          ${this._showTrails ? this._renderTrails() : d}
          <g class="targets">
            ${e.flatMap(
      (r) => r.targets.map((o) => this._renderTarget(o))
    )}
          </g>
          <g class="sensors">
            ${e.map((r) => this._renderSensor(r))}
          </g>
          ${this._draftPoints.length ? $`<polyline class="draft" points=${U(this._draftPoints)}></polyline>
                ${this._draftPoints.map(
      (r) => $`<circle class="draft-point" cx=${r.x} cy=${r.y} r="6"></circle>`
    )}` : d}
        </svg>
        ${e.length === 0 ? f`<div class="map-empty">
              <strong>No compatible radar found</strong>
              <span>Add an LD2450 sensor or configure an entity prefix.</span>
            </div>` : d}
      </div>
    `;
  }
  _renderRoom(t) {
    return $`
      <polygon points=${U(t.points)}></polygon>
      ${t.name && t.points[0] ? $`<text x=${t.points[0].x + 12} y=${t.points[0].y + 24}>${t.name}</text>` : d}
    `;
  }
  _renderZone(t) {
    return $`<polygon points=${U(t.points)}></polygon>`;
  }
  _renderWall(t) {
    return $`<polyline points=${U(t.points)}></polyline>`;
  }
  _renderCoverage(t, e) {
    const s = t.sensor;
    return $`
      <path class="coverage-fringe" d=${et(s, e.pixels_per_meter, 1)}></path>
      <path class="coverage-usable" d=${et(s, e.pixels_per_meter, 0.72)}></path>
      <path class="coverage-strong" d=${et(s, e.pixels_per_meter, 0.4)}></path>
    `;
  }
  _renderTrails() {
    const t = Date.now() - (this._config?.target_trail_seconds ?? 8) * 1e3, e = [...this._trails.entries()].map(([s, r]) => {
      const o = r.filter((n) => n.updatedAt >= t);
      return o.length > 1 ? $`<polyline class="trail" data-track=${s} points=${U(
        o.map((n) => n.floorPoint)
      )}></polyline>` : d;
    });
    return $`<g class="trails">${e}</g>`;
  }
  _renderTarget(t) {
    return $`
      <g class="target" transform="translate(${t.floorPoint.x} ${t.floorPoint.y})">
        <circle r="12"></circle>
        <circle class="target-core" r="4"></circle>
        <text x="17" y="5">${t.index}</text>
      </g>
    `;
  }
  _renderSensor(t) {
    const e = t.sensor, s = e.id === this._selectedSensorId;
    return $`
      <g
        class="sensor ${s ? "selected" : ""} ${t.online ? "" : "offline"}"
        data-sensor=${e.id}
        transform="translate(${e.x} ${e.y}) rotate(${e.heading})"
        tabindex="0"
        role="button"
        aria-label="${e.name ?? e.id} radar"
      >
        <circle r="20"></circle>
        <path d="M 0 -28 L -8 -12 L 8 -12 Z"></path>
        <circle class="sensor-core" r="7"></circle>
      </g>
    `;
  }
  _renderInspector(t, e) {
    const s = t.sensor;
    return f`
      <aside class="inspector" aria-label="Selected radar details">
        <div class="inspector-heading">
          <div>
            <strong>${s.name ?? s.id}</strong>
            <span>${t.online ? "Online" : "Unavailable"}</span>
          </div>
          <button type="button" class="icon-button" @click=${() => this._selectedSensorId = void 0} aria-label="Close inspector">×</button>
        </div>
        ${t.discovered ? f`<p class="notice">Discovered automatically. Move it in the editor to save its placement.</p>` : d}
        <dl>
          <div><dt>Targets</dt><dd>${t.targets.length}</dd></div>
          <div><dt>Position</dt><dd>${Math.round(s.x)}, ${Math.round(s.y)}</dd></div>
          <div><dt>Heading</dt><dd>${Math.round(rt(s.heading))}°</dd></div>
          <div><dt>Range</dt><dd>${s.range_m ?? 6} m</dd></div>
          ${t.temperature === void 0 ? d : f`<div><dt>Temperature</dt><dd>${t.temperature.toFixed(1)}°</dd></div>`}
          ${t.humidity === void 0 ? d : f`<div><dt>Humidity</dt><dd>${t.humidity.toFixed(1)}%</dd></div>`}
        </dl>
        ${this.editorMode ? f`
              <div class="rotation">
                <span>Rotate</span>
                <button type="button" @click=${() => this._rotateSensor(s, -15)}>−15°</button>
                <button type="button" @click=${() => this._rotateSensor(s, -1)}>−1°</button>
                <button type="button" @click=${() => this._rotateSensor(s, 1)}>+1°</button>
                <button type="button" @click=${() => this._rotateSensor(s, 15)}>+15°</button>
              </div>
              <label class="range-control">
                <span>Range ${s.range_m ?? 6} m</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.25"
                  .value=${String(s.range_m ?? 6)}
                  @input=${(r) => this._updateSensor(s, {
      range_m: Number(r.target.value)
    })}
                />
              </label>
              <small>${e.pixels_per_meter} canvas px per metre</small>
            ` : d}
      </aside>
    `;
  }
  _renderEditorHint() {
    const t = this._tool === "pan" ? "Drag the map to pan. Drag a radar to place it." : `Click to add ${this._tool} points, then choose Finish ${this._tool}.`;
    return f`<footer class="editor-hint">${t}</footer>`;
  }
  _changeFloor(t) {
    this._floorId = t.target.value, this.dispatchEvent(
      new CustomEvent("spatial-floor-changed", {
        detail: { floorId: this._floorId },
        bubbles: !0,
        composed: !0
      })
    ), this._selectedSensorId = void 0, this._draftPoints = [], this._fit();
  }
  _wheel(t) {
    const e = this._floor, s = t.currentTarget;
    if (!e) return;
    t.preventDefault();
    const r = st(
      t.clientX,
      t.clientY,
      s.getBoundingClientRect(),
      this._view
    );
    this._view = xe(
      this._view,
      r,
      t.deltaY > 0 ? 1.12 : 0.88,
      e
    );
  }
  _pointerDown(t) {
    const s = t.target.closest("[data-sensor]");
    if (t.currentTarget.setPointerCapture(t.pointerId), this._pointerMoved = !1, s) {
      const o = s.dataset.sensor;
      if (!o) return;
      this._selectedSensorId = o, this.editorMode && this._tool === "pan" && (this._drag = { kind: "sensor", sensorId: o });
      return;
    }
    this._tool === "pan" && (this._drag = {
      kind: "pan",
      clientX: t.clientX,
      clientY: t.clientY,
      view: { ...this._view }
    });
  }
  _pointerMove(t) {
    if (!this._drag) return;
    const e = t.currentTarget;
    if (this._pointerMoved = !0, this._drag.kind === "sensor") {
      const n = this._drag.sensorId, l = st(
        t.clientX,
        t.clientY,
        e.getBoundingClientRect(),
        this._view
      ), a = this._runtimes.find(
        (p) => p.sensor.id === n
      )?.sensor;
      a && this._updateSensor(a, l, !1);
      return;
    }
    const s = e.getBoundingClientRect(), r = this._drag.view.width / s.width, o = this._drag.view.height / s.height;
    this._view = {
      ...this._drag.view,
      x: this._drag.view.x - (t.clientX - this._drag.clientX) * r,
      y: this._drag.view.y - (t.clientY - this._drag.clientY) * o
    };
  }
  _pointerUp(t) {
    const e = t.currentTarget;
    e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId), this._drag?.kind === "sensor" && this._emitConfig(), this._drag = void 0;
  }
  _mapClick(t) {
    if (!this.editorMode || this._tool === "pan" || this._pointerMoved) return;
    const e = t.currentTarget, s = st(
      t.clientX,
      t.clientY,
      e.getBoundingClientRect(),
      this._view
    );
    this._draftPoints = [...this._draftPoints, s];
  }
  _finishDrawing() {
    const t = this._floor;
    if (!t || !this._config) return;
    const e = this._tool === "wall" ? 2 : 3;
    if (this._draftPoints.length < e) return;
    const s = {
      id: `${this._tool}-${crypto.randomUUID()}`,
      ...this._tool === "room" ? { name: `Room ${(t.rooms?.length ?? 0) + 1}` } : this._tool === "zone" ? {
        name: `Zone ${(t.zones?.length ?? 0) + 1}`,
        kind: "detection"
      } : {},
      points: [...this._draftPoints]
    }, r = this._tool === "room" ? "rooms" : this._tool === "zone" ? "zones" : "walls";
    this._replaceFloor({ ...t, [r]: [...t[r] ?? [], s] }), this._draftPoints = [], this._emitConfig();
  }
  _rotateSensor(t, e) {
    this._updateSensor(t, { heading: rt(t.heading + e) });
  }
  _updateSensor(t, e, s = !0) {
    const r = this._floor;
    if (!r) return;
    const o = [...r.sensors ?? []], n = o.findIndex((a) => a.id === t.id), l = { ...t, ...e };
    n >= 0 ? o[n] = l : o.push(l), this._replaceFloor({ ...r, sensors: o }), s && this._emitConfig();
  }
  _replaceFloor(t) {
    this._config && (this._config = {
      ...this._config,
      floors: this._config.floors.map(
        (e) => e.id === t.id ? t : e
      )
    });
  }
  _emitConfig() {
    this._config && this.dispatchEvent(
      new CustomEvent("spatial-config-changed", {
        detail: structuredClone(this._config),
        bubbles: !0,
        composed: !0
      })
    );
  }
  _captureTrails() {
    const t = Date.now() - (this._config?.target_trail_seconds ?? 8) * 1e3;
    for (const e of this._runtimes)
      for (const s of e.targets) {
        const r = this._trails.get(s.id) ?? [];
        r.push(s), this._trails.set(
          s.id,
          r.filter((o) => o.updatedAt >= t).slice(-80)
        );
      }
  }
  get _floor() {
    return this._config?.floors.find((t) => t.id === this._floorId);
  }
  get _runtimes() {
    const t = this._floor;
    return t ? Et(
      this.hass,
      t,
      this._config?.auto_discover !== !1
    ) : [];
  }
};
V.properties = {
  hass: { attribute: !1 },
  editorMode: { attribute: !1 },
  _config: { state: !0 },
  _storageStatus: { state: !0 },
  _floorId: { state: !0 },
  _view: { state: !0 },
  _selectedSensorId: { state: !0 },
  _tool: { state: !0 },
  _draftPoints: { state: !0 },
  _showCoverage: { state: !0 },
  _showTrails: { state: !0 }
}, V.styles = Rt`
    :host {
      display: block;
      --sp-ink: #14232b;
      --sp-paper: #f6f8f7;
      --sp-radar: #00a7a5;
      --sp-heading: #f2a93b;
      --sp-target: #c026d3;
      --sp-muted: #647681;
      color: var(--primary-text-color, var(--sp-ink));
    }

    ha-card {
      height: min(78dvh, 920px);
      min-height: 430px;
      overflow: hidden;
      background: var(--ha-card-background, #fff);
    }

    .shell {
      height: 100%;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
    }

    .toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 12px;
      border-bottom: 1px solid color-mix(in srgb, var(--sp-ink) 16%, transparent);
      background: color-mix(in srgb, var(--sp-paper) 92%, transparent);
      position: relative;
      z-index: 3;
    }

    select,
    button,
    input {
      font: inherit;
    }

    select,
    button {
      min-height: 36px;
      border: 1px solid color-mix(in srgb, var(--sp-ink) 20%, transparent);
      border-radius: 8px;
      background: var(--sp-paper);
      color: var(--sp-ink);
    }

    select {
      padding: 0 34px 0 11px;
      font-weight: 650;
    }

    button {
      padding: 0 11px;
      cursor: pointer;
    }

    button:hover,
    button:focus-visible,
    select:focus-visible,
    input:focus-visible {
      border-color: var(--sp-radar);
      outline: 2px solid color-mix(in srgb, var(--sp-radar) 30%, transparent);
      outline-offset: 1px;
    }

    button.active {
      color: #fff;
      border-color: var(--sp-ink);
      background: var(--sp-ink);
    }

    button.commit {
      color: var(--sp-ink);
      border-color: var(--sp-heading);
      background: color-mix(in srgb, var(--sp-heading) 24%, white);
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      overflow-x: auto;
      scrollbar-width: thin;
    }

    .tool-separator {
      width: 1px;
      height: 26px;
      flex: 0 0 auto;
      background: color-mix(in srgb, var(--sp-ink) 20%, transparent);
    }

    .workspace,
    .map-frame {
      min-width: 0;
      min-height: 0;
      position: relative;
    }

    .map-frame {
      width: 100%;
      height: 100%;
      overflow: hidden;
      touch-action: none;
      background: #dfe7e7;
    }

    .map {
      width: 100%;
      height: 100%;
      display: block;
      user-select: none;
    }

    .paper {
      fill: var(--sp-paper);
    }

    .background {
      opacity: 0.72;
      pointer-events: none;
    }

    .rooms polygon {
      fill: color-mix(in srgb, var(--sp-radar) 7%, transparent);
      stroke: color-mix(in srgb, var(--sp-radar) 42%, transparent);
      stroke-width: 1.5;
    }

    .rooms text {
      fill: var(--sp-muted);
      font-size: 18px;
      font-weight: 650;
      paint-order: stroke;
      stroke: var(--sp-paper);
      stroke-width: 4px;
    }

    .zones polygon {
      fill: color-mix(in srgb, var(--sp-heading) 12%, transparent);
      stroke: var(--sp-heading);
      stroke-dasharray: 8 6;
      stroke-width: 2;
    }

    .walls polyline {
      fill: none;
      stroke: var(--sp-ink);
      stroke-width: 8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .coverage path {
      stroke: none;
      pointer-events: none;
    }

    .coverage-fringe { fill: color-mix(in srgb, var(--sp-radar) 8%, transparent); }
    .coverage-usable { fill: color-mix(in srgb, var(--sp-radar) 11%, transparent); }
    .coverage-strong { fill: color-mix(in srgb, var(--sp-radar) 16%, transparent); }

    .trail {
      fill: none;
      stroke: color-mix(in srgb, var(--sp-target) 40%, transparent);
      stroke-width: 4;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .target circle:first-child {
      fill: color-mix(in srgb, var(--sp-target) 16%, transparent);
      stroke: var(--sp-target);
      stroke-width: 3;
    }

    .target-core { fill: var(--sp-target); }

    .target text {
      fill: var(--sp-target);
      font-size: 17px;
      font-weight: 750;
    }

    .sensor {
      cursor: pointer;
      outline: none;
    }

    .sensor > circle:first-child {
      fill: var(--sp-ink);
      stroke: var(--sp-paper);
      stroke-width: 3;
    }

    .sensor path { fill: var(--sp-heading); }
    .sensor-core { fill: var(--sp-radar); }
    .sensor.selected > circle:first-child { stroke: var(--sp-heading); stroke-width: 6; }
    .sensor.offline { opacity: 0.45; }

    .draft {
      fill: none;
      stroke: var(--sp-heading);
      stroke-width: 5;
      stroke-linecap: round;
      stroke-dasharray: 12 8;
    }

    .draft-point {
      fill: var(--sp-heading);
      stroke: var(--sp-paper);
      stroke-width: 2;
    }

    .inspector {
      position: absolute;
      z-index: 2;
      top: 14px;
      right: 14px;
      width: min(290px, calc(100% - 28px));
      box-sizing: border-box;
      padding: 16px;
      border: 1px solid color-mix(in srgb, var(--sp-ink) 16%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, white 94%, transparent);
      box-shadow: 0 12px 38px rgba(20, 35, 43, 0.18);
      backdrop-filter: blur(12px);
    }

    .inspector-heading {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
    }

    .inspector-heading div {
      display: grid;
      gap: 3px;
    }

    .inspector-heading strong { font-size: 17px; }
    .inspector-heading span, .inspector small { color: var(--sp-muted); }

    .icon-button {
      min-width: 32px;
      min-height: 32px;
      padding: 0;
      font-size: 22px;
      line-height: 1;
    }

    .notice {
      margin: 12px 0;
      padding: 9px 10px;
      border-left: 3px solid var(--sp-heading);
      background: color-mix(in srgb, var(--sp-heading) 12%, white);
      font-size: 13px;
      line-height: 1.35;
    }

    dl {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 16px;
      margin: 16px 0;
    }

    dl div { min-width: 0; }
    dt { color: var(--sp-muted); font-size: 12px; }
    dd { margin: 2px 0 0; font-weight: 700; }

    .rotation {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
      margin-top: 12px;
    }

    .rotation span {
      grid-column: 1 / -1;
      color: var(--sp-muted);
      font-size: 12px;
    }

    .rotation button { min-width: 0; padding: 0 4px; }

    .range-control {
      display: grid;
      gap: 4px;
      margin: 14px 0;
      color: var(--sp-muted);
      font-size: 12px;
    }

    .range-control input { width: 100%; accent-color: var(--sp-radar); }

    .map-empty {
      position: absolute;
      inset: 50% auto auto 50%;
      transform: translate(-50%, -50%);
      display: grid;
      gap: 5px;
      width: min(360px, calc(100% - 40px));
      text-align: center;
      color: var(--sp-muted);
      pointer-events: none;
    }

    .map-empty strong { color: var(--sp-ink); }

    .editor-hint {
      padding: 8px 12px;
      border-top: 1px solid color-mix(in srgb, var(--sp-ink) 14%, transparent);
      background: var(--sp-paper);
      color: var(--sp-muted);
      font-size: 13px;
    }

    .empty { padding: 24px; }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @media (max-width: 720px) {
      ha-card { height: min(76dvh, 760px); min-height: 460px; }
      .toolbar { align-items: stretch; flex-direction: column; gap: 7px; }
      .floor-select select { width: 100%; }
      .toolbar-actions { padding-bottom: 2px; }
      .inspector {
        top: auto;
        right: 8px;
        bottom: 8px;
        left: 8px;
        width: auto;
        max-height: 45%;
        overflow: auto;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
    }
  `;
let X = V;
const Z = class Z extends I {
  constructor() {
    super(...arguments), this.hass = qt, this._config = {
      type: "custom:spatial-presence-card",
      ...X.getStubConfig()
    }, this._radarPrefix = "", this._mapId = "house", this._storageStatus = "";
  }
  setConfig(t) {
    this._config = z(t), this._mapId = t.backend_map_id ?? "house";
  }
  render() {
    return f`
      <div class="editor-fields">
        <label>
          <span>Card title</span>
          <input .value=${this._config.title ?? ""} @input=${this._titleChanged} />
        </label>
        <label>
          <span>Floor name</span>
          <input .value=${this._activeFloor?.name ?? ""} @change=${this._floorNameChanged} />
        </label>
        <label>
          <span>Background image URL</span>
          <input
            placeholder="/local/floorplans/main.svg"
            .value=${this._activeFloor?.background ?? ""}
            @change=${this._backgroundChanged}
          />
        </label>
        <label>
          <span>Scale (canvas pixels per metre)</span>
          <input
            type="number"
            min="1"
            step="1"
            .value=${String(this._activeFloor?.pixels_per_meter ?? 100)}
            @change=${this._scaleChanged}
          />
        </label>
        <label>
          <span>Radar entity prefix</span>
          <input
            placeholder="ld2450_presence"
            .value=${this._radarPrefix}
            @input=${(t) => this._radarPrefix = t.target.value}
          />
        </label>
        <label>
          <span>Saved map id</span>
          <input
            pattern="[a-z0-9][a-z0-9_-]{0,63}"
            .value=${this._mapId}
            @input=${(t) => this._mapId = t.target.value}
          />
        </label>
        <div class="editor-actions">
          <button type="button" @click=${this._addRadar}>Add radar</button>
          <button type="button" @click=${this._addFloor}>Add floor</button>
          ${this._config.floors.length > 1 ? f`<button type="button" class="danger" @click=${this._removeFloor}>Remove floor</button>` : d}
          <button type="button" @click=${this._exportMap}>Export JSON</button>
          <button type="button" @click=${this._exportEasyFloorplan}>Export for Easy Floorplan</button>
          <button type="button" @click=${this._saveBackend}>Save map</button>
          <button type="button" @click=${this._loadBackend}>Load saved</button>
          <button type="button" @click=${this._restoreBackend}>Restore previous</button>
          <label class="file-button">
            Import JSON
            <input type="file" accept="application/json,.json" @change=${this._importMap} />
          </label>
        </div>
        ${this._storageStatus ? f`<p class="storage-status" role="status">${this._storageStatus}</p>` : d}
      </div>
      <spatial-presence-card
        .hass=${this.hass}
        .editorMode=${!0}
        ._config=${this._config}
        @spatial-config-changed=${this._mapChanged}
        @spatial-floor-changed=${this._floorChanged}
      ></spatial-presence-card>
    `;
  }
  updated() {
    this.renderRoot.querySelector(
      "spatial-presence-card"
    )?.setConfig(this._config);
  }
  _titleChanged(t) {
    this._commit({
      ...this._config,
      title: t.target.value
    });
  }
  _backgroundChanged(t) {
    const e = this._activeFloor;
    if (!e) return;
    const s = t.target.value.trim(), r = { ...e };
    s && Vt(s) ? r.background = s : delete r.background, this._replaceFloor(r);
  }
  _floorNameChanged(t) {
    const e = this._activeFloor, s = t.target.value.trim();
    e && s && this._replaceFloor({ ...e, name: s });
  }
  _scaleChanged(t) {
    const e = this._activeFloor;
    if (!e) return;
    const s = Number(t.target.value);
    Number.isFinite(s) && s > 0 && this._replaceFloor({ ...e, pixels_per_meter: s });
  }
  _addFloor() {
    const t = this._config.floors.length + 1, e = Xt(`floor-${t}`, `Floor ${t}`);
    this._commit({
      ...this._config,
      floors: [...this._config.floors, e],
      default_floor: e.id
    });
  }
  _removeFloor() {
    const t = this._activeFloor;
    if (!t || this._config.floors.length <= 1) return;
    const e = this._config.floors.filter((s) => s.id !== t.id);
    this._commit({ ...this._config, floors: e, default_floor: e[0].id });
  }
  _addRadar() {
    const t = this._activeFloor, e = this._radarPrefix.trim();
    if (!t || !e) return;
    const r = {
      id: Ie(e.replace(/[^a-z0-9_]+/gi, "_"), t.sensors ?? []),
      name: e.split("_").map((o) => o[0]?.toUpperCase() + o.slice(1)).join(" "),
      entity_prefix: e,
      x: t.width / 2,
      y: t.height * 0.85,
      heading: 0,
      range_m: 6,
      fov_degrees: 120,
      mount: "wall"
    };
    this._replaceFloor({ ...t, sensors: [...t.sensors ?? [], r] }), this._radarPrefix = "", this.requestUpdate();
  }
  _floorChanged(t) {
    t.stopPropagation(), this._commit({ ...this._config, default_floor: t.detail.floorId });
  }
  _exportMap() {
    zt(jt(this._config), "spatial-presence-map.json");
  }
  _exportEasyFloorplan() {
    zt(
      Me(this._config),
      "spatial-presence-easy-floorplan.json"
    );
  }
  async _importMap(t) {
    const e = t.target, s = e.files?.[0];
    if (!(!s || s.size > 2e6))
      try {
        const r = JSON.parse(await s.text());
        let o, n = [];
        if (r.schema_version === "0.1" && Array.isArray(r.floors))
          o = z({
            ...r,
            type: "custom:spatial-presence-card"
          });
        else if (String(r.type ?? "").includes("easy-floorplan") || Array.isArray(r.areas) || Array.isArray(r.walls)) {
          const l = Ee(r);
          o = z({
            ...l.map,
            type: "custom:spatial-presence-card"
          }), n = l.warnings;
        } else if (Pt(r.maps) || Pt(r.radars)) {
          const l = Ce(r);
          o = z({
            ...l.map,
            type: "custom:spatial-presence-card"
          }), n = l.warnings;
        } else
          throw new Error("Use a Spatial Presence, Easy Floorplan or Radar Map Manager JSON file");
        this._commit(o), this._storageStatus = n.length ? `Imported with ${n.length} review note${n.length === 1 ? "" : "s"}: ${n.join(" ")}` : "Map imported.";
      } catch (r) {
        this._storageStatus = `Map was not imported: ${Y(r)}`;
      } finally {
        e.value = "";
      }
  }
  async _saveBackend() {
    if (!this._validMapId) {
      this._storageStatus = "Use lowercase letters, numbers, underscores or hyphens for the map id.";
      return;
    }
    this._storageStatus = "Saving map…";
    try {
      const t = await ve(this.hass, this._mapId, this._config);
      this._commit({ ...this._config, backend_map_id: this._mapId }), this._storageStatus = `Saved revision ${t.revision}.`;
    } catch (t) {
      this._storageStatus = `Map was not saved: ${Y(t)}`;
    }
  }
  async _loadBackend() {
    if (!this._validMapId) {
      this._storageStatus = "Enter a valid saved map id first.";
      return;
    }
    this._storageStatus = "Loading map…";
    try {
      const t = await $e(this.hass, this._mapId);
      this._commit(
        z({
          ...t.config,
          type: "custom:spatial-presence-card",
          backend_map_id: this._mapId
        })
      ), this._storageStatus = `Loaded revision ${t.revision}.`;
    } catch (t) {
      this._storageStatus = `Map was not loaded: ${Y(t)}`;
    }
  }
  async _restoreBackend() {
    if (!this._validMapId) {
      this._storageStatus = "Enter a valid saved map id first.";
      return;
    }
    this._storageStatus = "Restoring previous revision…";
    try {
      await be(this.hass, this._mapId), await this._loadBackend();
    } catch (t) {
      this._storageStatus = `Previous revision was not restored: ${Y(t)}`;
    }
  }
  _replaceFloor(t) {
    this._commit({
      ...this._config,
      floors: this._config.floors.map(
        (e) => e.id === t.id ? t : e
      )
    });
  }
  _mapChanged(t) {
    t.stopPropagation(), this._commit(t.detail);
  }
  _commit(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  get _activeFloor() {
    return this._config.floors.find(
      (t) => t.id === this._config.default_floor
    ) ?? this._config.floors[0];
  }
  get _validMapId() {
    return /^[a-z0-9][a-z0-9_-]{0,63}$/.test(this._mapId);
  }
};
Z.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 }
}, Z.styles = Rt`
    :host { display: grid; gap: 16px; }
    .editor-fields {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      align-items: end;
    }
    label { display: grid; gap: 6px; min-width: 0; }
    label span { color: var(--secondary-text-color); font-size: 13px; }
    input, button {
      min-height: 40px;
      box-sizing: border-box;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 0 11px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    button { cursor: pointer; }
    .editor-actions {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .storage-status {
      grid-column: 1 / -1;
      margin: 0;
      padding: 9px 11px;
      border-left: 3px solid #00a7a5;
      background: color-mix(in srgb, #00a7a5 9%, transparent);
      font-size: 13px;
    }
    .danger { color: var(--error-color, #b3261e); }
    .file-button {
      min-height: 40px;
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 0 11px;
      cursor: pointer;
    }
    .file-button input { display: none; }
    @media (max-width: 760px) {
      .editor-fields { grid-template-columns: 1fr; }
    }
  `;
let nt = Z;
function z(i) {
  return {
    ...i,
    type: i.type || "custom:spatial-presence-card",
    schema_version: "0.1",
    auto_discover: i.auto_discover !== !1,
    target_trail_seconds: i.target_trail_seconds ?? 8,
    floors: i.floors.map((t) => {
      const e = {
        ...t,
        pixels_per_meter: t.pixels_per_meter || 100,
        walls: t.walls ?? [],
        rooms: t.rooms ?? [],
        zones: t.zones ?? [],
        sensors: t.sensors ?? []
      };
      return e.background && !Vt(e.background) && delete e.background, e;
    })
  };
}
function Xt(i = "main", t = "Main floor") {
  return {
    id: i,
    name: t,
    width: 1200,
    height: 800,
    pixels_per_meter: 100,
    walls: [],
    rooms: [],
    zones: [],
    sensors: []
  };
}
function Ie(i, t) {
  const e = i || "radar";
  if (!t.some((r) => r.id === e)) return e;
  let s = 2;
  for (; t.some((r) => r.id === `${e}_${s}`); ) s += 1;
  return `${e}_${s}`;
}
function Vt(i) {
  return /^(\/|https?:\/\/)/i.test(i.trim());
}
function Y(i) {
  return i instanceof Error ? i.message : String(i);
}
function Pt(i) {
  return typeof i == "object" && i !== null && !Array.isArray(i);
}
function zt(i, t) {
  const e = JSON.stringify(i, null, 2), s = URL.createObjectURL(new Blob([e], { type: "application/json" })), r = document.createElement("a");
  r.href = s, r.download = t, r.click(), URL.revokeObjectURL(s);
}
customElements.get("spatial-presence-card") || customElements.define("spatial-presence-card", X);
customElements.get("spatial-presence-card-editor") || customElements.define("spatial-presence-card-editor", nt);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "spatial-presence-card",
  name: "Spatial Presence",
  description: "Draw floors and place live mmWave radar targets.",
  preview: !0,
  documentationURL: "https://github.com/daredoole/spatial-presence"
});
console.info(
  `%c SPATIAL PRESENCE %c ${ze} `,
  "color:white;background:#14232b;font-weight:700;padding:3px 5px",
  "color:#14232b;background:#f2a93b;font-weight:700;padding:3px 5px"
);
export {
  X as SpatialPresenceCard,
  nt as SpatialPresenceCardEditor
};
//# sourceMappingURL=spatial-presence-card.js.map
