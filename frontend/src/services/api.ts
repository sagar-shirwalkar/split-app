const envBase = import.meta.env.VITE_API_BASE as string | undefined;
let BASE = envBase || "/api/x_snc_split/x_snc_split";

export async function discoverApiBase(): Promise<string> {
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if ((window as any).g_ck) headers["X-UserToken"] = (window as any).g_ck;
    const res = await fetch(
      "/api/now/table/sys_ws_definition?sysparm_query=name=split_api&sysparm_fields=base_uri&sysparm_limit=1",
      { headers, credentials: "include" }
    );
    const data = await res.json();
    if (data.result?.length > 0 && data.result[0].base_uri) {
      BASE = data.result[0].base_uri;
      return BASE;
    }
  } catch {}
  return BASE;
}

async function request(method: string, path: string, data?: any): Promise<any> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if ((window as any).g_ck) headers["X-UserToken"] = (window as any).g_ck;
  const opts: RequestInit = {
    method,
    headers,
    credentials: "include",
  };
  if (data !== undefined) {
    (opts.headers as Record<string, string>)["Content-Type"] =
      "application/json";
    opts.body = JSON.stringify(data);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    throw new Error(`API ${method} ${path} returned ${res.status}`);
  }
  return res.json();
}

export async function apiGet(path: string): Promise<any> {
  return request("GET", path);
}

export async function apiPost(path: string, data: any): Promise<any> {
  return request("POST", path, data);
}

export async function apiPut(path: string, data: any): Promise<any> {
  return request("PUT", path, data);
}

export async function apiDelete(path: string): Promise<any> {
  return request("DELETE", path);
}
