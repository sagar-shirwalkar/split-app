import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

@customElement("date-picker")
export class DatePicker extends LitElement {
  @property({ type: String }) value = "";
  @property({ type: Boolean }) required = false;

  @state() private _year = "";
  @state() private _month = "";
  @state() private _day = "";

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("value")) {
      this._parse();
    }
  }

  private _parse() {
    const val = typeof this.value === "string" ? this.value : "";
    if (!val) {
      this._year = this._month = this._day = "";
      return;
    }
    const [y, m, d] = val.split("-");
    this._year = y || "";
    this._month = m || "";
    this._day = d || "";
  }

  private _emit() {
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
    for (let y = currentYear; y >= 2000; y--) years.push(y);

    const daysInMonth =
      this._year && this._month
        ? new Date(parseInt(this._year), parseInt(this._month), 0).getDate()
        : 31;
    const days: number[] = [];
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return html`
      <div class="flex gap-1">
        <select
          class="select w-20"
          aria-label="Month"
          .value=${this._month}
          @change=${(e: any) => {
            this._month = e.target.value;
            if (parseInt(this._day) > daysInMonth) this._day = "";
            this._emit();
          }}
        >
          <option value="">Month</option>
          ${MONTHS.map(
            (m) => html`<option value=${m.value}>${m.label}</option>`,
          )}
        </select>
        <select
          class="select w-16"
          aria-label="Day"
          .value=${this._day}
          @change=${(e: any) => {
            this._day = e.target.value;
            this._emit();
          }}
        >
          <option value="">Day</option>
          ${days.map(
            (d) => html`<option value=${String(d).padStart(2, "0")}>${d}</option>`,
          )}
        </select>
        <select
          class="select w-20"
          aria-label="Year"
          .value=${this._year}
          @change=${(e: any) => {
            this._year = e.target.value;
            if (parseInt(this._day) > daysInMonth) this._day = "";
            this._emit();
          }}
        >
          <option value="">Year</option>
          ${years.map((y) => html`<option value=${y}>${y}</option>`)}
        </select>
      </div>
    `;
  }
}
