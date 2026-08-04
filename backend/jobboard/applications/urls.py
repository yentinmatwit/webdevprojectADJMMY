from django.urls import path
from . import views

urlpatterns = [
    path("applications/", views.ApplicationListView.as_view(), name="application-list"),
    path("applications/<int:pk>/", views.ApplicationDetailView.as_view(), name="application-detail"),
    path("applications/<int:pk>/withdraw/", views.WithdrawApplicationView.as_view(), name="application-withdraw"),
    path("dashboard/summary/", views.DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("activity/", views.ActivityListView.as_view(), name="activity-list"),
]