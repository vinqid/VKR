import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css']
})
export class PatientDashboardComponent implements OnInit {
  patientName: string = '';
  newQuestionnairesCount: number = 0;

  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPatientProfile();
    this.loadNewQuestionnairesCount();
  }

  loadPatientProfile(): void {
    this.api.getPatientProfile().subscribe({
      next: (data) => {
        this.patientName = data.name;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadNewQuestionnairesCount(): void {
    this.api.getNewQuestionnairesCount().subscribe({
      next: (data) => {
        this.newQuestionnairesCount = data.count;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  logout(): void {
    this.tokenService.logout();
    this.router.navigate(['/login']);
  }
}