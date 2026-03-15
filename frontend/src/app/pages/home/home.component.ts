import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  features = [
    { icon: '🎫', title: 'Gestion de tickets', desc: 'Créez et suivez vos demandes de support en temps réel avec un système de statut clair.' },
    { icon: '👥', title: 'Équipe dédiée', desc: 'Des agents assignés personnellement à chaque ticket pour une résolution rapide et efficace.' },
    { icon: '💬', title: 'Communication fluide', desc: 'Échangez directement avec votre agent via les commentaires intégrés à chaque ticket.' },
    { icon: '🔔', title: 'Notifications instantanées', desc: 'Soyez informé à chaque étape du traitement de vos demandes en temps réel.' },
    { icon: '📊', title: 'Tableau de bord', desc: 'Visualisez l\'état de tous vos tickets et suivez leur progression depuis un seul endroit.' },
    { icon: '🔒', title: 'Sécurité maximale', desc: 'Vos données sont protégées par un système d'authentification JWT robuste.' },
  ];

  stats = [
    { value: '99%', label: 'Taux de satisfaction' },
    { value: '<2h', label: 'Temps de réponse moyen' },
    { value: '24/7', label: 'Support disponible' },
    { value: '10k+', label: 'Tickets résolus' },
  ];
}
