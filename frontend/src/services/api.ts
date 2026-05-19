const BASE = "/api/x_split";

async function request(method: string, path: string, data?: any): Promise<any> {
  const opts: RequestInit = {
    method,
    headers: { Accept: "application/json" },
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
