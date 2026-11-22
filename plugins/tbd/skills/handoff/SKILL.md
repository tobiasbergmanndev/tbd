---
name: handoff
description: Hand off a session's context so a fresh session can pick up the project at once. Inventories what this session learned (product truth, content, design and architecture decisions with their reasons, dead ends, environment quirks, status, open questions, how the user likes to work), writes each fact to the one file where it belongs (CLAUDE.md, PRODUCT.md, DESIGN.md, docs/, plans, memory), corrects stale docs against the code, and has a cold-reader agent prove the docs are enough. Use when the context window is filling up, before /compact or /clear, at the end of a long exploration or chunk of work, or when the user says things like "prepare a handoff", "persist what matters", "save the important context", "write down what we figured out", "so a new session can continue", even if they never say "handoff". Not for saving one preference (write that memory directly) or for writing learnings back into the tbd plugin (that is /tbd:contribute).
---

# Handoff

Persist what this session knows so that a fresh session is productive at once, without the
user explaining anything again. Each fact goes to the one file where it belongs; then a cold
reader, an agent that sees only the repo, proves that the docs are enough.

Only this session can do this. The code and git history hold what was built. The
conversation holds why, what was tried and dropped, what the user answered, and what is
settled versus still an experiment. That part is gone after the next `/clear` or
compaction, so hand off before either, not after.

Running this skill is the user asking you to write the project's docs and memory. It is not
permission to commit, push or delete anything: offer the commit at the end.

Paths in this skill are relative to its base directory, which Claude Code shows when the
skill loads.

## 1. Inventory the session

Go back over the conversation, the commits made during it (`git log`), and the working tree
(`git status`, `git diff`). List what was learned or decided, by kind:

