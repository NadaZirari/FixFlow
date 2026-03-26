# ⚡ FixFlow — Plateforme de Gestion de Tickets

FixFlow est une application web full-stack de gestion de tickets de support, permettant aux utilisateurs de soumettre des demandes de maintenance et aux administrateurs de les superviser, les traiter et les résoudre.


## 🏗️ Architecture

```
Fixflow-FileRouge/
├── backend/          # API REST — Spring Boot
│   └── src/main/java/com/fixflow/backend/
│       ├── controller/       # Contrôleurs REST
│       ├── service/          # Logique métier
│       ├── repository/       # Accès aux données (JPA)
│       ├── entity/           # Entités JPA
│       ├── dto/              # Objets de transfert
│       ├── config/           # Configuration (Security, CORS, Swagger)
│       ├── security/         # JWT Filter & Service
│       └── enums/            # Énumérations (Statut, Priorité)
├── frontend/                 # SPA — Angular
│   └── src/app/
│       ├── pages/            # Pages (admin, user, auth, shared)
│       ├── services/         # Services HTTP
│       ├── models/           # Modèles TypeScript
│       ├── guards/           # Guards de navigation
│       ├── layouts/          # Layouts (admin sidebar, user sidebar)
│       └── components/       # Composants partagés (navbar)
├── docker-compose.yml        # Orchestration Docker
└── uploads/                  # Stockage des fichiers uploadés
```

---

## 🛠️ Stack Technique

### Backend
| Technologie | Version |
| Java | 17 |


### Frontend
| Technologie | Version |
| Angular | 21 |


### DevOps
| Outil | Usage |
|---|---|
| Docker Compose | Orchestration multi-container |
| PostgreSQL  | Base de données|


### Rôles disponibles
- **USER** — Utilisateur standard (créer des tickets, commenter)
- **ADMIN** — Administrateur (gérer tous les tickets, utilisateurs, catégories)

### Statuts de ticket
`OUVERT` → `EN_COURS` → `RESOLU`

### Niveaux de priorité
`FAIBLE` | `MOYENNE` | `HAUTE` | `CRITIQUE`

---

## 🚀 Installation et Lancement

cd backend/backend

# Lancer le serveur
mvn spring-boot:run
```
> Le backend démarre sur **http://localhost:8081**

#### 3. Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```
> Le frontend démarre sur **http://localhost:4200**

---

## 📡 API REST

L'API est documentée via **Swagger UI** :  
🔗 **http://localhost:8081/swagger-ui.html**



## 👤 Auteur

**Nada Zirari**

---

## 📄 Licence

Ce projet est réalisé dans le cadre d'un **Fil Rouge** académique.
