from rest_framework import serializers
from .models import MedicalAppointment
from patients.serializers import PatientSerializer
from medics.serializers import MedicSerializer


class MedicalAppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='medical_card.patient.name', read_only=True)
    medic_name = serializers.CharField(source='medic.name', read_only=True)

    class Meta:
        model = MedicalAppointment
        fields = [
            'id', 'medical_card', 'medic', 'date', 'symptoms',
            'diagnosis', 'tests', 'treatment', 'recommendations',
            'created_at', 'patient_name', 'medic_name'
        ]
        read_only_fields = ['created_at', 'medic']