# Riverside Yoga Website
# Website Design Recreation

## Workflow

When the user provides a reference image (screenshot) and optionally some CSS classes or style notes:

1. **Generate** a single `index.html` file using Tailwind CSS (via CDN). Include all content inline — no external files unless requested.
2. **Screenshot** the rendered page using Puppeteer (`npx puppeteer screenshot index.html --fullpage` or equivalent). If the page has distinct sections, capture those individually too.
3. **Compare** your screenshot against the reference image. Check for mismatches in:
   - Spacing and padding (measure in px)
   - Font sizes, weights, and line heights
   - Colors (exact hex values)
   - Alignment and positioning
   - Border radii, shadows, and effects
   - Responsive behavior
   - Image/icon sizing and placement
4. **Fix** every mismatch found. Edit the HTML/Tailwind code.
5. **Re-screenshot** and compare again.
6. **Repeat** steps 3–5 until the result is within ~2–3px of the reference everywhere.

Do NOT stop after one pass. Always do at least 2 comparison rounds. Only stop when the user says so or when no visible differences remain.

## Technical Defaults

- Use Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`)
- Use placeholder images from `https://placehold.co/` when source images aren't provided
- Mobile-first responsive design
- Single `index.html` file unless the user requests otherwise

## Rules

- Do not add features, sections, or content not present in the reference image
- Match the reference exactly — do not "improve" the design
- If the user provides CSS classes or style tokens, use them verbatim
- Keep code clean but don't over-abstract — inline Tailwind classes are fine
- When comparing screenshots, be specific about what's wrong (e.g., "heading is 32px but reference shows ~24px", "gap between cards is 16px but should be 24px")

## SEO Requirements

Every page must include:
- A unique, descriptive `<title>` tag (50-60 chars) containing primary keyword + location
- A `<meta name="description">` (150-160 chars) that's compelling and includes location
- Proper heading hierarchy — one `<h1>` per page, logical `<h2>`/`<h3>` structure
- Alt text on every image describing the image AND including keywords naturally
- A `<link rel="canonical">` tag pointing to the live domain URL
- Open Graph tags (`og:title`, `og:description`, `og:image`) for social sharing

### Local SEO specifics
- Primary keyword: "Vinyasa yoga [your town]"
- Secondary keywords: "yoga classes [your town]", "beginner yoga [your town]", "yoga studio [your town] NSW"
- Include the studio's full address, phone, and suburb in the footer as plain text (not just an image)
- Wrap business info in Schema.org LocalBusiness structured data (JSON-LD format)
- Embed a Google Maps iframe or link

### Performance (affects SEO ranking)
- Lazy load all images (`loading="lazy"`)
- No render-blocking scripts
- Minify inline CSS where possible