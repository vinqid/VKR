import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-detail.html',
  styleUrls: ['./appointment-detail.css']
})
export class AppointmentDetailComponent implements OnInit {
  appointmentId: number | null = null;
  appointment: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef  // ← добавили
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.appointmentId = Number(params['id']);
      if (this.appointmentId) {
        this.loadAppointment();
      } else {
        this.error = 'ID приёма не указан';
        this.loading = false;
        this.cdr.detectChanges();  // ← принудительное обновление
      }
    });
  }

  loadAppointment(): void {
    this.loading = true;
    this.error = '';
    
    this.api.getAppointmentDetail(this.appointmentId!).subscribe({
      next: (data) => {
        this.appointment = data;
        this.loading = false;
        this.cdr.detectChanges();  // ← главное: принудительное обновление после загрузки
        console.log('Приём загружен:', data);
      },
      error: (err) => {
        console.error('Ошибка загрузки:', err);
        this.error = `Ошибка загрузки приёма: ${err.status} ${err.statusText}`;
        this.loading = false;
        this.cdr.detectChanges();  // ← и тут тоже
      }
    });
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

  goBack(): void {
    window.history.back();
  }
}