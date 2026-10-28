import { m as e } from "./src-C0C4419k.js";
import { n as t } from "./chunk-Y2CYZVJY-zK79Gbcw.js";
import { d as n } from "./chunk-7S6XSTFO-C5zg77Vw.js";
import { s as r } from "./chunk-HAGFOTED-GhwjvgF7.js";
// node_modules/mermaid/dist/chunks/mermaid.core/chunk-ZAUX2LTX.mjs
var i = /* @__PURE__ */ t(({ flowchart: e }) => {
	let t = e?.subGraphTitleMargin?.top ?? 0, n = e?.subGraphTitleMargin?.bottom ?? 0;
	return {
		subGraphTitleTopMargin: t,
		subGraphTitleBottomMargin: n,
		subGraphTitleTotalMargin: t + n
	};
}, "getSubGraphTitleMargins"), a = /* @__PURE__ */ new Map();
async function o(e, t, i) {
	let o, s;
	t.shape === "rect" && (t.shape = t.rx && t.ry ? "roundedRect" : "squareRect");
	let c = t.shape ? r[t.shape] : void 0;
	if (!c) throw Error(`No such shape: ${t.shape}. Please check your syntax.`);
	if (t.link) {
		let n;
		i.config.securityLevel === "sandbox" ? n = "_top" : t.linkTarget && (n = t.linkTarget || "_blank"), o = e.insert("svg:a").attr("xlink:href", t.link).attr("target", n ?? null), s = await c(o, t, i);
	} else s = await c(e, t, i), o = s;
	return o.attr("data-look", n(t.look)), t.tooltip && s.attr("title", t.tooltip), a.set(t.id, o), t.haveCallback && o.attr("class", o.attr("class") + " clickable"), o;
}
t(o, "insertNode");
var s = /* @__PURE__ */ t((e, t) => {
	a.set(t.id, e);
}, "setNodeElem"), c = /* @__PURE__ */ t(() => {
	a.clear();
}, "clear"), l = /* @__PURE__ */ t((t) => {
	let n = a.get(t.id);
	e.trace("Transforming node", t.diff, t, "translate(" + (t.x - t.width / 2 - 5) + ", " + t.width / 2 + ")");
	let r = t.diff || 0;
	return t.clusterNode ? n.attr("transform", "translate(" + (t.x + r - t.width / 2) + ", " + (t.y - t.height / 2 - 8) + ")") : n.attr("transform", "translate(" + t.x + ", " + t.y + ")"), r;
}, "positionNode");
export { s as a, l as i, i as n, o as r, c as t };
