let profileData = null;

async function loadProfile() {
  const res = await apiFetch("/api/profile/");
  if (!res.ok) {
    showAlert("Couldn't load profile.");
    return;
  }

  const profile = await res.json();
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
  var current = bioEl.textContent;
  var updated = prompt("Edit your bio:", current);
  if (updated === null || updated.trim() === "") return;

  const res = await apiFetch("/api/profile/", {
    method: "PATCH",
    body: JSON.stringify({ bio: updated.trim() }),
  });

  if (!res.ok) {
    showAlert("Couldn't update bio.");
    return;
  }

  bioEl.textContent = updated.trim();
  showAlert("Bio updated.");
}

//Save account settings
async function saveSettings() {
  var name = document.getElementById("profileName").value.trim();
  var location = document.getElementById("profileLocation").value.trim();
  var phone = document.getElementById("profilePhone").value.trim();

  if (!name) { alert("Name is required."); return; }
  
  try {
    await apiFetch("/api/profile/", {
      method: "PATCH",
      body: JSON.stringify({ full_name: name, location, phone }),
    });
    showAlert("Settings saved.");
  } catch (err) {
    showAlert(err.message || "Couldn't save settings.");
  }
  
}

loadProfile();

//Show success alert
/*function showAlert(msg) {
  var el = document.getElementById("profileAlert");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 3000);
}*/
