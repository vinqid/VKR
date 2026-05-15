import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterData, RegisterResponse } from '../register/register.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService  {
  
  constructor(private http: HttpClient) { }

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post('/api/auth/login/', credentials);
  }

  register(data: RegisterData): Observable<RegisterResponse> {
  return this.http.post<RegisterResponse>('/api/auth/register/', data);
  }

  checkProfileFilled(role: string): Observable<any> {
    return this.http.get(`/api/${role}/profile-status/`);
  }

  // Пациент
  getPatientProfile(): Observable<any> {
    return this.http.get('/api/patient/profile/');
  }

  // Врач
  getMedicProfile(): Observable<any> {
    return this.http.get('/api/medic/profile/');
  }

  getMedicPatients(): Observable<any> {
    return this.http.get('/api/medic/my-patients/');
  }

  updatePatientProfile(data: any): Observable<any> {
  return this.http.put('/api/patient/profile/update/', data);
  }
  // Получить пациента по ID (для врача)
getPatientById(patientId: number): Observable<any> {
  return this.http.get(`/api/medic/patient/${patientId}/`);
}

// Обновить медкарту пациента (для врача)
updateMedicalCard(patientId: number, data: any): Observable<any> {
  return this.http.put(`/api/medic/patient/${patientId}/medical-card/update/`, data);
}

// Приёмы
getMedicAppointments(): Observable<any> {
  return this.http.get('/api/medic/appointments/');
}

getMedicPatientAppointments(patientId: number): Observable<any> {
  return this.http.get(`/api/medic/patient/${patientId}/appointments/`);
}

getPatientAppointments(): Observable<any> {
  return this.http.get('/api/patient/appointments/');
}

getAppointmentDetail(id: number): Observable<any> {
  return this.http.get(`/api/appointments/${id}/`);
}
retakeQuestionnaire(id: number): Observable<any> {
  return this.http.post(`/api/questionnaires/${id}/retake/`, {});
}
createAppointment(data: any): Observable<any> {
  return this.http.post('/api/appointments/create/', data);
}
  // Обновление профиля врача
  updateMedicProfile(data: any): Observable<any> {
    return this.http.put('/api/medic/profile/update/', data);
  } 

    // Получить список пациентов врача
  getMyPatients(): Observable<any> {
    return this.http.get('/api/medic/my-patients/');
  }

// Создать новый параметр
createParameter(data: any): Observable<any> {
  return this.http.post('/api/parameters/', data);
}

// Обновить параметр
updateParameter(id: number, data: any): Observable<any> {
  return this.http.put(`/api/parameters/${id}/`, data);
}

// Удалить параметр
deleteParameter(id: number): Observable<any> {
  return this.http.delete(`/api/parameters/${id}/`);
}
  // Создать анкету для пациента
  createQuestionnaire(data: any): Observable<any> {
    return this.http.post('/api/questionnaires/create/', data);
  }

  // Добавить пациента по логину
  addPatient(username: string): Observable<any> {
  return this.http.post('/api/medic/add-patient/', { username });
  }

  // Удалить пациента
  removePatient(patientId: number): Observable<any> {
  return this.http.delete(`/api/medic/patient/${patientId}/`);
  }
  // Получить все анкеты врача
  getMedicQuestionnaires(): Observable<any> {
    return this.http.get('/api/questionnaires/medic/');
  }

  // Оценить анкету (принять/отклонить)
  evaluateQuestionnaire(id: number, data: any): Observable<any> {
    return this.http.post(`/api/questionnaires/${id}/evaluate/`, data);
  }

// ============ ДЛЯ ПАЦИЕНТА ============
// Получить все анкеты пациента
  getPatientQuestionnaires(): Observable<any> {
    return this.http.get('/api/questionnaires/patient/');
  }

  // Заполнить анкету
  fillQuestionnaire(id: number, data: any): Observable<any> {
    return this.http.post(`/api/questionnaires/${id}/fill/`, data);
  }

  // Получить данные для графика
  getQuestionnaireStats(): Observable<any> {
    return this.http.get('/api/stats/');
  }

  // Получить все параметры
  getParameters(): Observable<any> {
    return this.http.get('/api/parameters/');
  }

  // Получить список всех врачей
  getAllDoctors(): Observable<any> {
    return this.http.get('/api/medic/all/');
  }

  // Прикрепиться к врачу
  attachToDoctor(doctorId: number): Observable<any> {
    return this.http.post('/api/patient/attach-doctor/', { doctor_id: doctorId });
  }

  // Проверить, прикреплён ли пациент к конкретному врачу
  checkDoctorAttached(doctorId: number): Observable<any> {
    return this.http.get(`/api/patient/check-doctor/${doctorId}/`);
  }

  // Получить список моих врачей (для пациента)
  getMyDoctors(): Observable<any> {
    return this.http.get('/api/patient/my-medics/');
  }

  // Получить одну анкету по ID
getQuestionnaireById(id: number): Observable<any> {
  return this.http.get(`/api/questionnaires/${id}/`);
}

// Получить статистику по пациентам для врача
getDoctorStats(): Observable<any> {
  return this.http.get('/api/medic/stats/');
}

// Получить количество новых анкет для пациента
getNewQuestionnairesCount(): Observable<any> {
  return this.http.get('/api/patient/new-questionnaires-count/');
}

// Получить количество новых ответов для врача
getNewResponsesCount(): Observable<any> {
  return this.http.get('/api/medic/new-responses-count/');
}
}
