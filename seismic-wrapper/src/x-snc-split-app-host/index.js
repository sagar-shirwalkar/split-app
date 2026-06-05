import { createCustomElement } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";

// Build-time constant — rewritten by setup-scope.js
const APP_SCOPE = "x_split";

const ASSET_URL = `/api/now/ux/asset/${APP_SCOPE}/split_app_main`;

let bundleLoaded = false;
let bundleLoading = false;
const loadCallbacks = [];

/**
 * Load the Lit bundle once (shared across all instances of this component).
 * Returns a promise that resolves when <split-app> custom element is defined.
 */
function loadLitBundle() {
  return new Promise((resolve, reject) => {
    if (bundleLoaded) {
      resolve();
      return;
    }

    if (bundleLoading) {
      loadCallbacks.push({ resolve, reject });
      return;
    }

    bundleLoading = true;

    const script = document.createElement("script");
    script.type = "module";
    script.src = ASSET_URL;

    script.onload = () => {
      bundleLoaded = true;
      bundleLoading = false;
      resolve();
      loadCallbacks.forEach((cb) => cb.resolve());
      loadCallbacks.length = 0;
    };

    script.onerror = (err) => {
      bundleLoading = false;
      const error = new Error(`Failed to load Lit bundle from ${ASSET_URL}`);
      reject(error);
      loadCallbacks.forEach((cb) => cb.reject(error));
      loadCallbacks.length = 0;
    };

    document.head.appendChild(script);
  });
}

const view = (state, { updateState }) => {
  if (state.error) {
    return (
      <div className="split-app-error">
        <p>Failed to load SplitApp: {state.error}</p>
        <button on-click={() => updateState({ error: null, mounted: false })}>
          Retry
        </button>
      </div>
    );
  }

  if (!state.mounted) {
    return <div className="split-app-loading">Loading SplitApp...</div>;
  }

  // Render the container — Lit element is mounted via hook
  return (
    <div
      className="split-app-container"
      hook-insert={(vnode) => mountLitElement(vnode.elm)}
      hook-destroy={(vnode) => unmountLitElement(vnode.elm)}
    />
  );
};

function mountLitElement(container) {
  // Only append if not already mounted (prevents duplicates on re-render)
  if (!container.querySelector("split-app")) {
    const splitApp = document.createElement("split-app");
    container.appendChild(splitApp);
  }
}

function unmountLitElement(container) {
  const splitApp = container.querySelector("split-app");
  if (splitApp) {
    container.removeChild(splitApp);
  }
}

createCustomElement("x-snc-split-app-host", {
  renderer: { type: snabbdom },
  view,
  styles: `
        :host {
            display: block;
            width: 100%;
            height: 100%;
        }
        .split-app-container {
            width: 100%;
            min-height: calc(100vh - 56px);
        }
        .split-app-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 200px;
            color: #6b7280;
            font-size: 14px;
        }
        .split-app-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 200px;
            color: #dc2626;
            font-size: 14px;
            gap: 12px;
        }
        .split-app-error button {
            padding: 8px 16px;
            border-radius: 4px;
            border: 1px solid #d1d5db;
            background: #fff;
            cursor: pointer;
            font-size: 13px;
        }
    `,
  properties: {},
  setInitialState() {
    return {
      mounted: false,
      error: null,
    };
  },
  connectedCallback() {
    loadLitBundle()
      .then(() => {
        this.updateState({ mounted: true });
      })
      .catch((err) => {
        this.updateState({ error: err.message });
      });
  },
});
