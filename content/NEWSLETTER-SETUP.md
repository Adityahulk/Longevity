# Newsletter setup — make subscribe + delivery work end to end

The site already has working subscribe forms (on `/newsletter`, `/learn`, and the homepage strip) and an RSS feed at `/feed.xml`. They go **live the moment you connect a provider**. Until then, the forms show a friendly "launching shortly" message instead of submitting — nothing breaks.

We wired it for **Buttondown** because its subscribe form is a clean native HTML form (matches the site design), you own your subscriber list, and it can auto-email new blog posts via RSS. Total time to activate: ~15 minutes.

## Step 1 — Create a Buttondown account
1. Go to **buttondown.com** and sign up. Free under 100 subscribers; paid after.
2. Pick your **username** (e.g. `tessera`). This becomes your newsletter URL: `buttondown.com/tessera`.

## Step 2 — Flip the site live (one value, in 3 files)
In each of these files, find this line near the bottom:

```js
window.NEWSLETTER_USER = "BUTTONDOWN_USERNAME";
```

Replace `BUTTONDOWN_USERNAME` with your actual username (e.g. `"tessera"`), in:
- `newsletter.html`
- `learn.html`
- `index.html` (homepage strip)

Commit + push. That's it — every subscribe form on the site now posts real signups into Buttondown, and the subscriber gets Buttondown's confirmation email.

> Tip: keep the username identical in all three. If you later move the script to a shared file, you'll only set it once.

## Step 3 — Auto-send new blog posts (RSS → email)
So that **subscribers actually receive an email when you publish a blog post**:

1. In Buttondown: **Settings → Automations (or "RSS-to-email")**.
2. Add your feed URL: **`https://antiaging-labs.com/feed.xml`**
3. Choose: send automatically, or hold as a draft for you to review then send. (Start with "draft for review" so you control tone.)

Now whenever a new `<item>` appears in `/feed.xml`, Buttondown turns it into an email to your list.

## Step 4 — Test it
1. Subscribe yourself on `/newsletter` with a real address. Confirm you get the Buttondown confirmation email.
2. Publish a test post (or temporarily add an item to `feed.xml`), wait for Buttondown to pick up the feed (it polls periodically), and confirm the email arrives.

## Writing flow going forward

**A blog post** (lives on the site + emails subscribers):
1. Publish the post as usual (see `content/blog-post-template.html` for the 4 steps).
2. Add one `<item>` to `feed.xml` at the top of the list (copy an existing item, change title / link / pubDate / description). Use RFC-822 dates, e.g. `Tue, 09 Jun 2026 09:00:00 +0530`.
3. Push. Buttondown picks up the feed and emails subscribers (auto, or as a draft you approve).

**A pure newsletter** (email only, not a blog post):
- Write and send it directly in Buttondown's editor. No site change needed.

## Alternatives (if you prefer)

- **Substack** — zero setup, built-in discovery/community, but pulls readers to substack.com and you own less. Swap the form for Substack's embed.
- **Beehiiv** — creator-focused, free to 2,500 subs, good growth tools. Heavier embed.
- **ConvertKit / Kit** — free to 10k, solid automations, heavier embed.

If you switch providers, you only change the subscribe form action + the small script. Everything else (the feed, the pages) stays.

## How the form behaves (technical note)

The subscribe form uses Buttondown's documented popup-embed pattern (a native POST + a confirmation popup), which avoids CORS issues. A small script:
- shows "launching shortly" if `NEWSLETTER_USER` is still the placeholder,
- otherwise sets the form action to `https://buttondown.com/api/emails/embed-subscribe/<username>` and submits.

No backend, no server to run, no keys in the repo.
