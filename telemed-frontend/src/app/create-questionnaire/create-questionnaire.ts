import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-questionnaire.html',
  styleUrls: ['./create-questionnaire.css']
})
export class CreateQuestionnaireComponent implements OnInit {
  patients: any[] = [];
  parameters: any[] = [];
  selectedPatientId: number | null = null;
  selectedParameterIds: number[] = [];
  date: string = new Date().toISOString().split('T')[0];
  loading = false;
  loadingPatients = true;  // отдельный флаг для пациентов
  loadingParams = true;    // отдельный флаг для параметров
  success = false;
  error = '';
  
  // Для управления видимостью списка параметров
  showParameters = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef  // добавляем
  ) {}

  ngOnInit(): void {
    // Проверяем, передан ли ID пациента через queryParams
    this.route.queryParams.subscribe(params => {
      if (params['patientId']) {
        this.selectedPatientId = Number(params['patientId']);
      }
    });

    this.loadPatients();
    this.loadParameters();
  }

  loadPatients(): void {
    this.loadingPatients = true;
    this.api.getMyPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.loadingPatients = false;
        this.cdr.detectChanges();  // принудительное обновление
        console.log('Пациенты загружены:', data);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки пациентов';
        this.loadingPatients = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  loadParameters(): void {
    this.loadingParams = true;
    this.api.getParameters().subscribe({
      next: (data) => {
        this.parameters = data;
        this.loadingParams = false;
        this.cdr.detectChanges();  // принудительное обновление
        console.log('Параметры загружены:', data);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки параметров';
        this.loadingParams = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  toggleParameters(): void {
    this.showParameters = !this.showParameters;
  }

  toggleParameter(id: number): void {
    const index = this.selectedParameterIds.indexOf(id);
    if (index > -1) {
      this.selectedParameterIds.splice(index, 1);
    } else {
      this.selectedParameterIds.push(id);
    }
  }

  getSelectedParametersText(): string {
    if (this.selectedParameterIds.length === 0) {
      return 'Параметры не выбраны';
    }
    const selected = this.parameters
      .filter(p => this.selectedParameterIds.includes(p.id))
      .map(p => p.name)
      .join(', ');
    return `Выбрано: ${selected}`;
  }

  goBack(): void {
  this.router.navigate(['/medic-dashboard']);
}
cancel(): void {
  this.router.navigate(['/medic-dashboard']);
}
  onSubmit(): void {
    if (!this.selectedPatientId) {
      this.error = 'Выберите пациента';
      return;
    }
    if (this.selectedParameterIds.length === 0) {
      this.error = 'Выберите хотя бы один параметр';
      return;
    }

    this.loading = true;
    this.error = '';

    const data = {
      medical_card: this.selectedPatientId,
      date: this.date,
      parameter_ids: this.selectedParameterIds
    };

    this.api.createQuestionnaire(data).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/medic-dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.error = 'Ошибка создания анкеты';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}