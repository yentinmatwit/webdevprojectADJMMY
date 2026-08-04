from django.urls import path
from . import views

urlpatterns = [
    path("auth/register/", views.RegisterView.as_view(), name="register"),
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/logout/", views.LogoutView.as_view(), name="logout"),
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path("profile/skills/", views.SkillListCreateView.as_view()),
    path("profile/skills/<int:pk>/", views.SkillDetailView.as_view()),
    path("profile/education/", views.EducationListCreateView.as_view()),
    path("profile/educaiton/<int:pk>/", views.EducationDetailView.as_view()),
    path("profile/experience/", views.ExperienceListCreateView.as_view()),
    path("profile/experience/<int:pk>/", views.ExperienceDetailView.as_view()),
]