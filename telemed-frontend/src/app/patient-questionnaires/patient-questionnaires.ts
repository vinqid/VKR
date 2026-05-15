import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-patient-questionnaires',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-questionnaires.html',
  styleUrls: ['./patient-questionnaires.css']
})
export class PatientQuestionnairesComponent implements OnInit {
  questionnaires: any[] = [];
  loading = true;
  error = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef  // добавить
  ) {}

  ngOnInit(): void {
    this.loadQuestionnaires();
  }

  loadQuestionnaires(): void {
    this.loading = true;
    this.api.getPatientQuestionnaires().subscribe({
      next: (data) => {
        this.questionnaires = data;
        this.loading = false;
        this.cdr.detectChanges();  // принудительное обновление
        console.log('Анкеты загружены:', data);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки анкет';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: any = {
      'sent_to_patient': 'Ожидает заполнения',
      'sent_to_medic': 'Отправлена врачу',
      'answered': 'Принята',
      'denied': 'Отклонена'
    };
    return statusMap[status] || status;
  }

  retakeQuestionnaire(id: number): void {
    this.api.retakeQuestionnaire(id).subscribe({
      next: () => {
        alert('Анкета готова к заполнению');
        this.loadQuestionnaires(); // перезагружаем список
      },
      error: (err) => {
        console.error('Ошибка:', err);
        alert('Не удалось подготовить анкету');
      }
    });
  }

  getStatusClass(status: string): string {
    const classMap: any = {
      'sent_to_patient': 'warning',
      'sent_to_medic': 'info',
      'answered': 'success',
      'denied': 'danger'
    };
    return classMap[status] || 'secondary';
  }
}