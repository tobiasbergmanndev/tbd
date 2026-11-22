# Handing off a project that uses impeccable

impeccable keeps two records at the project root, and its commands read them:

- `PRODUCT.md`: the product truth (users, purpose, constraints, voice, principles), written
  by impeccable's `init` flow.
- `DESIGN.md` plus the sidecar `.impeccable/design.json`: the visual system, derived from the
  shipped code by `/impeccable document`.

Keep both in impeccable's format so its commands keep working. Product truth and the visual
system go there and nowhere else; CLAUDE.md points to them.

## Product truth

- **`PRODUCT.md` exists:** update the affected sections in place, in their structure. Mark
  what is undecided as open rather than leaving it out.
- **No `PRODUCT.md`:** run the impeccable skill's `init` flow. It needs one round of answers
  from the user (up to three questions) before it writes. Put those questions in the
  handoff's single question round (SKILL.md step 4) so the user answers once.

## Visual system

- `/impeccable document` writes `DESIGN.md` and the sidecar from the code, and needs
  `PRODUCT.md` first.
- Delegate it to the `impeccable-documenter` agent in the background, and give it what the
  code can't show: why each colour role is what it is, why the type choices, what motion
  carries, and what was tried and dropped. Check its output against the session when it
  returns.
- A single new reason or rule, with no token or component changed, can go straight into
  `DESIGN.md`'s prose. Changed tokens or components need a fresh `document` run.

## Order

Questions (including `init`'s) → `PRODUCT.md` → start the documenter in the background →
write the rest yourself → read `DESIGN.md` when the documenter is done.

## Critiques

Scores and priority issues from `/impeccable critique` go in the decision log with their date
and whether they have been addressed. The snapshots in `.impeccable/critique/` may be local
only; don't make a doc depend on them.
