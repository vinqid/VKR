import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms'; // добавить
import { RouterModule } from '@angular/router'; // должен быть
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Register } from './register/register';
import { ProfileEditComponent } from './profile-edit/profile-edit';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard';
import { MedicDashboardComponent } from './medic-dashboard/medic-dashboard';
import { PatientQuestionnairesComponent } from './patient-questionnaires/patient-questionnaires';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; // добавить импорт
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { CreateQuestionnaireComponent } from './create-questionnaire/create-questionnaire';
import { FindDoctorComponent } from './find-doctor/find-doctor';
import { MedicPatientsComponent } from './medic-patients/medic-patients';
import { FillQuestionnaireComponent } from './fill-questionnaire/fill-questionnaire';
import { MedicQuestionnairesComponent } from './medic-questionnaires/medic-questionnaires';
import { QuestionnaireDetailComponent } from './questionnaire-detail/questionnaire-detail';
import { PatientStatsComponent } from './patient-stats/patient-stats';
import { DoctorStatsComponent } from './doctor-stats/doctor-stats';
import { ManageParametersComponent } from './manage-parameters/manage-parameters';
import { ProfileViewComponent } from './profile-view/profile-view';
import { ProfileUpdateComponent } from './profile-update/profile-update';
import { PatientMedicalCardComponent } from './patient-medical-card/patient-medical-card';
import { MedicAppointmentsComponent } from './medic-appointments/medic-appointments';
import { PatientAppointmentsComponent } from './patient-appointments/patient-appointments';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail';

@NgModule({
  declarations: [App],
  imports: [
    AppointmentDetailComponent,
    PatientAppointmentsComponent,
    MedicAppointmentsComponent,
    PatientMedicalCardComponent,
    ProfileUpdateComponent,
    ProfileViewComponent,
    AppRoutingModule,
    ManageParametersComponent,
    DoctorStatsComponent,
    PatientStatsComponent,
    QuestionnaireDetailComponent,
    MedicQuestionnairesComponent,
    BrowserModule,
    AppRoutingModule,
    Register,
    ProfileEditComponent,
    FormsModule, // добавить
    Login,
    FillQuestionnaireComponent,
    MedicPatientsComponent,
    PatientQuestionnairesComponent,
    HttpClientModule,
    CreateQuestionnaireComponent,
    PatientDashboardComponent,
    MedicDashboardComponent,
    FindDoctorComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
