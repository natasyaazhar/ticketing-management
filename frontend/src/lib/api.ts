const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * SAFE FETCH WRAPPER
 * - handle JSON + non-JSON response
 * - prevent "Unexpected token <"
 */
async function request(url: string, options?: RequestInit) {
    console.log("API_URL:", API_URL);
    console.log("URL:", `${API_URL}${url}`);
    const res = await fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers || {}),
        },
    });

    const contentType = res.headers.get("content-type");

    const data =
        contentType?.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
        console.error("❌ API ERROR:", data);
        throw new Error(
        typeof data === "string" ? data : data?.message || "Request failed"
        );
    }

    return data;
}

export const api = {
  // GET TASKS
  getTasks: async () => {
    const res = await request("/tasks");
    return res.data ?? res;
  },

  // CREATE TASK
  createTask: async (task: any) => {
    return await request("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },

  // UPDATE TASK
  updateTask: async (id: number, payload: any) => {
    return await request('/tasks/${id}', {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  // DELETE TASK
  deleteTask: async (id: number) => {
    return await request('/tasks/${id}', {
      method: "DELETE",
    });
  },
};