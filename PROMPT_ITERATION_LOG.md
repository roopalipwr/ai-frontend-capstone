# Prompt Iteration Log — Explaining `validation.js`

Task substituted from FL-01 (per Q&A: real repo work is accepted in place of the FL-01 audit task). Real task: getting an AI-generated explanation of `validation.js` good enough to hand to a new contributor joining the capstone repo.

Each version below adds exactly **one named technique** on top of the previous version's full prompt.

---

## Baseline (naive, one-liner)

**Prompt:**
> Explain this code: [paste validation.js]

**Representative output (excerpt):**
> This code validates form inputs. It checks if fields are empty, checks email format with a regex, and returns error messages. The `validateForm` function loops through the fields and calls the individual validators.

**Note:** Technically correct, completely useless for onboarding. No structure, no mention of edge cases, no sense of what a new contributor actually needs to know before touching this file.

---

## Version 1 — Role assignment

**Prompt:**
> You are a senior frontend engineer mentoring a new contributor who just joined this repo. Explain this code: [paste validation.js]

**Representative output (excerpt):**
> Alright, let's walk through this — this is your form validation layer. The key thing to understand before you touch it: `validateField` is the single source of truth for per-field rules, and `validateForm` just orchestrates calling it across all fields and collecting errors into one object. If you're adding a new field, you add a case here, not a new standalone function.

**Notes:**
- **What changed in the prompt:** assigned a role (senior engineer) and a relationship (mentoring a new contributor).
- **What improved in the output:** tone shifted from clinical description to actual guidance — it now tells a reader *what to do if they need to extend the file* ("you add a case here, not a new standalone function"), which the baseline never volunteered.
- **What still failed:** it's still guessing what a "new contributor" needs — there's no information about why this file exists, what broke before it existed, or what mistakes people commonly make with it.
- **Try next:** give it the actual motivation/context behind the file.

---

## Version 2 — Context and motivation

**Prompt:**
> You are a senior frontend engineer mentoring a new contributor who just joined this repo. Explain this code: [paste validation.js]
>
> Context: this file exists because an earlier version of the settings form let users submit empty required fields and malformed emails with no feedback — this was written specifically to catch that at the client side before an API call is even made. The contributor has React experience but hasn't seen this specific validation pattern before.

**Representative output (excerpt):**
> Given the history here — this file exists to fail fast, client-side, before wasting a network round trip on bad data. That's why `validateField` runs synchronously and returns immediately on the first broken rule per field, rather than collecting every possible issue: the goal was catching the *empty field* and *malformed email* cases that were slipping through, not building a fully generic validation framework. Since you know React but not this pattern: this predates hooks-based form libraries like react-hook-form — it's deliberately dependency-free.

**Notes:**
- **What changed in the prompt:** added the real backstory (bug it was written to fix) and the reader's actual skill gap (knows React, not this specific pattern).
- **What improved in the output:** the explanation stopped being generic and started explaining *design decisions* — why it fails fast per-field, why it's dependency-free — things that are invisible from reading the code alone. This is the first version that would actually save a new contributor from asking "why didn't they just use a library?"
- **What still failed:** it's prose-only — a new contributor skimming this in a PR review or wiki page would have to read every sentence to find what they need. No scannable structure yet.
- **Try next:** add output structure.

---

## Version 3 — Output structure

**Prompt:**
> You are a senior frontend engineer mentoring a new contributor who just joined this repo. Explain this code: [paste validation.js]
>
> Context: this file exists because an earlier version of the settings form let users submit empty required fields and malformed emails with no feedback — this was written specifically to catch that at the client side before an API call is even made. The contributor has React experience but hasn't seen this specific validation pattern before.
>
> Structure your answer as: (1) a one-sentence Purpose line, (2) a table of each exported function with its parameters and return type, (3) a bulleted list of edge cases it does and doesn't handle, (4) a short "if you're extending this" section.

