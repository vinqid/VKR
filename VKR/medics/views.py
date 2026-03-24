from django.db.models import Avg, Min, Max
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from patients.serializers import MedicalCardSerializer, PatientSerializer
from questionnaires.models import Questionnaire
from .models import Medic
from patients.models import Patient, MedicalCard
from .serializers import MedicSerializer


class MedicProfileView(generics.RetrieveUpdateAPIView):
    """Просмотр и редактирование профиля врача"""
    serializer_class = MedicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Возвращаем профиль текущего авторизованного врача
        return self.request.user.medic_profile


class AddPatientView(APIView):
    """Добавление пациента к врачу"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        medic = request.user.medic_profile
        username = request.data.get('username')

        try:
            patient = Patient.objects.get(user__username=username)
        except Patient.DoesNotExist:
            return Response(
                {"error": "Пациент с таким логином не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Добавляем пациента, если его ещё нет
        if patient not in medic.patients.all():
            medic.patients.add(patient)
            return Response({"message": "Пациент добавлен"})
        else:
            return Response(
                {"error": "Пациент уже в списке"},
                status=status.HTTP_400_BAD_REQUEST
            )


class MyPatientsView(generics.ListAPIView):
    """Список пациентов текущего врача"""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        medic = self.request.user.medic_profile
        return medic.patients.all()

    def get_serializer_class(self):
        # Импортируем здесь, чтобы избежать циклического импорта
        from patients.serializers import PatientSerializer
        return PatientSerializer


class RemovePatientView(APIView):
    """Удаление пациента из списка врача"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, patient_id):
        medic = request.user.medic_profile
        patient = get_object_or_404(Patient, id=patient_id)

        if patient in medic.patients.all():
            medic.patients.remove(patient)
            return Response({"message": "Пациент удалён из списка"})
        return Response(
            {"error": "Пациент не найден в вашем списке"},
            status=status.HTTP_404_NOT_FOUND
        )


class PatientMedicalCardView(APIView):
    """Просмотр медкарты пациента врачом"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        if request.user.role != 'medic':
            return Response({"error": "Только врач"}, status=403)

        medic = request.user.medic_profile
        patient = get_object_or_404(Patient, id=patient_id)

        # Проверяем, что пациент принадлежит врачу
        if patient not in medic.patients.all():
            return Response({"error": "Это не ваш пациент"}, status=403)

        serializer = MedicalCardSerializer(patient.medical_card)
        return Response(serializer.data)
from django.shortcuts import render

class MedicProfileStatusView(APIView):
    """Проверка, заполнен ли профиль врача"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        medic = request.user.medic_profile
        is_filled = bool(medic.name and medic.name.strip())
        return Response({'filled': is_filled})


class MedicProfileUpdateView(generics.UpdateAPIView):
    """Редактирование профиля медика"""
    serializer_class = MedicSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.medic_profile


class AllMedicsListView(generics.ListAPIView):
    """Список всех врачей"""
    queryset = Medic.objects.all()
    serializer_class = MedicSerializer
    permission_classes = [permissions.IsAuthenticated]


class DoctorStatsView(APIView):
    """Статистика для врача"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'medic':
            return Response({"error": "Только врач"}, status=403)

        medic = request.user.medic_profile
        patients = medic.patients.all()

        # Общая статистика
        total_patients = patients.count()

        # Все анкеты врача
        all_questionnaires = Questionnaire.objects.filter(medic=medic)
        total_questionnaires = all_questionnaires.count()

        # Средняя оценка по всем принятым анкетам
        answered = all_questionnaires.filter(status='answered')
        avg_score = answered.aggregate(Avg('result'))['result__avg'] or 0

        # Статистика по каждому пациенту
        patients_stats = []
        for patient in patients:
            patient_questionnaires = all_questionnaires.filter(
                medical_card=patient.medical_card
            )
            answered_patient = patient_questionnaires.filter(status='answered')

            stats = {
                'patient_id': patient.id,
                'patient_name': patient.name,
                'questionnaire_count': patient_questionnaires.count(),
                'avg_score': answered_patient.aggregate(Avg('result'))['result__avg'] or 0,
                'min_score': answered_patient.aggregate(Min('result'))['result__min'] or 0,
                'max_score': answered_patient.aggregate(Max('result'))['result__max'] or 0,
                'last_date': answered_patient.order_by('-date').first().date if answered_patient.exists() else None
            }
            patients_stats.append(stats)

        return Response({
            'total_patients': total_patients,
            'total_questionnaires': total_questionnaires,
            'average_score': round(avg_score, 1),
            'patients_stats': patients_stats
        })


class NewResponsesCountView(APIView):
    """Количество новых ответов для врача"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'medic':
            return Response({"error": "Только врач"}, status=403)

        medic = request.user.medic_profile
        count = Questionnaire.objects.filter(
            medic=medic,
            status='sent_to_medic'
        ).count()

        return Response({'count': count})


class PatientDetailView(APIView):
    """Получение данных пациента по ID (для врача)"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, patient_id):
        if request.user.role != 'medic':
            return Response({"error": "Только врач"}, status=403)

        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Пациент не найден"}, status=404)

        # Проверяем, что пациент принадлежит врачу
        medic = request.user.medic_profile
        if patient not in medic.patients.all():
            return Response({"error": "Это не ваш пациент"}, status=403)

        serializer = PatientSerializer(patient)
        return Response(serializer.data)


class UpdatePatientMedicalCardView(APIView):
    """Обновление медкарты пациента (для врача)"""
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, patient_id):
        if request.user.role != 'medic':
            return Response({"error": "Только врач"}, status=403)

        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Пациент не найден"}, status=404)

        # Проверяем, что пациент принадлежит врачу
        medic = request.user.medic_profile
        if patient not in medic.patients.all():
            return Response({"error": "Это не ваш пациент"}, status=403)

        try:
            medical_card = MedicalCard.objects.get(patient=patient)
        except MedicalCard.DoesNotExist:
            return Response({"error": "Медкарта не найдена"}, status=404)

        # Обновляем поля
        serializer = MedicalCardSerializer(medical_card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)