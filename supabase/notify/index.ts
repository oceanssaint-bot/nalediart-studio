// Supabase Edge Function: email Naledi the moment a booking lands.
//
// Deploy:
//   supabase functions deploy notify --no-verify-jwt
//   supabase secrets set RESEND_API_KEY=re_xxx STUDIO_EMAIL=naledi@nalediart.com
//
// Then, in the Supabase dashboard, Database > Webhooks > Create:
//   table       public.bookings
//   events      Insert, Update
//   type        Supabase Edge Function
//   function    notify
//
// The webhook posts { type, table, record, old_record }. Nothing here trusts
// anything in the record beyond printing it: it is escaped before it reaches
// the email body, because a booking's name and notes are typed by the public.

const RESEND = 'https://api.resend.com/emails';
const SAST = 'Africa/Johannesburg';

// Resend needs a verified sender. Until the studio's domain is verified,
// onboarding@resend.dev works and lands in the inbox.
const FROM = Deno.env.get('STUDIO_FROM') ?? 'Naledi Art Studio <onboarding@resend.dev>';

function esc(v: unknown): string {
  return String(v ?? '').replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
}

function when(starts: string, ends: string): string {
  const f = (iso: string, opts: Intl.DateTimeFormatOptions) =>
    new Date(iso).toLocaleString('en-ZA', { timeZone: SAST, ...opts });
  return f(starts, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
    ', ' + f(starts, { hour: '2-digit', minute: '2-digit', hour12: false }) +
    ' to ' + f(ends, { hour: '2-digit', minute: '2-digit', hour12: false });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('POST only', { status: 405 });

  const key = Deno.env.get('RESEND_API_KEY');
  const to = Deno.env.get('STUDIO_EMAIL');
  if (!key || !to) return new Response('not configured', { status: 500 });

  let body: any;
  try { body = await req.json(); } catch { return new Response('bad json', { status: 400 }); }

  const b = body?.record;
  if (!b) return new Response('no record', { status: 200 });

  // An update only matters when it is the confirmation or a displacement.
  const old = body?.old_record;
  const isNew = body?.type === 'INSERT';
  const becameConfirmed = old && old.status !== 'confirmed' && b.status === 'confirmed';
  const becameDisplaced = old && old.status !== 'displaced' && b.status === 'displaced';
  if (!isNew && !becameConfirmed && !becameDisplaced) return new Response('ignored', { status: 200 });

  const subject = becameDisplaced
    ? 'Moved off a date: ' + b.name + ', ' + b.ref
    : becameConfirmed
      ? 'Confirmed: ' + b.name + ', ' + b.ref
      : (b.took_over ? 'NEW BOOKING, and it took a busy day: ' : 'New booking: ') + b.name + ', ' + b.ref;

  const row = (k: string, v: unknown) =>
    v ? `<tr><td style="padding:7px 16px 7px 0;color:#9A8FA3;font:14px system-ui">${esc(k)}</td>` +
        `<td style="padding:7px 0;color:#241C2C;font:14px system-ui">${esc(v)}</td></tr>` : '';

  const html =
    `<div style="max-width:560px;margin:0 auto;font:15px/1.6 system-ui;color:#241C2C">` +
    `<p style="font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#8A6010;margin:0 0 6px">Naledi Art Studio</p>` +
    `<h1 style="font-size:24px;font-weight:400;margin:0 0 18px">${esc(subject)}</h1>` +
    (b.took_over
      ? `<p style="background:#FBEDEC;border:1px solid #B4453F;border-radius:10px;padding:12px 14px;color:#8C2F2A;margin:0 0 18px">` +
        `This day booking took a date that already had bookings on it. Those clients have been moved aside and are waiting on a call from you.</p>`
      : '') +
    `<table style="border-collapse:collapse">` +
      row('Service', b.service_name) +
      row('When', when(b.starts_at, b.ends_at)) +
      row('Amount', b.amount) +
      row('Name', b.name) +
      row('Phone', b.phone) +
      row('Email', b.email) +
      row('Notes', b.notes) +
      row('Reference', b.ref) +
      row('Status', b.status) +
      row('Wants studio news', b.marketing_opt_in ? 'Yes' : 'No') +
    `</table>` +
    `<p style="margin:22px 0 0"><a href="https://oceanssaint-bot.github.io/nalediart-studio/studio.html" ` +
    `style="color:#8A6010">Open the dashboard</a></p></div>`;

  const r = await fetch(RESEND, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });

  // A failed email must not fail the booking, so this always answers 200 and
  // says what happened in the body for the function logs.
  return new Response(r.ok ? 'sent' : 'send failed: ' + (await r.text()), { status: 200 });
});
