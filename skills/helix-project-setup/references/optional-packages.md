# Optional `@cdx` packages

Install only what the project needs. Peer dependencies must be installed
explicitly.

| Package                     | Purpose                                            | Peer dependencies                                                                           |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `@cdx/colors`               | Color palette and utility functions                | —                                                                                           |
| `@cdx/ngx-session-activity` | Session activity / idle handling                   | `@ng-idle/core`, `@ng-idle/keepalive`, `@ngx-translate/core`                                |
| `@cdx/ngx-translations`     | Translation service                                | `@ngx-translate/core`                                                                       |
| `@cdx/ngx-analytics`        | Analytics service                                  | `@snowplow/browser-tracker`                                                                 |
| `@cdx/ngx-authentication`   | Authentication service                             | `@angular/material`, `@angular/router`, `@auth0/angular-jwt`, `@cdx/theme-angular-material` |
| `@cdx/theme-ag-grid`        | AG Grid theme                                      | `ag-grid-community`                                                                         |
| `@cdx/theme-highcharts`     | Highcharts theme                                   | `highcharts`                                                                                |
| `@cdx/theme-snackbar`       | Snackbar theme                                     | —                                                                                           |
| `@cdx/theme-xng-breadcrumb` | Breadcrumb theme                                   | `xng-breadcrumb`                                                                            |
| `@cdx/clarivate-font`       | Clarivate icon/brand font (also available via CDN) | —                                                                                           |

Version ranges change per release — read the peer ranges from the installed
package's `package.json` rather than pinning from memory. The canonical,
always-current list is the Quick Start page of the docs website.
