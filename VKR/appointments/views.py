from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import MedicalAppointment
from .serializers import MedicalAppointmentSerializer
from patients.models import Patient


class AppointmentCreateView(generics.CreateAPIView):
    """Создание приёма врачом"""
    serializer_class = MedicalAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'medic':
            raise permissions.PermissionDenied("Только врач может создавать приёмы")
        serializer.save(medic=self.request.user.medic_profile)


class MedicAppointmentsView(generics.ListAPIView):
    """Все приёмы, созданные текущим врачом"""
    serializer_class = MedicalAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'medic':
            return MedicalAppointment.objects.none()
        medic = self.request.user.medic_profile
        return MedicalAppointment.objects.filter(medic=medic).order_by('-date')


class MedicPatientAppointmentsView(APIView):
    """Приёмы конкретного пациента для врача"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        if request.user.role != 'medic':
            return Response({"error": "Только врач"}, status=403)

        medic = request.user.medic_profile
        patient = get_object_or_404(Patient, id=patient_id)

        if patient not in medic.patients.all():
            return Response({"error": "Это не ваш пациент"}, status=403)

        appointments = MedicalAppointment.objects.filter(
            medical_card=patient.medical_card,
            medic=medic
        ).order_by('-date')

        serializer = MedicalAppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class PatientAppointmentsView(generics.ListAPIView):
    """Все приёмы текущего пациента"""
    serializer_class = MedicalAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'patient':
            return MedicalAppointment.objects.none()
        patient = self.request.user.patient_profile
        return MedicalAppointment.objects.filter(
            medical_card=patient.medical_card
        ).order_by('-date')


class AppointmentDetailView(generics.RetrieveAPIView):
    """Детальная информация о приёме"""
    queryset = MedicalAppointment.objects.all()
    serializer_class = MedicalAppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]


from django.shortcuts import render

# Create your views here.