- **Product truth:** who it is for, what it is for, constraints, voice, principles.
- **Content and domain:** story, world, characters, rules, structure, domain model.
- **Visual system** and the reasons behind it.
- **Architecture and data shapes**, and the procedures that took effort to find ("to add a
  scene: create it in X, register it in Y, give it a mood").
- **Decisions**, each with its reason and the alternatives that were rejected; numbers that
  were tuned, and what they were before.
- **Environment and tooling:** versions that must match, installs outside the repo, commands
  that only work a certain way or in a certain shell.
- **Gotchas**, as symptom → cause → fix.
- **Status:** branches, commits, what is merged, what is an experiment, uncommitted or
  half-done work, what comes next.
- **Open questions** and decisions still waiting on the user.
- **The user:** who they are, how they like to work, corrections they gave, external
  references (URLs, dashboards, tickets).

The moments that cost something are the most valuable: a correction from the user, something
that failed first, a "why not just…?", a question the user answered. Those are exactly what
a new session would get wrong.

Keep this list in your working notes, not in the repo.

## 2. Check what is already captured

Read the agent instruction file (`CLAUDE.md`, or `AGENTS.md` if that is the project's), the
README, any `PRODUCT.md`, `DESIGN.md`, `docs/` and plans folder, and the memory index if this
session has one. Mark each inventory item as captured, missing, stale or contradicted.

Then check the facts these files state against the code, not against your memory of the
session: versions (package and lock files), counts (tests, checks, items), names and ids,
paths, commands and scripts (do they exist, do they run as written), schema or save versions,
branch names. Docs go stale even when they were edited during the session: on the project
this skill came from, CLAUDE.md had the wrong save version and the wrong number of checks,
though it had been edited in that same session.

Check the session's own claims the same way before writing them down: a command reported as
working, a measured number, a "tests pass". Sessions get these wrong too (a command that
could never have loaded its module, a contrast ratio worked out wrong), and a handoff turns a
slip into a documented fact. Re-run or recompute the cheap ones; record the corrected
version and say in the report what you told the user earlier that was wrong.

## 3. Route each fact to one home

| Kind | Home |
| --- | --- |
| Rules, map of the code, commands, gotchas, and a "where knowledge lives" table pointing at the other docs | `CLAUDE.md` (or the project's agent file). Loaded into every session: keep it to rules and pointers |
| Product truth | `PRODUCT.md` |
| Visual system | `DESIGN.md` |
| Domain content (story bible, game rules, domain model) | `docs/<topic>.md` |
| Decisions with their reasons, dead ends, tuning, status and history, known drift, open questions | a decision log, e.g. `docs/decisions.md` |
| Planned work, or half-done work and its next steps | a plan file (`.claude/plans/<topic>.md`, or the project's convention), linked from CLAUDE.md |
| External references the project needs (dashboards, API docs, issue trackers) | CLAUDE.md or the doc about that topic |
| Who the user is, how they like to work, personal references | memory (`user`, `feedback`, `reference`) |
| Session-only paths, scratch files, secrets, anything the code or git already shows | nowhere |

- Prefer homes that already exist, and keep their format and voice. Create a new file only
  when a kind has real content and no home; a few lines go into a section of an existing file.
- One home per fact, pointers everywhere else. Two copies drift apart, and then a session
  trusts the wrong one.
- Memory belongs to one user on one machine: cloud sessions and collaborators never see it.
  A preference that changes what any session on this project must do (commit only when asked,
  no new dependencies without asking) also goes into CLAUDE.md as a rule; memory keeps who the
  user is and the reason behind the preference. If this session has no memory, put the
  project-relevant preferences in CLAUDE.md and list the personal ones in the report.
- Preferences that hold for all of the user's projects, and lessons about a stack, belong in
  the tbd plugin. Offer `/tbd:contribute` in the report rather than doing it here.
- If the project uses impeccable (it has `PRODUCT.md`, `DESIGN.md` or `.impeccable/`, or the
  session ran `/impeccable`), those files are impeccable's records with their own procedures:
  read [references/impeccable.md](references/impeccable.md) before touching them.

A "where knowledge lives" table in CLAUDE.md looks like this, one row per doc:

```markdown
| File | Holds |
| --- | --- |
| `docs/decisions.md` | Why things are the way they are, what was tried and dropped, open questions |
```

## 4. Ask only what cannot be inferred

Some facts exist only in the user's head: whether an experiment is settled, what comes next,
who the audience is. Ask about those, at most three questions in one round, and early: start
the background work from step 5 first, so it runs while the user answers. Each option states
its concrete consequence (what gets written down, what becomes binding for future sessions).
A question whose answer is not essential is not worth the round trip: record it as an open
question instead.

Without a question tool, ask in plain text and carry on with what doesn't depend on the answer.

## 5. Write

Write the documents that need the conversation yourself: no subagent has it, so a subagent
asked to "write the decision log" can only restate the code. Delegate, in parallel and in the
background, only what doesn't need it: reading a tool's documentation (keeps long pages out of
this context), impeccable's documenter for `DESIGN.md`.

The bar for what you write:

- **Why, and what was tried and dropped**, not just what. A rule without its reason gets
  "fixed" by the next session.
- **Procedures for typical tasks**, step by step, where only the source shows them: the tasks
  a new session on this project is likeliest to get.
- **Absolute dates** (2026-11-22, never "yesterday"), **commit hashes** for history, and drafts
  and experiments marked as such, with who decides.
- **Commands as they work on this machine**, including the setup they need. On Windows, give
  the PowerShell form where it differs from bash.
- **Corrections in place.** Fix a stale fact where it stands; don't append a contradiction.
- **Durable environment facts, not session paths.** Which tool version matches the installed
  browsers, yes; a temp folder or scratch file from this session, no.
- **No secrets**, including ones the user pasted into the chat: write where the secret lives
  (env var name, password manager entry), never its value. No personal data beyond what the
  user already put in the repo.
- **Every path and command you mention exists and works.** Run the cheap ones.
- **Every new file is reachable.** Link it from CLAUDE.md's knowledge table; a doc nothing
  points to is found by nobody. New files are untracked: the report lists them.
- **No new permissions.** The docs must not give the next session authority the user never
  gave: committing or pushing without asking, deploying, deleting. If the agreed plan seems to
  imply one ("then commit"), write it as a question for the user and ask it in the report.
- **Mind the branch.** Docs written on a feature or exploration branch reach `main` only with
  that branch, and uncommitted docs block a `git switch`. Say in the plan and the report where
  the docs have to land.

## 6. Verify with a cold reader

Spawn a fresh general-purpose agent, not a fork: a fork inherits this conversation and proves
nothing. It gets the repo and a quiz, nothing else. The prompt and the question bank are in
[references/cold-reader.md](references/cold-reader.md).

Before its answers arrive, write the true answer to each question from the session and the
code. Grade every answer against that key, fix each gap, conflict, failed command and wrong
answer in the doc where that fact belongs, then quiz a second fresh agent on the failed
questions only.

## 7. Report

Keep it short:

- Files written or changed, one line each: what it now holds.
- Stale facts corrected.
- What was deliberately not saved, and why (session-only, secret, already in code or git).
- What is still only in the user's head: unanswered questions.
- The cold reader's result: score on the first pass, what it caught, the re-quiz.
- Offer to commit, listing the new untracked files. Commit only when asked. Offer
  `/tbd:contribute` if something turned up that holds beyond this project.

## Short on context

The handoff itself can run out of context. Then work in this order and say in the report
what was skipped: inventory → the documents only the conversation can fill (decisions, status,
next steps) → CLAUDE.md pointers → corrections from step 2 → the cold reader. Delegate reads
of long files and pages to subagents and keep your own reads targeted. A handoff without
verification beats no handoff.
