import { m as e } from "./src-C0C4419k.js";
import { n as t } from "./chunk-Y2CYZVJY-zK79Gbcw.js";
import { b as n, y as r } from "./chunk-DSNLSHJZ-rrWKZXYM.js";
import { _ as i } from "./chunk-7S6XSTFO-C5zg77Vw.js";
import { o as a } from "./chunk-HAGFOTED-GhwjvgF7.js";
import { i as o, n as s, r as c, t as l } from "./chunk-ZAUX2LTX-3yc4NKUv.js";
import { r as u, t as d } from "./chunk-HNE4Q36P-DSbbiplR.js";
import { a as f, c as p, d as m, i as h, n as g, r as _, t as ee, u as v } from "./chunk-WQQL4CDK-n1gstEnW.js";
import { t as y } from "./graphlib-DW9QUswF.js";
// node_modules/mermaid/dist/chunks/mermaid.core/chunk-ZCHMQSOR.mjs
function b(e, { edgePathsClass: t = "edges edgePaths" } = {}) {
	let n = e.insert("g").attr("class", "root");
	return {
		clusters: n.insert("g").attr("class", "clusters"),
		edgePaths: n.insert("g").attr("class", t),
		edgeLabels: n.insert("g").attr("class", "edgeLabels"),
		nodes: n.insert("g").attr("class", "nodes"),
		rootGroups: n
	};
}
t(b, "createLayoutElementGroups");
async function x(e, t, n) {
	if (t.label) {
		let { shapeSvg: r, bbox: i } = await a(e, n === void 0 ? t : {
			...t,
			width: n
		});
		t.labelBBox = {
			width: i.width,
			height: i.height
		}, r.remove();
	} else t.labelBBox = {
		width: 0,
		height: 0
	};
}
t(x, "measureGroupLabel");
async function S(e, t, n) {
	let r = await c(e, t, n), i = r.node()?.getBBox() ?? {
		width: 0,
		height: 0
	};
	return t.width = i.width, t.height = i.height, r;
}
t(S, "insertMeasuredNode");
function C(e, t, n) {
	let r = e, i = /* @__PURE__ */ new Set();
	for (; r;) {
		if (r.dir) return r.dir;
		if (!r.parentId || i.has(r.parentId)) break;
		i.add(r.parentId), r = t.get(r.parentId);
	}
	return n;
}
t(C, "resolveNodeDir");
async function w(e, t, r = {}) {
	let i = new y({
		multigraph: !0,
		compound: !0
	}), a = [...t.edges], o = n(), s = b(e), { edgeLabels: c, nodes: l } = s, u = /* @__PURE__ */ new Map(), d = new Map(t.nodes.map((e) => [e.id, e])), p = t.direction, m = e.node() != null;
	await Promise.all(t.nodes.map(async (e) => {
		if (e.isGroup) {
			if (m) {
				let t = r.unwrapGroupLabels && e.labelType !== "markdown";
				await x(l, e, t ? Infinity : void 0);
			}
			i.setNode(e.id, { ...e });
		} else {
			if (m) {
				let t = await S(l, e, {
					config: o,
					dir: C(e, d, p)
				});
				u.set(e.id, t);
			}
			i.setNode(e.id, { ...e });
		}
	}));
	for (let e of a) m && _(e) && await f(c, e), i.setEdge(e.start, e.end, { ...e }, e.id), t.edges.some((t) => t.id === e.id) || t.edges.push(e);
	if (globalThis.mermaidCaptureSizes) {
		let { captureNodeSizes: n } = await import("./sizeCapture-INFHLROL-DX9R_TYJ.js");
		n(e, t);
	}
	return {
		graph: i,
		groups: s,
		nodeElements: u
	};
}
t(w, "createGraphWithElements");
var T = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), te = /* @__PURE__ */ t(() => {
	E.clear(), D.clear(), T.clear();
}, "clear"), O = /* @__PURE__ */ t((t, n) => {
	let r = E.get(n) || [];
	return e.trace("In isDescendant", n, " ", t, " = ", r.includes(t)), r.includes(t);
}, "isDescendant"), k = /* @__PURE__ */ t((t, n) => {
	let r = E.get(n) || [];
	return e.info("Descendants of ", n, " is ", r), e.info("Edge is ", t), t.v === n || t.w === n ? !1 : r ? r.includes(t.v) || O(t.v, n) || O(t.w, n) || r.includes(t.w) : (e.debug("Tilt, ", n, ",not in descendants"), !1);
}, "edgeInCluster"), A = /* @__PURE__ */ t((t, n, r, i) => {
	e.debug("Copying children of ", t, "root", i, "data", n.node(t), i);
	let a = n.children(t) || [];
	t !== i && a.push(t), e.debug("Copying (nodes) clusterId", t, "nodes", a), a.forEach((a) => {
		if (n.children(a).length > 0) A(a, n, r, i);
		else {
			let o = n.node(a);
			e.info("cp ", a, " to ", i, " with parent ", t), r.setNode(a, o), i !== n.parent(a) && (e.debug("Setting parent", a, n.parent(a)), r.setParent(a, n.parent(a))), t !== i && a !== t ? (e.debug("Setting parent", a, t), r.setParent(a, t)) : (e.info("In copy ", t, "root", i, "data", n.node(t), i), e.debug("Not Setting parent for node=", a, "cluster!==rootId", t !== i, "node!==clusterId", a !== t));
			let s = n.edges(a);
			e.debug("Copying Edges", s), s.forEach((a) => {
				e.info("Edge", a);
				let o = n.edge(a.v, a.w, a.name);
				e.info("Edge data", o, i);
				try {
					k(a, i) ? (e.info("Copying as ", a.v, a.w, o, a.name), r.setEdge(a.v, a.w, o, a.name), e.info("newGraph edges ", r.edges(), r.edge(r.edges()[0]))) : e.info("Skipping copy of edge ", a.v, "-->", a.w, " rootId: ", i, " clusterId:", t);
				} catch (t) {
					e.error(t);
				}
			});
		}
		e.debug("Removing node", a), n.removeNode(a);
	});
}, "copy"), j = /* @__PURE__ */ t((e, t) => {
	let n = t.children(e), r = [...n];
	for (let i of n) D.set(i, e), r = [...r, ...j(i, t)];
	return r;
}, "extractDescendants"), M = /* @__PURE__ */ t((e, t, n) => {
	let r = e.edges().filter((e) => e.v === t || e.w === t), i = e.edges().filter((e) => e.v === n || e.w === n), a = r.map((e) => ({
		v: e.v === t ? n : e.v,
		w: e.w === t ? t : e.w
	})), o = i.map((e) => ({
		v: e.v,
		w: e.w
	}));
	return a.filter((e) => o.some((t) => e.v === t.v && e.w === t.w));
}, "findCommonEdges"), N = /* @__PURE__ */ t((t, n, r) => {
	let i = n.children(t);
	if (e.trace("Searching children of id ", t, i), i.length < 1) return t;
	let a;
	for (let e of i) {
		let t = N(e, n, r), i = M(n, r, t);
		if (t) {
			if (i.length > 0) a = t;
			else return t;
		}
	}
	return a;
}, "findNonClusterChild"), P = /* @__PURE__ */ t((e) => !T.has(e) || !T.get(e).externalConnections ? e : T.has(e) ? T.get(e).id : e, "getAnchorId"), F = /* @__PURE__ */ t((t, n) => {
	if (!t || n > 10) e.debug("Opting out, no graph ");
	else {
		e.debug("Opting in, graph "), t.nodes().forEach(function(n) {
			t.children(n).length > 0 && (e.debug("Cluster identified", n, " Replacement id in edges: ", N(n, t, n)), E.set(n, j(n, t)), T.set(n, {
				id: N(n, t, n),
				clusterData: t.node(n)
			}));
		}), t.nodes().forEach(function(n) {
			let r = t.children(n), i = t.edges();
			r.length > 0 ? (e.debug("Cluster identified", n, E), i.forEach((t) => {
				O(t.v, n) ^ O(t.w, n) && (e.debug("Edge: ", t, " leaves cluster ", n), e.debug("Descendants of XXX ", n, ": ", E.get(n)), T.get(n).externalConnections = !0);
			})) : e.debug("Not a cluster ", n, E);
		});
		for (let e of T.keys()) {
			let n = T.get(e).id, r = t.parent(n);
			r !== e && T.has(r) && !T.get(r).externalConnections && (T.get(e).id = r);
			let i = t.edges().some((t) => t.v === e);
			if (n && T.get(e)?.externalConnections && i && z(t, n, e)) {
				let r = B(t, e, t.parent(n));
				r && (T.get(e).id = r);
			}
		}
		t.edges().forEach(function(n) {
			let r = t.edge(n);
			e.debug("Edge " + n.v + " -> " + n.w + ": " + JSON.stringify(n)), e.debug("Edge " + n.v + " -> " + n.w + ": " + JSON.stringify(t.edge(n)));
			let i = n.v, a = n.w;
			if (e.debug("Fix XXX", T, "ids:", n.v, n.w, "Translating: ", T.get(n.v), " --- ", T.get(n.w)), T.get(n.v) || T.get(n.w)) {
				if (e.debug("Fixing and trying - removing XXX", n.v, n.w, n.name), i = P(n.v), a = P(n.w), t.removeEdge(n.v, n.w, n.name), i !== n.v) {
					let e = t.parent(i);
					T.get(e).externalConnections = !0, r.fromCluster = n.v;
				}
				if (a !== n.w) {
					let e = t.parent(a);
					T.get(e).externalConnections = !0, r.toCluster = n.w;
				}
				e.debug("Fix Replacing with XXX", i, a, n.name), t.setEdge(i, a, r, n.name);
			}
		}), I(t, 0), e.trace(T);
	}
}, "adjustClustersAndEdges"), I = /* @__PURE__ */ t((t, n) => {
	if (n > 10) {
		e.error("Bailing out");
		return;
	}
	let r = t.nodes(), i = !1;
	for (let e of r) {
		let n = t.children(e);
		i ||= n.length > 0;
	}
	if (!i) e.debug("Done, no node has children", t.nodes());
	else {
		e.debug("Nodes = ", r, n);
		for (let i of r) if (e.debug("Extracting node", i, T, T.has(i) && !T.get(i).externalConnections, !t.parent(i), t.node(i), t.children("D"), " Depth ", n), !T.has(i)) e.debug("Not a cluster", i, n);
		else if (!T.get(i).externalConnections && t.children(i) && t.children(i).length > 0) {
			e.debug("Cluster without external connections, without a parent and with children", i, n);
			let r = t.graph().rankdir === "TB" ? "LR" : "TB";
			T.get(i)?.clusterData?.dir && (r = T.get(i).clusterData.dir, e.debug("Fixing dir", T.get(i).clusterData.dir, r));
			let a = new y({
				multigraph: !0,
				compound: !0
			}).setGraph({
				rankdir: r,
				nodesep: 50,
				ranksep: 50,
				marginx: 8,
				marginy: 8
			}).setDefaultEdgeLabel(function() {
				return {};
			});
			A(i, t, a, i), t.setNode(i, {
				clusterNode: !0,
				id: i,
				clusterData: T.get(i).clusterData,
				label: T.get(i).label,
				graph: a
			});
		} else e.debug("Cluster ** ", i, " **not meeting the criteria !externalConnections:", !T.get(i).externalConnections, " no parent: ", !t.parent(i), " children ", t.children(i) && t.children(i).length > 0, t.children("D"), n), e.debug(T);
		r = t.nodes(), e.debug("New list of nodes", r);
		for (let i of r) {
			let r = t.node(i);
			e.debug(" Now next level", i, r), r?.clusterNode && I(r.graph, n + 1);
		}
	}
}, "extractor"), L = /* @__PURE__ */ t((e, t) => {
	if (t.length === 0) return [];
	let n = Object.assign([], t);
	return t.forEach((t) => {
		let r = L(e, e.children(t));
		n = [...n, ...r];
	}), n;
}, "sorter"), R = /* @__PURE__ */ t((e) => L(e, e.children()), "sortNodesByHierarchy"), z = /* @__PURE__ */ t((e, t, n) => {
	let r = e.parent(t);
	for (; r && r !== n;) {
		let t = T.get(r);
		if (t && !t.externalConnections) return !0;
		r = e.parent(r);
	}
	return !1;
}, "isNodeInExtractableCluster"), B = /* @__PURE__ */ t((e, t, n) => {
	let r = e.children(t) ?? [];
	for (let i of r) {
		if (i === n || O(i, n)) continue;
		let r = N(i, e, t);
		if (r && !z(e, r, t)) return r;
	}
	return null;
}, "findSafeAnchorNode");
function V({ prepareLayout: e, measureLayout: n, runLayoutCore: r, paintLayout: i, afterPaint: a, paintOptions: o }) {
	let s = n ?? U;
	return /* @__PURE__ */ t(async function(t, n, c, l) {
		let u = n.select("g");
		(c?.insertMarkers ?? p)(u, t.markers, t.type, t.diagramId), H();
		let d = {
			element: u,
			helpers: c,
			options: l
		};
		d.preparedLayout = await e?.(t, d);
		let f = await s(t, d), m = await r(t, d), h = {
			...d,
			measure: f
		};
		i ? await i(t, h, m) : await W(t, h, o), await a?.(t, h, m);
	}, "render");
}
t(V, "createCommonLayoutRenderer");
function H() {
	l(), ee(), d(), te();
}
t(H, "clearLayoutRenderState");
async function U(e, { element: t }, n) {
	return await w(t, e, n);
}
t(U, "defaultMeasureLayout");
async function W(e, t, n = {}) {
	let { measure: r } = t, { groups: i } = r;
	for (let r of n.getNodes?.(e, t) ?? e.nodes) n.skipNode?.(r, t) || await G(i, r, t, n);
	let a = q(e.nodes);
	for (let r of e.edges) J(r, n) || await Y(i, r, a, e, n, t);
}
t(W, "paintLayoutData");
async function G(e, t, n, r) {
	t.clusterNode ? o(t) : K(t, n, r) ? await u(e.clusters, t) : o(t);
}
t(G, "paintLayoutNode");
function K(e, t, n) {
	return e.isGroup === !0 && (n.isCluster?.(e, t) ?? !0);
}
t(K, "shouldPaintAsCluster");
function q(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) n?.id && t.set(n.id, n);
	return t;
}
t(q, "buildNodeLookup");
function J(e, t) {
	return e.isLayoutOnly || !!t.skipEdge?.(e);
}
t(J, "shouldSkipPaintEdge");
async function Y(e, t, n, r, i, a) {
	let o = h(e.edgePaths, { ...t }, i.clusterDb ?? /* @__PURE__ */ new Map(), r.type, X(t.start, t, n, a, i), X(t.end, t, n, a, i), r.diagramId, Z(t, i), r.layoutAlgorithm);
	_(t) && (g.has(t.id) || await f(e.edgeLabels, t), Q(t, o));
}
t(Y, "paintLayoutEdge");
function X(e, t, n, r, i) {
	return i.getEdgeNode?.(e, t, r) ?? (e ? n.get(e) ?? {} : {});
}
t(X, "getRenderedNode");
function Z(e, t) {
	return typeof t.skipIntersect == "function" ? t.skipIntersect(e) : t.skipIntersect ?? !1;
}
t(Z, "shouldSkipIntersect");
function Q(e, t) {
	let n = t?.updatedPath ?? t?.originalPath, i = r(), { subGraphTitleTotalMargin: a } = s({ flowchart: i.flowchart ?? {} });
	if (e.label) {
		let n = g.get(e.id), { x: r, y: i } = v(e, t);
		n.attr("transform", `translate(${r}, ${i + a / 2})`);
	}
	for (let [t, r] of [
		["startLeft", e.startLabelLeft],
		["startRight", e.startLabelRight],
		["endLeft", e.endLabelLeft],
		["endRight", e.endLabelRight]
	]) if (r) {
		let { x: r, y: i } = $(e, t, n);
		m.get(e.id)[t].attr("transform", `translate(${r}, ${i})`);
	}
}
t(Q, "positionRenderedEdgeLabel");
var ne = {
	startLeft: "start_left",
	startRight: "start_right",
	endLeft: "end_left",
	endRight: "end_right"
};
function $(e, t, n) {
	let r = e.terminalLabelCenters?.[t];
	if (r) return { ...r };
	if (!n) return {
		x: e.x,
		y: e.y
	};
	let a = t.startsWith("start") ? e.arrowTypeStart : e.arrowTypeEnd;
	return i.calcTerminalLabelPosition(a ? 10 : 0, ne[t], n);
}
t($, "terminalLabelTranslate");
export { U as a, R as c, b as i, T as n, N as o, V as r, S as s, F as t };
