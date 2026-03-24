import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-medic-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medic-patients.html',
  styleUrls: ['./medic-patients.css']
})
export class MedicPatientsComponent implements OnInit {
  patients: any[] = [];
  newPatientUsername: string = '';
  loading = true;  // сразу true
  error = '';
  success = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef  // добавляем
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.api.getMyPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loading = false;
        this.cdr.detectChanges();  // принудительное обновление
      },
      error: (err) => {
        this.error = 'Ошибка загрузки пациентов';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addPatient(): void {
    if (!this.newPatientUsername.trim()) {
      this.error = 'Введите логин пациента';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.api.addPatient(this.newPatientUsername).subscribe({
      next: () => {
        this.success = 'Пациент успешно добавлен';
        this.newPatientUsername = '';
        this.loadPatients();  // перезагружаем список
      },
      error: (err) => {
        this.error = 'Ошибка: пациент не найден или уже добавлен';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  removePatient(patientId: number): void {
    if (confirm('Удалить пациента из списка?')) {
      this.api.removePatient(patientId).subscribe({
        next: () => {
          this.success = 'Пациент удалён';
          this.loadPatients();
        },
        error: (err) => {
          this.error = 'Ошибка удаления';
          this.cdr.detectChanges();
        }
      });
    }
  }
}