# Booking emails, and invoices

Two separate things. The invoice works now, with nothing to set up. The
email needs about ten minutes and one free account.

---

## 1. Invoices, working already

Open the dashboard, find a confirmed booking, press **Invoice**. It builds
an invoice from that booking and **Print or save as PDF** turns it into a
file. The invoice number is `INV-` plus the booking reference, so the
number the client already has is the number on the invoice, and there is no
second counter that can drift out of step.

### The one thing to fill in

At the top of the script in `site/studio.html` there is a block called
`BILLING`. Fill it in once:

```js
var BILLING = {
  name:      'Naledi Art Studio',
  address:   '39 Station Drive, Greyville, Durban, 4001',
  phone:     '065 838 1532',
  email:     'naledi@nalediart.com',
  reg:       '',                 // company registration number, if any
  vatNumber: '',                 // leave empty if not VAT registered
  bank:      '',                 // 'FNB · Cheque · 1234567890 · Branch 250655'
  terms:     'Payable on booking. The date is held 48 hours pending deposit.'
};
```

Anything left empty is left off the invoice rather than printed as a
placeholder, so a half-filled block cannot put "your bank here" in front of
a client.

**Leave `vatNumber` empty unless the studio is actually registered for
VAT.** An invoice may not show VAT that is not being charged. While it is
empty the invoice says so in as many words.

### Getting them into Zoho Books

**Export for Zoho** at the top right of the list downloads a CSV of the
confirmed bookings in whatever tab is open, using Zoho Books' own column
names. In Zoho: **Sales › Invoices › Import Invoices**, pick the file,
accept the mapping.

The booking reference travels in both the invoice number and Zoho's
Reference Number field, so a booking can be found from either side.

### Pushing invoices into Zoho automatically

Possible, and a bigger job: Zoho Books' API needs an OAuth client, a
refresh token, and the organisation id, then a function that creates the
invoice when a booking is confirmed. Worth doing once the volume makes the
CSV annoying. Say the word.

---

## 2. Email on every booking

### What you need

A **Resend** account, free, 3,000 emails a month:
<https://resend.com>. Any provider with an HTTP API works; Resend is the
shortest path. Take the API key from the dashboard.

### Steps

1. **Deploy the function.** From the project folder:

   ```bash
   supabase functions deploy notify --no-verify-jwt
   ```

2. **Give it the key and the address:**

   ```bash
   supabase secrets set RESEND_API_KEY=re_your_key_here
   supabase secrets set STUDIO_EMAIL=naledi@nalediart.com
   ```

3. **Point the database at it.** In the Supabase dashboard:
   **Database › Webhooks › Create a new hook**

   | | |
   |---|---|
   | Table | `public.bookings` |
   | Events | Insert, Update |
   | Type | Supabase Edge Function |
   | Function | `notify` |

4. **Test it.** Make a booking on the site. The email should arrive within
   a few seconds. If it does not, **Edge Functions › notify › Logs** says
   why, and the function always answers 200 so a mail problem can never
   stop a booking going through.

### What arrives

- **A new booking**, with service, when, amount, the client's details,
  their notes, the reference, and whether they asked for studio news.
- **A day booking that took a busy date**, with a red panel saying those
  clients are waiting on a call.
- **A confirmation**, when a pending request is confirmed.
- **A displacement**, when a booking is moved off its date.

Nothing else. An ordinary edit does not send mail.

### Sender address

Until the studio's own domain is verified with Resend, mail comes from
`onboarding@resend.dev`, which is fine for mail to yourself. To send from
`naledi@nalediart.com`, verify the domain in Resend and then:

```bash
supabase secrets set STUDIO_FROM="Naledi Art Studio <naledi@nalediart.com>"
```

### One note on what the email contains

The client's name and notes are typed by the public, so they are escaped
before they go into the mail body. A booking cannot put markup into your
inbox.
