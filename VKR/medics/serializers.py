from rest_framework import serializers
from .models import Medic
from patients.serializers import PatientSerializer  # создадим позже


class MedicSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Medic
        fields = ['id', 'name', 'specialty', 'education', 'work_place', 'username']