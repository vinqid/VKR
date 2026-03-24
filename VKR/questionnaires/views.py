from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import MonitoredParameter, Questionnaire, PatientResponse
from .serializers import MonitoredParameterSerializer, QuestionnaireSerializer, PatientResponseSerializer
from patients.models import MedicalCard


# Параметры
class ParameterListCreateView(generics.ListCreateAPIView):
    """Список всех параметров и создание нового"""
    queryset = MonitoredParameter.objects.all()
    serializer_class = MonitoredParameterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Только врач может создавать параметры
        if self.request.user.role != 'medic':
            raise serializers.ValidationError("Только врач может создавать параметры")
        serializer.save()


class ParameterDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Просмотр, изменение и удаление параметра"""
    queryset = MonitoredParameter.objects.all()
    serializer_class = MonitoredParameterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        if request.user.role != 'medic':
            return Response(
                {"error": "Только врач может удалять параметры"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().delete(request, *args, **kwargs)


# Анкеты
class QuestionnaireCreateView(generics.CreateAPIView):
    """Создание анкеты врачом"""
    serializer_class = QuestionnaireSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'medic':
            raise serializers.ValidationError("Только врач может создавать анкеты")
        serializer.save(medic=self.request.user.medic_profile)


class MedicQuestionnairesView(generics.ListAPIView):
    """Все анкеты врача"""
    serializer_class = QuestionnaireSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'medic':
            return Questionnaire.objects.none()
        medic = self.request.user.medic_profile
        return Questionnaire.objects.filter(medic=medic).order_by('-date')


class PatientQuestionnairesView(generics.ListAPIView):
    """Все анкеты пациента"""
    serializer_class = QuestionnaireSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'patient':
            return Questionnaire.objects.none()
        patient = self.request.user.patient_profile
        medical_card = patient.medical_card
        return Questionnaire.objects.filter(medical_card=medical_card).order_by('-date')


class QuestionnaireDetailView(generics.RetrieveAPIView):
    """Детальная информация об анкете"""
    queryset = Questionnaire.objects.all()
    serializer_class = QuestionnaireSerializer
    permission_classes = [permissions.IsAuthenticated]


class FillQuestionnaireView(APIView):
    """Заполнение анкеты пациентом"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        questionnaire = get_object_or_404(Questionnaire, pk=pk)

        # Проверяем, что это пациент и анкета его
        if request.user.role != 'patient':
            return Response(
                {"error": "Только пациент может заполнять анкеты"},
                status=status.HTTP_403_FORBIDDEN
            )

        patient = request.user.patient_profile
        if questionnaire.medical_card.patient.id != patient.id:
            return Response(
                {"error": "Это не ваша анкета"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Проверяем статус
        if questionnaire.status != 'sent_to_patient':
            return Response(
                {"error": f"Анкета уже в статусе {questionnaire.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Сохраняем комментарий пациента
        questionnaire.optional = request.data.get('optional', '')

        # Сохраняем ответы
        responses_data = request.data.get('responses', [])
        for resp_data in responses_data:
            PatientResponse.objects.create(
                response=resp_data.get('response'),
                questionnaire=questionnaire,
                parameter_id=resp_data.get('parameter_id')
            )

        questionnaire.status = 'sent_to_medic'
        questionnaire.save()

        serializer = QuestionnaireSerializer(questionnaire)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EvaluateQuestionnaireView(APIView):
    """Оценка анкеты врачом"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        questionnaire = get_object_or_404(Questionnaire, pk=pk)

        # Проверяем, что это врач и анкета его
        if request.user.role != 'medic':
            return Response(
                {"error": "Только врач может оценивать анкеты"},
                status=status.HTTP_403_FORBIDDEN
            )

        medic = request.user.medic_profile
        if questionnaire.medic.id != medic.id:
            return Response(
                {"error": "Это не ваша анкета"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Проверяем статус
        if questionnaire.status != 'sent_to_medic':
            return Response(
                {"error": f"Анкета уже в статусе {questionnaire.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Получаем решение врача
        action = request.data.get('action')  # 'accept' или 'deny'
        questionnaire.medics_respond = request.data.get('medics_respond', '')

        if action == 'accept':
            # Считаем среднюю оценку (если нужно)
            # В дипломе result считается как-то иначе? Уточни
            total = 0
            responses = questionnaire.patient_responses.all()
            for resp in responses:
                # Здесь можно добавить логику оценки
                pass

            questionnaire.status = 'answered'
            questionnaire.result = request.data.get('result', 0)
        elif action == 'deny':
            questionnaire.status = 'denied'
            # Удаляем старые ответы, чтобы пациент мог заполнить заново
            questionnaire.patient_responses.all().delete()
            questionnaire.optional = ''
        else:
            return Response(
                {"error": "Действие должно быть 'accept' или 'deny'"},
                status=status.HTTP_400_BAD_REQUEST
            )

        questionnaire.save()

        serializer = QuestionnaireSerializer(questionnaire)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuestionnaireStatsView(APIView):
    """Статистика для графика (оценки по датам) - для пациента"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':  # проверка на пациента!
            return Response(
                {"error": "Только пациент может смотреть статистику"},
                status=status.HTTP_403_FORBIDDEN
            )

        patient = request.user.patient_profile
        medical_card = patient.medical_card
        questionnaires = Questionnaire.objects.filter(
            medical_card=medical_card,
            status='answered'
        ).order_by('date')

        result = []
        for medic in patient.medics.all():
            medic_quests = questionnaires.filter(medic=medic)
            data = {
                'medic_name': medic.name,
                'dates': [q.date.strftime('%Y-%m-%d') for q in medic_quests],
                'results': [q.result for q in medic_quests]
            }
            result.append(data)

        return Response(result)


class PatientProfileStatusView(APIView):
    """Проверка, заполнен ли профиль пациента"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({"error": "Только пациент"}, status=403)

        patient = request.user.patient_profile
        is_filled = bool(patient.name and patient.name.strip())
        return Response({'filled': is_filled})


class MedicProfileStatusView(APIView):
    """Проверка, заполнен ли профиль врача"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'medic':
            return Response({"error": "Только врач"}, status=403)

        medic = request.user.medic_profile
        is_filled = bool(medic.name and medic.name.strip())
        return Response({'filled': is_filled})