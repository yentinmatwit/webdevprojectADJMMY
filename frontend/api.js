const API_BASE = "/api";

function getCookie(name){
    const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return match ? match.pop() : '';
}


async function apiFetch(path, options = {}) {
    const opts = {
        credientials: "include",
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    }

    if (options.method && options.method !== "GET") {
        opts.headers["X-CSRFToken"] = getCookie("csrftoken");
    }

    const res = await fetch(API_BASE + path, opts);

    if (!res.ok){
        let detail = "Request failed";
        try { detail = (await res.json()).detail || detail; } catch(e) {}
        throw new Error(detail);
    }

    if (res.status === 204) return null;
    return res.json();
}