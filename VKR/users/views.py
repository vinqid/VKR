from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from medics.models import Medic
from patients.models import Patient, MedicalCard
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer


def resolve_user_role(user):
    valid_roles = {'patient', 'medic'}

    if user.role in valid_roles:
        return user.role

    if hasattr(user, 'patient_profile'):
        return 'patient'

    if hasattr(user, 'medic_profile'):
        return 'medic'

    return None


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Достаём доп. поля из request.data (они могут быть пустыми)
        name = request.data.get('name', '')

        # СОЗДАЁМ ПРОФИЛЬ В ЗАВИСИМОСТИ ОТ РОЛИ
        if user.role == 'patient':

            birth_date = request.data.get('birth_date')
            sex = request.data.get('sex', 'M')
            # Создаём пациента с пустыми полями
            patient = Patient.objects.create(
                user=user,
                name='',  # пустое имя
                birth_date=birth_date,
                sex=sex  # значение по умолчанию
            )
            # Создаём пустую медкарту
            MedicalCard.objects.create(patient=patient)

        elif user.role == 'medic':
            # Для врача дополнительные поля
            specialty = request.data.get('specialty', '')
            education = request.data.get('education', '')
            work_place = request.data.get('work_place', '')

            # Создаём врача с пустыми полями
            Medic.objects.create(
                user=user,
                name='',
                specialty=specialty,
                education=education,
                work_place=work_place
            )

        return Response({
            "user": UserSerializer(user).data,
            "message": "Пользователь успешно создан",
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        role = resolve_user_role(user)

        if role and user.role != role:
            user.role = role
            user.save(update_fields=['role'])

        refresh = RefreshToken.for_user(user)

        # Добавляем роль в токен
        refresh['role'] = role
        access_token = refresh.access_token
        access_token['role'] = role

        return Response({
            "user": {**UserSerializer(user).data, "role": role},
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })


from django.shortcuts import render

# Create your views here.
