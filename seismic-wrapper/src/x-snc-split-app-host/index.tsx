/**
 * Seismic web component: Split App Host
 *
 * Pattern B (Lit edition) — Seismic host, Lit owns a sub-tree.
 *
 * This component is a thin custom-element shell that mounts a
 * `<split-app>` Lit element into its render tree. The Lit bundle
 * is preloaded as a module at component-import time (via
 * `<link rel="modulepreload">`) and the actual `<script>` is
 * injected once on first render.
 *
 * Once the bundle is loaded and `<split-app>` is registered, the
 * host's `view()` synchronously creates a `<split-app>` element
 * and sets its `groups` property. The Lit element then handles
 * all UI state.
 *
 * Structural mirror of the React Pattern B:
 *   - view()    → renders the Lit element (no separate mount step)
 *   - destroy   → unmounted automatically when the host disconnects
 *
 * Lit-specific deltas from the React Pattern B:
 *   - We must await the bundle load before we can use
 *     `document.createElement("split-app")` (Lit registers the
 *     custom element in the bundle's IIFE)
 *   - The Lit element dispatches `CustomEvent`s with
 *     `composed: true`, which we bridge back to the workspace
 *
 * Build-time constants are rewritten by `scripts/setup-scope.js` so
 * the same source works for the SDK default scope, GLL (no prefix),
 * and any PDI (company code prefix).
 *
 * No JSX is used: the Seismic renderer (`@servicenow/ui-renderer-snabbdom`)
 * is auto-selected by the build pipeline and exposes a `createElement`
 * helper. Using it directly keeps the host framework-agnostic and
 * removes the need for a JSX tsconfig pragma.
 */

import { createCustomElement } from "@servicenow/ui-core";
// @ts-expect-error - the snabbdom renderer has no published types; we
// rely on its runtime shape (default export with createElement).
import renderer from "@servicenow/ui-renderer-snabbdom";

// Build-time constants — rewritten by setup-scope.js
const APP_SCOPE = "x_snc_split";

// Local mirror of the Lit element's public API. The class itself
// lives in the Lit bundle; the host only knows the tag name and
// the shape of the @property it sets.
interface SplitAppElement extends HTMLElement {
  groups: Array<{
    sys_id: string;
    name: string;
    base_currency: "USD" | "EUR" | "INR" | "GBP";
    member_count: number;
  }>;
}

function getAssetUrl(): string {
  // Cache-bust by appending a build-time version query string. The
  // `build-frontend.cjs` script writes a content hash to a small
  // version file that the Seismic build inlines at build time
  // (via the SN_SPLIT_VERSION env var). Fall back to a timestamp
  // so the host never serves a stale bundle in dev.
  const env = (globalThis as { process?: { env?: { SN_SPLIT_VERSION?: string } } })
    .process?.env;
  const version = env?.SN_SPLIT_VERSION || String(Date.now());
  return `/api/now/ux/asset/${APP_SCOPE}/split_app_main?v=${version}`;
}

// Shared across all instances of this host on the page — ensures
// the Lit bundle is loaded once even if multiple workspace screens
// mount this host concurrently.
let bundlePromise: Promise<void> | null = null;

function preloadLitBundle(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector(`link[data-split-bundle]`)) return;

  const link = document.createElement("link");
  link.rel = "modulepreload";
  link.href = getAssetUrl();
  link.setAttribute("data-split-bundle", "true");
  document.head.appendChild(link);
}

function loadLitBundle(): Promise<void> {
  if (bundlePromise) return bundlePromise;

  bundlePromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = getAssetUrl();

    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error(`Failed to load Lit bundle from ${script.src}`));

    document.head.appendChild(script);
  });

  return bundlePromise;
}

// Preload immediately at module-import time so the first render
// doesn't have to wait for a network round trip.
preloadLitBundle();

