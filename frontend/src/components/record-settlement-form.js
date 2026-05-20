var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { StoreController } from "../store/store.js";
let RecordSettlementForm = class RecordSettlementForm extends LitElement {
    constructor() {
        super(...arguments);
        this.store = new StoreController(this);
        this.groupId = "";
        this.members = [];
        this.toUser = "";
        this.amount = "";
        this.date = "";
        this.paymentMethod = "";
    }
    render() {
        return html `
      <div class="bg-white shadow p-4 rounded mt-4">
        <h3 class="font-semibold mb-2">Record Settlement</h3>
        <form @submit=${this.handleSubmit}>
          <select
            class="border p-2 mb-2 w-full"
            .value=${this.toUser}
            @change=${(e) => (this.toUser = e.target.value)}
            required
          >
            <option value="">Select recipient</option>
            ${this.members.map((m) => html `<option value=${m.sys_id}>${m.name}</option>`)}
          </select>
          <input
            class="border p-2 mb-2 w-full"
            type="number"
            step="0.01"
            placeholder="Amount"
            .value=${this.amount}
            @input=${(e) => (this.amount = e.target.value)}
            required
          />
          <input
            class="border p-2 mb-2 w-full"
            type="date"
            .value=${this.date}
            @input=${(e) => (this.date = e.target.value)}
            required
          />
          <input
            class="border p-2 mb-2 w-full"
            placeholder="Payment method (e.g., cash)"
            .value=${this.paymentMethod}
            @input=${(e) => (this.paymentMethod = e.target.value)}
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
    async handleSubmit(e) {
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
};
__decorate([
    property({ type: String })
], RecordSettlementForm.prototype, "groupId", void 0);
__decorate([
    property({ type: Array })
], RecordSettlementForm.prototype, "members", void 0);
__decorate([
    state()
], RecordSettlementForm.prototype, "toUser", void 0);
__decorate([
    state()
], RecordSettlementForm.prototype, "amount", void 0);
__decorate([
    state()
], RecordSettlementForm.prototype, "date", void 0);
__decorate([
    state()
], RecordSettlementForm.prototype, "paymentMethod", void 0);
RecordSettlementForm = __decorate([
    customElement("record-settlement-form")
], RecordSettlementForm);
export { RecordSettlementForm };
