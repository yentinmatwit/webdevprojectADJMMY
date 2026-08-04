//Login validation
async function handleLogin() {
  var valid = true;

  //Reset errors
  document.getElementById("emailGroup").classList.remove("has-error");
  document.getElementById("passwordGroup").classList.remove("has-error");
  document.getElementById("loginAlert").style.display = "none";

  var email = document.getElementById("loginEmail").value.trim();
  var password = document.getElementById("loginPassword").value;

  //Email validation
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    document.getElementById("emailGroup").classList.add("has-error");
    valid = false;
  }

  //Password validation
  if (!password) {
    document.getElementById("passwordGroup").classList.add("has-error");
    valid = false;
  }

  if (!valid) return;

  try {
    const res = await fetch(API_BASE + "/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await res.json();

    if (!res.ok){
      showLoginError(data.detail || "Login failed. Please try again");
      return;
    }

    setTokens(data.access, data.refresh);
    window.location.href = "dashboard.html";
  } catch (err) {
    showLoginError("Network error. Is the server running?");
  }
}

function showLoginError(msg) {
  var el = document.getElementById("loginAlert");
  el.textContent = msg;
  el.style.display = "block";
}

//Allow Enter key to submit (maybe remove, test commented out)
document.addEventListener("keyup", function(e) {
  if (e.key === "Enter") handleLogin();
});
