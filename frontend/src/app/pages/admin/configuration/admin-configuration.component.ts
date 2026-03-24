import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService, Categorie } from '../../../services/ticket.service';

@Component({
  selector: 'app-admin-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-configuration.component.html'
})
export class AdminConfigurationComponent implements OnInit {
  categories: Categorie[] = [];
  newCategoryName = '';
  loading = true;
  saving = false;

  private bgColors = ['#eff6ff', '#f5f3ff', '#fdf2f8', '#ecfdf5', '#fff7ed', '#fef2f2', '#f0fdf4', '#faf5ff'];
  private fgColors = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#ea580c', '#dc2626', '#16a34a', '#9333ea'];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.ticketService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement catégories:', err);
        this.loading = false;
      }
    });
  }

  addCategory(): void {
    if (!this.newCategoryName.trim() || this.saving) return;
    this.saving = true;
    this.ticketService.createCategory({ nom: this.newCategoryName.trim() }).subscribe({
      next: (cat) => {
        this.categories.push(cat);
        this.newCategoryName = '';
        this.saving = false;
      },
      error: (err) => {
        console.error('Erreur ajout catégorie:', err);
        this.saving = false;
      }
    });
  }

  deleteCategory(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    this.ticketService.deleteCategory(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== id);
      },
      error: (err) => console.error('Erreur suppression catégorie:', err)
    });
  }

  getCategoryColor(index: number, isBg: boolean): string {
    const colors = isBg ? this.bgColors : this.fgColors;
    return colors[index % colors.length];
  }
}
