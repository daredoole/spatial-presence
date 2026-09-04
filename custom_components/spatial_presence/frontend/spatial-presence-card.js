const W = globalThis, at = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lt = /* @__PURE__ */ Symbol(), _t = /* @__PURE__ */ new WeakMap();
let zt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== lt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (at && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = _t.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && _t.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const te = (o) => new zt(typeof o == "string" ? o : o + "", void 0, lt), Ft = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((i, s, r) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[r + 1], o[0]);
  return new zt(e, o, lt);
}, ee = (o, t) => {
  if (at) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = W.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, o.appendChild(i);
  }
}, ft = at ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return te(e);
})(o) : o;
const { is: ie, defineProperty: se, getOwnPropertyDescriptor: oe, getOwnPropertyNames: re, getOwnPropertySymbols: ne, getPrototypeOf: ae } = Object, Q = globalThis, mt = Q.trustedTypes, le = mt ? mt.emptyScript : "", ce = Q.reactiveElementPolyfillSupport, D = (o, t) => o, rt = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? le : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, Ut = (o, t) => !ie(o, t), bt = { attribute: !0, type: String, converter: rt, reflect: !1, useDefault: !1, hasChanged: Ut };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Q.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let I = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = bt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && se(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = oe(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: s, set(n) {
      const l = s?.call(this);
      r?.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? bt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = ae(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const e = this.properties, i = [...re(e), ...ne(e)];
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
      for (const s of i) e.unshift(ft(s));
    } else t !== void 0 && e.push(ft(t));
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
    return ee(t, this.constructor.elementStyles), t;
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
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : rt).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = i.getPropertyOptions(s), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : rt;
      this._$Em = s;
      const l = n.fromAttribute(e, r.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (r = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? Ut)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, r] of i) {
        const { wrapped: n } = r, l = this[s];
        n !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, r, l);
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
I.elementStyles = [], I.shadowRootOptions = { mode: "open" }, I[D("elementProperties")] = /* @__PURE__ */ new Map(), I[D("finalized")] = /* @__PURE__ */ new Map(), ce?.({ ReactiveElement: I }), (Q.reactiveElementVersions ??= []).push("2.1.2");
const ct = globalThis, vt = (o) => o, q = ct.trustedTypes, $t = q ? q.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, Nt = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, Dt = "?" + k, de = `<${Dt}>`, P = document, O = () => P.createComment(""), j = (o) => o === null || typeof o != "object" && typeof o != "function", dt = Array.isArray, he = (o) => dt(o) || typeof o?.[Symbol.iterator] == "function", it = `[ 	
\f\r]`, F = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, yt = /-->/g, xt = />/g, E = RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), wt = /'/g, kt = /"/g, Ht = /^(?:script|style|textarea|title)$/i, Lt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), u = Lt(1), m = Lt(2), T = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), St = /* @__PURE__ */ new WeakMap(), C = P.createTreeWalker(P, 129);
function Ot(o, t) {
  if (!dt(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $t !== void 0 ? $t.createHTML(t) : t;
}
const pe = (o, t) => {
  const e = o.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = F;
  for (let l = 0; l < e; l++) {
    const a = o[l];
    let p, h, c = -1, _ = 0;
    for (; _ < a.length && (n.lastIndex = _, h = n.exec(a), h !== null); ) _ = n.lastIndex, n === F ? h[1] === "!--" ? n = yt : h[1] !== void 0 ? n = xt : h[2] !== void 0 ? (Ht.test(h[2]) && (s = RegExp("</" + h[2], "g")), n = E) : h[3] !== void 0 && (n = E) : n === E ? h[0] === ">" ? (n = s ?? F, c = -1) : h[1] === void 0 ? c = -2 : (c = n.lastIndex - h[2].length, p = h[1], n = h[3] === void 0 ? E : h[3] === '"' ? kt : wt) : n === kt || n === wt ? n = E : n === yt || n === xt ? n = F : (n = E, s = void 0);
    const f = n === E && o[l + 1].startsWith("/>") ? " " : "";
    r += n === F ? a + de : c >= 0 ? (i.push(p), a.slice(0, c) + Nt + a.slice(c) + k + f) : a + k + (c === -2 ? l : f);
  }
  return [Ot(o, r + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class B {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const l = t.length - 1, a = this.parts, [p, h] = pe(t, e);
    if (this.el = B.createElement(p, i), C.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (s = C.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const c of s.getAttributeNames()) if (c.endsWith(Nt)) {
          const _ = h[n++], f = s.getAttribute(c).split(k), y = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: r, name: y[2], strings: f, ctor: y[1] === "." ? ge : y[1] === "?" ? _e : y[1] === "@" ? fe : G }), s.removeAttribute(c);
        } else c.startsWith(k) && (a.push({ type: 6, index: r }), s.removeAttribute(c));
        if (Ht.test(s.tagName)) {
          const c = s.textContent.split(k), _ = c.length - 1;
          if (_ > 0) {
            s.textContent = q ? q.emptyScript : "";
            for (let f = 0; f < _; f++) s.append(c[f], O()), C.nextNode(), a.push({ type: 2, index: ++r });
            s.append(c[_], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Dt) a.push({ type: 2, index: r });
      else {
        let c = -1;
        for (; (c = s.data.indexOf(k, c + 1)) !== -1; ) a.push({ type: 7, index: r }), c += k.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = P.createElement("template");
    return i.innerHTML = t, i;
  }
}
function z(o, t, e = o, i) {
  if (t === T) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const r = j(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(o), s._$AT(o, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = z(o, s._$AS(o, t.values), s, i)), t;
}
class ue {
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
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? P).importNode(e, !0);
    C.currentNode = s;
    let r = C.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let p;
        a.type === 2 ? p = new Y(r, r.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (p = new me(r, this, t)), this._$AV.push(p), a = i[++l];
      }
      n !== a?.index && (r = C.nextNode(), n++);
    }
    return C.currentNode = P, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class Y {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    t = z(this, t, e), j(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : he(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = B.createElement(Ot(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const r = new ue(s, this), n = r.u(this.options);
      r.p(e), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = St.get(t.strings);
    return e === void 0 && St.set(t.strings, e = new B(t)), e;
  }
  k(t) {
    dt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new Y(this.O(O()), this.O(O()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = vt(t).nextSibling;
      vt(t).remove(), t = i;
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
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = z(this, t, e, 0), n = !j(t) || t !== this._$AH && t !== T, n && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = r[0], a = 0; a < r.length - 1; a++) p = z(this, l[i + a], e, a), p === T && (p = this._$AH[a]), n ||= !j(p) || p !== this._$AH[a], p === d ? t = d : t !== d && (t += (p ?? "") + r[a + 1]), this._$AH[a] = p;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ge extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class _e extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class fe extends G {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = z(this, t, e, 0) ?? d) === T) return;
    const i = this._$AH, s = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== d && (i === d || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class me {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    z(this, t);
  }
}
const be = ct.litHtmlPolyfillSupport;
be?.(B, Y), (ct.litHtmlVersions ??= []).push("3.3.3");
const ve = (o, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = e?.renderBefore ?? null;
    i._$litPart$ = s = new Y(t.insertBefore(O(), r), r, void 0, e ?? {});
  }
  return s._$AI(o), s;
};
const ht = globalThis;
class R extends I {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ve(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return T;
  }
}
R._$litElement$ = !0, R.finalized = !0, ht.litElementHydrateSupport?.({ LitElement: R });
const $e = ht.litElementPolyfillSupport;
$e?.({ LitElement: R });
(ht.litElementVersions ??= []).push("4.2.2");
function pt(o, t) {
  return o.callWS ? o.callWS(t) : Promise.reject(
    new Error("Spatial Presence integration is not connected")
  );
}
function jt(o, t) {
  return pt(o, { type: "spatial_presence/map/get", map_id: t });
}
function Bt(o, t, e) {
  const i = Yt(e);
  return pt(o, {
    type: "spatial_presence/map/save",
    map_id: t,
    title: e.title ?? t,
    config: { ...i, schema_version: "0.1" }
  });
}
function Yt(o) {
  const { type: t, backend_map_id: e, ...i } = o;
  return { ...i, schema_version: "0.1" };
}
function ye(o, t) {
  return pt(o, {
    type: "spatial_presence/map/restore_previous",
    map_id: t
  });
}
const ut = Math.PI / 180;
function X(o) {
  return (o % 360 + 360) % 360;
}
function xe(o, t, e, i) {
  const s = i / 1e3, r = t * s, n = -e * s, l = X(o.heading) * ut;
  return {
    x: o.x + r * Math.cos(l) - n * Math.sin(l),
    y: o.y + r * Math.sin(l) + n * Math.cos(l)
  };
}
function we(o, t, e, i) {
  const s = Math.hypot(t, e), r = Math.hypot(i.x - o.x, i.y - o.y);
  if (s < 100 || r < 1) return;
  const n = Math.atan2(-e, t), l = Math.atan2(i.y - o.y, i.x - o.x);
  return {
    heading: X((l - n) / ut),
    pixelsPerMeter: r * 1e3 / s
  };
}
function st(o, t, e = 1) {
  const i = (o.range_m ?? 6) * t * e, s = (o.fov_degrees ?? 120) / 2, r = At(o, i, -s), n = At(o, i, s), l = s * 2 > 180 ? 1 : 0;
  return [
    `M ${w(o.x)} ${w(o.y)}`,
    `L ${w(r.x)} ${w(r.y)}`,
    `A ${w(i)} ${w(i)} 0 ${l} 1 ${w(n.x)} ${w(n.y)}`,
    "Z"
  ].join(" ");
}
function At(o, t, e) {
  const i = (o.heading + e - 90) * ut;
  return {
    x: o.x + t * Math.cos(i),
    y: o.y + t * Math.sin(i)
  };
}
function w(o) {
  return Math.round(o * 100) / 100;
}
function ke(o, t, e, i) {
  const s = Et(o.width * e, i.width * 0.08, i.width * 4), r = Et(
    o.height * e,
    i.height * 0.08,
    i.height * 4
  ), n = (t.x - o.x) / o.width, l = (t.y - o.y) / o.height;
  return {
    x: t.x - n * s,
    y: t.y - l * r,
    width: s,
    height: r
  };
}
function U(o) {
  return o.map((t) => `${t.x},${t.y}`).join(" ");
}
function ot(o, t, e, i) {
  return {
    x: i.x + (o - e.left) / e.width * i.width,
    y: i.y + (t - e.top) / e.height * i.height
  };
}
function Et(o, t, e) {
  return Math.min(e, Math.max(t, o));
}
const Se = /^sensor\.(.+)_target_([1-9]\d*)_x$/;
function Ae(o) {
  const t = /* @__PURE__ */ new Set();
  for (const e of Object.keys(o.states)) {
    const i = Se.exec(e);
    if (!i) continue;
    const s = i[1], r = i[2];
    s && r && o.states[`sensor.${s}_target_${r}_y`] && t.add(s);
  }
  return [...t].sort();
}
function Mt(o, t) {
  const e = new Set(
    t.flatMap(
      (i) => (i.sensors ?? []).map((s) => s.entity_prefix ?? s.id)
    )
  );
  return Ae(o).filter((i) => !e.has(i));
}
function Ee(o, t) {
  return {
    id: o,
    name: Wt(o),
    entity_prefix: o,
    x: t.width / 2,
    y: t.height * 0.85,
    heading: 0,
    range_m: 6,
    fov_degrees: 120,
    mount: "wall"
  };
}
function Ct(o, t, e = Date.now()) {
  return (t.sensors ?? []).map(
    (i) => Me(o, t, i, e)
  );
}
function Me(o, t, e, i) {
  const s = e.entity_prefix ?? e.id, r = [];
  for (let a = 1; a <= 9; a += 1) {
    const p = o.states[`sensor.${s}_target_${a}_x`], h = o.states[`sensor.${s}_target_${a}_y`];
    if (!p || !h) continue;
    const c = Pt(p), _ = Pt(h), f = Pe(
      o.states[`sensor.${s}_target_${a}_speed`]
    );
    c === void 0 || _ === void 0 || c === 0 && _ === 0 || r.push({
      id: `${t.id}:${e.id}:${a}`,
      floorId: t.id,
      sensorId: e.id,
      sensorName: e.name ?? Wt(s),
      index: a,
      localXmm: c,
      localYmm: _,
      ...f === void 0 ? {} : { speedMmPerSecond: f },
      floorPoint: xe(
        e,
        c,
        _,
        t.pixels_per_meter
      ),
      updatedAt: i
    });
  }
  const n = V(o.states[`sensor.${s}_temperature`]), l = V(o.states[`sensor.${s}_humidity`]);
  return {
    sensor: e,
    targets: r,
    ...n === void 0 ? {} : { temperature: n },
    ...l === void 0 ? {} : { humidity: l },
    online: Ce(o, s),
    discovered: !1
  };
}
function Ce(o, t) {
  const e = o.states[`binary_sensor.${t}_online`] ?? o.states[`binary_sensor.${t}_status`];
  if (e) return e.state === "on";
  const i = o.states[`binary_sensor.${t}_presence`];
  return i ? !["unavailable", "unknown"].includes(i.state) : !0;
}
function Pt(o) {
  const t = V(o);
  if (t === void 0) return;
  const e = String(o.attributes.unit_of_measurement ?? "mm").toLowerCase();
  return e === "m" ? t * 1e3 : e === "cm" ? t * 10 : e === "in" ? t * 25.4 : e === "ft" ? t * 304.8 : t;
}
function Pe(o) {
  if (!o) return;
  const t = V(o);
  if (t === void 0) return;
  const e = String(o.attributes.unit_of_measurement ?? "mm/s").toLowerCase();
  return e === "m/s" ? t * 1e3 : e === "cm/s" ? t * 10 : e === "in/s" ? t * 25.4 : e === "ft/s" ? t * 304.8 : e === "mph" ? t * 447.04 : t;
}
function V(o) {
  if (!o || ["unknown", "unavailable"].includes(o.state)) return;
  const t = Number(o.state);
  return Number.isFinite(t) ? t : void 0;
}
function Wt(o) {
  return o.split("_").filter(Boolean).map((t) => t[0]?.toUpperCase() + t.slice(1)).join(" ");
}
function Ie(o, t = 100) {
  if (!v(o)) throw new Error("Easy Floorplan configuration must be an object");
  const e = o, i = H(e.width, 1e3), s = H(e.height, 700), r = Array.isArray(e.floors) && e.floors.length ? e.floors : [e], n = [], l = /* @__PURE__ */ new Set(), a = r.map((c, _) => {
    const f = L(c.id ?? `floor-${_ + 1}`, l), y = /* @__PURE__ */ new Set(), tt = /* @__PURE__ */ new Set(), et = (c.walls ?? []).flatMap((g, $) => [g.x1, g.y1, g.x2, g.y2].every(S) ? [{
      id: L(String(g.id ?? `wall-${$ + 1}`), y),
      points: [
        { x: Number(g.x1), y: Number(g.y1) },
        { x: Number(g.x2), y: Number(g.y2) }
      ]
    }] : (n.push(`${f}: skipped wall ${g.id ?? $ + 1} with invalid coordinates`), [])), gt = (c.areas ?? []).flatMap((g, $) => {
      const b = qt(g.points);
      return b.length < 3 ? (n.push(`${f}: skipped area ${g.id ?? $ + 1} with fewer than three points`), []) : [{
        id: L(String(g.id ?? `room-${$ + 1}`), tt),
        ...g.name ? { name: g.name } : {},
        ...g.haArea ? { area_id: g.haArea } : {},
        points: b
      }];
    });
    for (const g of ["openings", "items", "texts", "furniture", "trackers"]) {
      const $ = c[g]?.length ?? 0;
      $ && n.push(`${f}: ${$} ${g} retained only by Easy Floorplan`);
    }
    return {
      id: f,
      name: c.name ?? `Floor ${_ + 1}`,
      width: i,
      height: s,
      pixels_per_meter: H(t, 100),
      ...Vt(c.image) ? { background: c.image } : {},
      walls: et,
      rooms: gt,
      zones: [],
      sensors: []
    };
  });
  n.unshift("Easy Floorplan has no physical scale; verify pixels per metre after import");
  const p = r.findIndex(
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
function Re(o) {
  const t = o.floors[0];
  if (!t) throw new Error("Spatial map has no floors");
  return {
    type: "custom:easy-floorplan-card",
    title: o.title,
    width: t.width,
    height: t.height,
    defaultFloor: o.default_floor,
    floors: o.floors.map((e) => ({
      id: e.id,
      name: e.name,
      ...e.background ? { image: e.background, imageFit: "contain" } : {},
      walls: (e.walls ?? []).flatMap(
        (i) => i.points.slice(0, -1).map((s, r) => {
          const n = i.points[r + 1];
          return {
            id: `${i.id}-${r + 1}`,
            x1: s.x,
            y1: s.y,
            x2: n.x,
            y2: n.y
          };
        })
      ),
      areas: (e.rooms ?? []).map((i) => ({
        id: i.id,
        name: i.name,
        haArea: i.area_id,
        points: i.points
      })),
      openings: [],
      items: [],
      texts: [],
      furniture: [],
      trackers: []
    }))
  };
}
function Te(o) {
  if (!v(o)) throw new Error("Radar Map Manager backup must be an object");
  const t = v(o.maps) ? o.maps : {}, e = Object.keys(t).length ? t : { default: {} }, i = v(o.radars) ? o.radars : {}, s = [
    "Radar Map Manager uses percentage coordinates; verify floor scale and background alignment",
    "Fusion and smoothing settings stay in Radar Map Manager and are not imported"
  ], r = /* @__PURE__ */ new Set();
  return {
    map: {
      schema_version: "0.1",
      title: "Imported Radar Map Manager map",
      auto_discover: !0,
      target_trail_seconds: 8,
      floors: Object.entries(e).map(([l, a], p) => {
        const h = v(a) ? a : {}, c = v(h.config) ? h.config : {}, _ = 1e3, f = 1e3, y = /* @__PURE__ */ new Set(), tt = Object.entries(i).flatMap(([b, x]) => {
          if (!v(x) || String(x.map_group ?? "default") !== l) return [];
          const A = v(x.layout) ? x.layout : {}, Qt = H(A.scale_x, 5), Gt = H(A.scale_y, 5);
          return Math.abs(Qt - Gt) > 0.01 && s.push(`${l}/${b}: non-uniform RMM scale requires manual calibration`), Array.isArray(x.monitor_zones) && x.monitor_zones.length && s.push(`${l}/${b}: radar-local monitor zones require manual review`), [{
            id: L(b, y),
            name: b,
            entity_prefix: Xt(b),
            x: It(A.origin_x, 50) * _,
            y: It(A.origin_y, 50) * f,
            heading: S(A.rotation) ? Number(A.rotation) : 0,
            range_m: 6,
            fov_degrees: 120,
            mount: A.ceiling_mount ? "ceiling" : "wall"
          }];
        }), et = v(h.zones) ? h.zones : {}, g = [
          ["include_zones", "detection"],
          ["exclude_zones", "exclusion"],
          ["entrance_zones", "entrance"],
          ["stationary_zones", "stationary"]
        ].flatMap(
          ([b, x]) => ze(et[b], b, _, f, x, s)
        ), $ = [c.bg_image, c.background_image, c.background].find((b) => Vt(b));
        return {
          id: L(l || `floor-${p + 1}`, r),
          name: l === "default" ? "Main floor" : l,
          width: _,
          height: f,
          pixels_per_meter: 100,
          ...typeof $ == "string" ? { background: $ } : {},
          walls: [],
          rooms: [],
          zones: g,
          sensors: tt
        };
      })
    },
    warnings: s
  };
}
function ze(o, t, e, i, s, r) {
  return Array.isArray(o) ? o.flatMap((n, l) => {
    const a = v(n) && Array.isArray(n.points) ? n.points : n, p = qt(a).map((h) => ({
      x: Math.abs(h.x) <= 100 ? h.x / 100 * e : h.x,
      y: Math.abs(h.y) <= 100 ? h.y / 100 * i : h.y
    }));
    return p.length < 3 ? (r.push(`${t}[${l}]: skipped zone with fewer than three points`), []) : [{
      id: `${t}-${l + 1}`,
      name: v(n) && typeof n.name == "string" ? n.name : `${s} ${l + 1}`,
      kind: s,
      points: p
    }];
  }) : [];
}
function qt(o) {
  return Array.isArray(o) ? o.flatMap((t) => Array.isArray(t) && S(t[0]) && S(t[1]) ? [{ x: Number(t[0]), y: Number(t[1]) }] : v(t) && S(t.x) && S(t.y) ? [{ x: Number(t.x), y: Number(t.y) }] : []) : [];
}
function v(o) {
  return typeof o == "object" && o !== null && !Array.isArray(o);
}
function S(o) {
  return typeof o == "number" && Number.isFinite(o);
}
function H(o, t) {
  return S(o) && Number(o) > 0 ? Number(o) : t;
}
function It(o, t) {
  const e = S(o) ? Number(o) : t;
  return Math.max(0, Math.min(100, e)) / 100;
}
function Xt(o) {
  return o.toLowerCase().trim().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "item";
}
function L(o, t) {
  const e = Xt(o);
  let i = e, s = 2;
  for (; t.has(i); ) i = `${e}_${s++}`;
  return t.add(i), i;
}
function Vt(o) {
  return typeof o == "string" && /^(\/|https?:\/\/)/i.test(o.trim());
}
const Fe = "0.1.0-alpha.10", Zt = { states: {} }, J = class J extends R {
  constructor() {
    super(...arguments), this.hass = Zt, this.editorMode = !1, this._floorId = "", this._view = { x: 0, y: 0, width: 1200, height: 800 }, this._tool = "pan", this._draftPoints = [], this._showCoverage = !0, this._showTrails = !0, this._layoutEditing = !1, this._layoutDirty = !1, this._storageStatus = "", this._undoStack = [], this._redoStack = [], this._pointerMoved = !1, this._trails = /* @__PURE__ */ new Map(), this._fit = () => {
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
      backend_map_id: "house",
      auto_discover: !0,
      target_trail_seconds: 8,
      stationary_hold_seconds: 30,
      floors: [Jt()]
    };
  }
  setConfig(t) {
    if (!Array.isArray(t.floors) || t.floors.length === 0)
      throw new Error("Add at least one floor to Spatial Presence.");
    const e = this._config?.backend_map_id;
    this._config = M(t), e !== this._config.backend_map_id && (this._loadedMapId = void 0, this._loadingMapId = void 0);
    const i = t.default_floor;
    (!this._floorId || !this._config.floors.some((s) => s.id === this._floorId)) && (this._floorId = (i && this._config.floors.some((s) => s.id === i) ? i : this._config.floors[0]?.id) ?? "", this._fit()), this._loadStoredLayout();
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return { rows: 6, columns: 12, min_rows: 4 };
  }
  willUpdate(t) {
    t.has("hass") && this._captureTrails(), t.has("hass") && this._loadStoredLayout();
  }
  render() {
    const t = this._config, e = this._floor;
    if (!t || !e)
      return u`<ha-card><p class="empty">Add a floor to begin.</p></ha-card>`;
    const i = Ct(this.hass, e), s = t.auto_discover === !1 ? [] : Mt(this.hass, t.floors), r = i.find(
      (a) => a.sensor.id === this._selectedSensorId
    ), n = i.reduce(
      (a, p) => a + p.targets.length,
      0
    ), l = i.filter((a) => a.online).length;
    return u`
      <ha-card>
        <section class="shell ${this._isEditing ? "editing" : ""}" aria-label=${t.title ?? "Spatial presence"}>
          <div class="chrome">
            ${this._renderToolbar(
      t,
      e,
      n,
      l,
      i.length
    )}
            ${this._isEditing && s.length > 0 ? this._renderUnassignedTray(s, e) : d}
          </div>
          <div class="workspace">
            ${this._renderMap(e, i, s.length)}
            ${r ? this._renderInspector(r, e) : d}
          </div>
          ${this._isEditing || this._storageStatus ? this._renderEditorHint() : d}
        </section>
      </ha-card>
    `;
  }
  _renderToolbar(t, e, i, s, r) {
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
          <strong>${i}</strong>
          <span>${i === 1 ? "live target" : "live targets"}</span>
          <span class="summary-divider" aria-hidden="true"></span>
          <span>${s}/${r} ${r === 1 ? "radar" : "radars"} online</span>
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
          ${this.editorMode ? d : this._layoutEditing ? u`
                  <span class="tool-separator" aria-hidden="true"></span>
                  <button type="button" @click=${this._undo} ?disabled=${this._undoStack.length === 0}>Undo</button>
                  <button type="button" @click=${this._redo} ?disabled=${this._redoStack.length === 0}>Redo</button>
                  <button type="button" @click=${this._cancelLayoutEditing}>Cancel</button>
                  <button
                    type="button"
                    class="commit"
                    @click=${this._saveLayout}
                    aria-label=${this._layoutDirty ? "Save layout changes" : "Save layout"}
                  >Save layout</button>
                ` : u`<button type="button" class="edit-layout" @click=${this._beginLayoutEditing}>Edit layout</button>`}
          ${this._isEditing ? u`
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
  _renderUnassignedTray(t, e) {
    return u`
      <section class="setup-tray" aria-label="Unplaced radars">
        <div>
          <strong>Unplaced radars</strong>
          <span>Choose one to place on ${e.name}.</span>
        </div>
        <div class="setup-actions">
          ${t.map(
      (i) => u`<button
              type="button"
              @click=${() => this._placeDiscoveredRadar(i, e)}
            >Place ${Ne(i)}</button>`
    )}
        </div>
      </section>
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
  _renderMap(t, e, i) {
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
          ${t.background ? m`<image
                class="background"
                href=${t.background}
                width=${t.width}
                height=${t.height}
                preserveAspectRatio="xMidYMid meet"
              ></image>` : d}
          <g class="rooms">${(t.rooms ?? []).map((r) => this._renderRoom(r))}</g>
          <g class="zones">${(t.zones ?? []).map((r) => this._renderZone(r))}</g>
          <g class="walls">${(t.walls ?? []).map((r) => this._renderWall(r))}</g>
          ${this._showCoverage ? m`<g class="coverage">${e.map((r) => this._renderCoverage(r, t))}</g>` : d}
          ${this._showTrails ? this._renderTrails(e) : d}
          <g class="targets">
            ${e.flatMap(
      (r) => r.targets.map((n) => this._renderTarget(n))
    )}
          </g>
          <g class="sensors">
            ${e.map((r) => this._renderSensor(r))}
          </g>
          ${this._draftPoints.length ? m`<polyline class="draft" points=${U(this._draftPoints)}></polyline>
                ${this._draftPoints.map(
      (r) => m`<circle class="draft-point" cx=${r.x} cy=${r.y} r="6"></circle>`
    )}` : d}
        </svg>
        ${e.length === 0 ? u`<div class="map-empty">
              <strong>No radar placed on ${t.name}</strong>
              <span>${this._isEditing && i > 0 ? "Choose an unplaced radar above, then drag it into position." : "Use Edit layout to place a radar on this floor."}</span>
            </div>` : d}
      </div>
    `;
  }
  _renderRoom(t) {
    return m`
      <polygon points=${U(t.points)}></polygon>
      ${t.name && t.points[0] ? m`<text x=${t.points[0].x + 12} y=${t.points[0].y + 24}>${t.name}</text>` : d}
    `;
  }
  _renderZone(t) {
    return m`<polygon points=${U(t.points)}></polygon>`;
  }
  _renderWall(t) {
    return m`<polyline points=${U(t.points)}></polyline>`;
  }
  _renderCoverage(t, e) {
    const i = t.sensor;
    return m`
      <path class="coverage-fringe" d=${st(i, e.pixels_per_meter, 1)}></path>
      <path class="coverage-usable" d=${st(i, e.pixels_per_meter, 0.72)}></path>
      <path class="coverage-strong" d=${st(i, e.pixels_per_meter, 0.4)}></path>
    `;
  }
  _renderTrails(t) {
    const e = Date.now() - (this._config?.target_trail_seconds ?? 8) * 1e3, i = this._floor?.id, s = [...this._trails.entries()].map(([r, n]) => {
      if (!i || !n.some((a) => a.floorId === i))
        return d;
      const l = n.filter((a) => a.updatedAt >= e);
      return l.length > 1 ? m`<polyline class="trail" data-track=${r} points=${U(
        l.map((a) => a.floorPoint)
      )}></polyline>` : d;
    });
    return m`<g class="trails">${s}</g>`;
  }
  _renderTarget(t) {
    const e = this._targetMotion(t), i = e.moving ? "moving" : "stationary", s = t.speedMmPerSecond === void 0 ? "" : ` at ${(Math.abs(t.speedMmPerSecond) / 1e3).toFixed(1)} metres per second`;
    return m`
      <g
        class="target ${e.moving ? "moving" : "stationary"}"
        data-motion=${i}
        data-speed-mm-s=${t.speedMmPerSecond ?? "unknown"}
        style="transform: translate(${t.floorPoint.x}px, ${t.floorPoint.y}px); --walk-cycle: ${e.cycleSeconds}s; --motion-cycle: ${e.cycleSeconds * 2}s"
        role="img"
        aria-label="Target ${t.index}, ${i}${s}"
      >
        <title>Target ${t.index} · ${i}${s}</title>
        <circle class="target-halo" r="40"></circle>
        ${e.moving ? m`<circle class="motion-ring" r="34"></circle>` : d}
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
      const i = [...this._trails.get(t.id) ?? []].reverse().find((s) => s.updatedAt < t.updatedAt);
      if (i) {
        const s = (t.updatedAt - i.updatedAt) / 1e3;
        if (s > 0) {
          const r = Math.hypot(
            t.floorPoint.x - i.floorPoint.x,
            t.floorPoint.y - i.floorPoint.y
          ), n = this._floor?.pixels_per_meter ?? 100;
          e = r / n / s * 1e3;
        }
      }
    }
    return {
      moving: e >= 80,
      cycleSeconds: Math.min(1.05, Math.max(0.42, 800 / Math.max(e, 1)))
    };
  }
  _renderSensor(t) {
    const e = t.sensor, i = e.id === this._selectedSensorId;
    return m`
      <g
        class="sensor ${i ? "selected" : ""} ${t.online ? "" : "offline"} ${this._isEditing ? "movable" : ""}"
        data-sensor=${e.id}
        transform="translate(${e.x} ${e.y}) rotate(${e.heading})"
        tabindex="0"
        role="button"
        aria-label="${e.name ?? e.id} radar${this._isEditing ? ", use arrow keys to move" : ""}"
        @keydown=${this._sensorKeyDown}
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
        <dl>
          <div><dt>Targets</dt><dd>${t.targets.length}</dd></div>
          <div><dt>Position</dt><dd>${Math.round(i.x)}, ${Math.round(i.y)}</dd></div>
          <div><dt>Heading</dt><dd>${Math.round(X(i.heading))}°</dd></div>
          <div><dt>Range</dt><dd>${i.range_m ?? 6} m</dd></div>
          ${t.temperature === void 0 ? d : u`<div><dt>Temperature</dt><dd>${t.temperature.toFixed(1)}°</dd></div>`}
          ${t.humidity === void 0 ? d : u`<div><dt>Humidity</dt><dd>${t.humidity.toFixed(1)}%</dd></div>`}
        </dl>
        ${this._isEditing ? u`
              <label class="floor-control">
                <span>Floor</span>
                <select @change=${(s) => this._moveSensorToFloor(
      i,
      s.target.value
    )}>
                  ${this._config?.floors.map((s) => u`<option
                    value=${s.id}
                    ?selected=${s.id === e.id}
                  >${s.name}</option>`)}
                </select>
              </label>
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
              <div class="placement-actions">
                <button type="button" @click=${() => this._unplaceSensor(i)}>
                  Remove from this floor
                </button>
              </div>
              <small>${e.pixels_per_meter} canvas px per metre</small>
              ${this._renderCalibration(t, e)}
            ` : d}
      </aside>
    `;
  }
  _renderCalibration(t, e) {
    const i = this._calibration;
    return !i || i.sensorId !== t.sensor.id ? u`
        <div class="calibration-start">
          <button type="button" @click=${() => this._startCalibration(t.sensor)}>
            Calibrate placement
          </button>
          <small>Align the floor scale and radar direction with one live reference point.</small>
        </div>
      ` : i.step === "place" ? u`
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
      ` : i.step === "reference" ? u`
        <div class="calibration-panel" role="group" aria-label="Radar calibration step 2">
          <strong>Mark the person’s location</strong>
          <p>Have one person stand at a recognizable spot, choose their target, then click that spot on the floorplan.</p>
          <label>
            <span>Live target</span>
            <select @change=${this._calibrationTargetChanged}>
              ${t.targets.map(
      (s) => u`<option
                  value=${s.index}
                  ?selected=${s.index === i.targetIndex}
                >Target ${s.index} · ${(Math.hypot(s.localXmm, s.localYmm) / 1e3).toFixed(2)} m</option>`
    )}
            </select>
          </label>
          <div class="calibration-actions">
            <button type="button" @click=${() => this._calibration = { ...i, step: "place" }}>Back</button>
            <button type="button" @click=${this._cancelCalibration}>Cancel</button>
          </div>
          ${i.message ? u`<small class="calibration-error">${i.message}</small>` : d}
          <small>Current scale: ${e.pixels_per_meter.toFixed(1)} px/m</small>
        </div>
      ` : u`
      <div class="calibration-panel calibration-done" role="status">
        <strong>Calibration applied</strong>
        <p>${i.message}</p>
        <div class="calibration-actions">
          <button type="button" @click=${() => this._startCalibration(t.sensor)}>Calibrate again</button>
          <button type="button" @click=${this._cancelCalibration}>Done</button>
        </div>
      </div>
    `;
  }
  _renderEditorHint() {
    const t = this._tool === "pan" ? "Drag a radar to place it. Arrow keys move 5 cm; hold Shift for 25 cm." : `Click to add ${this._tool} points, then choose Finish ${this._tool}.`;
    return u`<footer class="editor-hint">
      <span>${t}</span>
      ${this._storageStatus ? u`<strong role="status">${this._storageStatus}</strong>` : d}
    </footer>`;
  }
  _changeFloor(t) {
    this._floorId = t.target.value, this.dispatchEvent(
      new CustomEvent("spatial-floor-changed", {
        detail: { floorId: this._floorId },
        bubbles: !0,
        composed: !0
      })
    ), this._selectedSensorId = void 0, this._draftPoints = [], this._calibration = void 0, this._drag = void 0, this._fit();
  }
  _wheel(t) {
    const e = this._floor, i = t.currentTarget;
    if (!e) return;
    t.preventDefault();
    const s = ot(
      t.clientX,
      t.clientY,
      i.getBoundingClientRect(),
      this._view
    );
    this._view = ke(
      this._view,
      s,
      t.deltaY > 0 ? 1.12 : 0.88,
      e
    );
  }
  _pointerDown(t) {
    const i = t.target.closest("[data-sensor]");
    if (t.currentTarget.setPointerCapture(t.pointerId), this._pointerMoved = !1, i) {
      const r = i.dataset.sensor;
      if (!r) return;
      this._selectedSensorId = r, this._isEditing && this._tool === "pan" && this._calibration?.step !== "reference" && (this._recordHistory(), this._drag = { kind: "sensor", sensorId: r });
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
      const n = this._drag.sensorId, l = this._clampToFloor(ot(
        t.clientX,
        t.clientY,
        e.getBoundingClientRect(),
        this._view
      )), a = this._runtimes.find(
        (p) => p.sensor.id === n
      )?.sensor;
      a && this._updateSensor(a, l, !1);
      return;
    }
    const i = e.getBoundingClientRect(), s = this._drag.view.width / i.width, r = this._drag.view.height / i.height;
    this._view = {
      ...this._drag.view,
      x: this._drag.view.x - (t.clientX - this._drag.clientX) * s,
      y: this._drag.view.y - (t.clientY - this._drag.clientY) * r
    };
  }
  _pointerUp(t) {
    const e = t.currentTarget;
    e.hasPointerCapture(t.pointerId) && e.releasePointerCapture(t.pointerId), this._drag?.kind === "sensor" && (this._pointerMoved ? this._emitConfig() : this._undoStack = this._undoStack.slice(0, -1)), this._drag = void 0;
  }
  _mapClick(t) {
    if (!this._isEditing || this._pointerMoved) return;
    const e = t.currentTarget, i = ot(
      t.clientX,
      t.clientY,
      e.getBoundingClientRect(),
      this._view
    );
    if (this._calibration?.step === "reference") {
      this._applyCalibration(i);
      return;
    }
    this._tool !== "pan" && (this._draftPoints = [...this._draftPoints, i]);
  }
  _finishDrawing() {
    const t = this._floor;
    if (!t || !this._config) return;
    const e = this._tool === "wall" ? 2 : 3;
    if (this._draftPoints.length < e) return;
    const i = {
      id: `${this._tool}-${crypto.randomUUID()}`,
      ...this._tool === "room" ? { name: `Room ${(t.rooms?.length ?? 0) + 1}` } : this._tool === "zone" ? {
        name: `Zone ${(t.zones?.length ?? 0) + 1}`,
        kind: "detection"
      } : {},
      points: [...this._draftPoints]
    }, s = this._tool === "room" ? "rooms" : this._tool === "zone" ? "zones" : "walls";
    this._recordHistory(), this._replaceFloor({ ...t, [s]: [...t[s] ?? [], i] }), this._draftPoints = [], this._emitConfig();
  }
  _rotateSensor(t, e) {
    this._updateSensor(t, { heading: X(t.heading + e) });
  }
  _sensorKeyDown(t) {
    const e = t.currentTarget.dataset.sensor;
    if (!e || (this._selectedSensorId = e, !this._isEditing)) return;
    const i = this._runtimes.find(
      (l) => l.sensor.id === e
    )?.sensor;
    if (!i) return;
    const s = (this._floor?.pixels_per_meter ?? 100) * (t.shiftKey ? 0.25 : 0.05), n = {
      ArrowLeft: { x: -s, y: 0 },
      ArrowRight: { x: s, y: 0 },
      ArrowUp: { x: 0, y: -s },
      ArrowDown: { x: 0, y: s }
    }[t.key];
    n && (t.preventDefault(), this._updateSensor(
      i,
      this._clampToFloor({
        x: i.x + n.x,
        y: i.y + n.y
      })
    ));
  }
  _moveSensorToFloor(t, e) {
    const i = this._floor, s = this._config?.floors.find((n) => n.id === e);
    if (!this._config || !i || !s || i.id === s.id) return;
    this._recordHistory();
    const r = {
      ...t,
      x: s.width / 2,
      y: s.height * 0.85
    };
    this._config = {
      ...this._config,
      floors: this._config.floors.map((n) => n.id === i.id ? {
        ...n,
        sensors: (n.sensors ?? []).filter((l) => l.id !== t.id)
      } : n.id === s.id ? { ...n, sensors: [...n.sensors ?? [], r] } : n),
      default_floor: s.id
    }, this._floorId = s.id, this._selectedSensorId = r.id, this._fit(), this._emitConfig();
  }
  _placeDiscoveredRadar(t, e) {
    if (!this._config || !this._unassignedPrefixes.includes(t)) return;
    this._recordHistory();
    const i = Ee(t, e);
    this._replaceFloor({
      ...e,
      sensors: [...e.sensors ?? [], i]
    }), this._selectedSensorId = i.id, this._emitConfig();
  }
  _unplaceSensor(t) {
    const e = this._floor;
    e && (this._recordHistory(), this._replaceFloor({
      ...e,
      sensors: (e.sensors ?? []).filter((i) => i.id !== t.id)
    }), this._selectedSensorId = void 0, this._calibration = void 0, this._emitConfig());
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
    const e = this._floor, i = this._calibration;
    if (!e || !i || i.step !== "reference") return;
    const s = this._runtimes.find(
      (a) => a.sensor.id === i.sensorId
    ), r = s?.targets.find(
      (a) => a.index === i.targetIndex
    );
    if (!s || !r) {
      this._calibration = {
        ...i,
        message: "That live target disappeared. Choose a visible target and try again."
      };
      return;
    }
    const n = we(
      s.sensor,
      r.localXmm,
      r.localYmm,
      t
    );
    if (!n) {
      this._calibration = {
        ...i,
        message: "Use a reference point at least 10 cm from the radar."
      };
      return;
    }
    this._recordHistory();
    const l = (e.sensors ?? []).map(
      (a) => a.id === s.sensor.id ? { ...a, heading: n.heading } : a
    );
    l.some((a) => a.id === s.sensor.id) || l.push({ ...s.sensor, heading: n.heading }), this._replaceFloor({
      ...e,
      pixels_per_meter: n.pixelsPerMeter,
      sensors: l
    }), this._emitConfig(), this._calibration = {
      sensorId: s.sensor.id,
      step: "done",
      message: `Heading ${n.heading.toFixed(1)}° · scale ${n.pixelsPerMeter.toFixed(1)} px/m`
    };
  }
  _beginLayoutEditing() {
    this._config && (this._layoutSnapshot = structuredClone(this._config), this._undoStack = [], this._redoStack = [], this._layoutDirty = !1, this._layoutEditing = !0, this._storageStatus = "Editing layout. Drag a radar or use its arrow keys.", this._tool = "pan", this._draftPoints = []);
  }
  _cancelLayoutEditing() {
    this._layoutSnapshot && (this._config = structuredClone(this._layoutSnapshot)), this._layoutEditing = !1, this._layoutDirty = !1, this._layoutSnapshot = void 0, this._undoStack = [], this._redoStack = [], this._selectedSensorId = void 0, this._storageStatus = "Layout changes discarded.", this._ensureActiveFloor(), this._fit();
  }
  async _saveLayout() {
    const t = this._config, e = t?.backend_map_id;
    if (!t || !e) {
      this._storageStatus = "Set a saved map id in the card settings before saving.";
      return;
    }
    this._storageStatus = "Saving layout…";
    try {
      const i = await Bt(this.hass, e, t);
      this._loadedMapId = e, this._layoutSnapshot = structuredClone(t), this._layoutDirty = !1, this._layoutEditing = !1, this._undoStack = [], this._redoStack = [], this._storageStatus = `Layout saved · revision ${i.revision}.`;
    } catch (i) {
      this._storageStatus = `Layout was not saved: ${N(i)}`;
    }
  }
  _undo() {
    const t = this._undoStack.at(-1);
    !t || !this._config || (this._redoStack = [...this._redoStack, structuredClone(this._config)].slice(-50), this._undoStack = this._undoStack.slice(0, -1), this._config = structuredClone(t), this._floorId = this._config.default_floor ?? this._config.floors[0]?.id ?? "", this._layoutDirty = !0, this._storageStatus = "Undid the last layout change.", this._ensureActiveFloor(), this._emitConfig());
  }
  _redo() {
    const t = this._redoStack.at(-1);
    !t || !this._config || (this._undoStack = [...this._undoStack, structuredClone(this._config)].slice(-50), this._redoStack = this._redoStack.slice(0, -1), this._config = structuredClone(t), this._floorId = this._config.default_floor ?? this._config.floors[0]?.id ?? "", this._layoutDirty = !0, this._storageStatus = "Redid the layout change.", this._ensureActiveFloor(), this._emitConfig());
  }
  _recordHistory() {
    !this._config || !this._isEditing || (this._undoStack = [...this._undoStack, structuredClone(this._config)].slice(-50), this._redoStack = []);
  }
  _clampToFloor(t) {
    const e = this._floor;
    return e ? {
      x: Math.min(e.width, Math.max(0, t.x)),
      y: Math.min(e.height, Math.max(0, t.y))
    } : t;
  }
  async _loadStoredLayout() {
    const t = this._config?.backend_map_id;
    if (!(!t || !this.hass.callWS || this.editorMode || this._layoutEditing || this._loadedMapId === t || this._loadingMapId === t)) {
      this._loadingMapId = t;
      try {
        const e = await jt(this.hass, t);
        if (this._config?.backend_map_id !== t || this._layoutEditing) return;
        this._config = M({
          ...this._config,
          ...e.config,
          type: "custom:spatial-presence-card",
          backend_map_id: t
        }), this._ensureActiveFloor(), this._fit();
      } catch {
      } finally {
        this._loadedMapId = t, this._loadingMapId = void 0;
      }
    }
  }
  _ensureActiveFloor() {
    this._config?.floors.some((t) => t.id === this._floorId) || (this._floorId = this._config?.default_floor ?? this._config?.floors[0]?.id ?? "");
  }
  _updateSensor(t, e, i = !0) {
    const s = this._floor;
    if (!s) return;
    i && this._recordHistory();
    const r = [...s.sensors ?? []], n = r.findIndex((a) => a.id === t.id), l = { ...t, ...e };
    n >= 0 ? r[n] = l : r.push(l), this._replaceFloor({ ...s, sensors: r }), i && this._emitConfig();
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
    this._config && (this._layoutEditing && (this._layoutDirty = !0, this._storageStatus = "Unsaved layout changes."), this.dispatchEvent(
      new CustomEvent("spatial-config-changed", {
        detail: structuredClone(this._config),
        bubbles: !0,
        composed: !0
      })
    ));
  }
  _captureTrails() {
    const t = Date.now() - (this._config?.target_trail_seconds ?? 8) * 1e3;
    for (const e of this._runtimes)
      for (const i of e.targets) {
        const s = this._trails.get(i.id) ?? [];
        s.push(i), this._trails.set(
          i.id,
          s.filter((r) => r.updatedAt >= t).slice(-80)
        );
      }
  }
  get _floor() {
    return this._config?.floors.find((t) => t.id === this._floorId);
  }
  get _runtimes() {
    const t = this._floor;
    return t ? Ct(this.hass, t) : [];
  }
  get _unassignedPrefixes() {
    return !this._config || this._config.auto_discover === !1 ? [] : Mt(this.hass, this._config.floors);
  }
  get _isEditing() {
    return this.editorMode || this._layoutEditing;
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
  _calibration: { state: !0 },
  _layoutEditing: { state: !0 },
  _layoutDirty: { state: !0 }
}, J.styles = Ft`
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
      height: max(
        480px,
        calc(100dvh - var(--header-height, 56px) - 16px)
      );
      overflow: hidden;
      background: var(--ha-card-background, #fff);
    }

    .shell {
      height: 100%;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
    }

    .chrome { min-width: 0; }

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

    button:disabled {
      cursor: not-allowed;
      opacity: 0.42;
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

    .setup-tray {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 12px;
      border-bottom: 1px solid color-mix(in srgb, var(--sp-heading) 32%, transparent);
      background: color-mix(in srgb, var(--sp-heading) 10%, var(--sp-paper));
    }

    .setup-tray > div:first-child {
      display: grid;
      gap: 2px;
    }

    .setup-tray span {
      color: var(--sp-muted);
      font-size: 12px;
    }

    .setup-actions {
      display: flex;
      gap: 6px;
      overflow-x: auto;
    }

    .setup-actions button {
      white-space: nowrap;
      border-color: var(--sp-heading);
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

    .sensor.movable { cursor: grab; }
    .sensor.movable:active { cursor: grabbing; }
    .sensor:focus-visible > circle:first-child {
      stroke: var(--sp-heading);
      stroke-width: 6;
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

    .floor-control {
      display: grid;
      gap: 5px;
      color: var(--sp-muted);
      font-size: 12px;
    }

    .floor-control select { width: 100%; }

    .placement-actions {
      display: flex;
      margin: 12px 0;
    }

    .placement-actions button {
      width: 100%;
      color: var(--error-color, #b3261e);
    }

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
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 12px;
      border-top: 1px solid color-mix(in srgb, var(--sp-ink) 14%, transparent);
      background: var(--sp-paper);
      color: var(--sp-muted);
      font-size: 13px;
    }

    .editor-hint strong {
      color: var(--sp-ink);
      font-weight: 650;
      text-align: right;
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
      ha-card {
        height: max(420px, calc(100dvh - var(--header-height, 56px)));
      }
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
      .setup-tray { align-items: stretch; flex-direction: column; }
      .editor-hint { align-items: start; flex-direction: column; }
      .editor-hint strong { text-align: left; }
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
const K = class K extends R {
  constructor() {
    super(...arguments), this.hass = Zt, this._config = {
      type: "custom:spatial-presence-card",
      ...Z.getStubConfig()
    }, this._radarPrefix = "", this._mapId = "house", this._storageStatus = "";
  }
  setConfig(t) {
    this._config = M(t), this._mapId = t.backend_map_id ?? "house";
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
    const i = t.target.value.trim(), s = { ...e };
    i && Kt(i) ? s.background = i : delete s.background, this._replaceFloor(s);
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
  _stationaryHoldChanged(t) {
    const e = Number(t.target.value);
    Number.isFinite(e) && e >= 0 && e <= 3600 && this._commit({ ...this._config, stationary_hold_seconds: e });
  }
  _addFloor() {
    const t = this._config.floors.length + 1, e = Jt(`floor-${t}`, `Floor ${t}`);
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
      id: Ue(e.replace(/[^a-z0-9_]+/gi, "_"), t.sensors ?? []),
      name: e.split("_").map((r) => r[0]?.toUpperCase() + r.slice(1)).join(" "),
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
    Tt(Yt(this._config), "spatial-presence-map.json");
  }
  _exportEasyFloorplan() {
    Tt(
      Re(this._config),
      "spatial-presence-easy-floorplan.json"
    );
  }
  async _importMap(t) {
    const e = t.target, i = e.files?.[0];
    if (!(!i || i.size > 2e6))
      try {
        const s = JSON.parse(await i.text());
        let r, n = [];
        if (s.schema_version === "0.1" && Array.isArray(s.floors))
          r = M({
            ...s,
            type: "custom:spatial-presence-card"
          });
        else if (String(s.type ?? "").includes("easy-floorplan") || Array.isArray(s.areas) || Array.isArray(s.walls)) {
          const l = Ie(s);
          r = M({
            ...l.map,
            type: "custom:spatial-presence-card"
          }), n = l.warnings;
        } else if (Rt(s.maps) || Rt(s.radars)) {
          const l = Te(s);
          r = M({
            ...l.map,
            type: "custom:spatial-presence-card"
          }), n = l.warnings;
        } else
          throw new Error("Use a Spatial Presence, Easy Floorplan or Radar Map Manager JSON file");
        this._commit(r), this._storageStatus = n.length ? `Imported with ${n.length} review note${n.length === 1 ? "" : "s"}: ${n.join(" ")}` : "Map imported.";
      } catch (s) {
        this._storageStatus = `Map was not imported: ${N(s)}`;
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
      const t = await Bt(this.hass, this._mapId, this._config);
      this._commit({ ...this._config, backend_map_id: this._mapId }), this._storageStatus = `Saved revision ${t.revision}.`;
    } catch (t) {
      this._storageStatus = `Map was not saved: ${N(t)}`;
    }
  }
  async _loadBackend() {
    if (!this._validMapId) {
      this._storageStatus = "Enter a valid saved map id first.";
      return;
    }
    this._storageStatus = "Loading map…";
    try {
      const t = await jt(this.hass, this._mapId);
      this._commit(
        M({
          ...t.config,
          type: "custom:spatial-presence-card",
          backend_map_id: this._mapId
        })
      ), this._storageStatus = `Loaded revision ${t.revision}.`;
    } catch (t) {
      this._storageStatus = `Map was not loaded: ${N(t)}`;
    }
  }
  async _restoreBackend() {
    if (!this._validMapId) {
      this._storageStatus = "Enter a valid saved map id first.";
      return;
    }
    this._storageStatus = "Restoring previous revision…";
    try {
      await ye(this.hass, this._mapId), await this._loadBackend();
    } catch (t) {
      this._storageStatus = `Previous revision was not restored: ${N(t)}`;
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
}, K.styles = Ft`
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
function M(o) {
  return {
    ...o,
    type: o.type || "custom:spatial-presence-card",
    schema_version: "0.1",
    auto_discover: o.auto_discover !== !1,
    target_trail_seconds: o.target_trail_seconds ?? 8,
    stationary_hold_seconds: o.stationary_hold_seconds ?? 30,
    floors: o.floors.map((t) => {
      const e = {
        ...t,
        pixels_per_meter: t.pixels_per_meter || 100,
        walls: t.walls ?? [],
        rooms: t.rooms ?? [],
        zones: t.zones ?? [],
        sensors: t.sensors ?? []
      };
      return e.background && !Kt(e.background) && delete e.background, e;
    })
  };
}
function Jt(o = "main", t = "Main floor") {
  return {
    id: o,
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
function Ue(o, t) {
  const e = o || "radar";
  if (!t.some((s) => s.id === e)) return e;
  let i = 2;
  for (; t.some((s) => s.id === `${e}_${i}`); ) i += 1;
  return `${e}_${i}`;
}
function Ne(o) {
  return o.split("_").filter(Boolean).map((t) => t[0]?.toUpperCase() + t.slice(1)).join(" ");
}
function Kt(o) {
  return /^(\/|https?:\/\/)/i.test(o.trim());
}
function N(o) {
  return o instanceof Error ? o.message : String(o);
}
function Rt(o) {
  return typeof o == "object" && o !== null && !Array.isArray(o);
}
function Tt(o, t) {
  const e = JSON.stringify(o, null, 2), i = URL.createObjectURL(new Blob([e], { type: "application/json" })), s = document.createElement("a");
  s.href = i, s.download = t, s.click(), URL.revokeObjectURL(i);
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
  `%c SPATIAL PRESENCE %c ${Fe} `,
  "color:white;background:#14232b;font-weight:700;padding:3px 5px",
  "color:#14232b;background:#f2a93b;font-weight:700;padding:3px 5px"
);
export {
  Z as SpatialPresenceCard,
  nt as SpatialPresenceCardEditor
};
//# sourceMappingURL=spatial-presence-card.js.map
