import { m as e } from "./src-C0C4419k.js";
import { n as t } from "./chunk-Y2CYZVJY-zK79Gbcw.js";
import { c as n } from "./chunk-DSNLSHJZ-rrWKZXYM.js";
import { t as r } from "./chunk-OYAV6JZA-CGlF1XGR.js";
import { n as i } from "./mermaid-parser.core-BBprWt2-.js";
// node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-MVDRKAX5.mjs
var a = { parse: /* @__PURE__ */ t(async (t) => {
	let n = await i("info", t);
	e.debug(n);
}, "parse") }, o = { version: "12.2.0" }, s = {
	parser: a,
	db: { getVersion: /* @__PURE__ */ t(() => o.version, "getVersion") },
	renderer: { draw: /* @__PURE__ */ t((t, i, a) => {
		e.debug("rendering info diagram\n" + t);
		let o = r(i);
		n(o, 100, 400, !0), o.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${a}`);
	}, "draw") }
};
export { s as diagram };
