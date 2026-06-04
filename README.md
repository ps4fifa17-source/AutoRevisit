# Signal Complete Clean Build

This is the clean rebuild of the Signal managed SaaS foundation.

It includes:
- Email + password signup/login
- No magic links
- Fixed `@/` alias support
- Supabase backend
- Multi-dealer database structure
- RLS policies
- Managed dealer status: pending / active / paused
- Setup pending page
- Admin activation page
- Dealer dashboard
- Vehicle stock system
- Customer page generator
- Multi-car customer pages
- Public customer page route
- WhatsApp send button
- Mobile-first dashboard foundation
- Premium dark/light dashboard styling
- Customer page design inspired by the mobile concept you liked

## Setup

1. Open this folder in VS Code

2. Install packages:

```bash
npm install
```

3. Create `.env.local` in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOURPROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Important: Supabase URL must NOT include `/rest/v1`.

4. In Supabase SQL Editor:
Open `supabase/schema-and-policies.sql`, copy the contents, paste into Supabase SQL Editor, run it.

5. In Supabase:
Authentication → Providers → Email:
- Email provider ON
- Confirm email OFF for local testing

6. Run:

```bash
npm run dev
```

7. Open:

```text
http://localhost:3000
```

## Admin

To access `/admin`, manually set your profile row role to:

```text
admin
```

in the Supabase `profiles` table.

## Dealer flow

1. Dealer signs up with email/password
2. Dealer completes onboarding
3. Dealer sees setup pending page
4. Admin activates dealer
5. Dealer gets dashboard access
6. Dealer adds stock
7. Dealer creates customer page
8. Dealer sends link by WhatsApp
