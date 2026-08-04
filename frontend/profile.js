//Edit bio via prompt
function editBio() {
  var bioEl = document.getElementById("bioText");
  var current = bioEl.textContent;
  var updated = prompt("Edit your bio:", current);
  if (updated !== null && updated.trim() !== "") {
    bioEl.textContent = updated.trim();
    showAlert("Bio updated.");
  }
}

//Save account settings
function saveSettings() {
  var name = document.getElementById("profileName").value.trim();
  var email = document.getElementById("profileEmail").value.trim();

  if (!name) { alert("Name is required."); return; }
  if (!email || email.indexOf("@") === -1) { alert("Enter a valid email."); return; }

  showAlert("Settings saved.");
}

//Show success alert
function showAlert(msg) {
  var el = document.getElementById("profileAlert");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 3000);
}
