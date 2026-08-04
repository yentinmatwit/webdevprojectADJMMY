from django.urls import path
from . import views

urlpatterns = [
    path("jobs/", views.JobListView.as_view(), name='job-list'),
    path("jobs/<int:pk>/", views.JobDetailView.as_view(), name='job-detail'),
    path("jobs/<int:pk>/apply/", views.ApplyToJobView.as_view(), name='job-apply'),
    path("jobs/<int:pk>/save/", views.SaveJobView.as_view(), name='job-save'),

    path("saved-jobs/", views.SavedJobListView.as_view(), name='saved-job-list'),
    path("saved-jobs/<int:pk>/", views.SavedJobDeleteView.as_view(), name='saved-job-Delete'),
]