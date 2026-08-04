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

async function loadSaved() {
  var data = await apiFetch("/saved-jobs/");
  savedJobs = data.map(function(sj) { return sj.job; });
  renderSaved();
}

//Remove from saved
async function removeSaved(id) {
  await apiFetch(`/saved-jobs/${id}/`, {method: "DELETE" });
  savedJobs = savedJobs.filter(function(j) { return j.id !== id; });
  renderSaved();
  showAlert("Job removed from saved list.");
}

//Apply from saved
async function applyFromSaved(id) {
  await apiFetch(`/jobs/${id}/apply/`, { method: "POST" });
  alert("Application submitted");
}

//Show success alert (Might have to remove)
function showAlert(msg) {
  var el = document.getElementById("savedAlert");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 3000);
}

//Initial render
loadSaved();
