let profileData = null;

async function loadProfile() {
  profileData = await apiFetch("/profile/");
  document.getElementById("bioText").textContent = profileData.bio;
  document.getElementById("profileName").textContent = profileData.full_name;
  document.getElementById("profileEmail").textContent = profileData.email;
  document.getElementById("profileLocaiton").textContent = profileData.location;
  document.getElementById("profilePhone").textContent = profileData.phone;
  // render skills/enducaiton/experience from profileData.skills ect. as needed
}


//Edit bio via prompt
async function editBio() {
  var bioEl = document.getElementById("bioText");
  var updated = prompt("Edit your bio:", bioEl.textContent);
  if (updated !== null && updated.trim() !== "") {
    bioEl.textContent = updated.trim();
    showAlert("Bio updated.");
  }
}

//Save account settings
async function saveSettings() {
  var name = document.getElementById("profileName").value.trim();
  var location = document.getElementById("profileLocation").value.trim();
  var phone = document.getElementById("profilePhone").value.trim();

  if (!name) { alert("Name is required."); return; }
  
  await apiFetch("/profile/", { method: "PATCH", body: JSON.stringify({ full_name: name, location, phone}) });
  showAlert("Settings saved.");
}

loadProfile();

//Show success alert
/*function showAlert(msg) {
  var el = document.getElementById("profileAlert");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 3000);
}*/
