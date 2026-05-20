var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { StoreController } from "./store/store.js";
import "./components/group-list.js";
import "./components/group-detail.js";
import "./components/user-dashboard.js";
let SplitApp = class SplitApp extends LitElement {
    constructor() {
        super(...arguments);
        this.store = new StoreController(this);
    }
    render() {
        const { currentView } = this.store.state;
        return html `
      <div class="min-h-screen">
        <header class="bg-indigo-600 text-white p-4">
          <h1
            class="text-2xl font-bold cursor-pointer"
            @click=${() => this.store.navigate("dashboard")}
          >
            SplitApp
          </h1>
        </header>
        <main class="p-4">
          ${currentView === "dashboard"
            ? html `<user-dashboard></user-dashboard>`
            : ""}
          ${currentView === "groups" ? html `<group-list></group-list>` : ""}
          ${currentView === "group-detail"
            ? html `<group-detail></group-detail>`
            : ""}
        </main>
      </div>
    `;
    }
};
SplitApp = __decorate([
    customElement("split-app")
], SplitApp);
export { SplitApp };
