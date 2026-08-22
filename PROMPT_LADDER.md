# Prompt Ladder — "Build a website"

Track: Frontend AI Engineering
Starting prompt is a genuinely lazy one-liner I'd have typed a month ago. Each version below adds exactly **one** layer on top of the previous version's full prompt.

---

## Baseline (embarrassing, on purpose)

**Prompt:**
> Build a website

**Representative output (excerpt):**
> Sure! Here's a simple website using HTML, CSS, and JavaScript:
> ```html
> <!DOCTYPE html>
> <html>
> <head><title>My Website</title></head>
> <body>
>   <h1>Welcome to My Website</h1>
>   <p>This is a paragraph.</p>
> </body>
> </html>
> ```
> Let me know if you'd like to add more pages, styling, or specific features like a contact form or navigation menu!

**Notes:**
- **Prompt change:** none — this is the baseline.
- **Output result:** a generic three-tag HTML skeleton with placeholder text. No stack decision, no purpose, no visual direction — it's the "hello world" of websites.
- **Still failed:** doesn't know what the site is for, who it's for, what tech to use, or what "done" looks like. It's technically a website and useful for nothing.
- **Try next:** give it an actual goal — what is this website supposed to accomplish?

---

## Version 1 — Add a clearer goal

**Prompt:**
> Build a portfolio website for a frontend developer to showcase their projects and land freelance or full-time work.

**Representative output (excerpt):**
> Here's a portfolio website structure:
> - Hero section with name, title ("Frontend Developer"), and a short tagline
> - About section
> - Projects section — grid of project cards (image, title, short description, live link, GitHub link)
> - Skills section listing tech stack
> - Contact section with email/social links
>
> ```html
> <section id="hero">...</section>
> <section id="projects">...</section>
> ```
> Want me to fill in real content, or add a specific color scheme?

**Notes:**
- **Prompt change:** added a concrete goal (portfolio site, purpose: land work).
- **Output result:** the structure stopped being generic HTML and became *purpose-shaped* — it now includes sections a portfolio actually needs (Projects, Skills, Contact) instead of a random paragraph. The model made real decisions instead of placeholders.
- **Still failed:** it's still guessing who's looking at this. The tone and content decisions (how much technical detail, what to lead with) are unanchored — a recruiter and a fellow engineer would want very different things emphasized, and the model picked neither deliberately.
- **Try next:** name the actual audience.

---

## Version 2 — Add a defined audience

**Prompt:**
> Build a portfolio website for a frontend developer to showcase their projects and land freelance or full-time work. The primary audience is non-technical recruiters and hiring managers at startups, skimming on their phone for under 30 seconds before deciding whether to read further.

