import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { StoreController } from "./store/store.js";
import "./components/avatar.js";
import "./components/toast.js";
import "./components/group-list.js";
import "./components/group-detail.js";
import "./components/user-dashboard.js";

type View = "dashboard" | "groups" | "group-detail";

interface NavLink {
  view: View;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { view: "dashboard", label: "Overview" },
  { view: "groups",    label: "Groups"   },
];

@customElement("split-app")
export class SplitApp extends LitElement {
  private store = new StoreController(this);

  render() {
    const { currentView, currentUser } = this.store.state;
    return html`
      <div class="page">
        <app-toast-host></app-toast-host>

        <header class="topnav">
          <div class="mx-auto max-w-5xl px-4 sm:px-6 h-14 flex items-center gap-6">
            <button
              class="flex items-center gap-2 group focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-brand-500
                     focus-visible:ring-offset-2 rounded-md"
              @click=${() => this.store.navigate("dashboard")}
            >
              <span
                class="inline-flex h-7 w-7 items-center justify-center
                       rounded-lg bg-ink-900 text-white
                       text-sm font-semibold tracking-tight"
              >
                S
              </span>
              <span
                class="text-sm font-semibold tracking-tight text-ink-900
                       group-hover:text-ink-700"
              >
                SplitApp
              </span>
            </button>

            <nav class="flex items-center gap-1 ml-2">
              ${NAV_LINKS.map(
                (link) => html`
                  <button
                    class="px-3 h-8 rounded-md text-sm font-medium
                           transition-colors
                           ${currentView === link.view ||
                           (link.view === "groups" &&
                             currentView === "group-detail")
                             ? "bg-ink-100 text-ink-900"
                             : "text-ink-500 hover:text-ink-900 hover:bg-ink-50"}"
                    @click=${() => this.store.navigate(link.view)}
                  >
                    ${link.label}
                  </button>
                `,
              )}
            </nav>

            <div class="ml-auto flex items-center gap-2">
              <span class="hidden sm:inline text-xs text-ink-500">
                ${currentUser ?? ""}
              </span>
              <sn-avatar
                .name=${currentUser ?? "You"}
                size="sm"
              ></sn-avatar>
            </div>
          </div>
        </header>

        <main class="page-main">
          ${currentView === "dashboard"
            ? html`<user-dashboard></user-dashboard>`
            : ""}
          ${currentView === "groups"
            ? html`<group-list></group-list>`
            : ""}
          ${currentView === "group-detail"
            ? html`<group-detail></group-detail>`
            : ""}
        </main>
      </div>
    `;
  }
}
