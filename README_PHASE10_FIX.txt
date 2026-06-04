AutoRevisit Phase 10 Fix Package

Replace the matching files in your project with the files in this package.
Then run the SQL file in Supabase:
  supabase/autorevisit-phase-10-fix.sql

Then restart locally:
  rm -rf .next
  npm run dev

What this fixes:
- Keeps Who For, Focus/Push, Design Style, Finance and AI generation intact.
- Removes customer-facing internal labels like Finance Focus / Family Fit / First Car Fit from public page headers.
- Changes Create Page wording from "What is stopping them buying?" to "What should this page focus on?".
- Keeps First Car as a focus/push angle, not a Who For audience option.
- Renames Dealer Notes to "Shape the page in your own words" with better placeholders.
- Removes finance fields from Enquiry Follow Up creation so enquiry pages stay simple.
- Allows Thank You pages to be created without selecting a vehicle.
- Makes the reassurance section sales-focused rather than a buyer-guide question list.
- Stops AI/normalisation returning customer question lists to public pages.
- Strengthens AI rules so it sells this specific vehicle to this specific customer, using dealer context heavily and only verified facts.
- Makes page style previews less like internal categories and more customer-facing.
- Filters public customer pages to status='live' and deleted_at is null.
- Adds a Supabase policy/status migration to standardise customer_pages on live pages.

Files replaced:
- app/dashboard/pages/new/page.js
- app/p/[dealerSlug]/[pageSlug]/page.js
- app/api/ai/page-copy/route.js
- lib/aiPageBrain.js
- lib/dealerNotesCopy.js
- components/PageStylePreview.js
- components/public-pages/DealerMiniHeader.js
- components/public-pages/SalesCopySections.js
- components/public-pages/modes/*.js

Important:
Make sure you are on a Git branch before replacing files. If anything looks wrong:
  git reset --hard HEAD
