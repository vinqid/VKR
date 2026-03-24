import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-find-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './find-doctor.html',
  styleUrls: ['./find-doctor.css']
})
export class FindDoctorComponent implements OnInit {
  doctors: any[] = [];
  filteredDoctors: any[] = [];
  searchTerm: string = '';
  loading = true;
  error = '';
  success = '';
  
  // Храним ID прикреплённых врачей
  attachedDoctors: Set<number> = new Set();

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadAttachedDoctors(); // загружаем список прикреплённых
  }

  loadDoctors(): void {
    this.loading = true;
    this.api.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.filteredDoctors = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка загрузки списка врачей';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  loadAttachedDoctors(): void {
    // Получаем список врачей пациента
    this.api.getMyDoctors().subscribe({
      next: (data) => {
        // Заполняем Set ID прикреплённых врачей
        data.forEach((doctor: any) => {
          this.attachedDoctors.add(doctor.id);
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка загрузки списка прикреплённых врачей', err);
      }
    });
  }

  filterDoctors(): void {
    if (!this.searchTerm) {
      this.filteredDoctors = this.doctors;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredDoctors = this.doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(term) ||
      doctor.specialty.toLowerCase().includes(term)
    );
  }

  isDoctorAttached(doctorId: number): boolean {
    return this.attachedDoctors.has(doctorId);
  }

  attachDoctor(doctorId: number): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.api.attachToDoctor(doctorId).subscribe({
      next: () => {
        // Добавляем ID в Set прикреплённых
        this.attachedDoctors.add(doctorId);
        this.success = 'Врач успешно добавлен в ваш список';
        this.loading = false;
        this.cdr.detectChanges();

        // Убираем сообщение через 3 секунды
        setTimeout(() => {
          this.success = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.error = 'Ошибка при прикреплении к врачу';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}