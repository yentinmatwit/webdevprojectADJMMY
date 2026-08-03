//Application Data 
var applications = [
  { id:1, title:"Frontend Developer", company:"TechNova Inc.", date:"2026-07-28", status:"Interview" },
  { id:2, title:"Data Analyst", company:"FinEdge Corp.", date:"2026-07-27", status:"Applied" },
  { id:3, title:"UX Design Intern", company:"Creativa Labs", date:"2026-07-25", status:"Applied" },
  { id:4, title:"Marketing Coordinator", company:"BrightPath Media", date:"2026-07-20", status:"Rejected" },
  { id:5, title:"Backend Engineer", company:"CloudSync Systems", date:"2026-07-18", status:"Offered" },
  { id:6, title:"Teaching Assistant", company:"Wentworth Institute", date:"2026-07-15", status:"Interview" },
  { id:7, title:"QA Test Engineer", company:"DevOps United", date:"2026-07-10", status:"Applied" },
  { id:8, title:"Project Manager", company:"BuildRight Co.", date:"2026-07-05", status:"Rejected" }
];

//Map status to CSS class
function statusClass(status) {
  var map = { Applied:"status-applied", Interview:"status-interview", Offered:"status-offered", Rejected:"status-rejected" };
  return map[status] || "status-applied";
}

//Render the applications table
function renderApps(list) {
  var tbody = document.getElementById("appTableBody");

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:30px; color:#999;">No applications match this filter.</td></tr>';
    return;
  }

  var html = "";
  for (var i = 0; i < list.length; i++) {
    var app = list[i];
    html += '<tr>'
      + '<td><strong>' + app.title + '</strong></td>'
      + '<td>' + app.company + '</td>'
      + '<td>' + app.date + '</td>'
      + '<td><span class="status ' + statusClass(app.status) + '">' + app.status + '</span></td>'
      + '<td>'
      +   '<button class="btn btn-outline btn-sm" onclick="viewApp(' + app.id + ')">Details</button> '
      +   '<button class="btn btn-danger btn-sm" onclick="withdrawApp(' + app.id + ')">Withdraw</button>'
      + '</td>'
      + '</tr>';
  }
  tbody.innerHTML = html;
}

//Filter by status
function filterApps() {
  var status = document.getElementById("statusFilter").value;
  if (!status) {
    renderApps(applications);
  } else {
    var filtered = applications.filter(function(app) { return app.status === status; });
    renderApps(filtered);
  }
}

//View application details
function viewApp(id) {
  var app = applications.find(function(a) { return a.id === id; });
  if (app) alert("Details for: " + app.title + " at " + app.company + "\nStatus: " + app.status);
}

//Withdraw application
function withdrawApp(id) {
  if (confirm("Withdraw this application?")) {
    applications = applications.filter(function(a) { return a.id !== id; });
    filterApps();
    showAlert("Application withdrawn.");
  }
}

//Show success alert
function showAlert(msg) {
  var el = document.getElementById("appAlert");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(function() { el.style.display = "none"; }, 3000);
}

//Initial render
renderApps(applications);
