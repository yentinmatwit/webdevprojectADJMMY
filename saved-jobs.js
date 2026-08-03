//Saved Jobs Data
var savedJobs = [
  { id:1, title:"Frontend Developer", company:"TechNova Inc.", location:"Boston, MA", type:"Full-Time", posted:"2 days ago" },
  { id:3, title:"UX Design Intern", company:"Creativa Labs", location:"Remote", type:"Internship", posted:"1 day ago" },
  { id:6, title:"Backend Engineer", company:"CloudSync Systems", location:"San Francisco, CA", type:"Full-Time", posted:"4 days ago" },
  { id:7, title:"Teaching Assistant", company:"Wentworth Institute", location:"Boston, MA", type:"Part-Time", posted:"6 days ago" },
  { id:8, title:"QA Test Engineer", company:"DevOps United", location:"Remote", type:"Contract", posted:"2 days ago" }
];

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

//Remove from saved
function removeSaved(id) {
  savedJobs = savedJobs.filter(function(j) { return j.id !== id; });
  renderSaved();
  showAlert("Job removed from saved list.");
}

//Apply from saved
function applyFromSaved(id) {
  alert("Application submitted for job #" + id + "!");
}

//Show success alert
function showAlert(msg) {
  var el = document.getElementById("savedAlert");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 3000);
}

//Initial render
renderSaved();
