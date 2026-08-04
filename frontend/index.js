//Job Dataset
var jobs = [];

//Render job cards into the list
function renderJobs(list) {
  var container = document.getElementById("jobList");
  var countEl = document.getElementById("resultCount");
  countEl.textContent = "Showing " + list.length + " result" + (list.length !== 1 ? "s" : "");

  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No jobs match your filters.</p><button class="btn btn-outline" onclick="clearFilters()">Clear Filters</button></div>';
    return;
  }

  var html = "";
  for (var i = 0; i < list.length; i++) {
    var job = list[i];
    var tagsHtml = "";
    for (var t = 0; t < job.tags.length; t++) {
      tagsHtml += '<span class="tag tag-blue">' + job.tags[t] + '</span> ';
    }

    html += '<div class="job-card" data-id="' + job.id + '">'
      + '<h3>' + job.title + '</h3>'
      + '<span class="company">' + job.company + '</span>'
      + '<div class="meta">'
      +   '<span>' + job.location + '</span>'
      +   '<span>' + job.job_type + '</span>'
      +   '<span>' + job.experience_level + '</span>'
      +   '<span>' + job.posted_at + '</span>'
      + '</div>'
      + '<div style="margin-bottom:10px;">' + tagsHtml + '</div>'
      + '<div class="actions">'
      +   '<button class="btn btn-primary btn-sm" onclick="applyToJob(' + job.id + ')">Apply</button>'
      +   '<button class="btn btn-outline btn-sm" onclick="saveJob(' + job.id + ')">Save</button>'
      + '</div>'
      + '</div>';
  }
  container.innerHTML = html;
}

async function loadJobs() {
  try {
    jobs = await apiFetch("/api/jobs/");
    renderJobs(jobs);
  } catch (err) {
    console.error(err);
    document.getElementById("jobList").innerHTML =
      '<p style="color:#999;">Couldn\'t load jobs.</p>';
  }
}

//Filter jobs based on all inputs
async function filterJobs() {
  var keyword = document.getElementById("searchInput").value;
  var loc = document.getElementById("locationFilter").value;
  var industry = document.getElementById("industryFilter").value;
  var type = document.getElementById("typeFilter").value;
  var exp = document.getElementById("experienceFilter").value;

  var params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (loc) params.set("location", loc);
  if (industry) params.set("industry", industry);
  if (type) params.set("job_type", type);
  if (exp) params.set("experience_level", exp);

  try {
    var filtered = await apiFetch("/api/jobs/?" + params.toString());
    renderJobs(filtered);
  } catch (err) {
    console.error(err);
    document.getElementById("jobList").innerHTML =
      '<p style="color:#999;">Couldn\'t load jobs.</p>';
  }
}

//Reset all filters
function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("locationFilter").value = "";
  document.getElementById("industryFilter").value = "";
  document.getElementById("typeFilter").value = "";
  document.getElementById("experienceFilter").value = "";
  loadJobs();
}

//Placeholder actions
async function applyToJob(id) {
  if (!isLoggedIn()) {
    alert("Please log in to apply.");
    window.location.href = "login.html";
    return;
  }

  try {
    await apiFetch("/api/jobs/" + id + "/apply/", { method: "POST" });
    alert("Application submitted! (Track it on the Applications page)");
  } catch (err) {
    alert(err.message || "Couldn't apply.");
  }
}

async function saveJob(id) {
  if (!isLoggedIn()) {
    alert("Please log in to save jobs.");
    window.location.href = "login.html";
    return;
  }

  try {
    await apiFetch("/api/jobs/" + id + "/save/", { method: "POST" });
    alert("Job saved! (View it on the Saved page)");
  } catch (err) {
    alert(err.message || "Couldn't save job.");
  }
}

//Search on Enter key
document.getElementById("searchInput").addEventListener("keyup", function(e) {
  if (e.key === "Enter") filterJobs();
});

//Initial render
loadJobs();