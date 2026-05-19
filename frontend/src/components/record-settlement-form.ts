import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { StoreController } from "../store/store.js";

@customElement("record-settlement-form")
export class RecordSettlementForm extends LitElement {
  private store = new StoreController(this);
  @property({ type: String }) groupId = "";
  @property({ type: Array }) members: any[] = [];

  @state() toUser = "";
  @state() amount = "";
  @state() date = "";
  @state() paymentMethod = "";

  render() {
    return html`
      <div class="bg-white shadow p-4 rounded mt-4">
        <h3 class="font-semibold mb-2">Record Settlement</h3>
        <form @submit=${this.handleSubmit}>
          <select
            class="border p-2 mb-2 w-full"
            .value=${this.toUser}
            @change=${(e: any) => (this.toUser = e.target.value)}
            required
          >
            <option value="">Select recipient</option>
            ${this.members.map(
              (m) => html`<option value=${m.sys_id}>${m.name}</option>`,
            )}
          </select>
          <input
            class="border p-2 mb-2 w-full"
            type="number"
            step="0.01"
            placeholder="Amount"
            .value=${this.amount}
            @input=${(e: any) => (this.amount = e.target.value)}
            required
          />
          <input
            class="border p-2 mb-2 w-full"
            type="date"
            .value=${this.date}
            @input=${(e: any) => (this.date = e.target.value)}
            required
          />
          <input
            class="border p-2 mb-2 w-full"
            placeholder="Payment method (e.g., cash)"
            .value=${this.paymentMethod}
            @input=${(e: any) => (this.paymentMethod = e.target.value)}
          />
          <button
            type="submit"
            class="bg-green-600 text-white px-4 py-2 rounded"
          >
            Record Settlement
          </button>
        </form>
      </div>
    `;
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    await this.store.recordSettlement({
      to_user: this.toUser,
      from_user: "", // will be set by server as current user
      amount: parseFloat(this.amount),
      date: this.date,
      payment_method: this.paymentMethod,
    });
    this.toUser = "";
    this.amount = "";
    this.date = "";
    this.paymentMethod = "";
  }
}
