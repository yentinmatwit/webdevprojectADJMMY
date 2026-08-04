async function loadDashboard(){
    const summary = await apiFetch("/dashboard/summary/");
    document.getElementById("statApplications").textContent = summary.application_sent;
    document.getElementById("statInterviews").textContent = summary.interviews_scheduled;
    document.getElementById("statSaved").textContent = summary.saved_jobs;
    document.getElementById("statOffers").textContent = summary.offers_reveived;

    const activities = await apiFetch("/activity/");
    const container = document.getElementById("activityList");
    container.innerHTML = activities.map(function(a) {
        return '<div class="activity-item">'
            + '<div class="activity-dot ' + a.color + '"><div>'
            + '<span>' + a.message + '</span>'
            + '<span class="activity-time">' + new Date(a.created_at).toLocaleDateString() + '</span>'
            + '</div>';
    }).join('');
}

loadDashboard();