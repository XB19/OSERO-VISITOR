# OSERO VISITOR

Système intelligent d'accueil, de notification et d'orientation des visiteurs — Groupe OSERO.

Stack : **Spring Boot (Java 17) + PostgreSQL** pour le backend, **React + TypeScript (Vite)** pour le frontend
(borne visiteur, interface employé, interface sécurité, dashboard administrateur).

## Structure du projet

```
backend/    API REST Spring Boot (JWT, Spring Security, Spring Data JPA, Flyway)
frontend/   Application React (borne, employé, sécurité, admin)
docker-compose.yml   PostgreSQL prêt à l'emploi pour le développement local
```

## Démarrage rapide

### 1. Base de données

```bash
docker compose up -d
```

Démarre PostgreSQL 16 sur `localhost:5432` (base `osero_visitor`, utilisateur `osero` / mot de passe `osero`).

### 2. Backend (port 8080)

```bash
cd backend
./mvnw spring-boot:run        # Linux/macOS
mvnw.cmd spring-boot:run      # Windows
```

Au premier démarrage, Flyway crée le schéma et insère un compte administrateur par défaut :

- **E-mail** : `admin@osero.local`
- **Mot de passe** : `changeme123` (à changer immédiatement en production)

Variables d'environnement utiles (voir `backend/src/main/resources/application.yml`) :

| Variable | Rôle | Défaut |
|---|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Connexion PostgreSQL | `localhost:5432/osero_visitor` |
| `JWT_SECRET` | Clé de signature JWT (≥ 32 caractères) | valeur de dev, à changer |
| `CORS_ALLOWED_ORIGINS` | Origines autorisées pour le frontend | `http://localhost:5173` |
| `VISIT_ESCALATION_MINUTES` | Délai avant qu'une demande soit signalée « en attente prolongée » | `5` |

### 3. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Copier `.env.example` en `.env` si l'API ne tourne pas sur `http://localhost:8080`.

## Flux métier

Le secrétariat centralise la validation de toutes les demandes (comme le fonctionnement réel à l'accueil OSERO :
la personne à l'accueil appelle le secrétariat, qui confirme et enregistre le visiteur). Les employés n'ont pas
besoin de compte pour être visités.

```
Visiteur (borne) → demande → file unique du SECRÉTARIAT
Secrétariat → Valider / Faire patienter / Refuser → visiteur orienté (bâtiment/étage/bureau)
Sécurité → clôture la visite au départ du visiteur
Chaque visite validée = une ligne du registre numérique (Admin > Historique), plus de registre papier.
```

## Parcours applicatifs

- **`/`** — Borne visiteur (accueil, identité, motif, personne à rencontrer, récapitulatif, statut). Aucune authentification.
- **`/login`** — Connexion secrétariat / sécurité / administrateur.
- **`/secretariat`** — Toutes les demandes en attente (tous employés confondus), actions Valider / Faire patienter / Refuser.
- **`/security`** — Liste des visiteurs présents, clôture de visite.
- **`/admin`** — Dashboard (statistiques), gestion des employés, bâtiments/étages/bureaux/départements, historique = registre numérique.

## API — endpoints principaux

| Domaine | Endpoints |
|---|---|
| Auth | `POST /api/auth/login` |
| Borne (public) | `GET /api/kiosk/employees`, `GET /api/kiosk/reasons`, `POST /api/kiosk/visits`, `GET /api/kiosk/visits/{id}/status` |
| Secrétariat | `GET /api/secretariat/visits`, `POST /api/secretariat/visits/{id}/{accept\|wait\|refuse}` |
| Sécurité | `GET /api/security/visits/active`, `POST /api/security/visits/{id}/close` |
| Admin | `GET /api/admin/dashboard`, `GET /api/admin/visits/history` (registre numérique), CRUD `/api/admin/employees`, `/departments`, `/buildings`, `/floors`, `/offices` |

## État du MVP

Implémenté : parcours visiteur complet, notification + décision employé, orientation (bâtiment/étage/bureau),
clôture de visite par la sécurité, dashboard admin, gestion des employés et des locaux, authentification par rôle (JWT).

Non implémenté (voir §23 du cahier des charges — fonctionnalités futures) : QR code, pré-enregistrement,
notifications push/SMS, plan interactif, mode hors connexion avec synchronisation différée.