createCustomElement("x-snc-split-app-host", {
  initialState: {
    ready: false,
    error: null as string | null,
  },

  // view() is called on every state change. We render the Lit
  // element synchronously, and the Lit element is mounted into
  // the DOM automatically by the snabbdom renderer.
  view: (state: { ready: boolean; error: string | null }) => {
    if (state.error) {
      return renderer.createElement(
        "p",
        { className: "split-app-error" },
        `Failed to load SplitApp: ${state.error}`,
      );
    }

    if (!state.ready) {
      // Loading state — kick off the async load, then dispatch
      // a state update when ready.
      loadLitBundle()
        .then(() => {
          const host = document.querySelector("x-snc-split-app-host");
          if (host) {
            (host as unknown as { dispatch: (a: object) => void }).dispatch({
              type: "BUNDLE_LOADED",
            });
          }
        })
        .catch((err: unknown) => {
          const host = document.querySelector("x-snc-split-app-host");
          if (host) {
            (host as unknown as { dispatch: (a: object) => void }).dispatch({
              type: "BUNDLE_FAILED",
              payload: { message: (err as Error).message },
            });
          }
        });

      return renderer.createElement("div", { className: "lit-mount" });
    }

    // ↓↓↓ Down-channel: host → Lit @property ↓↓↓
    // Setting a property on a custom element triggers Lit's
    // reactive update cycle (see Lit's @property decorator).
    // We use a key-prefixed props object via the renderer's
    // `props` mechanism so the Snabbdom renderer sets these
    // as DOM properties (not attributes) on the custom element.
    return renderer.createElement("split-app", {
      className: "lit-mount",
      props: { groups: [] as SplitAppElement["groups"] },
    } as Record<string, unknown>);
  },

  actionHandlers: {
    "BUNDLE_LOADED": {
      effect: (state: { ready: boolean; error: string | null }) => {
        state.ready = true;
        state.error = null;
      },
    },
    "BUNDLE_FAILED": {
      effect: (
        state: { ready: boolean; error: string | null },
        action: { payload?: { message?: string } },
      ) => {
        state.ready = false;
        state.error = action.payload?.message || "Unknown error";
      },
    },
  },

  // ↑↑↑ Up-channel: Lit CustomEvent → host listener ↑↑↑
  // The Lit element dispatches with `composed: true` so events
  // cross the shadow boundary and the host can catch them.
  // We attach listeners to the host element itself in
  // `connectedCallback` (patched below).
});

// Patch the host custom element to bridge Lit events up into
// the Seismic dispatch bus. `createCustomElement` doesn't expose
// a hook for this, so we add connectedCallback/disconnectedCallback
// to the registered element directly.
function patchHostLifecycle(name: string) {
  if (typeof customElements === "undefined") return;
  const Ctor = customElements.get(name);
  if (!Ctor) {
    // The custom element hasn't been registered yet — wait
    // for the next microtask and try again.
    Promise.resolve().then(() => patchHostLifecycle(name));
    return;
  }

  const proto = Ctor.prototype as HTMLElement & {
    connectedCallback?: () => void;
    disconnectedCallback?: () => void;
  };

  if (proto.connectedCallback) return; // already patched

  proto.connectedCallback = function () {
    const onGroupSelected = (e: Event) => {
      const detail = (e as CustomEvent<{ sys_id: string; name: string }>)
        .detail;
      // eslint-disable-next-line no-console
      console.log("Host received group-selected:", detail);
      // In real use: dispatch into the Seismic event bus so
      // workspace state updates (e.g. URL changes, nav).
      (
        this as unknown as { dispatch: (a: object) => void }
      ).dispatch({
        type: "GROUP_SELECTED",
        payload: detail,
      });
    };

    const onReady = (e: Event) => {
      const detail = (e as CustomEvent<{ tag: string }>).detail;
      // eslint-disable-next-line no-console
      console.log("Lit element reports ready:", detail.tag);
    };

    this.addEventListener("group-selected", onGroupSelected);
    this.addEventListener("split-app-ready", onReady);
    (
      this as unknown as { __splitAppListeners?: Record<string, EventListener> }
    ).__splitAppListeners = { "group-selected": onGroupSelected, "split-app-ready": onReady };
  };

  proto.disconnectedCallback = function () {
    const listeners = (
      this as unknown as { __splitAppListeners?: Record<string, EventListener> }
    ).__splitAppListeners;
    if (listeners) {
      for (const [type, fn] of Object.entries(listeners)) {
        this.removeEventListener(type, fn);
      }
    }
  };
}

patchHostLifecycle("x-snc-split-app-host");
