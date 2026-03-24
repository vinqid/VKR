import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-manage-parameters',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manage-parameters.html',
  styleUrls: ['./manage-parameters.css']
})
export class ManageParametersComponent implements OnInit {
  parameters: any[] = [];
  loading = true;
  error = '';
  success = '';
  
  // Для создания нового параметра
  showCreateForm = false;
  newParameter = {
    name: '',
    description: ''
  };
  
  // Для редактирования
  editingParameter: any = null;
  editName = '';
  editDescription = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadParameters();
  }

  loadParameters(): void {
    this.loading = true;
    this.api.getParameters().subscribe({
      next: (data) => {
        this.parameters = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ошибка загрузки параметров';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.newParameter = { name: '', description: '' };
    this.cdr.detectChanges();
  }

  createParameter(): void {
    if (!this.newParameter.name.trim()) {
      this.error = 'Введите название параметра';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.createParameter(this.newParameter).subscribe({
      next: (data) => {
        this.success = 'Параметр успешно создан';
        this.showCreateForm = false;
        this.loadParameters();
        this.loading = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.success = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.error = 'Ошибка при создании параметра';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  startEdit(parameter: any): void {
    this.editingParameter = parameter;
    this.editName = parameter.name;
    this.editDescription = parameter.description || '';
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingParameter = null;
    this.editName = '';
    this.editDescription = '';
    this.cdr.detectChanges();
  }

  updateParameter(): void {
    if (!this.editName.trim()) {
      this.error = 'Введите название параметра';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';

    const data = {
      name: this.editName,
      description: this.editDescription
    };

    this.api.updateParameter(this.editingParameter.id, data).subscribe({
      next: () => {
        this.success = 'Параметр обновлён';
        this.cancelEdit();
        this.loadParameters();
        this.loading = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.success = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.error = 'Ошибка при обновлении параметра';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  deleteParameter(id: number): void {
    if (!confirm('Удалить параметр? Все связанные анкеты могут потерять данные.')) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.api.deleteParameter(id).subscribe({
      next: () => {
        this.success = 'Параметр удалён';
        this.loadParameters();
        this.loading = false;
        this.cdr.detectChanges();
        
        setTimeout(() => {
          this.success = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.error = 'Ошибка при удалении параметра';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }
}