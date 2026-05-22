import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("date-picker")
export class DatePicker extends LitElement {
  @property({ type: String }) value = "";
  @property({ type: Boolean }) required = false;

  private _month = "";
  private _day = "";
  private _year = "";

  connectedCallback() {
    super.connectedCallback();
    if (this.value) {
      const parts = this.value.split("-");
      if (parts.length === 3) {
        this._year = parts[0];
        this._month = parts[1];
        this._day = parts[2];
      }
    }
  }

  private _emitChange() {
    if (this._year && this._month && this._day) {
      this.value = `${this._year}-${this._month.padStart(2, "0")}-${this._day.padStart(2, "0")}`;
    } else {
      this.value = "";
    }
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const years: number[] = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 2000; y--) {
      years.push(y);
    }

    const months = [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ];

    const daysInMonth = this._year && this._month
      ? new Date(parseInt(this._year), parseInt(this._month), 0).getDate()
      : 31;
    const days: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    return html`
      <div class="flex gap-1">
        <select
          class="border p-2 text-sm text-[#4f4f4f] bg-white rounded w-28"
          .value=${this._month}
          @change=${(e: any) => {
            this._month = e.target.value;
            if (parseInt(this._day) > daysInMonth) this._day = "";
            this._emitChange();
          }}
        >
          <option value="">Month</option>
          ${months.map(
            (m) => html`<option value=${m.value}>${m.label}</option>`,
          )}
        </select>
        <select
          class="border p-2 text-sm text-[#4f4f4f] bg-white rounded w-16"
          .value=${this._day}
          @change=${(e: any) => {
            this._day = e.target.value;
            this._emitChange();
          }}
        >
          <option value="">Day</option>
          ${days.map(
            (d) => html`<option value=${String(d).padStart(2, "0")}>${d}</option>`,
          )}
        </select>
        <select
          class="border p-2 text-sm text-[#4f4f4f] bg-white rounded w-24"
          .value=${this._year}
          @change=${(e: any) => {
            this._year = e.target.value;
            if (parseInt(this._day) > daysInMonth) this._day = "";
            this._emitChange();
          }}
        >
          <option value="">Year</option>
          ${years.map(
            (y) => html`<option value=${y}>${y}</option>`,
          )}
        </select>
      </div>
    `;
  }
}
