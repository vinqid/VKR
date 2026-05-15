import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';  // импортируем компонент логина
import { Register } from './register/register';
import { ProfileEditComponent } from './profile-edit/profile-edit';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard';
import { MedicDashboardComponent } from './medic-dashboard/medic-dashboard';
import { PatientQuestionnairesComponent } from './patient-questionnaires/patient-questionnaires';
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

const routes: Routes = [
  { path: 'medic-appointments', component: MedicAppointmentsComponent },
  { path: 'patient-appointments', component: PatientAppointmentsComponent },
  { path: 'appointment-detail/:id', component: AppointmentDetailComponent },
  { path: 'patient-medical-card/:id', component: PatientMedicalCardComponent },
   { path: 'login', component: Login },      // путь к логину
   { path: 'profile-update', component: ProfileUpdateComponent },
   { path: 'register', component: Register },
   { path: 'profile', component: ProfileViewComponent },
   { path: 'manage-parameters', component: ManageParametersComponent },
   { path: 'profile/edit', component: ProfileEditComponent },
   { path: 'questionnaire-detail/:id', component: QuestionnaireDetailComponent },
   { path: 'patient-dashboard', component: PatientDashboardComponent },
   { path: 'medic-dashboard', component: MedicDashboardComponent },
   { path: 'patient-questionnaires', component: PatientQuestionnairesComponent },
   { path: 'create-questionnaire', component: CreateQuestionnaireComponent },
    { path: 'find-doctor', component: FindDoctorComponent },
    { path: 'medic-patients', component: MedicPatientsComponent },
    { path: 'fill-questionnaire/:id', component: FillQuestionnaireComponent },
    { path: 'medic-questionnaires', component: MedicQuestionnairesComponent },
    { path: 'patient-stats', component: PatientStatsComponent },
    { path: 'doctor-stats', component: DoctorStatsComponent },
   { path: '', redirectTo: '/login', pathMatch: 'full' }  // редирект с корня
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
