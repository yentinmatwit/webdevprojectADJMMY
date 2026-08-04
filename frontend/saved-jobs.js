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
    var job = savedJobs[i].job;
    html += '<div class="saved-card">'
      + '<h3>' + job.title + '</h3>'
      + '<span class="company">' + job.company + '</span>'
      + '<div class="meta">' + job.location + ' &bull; ' + job.job_type + ' &bull; Posted ' + job.posted_at + '</div>'
      + '<div class="actions">'
      +   '<button class="btn btn-primary btn-sm" onclick="applyFromSaved(' + job.id + ')">Apply</button> '
      +   '<button class="btn btn-danger btn-sm" onclick="removeSaved(' + job.id + ')">Remove</button>'
      + '</div>'
      + '</div>';
  }
  container.innerHTML = html;
}

async function loadSavedJobs() {

  try {
    savedJobs = await apiFetch("/api/saved-jobs/");
    renderSaved();
  } catch (err) {
    showAlert(err.message || "Couldn't load saved jobs.");
  }
}

//Remove from saved
async function removeSaved(id) {

  try {
    await apiFetch("/api/saved-jobs/" + id + "/", { method: "DELETE" });
    await loadSavedJobs();
    showAlert("Job removed from saved list.");
  } catch (err) {
    showAlert(err.message || "Couldn't remove job.")
  }
}

//Apply from saved
async function applyFromSaved(id) {

  try {
    await apiFetch("/api/jobs/" + id + "/apply/", { method: "POST" });
    showAlert("Application submitted!");
  } catch (err) {
    showAlert(err.message || "Couldn't apply.");
  }
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
