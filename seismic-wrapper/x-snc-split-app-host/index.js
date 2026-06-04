import { createCustomElement } from "@servicenow/ui-core";
import snabbdom from "@servicenow/ui-renderer-snabbdom";

const view = (state, { dispatch }) => {
  return (
    <div
      className="split-app-container"
      hook-insert={(vnode) => mountLitApp(vnode.elm)}
      hook-destroy={(vnode) => cleanupLitApp(vnode.elm)}
    ></div>
  );
};

function mountLitApp(container) {
  // Check if we're using bundled mode (assets exist)
  const assetsExist = checkAssetsExist();
  
  if (assetsExist) {
    // Bundled mode: Load local assets
    mountLitAppBundled(container);
  } else {
    // Runtime mode: Load from sys_ux_lib_asset (existing behavior)
    mountLitAppRuntime(container);
  }
}

function checkAssetsExist() {
  // Check if bundled assets exist in the component's context
  // In a deployed Seismic component, assets would be at ./split_app_main.js and ./split_app.css
  // We'll attempt to check by creating a link element and seeing if it would load
  // For simplicity, we'll check if we're in bundled mode by looking for a data attribute
  // or we could make this configurable via a build-time flag
  
  // Simple approach: check if we can find the assets by attempting to create them
  // Since we can't actually check filesystem from client-side JS, we'll rely on 
  // the build process to determine which files are present
  
  // For now, we'll use a simple heuristic: if the component was built with 
  // SEISMIC_LIT_MODE=bundled, the assets will be present
  // We'll determine this by checking if a specific marker exists or by trying to load
  
  // Better approach: Make this configurable via a build-time variable that gets 
  // injected into the HTML. But for simplicity in this implementation,
  // we'll check if we can create a link to the CSS file and assume it exists if 
  // we're in bundled mode (this would need to be set during build)
  
  // Since we can't detect filesystem from client-side, we'll rely on 
  // the build process having created the appropriate files
  // For this implementation, we'll assume bundled mode if we're running 
  // from the seismic-wrapper context and the build was done in bundled mode
  
  // Actually, let's use a simpler approach: check for a specific attribute
  // that we can set on the host element during build
  const hostElement = document.currentScript?.ownerDocument?.host || document.querySelector('x-snc-split-app-host');
  return hostElement ? hostElement.getAttribute('data-lit-mode') === 'bundled' : false;
}

function mountLitAppBundled(container) {
  // Load bundled Lit component assets
  
  // Load CSS
  const link = document.createElement("link");
  link.rel = "stylesheet";
  // Assuming assets are served from the component's context
  link.href = "./split_app.css"; 
  
  // Load JS
  const script = document.createElement("script");
  script.type = "module";
  script.src = "./split_app_main.js";
  
  script.onload = () => {
    // Once Lit bundle is loaded, create and mount the custom element
    const splitApp = document.createElement("split-app");
    container.appendChild(splitApp);
  };
  
  container.appendChild(link);
  container.appendChild(script);
}

function mountLitAppRuntime(container) {
  // Load the Lit bundle (already deployed as sys_ux_lib_asset)
  const script = document.createElement("script");
  script.type = "module";
 
  // This path resolves to the sys_ux_lib_asset record
  // The ?uxpcb= cache-buster is added automatically by the platform
  script.src = "/api/now/ux/asset/x_snc_split/split_app_main";
  script.onload = () => {
    // Once Lit bundle is loaded, create and mount the custom element
    const splitApp = document.createElement("split-app");
    container.appendChild(splitApp);
  };
  container.appendChild(script);

  // Inject Tailwind styles into the container
  const style = document.createElement("style");
  style.textContent = `/* Your compiled Tailwind CSS goes here, 
                            or load it from another asset */`;
  container.appendChild(style);
}

function cleanupLitApp(container) {
  // Remove Lit element on component destroy
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

createCustomElement("x-snc-split-app-host", {
  renderer: { type: snabbdom },
  view,
  styles: `
          .split-app-container {
              width: 100%;
              height: 100%;
              min-height: 100vh;
          }
      `,
  properties: {},
  setInitialState() {
    return {};
  },
});