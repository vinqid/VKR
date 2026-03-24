from django.urls import path
from .views import (
    AppointmentCreateView, MedicAppointmentsView,
    MedicPatientAppointmentsView, PatientAppointmentsView,
    AppointmentDetailView
)

urlpatterns = [
    # Для врача
    path('appointments/create/', AppointmentCreateView.as_view(), name='appointment-create'),
    path('medic/appointments/', MedicAppointmentsView.as_view(), name='medic-appointments'),
    path('medic/patient/<int:patient_id>/appointments/', MedicPatientAppointmentsView.as_view(),
         name='medic-patient-appointments'),

    # Для пациента
    path('patient/appointments/', PatientAppointmentsView.as_view(), name='patient-appointments'),
    path('appointments/<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
]