# React Starter with Vite, Tailwind CSS, and shadcn/ui

Ce projet est un starter React utilisant Vite comme bundler, Tailwind CSS pour le styling, et shadcn/ui pour les composants UI. Il inclut également react-router-dom pour la navigation et une structure de base pour une application web moderne.

## Fonctionnalités

- ⚡️ Vite pour un développement rapide et une construction optimisée
- ⚛️ React 18 pour la construction d'interfaces utilisateur modernes
- 🎨 Tailwind CSS pour un styling utility-first
- 🧩 shadcn/ui pour des composants UI personnalisables et accessibles
- 📦 TypeScript pour un typage statique
- 🚦 React Router pour la navigation
- 📱 Design responsive avec un menu hamburger pour mobile

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (normalement installé avec Node.js)

## Installation

Clonez ce dépôt :
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
│   │   ├── ui/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
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

## Caractéristiques du projet

- **Navigation** : Utilise react-router-dom pour une navigation fluide entre les pages.
- **Layout** : Un composant Layout qui inclut un Header et un Footer communs à toutes les pages.
- **Responsive** : Le Header inclut un menu hamburger pour les écrans mobiles.
- **Pages** : Exemples de pages Home, About et Contact.
- **Composants UI** : Utilise les composants shadcn/ui pour un design cohérent et accessible.

## Personnalisation

- Les composants shadcn/ui sont disponibles dans `src/components/ui/`
- Modifiez `src/index.css` pour ajuster les variables Tailwind CSS
- Ajoutez vos propres composants dans `src/components/`
- Créez de nouvelles pages dans `src/pages/` et ajoutez-les aux routes dans `App.tsx`

## Bonnes pratiques

- Utilisez les composants shadcn/ui pour maintenir une cohérence dans le design
- Suivez les conventions de nommage et la structure de fichiers existante
- Utilisez TypeScript pour bénéficier du typage statique
- Optimisez les performances en utilisant le code splitting de React Router

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

[MIT](https://choosealicense.com/licenses/mit/)