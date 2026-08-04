//Login validation
function handleLogin() {
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

  if (valid) {
    alert("Login successful! Redirecting to dashboard...");
    window.location.href = "dashboard.html";
  }
}

//Allow Enter key to submit
document.addEventListener("keyup", function(e) {
  if (e.key === "Enter") handleLogin();
});
