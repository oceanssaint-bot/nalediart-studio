# Booking store

The site works without this. Unconfigured, it collects a booking request and
hands it to WhatsApp — nothing is held. With Supabase wired up, a slot is
genuinely reserved the moment someone takes it, for everyone.

## Setup

1. **Create the tables.** Supabase Dashboard → SQL Editor → New query → paste
   all of `schema.sql` → Run. Safe to re-run.

2. **Copy the two public values.** Project Settings → API:
   - Project URL, e.g. `https://abcdefgh.supabase.co`
   - `anon` `public` key

3. **Paste them into `site/app.html`**, in the `window.NALEDI_SUPABASE` block
   near the bottom, then `node site/build.js` and copy `site/index.html` plus
   `site/assets/` into `docs/`.

The anon key is a *publishable* key. It belongs in the page. Row Level
Security is what protects the data — never paste the `service_role` key here,
that one is a real secret.

## What customers can and cannot do

| | anon (the public site) |
|---|---|
| Create a booking | yes |
| Read anyone's name, phone, email, notes | **no** |
| Read which time ranges are taken | yes, via the `availability` view |
| Read closed dates | yes |
| Change or delete a booking | **no** |

## Double booking

`bookings_no_overlap` is a Postgres exclusion constraint on overlapping time
ranges. It is enforced by the database, not by the page, so two people tapping
the same slot in the same instant cannot both succeed — the second INSERT is
rejected with `23P01` and the page tells them to pick again.

## Seeing the bookings

With the anon key the page cannot read customer details, and that is
deliberate. Naledi sees bookings in the Supabase dashboard → Table Editor →
`bookings`. Each confirmed booking also offers the customer a WhatsApp
message to her, so nothing depends on her checking a dashboard.

A password-gated admin view on the site is a separate, straightforward
addition if she wants one.
