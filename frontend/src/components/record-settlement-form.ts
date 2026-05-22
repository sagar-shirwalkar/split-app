import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
import "./date-picker.js";

@customElement("record-settlement-form")
export class RecordSettlementForm extends LitElement {
  private store = new StoreController(this);
  @property({ type: String }) groupId = "";
  @property({ type: Array }) members: any[] = [];

  @state() toUser = "";
  @state() amount = "";
  @state() date = "";
  @state() paymentMethod = "";
  @state() showForm = false;

  render() {
    if (!this.showForm) {
      return html`
        <button
          @click=${() => (this.showForm = true)}
          class="px-4 py-2 rounded text-white font-semibold"
          style="background-color: #62d84e"
        >
          + Record Settlement
        </button>
      `;
    }

    return html`
      <div class="bg-white shadow p-4 rounded border">
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold text-[#000000]">Record Settlement</h3>
          <button
            @click=${() => (this.showForm = false)}
            class="text-[#4f4f4f] text-sm underline"
          >
            Cancel
          </button>
        </div>
        <form @submit=${this.handleSubmit}>
          <select
            class="border p-2 mb-2 w-full rounded text-[#4f4f4f] bg-white"
            .value=${this.toUser}
            @change=${(e: any) => (this.toUser = e.target.value)}
            required
          >
            <option value="">Select recipient</option>
            ${this.members.map(
              (m: any) =>
                html`<option value=${m.sys_id}>${m.name}</option>`,
            )}
          </select>

          <div class="relative mb-2">
            <span class="absolute left-3 top-2 text-[#4f4f4f] font-semibold">$</span>
            <input
              class="border p-2 pl-7 w-full rounded text-[#4f4f4f]"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              .value=${this.amount}
              @input=${(e: any) => {
                const val = e.target.value;
                if (val.includes(".") && val.split(".")[1].length > 2) return;
                this.amount = val;
              }}
              required
            />
          </div>

          <label class="block text-sm text-[#4f4f4f] mb-1">Date</label>
          <date-picker
            .value=${this.date}
            @change=${(e: any) => (this.date = e.detail.value)}
          ></date-picker>

          <div class="mt-2 mb-2">
            <select
              class="border p-2 w-full rounded text-[#4f4f4f] bg-white"
              .value=${this.paymentMethod}
              @change=${(e: any) => (this.paymentMethod = e.target.value)}
            >
              <option value="">Payment method...</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
              <option value="Venmo">Venmo</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            class="px-4 py-2 rounded text-white font-semibold"
            style="background-color: #62d84e"
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
      from_user: "",
      amount: parseFloat(parseFloat(this.amount).toFixed(2)),
      date: this.date,
      payment_method: this.paymentMethod,
    });
    this.toUser = "";
    this.amount = "";
    this.date = "";
    this.paymentMethod = "";
    this.showForm = false;
  }
}
