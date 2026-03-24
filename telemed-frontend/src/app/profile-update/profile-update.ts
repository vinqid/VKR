import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-update.html',
  styleUrls: ['./profile-update.css']
})
export class ProfileUpdateComponent implements OnInit {
  role: 'medic' | 'patient' = 'patient';
  loading = false;
  error = '';
  success = false;

  // Для пациента
  patientData = {
    name: '',
    birth_date: '',
    sex: 'M'
  };

  // Для врача
  medicData = {
    name: '',
    specialty: '',
    education: '',
    work_place: ''
  };

  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.role = user.role;
      this.loadProfile();
    }
  }

  loadProfile(): void {
    if (this.role === 'patient') {
      this.api.getPatientProfile().subscribe({
        next: (data) => {
          this.patientData.name = data.name || '';
          this.patientData.birth_date = data.birth_date || '';
          this.patientData.sex = data.sex || 'M';
        },
        error: (err) => console.error(err)
      });
    } else {
      this.api.getMedicProfile().subscribe({
        next: (data) => {
          this.medicData.name = data.name || '';
          this.medicData.specialty = data.specialty || '';
          this.medicData.education = data.education || '';
          this.medicData.work_place = data.work_place || '';
        },
        error: (err) => console.error(err)
      });
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.error = '';

    if (this.role === 'patient') {
      this.api.updatePatientProfile(this.patientData).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (err) => {
          this.error = 'Ошибка сохранения';
          this.loading = false;
        }
      });
    } else {
      this.api.updateMedicProfile(this.medicData).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (err) => {
          this.error = 'Ошибка сохранения';
          this.loading = false;
        }
      });
    }
  }
}