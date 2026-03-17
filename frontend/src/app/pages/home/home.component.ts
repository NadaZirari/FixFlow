import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  stats = [
    { label: 'Utilisateurs actifs', value: '2k+' },
    { label: 'Tickets résolus', value: '15k+' },
    { label: 'Temps de réponse', value: '< 2h' }
  ];

  features = [
    {
      icon: '🎫',
      title: 'Gestion de Tickets',
      desc: 'Créez et suivez vos tickets de support en quelques clics avec un suivi en temps réel.'
    },
    {
      icon: '⚡',
      title: 'Réponses Rapides',
      desc: 'Nos agents sont formés pour répondre à vos besoins le plus rapidement possible.'
    },
    {
      icon: '🔐',
      title: 'Sécurité Maximale',
      desc: 'Vos données et communications sont protégées par les standards de sécurité les plus élevés.'
    }
  ];
}
