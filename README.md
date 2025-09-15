# Internal Tools Dashboard

**Internal Tools Dashboard** est une application React pour gérer et suivre les outils internes d’une organisation. Elle permet de visualiser les métriques, gérer les outils, et suivre les coûts et utilisateurs.

---

## Quick Start

### Prérequis
- Node.js >= 18
- npm ou yarn
- Accès à l’API backend JSON Server :
`http://localhost:3001`
Voir le README.md dans (server_json/README.md)


### Installation
1. Cloner le dépôt :


https://github.com/Guigol/techcorp-analytics.git
### `cd techcorp-analytics`

2. Lancer l'application dans le navigateur :
- Cliquer sur `http://localhost:3000`

ou
### `npm run dev`ou
### `yarn dev`


Lancer ensuite : 
### `npm start`


---

## Structure :

- L’application suit une architecture React fonctionnelle avec hooks et context :

Hooks

- useTools : fetch des outils depuis l’API, pagination et gestion du loading/error

Context

- SearchContext : fournit la valeur du champ de recherche pour filtrer les outils

Composants

- Dashboard : composant principal affichant les métriques et la liste des outils

- AddToolModal : modal pour ajouter un nouvel outil

- ToolDetailsModal : modal pour voir ou éditer un outil

- ConfirmModal : modal pour confirmer des actions (toggle status, suppression)

UI

- react-icons pour les icônes

- tailwindcss pour le style

- Dark mode et thème néon pour les métriques et la table

### Arborescence
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Tools.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
└── App.jsx
```
---

## Navigation
### Dashboard

Vue principale avec :

- Métriques clés : Budget, Active Tools, Departments, Cost per User

- Liste des outils récents : filtrable et triable

- Actions rapides : Ajouter, éditer, supprimer, toggle status

### Tools

- Page détaillée (via lien “View all tools →”) avec table complète de tous les outils

- Actions disponibles sur chaque ligne : Voir détails, Modifier, Activer/Désactiver, Sélection pour action en masse (bulk toggle)

## User Journey (Flow Utilisateur)

```

+------------------+
|  Dashboard       |
|  (Metrics + List)|
+------------------+
          |
          v
+------------------+
|  Search / Filter |
+------------------+
          |
          v
+------------------+
|  Sort Columns    |
+------------------+
          |
          v
+------------------+          +------------------+
|  Select Tool     |--------->| ToolDetailsModal |
|  (Click View/Edit)|          +------------------+
+------------------+                  |
          |                            v
          |                  +------------------+
          |                  | Edit Tool Form   |
          |                  +------------------+
          |
          v
+------------------+
| Bulk Actions     |
| (Select multiple)|
+------------------+
          |
          v
+------------------+
| ConfirmModal     |
| (Toggle/Delete)  |
+------------------+
          |
          v
+------------------+
| Updated Dashboard|
+------------------+

```




