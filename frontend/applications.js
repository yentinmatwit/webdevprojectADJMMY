//Application Data 
var applications = [];

async function loadApplications() {
  try {
    applications = await apiFetch("/api/applications/");
    renderApps(applications);
  } catch (err) {
    showAlert(err.message || "Couldn't load applications")
  }
}

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
      + '<td><strong>' + app.job.title + '</strong></td>'
      + '<td>' + app.job.company + '</td>'
      + '<td>' + app.date_applied + '</td>'
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
async function filterApps() {
  var statusVal = document.getElementById("statusFilter").value;
  var params = statusVal ? "?status=" + encodeURIComponent(statusVale) : "";

  try{
    var filtered = await apiFetch("/api/applications/" + params);
    renderApps(filtered);
  } catch (err) {
    showAlert(err.message || "Couldn't filter applications");
  }
}

//View application details
function viewApp(id) {
  var app = applications.find(function(a) { return a.id === id; });
  if (app) alert("Details for: " + app.job.title + " at " + app.job.company + "\nStatus: " + app.status);
}

//Withdraw application
async function withdrawApp(id) {
  if (!confirm("Withdraw this application?")) return;

  try {
    await apiFetch(`/api/applications/${id}/withdraw/`, { method: "DELETE"});
    applications = applications.filter(function(a) { return a.id !== id; });
    renderApps(applications);
    showAlert("Application withdrawn.");
  } catch (err) {
    showAlert(err.message || "Couldn't withdraw applicaiton.")
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
loadApplications();
