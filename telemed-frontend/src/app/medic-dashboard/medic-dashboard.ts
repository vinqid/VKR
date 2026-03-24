import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-medic-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './medic-dashboard.html',
  styleUrls: ['./medic-dashboard.css']
})
export class MedicDashboardComponent implements OnInit {
  medicName: string = '';
  patients: any[] = [];
  selectedPatientId: number | null = null;
  newResponsesCount: number = 0;

  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMedicProfile();
    this.loadPatients();
    this.loadNewResponsesCount();
  }

  loadMedicProfile(): void {
    this.api.getMedicProfile().subscribe({
      next: (data) => {
        this.medicName = data.name;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadPatients(): void {
    this.api.getMyPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadNewResponsesCount(): void {
    this.api.getNewResponsesCount().subscribe({
      next: (data) => {
        this.newResponsesCount = data.count;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  createQuestionnaireForSelected(): void {
    if (this.selectedPatientId) {
      this.router.navigate(['/create-questionnaire'], {
        queryParams: { patientId: this.selectedPatientId }
      });
    }
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/login']);
  }
}