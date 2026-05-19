import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import "./balance-summary.js";
import "./expense-list.js";
import "./add-expense-form.js";
import "./record-settlement-form.js";

@customElement("group-detail")
export class GroupDetail extends LitElement {
  private store = new StoreController(this);

  render() {
    const group = this.store.state.currentGroup;
    if (!group) return html`<p>Loading...</p>`;

    return html`
      <div>
        <button
          @click=${() => this.store.navigate("groups")}
          class="text-indigo-600 underline mb-2 block"
        >
          ← Back to groups
        </button>
        <h2 class="text-2xl font-bold">${group.name}</h2>
        <p class="text-gray-600 mb-4">
          ${group.description ?? ""} (${group.base_currency})
        </p>

        <balance-summary
          .balances=${this.store.state.balances}
          .members=${group.members}
        ></balance-summary>

        <div class="mt-6">
          <add-expense-form
            .groupId=${group.sys_id}
            .members=${group.members}
          ></add-expense-form>
        </div>

        <div class="mt-6">
          <record-settlement-form
            .groupId=${group.sys_id}
            .members=${group.members}
          ></record-settlement-form>
        </div>

        <div class="mt-6">
          <expense-list .expenses=${this.store.state.expenses}></expense-list>
        </div>
      </div>
    `;
  }
}
