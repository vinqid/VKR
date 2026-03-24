from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from medics.models import Medic
from medics.serializers import MedicSerializer
from questionnaires.models import Questionnaire
from .models import Patient, MedicalCard
from .serializers import PatientSerializer, MedicalCardSerializer


class PatientProfileView(generics.RetrieveUpdateAPIView):
    """Просмотр и редактирование профиля пациента"""
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.patient_profile


class MyMedicsView(generics.ListAPIView):
    """Список врачей пациента"""
    serializer_class = 'medics.serializers.MedicSerializer'  # строка, чтобы избежать циклического импорта
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient = self.request.user.patient_profile
        return patient.medics.all()

    def get_serializer_class(self):
        # Импортируем здесь, чтобы избежать циклического импорта
        from medics.serializers import MedicSerializer
        return MedicSerializer


class MedicalCardView(generics.RetrieveUpdateAPIView):
    """Просмотр и редактирование медкарты"""
    serializer_class = MedicalCardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        patient = self.request.user.patient_profile
        return patient.medical_card

class PatientMedicalCardUpdateView(generics.UpdateAPIView):
    """Редактирование медкарты пациентом"""
    serializer_class = MedicalCardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        patient = self.request.user.patient_profile
        return patient.medical_card

class PatientProfileStatusView(APIView):
    """Проверка, заполнен ли профиль пациента"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        patient = request.user.patient_profile
        # Считаем профиль заполненным, если есть имя
        is_filled = bool(patient.name and patient.name.strip())
        return Response({'filled': is_filled})
from django.shortcuts import render

class PatientProfileUpdateView(generics.UpdateAPIView):
    """Редактирование профиля пациента"""
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.patient_profile
# Create your views here.


class AttachDoctorView(APIView):
    """Прикрепление пациента к врачу"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        patient = request.user.patient_profile
        doctor_id = request.data.get('doctor_id')

        try:
            doctor = Medic.objects.get(id=doctor_id)
        except Medic.DoesNotExist:
            return Response({"error": "Врач не найден"}, status=404)

        # Добавляем врача пациенту
        patient.medics.add(doctor)

        # Добавляем пациента врачу
        doctor.patients.add(patient)

        return Response({"message": "Врач успешно добавлен"})


class NewQuestionnairesCountView(APIView):
    """Количество новых анкет для пациента"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({"error": "Только пациент"}, status=403)

        patient = request.user.patient_profile
        count = Questionnaire.objects.filter(
            medical_card=patient.medical_card,
            status='sent_to_patient'
        ).count()

        return Response({'count': count})