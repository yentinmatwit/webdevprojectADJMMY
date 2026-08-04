//Login validation
async function handleLogin() {
  var valid = true;

  //Reset errors
  document.getElementById("emailGroup").classList.remove("has-error");
  document.getElementById("passwordGroup").classList.remove("has-error");

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
    await apiFetch("/auth/login/", { method: "POST", body: JSON.stringify({ email, password }) })
    window.location.href = "dashboard.html";
  } catch (err) {
    var alertEl = document.getElementById("loginAlert");
    alertEl.textContent = err.message === "Request failed" ? "Invalid email or password." : err.message
    alertEl.style.display = "block"
  }
}

//Allow Enter key to submit (maybe remove, test commented out)
document.addEventListener("keyup", function(e) {
  if (e.key === "Enter") handleLogin();
});
