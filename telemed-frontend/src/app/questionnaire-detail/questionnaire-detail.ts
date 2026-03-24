import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-questionnaire-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './questionnaire-detail.html',
  styleUrls: ['./questionnaire-detail.css']
})
export class QuestionnaireDetailComponent implements OnInit {
  questionnaireId: number | null = null;
  questionnaire: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.questionnaireId = Number(params['id']);
      if (this.questionnaireId) {
        this.loadQuestionnaire();
      }
    });
  }

  loadQuestionnaire(): void {
    this.loading = true;
    this.api.getQuestionnaireById(this.questionnaireId!).subscribe({
      next: (data) => {
        this.questionnaire = data;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Анкета загружена:', data);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки анкеты';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  // ВОТ ЭТОТ МЕТОД НУЖНО ДОБАВИТЬ
  getPatientResponse(parameterId: number): string {
    if (!this.questionnaire || !this.questionnaire.patient_responses) {
      return '—';
    }
    const response = this.questionnaire.patient_responses.find(
      (r: any) => r.parameter === parameterId
    );
    return response ? response.response : '—';
  }

  getStatusText(status: string): string {
    const map: any = {
      'sent_to_patient': 'Отправлена пациенту',
      'sent_to_medic': 'Ожидает оценки',
      'answered': 'Принята',
      'denied': 'Отклонена'
    };
    return map[status] || status;
  }
}