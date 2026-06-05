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
  { view: "groups", label: "Groups" },
];

@customElement("split-app")
export class SplitApp extends LitElement {
  private store = new StoreController(this);

  render() {
    const { currentView, currentUser } = this.store.state;
    const userName = (currentUser || "").trim() || "Account";
    const showNameInNav = !!currentUser;

    return html`
      <div class="page" style="display:block;width:100%">
        <app-toast-host></app-toast-host>

        <header
          class="topnav"
          role="banner"
          style="display:block;width:100%"
        >
          <div
            class="topnav-inner"
            style="display:flex;align-items:center;gap:1.5rem;
                   width:100%;max-width:72rem;margin:0 auto;
                   height:3.5rem;padding:0 1rem"
          >
            <button
              class="topnav-brand"
              style="display:inline-flex;align-items:center;gap:0.5rem;
                     background:transparent;border:0;cursor:pointer;
                     padding:0.25rem;border-radius:0.375rem"
              @click=${() => this.store.navigate("dashboard")}
            >
              <span
                style="display:inline-flex;align-items:center;justify-content:center;
                       height:1.75rem;width:1.75rem;border-radius:0.5rem;
                       background:#0a0a0a;color:#fff;
                       font-size:0.875rem;font-weight:600;letter-spacing:-0.01em"
              >
                S
              </span>
              <span
                style="font-size:0.95rem;font-weight:600;letter-spacing:-0.01em;
                       color:#0a0a0a"
              >
                SplitApp
              </span>
            </button>

            <nav
              aria-label="Primary"
              style="display:flex;align-items:center;gap:0.25rem"
            >
              ${NAV_LINKS.map((link) => {
                const active =
                  currentView === link.view ||
                  (link.view === "groups" && currentView === "group-detail");
                return html`
                  <button
                    style=${`display:inline-flex;align-items:center;height:2rem;
                            padding:0 0.75rem;border-radius:0.375rem;
                            font-size:0.875rem;font-weight:500;
                            border:0;cursor:pointer;
                            transition:background-color 150ms;
                            background:${active ? "#f4f4f5" : "transparent"};
                            color:${active ? "#0a0a0a" : "#71717a"}`}
                    @mouseenter=${(e: MouseEvent) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background =
                          "#fafafa";
                    }}
                    @mouseleave=${(e: MouseEvent) => {
                      if (!active)
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                    }}
                    @click=${() => this.store.navigate(link.view)}
                  >
                    ${link.label}
                  </button>
                `;
              })}
            </nav>

            <div
              style="margin-left:auto;display:flex;align-items:center;gap:0.5rem;
                     padding:0.25rem 0.5rem 0.25rem 0.25rem;border-radius:9999px"
              title=${`Signed in as ${userName}`}
            >
              <sn-avatar
                .name=${userName}
                size="sm"
              ></sn-avatar>
              <div
                style="display:flex;flex-direction:column;line-height:1.1"
              >
                <span
                  style="font-size:0.7rem;color:#71717a;
                         text-transform:uppercase;letter-spacing:0.06em;
                         font-weight:600"
                  >Account</span
                >
                <span
                  style="font-size:0.825rem;color:#0a0a0a;font-weight:500;
                         max-width:10rem;overflow:hidden;text-overflow:ellipsis;
                         white-space:nowrap"
                  >${showNameInNav ? currentUser : "Not signed in"}</span
                >
              </div>
            </div>
          </div>
        </header>

        <main class="page-main" role="main">
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
