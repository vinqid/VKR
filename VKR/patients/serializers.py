from rest_framework import serializers
from .models import Patient, MedicalCard


class MedicalCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalCard
        fields = ['id', 'height', 'weight', 'blood_type', 'rh_factor', 'chronic_diseases', 'allergies']


class PatientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    medical_card = MedicalCardSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'name', 'birth_date', 'sex', 'username', 'medical_card']