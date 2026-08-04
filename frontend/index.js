//Job Dataset
var jobs = [
  { id:1, title:"Frontend Developer", company:"TechNova Inc.", location:"Boston, MA", type:"Full-Time", industry:"Technology", experience:"Entry Level", posted:"2 days ago",
    tags:["HTML","CSS","JavaScript"] },
  { id:2, title:"Data Analyst", company:"FinEdge Corp.", location:"New York, NY", type:"Full-Time", industry:"Finance", experience:"Mid Level", posted:"3 days ago",
    tags:["SQL","Python","Excel"] },
  { id:3, title:"UX Design Intern", company:"Creativa Labs", location:"Remote", type:"Internship", industry:"Technology", experience:"Entry Level", posted:"1 day ago",
    tags:["Figma","User Research"] },
  { id:4, title:"Marketing Coordinator", company:"BrightPath Media", location:"Chicago, IL", type:"Full-Time", industry:"Marketing", experience:"Entry Level", posted:"5 days ago",
    tags:["SEO","Content","Analytics"] },
  { id:5, title:"Registered Nurse", company:"CityHealth Hospital", location:"Boston, MA", type:"Full-Time", industry:"Healthcare", experience:"Mid Level", posted:"1 week ago",
    tags:["Patient Care","EMR"] },
  { id:6, title:"Backend Engineer", company:"CloudSync Systems", location:"San Francisco, CA", type:"Full-Time", industry:"Technology", experience:"Senior", posted:"4 days ago",
    tags:["Node.js","AWS","PostgreSQL"] },
  { id:7, title:"Teaching Assistant", company:"Wentworth Institute", location:"Boston, MA", type:"Part-Time", industry:"Education", experience:"Entry Level", posted:"6 days ago",
    tags:["Tutoring","Grading"] },
  { id:8, title:"QA Test Engineer", company:"DevOps United", location:"Remote", type:"Contract", industry:"Technology", experience:"Mid Level", posted:"2 days ago",
    tags:["Selenium","Jest","CI/CD"] }
];

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
      +   '<span>' + job.type + '</span>'
      +   '<span>' + job.experience + '</span>'
      +   '<span>' + job.posted + '</span>'
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

//Filter jobs based on all inputs
function filterJobs() {
  var keyword = document.getElementById("searchInput").value.toLowerCase();
  var loc = document.getElementById("locationFilter").value;
  var industry = document.getElementById("industryFilter").value;
  var type = document.getElementById("typeFilter").value;
  var exp = document.getElementById("experienceFilter").value;

  var filtered = jobs.filter(function(job) {
    var matchKeyword = !keyword || job.title.toLowerCase().indexOf(keyword) !== -1
      || job.company.toLowerCase().indexOf(keyword) !== -1
      || job.tags.join(" ").toLowerCase().indexOf(keyword) !== -1;
    var matchLoc = !loc || job.location === loc;
    var matchInd = !industry || job.industry === industry;
    var matchType = !type || job.type === type;
    var matchExp = !exp || job.experience === exp;
    return matchKeyword && matchLoc && matchInd && matchType && matchExp;
  });

  renderJobs(filtered);
}

//Reset all filters
function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("locationFilter").value = "";
  document.getElementById("industryFilter").value = "";
  document.getElementById("typeFilter").value = "";
  document.getElementById("experienceFilter").value = "";
  renderJobs(jobs);
}

//Placeholder actions
function applyToJob(id) {
  alert("Application submitted for job #" + id + "! (Track it on the Applications page)");
}
function saveJob(id) {
  alert("Job #" + id + " saved! (View it on the Saved page)");
}

//Search on Enter key
document.getElementById("searchInput").addEventListener("keyup", function(e) {
  if (e.key === "Enter") filterJobs();
});

//Initial render
renderJobs(jobs);
