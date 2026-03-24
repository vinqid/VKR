import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-patient-medical-card',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-medical-card.html',
  styleUrls: ['./patient-medical-card.css']
})
export class PatientMedicalCardComponent implements OnInit {
  patientId: number | null = null;
  patientName: string = '';
  medicalCard: any = null;
  loading = true;
  editing = false;
  error = '';
  success = '';

  // Данные для редактирования
  editData = {
    height: null,
    weight: null,
    blood_type: '',
    rh_factor: false,
    chronic_diseases: '',
    allergies: ''
  };

  bloodTypes = [
    'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.patientId = Number(params['id']);
      if (this.patientId) {
        this.loadMedicalCard();
      }
    });
  }

  loadMedicalCard(): void {
    this.loading = true;
    // Получаем данные пациента и его медкарту
    this.api.getPatientById(this.patientId!).subscribe({
      next: (patient) => {
        this.patientName = patient.name;
        if (patient.medical_card) {
          this.medicalCard = patient.medical_card;
          this.editData = {
            height: patient.medical_card.height,
            weight: patient.medical_card.weight,
            blood_type: patient.medical_card.blood_type,
            rh_factor: patient.medical_card.rh_factor,
            chronic_diseases: patient.medical_card.chronic_diseases || '',
            allergies: patient.medical_card.allergies || ''
          };
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка загрузки данных';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    if (!this.editing) {
      // Отмена редактирования — сбрасываем изменения
      this.editData = {
        height: this.medicalCard.height,
        weight: this.medicalCard.weight,
        blood_type: this.medicalCard.blood_type,
        rh_factor: this.medicalCard.rh_factor,
        chronic_diseases: this.medicalCard.chronic_diseases || '',
        allergies: this.medicalCard.allergies || ''
      };
    }
    this.cdr.detectChanges();
  }

  saveMedicalCard(): void {
    this.loading = true;
    this.error = '';

    this.api.updateMedicalCard(this.patientId!, this.editData).subscribe({
      next: (data) => {
        this.medicalCard = data;
        this.editing = false;
        this.success = 'Медицинская карта обновлена';
        this.loading = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.success = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.error = 'Ошибка сохранения';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  }

  getRhText(value: boolean): string {
    return value ? 'Положительный' : 'Отрицательный';
  }
}