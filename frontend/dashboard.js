async function loadDashboard(){
    try {
        const profile = await apiFetch("/api/profile/");
        var firstName = (profile.full_name || "").split(" ")[0] || "there";
        document.getElementById("welcomeHeading").textContent = "Welcome back, " + firstName;

        const summary = await apiFetch("/api/dashboard/summary/");
        document.getElementById("statApplications").textContent = summary.applications_sent;
        document.getElementById("statInterviews").textContent = summary.interviews_scheduled;
        document.getElementById("statSaved").textContent = summary.saved_jobs;
        document.getElementById("statOffers").textContent = summary.offers_received;

        await loadProgress();

        const activities = await apiFetch("/api/activity/");
        const container = document.getElementById("activityList");
        container.innerHTML = activities.length
          ? activities.map(function(a) {
              return '<div class="activity-item">'
                  + '<div class="activity-dot ' + a.color + '"></div>'
                  + '<span>' + a.message + '</span>'
                  + '<span class="activity-time">' + new Date(a.created_at).toLocaleDateString() + '</span>'
                  + '</div>';
            }).join('')
          : '<p style="color:#999; font-size:.9rem;">No recent activity.</p>';
    } catch (err) {
        console.error(err);
        var heading = document.getElementById("welcomeHeading");
        if (heading) heading.textContent = "Welcome back";
        var container = document.getElementById("activityList");
        if (container) container.innerHTML = '<p style="color:#999;">Couldn\'t load dashboard data.</p>';
    }
}

async function loadProgress() {
    var labelEl = document.getElementById("progressJobLabel");
    var trackEl = document.getElementById("progressTrack");

    try {
        const applications = await apiFetch("/api/applications/");

        // API already orders by -date_applied, so [0] is the most recent
        var active = applications.filter(function(a) { return a.status !== "Rejected"; });

        if (active.length === 0) {
            labelEl.textContent = "No active applications yet.";
            trackEl.innerHTML = "";
            return;
        }

        var current = active[0];
        labelEl.textContent = current.job.title + " at " + current.job.company;

        var stages = ["Applied", "Interview", "Offered", "Accepted"];
        var currentIndex = stages.indexOf(current.status);
        if (currentIndex === -1) currentIndex = 0; // fallback if status is unrecognized

        var html = "";
        stages.forEach(function(stage, i) {
            var stateClass = i < currentIndex ? "completed" : (i === currentIndex ? "active" : "");
            html += '<div class="progress-step ' + stateClass + '"><div class="dot"></div><span>' + stage + '</span></div>';
            if (i < stages.length - 1) {
                html += '<div class="progress-line' + (i < currentIndex ? ' filled' : '') + '"></div>';
            }
        });
        trackEl.innerHTML = html;
    } catch (err) {
        console.error(err);
        labelEl.textContent = "Couldn't load application progress.";
        trackEl.innerHTML = "";
    }
}

loadDashboard();