**Representative output (excerpt):**
> **Purpose:** Client-side validation to catch empty/malformed input before an API call.
>
> | Function | Parameters | Returns |
> |---|---|---|
> | `validateField` | `(name, value)` | `string \| null` (error message or null) |
> | `validateForm` | `(formData)` | `{ [field]: string }` (errors object) |
>
> **Edge cases handled:** empty required fields, malformed email regex.
> **Edge cases NOT handled:** whitespace-only input, international phone formats, async uniqueness checks (e.g. "email already taken").
>
> **If you're extending this:** add a new `case` in `validateField`'s switch statement — don't create a parallel validator function.

**Notes:**
- **What changed in the prompt:** specified an exact four-part structure (purpose, function table, edge cases, extension guidance).
- **What improved in the output:** this is scannable now — a new contributor can find "what does this NOT handle" in two seconds instead of reading paragraphs. The table format also forced the model to be precise about types (`string | null`), which the prose versions glossed over.
- **What still failed:** the model is inferring the edge cases from reading the code, but it's not certain — it's not distinguishing "I verified this isn't handled" from "I don't see it, so I'm guessing it isn't." A new contributor could over-trust an edge-case list that's actually a guess.
- **Try next:** add few-shot examples of the confidence/uncertainty distinction I want.

---

## Version 4 — Few-shot examples

**Prompt:**
> You are a senior frontend engineer mentoring a new contributor who just joined this repo. Explain this code: [paste validation.js]
>
> Context: this file exists because an earlier version of the settings form let users submit empty required fields and malformed emails with no feedback — this was written specifically to catch that at the client side before an API call is even made. The contributor has React experience but hasn't seen this specific validation pattern before.
>
> Structure your answer as: (1) a one-sentence Purpose line, (2) a table of each exported function with its parameters and return type, (3) a bulleted list of edge cases it does and doesn't handle, (4) a short "if you're extending this" section.
>
> For the edge-cases list, mark your confidence like these examples:
> - "Handles empty strings — confirmed, line 12 checks `.trim().length === 0`."
> - "Does NOT appear to handle whitespace-only unicode (e.g. non-breaking spaces) — inferred from the regex, not tested."

