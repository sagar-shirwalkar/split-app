import { LitElement } from "lit";
import "./index.css";
import "./split-app";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(LitElement.prototype as any).createRenderRoot = function (this: HTMLElement) {
  return this;
};
