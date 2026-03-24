import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NgChartsModule } from 'ng2-charts';  // импортируем модуль, а не директиву
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-patient-stats',
  standalone: true,
  imports: [CommonModule, RouterLink, NgChartsModule],  // используем NgChartsModule
  templateUrl: './patient-stats.html',
  styleUrls: ['./patient-stats.css']
})
export class PatientStatsComponent implements OnInit {
  loading = true;
  error = '';
  
  // Данные для графиков
  statsData: any[] = [];
  
  // Настройки графиков
  lineChartType: ChartType = 'line';
  
  // Цвета для разных врачей
  colors = [
    'rgba(54, 162, 235, 1)',   // синий
    'rgba(255, 99, 132, 1)',    // красный
    'rgba(75, 192, 192, 1)',    // зеленый
    'rgba(255, 159, 64, 1)',    // оранжевый
    'rgba(153, 102, 255, 1)',   // фиолетовый
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
    this.api.getQuestionnaireStats().subscribe({
      next: (data) => {
        this.statsData = data;
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

  // Получить конфигурацию графика для конкретного врача
getChartConfig(doctorStat: any, index: number): ChartConfiguration {
  const mainColor = this.colors[index % this.colors.length];
  // Создаём полупрозрачный цвет для заливки
  const fillColor = mainColor.replace('1)', '0.2)'); // заменяем opacity на 0.2
  
  return {
    type: 'line',
    data: {
      labels: doctorStat.dates.map((d: string) => {
        const date = new Date(d);
        return date.toLocaleDateString('ru-RU');
      }),
      datasets: [
        {
          label: doctorStat.medic_name,
          data: doctorStat.results,
          borderColor: mainColor,
          backgroundColor: fillColor,  // полупрозрачная заливка
          tension: 0.1,
          fill: true,
          pointBackgroundColor: mainColor,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
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
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          title: {
            display: true,
            text: 'Оценка'
          }
        },
        x: {
          grid: {
            display: false
          },
          title: {
            display: true,
            text: 'Дата'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          callbacks: {
            label: (context) => {
              return `Оценка: ${context.raw}`;
            }
          }
        }
      },
      elements: {
        line: {
          borderWidth: 2
        }
      }
    }
  };
}

  // Проверка, есть ли данные для графика
  hasData(): boolean {
    return this.statsData && this.statsData.length > 0;
  }
}