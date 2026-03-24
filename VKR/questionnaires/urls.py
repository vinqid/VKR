from django.urls import path
from .views import (
    ParameterListCreateView, ParameterDetailView,
    QuestionnaireCreateView, MedicQuestionnairesView,
    PatientQuestionnairesView, QuestionnaireDetailView,
    FillQuestionnaireView, EvaluateQuestionnaireView,
    QuestionnaireStatsView, PatientProfileStatusView,
    MedicProfileStatusView
)

urlpatterns = [
    # Параметры
    path('parameters/', ParameterListCreateView.as_view(), name='parameter-list'),
    path('parameters/<int:pk>/', ParameterDetailView.as_view(), name='parameter-detail'),

    # Анкеты
    path('questionnaires/create/', QuestionnaireCreateView.as_view(), name='questionnaire-create'),
    path('questionnaires/medic/', MedicQuestionnairesView.as_view(), name='questionnaire-medic'),
    path('questionnaires/patient/', PatientQuestionnairesView.as_view(), name='questionnaire-patient'),
    path('questionnaires/<int:pk>/', QuestionnaireDetailView.as_view(), name='questionnaire-detail'),
    path('questionnaires/<int:pk>/fill/', FillQuestionnaireView.as_view(), name='questionnaire-fill'),
    path('questionnaires/<int:pk>/evaluate/', EvaluateQuestionnaireView.as_view(), name='questionnaire-evaluate'),

    # Статистика
    path('stats/', QuestionnaireStatsView.as_view(), name='questionnaire-stats'),

    # Статус профиля (добавить)
    path('patient/profile-status/', PatientProfileStatusView.as_view(), name='patient-status'),
    path('medic/profile-status/', MedicProfileStatusView.as_view(), name='medic-status'),

]