from django.urls import path
from .views import MedicProfileView, AddPatientView, MyPatientsView, RemovePatientView, PatientMedicalCardView, \
    MedicProfileUpdateView, AllMedicsListView, DoctorStatsView, NewResponsesCountView, PatientDetailView, \
    UpdatePatientMedicalCardView

urlpatterns = [
    path('profile/', MedicProfileView.as_view(), name='medic-profile'),
    path('profile/update/', MedicProfileUpdateView.as_view(), name='medic-profile-update'),

    path('add-patient/', AddPatientView.as_view(), name='add-patient'),
    path('my-patients/', MyPatientsView.as_view(), name='my-patients'),
    path('remove-patient/<int:patient_id>/', RemovePatientView.as_view(), name='remove-patient'),

    path('patient/<int:patient_id>/medical-card/', PatientMedicalCardView.as_view(), name='medic-patient-medical-card'),
    path('patient/<int:patient_id>/', PatientDetailView.as_view(), name='patient-detail'),
    path('patient/<int:patient_id>/medical-card/update/', UpdatePatientMedicalCardView.as_view(), name='update-patient-medical-card'),

    path('all/', AllMedicsListView.as_view(), name='all-medics'),
    path('stats/', DoctorStatsView.as_view(), name='doctor-stats'),
    path('new-responses-count/', NewResponsesCountView.as_view(), name='new-responses-count'),
]