**Representative output (excerpt):**
> Given a 30-second mobile skim, front-load the highest-signal info:
> - Hero: name, one-line role + standout claim (e.g. "Frontend Developer — shipped 3 production apps used by 10k+ users"), no jargon
> - Immediately below the fold: 3 project cards max, each with a screenshot, one-sentence plain-English description of *what it does* (not how it's built), and a "View live" button — GitHub link demoted to secondary
> - Skills section trimmed to a short badge row, not a wall of technologies
> - Mobile-first layout, large tap targets, minimal scrolling to reach the "View live" buttons

**Notes:**
- **Prompt change:** named the audience (non-technical recruiters, mobile, 30-second attention span).
- **Output result:** this is the layer that actually reshaped the output — the model stopped writing for a developer reading the code and started writing for someone deciding whether to keep scrolling. Concrete, measurable changes: jargon removed from the hero copy, GitHub links demoted below live-demo links, project count capped at 3, mobile-first explicitly called out.
- **Still failed:** the model is inventing achievement numbers ("used by 10k+ users") with zero information about my actual projects. Audience-awareness without real facts just produces confident-sounding fiction.
- **Try next:** give it the real context — actual projects, actual stack, actual constraints — so it stops making things up.

---

## Version 3 — Add real context

**Prompt:**
> Build a portfolio website for a frontend developer to showcase their projects and land freelance or full-time work. The primary audience is non-technical recruiters and hiring managers at startups, skimming on their phone for under 30 seconds before deciding whether to read further.
>
> Real context: I'm a Frontend AI Engineering intern building this as part of a capstone. I know React and vanilla JS/HTML/CSS. I have three real projects to feature: (1) an AI-assisted settings-form component with validation, (2) a workflow-comparison case study (prompt engineering diffs), (3) this portfolio site itself. I'll deploy on Vercel. No backend, no CMS — static content I'll hand-edit.

**Representative output (excerpt):**
> Given static content + Vercel + React, I'd skip a framework like Next.js unless you want SSR/SEO — plain Vite + React is lighter for a 1-page static portfolio. Project cards, using your actual three:
> 1. **Settings Form with Validation** — "Built and validated a production-style form component, comparing AI-assisted output before and after precise prompting." *(This doubles as a demonstration of your AI-workflow skill, not just a component — worth its own callout line.)*
> 2. **Workflow Case Study** — link directly to WORKFLOW.md or render key diffs inline as a mini before/after.
> 3. **This site** — meta, but recruiters like seeing a self-referential "you're looking at project #3 right now."
>
> No fabricated numbers this time — descriptions are grounded in what you told me.

**Notes:**
- **Prompt change:** added real facts — actual skills, actual three projects, actual deploy target, no backend.
- **Output result:** the invented "10k+ users" claim disappeared entirely, replaced by accurate project descriptions. The model also made a genuinely useful judgment call it couldn't have made before — flagging that project #1 doubles as proof of AI-workflow skill, not just a coding sample. Real input produced a real recommendation instead of a plausible-sounding one.
- **Still failed:** the output is still just prose description — I have to manually translate this into an actual file structure and code before it's usable. There's no format telling the model how to hand this back to me.
- **Try next:** specify the output format explicitly.

---

## Version 4 — Add a specified output format

**Prompt:**
> Build a portfolio website for a frontend developer to showcase their projects and land freelance or full-time work. The primary audience is non-technical recruiters and hiring managers at startups, skimming on their phone for under 30 seconds before deciding whether to read further.
>
> Real context: I'm a Frontend AI Engineering intern building this as part of a capstone. I know React and vanilla JS/HTML/CSS. I have three real projects to feature: (1) an AI-assisted settings-form component with validation, (2) a workflow-comparison case study (prompt engineering diffs), (3) this portfolio site itself. I'll deploy on Vercel. No backend, no CMS — static content I'll hand-edit.
>
> Output format: respond with a file tree first, then one fenced code block per file (filename as a comment on line 1), in the order I'd create them. No prose paragraphs between code blocks — inline comments only. End with a 3-bullet "next steps" list.

**Representative output (excerpt):**
> ```
> /portfolio
>   index.html
>   styles.css
>   script.js
>   /assets
> ```
> ```html
> <!-- index.html -->
> <!DOCTYPE html>
> <html lang="en">
> <head>...</head>
> <body>
>   <section id="hero">...</section>
>   <section id="projects">...</section>
> </body>
> </html>
> ```
> ```css
> /* styles.css */
> :root { --max-width: 640px; }
> body { font-family: system-ui; margin: 0; }
> ```
> **Next steps:**
> - Fill in real project screenshots in `/assets`
> - Wire up smooth-scroll nav
> - Test on an actual phone, not just dev-tools mobile view

**Notes:**
- **Prompt change:** added an explicit output format (file tree, then one code block per file, comments not prose, ending with next steps).
- **Output result:** this is the biggest practical win of the whole ladder — the response went from "advice I have to translate into files myself" to "files I can paste directly into my repo." Zero manual restructuring needed. This is the layer that turned a conversation into a deliverable.
- **Still failed:** the CSS and structure are competent but generic — there's no visual point of view. It looks like every AI-generated portfolio because nothing told it what "good" should look like.
- **Try next:** give it a concrete example of the visual quality bar.

---

## Version 5 — Add examples of what good looks like (this is the one that underdelivered)

**Prompt:**
> Build a portfolio website for a frontend developer to showcase their projects and land freelance or full-time work. The primary audience is non-technical recruiters and hiring managers at startups, skimming on their phone for under 30 seconds before deciding whether to read further.
>
> Real context: I'm a Frontend AI Engineering intern building this as part of a capstone. I know React and vanilla JS/HTML/CSS. I have three real projects to feature: (1) an AI-assisted settings-form component with validation, (2) a workflow-comparison case study (prompt engineering diffs), (3) this portfolio site itself. I'll deploy on Vercel. No backend, no CMS — static content I'll hand-edit.
>
> Output format: respond with a file tree first, then one fenced code block per file (filename as a comment on line 1), in the order I'd create them. No prose paragraphs between code blocks — inline comments only. End with a 3-bullet "next steps" list.
>
> Examples of what good looks like: aim for the restraint of brittanychiang.com and the confident whitespace of a Linear.app landing page — dark background, one accent color, generous spacing, no gradients or drop shadows.

**Representative output (excerpt):**
> ```css
> /* styles.css */
> :root {
>   --bg: #0a0a0a;
>   --accent: #64ffda;
>   --spacing: 2rem;
> }
> body { background: var(--bg); color: #ccd6f6; }
> .project-card { padding: var(--spacing); border: 1px solid #233554; }
> ```
> *(rest of file tree unchanged from v4)*

**Notes:**
- **Prompt change:** added two named reference sites as a visual quality bar.
- **Output result:** honestly, this one **didn't help much**. The dark-background/single-accent-color CSS variables are a plausible imitation of "developer portfolio aesthetic," but there's no way to verify from a text response whether it actually resembles brittanychiang.com's *layout rhythm* or Linear's *whitespace confidence* — those are visual judgments a code block can gesture at but can't prove. The named examples nudged the color palette but didn't meaningfully change structure, spacing decisions, or hierarchy versus v4. I'd have gotten more from pasting an actual screenshot than naming sites by URL.
- **Still failed:** no way to verify visual quality without rendering it — this is a layer that needs an image input or a live preview loop, not more text.
- **Try next:** for future rounds, attach a real screenshot instead of naming a site, or add a verification step (render it and describe what you see) rather than another instruction layer.

---

## Final reusable prompt

Cleaned up so a stranger on the track could use it without me in the room — swap the bracketed parts for their own project:

> Build a [type of site] for [who it's for] to [what it should accomplish]. The primary audience is [specific audience — role, technical level, device, attention span].
>
> Real context: [your actual skills/stack]. Real content to feature: [list your actual projects/items — don't let the model invent achievements or numbers]. Deployment target: [where]. Explicit exclusions: [anything off the table, e.g. no backend, no CMS].
>
> Output format: respond with a file tree first, then one fenced code block per file (filename as a comment on line 1) in creation order. No prose between code blocks — inline comments only. End with a numbered "next steps" list of what I still need to do by hand.
>
> Before finishing, check your own output against this: does every claim in the copy trace back to something I told you, or did you invent it? Flag anything you're unsure about instead of guessing.

**Why this version, not v5's:** it keeps the goal/audience/context/format layers that produced measurable, verifiable changes, and swaps the weak "named examples" layer for a **verification instruction** — asking the model to self-check for invented claims, which was the actual recurring failure mode across every version (first as fabricated stats in v2, implicitly still a risk in v3–v5).
