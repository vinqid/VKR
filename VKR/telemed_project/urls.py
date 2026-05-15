from django.conf import settings
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.static import serve
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Telemed API",
        default_version='v1',
        description="API для дипломной работы",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/medic/', include('medics.urls')),        # все маршруты врача
    path('api/patient/', include('patients.urls')),    # все маршруты пациента
    path('api/', include('questionnaires.urls')),      # общие маршруты (stats, questionnaires)
    path('api/', include('appointments.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

if settings.FRONTEND_DIST_DIR.exists():
    urlpatterns += [
        re_path(
            r'^(?P<path>.*\.(?:css|js|ico|png|jpg|jpeg|svg|webp|woff2?|ttf|map|json|txt))$',
            serve,
            {'document_root': settings.FRONTEND_DIST_DIR},
        ),
        re_path(
            r'^(?!api/|admin/|swagger/|media/|static/).*$',
            TemplateView.as_view(template_name='index.html'),
            name='spa',
        ),
    ]
