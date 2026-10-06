# Pattern: App shell

- **id**: app-shell
- **status**: beta
- **use when**: The top-level layout of a product. Every routed page renders
  inside it.
- **avoid when**: A single embedded widget or a micro-frontend fragment that the
  host already wraps in its own chrome.
- **components**: HelixHeaderComponent, HelixHeaderProductNameOrLogoComponent,
  HelixHeaderGlobalComponent, HelixFooterComponent, matButton, matIconButton,
  MatMenuModule, RouterOutlet
- **tokens**: breakpoint-md, spacing-3, spacing-4

## Rules

- Assemble the shell once in a layout component with a <router-outlet/>; every
  page renders inside it. Do not repeat the header/footer per page.
- Drive per-page chrome from typed route data (a ShellRouteData interface: which
  nav, whether the footer shows), read from the ActivatedRoute, not from flags
  passed around components.
- Collapse the primary nav into a menu below the md breakpoint, using the Helix
  breakpoint queries (HELIX_MEDIA.ltMd with BreakpointObserver), not an ad-hoc
  width or an innerWidth check.
- Primary navigation is real links (a[routerLink]) with routerLinkActive, not
  buttons or tabs used for navigation.
- Apply the Helix theme classes (mat-typography helix-theme-material) on <body>,
  so overlays (menus, dialogs) inherit the theme. In a micro-frontend, document
  what the host must provide.
- Lazy-load every feature route with loadComponent / loadChildren.

## Anti-patterns (do not do)

- Rendering the header and footer inside each page component.
- Reading window.innerWidth (or a hardcoded px) to decide the responsive layout.
- Using buttons or mat-tabs as primary navigation instead of links.
- Passing showFooter / showNav down through component inputs instead of route
  data.

## Guidance

## Overview

The app shell is the chrome every page sits in: the Helix header (Clarivate
mark, product name, primary navigation, global actions), the routed content
area, and the footer. Build it **once** in a layout component and let the router
fill the content. an app's route-data-driven `main-layout` is the source
for this pattern; an app's nav that simply vanished below 960px is the
anti-pattern it fixes.

## Route-data-driven chrome

Per-page differences (does this page show the footer? which nav is active?) are
declared on the route, typed, and read from the `ActivatedRoute` — not drilled
through component inputs.

```ts
export interface ShellRouteData {
  showFooter?: boolean; // default true
  showNav?: boolean; // default true
}

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'alerts',
        loadComponent: () =>
          import('./alerts/alerts').then((m) => m.AlertsPage),
        data: { showFooter: true } satisfies ShellRouteData,
      },
      {
        path: 'assistant',
        loadComponent: () =>
          import('./assistant/assistant').then((m) => m.AssistantPage),
        data: { showFooter: false, showNav: false } satisfies ShellRouteData,
      },
    ],
  },
];
```

The `Layout` reads the active child's data as a signal and renders the chrome
around `<router-outlet/>`.

## Responsive navigation

The primary nav shows inline at `md` and up, and collapses into a menu button
below `md`. Use the Helix breakpoint queries so the shell and the rest of the
app agree on where that happens:

```ts
import { BreakpointObserver } from '@angular/cdk/layout';
import { HELIX_MEDIA } from '@cdx/theme-angular-material';

private readonly breakpoints = inject(BreakpointObserver);
readonly isCompact = toSignal(
  this.breakpoints.observe(HELIX_MEDIA.ltMd).pipe(map((s) => s.matches)),
  { initialValue: false },
);
```

## Do

- Assemble the shell once; pages render in the outlet.
- Declare per-page chrome as typed route `data`.
- Collapse the nav with `HELIX_MEDIA`, not `innerWidth`.
- Make nav items real `a[routerLink]` with `routerLinkActive`.
- Apply the theme classes on `<body>` so overlays inherit it.

## Don't

- Repeat the header/footer in each page.
- Decide layout from `window.innerWidth` or a hardcoded width.
- Use buttons or tabs as primary navigation.
- Drill `showFooter`/`showNav` through component inputs.
