AutoRevisit Phase 10 Final Fix Package

Replace these files in your project with the matching paths in this package:

1. app/dashboard/pages/new/page.js
2. app/p/[dealerSlug]/[pageSlug]/page.js
3. app/t/[dealerSlug]/[thankSlug]/page.js
4. components/PageStylePreview.js
5. components/public-pages/DealerMiniHeader.js
6. lib/planAccess.js

What this fixes:
- Create Page is simplified without losing AI context.
- Buying For and Focus are now dropdowns instead of large card grids.
- Finance is hidden behind Yes/No.
- Shape the page in your own words is hidden behind Yes/No.
- Style previews are collapsed behind Change Style.
- Style preview cards are shorter and no longer dominate the page.
- Public customer WhatsApp buttons now generate customer-to-dealer messages.
- Dealer-to-customer WhatsApp message still works on the Ready To Send screen.
- Premium package removes AutoRevisit watermark on public pages.
- Starter/Professional keep watermark.
- DealerMiniHeader no longer exposes internal labels like Finance Focus / First Car Fit.
- Thank-you page WhatsApp now uses dealer.whatsapp first and sends a customer-style message.
- Create button no longer requires a vehicle for Thank You pages.

After replacing:
rm -rf .next
npm run dev

Then test:
1. Create Page > Customer Revisit
2. Buying for dropdown defaults to Themselves
3. Focus dropdown defaults to Reassurance
4. Finance only appears after Yes
5. AI context only appears after Yes
6. Style previews only appear after Change Style
7. Public page WhatsApp message sounds like customer-to-dealer
8. Premium public pages do not show Powered by AutoRevisit
