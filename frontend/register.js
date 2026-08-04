//Registration validation
async function handleRegister() {
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

  if (!valid) return;

    try{

      const res = await Fetch(API_BASE + "/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email: email,
          password: password,
          confirm_password: confirm,
          preferred_job_type: pref,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(formatErrors(data));
        return;
      }

      setTokens(data.access, data.refresh)
      window.location.href = "login.html";
    } catch (err) {
      alert("Network error. Is the server running?");
    }
}

function formatErrors(data) {
  return Object.entries(data)
    .map(function(entry) { return entry[0] + ": " + entry[1]; })
    .join("\n");
}

//Allow Enter key to submit (maybe remove, test commented out)
document.addEventListener("keyup", function(e) {
  if (e.key === "Enter") handleRegister();
});
