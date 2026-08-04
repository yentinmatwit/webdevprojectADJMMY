async function loadDashboard(){
    try {
        const summary = await apiFetch("/api/dashboard/summary/");
        document.getElementById("statApplications").textContent = summary.application_sent;
        document.getElementById("statInterviews").textContent = summary.interviews_scheduled;
        document.getElementById("statSaved").textContent = summary.saved_jobs;
        document.getElementById("statOffers").textContent = summary.offers_reveived;

        const activities = await apiFetch("/api/activity/");
        const container = document.getElementById("activityList");
        container.innerHTML = activities.map(function(a) {
            return '<div class="activity-item">'
                + '<div class="activity-dot ' + a.color + '"><div>'
                + '<span>' + a.message + '</span>'
                + '<span class="activity-time">' + new Date(a.created_at).toLocaleDateString() + '</span>'
                + '</div>';
        }).join('');
    } catch (err) {
        console.error(err);
        var container = document.getElementById("activityList");
        if (container) container.innerHTML = '<p style="color:#999;">Couldn\'t load dashboard data.</p>';
    }  
}

loadDashboard();