const O = globalThis, Z = O.ShadowRoot && (O.ShadyCSS === void 0 || O.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = /* @__PURE__ */ Symbol(), tt = /* @__PURE__ */ new WeakMap();
let ft = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Z && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = tt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && tt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ct = (r) => new ft(typeof r == "string" ? r : r + "", void 0, J), _t = (r, ...t) => {
  const e = r.length === 1 ? r[0] : t.reduce((i, s, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[o + 1], r[0]);
  return new ft(e, r, J);
}, Pt = (r, t) => {
  if (Z) r.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = O.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, r.appendChild(i);
  }
}, et = Z ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ct(e);
})(r) : r;
const { is: Mt, defineProperty: Tt, getOwnPropertyDescriptor: Rt, getOwnPropertyNames: Ut, getOwnPropertySymbols: Ot, getPrototypeOf: zt } = Object, F = globalThis, it = F.trustedTypes, Nt = it ? it.emptyScript : "", It = F.reactiveElementPolyfillSupport, C = (r, t) => r, Y = { toAttribute(r, t) {
  switch (t) {
    case Boolean:
      r = r ? Nt : null;
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
} }, mt = (r, t) => !Mt(r, t), st = { attribute: !0, type: String, converter: Y, reflect: !1, useDefault: !1, hasChanged: mt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), F.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let y = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = st) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && Tt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: o } = Rt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const l = s?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = zt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const e = this.properties, i = [...Ut(e), ...Ot(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(et(s));
    } else t !== void 0 && e.push(et(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
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
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : Y).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Y;
      this._$Em = s;
      const l = n.fromAttribute(e, o.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (o = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? mt)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, o] of i) {
        const { wrapped: n } = o, l = this[s];
        n !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
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
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[C("elementProperties")] = /* @__PURE__ */ new Map(), y[C("finalized")] = /* @__PURE__ */ new Map(), It?.({ ReactiveElement: y }), (F.reactiveElementVersions ??= []).push("2.1.2");
const G = globalThis, rt = (r) => r, z = G.trustedTypes, ot = z ? z.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, $t = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + $, Ht = `<${vt}>`, x = document, P = () => x.createComment(""), M = (r) => r === null || typeof r != "object" && typeof r != "function", K = Array.isArray, Ft = (r) => K(r) || typeof r?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nt = /-->/g, at = />/g, v = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, ct = /"/g, bt = /^(?:script|style|textarea|title)$/i, xt = (r) => (t, ...e) => ({ _$litType$: r, strings: t, values: e }), u = xt(1), f = xt(2), A = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), dt = /* @__PURE__ */ new WeakMap(), b = x.createTreeWalker(x, 129);
function yt(r, t) {
  if (!K(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Dt = (r, t) => {
  const e = r.length - 1, i = [];
  let s, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = E;
  for (let l = 0; l < e; l++) {
    const a = r[l];
    let h, p, d = -1, g = 0;
    for (; g < a.length && (n.lastIndex = g, p = n.exec(a), p !== null); ) g = n.lastIndex, n === E ? p[1] === "!--" ? n = nt : p[1] !== void 0 ? n = at : p[2] !== void 0 ? (bt.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = v) : p[3] !== void 0 && (n = v) : n === v ? p[0] === ">" ? (n = s ?? E, d = -1) : p[1] === void 0 ? d = -2 : (d = n.lastIndex - p[2].length, h = p[1], n = p[3] === void 0 ? v : p[3] === '"' ? ct : lt) : n === ct || n === lt ? n = v : n === nt || n === at ? n = E : (n = v, s = void 0);
    const _ = n === v && r[l + 1].startsWith("/>") ? " " : "";
    o += n === E ? a + Ht : d >= 0 ? (i.push(h), a.slice(0, d) + $t + a.slice(d) + $ + _) : a + $ + (d === -2 ? l : _);
  }
  return [yt(r, o + (r[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class T {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [h, p] = Dt(t, e);
    if (this.el = T.createElement(h, i), b.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = b.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith($t)) {
          const g = p[n++], _ = s.getAttribute(d).split($), U = /([.?@])?(.*)/.exec(g);
          a.push({ type: 1, index: o, name: U[2], strings: _, ctor: U[1] === "." ? Lt : U[1] === "?" ? Bt : U[1] === "@" ? Yt : D }), s.removeAttribute(d);
        } else d.startsWith($) && (a.push({ type: 6, index: o }), s.removeAttribute(d));
        if (bt.test(s.tagName)) {
          const d = s.textContent.split($), g = d.length - 1;
          if (g > 0) {
            s.textContent = z ? z.emptyScript : "";
            for (let _ = 0; _ < g; _++) s.append(d[_], P()), b.nextNode(), a.push({ type: 2, index: ++o });
            s.append(d[g], P());
          }
        }
      } else if (s.nodeType === 8) if (s.data === vt) a.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf($, d + 1)) !== -1; ) a.push({ type: 7, index: o }), d += $.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = x.createElement("template");
    return i.innerHTML = t, i;
  }
}
function k(r, t, e = r, i) {
  if (t === A) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = M(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = k(r, s._$AS(r, t.values), s, i)), t;
}
class jt {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? x).importNode(e, !0);
    b.currentNode = s;
    let o = b.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new R(o, o.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (h = new Wt(o, this, t)), this._$AV.push(h), a = i[++l];
      }
      n !== a?.index && (o = b.nextNode(), n++);
    }
    return b.currentNode = x, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    t = k(this, t, e), M(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ft(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = T.createElement(yt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const o = new jt(s, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = dt.get(t.strings);
    return e === void 0 && dt.set(t.strings, e = new T(t)), e;
  }
  k(t) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const o of t) s === e.length ? e.push(i = new R(this.O(P()), this.O(P()), this, this.options)) : i = e[s], i._$AI(o), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = rt(t).nextSibling;
      rt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, e = this, i, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = k(this, t, e, 0), n = !M(t) || t !== this._$AH && t !== A, n && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = o[0], a = 0; a < o.length - 1; a++) h = k(this, l[i + a], e, a), h === A && (h = this._$AH[a]), n ||= !M(h) || h !== this._$AH[a], h === c ? t = c : t !== c && (t += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Lt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Bt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Yt extends D {
  constructor(t, e, i, s, o) {
    super(t, e, i, s, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = k(this, t, e, 0) ?? c) === A) return;
    const i = this._$AH, s = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== c && (i === c || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Wt {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    k(this, t);
  }
}
const Xt = G.litHtmlPolyfillSupport;
Xt?.(T, R), (G.litHtmlVersions ??= []).push("3.3.3");
const qt = (r, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = s = new R(t.insertBefore(P(), o), o, void 0, e ?? {});
  }
  return s._$AI(r), s;
};
const Q = globalThis;
class w extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = qt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
w._$litElement$ = !0, w.finalized = !0, Q.litElementHydrateSupport?.({ LitElement: w });
const Vt = Q.litElementPolyfillSupport;
Vt?.({ LitElement: w });
(Q.litElementVersions ??= []).push("4.2.2");
const wt = Math.PI / 180;
function W(r) {
  return (r % 360 + 360) % 360;
}
function Zt(r, t, e, i) {
  const s = i / 1e3, o = t * s, n = -e * s, l = W(r.heading) * wt;
  return {
    x: r.x + o * Math.cos(l) - n * Math.sin(l),
    y: r.y + o * Math.sin(l) + n * Math.cos(l)
  };
}
function L(r, t, e = 1) {
  const i = (r.range_m ?? 6) * t * e, s = (r.fov_degrees ?? 120) / 2, o = ht(r, i, -s), n = ht(r, i, s), l = s * 2 > 180 ? 1 : 0;
  return [
    `M ${m(r.x)} ${m(r.y)}`,
    `L ${m(o.x)} ${m(o.y)}`,
    `A ${m(i)} ${m(i)} 0 ${l} 1 ${m(n.x)} ${m(n.y)}`,
    "Z"
  ].join(" ");
}
function ht(r, t, e) {
  const i = (r.heading + e - 90) * wt;
  return {
    x: r.x + t * Math.cos(i),
    y: r.y + t * Math.sin(i)
  };
}
function m(r) {
  return Math.round(r * 100) / 100;
}
function Jt(r, t, e, i) {
  const s = pt(r.width * e, i.width * 0.08, i.width * 4), o = pt(
    r.height * e,
    i.height * 0.08,
    i.height * 4
  ), n = (t.x - r.x) / r.width, l = (t.y - r.y) / r.height;
  return {
    x: t.x - n * s,
    y: t.y - l * o,
    width: s,
    height: o
  };
}
function S(r) {
  return r.map((t) => `${t.x},${t.y}`).join(" ");
}
function B(r, t, e, i) {
  return {
    x: i.x + (r - e.left) / e.width * i.width,
    y: i.y + (t - e.top) / e.height * i.height
  };
}
function pt(r, t, e) {
  return Math.min(e, Math.max(t, r));
}
const Gt = /^sensor\.(.+)_target_([1-9]\d*)_x$/;
function Kt(r) {
  const t = /* @__PURE__ */ new Set();
  for (const e of Object.keys(r.states)) {
    const i = Gt.exec(e);
    if (!i) continue;
    const s = i[1], o = i[2];
    s && o && r.states[`sensor.${s}_target_${o}_y`] && t.add(s);
  }
  return [...t].sort();
}
function ut(r, t, e = !0, i = Date.now()) {
  const s = [...t.sensors ?? []], o = new Set(
    s.map((n) => n.entity_prefix ?? n.id)
  );
  if (e)
    for (const n of Kt(r))
      o.has(n) || s.push({
        id: n,
        name: At(n),
        entity_prefix: n,
        x: t.width / 2,
        y: t.height * 0.85,
        heading: 0,
        range_m: 6,
        fov_degrees: 120,
        mount: "wall"
      });
  return s.map((n) => Qt(r, t, n, i));
}
function Qt(r, t, e, i) {
  const s = e.entity_prefix ?? e.id, o = [];
  for (let a = 1; a <= 9; a += 1) {
    const h = r.states[`sensor.${s}_target_${a}_x`], p = r.states[`sensor.${s}_target_${a}_y`];
    if (!h || !p) continue;
    const d = gt(h), g = gt(p);
    d === void 0 || g === void 0 || d === 0 && g === 0 || o.push({
      id: `${e.id}:${a}`,
      sensorId: e.id,
      sensorName: e.name ?? At(s),
      index: a,
      localXmm: d,
      localYmm: g,
      floorPoint: Zt(
        e,
        d,
        g,
        t.pixels_per_meter
      ),
      updatedAt: i
    });
  }
  const n = X(r.states[`sensor.${s}_temperature`]), l = X(r.states[`sensor.${s}_humidity`]);
  return {
    sensor: e,
    targets: o,
    ...n === void 0 ? {} : { temperature: n },
    ...l === void 0 ? {} : { humidity: l },
    online: te(r, s),
    discovered: !(t.sensors ?? []).some((a) => a.id === e.id)
  };
}
function te(r, t) {
  const e = r.states[`binary_sensor.${t}_online`] ?? r.states[`binary_sensor.${t}_status`];
  if (e) return e.state === "on";
  const i = r.states[`binary_sensor.${t}_presence`];
  return i ? !["unavailable", "unknown"].includes(i.state) : !0;
}
function gt(r) {
  const t = X(r);
  if (t === void 0) return;
  const e = String(r.attributes.unit_of_measurement ?? "mm").toLowerCase();
  return e === "m" ? t * 1e3 : e === "cm" ? t * 10 : t;
}
function X(r) {
  if (!r || ["unknown", "unavailable"].includes(r.state)) return;
  const t = Number(r.state);
  return Number.isFinite(t) ? t : void 0;
}
function At(r) {
  return r.split("_").filter(Boolean).map((t) => t[0]?.toUpperCase() + t.slice(1)).join(" ");
}
const ee = "0.1.0-alpha.1", kt = { states: {} }, I = class I extends w {
  constructor() {
    super(...arguments), this.hass = kt, this.editorMode = !1, this._floorId = "", this._view = { x: 0, y: 0, width: 1200, height: 800 }, this._tool = "pan", this._draftPoints = [], this._showCoverage = !0, this._showTrails = !0, this._pointerMoved = !1, this._trails = /* @__PURE__ */ new Map(), this._fit = () => {
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
      floors: [Et()]
    };
  }
  setConfig(t) {
    if (!Array.isArray(t.floors) || t.floors.length === 0)
      throw new Error("Add at least one floor to Spatial Presence.");
    this._config = V(t);
    const e = t.default_floor;
    (!this._floorId || !this._config.floors.some((i) => i.id === this._floorId)) && (this._floorId = (e && this._config.floors.some((i) => i.id === e) ? e : this._config.floors[0]?.id) ?? "", this._fit());
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
      return u`<ha-card><p class="empty">Add a floor to begin.</p></ha-card>`;
    const i = ut(
      this.hass,
      e,
      t.auto_discover !== !1
    ), s = i.find(
      (o) => o.sensor.id === this._selectedSensorId
    );
    return u`
      <ha-card>
        <section class="shell" aria-label=${t.title ?? "Spatial presence"}>
          ${this._renderToolbar(t, e)}
          <div class="workspace">
            ${this._renderMap(e, i)}
            ${s ? this._renderInspector(s, e) : c}
          </div>
          ${this.editorMode ? this._renderEditorHint() : c}
        </section>
      </ha-card>
    `;
  }
  _renderToolbar(t, e) {
    return u`
      <header class="toolbar">
        <label class="floor-select">
          <span class="sr-only">Floor</span>
          <select @change=${this._changeFloor} .value=${e.id}>
            ${t.floors.map(
      (i) => u`<option value=${i.id}>${i.name}</option>`
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
          ${this.editorMode ? u`
                <span class="tool-separator" aria-hidden="true"></span>
                ${this._toolButton("pan", "Move")}
                ${this._toolButton("wall", "Draw wall")}
                ${this._toolButton("room", "Draw room")}
                ${this._toolButton("zone", "Draw zone")}
                ${this._draftPoints.length > 0 ? u`<button type="button" class="commit" @click=${this._finishDrawing}>
                      Finish ${this._tool}
                    </button>` : c}
              ` : c}
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
    const i = this._view;
    return u`
      <div class="map-frame">
        <svg
          class="map"
          role="img"
          aria-label="${t.name} live presence map"
          viewBox="${i.x} ${i.y} ${i.width} ${i.height}"
          preserveAspectRatio="xMidYMid meet"
          @wheel=${this._wheel}
          @pointerdown=${this._pointerDown}
          @pointermove=${this._pointerMove}
          @pointerup=${this._pointerUp}
          @pointercancel=${this._pointerUp}
          @click=${this._mapClick}
        >
          <rect class="paper" width=${t.width} height=${t.height}></rect>
          ${t.background ? f`<image
                class="background"
                href=${t.background}
                width=${t.width}
                height=${t.height}
                preserveAspectRatio="xMidYMid meet"
              ></image>` : c}
          <g class="rooms">${(t.rooms ?? []).map((s) => this._renderRoom(s))}</g>
          <g class="zones">${(t.zones ?? []).map((s) => this._renderZone(s))}</g>
          <g class="walls">${(t.walls ?? []).map((s) => this._renderWall(s))}</g>
          ${this._showCoverage ? f`<g class="coverage">${e.map((s) => this._renderCoverage(s, t))}</g>` : c}
          ${this._showTrails ? this._renderTrails() : c}
          <g class="targets">
            ${e.flatMap(
      (s) => s.targets.map((o) => this._renderTarget(o))
    )}
          </g>
          <g class="sensors">
            ${e.map((s) => this._renderSensor(s))}
          </g>
          ${this._draftPoints.length ? f`<polyline class="draft" points=${S(this._draftPoints)}></polyline>
                ${this._draftPoints.map(
      (s) => f`<circle class="draft-point" cx=${s.x} cy=${s.y} r="6"></circle>`
    )}` : c}
        </svg>
        ${e.length === 0 ? u`<div class="map-empty">
              <strong>No compatible radar found</strong>
              <span>Add an LD2450 sensor or configure an entity prefix.</span>
            </div>` : c}
      </div>
    `;
  }
  _renderRoom(t) {
    return f`
      <polygon points=${S(t.points)}></polygon>
      ${t.name && t.points[0] ? f`<text x=${t.points[0].x + 12} y=${t.points[0].y + 24}>${t.name}</text>` : c}
    `;
  }
  _renderZone(t) {
    return f`<polygon points=${S(t.points)}></polygon>`;
  }
  _renderWall(t) {
    return f`<polyline points=${S(t.points)}></polyline>`;
  }
  _renderCoverage(t, e) {
    const i = t.sensor;
    return f`
      <path class="coverage-fringe" d=${L(i, e.pixels_per_meter, 1)}></path>
      <path class="coverage-usable" d=${L(i, e.pixels_per_meter, 0.72)}></path>
      <path class="coverage-strong" d=${L(i, e.pixels_per_meter, 0.4)}></path>
    `;
  }
  _renderTrails() {
    const t = Date.now() - (this._config?.target_trail_seconds ?? 8) * 1e3, e = [...this._trails.entries()].map(([i, s]) => {
      const o = s.filter((n) => n.updatedAt >= t);
      return o.length > 1 ? f`<polyline class="trail" data-track=${i} points=${S(
        o.map((n) => n.floorPoint)
      )}></polyline>` : c;
    });
    return f`<g class="trails">${e}</g>`;
  }
  _renderTarget(t) {
    return f`
      <g class="target" transform="translate(${t.floorPoint.x} ${t.floorPoint.y})">
        <circle r="12"></circle>
        <circle class="target-core" r="4"></circle>
        <text x="17" y="5">${t.index}</text>
      </g>
    `;
  }
  _renderSensor(t) {
    const e = t.sensor, i = e.id === this._selectedSensorId;
    return f`
      <g
        class="sensor ${i ? "selected" : ""} ${t.online ? "" : "offline"}"
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
    const i = t.sensor;
    return u`
      <aside class="inspector" aria-label="Selected radar details">
        <div class="inspector-heading">
          <div>
            <strong>${i.name ?? i.id}</strong>
            <span>${t.online ? "Online" : "Unavailable"}</span>
          </div>
          <button type="button" class="icon-button" @click=${() => this._selectedSensorId = void 0} aria-label="Close inspector">×</button>
        </div>
        ${t.discovered ? u`<p class="notice">Discovered automatically. Move it in the editor to save its placement.</p>` : c}
        <dl>
          <div><dt>Targets</dt><dd>${t.targets.length}</dd></div>
          <div><dt>Position</dt><dd>${Math.round(i.x)}, ${Math.round(i.y)}</dd></div>
          <div><dt>Heading</dt><dd>${Math.round(W(i.heading))}°</dd></div>
          <div><dt>Range</dt><dd>${i.range_m ?? 6} m</dd></div>
          ${t.temperature === void 0 ? c : u`<div><dt>Temperature</dt><dd>${t.temperature.toFixed(1)}°</dd></div>`}
          ${t.humidity === void 0 ? c : u`<div><dt>Humidity</dt><dd>${t.humidity.toFixed(1)}%</dd></div>`}
        </dl>
        ${this.editorMode ? u`
              <div class="rotation">
                <span>Rotate</span>
                <button type="button" @click=${() => this._rotateSensor(i, -15)}>−15°</button>
                <button type="button" @click=${() => this._rotateSensor(i, -1)}>−1°</button>
                <button type="button" @click=${() => this._rotateSensor(i, 1)}>+1°</button>
                <button type="button" @click=${() => this._rotateSensor(i, 15)}>+15°</button>
              </div>
              <label class="range-control">
                <span>Range ${i.range_m ?? 6} m</span>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.25"
                  .value=${String(i.range_m ?? 6)}
                  @input=${(s) => this._updateSensor(i, {
      range_m: Number(s.target.value)
    })}
                />
              </label>
              <small>${e.pixels_per_meter} canvas px per metre</small>
            ` : c}
      </aside>
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
    const e = this._floor, i = t.currentTarget;
    if (!e) return;
    t.preventDefault();
    const s = B(
      t.clientX,
      t.clientY,
      i.getBoundingClientRect(),
      this._view
    );
    this._view = Jt(
      this._view,
      s,
      t.deltaY > 0 ? 1.12 : 0.88,
      e
    );
  }
  _pointerDown(t) {
    const i = t.target.closest("[data-sensor]");
    if (t.currentTarget.setPointerCapture(t.pointerId), this._pointerMoved = !1, i) {
      const o = i.dataset.sensor;
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
      const n = this._drag.sensorId, l = B(
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
    const i = e.getBoundingClientRect(), s = this._drag.view.width / i.width, o = this._drag.view.height / i.height;
    this._view = {
      ...this._drag.view,
      x: this._drag.view.x - (t.clientX - this._drag.clientX) * s,
      y: this._drag.view.y - (t.clientY - this._drag.clientY) * o
    };
  }
  _pointerUp(t) {
    const e = t.currentTarget;
    e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId), this._drag?.kind === "sensor" && this._emitConfig(), this._drag = void 0;
  }
  _mapClick(t) {
    if (!this.editorMode || this._tool === "pan" || this._pointerMoved) return;
    const e = t.currentTarget, i = B(
      t.clientX,
      t.clientY,
      e.getBoundingClientRect(),
      this._view
    );
    this._draftPoints = [...this._draftPoints, i];
  }
  _finishDrawing() {
    const t = this._floor;
    if (!t || !this._config) return;
    const e = this._tool === "wall" ? 2 : 3;
    if (this._draftPoints.length < e) return;
    const i = {
      id: `${this._tool}-${crypto.randomUUID()}`,
      ...this._tool === "room" ? { name: `Room ${(t.rooms?.length ?? 0) + 1}` } : this._tool === "zone" ? { name: `Zone ${(t.zones?.length ?? 0) + 1}` } : {},
      points: [...this._draftPoints]
    }, s = this._tool === "room" ? "rooms" : this._tool === "zone" ? "zones" : "walls";
    this._replaceFloor({ ...t, [s]: [...t[s] ?? [], i] }), this._draftPoints = [], this._emitConfig();
  }
  _rotateSensor(t, e) {
    this._updateSensor(t, { heading: W(t.heading + e) });
  }
  _updateSensor(t, e, i = !0) {
    const s = this._floor;
    if (!s) return;
    const o = [...s.sensors ?? []], n = o.findIndex((a) => a.id === t.id), l = { ...t, ...e };
    n >= 0 ? o[n] = l : o.push(l), this._replaceFloor({ ...s, sensors: o }), i && this._emitConfig();
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
      for (const i of e.targets) {
        const s = this._trails.get(i.id) ?? [];
        s.push(i), this._trails.set(
          i.id,
          s.filter((o) => o.updatedAt >= t).slice(-80)
        );
      }
  }
  get _floor() {
    return this._config?.floors.find((t) => t.id === this._floorId);
  }
  get _runtimes() {
    const t = this._floor;
    return t ? ut(
      this.hass,
      t,
      this._config?.auto_discover !== !1
    ) : [];
  }
};
I.properties = {
  hass: { attribute: !1 },
  editorMode: { attribute: !1 },
  _config: { state: !0 },
  _floorId: { state: !0 },
  _view: { state: !0 },
  _selectedSensorId: { state: !0 },
  _tool: { state: !0 },
  _draftPoints: { state: !0 },
  _showCoverage: { state: !0 },
  _showTrails: { state: !0 }
}, I.styles = _t`
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
let N = I;
const H = class H extends w {
  constructor() {
    super(...arguments), this.hass = kt, this._config = {
      type: "custom:spatial-presence-card",
      ...N.getStubConfig()
    }, this._radarPrefix = "";
  }
  setConfig(t) {
    this._config = V(t);
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
          <span>Radar entity prefix</span>
          <input
            placeholder="ld2450_presence"
            .value=${this._radarPrefix}
            @input=${(t) => this._radarPrefix = t.target.value}
          />
        </label>
        <div class="editor-actions">
          <button type="button" @click=${this._addRadar}>Add radar</button>
          <button type="button" @click=${this._addFloor}>Add floor</button>
          ${this._config.floors.length > 1 ? u`<button type="button" class="danger" @click=${this._removeFloor}>Remove floor</button>` : c}
          <button type="button" @click=${this._exportMap}>Export JSON</button>
          <label class="file-button">
            Import JSON
            <input type="file" accept="application/json,.json" @change=${this._importMap} />
          </label>
        </div>
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
    const i = t.target.value.trim(), s = { ...e };
    i && St(i) ? s.background = i : delete s.background, this._replaceFloor(s);
  }
  _floorNameChanged(t) {
    const e = this._activeFloor, i = t.target.value.trim();
    e && i && this._replaceFloor({ ...e, name: i });
  }
  _scaleChanged(t) {
    const e = this._activeFloor;
    if (!e) return;
    const i = Number(t.target.value);
    Number.isFinite(i) && i > 0 && this._replaceFloor({ ...e, pixels_per_meter: i });
  }
  _addFloor() {
    const t = this._config.floors.length + 1, e = Et(`floor-${t}`, `Floor ${t}`);
    this._commit({
      ...this._config,
      floors: [...this._config.floors, e],
      default_floor: e.id
    });
  }
  _removeFloor() {
    const t = this._activeFloor;
    if (!t || this._config.floors.length <= 1) return;
    const e = this._config.floors.filter((i) => i.id !== t.id);
    this._commit({ ...this._config, floors: e, default_floor: e[0].id });
  }
  _addRadar() {
    const t = this._activeFloor, e = this._radarPrefix.trim();
    if (!t || !e) return;
    const s = {
      id: ie(e.replace(/[^a-z0-9_]+/gi, "_"), t.sensors ?? []),
      name: e.split("_").map((o) => o[0]?.toUpperCase() + o.slice(1)).join(" "),
      entity_prefix: e,
      x: t.width / 2,
      y: t.height * 0.85,
      heading: 0,
      range_m: 6,
      fov_degrees: 120,
      mount: "wall"
    };
    this._replaceFloor({ ...t, sensors: [...t.sensors ?? [], s] }), this._radarPrefix = "", this.requestUpdate();
  }
  _floorChanged(t) {
    t.stopPropagation(), this._commit({ ...this._config, default_floor: t.detail.floorId });
  }
  _exportMap() {
    const t = JSON.stringify(this._config, null, 2), e = URL.createObjectURL(new Blob([t], { type: "application/json" })), i = document.createElement("a");
    i.href = e, i.download = "spatial-presence-map.json", i.click(), URL.revokeObjectURL(e);
  }
  async _importMap(t) {
    const e = t.target, i = e.files?.[0];
    if (!(!i || i.size > 2e6))
      try {
        const s = JSON.parse(await i.text());
        if (s.schema_version !== "0.1" || !Array.isArray(s.floors) || !s.floors.length)
          throw new Error("Unsupported Spatial Map file");
        this._commit(V({ ...s, type: "custom:spatial-presence-card" }));
      } finally {
        e.value = "";
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
};
H.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 }
}, H.styles = _t`
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
let q = H;
function V(r) {
  return {
    ...r,
    type: r.type || "custom:spatial-presence-card",
    schema_version: "0.1",
    auto_discover: r.auto_discover !== !1,
    target_trail_seconds: r.target_trail_seconds ?? 8,
    floors: r.floors.map((t) => {
      const e = {
        ...t,
        pixels_per_meter: t.pixels_per_meter || 100,
        walls: t.walls ?? [],
        rooms: t.rooms ?? [],
        zones: t.zones ?? [],
        sensors: t.sensors ?? []
      };
      return e.background && !St(e.background) && delete e.background, e;
    })
  };
}
function Et(r = "main", t = "Main floor") {
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
function ie(r, t) {
  const e = r || "radar";
  if (!t.some((s) => s.id === e)) return e;
  let i = 2;
  for (; t.some((s) => s.id === `${e}_${i}`); ) i += 1;
  return `${e}_${i}`;
}
function St(r) {
  return /^(\/|https?:\/\/)/i.test(r.trim());
}
customElements.get("spatial-presence-card") || customElements.define("spatial-presence-card", N);
customElements.get("spatial-presence-card-editor") || customElements.define("spatial-presence-card-editor", q);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "spatial-presence-card",
  name: "Spatial Presence",
  description: "Draw floors and place live mmWave radar targets.",
  preview: !0,
  documentationURL: "https://github.com/daredoole/spatial-presence"
});
console.info(
  `%c SPATIAL PRESENCE %c ${ee} `,
  "color:white;background:#14232b;font-weight:700;padding:3px 5px",
  "color:#14232b;background:#f2a93b;font-weight:700;padding:3px 5px"
);
export {
  N as SpatialPresenceCard,
  q as SpatialPresenceCardEditor
};
//# sourceMappingURL=spatial-presence-card.js.map
