import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-view.html',
  styleUrls: ['./profile-view.css']
})
export class ProfileViewComponent implements OnInit {
  role: 'medic' | 'patient' = 'patient';
  loading = true;
  error = '';
  
  // Данные для пациента
  patientData: any = null;
  
  // Данные для врача
  medicData: any = null;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.role = user.role;
      this.loadProfile();
    }
  }

  loadProfile(): void {
    this.loading = true;
    
    if (this.role === 'patient') {
      this.api.getPatientProfile().subscribe({
        next: (data) => {
          this.patientData = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Ошибка загрузки профиля';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.api.getMedicProfile().subscribe({
        next: (data) => {
          this.medicData = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Ошибка загрузки профиля';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  }

  getSexText(sex: string): string {
    return sex === 'M' ? 'Мужской' : 'Женский';
  }
}