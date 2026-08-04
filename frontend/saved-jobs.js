//Saved Jobs Data
var savedJobs = [];

//Render saved job cards
function renderSaved() {
  var container = document.getElementById("savedGrid");

  if (savedJobs.length === 0) {
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>No saved jobs yet.</p><a href="index.html" class="btn btn-primary">Browse Jobs</a></div>';
    return;
  }

  var html = "";
  for (var i = 0; i < savedJobs.length; i++) {
    var job = savedJobs[i];
    html += '<div class="saved-card">'
      + '<h3>' + job.title + '</h3>'
      + '<span class="company">' + job.company + '</span>'
      + '<div class="meta">' + job.location + ' &bull; ' + job.type + ' &bull; Posted ' + job.posted + '</div>'
      + '<div class="actions">'
      +   '<button class="btn btn-primary btn-sm" onclick="applyFromSaved(' + job.id + ')">Apply</button> '
      +   '<button class="btn btn-danger btn-sm" onclick="removeSaved(' + job.id + ')">Remove</button>'
      + '</div>'
      + '</div>';
  }
  container.innerHTML = html;
}

async function loadSavedJobs() {
  const res = await apiFetch("/api/saved-jobs/");
  if (!res.ok) {
    showAlert("Couldn't load saved jobs.");
    return;
  }
  savedJobs = await res.json();
  renderSaved();
}

//Remove from saved
async function removeSaved(id) {
  const res = await apiFetch("/api/saved-jobs/" + jobId + "/", { method: "DELETE" });
  if (!res.ok){
    showAlert("Couldn't remove job.");
    return;
  }
  await loadSavedJobs();
  showAlert("Job removed from saved list.");
}

//Apply from saved
async function applyFromSaved(id) {
  const res = await apiFetch("/api/jobs/" + jobId + "/apply/", { method: "POST" });
  const data = await res.json();
  if (!res.ok) {
    showAlert(data.detail || "Couldn't apply.");
    return;
  }
  showalert("Application submitted!");
}

//Show success alert (Might have to remove)
function showAlert(msg) {
  var el = document.getElementById("savedAlert");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 3000);
}

//Initial render
loadSavedJobs();
