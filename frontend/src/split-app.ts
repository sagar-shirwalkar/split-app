import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { StoreController } from "./store/store.js";
import "./components/group-list.js";
import "./components/group-detail.js";
import "./components/user-dashboard.js";

@customElement("split-app")
export class SplitApp extends LitElement {
  private store = new StoreController(this);

  render() {
    const { currentView } = this.store.state;
    return html`
      <div class="min-h-screen bg-white">
        <header class="bg-[#032d42] text-white p-4" style="background-color: #032d42">
          <h1
            class="text-xl font-semibold cursor-pointer"
            style="color: #ffffff"
            @click=${() => this.store.navigate("dashboard")}
          >
            SplitApp
          </h1>
        </header>
        <main class="p-4" style="max-width: 640px; margin: 0 auto">
          ${currentView === "dashboard"
            ? html`<user-dashboard></user-dashboard>`
            : ""}
          ${currentView === "groups" ? html`<group-list></group-list>` : ""}
          ${currentView === "group-detail"
            ? html`<group-detail></group-detail>`
            : ""}
        </main>
      </div>
    `;
  }
}
