import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-fill-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './fill-questionnaire.html',
  styleUrls: ['./fill-questionnaire.css']
})
export class FillQuestionnaireComponent implements OnInit {
  questionnaireId: number | null = null;
  questionnaire: any = null;
  responses: { [key: number]: string } = {};
  comment: string = '';
  loading = true;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef  // добавили
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
        // Инициализируем пустые ответы для каждого параметра
        this.questionnaire.parameters.forEach((param: any) => {
          this.responses[param.id] = '';
        });
        this.loading = false;
        this.cdr.detectChanges();  // принудительное обновление
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

  isFormValid(): boolean {
    if (!this.questionnaire) return false;
    return this.questionnaire.parameters.every((param: any) => 
      this.responses[param.id] && this.responses[param.id].trim() !== ''
    );
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.error = 'Заполните все параметры';
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.error = '';

    const responsesData = Object.keys(this.responses).map(key => ({
      parameter_id: Number(key),
      response: this.responses[Number(key)]
    }));

    const data = {
      optional: this.comment,
      responses: responsesData
    };

    this.api.fillQuestionnaire(this.questionnaireId!, data).subscribe({
      next: () => {
        this.success = 'Анкета успешно отправлена!';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/patient-questionnaires']);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Ошибка при отправке анкеты';
        this.submitting = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}