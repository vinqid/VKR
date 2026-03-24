from django.urls import path
from .views import PatientProfileView, MyMedicsView, MedicalCardView, PatientMedicalCardUpdateView, \
    PatientProfileUpdateView,AttachDoctorView, NewQuestionnairesCountView

urlpatterns = [
    path('profile/', PatientProfileView.as_view(), name='patient-profile'),
    path('my-medics/', MyMedicsView.as_view(), name='my-medics'),
    path('medical-card/', MedicalCardView.as_view(), name='medical-card'),
    path('medical-card/update/', PatientMedicalCardUpdateView.as_view(), name='medical-card-update'),
    path('profile/update/', PatientProfileUpdateView.as_view(), name='patient-profile-update'),
    path('attach-doctor/', AttachDoctorView.as_view(), name='attach-doctor'),
    path('new-questionnaires-count/', NewQuestionnairesCountView.as_view(), name='new-questionnaires-count'),
]