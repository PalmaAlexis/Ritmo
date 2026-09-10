# Screen separation

The existing presentation has been split into independently addressable Expo Router routes. This refactor preserves the implemented UI, application handlers, query keys, colors, typography, spacing, forms, and state feedback. It does not implement additional prototype designs.

## Route map

Route files in `src/app` only re-export screen entry points. Providers and the application composition remain in the root layout.

| Prototype view | Screen in `src/presentation/screens` | Route |
| --- | --- | --- |
| `home` | `dashboard.tsx` | `/` |
| `projects` | `projects.tsx` | `/projects` |
| `project` | `project-detail.tsx` | `/projects/[projectId]` |
| `task` | `task-detail.tsx` | `/projects/[projectId]/tasks/[taskId]` |
| `today` | `today.tsx` | `/today` |
| `insights` | `insights.tsx` | `/insights` |
| `streak` | `streak.tsx` | `/streak` |
| `profile` | `profile.tsx` | `/profile` |
| `new-project` | `create-project.tsx` | `/create-project` |
| `new-task` | `create-task.tsx` | `/create-task`, optional `projectId` query parameter |
| Search overlay | `search.tsx` | `/search` |

`empty` remains the empty state of Projects; `streak-empty` remains the empty state of Streak. Neither has a separate route. Search is an auxiliary modal route so its existing content works independently of Dashboard.

## Navigation and ownership

- `src/presentation/navigation/app-navigator.tsx` configures the native stack. Secondary routes retain the previous full-screen modal presentation and custom heading/Close button. The existing bottom navigation remains on Dashboard; this change does not introduce a new tab layout or alter its design.
- `use-screen-navigation.ts` maps typed destinations to Router paths. Details pass IDs in route parameters. Native/browser Back follows navigation history; Close and successful creation return to Home, including when the app starts at a direct link without history.
- `src/presentation/components/ScreenScaffold.tsx` retains the previous panel shell. Each modal owns a `SafeAreaProvider` so native headers stay below the device status area. Virtualized lists own their scrolling; they are not nested inside another `ScrollView`.
- Feature content lives in `screens/<feature>/components`. Shared UI, task rows, creation form, and activity content live in `presentation/components`. Shared query keys, date handling, project pagination, and task mutations live in `presentation/hooks`. Dashboard-specific queries remain in `screens/dashboard/hooks`.
- The former `DashboardPanels`, `BrowsePanels`, and `StreakPanel` aggregate files have been replaced by these screen/component boundaries. Dashboard no longer holds a local destination state or renders other screens.
- Creation retains submitted-field snapshots, pending guards, failure drafts, and cache invalidation. A completed save only closes its currently focused form. Switching from task creation to project creation replaces the form route, preserving the previous draft-reset behavior.
- Creating a task from an empty project carries that project's ID. The picker resolves it through the existing project-info query when it is outside the first page, and requires an available, active project before submitting. Changing route project parameters starts a fresh form.

## Preserved scope

Insights has its own route and entry point but continues using the same activity content as Streak, matching the app before this refactor. Profile retains its appearance control; Today retains its current daily activity content. Additional charts, profile settings, project Board/Info, integrations, and scheduling from the HTML remain outside this refactor.

No dependencies or application/domain/persistence contracts were added by the screen separation. Pre-existing local changes in those layers are preserved.

## Verification

- `npm run validate`: TypeScript, ESLint, and 54 tests across 8 suites pass. The existing Node module-type notice for `eslint.config.js` is nonblocking.
- The existing 13 Dashboard tests now use the real Router and route files. Fifteen additional navigation cases exercise main destinations, project/task history and completion, search, direct links, retries, creation, project preselection, late saves on unfocused forms, and empty states.
- Native release exports for iOS and Android succeed with Expo SDK 56.
- A source comparison against the pre-refactor components confirmed unchanged rendering functions for dashboard cards/navigation, task rows/details, project list, search, profile, and activity content.
- Expo Go on an iPhone 17 Pro simulator was used to verify Projects and the modal safe-area fix. Native screenshots are a smoke check; they do not replace exhaustive device testing. Android was validated through export and component/navigation tests, without an emulator visual run.

Implementation references: [Expo Router for SDK 56](https://docs.expo.dev/versions/v56.0.0/sdk/router/), [native stack](https://docs.expo.dev/versions/v56.0.0/sdk/router/stack/), and [safe-area context](https://docs.expo.dev/versions/v56.0.0/sdk/safe-area-context/).
