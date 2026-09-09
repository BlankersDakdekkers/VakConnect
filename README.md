# VakConnect

VakConnect is een Nederlandse lead marketplace in opbouw die consumenten koppelt aan geschikte lokale vakmensen. Deze repository bevat de eerste schaalbare MVP-basis met publieke aanvraagflow, protected dashboards, Supabase Auth, private file uploads en Row Level Security.

## Stack

- Next.js App Router
- TypeScript (strict)
- Tailwind CSS v4
- Supabase
  - PostgreSQL database
  - Auth
  - Storage
- Zod validatie
- Vercel-compatible deployment

## Wat is in deze fase gebouwd

- Professionele homepage met SEO-basis
- Multi-step consumentenfunnel op `/aanvraag`
- Server-side leadopslag via `/api/leads`
- Private afbeeldingopslag in Supabase Storage
- Publieke bedankpagina met niet-herleidbare leadreferentie
- Admin-dashboard voor leads, vakmannen en diensten
- Vakman-dashboard voor eigen toegewezen aanvragen
- Handmatige matchingmodule op basis van dienst + postcodeprefix
- Supabase migratie met RLS-beleid en storage-bucket

## Projectstructuur

```
app/
  (public)/
  (admin)/admin/
  (professional)/vakman/
  api/leads/
  login/
components/
lib/
  auth/
  leads/
  matching/
  professionals/
  services/
  storage/
  supabase/
  validation/
docs/
supabase/migrations/
tests/
types/
```

## Lokale installatie

1. Installeer dependencies:

   ```bash
   npm install
   ```

2. Kopieer `.env.example` naar `.env.local` en vul de waarden in.

3. Start de development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Environment variables

Gebruik minimaal deze variabelen:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Betekenis

- `NEXT_PUBLIC_SITE_URL`: canonical URL / metadata base
- `NEXT_PUBLIC_SUPABASE_URL`: publieke Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: client-side en SSR public key
- `SUPABASE_SERVICE_ROLE_KEY`: uitsluitend server-side voor adminmutaties en publieke leadopslag

Plaats nooit echte secrets in de repository.

## Supabase setup

1. Maak een Supabase project aan.
2. Zet in **Authentication > Providers** minimaal email/password aan.
3. Voer de migratie uit uit `supabase/migrations/20260909124500_initial_vakconnect_schema.sql`.
4. Controleer in **Storage** dat de private bucket `lead-images` bestaat.
5. Voeg indien nodig handmatig admingebruikers toe in Supabase Auth en zet hun `app_metadata.role` op `admin`.

### Rollen

- `admin`: toegang tot `/admin/*`
- `professional`: toegang tot `/vakman/*`

Professionals worden via het admin-dashboard aangemaakt. Daarbij wordt een Supabase Auth gebruiker gemaakt en gekoppeld aan `professionals.auth_user_id`.

## Database migrations

De eerste migratie bevat:

- tabellen voor leads, vakmannen, diensten, assignments en afbeeldingen
- enums, constraints en indexen
- triggers voor `updated_at`
- generator voor `VC-XXXXXXXX` leadreferenties
- RLS policies voor publiek, admin en professional
- private Supabase Storage bucket voor leadafbeeldingen
- initiële seeddata voor diensten

## Supabase Storage setup

Leadafbeeldingen worden in de private bucket `lead-images` opgeslagen. Uploads lopen via server-side code. Bestandsnamen worden niet overgenomen van de gebruiker, maar veilig gegenereerd met UUID's. Dashboards gebruiken signed URLs in plaats van publieke buckettoegang.

## Auth setup

- Login loopt via `/login`
- Rolcontrole gebeurt server-side via Supabase sessies en `app_metadata.role`
- `middleware.ts` ververst de sessiecookie
- Beschermde routes vertrouwen niet op client-side checks

## Development commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Deployment naar Vercel

1. Voeg alle environment variables toe in Vercel.
2. Koppel de repository aan Vercel.
3. Zorg dat de Supabase migratie is toegepast voordat je productiegebruikers toelaat.
4. Controleer na deployment de protected routes, loginflow en leadopslag.

## Testaccounts

Deze repository bevat geen echte testaccounts. Maak lokaal in Supabase zelf minimaal:

- één adminuser met `app_metadata.role = admin`
- één of meer professionals via het admin-dashboard of rechtstreeks in Supabase

## Security aandachtspunten

- Service role key blijft server-side en mag nooit in client bundles terechtkomen.
- Leadopslag, statuswijzigingen en toewijzingen gebeuren server-side.
- RLS schermt persoonsgegevens af voor publiek en andere professionals.
- Uploads zijn beperkt op type, grootte en aantal.
- De applicatie toont geen ruwe database-errors aan bezoekers.
- Plaats geen persoonsgegevens in analytics of logs.

## Aanvullende documentatie

- `docs/ARCHITECTURE.md`
