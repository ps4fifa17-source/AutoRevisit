# AutoRevisit Phase 1 Clean Safe Package

Built against your stable project zip.

This package only replaces/adds dashboard foundation files. It does NOT touch:
- login
- signup
- onboarding
- setup-pending
- public customer pages `/app/p`
- Supabase helpers
- globals.css
- package.json
- env files

## Delete first if they exist

```text
app/dashboard/import-stock
app/api/details-sync
app/api/stock-sync
app/api/dealership
lib/details-sync
lib/stock-sync
lib/display
```

## Replace/add these from the package

```text
app/dashboard/page.js
app/dashboard/vehicles/page.js
app/dashboard/vehicles/new/page.js
app/dashboard/pages/new/page.js
app/dashboard/live-pages/page.js
app/dashboard/leads/page.js
app/dashboard/analytics/page.js
app/dashboard/settings/page.js
app/dashboard/upgrade/page.js
components/DashboardNav.js
components/WorkspaceTour.js
components/LockedFeature.js
components/CopyLinkButton.js
lib/brand.js
lib/plans.js
supabase/autorevisit-phase-1-safe.sql
```

## Run SQL

Run `supabase/autorevisit-phase-1-safe.sql` in Supabase SQL Editor.

## Restart

```bash
rm -rf .next
npm run dev
```

## Routes included

- `/dashboard`
- `/dashboard/vehicles`
- `/dashboard/vehicles/new`
- `/dashboard/pages/new`
- `/dashboard/live-pages`
- `/dashboard/leads`
- `/dashboard/analytics`
- `/dashboard/settings`
- `/dashboard/upgrade`
