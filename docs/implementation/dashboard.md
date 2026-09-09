# Dashboard implementation report

Implemented the native Dashboard from `docs/design/prototypes/ritmo_tasks_projects_v2.html`, specifically `#screen-home`. The existing application handlers and SQLite composition remain the data boundary; presentation never imports repositories, infrastructure, or network clients.

## Delivered behavior

- Date/greeting, weekly activity hero, daily streak requirement, summary metrics, three recent task rows, two active project cards, and fixed bottom navigation.
- Initial loading, empty/error/retry states, pull-to-refresh, retained content during refresh failures, task completion/reopen pending and error feedback.
- Completion uses an atomic application command. Acknowledged status is retained if the following read fails; timestamps and summary values are fetched from the data source.
- Working supporting panels for streak/calendar/day events, projects, project/task details, recent-task search, task/project creation, and appearance. Modal dismissal supports Android Back and a visible return action. Creation snapshots submitted fields, prevents repeated submissions, retains failed drafts, and cannot dismiss a newer panel after the form was closed.
- Safe areas, scrollable content, accessible roles/touch areas, font scaling/wrapping, paginated project browsing, and local-midnight/foreground date refresh.

## Files created during the task

Paths below are relative to the repository root. Some setup files were already tracked by the time interrupted work resumed.

- `jest.config.cjs`, `jest.setup.ts`
- `src/application/services.ts`
- `src/application/commands/task/check/{command.ts,handler.ts,handler.test.ts}`
- `src/application/queries/dashboard/get-recent-projects/handler.test.ts`
- `src/infrastructure/runtime/{initialize-crypto.ts,initialize-crypto.test.ts}`
- `src/infrastructure/persistence/sqlite/repositories/read/dashboard.repository.test.ts`
- `src/presentation/providers/{application-provider.tsx,app-providers.tsx}`
- `src/presentation/theme/{tamagui.config.ts,fonts.ts}`
- `src/presentation/screens/dashboard/hooks/{query-keys.ts,dashboard-date.ts,use-dashboard.ts,use-projects.ts}`
- `src/presentation/screens/dashboard/components/{dashboard-primitives.tsx,DashboardCards.tsx,DashboardNavigation.tsx,DashboardState.tsx,DashboardPanels.tsx,BrowsePanels.tsx,CreateItemPanel.tsx,StreakPanel.tsx}`
- `src/presentation/screens/dashboard/__tests__/{fixtures.ts,dashboard.test.tsx,dashboard-date.test.ts,use-task-toggle.test.tsx}`
- This report and `docs/design/reviews/dashboard-{native-light,full-dark,narrow-dark}.png`.

## Files modified

- `index.ts`: removed the stale import of nonexistent `App`; preserves Expo Router entry.
- `package.json`, `package-lock.json`: required server-state, font/native-visual and testing dependencies; `typecheck`, `test`, and `validate` scripts. Existing user dependency/Router changes preserved.
- `src/app/{_layout.tsx,index.tsx}`: thin composition/provider wiring and Dashboard route export.
- `src/presentation/screens/dashboard.tsx`: replaces the empty web-only placeholder with the native screen.
- `src/application/commands/index.ts`, `src/infrastructure/composition/app.composition.ts`: compose/export the new command and native UUID initialization.
- `src/application/queries/dashboard/get-recent-projects/{handler.ts,model.ts,query.ts,response.ts}`: propagate stored icon/color and optional active-only filtering.
- `src/application/queries/dashboard/get-recent-tasks/model.ts`: expose task/project IDs and completion timestamp.
- `src/application/queries/dashboard/repositories/dashboard.repository.ts`
- `src/infrastructure/persistence/sqlite/{records/read/dashboard.record.ts,repositories/read/dashboard.repository.ts}`: project projection/filtering and actionable recent-task projection.

## Components and application capabilities

Reused Tamagui v2 `XStack`, `YStack`, `Text`, `Button`, `Input`, `Spinner`, `styled`, themes and the installed config preset. No reusable project UI/configuration existed at initial inspection. Added one Tamagui configuration using the exact prototype semantic colors and bundled Inter/Manrope font faces; only used font weights are imported.

New composite components represent actual prototype sections: `WeeklyHero`, `FocusCard`, `SummaryMetrics`, `TaskRows`, `ProjectCard`, `DashboardHeader`, `BottomNav`, shared card/text/progress/section primitives, state feedback, and supporting panels. Expo `LinearGradient` and `BlurView` reproduce gradients and translucent navigation. No additional component library or state manager was added.

Reused application handlers: `GetDashboardSummary`, `GetWeeklyCount`, `GetRecentTasks`, `GetRecentProjects`, `GetCurrentStreak`, `GetStreakSummary`, `GetStreakHistorical`, `GetCompletionEventsByDay`, `GetProjects`, `GetProjectBasicInfo`, `GetProjectDetails`, `GetTasksByProject`, `GetTaskInfo`, `ReopenTask`, `CreateTask`, and `CreateProject` (all existing `*Handler` classes).

New use case: `CheckTaskHandler`. It starts a to-do task when necessary, completes it, and appends its completion event in the existing unit of work. The original `CompleteTaskHandler` and domain transition rules are unchanged.

`ApplicationServices` exposes only existing handler execution signatures. Concrete repositories are still constructed exclusively in the outer composition layer. Domain files are unchanged and framework-agnostic. Native UUID support is an infrastructure runtime adapter, not an Expo import in domain.

