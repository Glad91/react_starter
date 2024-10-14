# React Starter with Vite, Tailwind CSS, and shadcn/ui

Ce projet est un starter React utilisant Vite comme bundler, Tailwind CSS pour le styling, et shadcn/ui pour les composants UI.

## Fonctionnalités

- ⚡️ Vite pour un développement rapide et une construction optimisée
- ⚛️ React 18 pour la construction d'interfaces utilisateur modernes
- 🎨 Tailwind CSS pour un styling utility-first
- 🧩 shadcn/ui pour des composants UI personnalisables et accessibles
- 📦 TypeScript pour un typage statique

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (normalement installé avec Node.js)

## Installation

1. Clonez ce dépôt :
   ```
   git clone https://github.com/Glad91/react_starter
   cd react_starter
   ```

2. Installez les dépendances :
   ```
   npm install
   ```

## Lancement du projet

Pour lancer le serveur de développement :

```
npm run dev
```

Le serveur démarrera sur `http://localhost:5173` (ou le premier port disponible après celui-ci).

## Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Construit l'application pour la production
- `npm run lint` : Exécute le linter ESLint
- `npm run preview` : Prévisualise la version de production localement

## Structure du projet

```
/
├── public/
├── src/
│   ├── components/
│   │   └── ui/
│   ├── lib/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

## Personnalisation

- Les composants shadcn/ui sont disponibles dans `src/components/ui/`
- Modifiez `src/index.css` pour ajuster les variables Tailwind CSS
- Ajoutez vos propres composants dans `src/components/`

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

[MIT](https://choosealicense.com/licenses/mit/)