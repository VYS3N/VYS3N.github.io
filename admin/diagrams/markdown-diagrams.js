import { h as e, m as t, p as n } from "./src-C0C4419k.js";
import { n as r } from "./chunk-Y2CYZVJY-zK79Gbcw.js";
import { $ as i, I as a, J as o, K as s, L as c, N as l, P as u, Q as d, S as f, T as p, V as m, W as h, Z as g, c as _, et as v, f as y, g as b, j as x, l as S, m as C, n as w, p as T, r as ee, t as te, u as E, w as ne, x as D, y as O } from "./chunk-DSNLSHJZ-rrWKZXYM.js";
import { C as re, S as ie, _ as k, a as ae, b as oe, g as se, i as ce, l as le, o as ue, p as de, y as fe } from "./chunk-7S6XSTFO-C5zg77Vw.js";
import { t as pe } from "./chunk-OYAV6JZA-CGlF1XGR.js";
import { n as me, t as he } from "./chunk-LNGE3PJU-B1rGCLA0.js";
import "./chunk-UHW7PFBP-e5NNZ8ET.js";
import { r as ge } from "./chunk-YZO67HFG-B1QBpeH3.js";
import { a as _e } from "./chunk-AQDTSKZB-DS7xV3Yn.js";
import "./chunk-HAGFOTED-GhwjvgF7.js";
import "./chunk-ZAUX2LTX-3yc4NKUv.js";
import "./chunk-HNE4Q36P-DSbbiplR.js";
import "./chunk-WQQL4CDK-n1gstEnW.js";
import { n as ve } from "./chunk-EJLWFMJV-BwwvrKps.js";
// node_modules/es-toolkit/dist/compat/_internal/isPrototype.mjs
function ye(e) {
	let t = e?.constructor;
	return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
// node_modules/es-toolkit/dist/compat/predicate/isEmpty.mjs
function be(e) {
	if (e == null) return !0;
	if (ie(e)) return typeof e.splice != "function" && typeof e != "string" && !re(e) && !fe(e) && !oe(e) ? !1 : e.length === 0;
	if (typeof e == "object" || typeof e == "function") {
		if (e instanceof Map || e instanceof Set) return e.size === 0;
		let t = Object.keys(e);
		return ye(e) ? t.filter((e) => e !== "constructor").length === 0 : t.length === 0;
	}
	return !0;
}
// node_modules/stylis/src/Enum.js
var xe = "comm", Se = "rule", Ce = "decl", we = "@import", Te = "@namespace", Ee = "@keyframes", De = "@layer", Oe = Math.abs, A = String.fromCharCode;
function ke(e) {
	return e.trim();
}
function j(e, t, n) {
	return e.replace(t, n);
}
function M(e, t) {
	return e.charCodeAt(t) | 0;
}
function N(e, t, n) {
	return e.slice(t, n);
}
function P(e) {
	return e.length;
}
function Ae(e) {
	return e.length;
}
function F(e, t) {
	return t.push(e), e;
}
// node_modules/stylis/src/Tokenizer.js
var I = 1, L = 1, je = 0, R = 0, z = 0, B = "";
function Me(e, t, n, r, i, a, o, s) {
	return {
		value: e,
		root: t,
		parent: n,
		type: r,
		props: i,
		children: a,
		line: I,
		column: L,
		length: o,
		return: "",
		siblings: s
	};
}
function Ne() {
	return z;
}
function Pe() {
	return z = R > 0 ? M(B, --R) : 0, L--, z === 10 && (L = 1, I--), z;
}
function V() {
	return z = R < je ? M(B, R++) : 0, L++, z === 10 && (L = 1, I++), z;
}
function H() {
	return M(B, R);
}
function U() {
	return R;
}
function W(e, t) {
	return N(B, e, t);
}
function G(e) {
	switch (e) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
function Fe(e) {
	return I = L = 1, je = P(B = e), R = 0, [];
}
function Ie(e) {
	return B = "", e;
}
function Le(e) {
	return ke(W(R - 1, Be(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Re(e) {
	for (; (z = H()) && z < 33;) V();
	return G(e) > 2 || G(z) > 3 ? "" : " ";
}
function ze(e, t) {
	for (; --t && V() && !(z < 48 || z > 102 || z > 57 && z < 65 || z > 70 && z < 97););
	return W(e, U() + (t < 6 && H() == 32 && V() == 32));
}
function Be(e) {
	for (; V();) switch (z) {
		case e: return R;
		case 34:
		case 39:
			e !== 34 && e !== 39 && Be(z);
			break;
		case 40:
			e === 41 && Be(e);
			break;
		case 92: V();
	}
	return R;
}
function Ve(e, t) {
	for (; V() && e + z !== 57 && (e + z !== 84 || H() !== 47););
	return "/*" + W(t, R - 1) + "*" + A(e === 47 ? e : V());
}
function He(e) {
	for (; !G(H());) V();
	return W(e, R);
}
// node_modules/stylis/src/Parser.js
function Ue(e) {
	return Ie(K("", null, null, null, [""], e = Fe(e), 0, [0], e));
}
function K(e, t, n, r, i, a, o, s, c) {
	for (var l = 0, u = 0, d = o, f = 0, p = 0, m = 0, h = 1, g = 1, _ = 1, v = 0, y = 0, b = "", x = i, S = a, C = r, w = b; g;) switch (m = y, y = V()) {
		case 40:
			m != 108 && M(w, d - 1) == 58 ? (v++, w += "(") : w += Le(y);
			break;
		case 41:
			v--, w += ")";
			break;
		case 34:
		case 39:
		case 91:
			w += Le(y);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			if (v > 0) {
				w += A(y);
				break;
			}
			w += Re(m);
			break;
		case 92:
			w += ze(U() - 1, 7);
			continue;
		case 47:
			switch (H()) {
				case 42:
				case 47:
					F(Ge(Ve(V(), U()), t, n, c), c), (G(m || 1) == 5 || G(H() || 1) == 5) && P(w) && N(w, -1, void 0) !== " " && (w += " ");
					break;
				default: w += "/";
			}
			break;
		case 123 * h: s[l++] = P(w) * _;
		case 125 * h:
		case 59:
		case 0:
			if (v > 0 && y) {
				w += A(y);
				break;
			}
			switch (y) {
				case 0:
				case 125: g = 0;
				case 59 + u:
					_ == -1 && (w = j(w, /\f/g, "")), p > 0 && (P(w) - d || h === 0) && F(p > 32 ? Ke(w + ";", r, n, d - 1, c) : Ke(j(w, " ", "") + ";", r, n, d - 2, c), c);
					break;
				case 59: w += ";";
				default: if (F(C = We(w, t, n, l, u, i, s, b, x = [], S = [], d, a), a), y === 123) {
					if (u === 0) K(w, t, C, C, x, a, d, s, S);
					else {
						switch (f) {
							case 99: if (M(w, 3) === 110) break;
							case 108: if (M(w, 2) === 97) break;
							default: u = 0;
							case 100:
							case 109:
							case 115:
						}
						u ? K(e, C, C, r && F(We(e, C, C, 0, 0, i, s, b, i, x = [], d, S), S), i, S, d, s, r ? x : S) : K(w, C, C, C, [""], S, 0, s, S);
					}
				}
			}
			l = u = p = 0, h = _ = 1, b = w = "", d = o;
			break;
		case 58: d = 1 + P(w), p = m;
		default:
			if (h < 1) {
				if (y == 123) --h;
				else if (y == 125 && h++ == 0 && Pe() == 125) continue;
			}
			switch (w += A(y), y * h) {
				case 38:
					_ = u > 0 ? 1 : (w += "\f", -1);
					break;
				case 44:
					if (v > 0) break;
					s[l++] = (P(w) - 1) * _, _ = 1;
					break;
				case 64:
					H() === 45 && (w += Le(V())), f = H(), u = d = P(b = w += He(U())), y++;
					break;
				case 45: m === 45 && P(w) == 2 && (h = 0);
			}
	}
	return a;
}
function We(e, t, n, r, i, a, o, s, c, l, u, d) {
	for (var f = i - 1, p = i === 0 ? a : [""], m = Ae(p), h = 0, g = 0, _ = 0; h < r; ++h) for (var v = 0, y = N(e, f + 1, f = Oe(g = o[h])), b = e; v < m; ++v) (b = ke(g > 0 ? p[v] + " " + y : j(y, /&\f/g, p[v]))) && (c[_++] = b);
	return Me(e, t, n, i === 0 ? Se : s, c, l, u, d);
}
function Ge(e, t, n, r) {
	return Me(e, t, n, xe, A(Ne()), N(e, 2, -2), 0, r);
}
function Ke(e, t, n, r, i) {
	return Me(e, t, n, Ce, N(e, 0, r), N(e, r + 1, -1), r, i);
}
// node_modules/stylis/src/Serializer.js
function qe(e, t) {
	for (var n = "", r = 0; r < e.length; r++) n += t(e[r], r, e, t) || "";
	return n;
}
function Je(e, t, n, r) {
	switch (e.type) {
		case De: if (e.children.length) break;
		case we:
		case Te:
		case Ce: return e.return = e.return || e.value;
		case xe: return "";
		case Ee: return e.return = e.value + "{" + qe(e.children, r) + "}";
		case Se: if (!P(e.value = e.props.join(","))) return "";
	}
	return P(n = qe(e.children, r)) ? e.return = e.value + "{" + n + "}" : "";
}
// node_modules/stylis/src/Middleware.js
function Ye(e) {
	var t = Ae(e);
	return function(n, r, i, a) {
		for (var o = "", s = 0; s < t; s++) o += e[s](n, r, i, a) || "";
		return o;
	};
}
// node_modules/mermaid/dist/mermaid.core.mjs
var Xe = "c4", Ze = {
	id: Xe,
	detector: /* @__PURE__ */ r((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./c4Diagram-XDPPPE54-CFNcP5Vf.js");
		return {
			id: Xe,
			diagram: e
		};
	}, "loader")
}, Qe = "flowchart-v2", $e = {
	id: Qe,
	detector: /* @__PURE__ */ r((e) => /^\s*(graph|flowchart)/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./flowDiagram-IUGLLWBU-D0r3Yhs8.js");
		return {
			id: Qe,
			diagram: e
		};
	}, "loader")
}, et = "agentflow", tt = {
	id: et,
	detector: /* @__PURE__ */ r((e) => /^\s*agentflow-beta\b/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./diagram-TYUNFSNR-CWRrZj0b.js");
		return {
			id: et,
			diagram: e
		};
	}, "loader")
}, nt = "swimlane", rt = {
	id: nt,
	detector: /* @__PURE__ */ r((e) => /^\s*swimlane-beta\b/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./swimlanesDiagram-AYQRV4AK-C-yyLyx0.js");
		return {
			id: nt,
			diagram: e
		};
	}, "loader")
}, it = "er", at = {
	id: it,
	detector: /* @__PURE__ */ r((e) => /^\s*erDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./erDiagram-KYQIGQAA-Culj7bSm.js");
		return {
			id: it,
			diagram: e
		};
	}, "loader")
}, ot = "gitGraph", st = {
	id: ot,
	detector: /* @__PURE__ */ r((e) => /^\s*gitGraph/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./gitGraphDiagram-PDYL7XHY-CSitcLgU.js");
		return {
			id: ot,
			diagram: e
		};
	}, "loader")
}, ct = "gantt", lt = {
	id: ct,
	detector: /* @__PURE__ */ r((e) => /^\s*gantt/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./ganttDiagram-R7GPNTJY-CK9u8795.js");
		return {
			id: ct,
			diagram: e
		};
	}, "loader")
}, ut = "info", dt = {
	id: ut,
	detector: /* @__PURE__ */ r((e) => /^\s*info/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./infoDiagram-MVDRKAX5-Nh5JVKEN.js");
		return {
			id: ut,
			diagram: e
		};
	}, "loader")
}, ft = "pie", pt = {
	id: ft,
	detector: /* @__PURE__ */ r((e) => /^\s*pie/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./pieDiagram-GNMPY74T-BLcjpY_Y.js");
		return {
			id: ft,
			diagram: e
		};
	}, "loader")
}, mt = "quadrantChart", ht = {
	id: mt,
	detector: /* @__PURE__ */ r((e) => /^\s*quadrantChart/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./quadrantDiagram-D57K4MC3-C5nLtSIA.js");
		return {
			id: mt,
			diagram: e
		};
	}, "loader")
}, gt = "xychart", _t = {
	id: gt,
	detector: /* @__PURE__ */ r((e) => /^\s*xychart(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./xychartDiagram-4URNHDU4-DaAZEiYC.js");
		return {
			id: gt,
			diagram: e
		};
	}, "loader")
}, vt = "requirement", yt = {
	id: vt,
	detector: /* @__PURE__ */ r((e) => /^\s*requirement(Diagram)?/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./requirementDiagram-EQYSW5RA-3TnJywgY.js");
		return {
			id: vt,
			diagram: e
		};
	}, "loader")
}, bt = "sequence", xt = {
	id: bt,
	detector: /* @__PURE__ */ r((e) => /^\s*sequenceDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./sequenceDiagram-BLEHNHQU-DeJ9RSRo.js");
		return {
			id: bt,
			diagram: e
		};
	}, "loader")
}, St = "classDiagram", Ct = {
	id: St,
	detector: /* @__PURE__ */ r((e) => /^\s*classDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./classDiagram-v2-4MYWR3UA-D7Fg88GU.js");
		return {
			id: St,
			diagram: e
		};
	}, "loader")
}, wt = "stateDiagram", Tt = {
	id: wt,
	detector: /* @__PURE__ */ r((e) => /^\s*stateDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./stateDiagram-v2-A6IESKWZ-dyYGcW3C.js");
		return {
			id: wt,
			diagram: e
		};
	}, "loader")
}, Et = "journey", Dt = {
	id: Et,
	detector: /* @__PURE__ */ r((e) => /^\s*journey/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./journeyDiagram-BOSHW7O7-CeovMo2E.js");
		return {
			id: Et,
			diagram: e
		};
	}, "loader")
}, q = 4, J = 75, Ot = /* @__PURE__ */ r((e) => {
	let t = [];
	for (let n of e.split(/\s+/)) {
		let e = [...n];
		for (; e.length > J;) t.push(e.slice(0, J).join("")), e = e.slice(J);
		e.length > 0 && t.push(e.join(""));
	}
	let n = [], r = "";
	for (let e of t) {
		let t = r ? `${r} ${e}` : e;
		[...t].length > J ? (n.push(r), r = e) : r = t;
	}
	if (r && n.push(r), n.length > q) {
		n.length = q;
		let e = n[q - 1] ?? "";
		n[q - 1] = `${[...e].slice(0, J - 3).join("")}...`;
	}
	return n;
}, "wrapErrorMessage"), kt = { draw: /* @__PURE__ */ r((e, n, r, i) => {
	t.debug("rendering svg for syntax error\n");
	let a = pe(n), o = a.append("g"), s = Ot(i?.db.getErrorMessage?.() ?? ""), c = s.length > 0 ? 500 + s.length * 56 : 512;
	a.attr("viewBox", `0 0 2412 ${c}`), _(a, 100, c, !0), o.append("path").attr("class", "error-icon").attr("d", "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"), o.append("path").attr("class", "error-icon").attr("d", "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"), o.append("path").attr("class", "error-icon").attr("d", "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"), o.append("path").attr("class", "error-icon").attr("d", "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"), o.append("path").attr("class", "error-icon").attr("d", "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"), o.append("path").attr("class", "error-icon").attr("d", "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"), o.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text"), o.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${r}`), s.forEach((e, t) => {
		o.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 510 + t * 56).attr("font-size", "42px").style("text-anchor", "middle").text(e);
	});
}, "draw") }, At = kt, jt, Mt = {
	db: {
		clear() {
			jt = void 0;
		},
		setErrorMessage(e) {
			jt = e;
		},
		getErrorMessage() {
			return jt;
		}
	},
	renderer: kt,
	parser: { parse: /* @__PURE__ */ r(() => {}, "parse") }
}, Nt = "flowchart-elk", Pt = {
	id: Nt,
	detector: /* @__PURE__ */ r((e, t = {}) => /^\s*flowchart-elk/.test(e) ? (t.layout = "elk", !0) : !1, "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./flowDiagram-IUGLLWBU-D0r3Yhs8.js");
		return {
			id: Nt,
			diagram: e
		};
	}, "loader")
}, Ft = "timeline", It = {
	id: Ft,
	detector: /* @__PURE__ */ r((e) => /^\s*timeline/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./timeline-definition-JXYKGLGB-Ei6J8jde.js");
		return {
			id: Ft,
			diagram: e
		};
	}, "loader")
}, Lt = "mindmap", Rt = {
	id: Lt,
	detector: /* @__PURE__ */ r((e) => /^\s*mindmap/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./mindmap-definition-6OY57UG3-BEOUUP4d.js");
		return {
			id: Lt,
			diagram: e
		};
	}, "loader")
}, zt = "kanban", Bt = {
	id: zt,
	detector: /* @__PURE__ */ r((e) => /^\s*kanban/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./kanban-definition-FNSA4HC5-UkpbMmkI.js");
		return {
			id: zt,
			diagram: e
		};
	}, "loader")
}, Vt = "sankey", Ht = {
	id: Vt,
	detector: /* @__PURE__ */ r((e) => /^\s*sankey(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./sankeyDiagram-SY24JHO5-BxUglmfz.js");
		return {
			id: Vt,
			diagram: e
		};
	}, "loader")
}, Ut = "packet", Wt = {
	id: Ut,
	detector: /* @__PURE__ */ r((e) => /^\s*packet(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./diagram-I5XIIV2D-DSi8VYIu.js");
		return {
			id: Ut,
			diagram: e
		};
	}, "loader")
}, Gt = "radar", Kt = {
	id: Gt,
	detector: /* @__PURE__ */ r((e) => /^\s*radar-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./diagram-RJA3I4VV-CuiwNc5_.js");
		return {
			id: Gt,
			diagram: e
		};
	}, "loader")
}, qt = "block", Jt = {
	id: qt,
	detector: /* @__PURE__ */ r((e) => /^\s*block(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./blockDiagram-RJAE7QA3-BNsKVRcC.js");
		return {
			id: qt,
			diagram: e
		};
	}, "loader")
}, Yt = "treeView", Xt = {
	id: Yt,
	detector: /* @__PURE__ */ r((e) => /^\s*treeView-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./diagram-ODIL2UCW-RoWrbiwd.js");
		return {
			id: Yt,
			diagram: e
		};
	}, "loader")
}, Zt = "architecture", Qt = {
	id: Zt,
	detector: /* @__PURE__ */ r((e) => /^\s*architecture/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./architectureDiagram-ZHVYKT53-CeVN-WfI.js");
		return {
			id: Zt,
			diagram: e
		};
	}, "loader")
}, $t = "eventmodeling", en = {
	id: $t,
	detector: /* @__PURE__ */ r((e) => /^\s*eventmodeling/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./diagram-PFBEJUXE-DEVZqj-o.js");
		return {
			id: $t,
			diagram: e
		};
	}, "loader")
}, tn = "ishikawa", nn = {
	id: tn,
	detector: /* @__PURE__ */ r((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./ishikawaDiagram-HPEHV2GE-BAqnb8nh.js");
		return {
			id: tn,
			diagram: e
		};
	}, "loader")
}, rn = "venn", an = {
	id: rn,
	detector: /* @__PURE__ */ r((e) => /^\s*venn-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./vennDiagram-Q3Y3IDCW-7nOydKrB.js");
		return {
			id: rn,
			diagram: e
		};
	}, "loader")
}, on = "treemap", sn = {
	id: on,
	detector: /* @__PURE__ */ r((e) => /^\s*treemap/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./diagram-CBK3MWTC-C_ymPlkc.js");
		return {
			id: on,
			diagram: e
		};
	}, "loader")
}, cn = "usecase", ln = {
	id: cn,
	detector: /* @__PURE__ */ r((e) => /^\s*usecase-beta(?:\s|$)/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./usecaseDiagram-WPOLBNNX-xQwU0Pmz.js");
		return {
			id: cn,
			diagram: e
		};
	}, "loader")
}, un = "wardley", dn = {
	id: un,
	detector: /* @__PURE__ */ r((e) => /^\s*wardley-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./wardleyDiagram-IVAIDKWA-DZdeTTiI.js");
		return {
			id: un,
			diagram: e
		};
	}, "loader")
}, fn = "cynefin", pn = {
	id: fn,
	detector: /* @__PURE__ */ r((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./cynefinDiagram-WF24UDRP-CXD9oKis.js");
		return {
			id: fn,
			diagram: e
		};
	}, "loader")
}, mn = "railroad", hn = {
	id: mn,
	detector: /* @__PURE__ */ r((e) => /^\s*railroad-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./railroadDiagram-Y72NRBL7-D37dAqM_.js");
		return {
			id: mn,
			diagram: e
		};
	}, "loader")
}, gn = "railroadEbnf", _n = {
	id: gn,
	detector: /* @__PURE__ */ r((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./ebnfDiagram-V4P3TTPT-BsE2YvMl.js");
		return {
			id: gn,
			diagram: e
		};
	}, "loader")
}, vn = "railroadAbnf", yn = {
	id: vn,
	detector: /* @__PURE__ */ r((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./abnfDiagram-WEYOIA3C-rP8uDV5N.js");
		return {
			id: vn,
			diagram: e
		};
	}, "loader")
}, bn = "railroadPeg", xn = {
	id: bn,
	detector: /* @__PURE__ */ r((e) => /^\s*railroad-peg-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ r(async () => {
		let { diagram: e } = await import("./pegDiagram-ECIUJNBX-Cp_ncs9J.js");
		return {
			id: bn,
			diagram: e
		};
	}, "loader")
}, Sn = !1, Y = /* @__PURE__ */ r(() => {
	Sn || (Sn = !0, l("error", Mt, (e) => e.toLowerCase().trim() === "error"), l("---", {
		db: { clear: /* @__PURE__ */ r(() => {}, "clear") },
		styles: {},
		renderer: { draw: /* @__PURE__ */ r(() => {}, "draw") },
		parser: { parse: /* @__PURE__ */ r(() => {
			throw Error("Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks");
		}, "parse") },
		init: /* @__PURE__ */ r(() => null, "init")
	}, (e) => e.toLowerCase().trimStart().startsWith("---")), u(Pt, Rt, Qt), u(tt, Ze, Bt, Ct, at, lt, dt, pt, yt, xt, rt, $e, It, st, Tt, Dt, ht, Ht, Wt, _t, Jt, en, Xt, Kt, nn, sn, hn, _n, yn, xn, an, dn, pn, ln));
}, "addDiagrams"), Cn = /* @__PURE__ */ r(async () => {
	t.debug("Loading registered diagrams");
	let e = (await Promise.allSettled(Object.entries(C).map(async ([e, { detector: n, loader: r }]) => {
		if (r) try {
			D(e);
		} catch {
			try {
				let { diagram: e, id: t } = await r();
				l(t, e, n);
			} catch (n) {
				throw t.error(`Failed to load external diagram with key ${e}. Removing from detectors.`), delete C[e], n;
			}
		}
	}))).filter((e) => e.status === "rejected");
	if (e.length > 0) {
		t.error(`Failed to load ${e.length} external diagrams`);
		for (let n of e) t.error(n);
		throw Error(`Failed to load ${e.length} external diagrams`);
	}
}, "loadRegisteredDiagrams"), wn = "graphics-document document";
function Tn(e, t) {
	e.attr("role", wn), t !== "" && e.attr("aria-roledescription", t);
}
r(Tn, "setA11yDiagramInfo");
function En(e, t, n, r) {
	if (e.insert !== void 0) {
		if (n) {
			let t = `chart-desc-${r}`;
			e.attr("aria-describedby", t), e.insert("desc", ":first-child").attr("id", t).text(n);
		}
		if (t) {
			let n = `chart-title-${r}`;
			e.attr("aria-labelledby", n), e.insert("title", ":first-child").attr("id", n).text(t);
		}
	}
}
r(En, "addSVGa11yTitleDescription");
var X = class e {
	constructor(e, t, n, r, i) {
		this.type = e, this.text = t, this.db = n, this.parser = r, this.renderer = i;
	}
	static {
		r(this, "Diagram");
	}
	static async fromText(n, r = {}) {
		let i = typeof n == "string" ? {
			raw: n,
			cleaned: n
		} : n, a = O(), o = T(i.cleaned, a);
		try {
			D(o);
		} catch {
			let e = f(o);
			if (!e) throw new te(`Diagram ${o} not found.`);
			let { id: t, diagram: n } = await e();
			l(t, n);
		}
		let { db: s, parser: c, renderer: u, init: d } = D(o);
		c.parser && (c.parser.yy = s), s.clear?.(), d?.(a), r.title && s.setDiagramTitle?.(r.title);
		let p = i.cleaned;
		if (s.preserveCommentsWhenParsing && i.withComments) {
			let e = a.maxTextSize ?? y.maxTextSize;
			i.withComments.length > e ? t.warn(`Comment-preserving source exceeds maxTextSize (${i.withComments.length} > ${e}); parsing the comment-stripped text instead. Reported source positions will not account for comment lines.`) : p = i.withComments;
		}
		let m = ue(p) + "\n";
		return i.frontmatterLineOffset && s.setFrontmatterLineOffset?.(i.frontmatterLineOffset), await c.parse(m), new e(o, m, s, c, u);
	}
	async render(e, t) {
		await this.renderer.draw(this.text, e, t, this);
	}
	getParser() {
		return this.parser;
	}
	getType() {
		return this.type;
	}
}, Dn = [], On = /* @__PURE__ */ r(() => {
	Dn.forEach((e) => {
		e();
	}), Dn = [];
}, "attachFunctions"), kn = /* @__PURE__ */ r((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function An(e) {
	let t = x(e);
	if (!t) return {
		text: e,
		metadata: {}
	};
	let n = t.indent, r = n ? t.body.split("\n").map((e) => e.startsWith(n) ? e.slice(n.length) : e).join("\n") : t.body, i = me(r, { schema: he }) ?? {};
	i = typeof i == "object" && !Array.isArray(i) ? i : {};
	let a = {};
	return i.displayMode && (a.displayMode = i.displayMode.toString()), i.title && (a.title = i.title.toString()), i.config && (a.config = i.config), {
		text: e.slice(t.length),
		metadata: a
	};
}
r(An, "extractFrontMatter");
var jn = /* @__PURE__ */ r((e) => e.replace(/\r\n?/g, "\n").replace(/<(\w+)([^>]*)>/g, (e, t, n) => "<" + t + n.replace(/="([^"]*)"/g, "='$1'") + ">"), "cleanupText"), Mn = /* @__PURE__ */ r((e) => {
	let { text: t, metadata: n } = An(e), { displayMode: r, title: i, config: a = {} } = n;
	return r && (a.gantt ||= {}, a.gantt.displayMode = r), {
		title: i,
		config: a,
		text: t
	};
}, "processFrontmatter"), Nn = /* @__PURE__ */ r((e) => {
	let t = k.detectInit(e) ?? {}, n = k.detectDirective(e, "wrap");
	return Array.isArray(n) ? t.wrap = n.some(({ type: e }) => e === "wrap") : n?.type === "wrap" && (t.wrap = !0), {
		text: se(e),
		directive: t
	};
}, "processDirectives");
function Pn(e) {
	let t = e, n = jn(e), r = Mn(n), i = Nn(r.text), a = ce(r.config, i.directive), o = i.text;
	return {
		code: {
			raw: t,
			cleaned: kn(o),
			withComments: o,
			frontmatterLineOffset: n.length > r.text.length ? (n.substring(0, n.length - r.text.length).match(/\n/g) ?? []).length : 0
		},
		title: r.title,
		config: a
	};
}
r(Pn, "preprocessDiagram");
function Fn(e) {
	let t = new TextEncoder().encode(e), n = Array.from(t, (e) => String.fromCodePoint(e)).join("");
	return btoa(n);
}
r(Fn, "toBase64");
var In = 5e4, Ln = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", Rn = "sandbox", zn = "loose", Bn = "http://www.w3.org/2000/svg", Vn = "http://www.w3.org/1999/xlink", Hn = "http://www.w3.org/1999/xhtml", Un = "100%", Wn = "100%", Gn = "border:0;margin:0;", Kn = "margin:0", qn = "allow-top-navigation-by-user-activation allow-popups", Jn = "The \"iframe\" tag is not supported by your browser.", Yn = ["foreignobject"], Xn = ["dominant-baseline"];
function Zn(e) {
	let t = Pn(e);
	a();
	let n;
	try {
		n = T(t.code.cleaned, O());
	} catch {
		n = void 0;
	}
	return s(n), w(t.config ?? {}), t;
}
r(Zn, "processAndSetConfigs");
async function Qn(e, t) {
	Y();
	try {
		let { code: t, config: n } = Zn(e);
		return {
			diagramType: (await X.fromText(t)).type,
			config: n
		};
	} catch (e) {
		if (t?.suppressErrors) return !1;
		throw e;
	} finally {
		s(void 0);
	}
}
r(Qn, "parse");
var $n = /* @__PURE__ */ r((e, t, n = []) => `.${e} ${t} ${c(`{ ${n.join(" !important; ")} !important; }`)}`, "cssImportantStyles"), er = /* @__PURE__ */ r((e, t = /* @__PURE__ */ new Map()) => {
	let n = new CSSStyleSheet();
	if (e.fontFamily !== void 0 && n.insertRule(`:root { --mermaid-font-family: ${e.fontFamily}}`, n.cssRules.length), e.altFontFamily !== void 0 && n.insertRule(`:root { --mermaid-alt-font-family: ${e.altFontFamily}}`, n.cssRules.length), t instanceof Map) {
		let r = ne(e) ? ["> *", "span"] : [
			"rect",
			"polygon",
			"ellipse",
			"circle",
			"path"
		];
		t.forEach((e) => {
			be(e.styles) || r.forEach((t) => {
				n.insertRule($n(e.id, t, e.styles), n.cssRules.length);
			}), be(e.textStyles) || n.insertRule($n(e.id, "tspan", (e?.textStyles || []).map((e) => e.replace("color", "fill"))), n.cssRules.length);
		});
	}
	let r = "";
	if (e.themeCSS !== void 0) {
		if (typeof n.replaceSync == "function") {
			let t = new CSSStyleSheet();
			t.replaceSync(e.themeCSS), r = S(t) + "\n";
		} else r += `${e.themeCSS}
`;
	}
	return r + S(n);
}, "createCssStyles"), tr = /* @__PURE__ */ r((e, n) => qe(Ue(`${e}{${n}}`), Ye([/* @__PURE__ */ r(function(n, r, i, a) {
	if (n.type === "rule" && Array.isArray(n.props)) {
		if (n.parent && n.parent.type === "@keyframes") return;
		n.props = n.props.map((t) => t === e && Array.isArray(n.children) && n.children.every((e) => e.type === "decl" && (/* @__PURE__ */ new Set([
			"font-family",
			"font-size",
			"fill"
		])).has(e.props)) ? t : !t.startsWith(`${e} `) && !t.startsWith(`${e}>`) || t.startsWith(`${e} ||`) ? `${e} ${t}` : t);
	} else n.type.startsWith("@") && ([
		"@media",
		"@supports",
		"@layer",
		"@scope",
		"@container",
		"@starting-style",
		"@keyframes"
	].includes(n.type) || (t.warn(`Removing unsupported at-rule ${n.type} from CSS`), n.type = xe));
}, "addNamespace"), Je])), "compileCSS"), nr = /* @__PURE__ */ r((e, t, n, r) => {
	let i = er(e, n);
	return tr(r, g(t, i, {
		...e.themeVariables,
		theme: e.theme,
		look: e.look
	}, r));
}, "createUserStyles"), rr = /* @__PURE__ */ r((e = "", t, n) => {
	let r = e;
	return !n && !t && (r = r.replace(/marker-end="url\([\d+./:=?A-Za-z-]*?#/g, "marker-end=\"url(#")), r = ae(r), r = r.replace(/<br>/g, "<br/>"), r;
}, "cleanUpSvgCode"), ir = /* @__PURE__ */ r((e = "", t) => `<iframe style="width:${Un};height:${t?.viewBox?.baseVal?.height ? t.viewBox.baseVal.height + "px" : Wn};${Gn}" src="data:text/html;charset=UTF-8;base64,${Fn(`<body style="${Kn}">${e}</body>`)}" sandbox="${qn}">
  ${Jn}
</iframe>`, "putIntoIFrame"), ar = /* @__PURE__ */ r((e, t, n, r, i) => {
	let a = e.append("div");
	a.attr("id", n), r && a.attr("style", r);
	let o = a.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", Bn);
	return i && o.attr("xmlns:xlink", i), o.append("g"), e;
}, "appendDivSvgG");
function or(e, t) {
	return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
r(or, "sandboxedIframe");
var sr = /* @__PURE__ */ r((e, t, n, r) => {
	e.getElementById(t)?.remove(), e.getElementById(n)?.remove(), e.getElementById(r)?.remove();
}, "removeExistingElements"), cr = /* @__PURE__ */ r(async function(e, i, a) {
	Y();
	let o = Zn(i), s = o.code;
	i = s.cleaned;
	let c = O();
	t.debug(c), i.length > (c?.maxTextSize ?? In) && (i = Ln, s = {
		raw: i,
		cleaned: i
	});
	let l = `#${e}`, u = "i" + e, d = "#" + u, f = "d" + e, p = "#" + f, m = /* @__PURE__ */ r(() => {
		let e = n(g ? d : p).node();
		e && "remove" in e && e.remove();
	}, "removeTempElements"), h = n(document.body), g = c.securityLevel === Rn, _ = c.securityLevel === zn, y = c.fontFamily;
	if (a !== void 0) {
		if (a && (a.innerHTML = ""), g) {
			let e = or(n(a), u);
			h = n(e.nodes()[0].contentDocument.body), h.node().style.margin = "0";
		} else h = n(a);
		ar(h, e, f, `font-family: ${y}`, Vn);
	} else {
		if (sr(document, e, f, u), g) {
			let e = or(n(document.body), u);
			h = n(e.nodes()[0].contentDocument.body), h.node().style.margin = "0";
		} else h = n("body");
		ar(h, e, f);
	}
	let x, S;
	try {
		x = await X.fromText(s, { title: o.title });
	} catch (e) {
		if (c.suppressErrorRendering) throw m(), e;
		x = await X.fromText("error"), S = e, x.db.setErrorMessage?.(le(e));
	}
	let C = h.select(p).node(), w = x.type, T = C.firstChild, ee = T.firstChild, te = x.renderer.getClasses?.(i, x), E = nr(c, w, te, l), ne = document.createElement("style");
	ne.innerHTML = E, T.insertBefore(ne, ee);
	try {
		await x.renderer.draw(i, e, "12.2.0", x);
	} catch (t) {
		throw c.suppressErrorRendering ? m() : At.draw(i, e, "12.2.0"), t;
	}
	let D = h.select(`${p} svg`), re = x.db.getAccTitle?.(), ie = x.db.getAccDescription?.();
	fr(w, D, re, ie);
	let k = (/* @__PURE__ */ r(() => {
		h.select(`[id="${e}"]`).selectAll("foreignobject > *").attr("xmlns", Hn);
		let n = h.select(p).node().innerHTML;
		if (t.debug("config.arrowMarkerAbsolute", c.arrowMarkerAbsolute), n = rr(n, g, b(c.arrowMarkerAbsolute)), g) {
			let e = h.select(p + " svg").node();
			n = ir(n, e);
		} else _ || (n = v.sanitize(n, {
			ADD_TAGS: Yn,
			ADD_ATTR: Xn,
			HTML_INTEGRATION_POINTS: { foreignobject: !0 }
		}));
		return On(), n;
	}, "serializeSvg"))();
	if (S) throw S;
	return m(), {
		diagramType: w,
		svg: k,
		bindFunctions: x.db.bindFunctions
	};
}, "renderDiagram"), lr = /* @__PURE__ */ r(async function(e, t, n) {
	try {
		return await cr(e, t, n);
	} finally {
		s(void 0);
	}
}, "render");
function ur(t = {}) {
	let n = ee({}, t);
	n?.fontFamily && !n.themeVariables?.fontFamily && (n.themeVariables ||= {}, n.themeVariables.fontFamily = n.fontFamily), m(n);
	let r = E.theme;
	n?.theme && Object.hasOwn(d, n.theme) ? n.themeVariables = d[n.theme].getThemeVariables(n.themeVariables) : n && (n.theme != null && n.theme !== "null" && (n.theme = r), n.themeVariables = d[r].getThemeVariables(n.themeVariables));
	let i = typeof n == "object" ? o(n) : p();
	e(i.logLevel), Y();
}
r(ur, "initialize");
var dr = /* @__PURE__ */ r((e, t = {}) => {
	let { code: n } = Pn(e);
	return X.fromText(n, t);
}, "getDiagramFromText");
function fr(e, t, n, r) {
	Tn(t, e), En(t, n, r, t.attr("id"));
}
r(fr, "addA11yInfo");
var Z = Object.freeze({
	render: lr,
	parse: Qn,
	getDiagramFromText: dr,
	initialize: ur,
	getConfig: O,
	setConfig: h,
	getSiteConfig: p,
	updateSiteConfig: i,
	reset: /* @__PURE__ */ r(() => {
		a();
	}, "reset"),
	globalReset: /* @__PURE__ */ r(() => {
		a(E);
	}, "globalReset"),
	defaultConfig: E
});
e(O().logLevel), a(O());
var pr = /* @__PURE__ */ r((e, n, r) => {
	t.warn(e), de(e) ? (r && r(e.str, e.hash), n.push({
		...e,
		message: e.str,
		error: e
	})) : (r && r(e), e instanceof Error && n.push({
		str: e.message,
		message: e.message,
		hash: e.name,
		error: e
	}));
}, "handleError"), mr = /* @__PURE__ */ r(async function(e = { querySelector: ".mermaid" }) {
	try {
		await hr(e);
	} catch (n) {
		if (de(n) && t.error(n.str), $.parseError && $.parseError(n), !e.suppressErrors) throw t.error("Use the suppressErrors option to suppress these errors"), n;
	}
}, "run"), hr = /* @__PURE__ */ r(async function({ postRenderCallback: e, querySelector: n, nodes: r } = { querySelector: ".mermaid" }) {
	let i = Z.getConfig();
	t.debug(`${e ? "" : "No "}Callback function found`);
	let a;
	if (r) a = r;
	else if (n) a = document.querySelectorAll(n);
	else throw Error("Nodes and querySelector are both undefined");
	t.debug(`Found ${a.length} diagrams`), i?.startOnLoad !== void 0 && (t.debug("Start On Load: " + i?.startOnLoad), Z.updateSiteConfig({ startOnLoad: i?.startOnLoad }));
	let o = new k.InitIDGenerator(i.deterministicIds, i.deterministicIDSeed), s, c = [];
	for (let n of Array.from(a)) {
		if (t.info("Rendering diagram: " + n.id), n.getAttribute("data-processed")) continue;
		n.setAttribute("data-processed", "true");
		let r = `mermaid-${o.next()}`;
		s = n.innerHTML, s = _e(k.entityDecode(s)).trim().replace(/<br\s*\/?>/gi, "<br/>");
		let i = k.detectInit(s);
		i && t.debug("Detected early reinit: ", i);
		try {
			let { svg: t, bindFunctions: i } = await wr(r, s, n);
			n.innerHTML = t, e && await e(r), i && i(n);
		} catch (e) {
			pr(e, c, $.parseError);
		}
	}
	if (c.length > 0) throw c[0];
}, "runThrowsErrors"), gr = /* @__PURE__ */ r(function(e) {
	Z.initialize(e);
}, "initialize"), _r = /* @__PURE__ */ r(async function(e, n, r) {
	t.warn("mermaid.init is deprecated. Please use run instead."), e && gr(e);
	let i = {
		postRenderCallback: r,
		querySelector: ".mermaid"
	};
	typeof n == "string" ? i.querySelector = n : n && (i.nodes = n instanceof HTMLElement ? [n] : n), await mr(i);
}, "init"), vr = /* @__PURE__ */ r(async (e, { lazyLoad: t = !0 } = {}) => {
	Y(), u(...e), t === !1 && await Cn();
}, "registerExternalDiagrams"), yr = /* @__PURE__ */ r(function() {
	if ($.startOnLoad) {
		let { startOnLoad: e } = Z.getConfig();
		e && $.run().catch((e) => t.error("Mermaid failed to initialize", e));
	}
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", yr, !1);
var br = /* @__PURE__ */ r(function(e) {
	$.parseError = e;
}, "setParseErrorHandler"), Q = [], xr = !1, Sr = /* @__PURE__ */ r(async () => {
	if (!xr) {
		for (xr = !0; Q.length > 0;) {
			let e = Q.shift();
			if (e) try {
				await e();
			} catch (e) {
				t.error("Error executing queue", e);
			}
		}
		xr = !1;
	}
}, "executeQueue"), Cr = /* @__PURE__ */ r(async (e, n) => new Promise((i, a) => {
	let o = /* @__PURE__ */ r(() => new Promise((r, o) => {
		Z.parse(e, n).then((e) => {
			r(e), i(e);
		}, (e) => {
			t.error("Error parsing", e), $.parseError?.(e), o(e), a(e);
		});
	}), "performCall");
	Q.push(o), Sr().catch(a);
}), "parse"), wr = /* @__PURE__ */ r((e, n, i) => new Promise((a, o) => {
	let s = /* @__PURE__ */ r(() => new Promise((r, s) => {
		Z.render(e, n, i).then((e) => {
			r(e), a(e);
		}, (e) => {
			t.error("Error parsing", e), $.parseError?.(e), s(e), o(e);
		});
	}), "performCall");
	Q.push(s), Sr().catch(o);
}), "render"), $ = {
	startOnLoad: !0,
	mermaidAPI: Z,
	parse: Cr,
	render: wr,
	init: _r,
	run: mr,
	registerExternalDiagrams: vr,
	registerLayoutLoaders: ve,
	initialize: gr,
	parseError: void 0,
	contentLoaded: yr,
	setParseErrorHandler: br,
	detectType: T,
	registerIconPacks: ge,
	getRegisteredDiagramsMetadata: /* @__PURE__ */ r(() => Object.keys(C).map((e) => ({ id: e })), "getRegisteredDiagramsMetadata")
}, Tr = $;
// admin/markdown-diagrams.mjs
async function Er(e, t, n) {
	return Tr.initialize({
		startOnLoad: !1,
		securityLevel: "strict",
		theme: n === "dark" ? "dark" : "neutral"
	}), (await Tr.render(e, t)).svg;
}
export { Er as renderDiagram };
