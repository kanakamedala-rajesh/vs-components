# @venkasudha/components

A production-ready, animated, and responsive components system for React/Next.js, built with Tailwind CSS and Framer Motion. Features smooth scroll transitions, scrollspy highlighting, dark mode toggle, accessible keyboard navigation, focus trapping, and customizable components.

[![NPM Version](https://img.shields.io/npm/v/@venkatasudha/components.svg)](https://www.npmjs.com/package/@venkatasudha/components) <!-- TODO: Replace with actual badge -->

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Responsive design (Desktop menu, Mobile popover with hamburger).

- Smooth glassmorphism effect transition on scroll.

- Hide/show navbar on scroll down/up.

- Configurable scrollspy for active section highlighting.

- Performant animations using Framer Motion.

- Integrated Dark Mode toggle (requires `next-themes`).

- Accessible: Keyboard navigation, focus trapping, focus restoration, ARIA attributes.

- Customizable: Pass your own Logo or DarkModeToggle components, override styles via classNames.

- Built with TypeScript.

- Requires consumer-side Tailwind CSS setup.

## Installation

```bash

npm  install  @venkatasudha/components

# or

yarn  add  @venkatasudha/components

```

## Peer Dependencies

You must have the following packages installed in your project:

- react >= 18

- react-dom >= 18

- next >= 14 (for next/link, next/font if used in your app)

- framer-motion >= 10

- lucide-react >= 0.300

- next-themes >= 0.3

- tailwindcss >= 3

Install them if you haven't already:

```bash
npm install react react-dom next framer-motion lucide-react next-themes tailwindcss

or

yarn add react react-dom next framer-motion lucide-react next-themes tailwindcss
```

## Tailwind CSS Setup (Required)

This library uses Tailwind CSS utility classes. Your project must be configured to use Tailwind CSS.

Install & Initialize Tailwind: Follow the official Tailwind CSS installation guide for your framework (e.g., Install Tailwind CSS with Next.js).

Configure content: Ensure your tailwind.config.js (or .ts) content array includes the paths where you use the library components, so Tailwind can scan them for classes:

```js
// tailwind.config.js or tailwind.config.ts

/** @type {import('tailwindcss').Config} */

module.exports = {
  // Ensure darkMode is set to 'class' if using the DarkModeToggle

  darkMode: "class",

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Include mdx if used

    "./pages/**/*.{js,ts,jsx,tsx,mdx}",

    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // If library is in node_modules AND its source files contain Tailwind classes

    // that aren't reflected in YOUR usage, you might need this:

    // './node_modules/@venkatasudha/components/dist/**/*.{js,mjs}', // Check if necessary
  ],

  theme: {
    extend: {
      // Extend theme here if needed
    },
  },

  plugins: [
    // Add Tailwind plugins here if needed by your app (e.g., require('@tailwindcss/forms'))
  ],
};
```

## Usage

### 1. Theme Provider Setup (next-themes)

Your application needs to be wrapped in the ThemeProvider from next-themes. The NavBar library also relies on Radix UI Tooltip, so wrap your app in <TooltipProvider> as well.

```Tsx
// app/providers.tsx (Example)

'use client';



import * as React from 'react';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import { type ThemeProviderProps } from 'next-themes/dist/types';

import { TooltipProvider } from '@radix-ui/react-tooltip'; // Import from Radix directly



export function AppProviders({ children }: { children: React.ReactNode }) {

return (

<NextThemesProvider

attribute="class"

defaultTheme="system"

enableSystem

disableTransitionOnChange  //  Recommended  for  smoother  Framer  Motion  animations

>

{/* Provide Tooltip context globally */}

<TooltipProvider  delayDuration={100}>

{children}

</TooltipProvider>

</NextThemesProvider>

);

}



// app/layout.tsx

import { AppProviders } from './providers'; // Adjust path

import './globals.css'; // Your global styles including Tailwind directives

// Import fonts if needed

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });




export default function RootLayout({ children }: { children: React.ReactNode }) {

return (

<html  lang="en"  suppressHydrationWarning>

<body  className={inter.className}> {/* Apply font */}

<AppProviders>{children}</AppProviders>

</body>

</html>

);

}

```

### 2. Using the NavBar Component

Import and use the NavBar component in your layout or page structure. Ensure the main content area has appropriate top padding to avoid being obscured by the fixed NavBar.

```Tsx
// components/layout/Header.tsx (Example wrapper in your app)

'use client'; // If it uses client-side logic or hooks



import { NavBar, MenuItem } from '@venkatasudha/components';

// Optional: Import your custom logo or toggle if needed

// import MyCustomLogo from './MyCustomLogo';

const menuItemsData: MenuItem[] = [

{ name: "About", href: "#about" },

{ name: "Work", href: "#work" },

{ name: "Skills", href: "#skills" },

{ name: "Contact", href: "#contact" },

];



export default function Header() {

return (

<NavBar

menuItems={menuItemsData}

//  Pass  props  for  the  default  Logo  component

logoProps={{

initials:  'RK',  //  Or  customize

textClassName:  'font-playfair'  //  Example:  Apply  a  custom  font  class  defined  in  your  globals.css

}}

//  ---  Optional  Props  ---

//  logoComponent={<MyCustomLogo />} // Use your own component entirely

// darkModeToggleComponent={<MyCustomToggle />}

// className="your-custom-header-class" // Add classes to the <header>

// containerClassName="max-w-7xl" // Override container width/padding

// enableScrollspy={true} // Default is true

// scrollThreshold={50} // Start background transition later

// scrollTransitionRange={150} // Make background transition slower

/>

);

}



// app/layout.tsx (Using the Header)

import Header from '@/components/layout/Header'; // Path to your header wrapper

import Footer from '@/components/layout/Footer'; // Your footer component

// ... other imports



export default function RootLayout({ children }: { children: React.ReactNode }) {

return (

<html  lang="en"  suppressHydrationWarning>

<body  className={inter.className}>

<AppProviders>

<Header  />

{/* Add padding-top to avoid content hiding behind fixed NavBar */}

{/* Adjust pt value based on NavBar height (h-16/md:h-20 -> pt-16/md:pt-20) */}

<main  className="pt-16 md:pt-20 min-h-screen">

{/* Example Sections for Scrollspy */}

{/* Ensure these sections exist and have the correct IDs */}

<section  id="about"  className="min-h-screen bg-blue-50 dark:bg-blue-900 py-20">

<h2  className="text-center text-3xl">About Section</h2>

</section>

<section  id="work"  className="min-h-screen bg-green-50 dark:bg-green-900 py-20">

<h2  className="text-center text-3xl">Work Section</h2>

</section>

<section  id="skills"  className="min-h-screen bg-yellow-50 dark:bg-yellow-900 py-20">

<h2  className="text-center text-3xl">Skills Section</h2>

</section>

<section  id="contact"  className="min-h-screen bg-red-50 dark:bg-red-900 py-20">

<h2  className="text-center text-3xl">Contact Section</h2>

</section>



{children} {/* Other page content */}

</main>

<Footer />

</AppProviders>

</body>

</html>

);

}
```

### 3. Using Individual Components

You can also import and use Logo and DarkModeToggle separately if needed.

```Tsx
import { Logo, DarkModeToggle } from '@venkatasudha/components';



function MyOtherComponent() {

return (

<div  className="flex items-center justify-between p-4">

<Logo

initials="XY"

textClassName="font-serif italic text-2xl"  //  Apply  custom  font/size  classes

className="mr-4"  //  Add  margin

/>

<DarkModeToggle />

</div>

);

}
```

### 4. Using the useScrollspy Hook

```Tsx
'use client'; // Hook requires client-side execution



import React, { useEffect } from 'react';

import { useScrollspy } from '@venkatasudha/components';



function MyTrackingComponent() {

// IDs *without* the '#' prefix

const sectionIds = ['about', 'work', 'skills', 'contact'];

const activeId = useScrollspy(sectionIds, {

rootMargin: '-30% 0px -70% 0px' // Adjust trigger point

});



useEffect(() => {

if (activeId) {

console.log("Currently active section:", activeId);

// You could potentially update some state or trigger actions here

}

}, [activeId]);



return (

<div  className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-sm">

Active: {activeId || 'None'}

</div>

);

}
```

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode using `tsup` with watch mode.
- `npm run build`: Builds the library for production to the `dist` folder.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run lint:fix`: Lints the codebase and attempts to fix issues automatically.
- `npm run format`: Checks for formatting issues using Prettier.
- `npm run format:fix`: Formats the codebase using Prettier.
- `npm run clean`: Removes the `dist` directory.
- `npm run commit`: Starts Commitizen to help create conventional commit messages.
- `npm run release`: Creates a new release (bumps version, generates changelog, creates git tag).
- `npm run release:patch`: Forces a patch release.
- `npm run release:minor`: Forces a minor release.
- `npm run release:major`: Forces a major release.
- `npm run release:first`: For creating the very first release of the project.

## Component Props

### `<NavBar>`

| Prop                      | Type              | Default               | Description                                                      |
| :------------------------ | :---------------- | :-------------------- | :--------------------------------------------------------------- |
| `menuItems`               | `MenuItem[]`      | **Required**          | Array of menu item objects (`{ name: string, href: string }`).   |
| `logoComponent`           | `React.ReactNode` | `undefined`           | Optional custom Logo component. Ignores `logoProps` if provided. |
| `logoProps`               | `LogoProps`       | `undefined`           | Props for the default `Logo` component (see LogoProps below).    |
| `darkModeToggleComponent` | `React.ReactNode` | `undefined`           | Optional custom DarkModeToggle component.                        |
| `className`               | `string`          | `''`                  | Additional classes for the main `<header>` element.              |
| `containerClassName`      | `string`          | `''`                  | Additional classes for the inner container `div`.                |
| `mobilePopoverClassName`  | `string`          | `''`                  | Additional classes for the mobile menu popover `div`.            |
| `desktopItemClassName`    | `string`          | `''`                  | Additional classes for desktop menu item wrapper `div`s.         |
| `desktopLinkClassName`    | `string`          | `''`                  | Additional classes for desktop menu `<a>` tags.                  |
| `mobileItemClassName`     | `string`          | `''`                  | Additional classes for mobile menu item wrapper `div`s.          |
| `mobileLinkClassName`     | `string`          | `''`                  | Additional classes for mobile menu `<a>` tags.                   |
| `scrollThreshold`         | `number`          | `0`                   | Scroll pixels when background transition starts.                 |
| `scrollTransitionRange`   | `number`          | `100`                 | Scroll pixels over which the background transition occurs.       |
| `enableScrollspy`         | `boolean`         | `true`                | Enable/disable automatic active section highlighting.            |
| `scrollspyRootMargin`     | `string`          | `'-20% 0px -80% 0px'` | `rootMargin` for scrollspy IntersectionObserver.                 |

_(Note: `MenuItem` type is `{ name: string, href: string }`)_
_(Note: `LogoProps` type is defined below)_

### `<Logo>` (Used via `logoProps` in `<NavBar>` or directly)

| Prop            | Type     | Default | Description                                                            |
| :-------------- | :------- | :------ | :--------------------------------------------------------------------- |
| `initials`      | `string` | `'RK'`  | The initials to display.                                               |
| `href`          | `string` | `'/'`   | The URL the logo links to.                                             |
| `className`     | `string` | `''`    | Additional classes for the outer `<a>` tag wrapper.                    |
| `textClassName` | `string` | `''`    | Additional classes for the inner `<span>` tag (for font/text styling). |

### `<DarkModeToggle>`

This component currently takes no props. It relies entirely on the `next-themes` context provider being set up correctly in the consuming application.

### `useScrollspy` Hook

**Arguments:**

1. `itemIds`: `string[]` - Array of element IDs (without '#') to observe.
2. `options?`: `ScrollspyOptions` - Optional IntersectionObserver options (`rootMargin?: string`, `threshold?: number | number[]`).

**Returns:**

- `string | null` - The ID (without '#') of the currently active element, or `null`.

## Releasing and Versioning

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) to automate versioning and changelog generation, following [Semantic Versioning](https://semver.org/) principles. Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (enforced by `commitlint` and `husky`).

### Creating a Release Manually

1.  Ensure your working directory is clean (no uncommitted changes).
2.  Make sure all desired changes have been committed using conventional commit messages (e.g., via `npm run commit`).
3.  Run the appropriate release script:
    - For the very first release of the project:
      ```bash
      npm run release:first
      ```
    - For subsequent releases (this will automatically determine if it's a patch, minor, or major bump based on your commits):
      ```bash
      npm run release
      ```
    - To explicitly force a specific type of release:
      ```bash
      npm run release:patch
      npm run release:minor
      npm run release:major
      ```
4.  This process will:
    - Analyze commits since the last tag.
    - Determine the new version number.
    - Update the `version` in `package.json` and `package-lock.json`.
    - Generate or update the `CHANGELOG.md` file.
    - Commit these changes (`chore(release): vX.Y.Z`).
    - Create a new Git tag (e.g., `vX.Y.Z`).
5.  After the script completes, push the changes and the new tag to GitHub:
    ```bash
    git push --follow-tags origin main # Replace 'main' with your primary branch name if different
    ```
6.  Pushing a new tag (e.g., `v1.2.3`) to GitHub will automatically trigger a GitHub Action to create a corresponding GitHub Release with notes from the `CHANGELOG.md`.
7.  (Optional) If you intend to publish to the npm registry:
    ```bash
    npm publish
    ```

### Changelog

A `CHANGELOG.md` file is automatically generated and updated in the root of the project with each release. It lists the changes, categorized by type (features, fixes, etc.), for each version.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the GitHub repository. <!-- TODO: Replace URL -->

## License

MIT © Your Name <!-- TODO: Replace Name and URL -->
