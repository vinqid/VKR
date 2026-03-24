import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-medic-questionnaires',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './medic-questionnaires.html',
  styleUrls: ['./medic-questionnaires.css']
})
export class MedicQuestionnairesComponent implements OnInit {
  questionnaires: any[] = [];
  filteredQuestionnaires: any[] = [];
  loading = true;
  error = '';
  success = '';
  
  // Для фильтрации по статусу
  selectedStatus: string = 'all';
  
  // Для модального окна оценки
  selectedQuestionnaire: any = null;
  evaluationResult: number = 0;
  evaluationComment: string = '';
  submitting = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadQuestionnaires();
  }

  loadQuestionnaires(): void {
    this.loading = true;
    this.api.getMedicQuestionnaires().subscribe({
      next: (data) => {
        this.questionnaires = data;
        this.filterQuestionnaires();
        this.loading = false;
        this.cdr.detectChanges();
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

  filterQuestionnaires(): void {
    if (this.selectedStatus === 'all') {
      this.filteredQuestionnaires = this.questionnaires;
    } else {
      this.filteredQuestionnaires = this.questionnaires.filter(
        q => q.status === this.selectedStatus
      );
    }
    this.cdr.detectChanges();
  }

  onStatusChange(): void {
    this.filterQuestionnaires();
  }

  getStatusText(status: string): string {
    const statusMap: any = {
      'sent_to_patient': 'Отправлена пациенту',
      'sent_to_medic': 'Ожидает оценки',
      'answered': 'Принята',
      'denied': 'Отклонена'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    const classMap: any = {
      'sent_to_patient': 'secondary',
      'sent_to_medic': 'warning',
      'answered': 'success',
      'denied': 'danger'
    };
    return classMap[status] || 'secondary';
  }

  openEvaluateModal(questionnaire: any): void {
    this.selectedQuestionnaire = questionnaire;
    this.evaluationResult = 0;
    this.evaluationComment = '';
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.selectedQuestionnaire = null;
    this.evaluationResult = 0;
    this.evaluationComment = '';
    this.cdr.detectChanges();
  }

  evaluateQuestionnaire(action: 'accept' | 'deny'): void {
    if (action === 'accept' && this.evaluationResult === 0) {
      this.error = 'Укажите оценку';
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.error = '';

    const data = {
      action: action,
      result: action === 'accept' ? this.evaluationResult : 0,
      medics_respond: this.evaluationComment
    };

    this.api.evaluateQuestionnaire(this.selectedQuestionnaire.id, data).subscribe({
      next: () => {
        this.success = `Анкета успешно ${action === 'accept' ? 'принята' : 'отклонена'}`;
        this.loadQuestionnaires(); // перезагружаем список
        this.closeModal();
        this.submitting = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.success = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.error = 'Ошибка при оценке анкеты';
        this.submitting = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}