let profileData = null;

async function loadProfile() {
  try {
    profileData = await apiFetch("/api/profile/");
    renderProfile(profileData);
  } catch (err) {
    showAlert(err.message || "Couldn't load profile.");
  }
}

function renderProfile(profile) {
  document.getElementById("profileDisplayName").textContent = profile.full_name;
  document.getElementById("profileAvatar").textContent = initials(profile.full_name);
  document.getElementById("profileSchool").textContent = profile.school || "";
  document.getElementById("profileLocationEmail").textContent =
    [profile.location, profile.email].filter(Boolean).join(" • ");

  // About
  document.getElementById("bioText").textContent = profile.bio || "No bio yet.";

  // Skills
  var skillsEl = document.getElementById("skillsList");
  skillsEl.innerHTML = profile.skills.length
    ? profile.skills.map(function(s) {
        return '<span class="tag tag-blue">' + s.name
          + ' <span style="cursor:pointer; margin-left:4px;" onclick="removeSkill(' + s.id + ')">&times;</span></span>';
      }).join(" ")
    : '<span style="color:#999; font-size:.85rem;">No skills added yet.</span>';

  // Education
  var eduEl = document.getElementById("educationList");
  eduEl.innerHTML = profile.education.length
    ? profile.education.map(function(e) {
        return '<div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:start;">'
          + '<div>'
          +   '<strong>' + e.degree + '</strong>'
          +   '<p style="color:#666; font-size:.9rem;">' + e.institution
          +     (e.expected_grad ? ' &bull; ' + e.expected_grad : '') + '</p>'
          + '</div>'
          + '<button class="btn btn-danger btn-sm" onclick="removeEducation(' + e.id + ')">Remove</button>'
          + '</div>';
      }).join("")
    : '<p style="color:#999; font-size:.9rem;">No education added yet.</p>';

  // Experience
  var expEl = document.getElementById("experienceList");
  expEl.innerHTML = profile.experience.length
    ? profile.experience.map(function(x) {
        return '<div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:start;">'
          + '<div>'
          +   '<strong>' + x.title + '</strong>'
          +   '<p style="color:#666; font-size:.9rem;">' + x.company + ' &bull; ' + x.date_range + '</p>'
          +   (x.description ? '<p style="font-size:.88rem; margin-top:4px;">' + x.description + '</p>' : '')
          + '</div>'
          + '<button class="btn btn-danger btn-sm" onclick="removeExperience(' + x.id + ')">Remove</button>'
          + '</div>';
      }).join("")
    : '<p style="color:#999; font-size:.9rem;">No experience added yet.</p>';

  // Account settings form
  document.getElementById("profileName").value = profile.full_name || "";
  document.getElementById("profileEmail").value = profile.email || "";
  document.getElementById("profileLocation").value = profile.location || "";
  document.getElementById("profilePhone").value = profile.phone || "";
}

function initials(name) {
  if (!name) return "?";
  return name.split(" ").map(function(p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
}

//Edit bio via prompt
async function editBio() {
  var bioEl = document.getElementById("bioText");
  var current = profileData ? profileData.bio : "";
  var updated = prompt("Edit your bio:", current);
  if (updated === null || updated.trim() === "") return;

  try {
    profileData = await apiFetch("/api/profile/", {
      method: "PATCH",
      body: JSON.stringify({ bio: updated.trim() }),
    });
    bioEl.textContent = profileData.bio;
    showAlert("Bio updated.");
  } catch (err) {
    showAlert(err.message || "Couldn't update bio.");
  }
}

//Save account settings
async function saveSettings() {
  var name = document.getElementById("profileName").value.trim();
  var location = document.getElementById("profileLocation").value.trim();
  var phone = document.getElementById("profilePhone").value.trim();

  if (!name) { alert("Name is required."); return; }

  try {
    profileData = await apiFetch("/api/profile/", {
      method: "PATCH",
      body: JSON.stringify({ full_name: name, location, phone }),
    });
    renderProfile(profileData);
    showAlert("Settings saved.");
  } catch (err) {
    showAlert(err.message || "Couldn't save settings.");
  }
}

//--- Skills ---
async function addSkill() {
  var input = document.getElementById("newSkillInput");
  var name = input.value.trim();
  if (!name) return;

  try {
    await apiFetch("/api/profile/skills/", {
      method: "POST",
      body: JSON.stringify({ name: name }),
    });
    input.value = "";
    await loadProfile();
    showAlert("Skill added.");
  } catch (err) {
    showAlert(err.message || "Couldn't add skill.");
  }
}

async function removeSkill(id) {
  try {
    await apiFetch("/api/profile/skills/" + id + "/", { method: "DELETE" });
    await loadProfile();
    showAlert("Skill removed.");
  } catch (err) {
    showAlert(err.message || "Couldn't remove skill.");
  }
}

//--- Education ---
async function addEducation() {
  var degree = document.getElementById("newEduDegree").value.trim();
  var institution = document.getElementById("newEduInstitution").value.trim();
  var expected_grad = document.getElementById("newEduGradDate").value.trim();

  if (!degree || !institution) {
    alert("Degree and institution are required.");
    return;
  }

  try {
    await apiFetch("/api/profile/education/", {
      method: "POST",
      body: JSON.stringify({ degree, institution, expected_grad }),
    });
    document.getElementById("newEduDegree").value = "";
    document.getElementById("newEduInstitution").value = "";
    document.getElementById("newEduGradDate").value = "";
    await loadProfile();
    showAlert("Education added.");
  } catch (err) {
    showAlert(err.message || "Couldn't add education.");
  }
}

async function removeEducation(id) {
  try {
    await apiFetch("/api/profile/education/" + id + "/", { method: "DELETE" });
    await loadProfile();
    showAlert("Education removed.");
  } catch (err) {
    showAlert(err.message || "Couldn't remove education.");
  }
}

//--- Experience ---
async function addExperience() {
  var title = document.getElementById("newExpTitle").value.trim();
  var company = document.getElementById("newExpCompany").value.trim();
  var date_range = document.getElementById("newExpDateRange").value.trim();
  var description = document.getElementById("newExpDescription").value.trim();

  if (!title || !company) {
    alert("Job title and company are required.");
    return;
  }

  try {
    await apiFetch("/api/profile/experience/", {
      method: "POST",
      body: JSON.stringify({ title, company, date_range, description }),
    });
    document.getElementById("newExpTitle").value = "";
    document.getElementById("newExpCompany").value = "";
    document.getElementById("newExpDateRange").value = "";
    document.getElementById("newExpDescription").value = "";
    await loadProfile();
    showAlert("Experience added.");
  } catch (err) {
    showAlert(err.message || "Couldn't add experience.");
  }
}

async function removeExperience(id) {
  try {
    await apiFetch("/api/profile/experience/" + id + "/", { method: "DELETE" });
    await loadProfile();
    showAlert("Experience removed.");
  } catch (err) {
    showAlert(err.message || "Couldn't remove experience.");
  }
}

//Show success alert
function showAlert(msg) {
  var el = document.getElementById("profileAlert");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 3000);
}

loadProfile();