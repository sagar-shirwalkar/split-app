var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
let UserDashboard = class UserDashboard extends LitElement {
    constructor() {
        super(...arguments);
        this.store = new StoreController(this);
    }
    render() {
        const dash = this.store.state.userDashboard;
        return html `
      <div>
        <h2 class="text-xl font-semibold mb-4">Dashboard</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white shadow p-4 rounded">
            <h3 class="font-bold">You owe</h3>
            <p class="text-2xl text-red-600">
              ${dash ? dash.total_owed.toFixed(2) : "..."}
            </p>
          </div>
          <div class="bg-white shadow p-4 rounded">
            <h3 class="font-bold">You are owed</h3>
            <p class="text-2xl text-green-600">
              ${dash ? dash.total_owing.toFixed(2) : "..."}
            </p>
          </div>
        </div>
        <button
          @click=${() => this.store.navigate("groups")}
          class="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          View Groups
        </button>
      </div>
    `;
    }
};
UserDashboard = __decorate([
    customElement("user-dashboard")
], UserDashboard);
export { UserDashboard };
