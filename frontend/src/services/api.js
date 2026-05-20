const envBase = import.meta.env.VITE_API_BASE;
let BASE = envBase || "/api/x_split";
export async function discoverApiBase() {
    try {
        const res = await fetch("/api/now/table/sys_ws_definition?sysparm_query=name=split_api&sysparm_fields=base_uri&sysparm_limit=1");
        const data = await res.json();
        if (data.result?.length > 0 && data.result[0].base_uri) {
            BASE = data.result[0].base_uri;
            return BASE;
        }
    }
    catch { }
    return BASE;
}
async function request(method, path, data) {
    const opts = {
        method,
        headers: { Accept: "application/json" },
        credentials: "include",
    };
    if (data !== undefined) {
        opts.headers["Content-Type"] =
            "application/json";
        opts.body = JSON.stringify(data);
    }
    const res = await fetch(`${BASE}${path}`, opts);
    if (!res.ok) {
        throw new Error(`API ${method} ${path} returned ${res.status}`);
    }
    return res.json();
}
export async function apiGet(path) {
    return request("GET", path);
}
export async function apiPost(path, data) {
    return request("POST", path, data);
}
export async function apiPut(path, data) {
    return request("PUT", path, data);
}
export async function apiDelete(path) {
    return request("DELETE", path);
}
