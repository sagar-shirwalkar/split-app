import { LitElement } from "lit";
import "./index.css";
import "./split-app";

let _sharedCSS = "";

function _captureStyles() {
  if (_sharedCSS) return;
  for (const s of document.querySelectorAll("style")) {
    _sharedCSS += s.textContent || "";
  }
}
_captureStyles();

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
(LitElement.prototype as any).createRenderRoot = function () {
  const root = this.attachShadow({ mode: "open" });
  if (_sharedCSS) {
    const style = document.createElement("style");
    style.textContent = ":host{display:block;width:100%;max-width:100%}input,select,textarea{border-color:#9ca3af}input:focus,select:focus,textarea:focus{outline:2px solid #3b82f6;outline-offset:-2px;border-color:#3b82f6!important}" + _sharedCSS;
    root.appendChild(style);
  }
  (this as any).renderOptions.renderBefore = root.lastChild
    ? root.lastChild.nextSibling
    : root.firstChild;
  return root;
};
