from rest_framework import serializers
from .models import MonitoredParameter, Questionnaire, PatientResponse
from patients.serializers import PatientSerializer
from medics.serializers import MedicSerializer


class MonitoredParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonitoredParameter
        fields = ['id', 'name', 'description']


class PatientResponseSerializer(serializers.ModelSerializer):
    parameter_name = serializers.CharField(source='parameter.name', read_only=True)

    class Meta:
        model = PatientResponse
        fields = ['id', 'response', 'parameter', 'parameter_name']


class QuestionnaireSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='medical_card.patient.name', read_only=True)
    medic_name = serializers.CharField(source='medic.name', read_only=True)
    parameters = MonitoredParameterSerializer(many=True, read_only=True)
    parameter_ids = serializers.ListField(write_only=True, child=serializers.IntegerField())
    patient_responses = PatientResponseSerializer(many=True, read_only=True)

    class Meta:
        model = Questionnaire
        fields = [
            'id', 'medical_card', 'medic', 'date', 'parameters', 'parameter_ids',
            'optional', 'result', 'status', 'medics_respond',
            'patient_name', 'medic_name', 'patient_responses', 'created_at'
        ]
        read_only_fields = ['result', 'status', 'created_at', 'medic']

    def create(self, validated_data):
        parameter_ids = validated_data.pop('parameter_ids')
        questionnaire = Questionnaire.objects.create(**validated_data)
        parameters = MonitoredParameter.objects.filter(id__in=parameter_ids)
        questionnaire.parameters.set(parameters)
        return questionnaire