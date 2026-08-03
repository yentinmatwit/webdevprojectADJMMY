//Registration validation
function handleRegister() {
  var valid = true;

  //Reset all error states
  var groups = ["nameGroup","regEmailGroup","regPassGroup","confirmGroup","prefGroup"];
  for (var i = 0; i < groups.length; i++) {
    document.getElementById(groups[i]).classList.remove("has-error");
  }

  var name = document.getElementById("regName").value.trim();
  var email = document.getElementById("regEmail").value.trim();
  var password = document.getElementById("regPassword").value;
  var confirm = document.getElementById("regConfirm").value;
  var pref = document.getElementById("regPref").value;

  //Name check
  if (!name || name.length < 2) {
    document.getElementById("nameGroup").classList.add("has-error");
    valid = false;
  }

  //Email check
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    document.getElementById("regEmailGroup").classList.add("has-error");
    valid = false;
  }

  //Password check (min 6 chars)
  if (!password || password.length < 6) {
    document.getElementById("regPassGroup").classList.add("has-error");
    valid = false;
  }

  //Confirm password check
  if (password !== confirm) {
    document.getElementById("confirmGroup").classList.add("has-error");
    valid = false;
  }

  //Preference check
  if (!pref) {
    document.getElementById("prefGroup").classList.add("has-error");
    valid = false;
  }

  if (valid) {
    alert("Account created! Redirecting to login...");
    window.location.href = "login.html";
  }
}

//Allow Enter key to submit
document.addEventListener("keyup", function(e) {
  if (e.key === "Enter") handleRegister();
});
