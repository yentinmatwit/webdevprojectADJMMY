const API_BASE = "http://127.0.0.1:8000";

function getAccessToken() {
    return localStorage.getItem("access_token");
}


function getRefreshToken() {
    return localStorage.getItem("refresh_token");
}


function setTokens(access, refresh) {
  localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}


function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}


function isLoggedIn() {
  return !!getAccessToken();
}


// Wrapper that auto-attaches the Authorization header
async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (isLoggedIn()) {
    headers["Authorization"] = "Bearer " + getAccessToken();
  }

  let res = await fetch(API_BASE + path, { ...options, headers });

  // If access token expired, try refreshing once and retry
  if (res.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers["Authorization"] = "Bearer " + getAccessToken();
      res = await fetch(API_BASE + path, { ...options, headers });
    }
  }

  return res;
}


async function refreshAccessToken() {
  try {
    const res = await fetch(API_BASE + "/api/auth/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: getRefreshToken() }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const data = await res.json();
    setTokens(data.access, null);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}