**Representative output (excerpt):**
> **Edge cases handled:**
> - Empty required fields — confirmed, `validateField` checks `!value.trim()` at line 8.
> - Malformed email — confirmed, regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` at line 14.
>
> **Edge cases NOT handled:**
> - Whitespace-only unicode (non-breaking spaces) — inferred from the regex pattern, not verified by a test run.
> - International phone formats — inferred, no phone validator present in the file at all.

**Notes:**
- **What changed in the prompt:** gave two worked examples showing exactly how to phrase confirmed-vs-inferred claims.
- **What improved in the output:** the model started citing line numbers for confirmed claims and explicitly flagging inferred ones — this is the difference between a document I can trust and one I have to independently re-verify. It's a small phrasing change with a real trust payoff.
- **What still failed:** the whole explanation is still generated in one pass — for a longer or more complex file, cramming purpose + table + edge cases + extension notes into a single generation risks the model losing track of earlier parts by the time it writes later ones.
- **Try next:** decompose into explicit steps.

---

## Version 5 — Step decomposition (this is the one that made things worse)

**Prompt:**
> You are a senior frontend engineer mentoring a new contributor who just joined this repo.
>
> Do this in strict order, one step at a time, showing your work at each step before moving to the next:
> Step 1: List every exported function name and its parameters, nothing else.
> Step 2: For each function, trace through its logic line-by-line and note what it does.
> Step 3: From step 2 only, derive the edge-cases list, marking confirmed vs. inferred.
> Step 4: Write the final four-part document (purpose, function table, edge cases, extension notes) using only what you established in steps 1–3.
>
> Context: this file exists because an earlier version of the settings form let users submit empty required fields and malformed emails with no feedback. The contributor has React experience but hasn't seen this pattern before.
>
> Code: [paste validation.js]

**Representative output (excerpt):**
> **Step 1:** `validateField(name, value)`, `validateForm(formData)`
> **Step 2:** `validateField` — switch on `name`, checks trim/length/regex per case... *(continues for several lines)*
> **Step 3:** Empty fields — confirmed (step 2, line 8)... *(continues)*
> **Step 4 — Final document:**
> **Purpose:** Client-side validation...
> *(same four-part structure as v4, but preceded by ~40 lines of visible step-by-step scratch work)*

**Notes:**
- **What changed in the prompt:** forced explicit sequential steps with visible intermediate work before the final answer.
- **What improved in the output:** honestly, close to nothing over v4's actual final answer — the final four-part document came out nearly identical to version 4's. The line-citing and confirmed/inferred discipline was already locked in by the few-shot examples in v4.
- **What actually got worse:** for a file this small, the visible step-by-step scratch work roughly tripled the response length without adding new information — a new contributor now has to scroll past 40 lines of the model's internal reasoning to reach the actual four-part doc they wanted. Step decomposition is clearly built for tasks with real reasoning chains (multi-file architecture decisions, debugging), not a ~30-line validation file where the "steps" are trivial.
- **Try next:** for this specific task, drop step decomposition and keep v4 as the better version — decomposition should be reserved for tasks that actually need it.

---

## Cross-model comparison — Claude vs. ChatGPT

Final prompt run on both models against the real `validation.js` file.

| | Claude | ChatGPT |
|---|---|---|
| Tone | Terse, reference-doc style — states facts, minimal elaboration. | More narrative/teaching-oriented — added an unprompted worked example (`{isValid: false, message: '...'}` snippet) and closed with proactive testing advice ("I'd also add tests for boundary values..."). |
| Accuracy / citation format | Followed the requested `"confirmed, line N does Y"` format literally — every confirmed claim cites a specific line number. | **Never cited a single line number**, despite the prompt explicitly requesting that exact phrasing. Instead referenced code fragments directly (e.g. `.trim()`, `if (!password)`) as its "confirmed" evidence. Still accurate, but doesn't follow the instruction as given. |
| Structure adherence | Followed the requested 4-part structure exactly — one flat edge-cases list, nothing added. | Added an unrequested 5th section ("Module export" — CommonJS vs. browser global), and reorganized the edge-cases list into four per-function sub-lists rather than one flat list. More thorough, but drifted from the literal spec. |
| Depth / what it caught that the other missed | Flagged that `validateConfirmPassword` doesn't re-validate `password` itself, so two identical *invalid* passwords would still "match." | Independently caught a related but distinct edge case: two **empty strings** are treated as matching by `validateConfirmPassword` (`'' !== ''` is `false`) — a sharper, more specific catch for a new contributor to know about. |
| Where it failed | Didn't flag the empty-string-matching case ChatGPT caught. | Ignored an explicit formatting instruction (line-number citations) in favor of its own preferred citation style, and expanded scope beyond the requested structure without being asked. |

**Specific takeaway:** the two models split their failures in opposite directions. Claude followed the letter of the format instructions more faithfully but missed one genuine edge case. ChatGPT was more thorough and caught an edge case Claude didn't, but ignored an explicit formatting instruction and expanded the structure unprompted — worth knowing if a downstream tool is parsing the output programmatically, where format compliance would matter more than extra thoroughness.

---

## Final reusable prompt

> You are a senior [role] mentoring a new contributor who just joined this repo. Explain this code: [paste code]
>
> Context: [why this file/function exists — what problem it was written to solve]. The contributor has [their known skills] but hasn't seen [the specific pattern/library/approach] before.
>
> Structure your answer as: (1) a one-sentence Purpose line, (2) a table of exported functions with parameters and return types, (3) a bulleted list of edge cases handled and not handled, (4) a short "if you're extending this" section.
>
> For the edge-cases list, distinguish confirmed vs. inferred claims like this:
> - "Handles X — confirmed, line N does Y."
> - "Does NOT appear to handle Z — inferred from the code, not tested."
>
> Skip step-by-step scratch work unless the file is large or the logic is genuinely non-trivial — for small files, go straight to the final structured answer.

**Why this version, not v5's:** it keeps every technique that produced a measurable output change (role, context, structure, few-shot confidence-marking) and explicitly drops step decomposition as a default, since it was the one technique that added length without adding value for this task size — with a note telling future users when to bring it back.
