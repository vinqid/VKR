import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-medic-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medic-appointments.html',
  styleUrls: ['./medic-appointments.css']
})
export class MedicAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  patients: any[] = [];
  selectedPatientId: number | null = null;
  loading = true;
  error = '';

  // Для создания нового приёма
  showCreateForm = false;
  newAppointment = {
    medical_card_id: null as number | null,
    date: '',
    symptoms: '',
    diagnosis: '',
    tests: '',
    treatment: '',
    recommendations: ''
  };

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.loadPatients();
  }

  loadAppointments(): void {
    this.loading = true;
    this.api.getMedicAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка загрузки приёмов';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadPatients(): void {
    this.api.getMyPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  filterByPatient(): void {
    if (this.selectedPatientId) {
      this.api.getMedicPatientAppointments(this.selectedPatientId).subscribe({
        next: (data) => {
          this.appointments = data;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loadAppointments();
    }
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.newAppointment = {
        medical_card_id: null,
        date: '',
        symptoms: '',
        diagnosis: '',
        tests: '',
        treatment: '',
        recommendations: ''
      };
    }
  }

  createAppointment(): void {
    if (!this.newAppointment.medical_card_id || !this.newAppointment.date) {
      this.error = 'Заполните обязательные поля (пациент, дата)';
      return;
    }

    this.loading = true;
    this.error = '';

     // Формируем данные в формате, который ждёт бэкенд
  const data = {
    medical_card: this.newAppointment.medical_card_id,  // ← меняем имя поля
    date: this.newAppointment.date,
    symptoms: this.newAppointment.symptoms,
    diagnosis: this.newAppointment.diagnosis,
    tests: this.newAppointment.tests,
    treatment: this.newAppointment.treatment,
    recommendations: this.newAppointment.recommendations
  };

    this.api.createAppointment(data).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.loadAppointments();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
      console.error('Ошибка создания приёма:', err);
      this.error = 'Ошибка создания приёма';
      this.loading = false;
      this.cdr.detectChanges();
    }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ru-RU');
  }
}