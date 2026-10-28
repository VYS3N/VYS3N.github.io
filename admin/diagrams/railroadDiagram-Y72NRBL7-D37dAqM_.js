import { m as e } from "./src-C0C4419k.js";
import { n as t } from "./chunk-Y2CYZVJY-zK79Gbcw.js";
import "./chunk-DSNLSHJZ-rrWKZXYM.js";
import "./chunk-OYAV6JZA-CGlF1XGR.js";
import { g as n, t as r } from "./mermaid-parser.core-BBprWt2-.js";
import { n as i, r as a, t as o } from "./chunk-2E7WHVMD-zwd3gxm3.js";
import { t as s } from "./chunk-JWPE2WC7-CWZppDjb.js";
// node_modules/mermaid/dist/chunks/mermaid.core/railroadDiagram-Y72NRBL7.mjs
var c = n().Railroad.parser.LangiumParser, l = /* @__PURE__ */ t((e) => {
	switch (e.$type) {
		case "RailroadTerminalExpr": return {
			type: "terminal",
			value: e.value
		};
		case "RailroadNonTerminalExpr": return {
			type: "nonterminal",
			name: e.name
		};
		case "RailroadSpecialExpr": return {
			type: "special",
			text: e.text
		};
		case "RailroadSequenceExpr": {
			let t = e.elements.map(l);
			return t.length === 1 ? t[0] : {
				type: "sequence",
				elements: t
			};
		}
		case "RailroadChoiceExpr": {
			let t = e.alternatives.map(l);
			return t.length === 1 ? t[0] : {
				type: "choice",
				alternatives: t
			};
		}
		case "RailroadOptionalExpr": return {
			type: "optional",
			element: l(e.element)
		};
		case "RailroadOneOrMoreExpr": return {
			type: "repetition",
			element: l(e.element),
			min: 1,
			max: Infinity
		};
		case "RailroadZeroOrMoreExpr": return {
			type: "repetition",
			element: l(e.element),
			min: 0,
			max: Infinity
		};
		default: throw Error(`Unsupported railroad expression: ${e.$type}`);
	}
}, "transformExpression"), u = /* @__PURE__ */ t((e) => ({
	name: e.name,
	definition: l(e.definition)
}), "transformRule"), d = /* @__PURE__ */ t((e) => {
	s(e, o), e.title && o.setTitle(e.title), e.rules.map((e) => o.addRule(u(e)));
}, "populateDb"), f = {
	parser: {
		parse: /* @__PURE__ */ t((t) => {
			o.clear(), e.debug("[Railroad Parser] Starting Langium parse");
			let n = c.parse(t);
			if (n.lexerErrors.length > 0 || n.parserErrors.length > 0) throw new r(n);
			let i = n.value;
			e.debug("[Railroad Parser] Parsed rules:", i.rules.length), d(i), e.debug("[Railroad Parser] Parse complete");
		}, "parse"),
		parser: { yy: o }
	},
	db: o,
	renderer: a,
	styles: i
};
export { f as diagram };
