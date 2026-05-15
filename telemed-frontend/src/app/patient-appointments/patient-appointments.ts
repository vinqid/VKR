import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-appointments.html',
  styleUrls: ['./patient-appointments.css']
})
export class PatientAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  loading = true;
  error = '';
  
  // Фильтры
  filterDate: string = '';
  filterDoctor: string = '';
  filterDiagnosis: string = '';
  
  // Уникальные врачи для фильтра
  uniqueDoctors: string[] = [];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    this.api.getPatientAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.filteredAppointments = data;
        this.extractUniqueDoctors();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка загрузки приёмов';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  extractUniqueDoctors(): void {
    const doctors = new Set<string>();
    this.appointments.forEach(app => {
      if (app.medic_name) {
        doctors.add(app.medic_name);
      }
    });
    this.uniqueDoctors = Array.from(doctors);
  }

  applyFilters(): void {
    this.filteredAppointments = this.appointments.filter(app => {
      let match = true;
      
      if (this.filterDate) {
        const appDate = new Date(app.date).toISOString().split('T')[0];
        match = match && (appDate === this.filterDate);
      }
      
      if (this.filterDoctor && this.filterDoctor !== '') {
        match = match && (app.medic_name === this.filterDoctor);
      }
      
      if (this.filterDiagnosis && this.filterDiagnosis !== '') {
        match = match && (app.diagnosis?.toLowerCase().includes(this.filterDiagnosis.toLowerCase()));
      }
      
      return match;
    });
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.filterDate = '';
    this.filterDoctor = '';
    this.filterDiagnosis = '';
    this.filteredAppointments = this.appointments;
    this.cdr.detectChanges();
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return 'Дата не указана';
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadge(status?: string): string {
    // Можно добавить статусы, если нужно
    return 'bg-info';
  }
}