import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { StoreController } from "../store/store.js";

@customElement("user-dashboard")
export class UserDashboard extends LitElement {
  private store = new StoreController(this);

  private _fmt(n: number | null | undefined) {
    return `$${(n ?? 0).toFixed(2)}`;
  }

  render() {
    const dash = this.store.state.userDashboard;
    return html`
      <div>
        <h2 class="text-xl font-bold mb-4 text-[#000000]">Dashboard</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white shadow p-4 rounded border">
            <h3 class="font-semibold text-[#4f4f4f]">You Owe</h3>
            <p class="text-2xl text-red-600">
              ${dash ? this._fmt(dash.total_owed) : "$0.00"}
            </p>
          </div>
          <div class="bg-white shadow p-4 rounded border">
            <h3 class="font-semibold text-[#4f4f4f]">You Are Owed</h3>
            <p class="text-2xl text-green-600">
              ${dash ? this._fmt(dash.total_owing) : "$0.00"}
            </p>
          </div>
        </div>
        <button
          @click=${() => this.store.navigate("groups")}
          class="mt-4 px-4 py-2 rounded text-white font-semibold"
          style="background-color: #62d84e"
        >
          View Groups
        </button>
      </div>
    `;
  }
}
