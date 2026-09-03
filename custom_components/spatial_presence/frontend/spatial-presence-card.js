const q = globalThis, at = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lt = /* @__PURE__ */ Symbol(), ft = /* @__PURE__ */ new WeakMap();
let Rt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== lt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (at && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = ft.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && ft.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Kt = (r) => new Rt(typeof r == "string" ? r : r + "", void 0, lt), Tt = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((s, i, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[o + 1], r[0]);
  return new Rt(e, r, lt);
}, Qt = (r, t) => {
  if (at) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = q.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, r.appendChild(s);
  }
}, mt = at ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return Kt(e);
})(r) : r;
const { is: Gt, defineProperty: te, getOwnPropertyDescriptor: ee, getOwnPropertyNames: se, getOwnPropertySymbols: ie, getPrototypeOf: re } = Object, Q = globalThis, _t = Q.trustedTypes, oe = _t ? _t.emptyScript : "", ne = Q.reactiveElementPolyfillSupport, U = (r, t) => r, ot = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? oe : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, t) {
  let e = r;
  switch (t) {
    case Boolean:
      e = r !== null;
      break;
    case Number:
      e = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(r);
      } catch {
        e = null;
      }
  }
  return e;
} }, Nt = (r, t) => !Gt(r, t), bt = { attribute: !0, type: String, converter: ot, reflect: !1, useDefault: !1, hasChanged: Nt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Q.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = bt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && te(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: o } = ee(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const l = i?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? bt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const t = re(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const e = this.properties, s = [...se(e), ...ie(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(mt(i));
    } else t !== void 0 && e.push(mt(t));
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
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : ot).toAttribute(e, s.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const o = s.getPropertyOptions(i), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : ot;
      this._$Em = i;
      const l = n.fromAttribute(e, o.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (o = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? Nt)(o, e) || s.useDefault && s.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, o] of s) {
        const { wrapped: n } = o, l = this[i];
        n !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, o, l);
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
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[U("elementProperties")] = /* @__PURE__ */ new Map(), P[U("finalized")] = /* @__PURE__ */ new Map(), ne?.({ ReactiveElement: P }), (Q.reactiveElementVersions ??= []).push("2.1.2");
const ct = globalThis, $t = (r) => r, W = ct.trustedTypes, vt = W ? W.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Ft = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + k, ae = `<${Ut}>`, C = document, D = () => C.createComment(""), L = (r) => r === null || typeof r != "object" && typeof r != "function", dt = Array.isArray, le = (r) => dt(r) || typeof r?.[Symbol.iterator] == "function", st = `[ 	
\f\r]`, N = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, yt = /-->/g, xt = />/g, M = RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wt = /'/g, kt = /"/g, Ot = /^(?:script|style|textarea|title)$/i, Ht = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), u = Ht(1), _ = Ht(2), R = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), At = /* @__PURE__ */ new WeakMap(), E = C.createTreeWalker(C, 129);
function Dt(r, t) {
  if (!dt(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return vt !== void 0 ? vt.createHTML(t) : t;
}
const ce = (r, t) => {
  const e = r.length - 1, s = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = N;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let h, p, c = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, p = n.exec(a), p !== null); ) f = n.lastIndex, n === N ? p[1] === "!--" ? n = yt : p[1] !== void 0 ? n = xt : p[2] !== void 0 ? (Ot.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = M) : p[3] !== void 0 && (n = M) : n === M ? p[0] === ">" ? (n = i ?? N, c = -1) : p[1] === void 0 ? c = -2 : (c = n.lastIndex - p[2].length, h = p[1], n = p[3] === void 0 ? M : p[3] === '"' ? kt : wt) : n === kt || n === wt ? n = M : n === yt || n === xt ? n = N : (n = M, i = void 0);
    const m = n === M && r[l + 1].startsWith("/>") ? " " : "";
    o += n === N ? a + ae : c >= 0 ? (s.push(h), a.slice(0, c) + Ft + a.slice(c) + k + m) : a + k + (c === -2 ? l : m);
  }
  return [Dt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class j {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [h, p] = ce(t, e);
    if (this.el = j.createElement(h, s), E.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = E.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(Ft)) {
          const f = p[n++], m = i.getAttribute(c).split(k), y = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: y[2], strings: m, ctor: y[1] === "." ? pe : y[1] === "?" ? he : y[1] === "@" ? ue : G }), i.removeAttribute(c);
        } else c.startsWith(k) && (a.push({ type: 6, index: o }), i.removeAttribute(c));
        if (Ot.test(i.tagName)) {
          const c = i.textContent.split(k), f = c.length - 1;
          if (f > 0) {
            i.textContent = W ? W.emptyScript : "";
            for (let m = 0; m < f; m++) i.append(c[m], D()), E.nextNode(), a.push({ type: 2, index: ++o });
            i.append(c[f], D());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ut) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(k, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += k.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const s = C.createElement("template");
    return s.innerHTML = t, s;
  }
}
function T(r, t, e = r, s) {
  if (t === R) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const o = L(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(r), i._$AT(r, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = T(r, i._$AS(r, t.values), i, s)), t;
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
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? C).importNode(e, !0);
    E.currentNode = i;
    let o = E.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new B(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new ge(o, this, t)), this._$AV.push(h), a = s[++l];
      }
      n !== a?.index && (o = E.nextNode(), n++);
    }
    return E.currentNode = C, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    t = T(this, t, e), L(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== R && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : le(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && L(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = j.createElement(Dt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const o = new de(i, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = At.get(t.strings);
    return e === void 0 && At.set(t.strings, e = new j(t)), e;
  }
  k(t) {
    dt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const o of t) i === e.length ? e.push(s = new B(this.O(D()), this.O(D()), this, this.options)) : s = e[i], s._$AI(o), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
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
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, i) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = T(this, t, e, 0), n = !L(t) || t !== this._$AH && t !== R, n && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = T(this, l[s + a], e, a), h === R && (h = this._$AH[a]), n ||= !L(h) || h !== this._$AH[a], h === d ? t = d : t !== d && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class pe extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class he extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class ue extends G {
  constructor(t, e, s, i, o) {
    super(t, e, s, i, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = T(this, t, e, 0) ?? d) === R) return;
    const s = this._$AH, i = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, o = t !== d && (s === d || i);
    i && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
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
fe?.(j, B), (ct.litHtmlVersions ??= []).push("3.3.3");
const me = (r, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const o = e?.renderBefore ?? null;
    s._$litPart$ = i = new B(t.insertBefore(D(), o), o, void 0, e ?? {});
  }
  return i._$AI(r), i;
};
const pt = globalThis;
class z extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = me(e, this.renderRoot, this.renderOptions);
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
z._$litElement$ = !0, z.finalized = !0, pt.litElementHydrateSupport?.({ LitElement: z });
const _e = pt.litElementPolyfillSupport;
_e?.({ LitElement: z });
(pt.litElementVersions ??= []).push("4.2.2");
function ht(r, t) {
  return r.callWS ? r.callWS(t) : Promise.reject(
    new Error("Spatial Presence integration is not connected")
  );
}
function be(r, t) {
  return ht(r, { type: "spatial_presence/map/get", map_id: t });
}
function $e(r, t, e) {
  const s = Lt(e);
  return ht(r, {
    type: "spatial_presence/map/save",
    map_id: t,
    title: e.title ?? t,
    config: { ...s, schema_version: "0.1" }
  });
}
function Lt(r) {
  const { type: t, backend_map_id: e, ...s } = r;
  return { ...s, schema_version: "0.1" };
}
function ve(r, t) {
  return ht(r, {
    type: "spatial_presence/map/restore_previous",
    map_id: t
  });
}
const ut = Math.PI / 180;
function X(r) {
  return (r % 360 + 360) % 360;
}
function ye(r, t, e, s) {
  const i = s / 1e3, o = t * i, n = -e * i, l = X(r.heading) * ut;
  return {
    x: r.x + o * Math.cos(l) - n * Math.sin(l),
    y: r.y + o * Math.sin(l) + n * Math.cos(l)
  };
}
function xe(r, t, e, s) {
  const i = Math.hypot(t, e), o = Math.hypot(s.x - r.x, s.y - r.y);
  if (i < 100 || o < 1) return;
  const n = Math.atan2(-e, t), l = Math.atan2(s.y - r.y, s.x - r.x);
  return {
    heading: X((l - n) / ut),
    pixelsPerMeter: o * 1e3 / i
  };
}
function it(r, t, e = 1) {
  const s = (r.range_m ?? 6) * t * e, i = (r.fov_degrees ?? 120) / 2, o = St(r, s, -i), n = St(r, s, i), l = i * 2 > 180 ? 1 : 0;
  return [
    `M ${w(r.x)} ${w(r.y)}`,
    `L ${w(o.x)} ${w(o.y)}`,
    `A ${w(s)} ${w(s)} 0 ${l} 1 ${w(n.x)} ${w(n.y)}`,
    "Z"
  ].join(" ");
}
function St(r, t, e) {
  const s = (r.heading + e - 90) * ut;
  return {
    x: r.x + t * Math.cos(s),
    y: r.y + t * Math.sin(s)
  };
}
function w(r) {
  return Math.round(r * 100) / 100;
}
function we(r, t, e, s) {
  const i = Mt(r.width * e, s.width * 0.08, s.width * 4), o = Mt(
    r.height * e,
    s.height * 0.08,
    s.height * 4
  ), n = (t.x - r.x) / r.width, l = (t.y - r.y) / r.height;
  return {
    x: t.x - n * i,
    y: t.y - l * o,
    width: i,
    height: o
  };
}
function F(r) {
  return r.map((t) => `${t.x},${t.y}`).join(" ");
}
function rt(r, t, e, s) {
  return {
    x: s.x + (r - e.left) / e.width * s.width,
    y: s.y + (t - e.top) / e.height * s.height
  };
}
function Mt(r, t, e) {
  return Math.min(e, Math.max(t, r));
}
const ke = /^sensor\.(.+)_target_([1-9]\d*)_x$/;
function Ae(r) {
  const t = /* @__PURE__ */ new Set();
  for (const e of Object.keys(r.states)) {
    const s = ke.exec(e);
    if (!s) continue;
    const i = s[1], o = s[2];
    i && o && r.states[`sensor.${i}_target_${o}_y`] && t.add(i);
  }
  return [...t].sort();
}
function Et(r, t, e = !0, s = Date.now()) {
  const i = [...t.sensors ?? []], o = new Set(
    i.map((n) => n.entity_prefix ?? n.id)
  );
  if (e)
    for (const n of Ae(r))
      o.has(n) || i.push({
        id: n,
        name: jt(n),
        entity_prefix: n,
        x: t.width / 2,
        y: t.height * 0.85,
        heading: 0,
        range_m: 6,
        fov_degrees: 120,
        mount: "wall"
      });
  return i.map((n) => Se(r, t, n, s));
}
function Se(r, t, e, s) {
  const i = e.entity_prefix ?? e.id, o = [];
  for (let a = 1; a <= 9; a += 1) {
    const h = r.states[`sensor.${i}_target_${a}_x`], p = r.states[`sensor.${i}_target_${a}_y`];
    if (!h || !p) continue;
    const c = Ct(h), f = Ct(p), m = Ee(
      r.states[`sensor.${i}_target_${a}_speed`]
    );
    c === void 0 || f === void 0 || c === 0 && f === 0 || o.push({
      id: `${e.id}:${a}`,
      sensorId: e.id,
      sensorName: e.name ?? jt(i),
      index: a,
      localXmm: c,
      localYmm: f,
      ...m === void 0 ? {} : { speedMmPerSecond: m },
      floorPoint: ye(
        e,
        c,
        f,
        t.pixels_per_meter
      ),
      updatedAt: s
    });
  }
  const n = V(r.states[`sensor.${i}_temperature`]), l = V(r.states[`sensor.${i}_humidity`]);
  return {
    sensor: e,
    targets: o,
    ...n === void 0 ? {} : { temperature: n },
    ...l === void 0 ? {} : { humidity: l },
    online: Me(r, i),
    discovered: !(t.sensors ?? []).some((a) => a.id === e.id)
  };
}
function Me(r, t) {
  const e = r.states[`binary_sensor.${t}_online`] ?? r.states[`binary_sensor.${t}_status`];
  if (e) return e.state === "on";
  const s = r.states[`binary_sensor.${t}_presence`];
  return s ? !["unavailable", "unknown"].includes(s.state) : !0;
}
function Ct(r) {
  const t = V(r);
  if (t === void 0) return;
  const e = String(r.attributes.unit_of_measurement ?? "mm").toLowerCase();
  return e === "m" ? t * 1e3 : e === "cm" ? t * 10 : t;
}
function Ee(r) {
  if (!r) return;
  const t = V(r);
  if (t === void 0) return;
  const e = String(r.attributes.unit_of_measurement ?? "mm/s").toLowerCase();
  return e === "m/s" ? t * 1e3 : e === "cm/s" ? t * 10 : e === "in/s" ? t * 25.4 : e === "ft/s" ? t * 304.8 : e === "mph" ? t * 447.04 : t;
}
function V(r) {
  if (!r || ["unknown", "unavailable"].includes(r.state)) return;
  const t = Number(r.state);
  return Number.isFinite(t) ? t : void 0;
}
function jt(r) {
  return r.split("_").filter(Boolean).map((t) => t[0]?.toUpperCase() + t.slice(1)).join(" ");
}
function Ce(r, t = 100) {
  if (!$(r)) throw new Error("Easy Floorplan configuration must be an object");
  const e = r, s = O(e.width, 1e3), i = O(e.height, 700), o = Array.isArray(e.floors) && e.floors.length ? e.floors : [e], n = [], l = /* @__PURE__ */ new Set(), a = o.map((c, f) => {
    const m = H(c.id ?? `floor-${f + 1}`, l), y = /* @__PURE__ */ new Set(), tt = /* @__PURE__ */ new Set(), et = (c.walls ?? []).flatMap((g, v) => [g.x1, g.y1, g.x2, g.y2].every(A) ? [{
      id: H(String(g.id ?? `wall-${v + 1}`), y),
      points: [
        { x: Number(g.x1), y: Number(g.y1) },
        { x: Number(g.x2), y: Number(g.y2) }
      ]
    }] : (n.push(`${m}: skipped wall ${g.id ?? v + 1} with invalid coordinates`), [])), gt = (c.areas ?? []).flatMap((g, v) => {
      const b = Bt(g.points);
      return b.length < 3 ? (n.push(`${m}: skipped area ${g.id ?? v + 1} with fewer than three points`), []) : [{
        id: H(String(g.id ?? `room-${v + 1}`), tt),
        ...g.name ? { name: g.name } : {},
        ...g.haArea ? { area_id: g.haArea } : {},
        points: b
      }];
    });
    for (const g of ["openings", "items", "texts", "furniture", "trackers"]) {
      const v = c[g]?.length ?? 0;
      v && n.push(`${m}: ${v} ${g} retained only by Easy Floorplan`);
    }
    return {
      id: m,
      name: c.name ?? `Floor ${f + 1}`,
      width: s,
      height: i,
      pixels_per_meter: O(t, 100),
      ...qt(c.image) ? { background: c.image } : {},
      walls: et,
      rooms: gt,
      zones: [],
      sensors: []
    };
  });
  n.unshift("Easy Floorplan has no physical scale; verify pixels per metre after import");
  const h = o.findIndex(
    (c) => c.id === e.defaultFloor
  ), p = a[Math.max(0, h)]?.id ?? a[0].id;
  return {
    map: {
      schema_version: "0.1",
      title: e.title ?? "Imported Easy Floorplan",
      default_floor: p,
      auto_discover: !0,
      target_trail_seconds: 8,
      floors: a
    },
    warnings: n
  };
}
function Pe(r) {
  const t = r.floors[0];
  if (!t) throw new Error("Spatial map has no floors");
  return {
    type: "custom:easy-floorplan-card",
    title: r.title,
    width: t.width,
    height: t.height,
    defaultFloor: r.default_floor,
    floors: r.floors.map((e) => ({
      id: e.id,
      name: e.name,
      ...e.background ? { image: e.background, imageFit: "contain" } : {},
      walls: (e.walls ?? []).flatMap(
        (s) => s.points.slice(0, -1).map((i, o) => {
          const n = s.points[o + 1];
          return {
            id: `${s.id}-${o + 1}`,
            x1: i.x,
            y1: i.y,
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
function Ie(r) {
  if (!$(r)) throw new Error("Radar Map Manager backup must be an object");
  const t = $(r.maps) ? r.maps : {}, e = Object.keys(t).length ? t : { default: {} }, s = $(r.radars) ? r.radars : {}, i = [
    "Radar Map Manager uses percentage coordinates; verify floor scale and background alignment",
    "Fusion and smoothing settings stay in Radar Map Manager and are not imported"
  ], o = /* @__PURE__ */ new Set();
  return {
    map: {
      schema_version: "0.1",
      title: "Imported Radar Map Manager map",
      auto_discover: !0,
      target_trail_seconds: 8,
      floors: Object.entries(e).map(([l, a], h) => {
        const p = $(a) ? a : {}, c = $(p.config) ? p.config : {}, f = 1e3, m = 1e3, y = /* @__PURE__ */ new Set(), tt = Object.entries(s).flatMap(([b, x]) => {
          if (!$(x) || String(x.map_group ?? "default") !== l) return [];
          const S = $(x.layout) ? x.layout : {}, Zt = O(S.scale_x, 5), Jt = O(S.scale_y, 5);
          return Math.abs(Zt - Jt) > 0.01 && i.push(`${l}/${b}: non-uniform RMM scale requires manual calibration`), Array.isArray(x.monitor_zones) && x.monitor_zones.length && i.push(`${l}/${b}: radar-local monitor zones require manual review`), [{
            id: H(b, y),
            name: b,
            entity_prefix: Yt(b),
            x: Pt(S.origin_x, 50) * f,
            y: Pt(S.origin_y, 50) * m,
            heading: A(S.rotation) ? Number(S.rotation) : 0,
            range_m: 6,
            fov_degrees: 120,
            mount: S.ceiling_mount ? "ceiling" : "wall"
          }];
        }), et = $(p.zones) ? p.zones : {}, g = [
          ["include_zones", "detection"],
          ["exclude_zones", "exclusion"],
          ["entrance_zones", "entrance"],
          ["stationary_zones", "stationary"]
        ].flatMap(
          ([b, x]) => ze(et[b], b, f, m, x, i)
        ), v = [c.bg_image, c.background_image, c.background].find((b) => qt(b));
        return {
          id: H(l || `floor-${h + 1}`, o),
          name: l === "default" ? "Main floor" : l,
          width: f,
          height: m,
          pixels_per_meter: 100,
          ...typeof v == "string" ? { background: v } : {},
          walls: [],
          rooms: [],
          zones: g,
          sensors: tt
        };
      })
    },
    warnings: i
  };
}
function ze(r, t, e, s, i, o) {
  return Array.isArray(r) ? r.flatMap((n, l) => {
    const a = $(n) && Array.isArray(n.points) ? n.points : n, h = Bt(a).map((p) => ({
      x: Math.abs(p.x) <= 100 ? p.x / 100 * e : p.x,
      y: Math.abs(p.y) <= 100 ? p.y / 100 * s : p.y
    }));
    return h.length < 3 ? (o.push(`${t}[${l}]: skipped zone with fewer than three points`), []) : [{
      id: `${t}-${l + 1}`,
      name: $(n) && typeof n.name == "string" ? n.name : `${i} ${l + 1}`,
      kind: i,
      points: h
    }];
  }) : [];
}
function Bt(r) {
  return Array.isArray(r) ? r.flatMap((t) => Array.isArray(t) && A(t[0]) && A(t[1]) ? [{ x: Number(t[0]), y: Number(t[1]) }] : $(t) && A(t.x) && A(t.y) ? [{ x: Number(t.x), y: Number(t.y) }] : []) : [];
}
function $(r) {
  return typeof r == "object" && r !== null && !Array.isArray(r);
}
function A(r) {
  return typeof r == "number" && Number.isFinite(r);
}
function O(r, t) {
  return A(r) && Number(r) > 0 ? Number(r) : t;
}
function Pt(r, t) {
  const e = A(r) ? Number(r) : t;
  return Math.max(0, Math.min(100, e)) / 100;
}
function Yt(r) {
  return r.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "item";
}
function H(r, t) {
  const e = Yt(r);
  let s = e, i = 2;
  for (; t.has(s); ) s = `${e}_${i++}`;
  return t.add(s), s;
}
function qt(r) {
  return typeof r == "string" && /^(\/|https?:\/\/)/i.test(r.trim());
}
const Re = "0.1.0-alpha.6", Wt = { states: {} }, J = class J extends z {
  constructor() {
    super(...arguments), this.hass = Wt, this.editorMode = !1, this._floorId = "", this._view = { x: 0, y: 0, width: 1200, height: 800 }, this._tool = "pan", this._draftPoints = [], this._showCoverage = !0, this._showTrails = !0, this._pointerMoved = !1, this._trails = /* @__PURE__ */ new Map(), this._fit = () => {
      const t = this._floor;
      t && (this._view = { x: 0, y: 0, width: t.width, height: t.height });
    }, this._cancelCalibration = () => {
      this._calibration = void 0;
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
      stationary_hold_seconds: 30,
      floors: [Xt()]
    };
  }
  setConfig(t) {
    if (!Array.isArray(t.floors) || t.floors.length === 0)
      throw new Error("Add at least one floor to Spatial Presence.");
    this._config = I(t);
    const e = t.default_floor;
    (!this._floorId || !this._config.floors.some((s) => s.id === this._floorId)) && (this._floorId = (e && this._config.floors.some((s) => s.id === e) ? e : this._config.floors[0]?.id) ?? "", this._fit());
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return { rows: 6, columns: 12, min_rows: 4 };
  }
  updated(t) {
    t.has("hass") && this._captureTrails();
  }
  render() {
    const t = this._config, e = this._floor;
    if (!t || !e)
      return u`<ha-card><p class="empty">Add a floor to begin.</p></ha-card>`;
    const s = Et(
      this.hass,
      e,
      t.auto_discover !== !1
    ), i = s.find(
      (l) => l.sensor.id === this._selectedSensorId
    ), o = s.reduce(
      (l, a) => l + a.targets.length,
      0
    ), n = s.filter((l) => l.online).length;
    return u`
      <ha-card>
        <section class="shell" aria-label=${t.title ?? "Spatial presence"}>
          ${this._renderToolbar(
      t,
      e,
      o,
      n,
      s.length
    )}
          <div class="workspace">
            ${this._renderMap(e, s)}
            ${i ? this._renderInspector(i, e) : d}
          </div>
          ${this.editorMode ? this._renderEditorHint() : d}
        </section>
      </ha-card>
    `;
  }
  _renderToolbar(t, e, s, i, o) {
    return u`
      <header class="toolbar">
        <label class="floor-select">
          <span class="sr-only">Floor</span>
          <select @change=${this._changeFloor} .value=${e.id}>
            ${t.floors.map(
      (n) => u`<option value=${n.id}>${n.name}</option>`
    )}
          </select>
        </label>
        <div class="live-summary" aria-live="polite">
          <span class="target-swatch" aria-hidden="true"></span>
          <strong>${s}</strong>
          <span>${s === 1 ? "live target" : "live targets"}</span>
          <span class="summary-divider" aria-hidden="true"></span>
          <span>${i}/${o} ${o === 1 ? "radar" : "radars"} online</span>
        </div>
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
          ${this.editorMode ? u`
                <span class="tool-separator" aria-hidden="true"></span>
                ${this._toolButton("pan", "Move")}
                ${this._toolButton("wall", "Draw wall")}
                ${this._toolButton("room", "Draw room")}
                ${this._toolButton("zone", "Draw zone")}
                ${this._draftPoints.length > 0 ? u`<button type="button" class="commit" @click=${this._finishDrawing}>
                      Finish ${this._tool}
                    </button>` : d}
              ` : d}
        </div>
      </header>
    `;
  }
  _toolButton(t, e) {
    return u`<button
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
    return u`
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
          ${t.background ? _`<image
                class="background"
                href=${t.background}
                width=${t.width}
                height=${t.height}
                preserveAspectRatio="xMidYMid meet"
              ></image>` : d}
          <g class="rooms">${(t.rooms ?? []).map((i) => this._renderRoom(i))}</g>
          <g class="zones">${(t.zones ?? []).map((i) => this._renderZone(i))}</g>
          <g class="walls">${(t.walls ?? []).map((i) => this._renderWall(i))}</g>
          ${this._showCoverage ? _`<g class="coverage">${e.map((i) => this._renderCoverage(i, t))}</g>` : d}
          ${this._showTrails ? this._renderTrails() : d}
          <g class="targets">
            ${e.flatMap(
      (i) => i.targets.map((o) => this._renderTarget(o))
    )}
          </g>
          <g class="sensors">
            ${e.map((i) => this._renderSensor(i))}
          </g>
          ${this._draftPoints.length ? _`<polyline class="draft" points=${F(this._draftPoints)}></polyline>
                ${this._draftPoints.map(
      (i) => _`<circle class="draft-point" cx=${i.x} cy=${i.y} r="6"></circle>`
    )}` : d}
        </svg>
        ${e.length === 0 ? u`<div class="map-empty">
              <strong>No compatible radar found</strong>
              <span>Add an LD2450 sensor or configure an entity prefix.</span>
            </div>` : d}
      </div>
    `;
  }
  _renderRoom(t) {
    return _`
      <polygon points=${F(t.points)}></polygon>
      ${t.name && t.points[0] ? _`<text x=${t.points[0].x + 12} y=${t.points[0].y + 24}>${t.name}</text>` : d}
    `;
  }
  _renderZone(t) {
    return _`<polygon points=${F(t.points)}></polygon>`;
  }
  _renderWall(t) {
    return _`<polyline points=${F(t.points)}></polyline>`;
  }
  _renderCoverage(t, e) {
    const s = t.sensor;
    return _`
      <path class="coverage-fringe" d=${it(s, e.pixels_per_meter, 1)}></path>
      <path class="coverage-usable" d=${it(s, e.pixels_per_meter, 0.72)}></path>
      <path class="coverage-strong" d=${it(s, e.pixels_per_meter, 0.4)}></path>
    `;
  }
  _renderTrails() {
    const t = Date.now() - (this._config?.target_trail_seconds ?? 8) * 1e3, e = [...this._trails.entries()].map(([s, i]) => {
      const o = i.filter((n) => n.updatedAt >= t);
      return o.length > 1 ? _`<polyline class="trail" data-track=${s} points=${F(
        o.map((n) => n.floorPoint)
      )}></polyline>` : d;
    });
    return _`<g class="trails">${e}</g>`;
  }
  _renderTarget(t) {
    const e = this._targetMotion(t), s = e.moving ? "moving" : "stationary", i = t.speedMmPerSecond === void 0 ? "" : ` at ${(Math.abs(t.speedMmPerSecond) / 1e3).toFixed(1)} metres per second`;
    return _`
      <g
        class="target ${e.moving ? "moving" : "stationary"}"
        data-motion=${s}
        data-speed-mm-s=${t.speedMmPerSecond ?? "unknown"}
        style="transform: translate(${t.floorPoint.x}px, ${t.floorPoint.y}px); --walk-cycle: ${e.cycleSeconds}s; --motion-cycle: ${e.cycleSeconds * 2}s"
        role="img"
        aria-label="Target ${t.index}, ${s}${i}"
      >
        <title>Target ${t.index} · ${s}${i}</title>
        <circle class="target-halo" r="40"></circle>
        ${e.moving ? _`<circle class="motion-ring" r="34"></circle>` : d}
        <circle class="target-disc" r="27"></circle>
        <g class="person-body" aria-hidden="true">
          <circle class="person-head" cy="-12" r="5"></circle>
          <path class="person-torso" d="M 0 -6 L 0 8"></path>
          <path class="person-arm person-arm-left" d="M 0 -2 L -9 6"></path>
          <path class="person-arm person-arm-right" d="M 0 -2 L 9 6"></path>
          <path class="person-leg person-leg-left" d="M 0 8 L -8 19"></path>
          <path class="person-leg person-leg-right" d="M 0 8 L 8 19"></path>
        </g>
        <text class="target-index" x="35" y="8">${t.index}</text>
      </g>
    `;
  }
  _targetMotion(t) {
    let e = Math.abs(t.speedMmPerSecond ?? 0);
    if (t.speedMmPerSecond === void 0) {
      const s = [...this._trails.get(t.id) ?? []].reverse().find((i) => i.updatedAt < t.updatedAt);
      if (s) {
        const i = (t.updatedAt - s.updatedAt) / 1e3;
        if (i > 0) {
          const o = Math.hypot(
            t.floorPoint.x - s.floorPoint.x,
            t.floorPoint.y - s.floorPoint.y
          ), n = this._floor?.pixels_per_meter ?? 100;
          e = o / n / i * 1e3;
        }
      }
    }
    return {
      moving: e >= 80,
      cycleSeconds: Math.min(1.05, Math.max(0.42, 800 / Math.max(e, 1)))
    };
  }
  _renderSensor(t) {
    const e = t.sensor, s = e.id === this._selectedSensorId;
    return _`
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
    return u`
      <aside class="inspector" aria-label="Selected radar details">
        <div class="inspector-heading">
          <div>
            <strong>${s.name ?? s.id}</strong>
            <span>${t.online ? "Online" : "Unavailable"}</span>
          </div>
          <button type="button" class="icon-button" @click=${() => this._selectedSensorId = void 0} aria-label="Close inspector">×</button>
        </div>
        ${t.discovered ? u`<p class="notice">Discovered automatically. Move it in the editor to save its placement.</p>` : d}
        <dl>
          <div><dt>Targets</dt><dd>${t.targets.length}</dd></div>
          <div><dt>Position</dt><dd>${Math.round(s.x)}, ${Math.round(s.y)}</dd></div>
          <div><dt>Heading</dt><dd>${Math.round(X(s.heading))}°</dd></div>
          <div><dt>Range</dt><dd>${s.range_m ?? 6} m</dd></div>
          ${t.temperature === void 0 ? d : u`<div><dt>Temperature</dt><dd>${t.temperature.toFixed(1)}°</dd></div>`}
          ${t.humidity === void 0 ? d : u`<div><dt>Humidity</dt><dd>${t.humidity.toFixed(1)}%</dd></div>`}
        </dl>
        ${this.editorMode ? u`
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
                  @input=${(i) => this._updateSensor(s, {
      range_m: Number(i.target.value)
    })}
                />
              </label>
              <small>${e.pixels_per_meter} canvas px per metre</small>
              ${this._renderCalibration(t, e)}
            ` : d}
      </aside>
    `;
  }
  _renderCalibration(t, e) {
    const s = this._calibration;
    return !s || s.sensorId !== t.sensor.id ? u`
        <div class="calibration-start">
          <button type="button" @click=${() => this._startCalibration(t.sensor)}>
            Calibrate placement
          </button>
          <small>Align the floor scale and radar direction with one live reference point.</small>
        </div>
      ` : s.step === "place" ? u`
        <div class="calibration-panel" role="group" aria-label="Radar calibration step 1">
          <strong>Place the radar</strong>
          <p>Drag the radar marker to its exact physical location on this floor.</p>
          <div class="calibration-actions">
            <button
              type="button"
              ?disabled=${t.targets.length === 0}
              @click=${() => this._beginReferenceStep(t)}
            >Radar is placed</button>
            <button type="button" @click=${this._cancelCalibration}>Cancel</button>
          </div>
          ${t.targets.length === 0 ? u`<small>A live target is required for the next step.</small>` : u`<small>${t.targets.length} live target${t.targets.length === 1 ? "" : "s"} available.</small>`}
        </div>
      ` : s.step === "reference" ? u`
        <div class="calibration-panel" role="group" aria-label="Radar calibration step 2">
          <strong>Mark the person’s location</strong>
          <p>Have one person stand at a recognizable spot, choose their target, then click that spot on the floorplan.</p>
          <label>
            <span>Live target</span>
            <select @change=${this._calibrationTargetChanged}>
              ${t.targets.map(
      (i) => u`<option
                  value=${i.index}
                  ?selected=${i.index === s.targetIndex}
                >Target ${i.index} · ${(Math.hypot(i.localXmm, i.localYmm) / 1e3).toFixed(2)} m</option>`
    )}
            </select>
          </label>
          <div class="calibration-actions">
            <button type="button" @click=${() => this._calibration = { ...s, step: "place" }}>Back</button>
            <button type="button" @click=${this._cancelCalibration}>Cancel</button>
          </div>
          ${s.message ? u`<small class="calibration-error">${s.message}</small>` : d}
          <small>Current scale: ${e.pixels_per_meter.toFixed(1)} px/m</small>
        </div>
      ` : u`
      <div class="calibration-panel calibration-done" role="status">
        <strong>Calibration applied</strong>
        <p>${s.message}</p>
        <div class="calibration-actions">
          <button type="button" @click=${() => this._startCalibration(t.sensor)}>Calibrate again</button>
          <button type="button" @click=${this._cancelCalibration}>Done</button>
        </div>
      </div>
    `;
  }
  _renderEditorHint() {
    const t = this._tool === "pan" ? "Drag the map to pan. Drag a radar to place it." : `Click to add ${this._tool} points, then choose Finish ${this._tool}.`;
    return u`<footer class="editor-hint">${t}</footer>`;
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
    const i = rt(
      t.clientX,
      t.clientY,
      s.getBoundingClientRect(),
      this._view
    );
    this._view = we(
      this._view,
      i,
      t.deltaY > 0 ? 1.12 : 0.88,
      e
    );
  }
  _pointerDown(t) {
    const s = t.target.closest("[data-sensor]");
    if (t.currentTarget.setPointerCapture(t.pointerId), this._pointerMoved = !1, s) {
      const o = s.dataset.sensor;
      if (!o) return;
      this._selectedSensorId = o, this.editorMode && this._tool === "pan" && this._calibration?.step !== "reference" && (this._drag = { kind: "sensor", sensorId: o });
      return;
    }
    this._calibration?.step !== "reference" && this._tool === "pan" && (this._drag = {
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
      const n = this._drag.sensorId, l = rt(
        t.clientX,
        t.clientY,
        e.getBoundingClientRect(),
        this._view
      ), a = this._runtimes.find(
        (h) => h.sensor.id === n
      )?.sensor;
      a && this._updateSensor(a, l, !1);
      return;
    }
    const s = e.getBoundingClientRect(), i = this._drag.view.width / s.width, o = this._drag.view.height / s.height;
    this._view = {
      ...this._drag.view,
      x: this._drag.view.x - (t.clientX - this._drag.clientX) * i,
      y: this._drag.view.y - (t.clientY - this._drag.clientY) * o
    };
  }
  _pointerUp(t) {
    const e = t.currentTarget;
    e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId), this._drag?.kind === "sensor" && this._emitConfig(), this._drag = void 0;
  }
  _mapClick(t) {
    if (!this.editorMode || this._pointerMoved) return;
    const e = t.currentTarget, s = rt(
      t.clientX,
      t.clientY,
      e.getBoundingClientRect(),
      this._view
    );
    if (this._calibration?.step === "reference") {
      this._applyCalibration(s);
      return;
    }
    this._tool !== "pan" && (this._draftPoints = [...this._draftPoints, s]);
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
    }, i = this._tool === "room" ? "rooms" : this._tool === "zone" ? "zones" : "walls";
    this._replaceFloor({ ...t, [i]: [...t[i] ?? [], s] }), this._draftPoints = [], this._emitConfig();
  }
  _rotateSensor(t, e) {
    this._updateSensor(t, { heading: X(t.heading + e) });
  }
  _startCalibration(t) {
    this._tool = "pan", this._draftPoints = [], this._calibration = { sensorId: t.id, step: "place" };
  }
  _beginReferenceStep(t) {
    const e = t.targets[0];
    e && (this._calibration = {
      sensorId: t.sensor.id,
      targetIndex: e.index,
      step: "reference"
    });
  }
  _calibrationTargetChanged(t) {
    this._calibration && (this._calibration = {
      ...this._calibration,
      targetIndex: Number(t.target.value)
    });
  }
  _applyCalibration(t) {
    const e = this._floor, s = this._calibration;
    if (!e || !s || s.step !== "reference") return;
    const i = this._runtimes.find(
      (a) => a.sensor.id === s.sensorId
    ), o = i?.targets.find(
      (a) => a.index === s.targetIndex
    );
    if (!i || !o) {
      this._calibration = {
        ...s,
        message: "That live target disappeared. Choose a visible target and try again."
      };
      return;
    }
    const n = xe(
      i.sensor,
      o.localXmm,
      o.localYmm,
      t
    );
    if (!n) {
      this._calibration = {
        ...s,
        message: "Use a reference point at least 10 cm from the radar."
      };
      return;
    }
    const l = (e.sensors ?? []).map(
      (a) => a.id === i.sensor.id ? { ...a, heading: n.heading } : a
    );
    l.some((a) => a.id === i.sensor.id) || l.push({ ...i.sensor, heading: n.heading }), this._replaceFloor({
      ...e,
      pixels_per_meter: n.pixelsPerMeter,
      sensors: l
    }), this._emitConfig(), this._calibration = {
      sensorId: i.sensor.id,
      step: "done",
      message: `Heading ${n.heading.toFixed(1)}° · scale ${n.pixelsPerMeter.toFixed(1)} px/m`
    };
  }
  _updateSensor(t, e, s = !0) {
    const i = this._floor;
    if (!i) return;
    const o = [...i.sensors ?? []], n = o.findIndex((a) => a.id === t.id), l = { ...t, ...e };
    n >= 0 ? o[n] = l : o.push(l), this._replaceFloor({ ...i, sensors: o }), s && this._emitConfig();
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
        const i = this._trails.get(s.id) ?? [];
        i.push(s), this._trails.set(
          s.id,
          i.filter((o) => o.updatedAt >= t).slice(-80)
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
J.properties = {
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
  _showTrails: { state: !0 },
  _calibration: { state: !0 }
}, J.styles = Tt`
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
      display: block;
      box-sizing: border-box;
      height: clamp(380px, 64dvh, 680px);
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

    .live-summary {
      display: flex;
      align-items: center;
      gap: 5px;
      min-width: 0;
      color: var(--sp-muted);
      font-size: 12px;
      white-space: nowrap;
    }

    .live-summary strong { color: var(--sp-ink); font-size: 14px; }

    .target-swatch {
      width: 10px;
      height: 10px;
      flex: 0 0 auto;
      border: 2px solid color-mix(in srgb, var(--sp-target) 25%, white);
      border-radius: 50%;
      background: var(--sp-target);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--sp-target) 13%, transparent);
    }

    .summary-divider {
      width: 1px;
      height: 14px;
      margin: 0 4px;
      background: color-mix(in srgb, var(--sp-ink) 18%, transparent);
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

    .target {
      transform-box: view-box;
      transform-origin: 0 0;
      transition: transform 180ms linear;
      pointer-events: none;
    }

    .target-halo {
      fill: color-mix(in srgb, var(--sp-target) 12%, transparent) !important;
      stroke: none !important;
    }

    .target-disc {
      fill: color-mix(in srgb, var(--sp-target) 16%, transparent);
      stroke: var(--sp-target);
      stroke-width: 3;
      vector-effect: non-scaling-stroke;
    }

    .motion-ring {
      fill: none;
      stroke: var(--sp-target);
      stroke-width: 2;
      stroke-dasharray: 7 8;
      vector-effect: non-scaling-stroke;
      transform-box: fill-box;
      transform-origin: center;
      animation: motion-orbit var(--motion-cycle) linear infinite;
    }

    .person-head {
      fill: #fff;
      stroke: none;
    }

    .person-torso,
    .person-arm,
    .person-leg {
      fill: none;
      stroke: #fff;
      stroke-width: 3.2;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
      transform-box: fill-box;
      transform-origin: 50% 10%;
    }

    .target.moving .target-halo {
      animation: target-pulse 1.4s ease-out infinite;
    }

    .target.moving .person-body {
      animation: person-bob var(--walk-cycle) ease-in-out infinite;
    }

    .target.moving .person-arm-left,
    .target.moving .person-leg-right {
      animation: stride-forward var(--walk-cycle) ease-in-out infinite alternate;
    }

    .target.moving .person-arm-right,
    .target.moving .person-leg-left {
      animation: stride-back var(--walk-cycle) ease-in-out infinite alternate;
    }

    .target-index {
      fill: var(--sp-target);
      font-size: 26px;
      font-weight: 750;
      paint-order: stroke;
      stroke: var(--sp-paper);
      stroke-width: 4px;
      vector-effect: non-scaling-stroke;
    }

    @keyframes target-pulse {
      0% { opacity: 0.55; transform: scale(0.82); }
      75%, 100% { opacity: 0; transform: scale(1.18); }
    }

    @keyframes person-bob {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }

    @keyframes motion-orbit {
      to { transform: rotate(360deg); }
    }

    @keyframes stride-forward {
      from { transform: rotate(-16deg); }
      to { transform: rotate(18deg); }
    }

    @keyframes stride-back {
      from { transform: rotate(16deg); }
      to { transform: rotate(-18deg); }
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

    .calibration-start {
      display: grid;
      gap: 6px;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid color-mix(in srgb, var(--sp-ink) 14%, transparent);
    }

    .calibration-start button {
      border-color: var(--sp-radar);
      background: color-mix(in srgb, var(--sp-radar) 12%, white);
      font-weight: 700;
    }

    .calibration-panel {
      display: grid;
      gap: 9px;
      margin-top: 14px;
      padding: 12px;
      border-left: 4px solid var(--sp-radar);
      background: color-mix(in srgb, var(--sp-radar) 8%, white);
    }

    .calibration-panel p { margin: 0; font-size: 13px; line-height: 1.4; }
    .calibration-panel label { display: grid; gap: 4px; font-size: 12px; }
    .calibration-actions { display: flex; flex-wrap: wrap; gap: 6px; }
    .calibration-actions button { flex: 1 1 auto; }
    .calibration-error { color: var(--error-color, #b3261e) !important; }
    .calibration-done { border-left-color: var(--sp-heading); }

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
      ha-card { height: clamp(420px, 68dvh, 620px); }
      .toolbar {
        display: grid;
        grid-template-columns: minmax(132px, 1fr) auto;
        align-items: center;
        gap: 6px 8px;
        padding: 8px;
      }
      .floor-select select { width: 100%; }
      .live-summary { justify-content: end; padding: 0 3px; }
      .toolbar-actions { grid-column: 1 / -1; padding-bottom: 0; }
      .toolbar-actions button { min-height: 32px; }
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
      *, *::before, *::after {
        scroll-behavior: auto !important;
        transition: none !important;
        animation: none !important;
      }
    }
  `;
let Z = J;
const K = class K extends z {
  constructor() {
    super(...arguments), this.hass = Wt, this._config = {
      type: "custom:spatial-presence-card",
      ...Z.getStubConfig()
    }, this._radarPrefix = "", this._mapId = "house", this._storageStatus = "";
  }
  setConfig(t) {
    this._config = I(t), this._mapId = t.backend_map_id ?? "house";
  }
  render() {
    return u`
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
          <span>Stationary hold (seconds)</span>
          <input
            type="number"
            min="0"
            max="3600"
            step="1"
            .value=${String(this._config.stationary_hold_seconds ?? 30)}
            @change=${this._stationaryHoldChanged}
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
          ${this._config.floors.length > 1 ? u`<button type="button" class="danger" @click=${this._removeFloor}>Remove floor</button>` : d}
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
        ${this._storageStatus ? u`<p class="storage-status" role="status">${this._storageStatus}</p>` : d}
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
    const s = t.target.value.trim(), i = { ...e };
    s && Vt(s) ? i.background = s : delete i.background, this._replaceFloor(i);
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
  _stationaryHoldChanged(t) {
    const e = Number(t.target.value);
    Number.isFinite(e) && e >= 0 && e <= 3600 && this._commit({ ...this._config, stationary_hold_seconds: e });
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
    const i = {
      id: Te(e.replace(/[^a-z0-9_]+/gi, "_"), t.sensors ?? []),
      name: e.split("_").map((o) => o[0]?.toUpperCase() + o.slice(1)).join(" "),
      entity_prefix: e,
      x: t.width / 2,
      y: t.height * 0.85,
      heading: 0,
      range_m: 6,
      fov_degrees: 120,
      mount: "wall"
    };
    this._replaceFloor({ ...t, sensors: [...t.sensors ?? [], i] }), this._radarPrefix = "", this.requestUpdate();
  }
  _floorChanged(t) {
    t.stopPropagation(), this._commit({ ...this._config, default_floor: t.detail.floorId });
  }
  _exportMap() {
    zt(Lt(this._config), "spatial-presence-map.json");
  }
  _exportEasyFloorplan() {
    zt(
      Pe(this._config),
      "spatial-presence-easy-floorplan.json"
    );
  }
  async _importMap(t) {
    const e = t.target, s = e.files?.[0];
    if (!(!s || s.size > 2e6))
      try {
        const i = JSON.parse(await s.text());
        let o, n = [];
        if (i.schema_version === "0.1" && Array.isArray(i.floors))
          o = I({
            ...i,
            type: "custom:spatial-presence-card"
          });
        else if (String(i.type ?? "").includes("easy-floorplan") || Array.isArray(i.areas) || Array.isArray(i.walls)) {
          const l = Ce(i);
          o = I({
            ...l.map,
            type: "custom:spatial-presence-card"
          }), n = l.warnings;
        } else if (It(i.maps) || It(i.radars)) {
          const l = Ie(i);
          o = I({
            ...l.map,
            type: "custom:spatial-presence-card"
          }), n = l.warnings;
        } else
          throw new Error("Use a Spatial Presence, Easy Floorplan or Radar Map Manager JSON file");
        this._commit(o), this._storageStatus = n.length ? `Imported with ${n.length} review note${n.length === 1 ? "" : "s"}: ${n.join(" ")}` : "Map imported.";
      } catch (i) {
        this._storageStatus = `Map was not imported: ${Y(i)}`;
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
      const t = await $e(this.hass, this._mapId, this._config);
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
      const t = await be(this.hass, this._mapId);
      this._commit(
        I({
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
      await ve(this.hass, this._mapId), await this._loadBackend();
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
K.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 }
}, K.styles = Tt`
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
let nt = K;
function I(r) {
  return {
    ...r,
    type: r.type || "custom:spatial-presence-card",
    schema_version: "0.1",
    auto_discover: r.auto_discover !== !1,
    target_trail_seconds: r.target_trail_seconds ?? 8,
    stationary_hold_seconds: r.stationary_hold_seconds ?? 30,
    floors: r.floors.map((t) => {
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
function Xt(r = "main", t = "Main floor") {
  return {
    id: r,
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
function Te(r, t) {
  const e = r || "radar";
  if (!t.some((i) => i.id === e)) return e;
  let s = 2;
  for (; t.some((i) => i.id === `${e}_${s}`); ) s += 1;
  return `${e}_${s}`;
}
function Vt(r) {
  return /^(\/|https?:\/\/)/i.test(r.trim());
}
function Y(r) {
  return r instanceof Error ? r.message : String(r);
}
function It(r) {
  return typeof r == "object" && r !== null && !Array.isArray(r);
}
function zt(r, t) {
  const e = JSON.stringify(r, null, 2), s = URL.createObjectURL(new Blob([e], { type: "application/json" })), i = document.createElement("a");
  i.href = s, i.download = t, i.click(), URL.revokeObjectURL(s);
}
customElements.get("spatial-presence-card") || customElements.define("spatial-presence-card", Z);
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
  `%c SPATIAL PRESENCE %c ${Re} `,
  "color:white;background:#14232b;font-weight:700;padding:3px 5px",
  "color:#14232b;background:#f2a93b;font-weight:700;padding:3px 5px"
);
export {
  Z as SpatialPresenceCard,
  nt as SpatialPresenceCardEditor
};
//# sourceMappingURL=spatial-presence-card.js.map
