import { LitElement } from "lit";
import tailwindCSS from "./index.css?inline"; // ← Compiled Tailwind as a string (not injected into document)
import "./split-app";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
(LitElement.prototype as any).createRenderRoot = function () {
  const root = this.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent =
    ":host{display:block;width:100%}input,select,textarea{border:1px solid #4f4f4f!important;border-radius:0.25rem;background-color:#fff;padding:0.5rem}input:focus,select:focus,textarea:focus{outline:2px solid #3b82f6;outline-offset:-2px;border-color:#3b82f6!important}" +
    tailwindCSS;
  root.appendChild(style);
  (this as any).renderOptions.renderBefore = root.lastChild
    ? root.lastChild.nextSibling
    : root.firstChild;
  return root;
};