## TanStack Query and cache behavior

Queries and stable keys:

| Read | Key |
| --- | --- |
| Dashboard summary | `['dashboard', 'summary']` |
| Weekly finished-task counts | `['dashboard', 'weekly', localDay]` |
| Recent tasks | `['dashboard', 'tasks', { limit }]` |
| Active recent projects | `['dashboard', 'projects', { limit, activeOnly: true }]` |
| Current streak | `['streak', 'current', localDay]` |
| Streak summary | `['streak', 'summary']` |
| Date-range intensity | `['streak', 'history', fromDay, toDay]` |
| Completion events | `['streak', 'events', day]` |
| Paginated projects | `['projects', 'list']` (page parameter) |
| Project info/details/tasks | `['projects', id, 'info' | 'details' | 'tasks']` |
| Task details | `['tasks', id, 'details']` |
| Composition startup | `['application', 'initialize']` |

Mutations invoke `checkTask`, `reopenTask`, `createTask`, and `createProject` application capabilities. Completion/reopen update acknowledged status in existing task caches, cancel older task reads, then refresh affected task/count/project-progress queries. Completion additionally invalidates current/summary streak data and only event days/history ranges overlapping the write's start/end local dates. Reopening preserves immutable earned streak history. Unrelated tasks, project details, past event ranges, and startup cache remain untouched. Creation invalidates only affected task/project lists, project tasks, and Dashboard counts.

Query retries are bounded; writes are never automatically retried. The current local persistence composition uses `networkMode: 'always'`, so offline status does not block SQLite operations. An HTTP composition would need its own connectivity configuration.

## Tests and validation

39 tests pass across 7 Jest suites, using React Native Testing Library for screen/hooks and real TanStack Query/Tamagui providers. Presentation tests stub application capabilities and make no real backend/HTTP calls.

Coverage includes loading/data/streak/summary/tasks/projects, empty state, retry, pending/double-press handling, failed writes, authoritative refetch, acknowledged completion after read failure, reopen/history preservation, streak navigation, creation/project selection/priority, failed draft retry, late dismissed writes, cache scope, midnight/year/leap-day boundaries, atomic task transitions, native UUID setup, and changed read projections.

Commands executed:

- `npm run typecheck` — passed.
- `npm run lint` — passed; existing Node module-type warning in `eslint.config.js` remains nonblocking.
- `npm test -- --runInBand` — 39/39 passed, 7/7 suites.
- `npm run validate` — passed.
- `git diff --check` — passed.
- `npx expo install --check` — installed versions match Expo's local SDK map; the command noted offline verification limits.
- `npx expo export --platform ios --platform android --output-dir /private/tmp/ritmo-final-native-export` — both release bundles produced successfully.
- Expo Go on an iPhone 17 Pro simulator — actual SQLite startup and populated/empty Dashboard rendered.
- Chrome at 372px and 320px widths — actual presentation components with temporary application-boundary fixtures; dark/light and complete section review.

## Visual review and necessary differences

Reviewed section order, typography, padding, radii, gradients, progress geometry, task/project rows, alignment, shadows, and fixed navigation against the HTML/CSS. Corrected duplicated safe-area padding, missing navigation blur, web task alignment, and web blur stacking. Native status/safe areas replace the prototype's fictional phone frame/island/status row. Text may wrap to two lines for scaling and narrow devices. Android versions before SDK 31 receive the blur primitive's translucent fallback for performance.

Evidence: [native light](../design/reviews/dashboard-native-light.png), [all sections, dark](../design/reviews/dashboard-full-dark.png), [narrow dark](../design/reviews/dashboard-narrow-dark.png). The blue gear in the native image belongs to Expo Go. Visual fixture records were confined to the previously empty simulator database and removed after review; none are seeded into application code.

The repository has no weekly goals, scheduled/due tasks, estimates, project-health metrics, personal profile, or yesterday comparison contract. Consequently the layout uses real weekly active days, the one-task daily streak requirement, actual pending/completed counts, current task statuses, and a generic greeting/avatar. It does not display fabricated prototype values. Today shows recorded completions; search explicitly covers the 30 most recent actionable tasks. Supporting destinations use functional modals because no other feature routes existed.

## Remaining integration limits

- No remote backend API, HTTP repository, authentication contract, or endpoint configuration exists in this repository. The screen is wired to existing SQLite-backed application use cases; remote backend integration requires an actual contract/adapter.
- The existing SQLite web adapter needs WASM/cross-origin-isolation setup and web transaction support. Browser visual checks intentionally inject only application capabilities, without claiming the existing full web persistence bootstrap is ready.
- iOS rendering was exercised on a simulator; Android release export and native component tests passed, but no Android emulator/device visual run was performed.
- Application validation still limits titles to 24 characters, descriptions to 100, categories to 10, and projects to 20 tasks. Those existing business rules were preserved.
- Broader feature screens, persisted appearance preferences, remote connectivity, and richer scheduling/profile/goal contracts remain outside this Dashboard implementation.

Expo references consulted before implementation: [SDK v56](https://docs.expo.dev/versions/v56.0.0/), [SQLite](https://docs.expo.dev/versions/v56.0.0/sdk/sqlite/), [Font](https://docs.expo.dev/versions/v56.0.0/sdk/font/), [LinearGradient](https://docs.expo.dev/versions/v56.0.0/sdk/linear-gradient/), [BlurView](https://docs.expo.dev/versions/v56.0.0/sdk/blur-view/).
