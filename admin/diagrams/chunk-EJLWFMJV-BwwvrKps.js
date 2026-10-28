import { m as e } from "./src-C0C4419k.js";
import { n as t } from "./chunk-Y2CYZVJY-zK79Gbcw.js";
import { s as n, y as r } from "./chunk-DSNLSHJZ-rrWKZXYM.js";
import { f as i } from "./chunk-7S6XSTFO-C5zg77Vw.js";
import { t as a } from "./chunk-DUW6YSOI-BexpOsJ-.js";
import { o } from "./chunk-HAGFOTED-GhwjvgF7.js";
import { r as s } from "./chunk-ZAUX2LTX-3yc4NKUv.js";
import { r as c } from "./chunk-HNE4Q36P-DSbbiplR.js";
import { a as l, c as u, i as d, l as f } from "./chunk-WQQL4CDK-n1gstEnW.js";
// node_modules/mermaid/dist/chunks/mermaid.core/chunk-EJLWFMJV.mjs
var p = {
	common: n,
	getConfig: r,
	insertCluster: c,
	insertEdge: d,
	insertEdgeLabel: l,
	insertMarkers: u,
	insertNode: s,
	interpolateToCurve: i,
	labelHelper: o,
	log: e,
	positionEdgeLabel: f
}, m = [
	"elk.stress",
	"elk.force",
	"elk.mrtree",
	"elk.sporeOverlap",
	"elk.box",
	"elk.rectpacking"
], h = /* @__PURE__ */ Object.create(null), g = /* @__PURE__ */ t((e) => {
	for (let t of e) h[t.name] = t;
}, "registerLayoutLoaders"), _ = /* @__PURE__ */ t(() => {
	let e = /* @__PURE__ */ t(async () => await import("./elk-QONTBCTQ-B87aSthD.js"), "loader");
	return [{
		name: "elk",
		loader: e,
		algorithm: "elk.layered"
	}, ...m.map((t) => ({
		name: t,
		loader: e,
		algorithm: t
	}))];
}, "elkLayoutLoaders");
(/* @__PURE__ */ t(() => {
	g([
		{
			name: "dagre",
			loader: /* @__PURE__ */ t(async () => await import("./dagre-NK4GIZVX-QmlbvAax.js"), "loader")
		},
		{
			name: "swimlane",
			loader: /* @__PURE__ */ t(async () => await import("./swimlanes-B3ENRKFQ-ChVfsUAy.js"), "loader")
		},
		{
			name: "cose-bilkent",
			loader: /* @__PURE__ */ t(async () => await import("./cose-bilkent-JH36ORCC-CwKpJBu_.js"), "loader")
		},
		..._()
	]);
}, "registerDefaultLayoutLoaders"))();
var v = /* @__PURE__ */ t(async (e, t) => {
	if (!Object.hasOwn(h, e.layoutAlgorithm)) throw Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
	if (e.diagramId) for (let t of e.nodes) {
		let n = t.domId || t.id;
		t.domId = `${e.diagramId}-${n}`;
	}
	let n = h[e.layoutAlgorithm], r = await n.loader();
	return a(t, e.config), r.render(e, t, p, { algorithm: n.algorithm });
}, "render"), y = "dagre", b = /* @__PURE__ */ t((t = "", { fallback: n = y } = {}) => {
	if (Object.hasOwn(h, t)) return t;
	for (let r of [n, y]) if (Object.hasOwn(h, r)) return e.warn(`Layout algorithm ${t} is not registered. Using ${r} as fallback.`), r;
	throw Error(`Neither layout algorithm ${t}, ${n}, nor ${y} is registered.`);
}, "getRegisteredLayoutAlgorithm");
export { g as n, v as r, b as t };
