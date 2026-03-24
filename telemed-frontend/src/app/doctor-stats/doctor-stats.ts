import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-doctor-stats',
  standalone: true,
  imports: [CommonModule, RouterLink, NgChartsModule],
  templateUrl: './doctor-stats.html',
  styleUrls: ['./doctor-stats.css']
})
export class DoctorStatsComponent implements OnInit {
  loading = true;
  error = '';
  
  // Общая статистика
  totalPatients: number = 0;
  totalQuestionnaires: number = 0;
  avgScore: number = 0;
  
  // Статистика по пациентам
  patientsStats: any[] = [];
  
  // Для графиков
  chartType: ChartType = 'bar';
  
  colors = [
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 99, 132, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(153, 102, 255, 0.7)',
  ];

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.api.getDoctorStats().subscribe({
      next: (data) => {
        this.totalPatients = data.total_patients;
        this.totalQuestionnaires = data.total_questionnaires;
        this.avgScore = data.average_score;
        this.patientsStats = data.patients_stats;
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Статистика загружена:', data);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки статистики';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  // График количества анкет по пациентам
  getQuestionnairesChartConfig(): ChartConfiguration {
  return {
    type: 'bar',
    data: {
      labels: this.patientsStats.map(p => p.patient_name),
      datasets: [
        {
          label: 'Количество анкет',
          data: this.patientsStats.map(p => p.questionnaire_count),
          backgroundColor: this.colors,
          borderColor: this.colors.map(c => c.replace('0.7', '1')),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          // Округляем до целых чисел
          ticks: {
            stepSize: 1,
            callback: function(value) {
              return Number.isInteger(value) ? value : null;
            }
          },
          title: {
            display: true,
            text: 'Количество анкет'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `Количество анкет: ${context.raw}`;
            }
          }
        }
      }
    }
  };
}

  // График средних оценок по пациентам
  getAvgScoreChartConfig(): ChartConfiguration {
  return {
    type: 'bar',
    data: {
      labels: this.patientsStats.map(p => p.patient_name),
      datasets: [
        {
          label: 'Средняя оценка',
          data: this.patientsStats.map(p => p.avg_score),
          backgroundColor: this.colors,
          borderColor: this.colors.map(c => c.replace('0.7', '1')),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Средняя оценка'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
               const value = context.raw as number; 
              return `Средняя оценка: ${value.toFixed(1)}`;
            }
          }
        }
      }
    }
  };
}

  hasData(): boolean {
    return this.patientsStats && this.patientsStats.length > 0;
  }
}