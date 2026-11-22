# The cold reader

A fresh agent that knows nothing but the repo, quizzed on what a new session would face. It
catches what the writer can't see: facts that are only in the writer's head, procedures only
the source shows, commands that don't work as written, docs nothing points to.

## Spawning it

Use a general-purpose agent (never a fork). Subagents can arrive with the parent session's
CLAUDE.md, memory index and git status already in their context, so the reader is only as
cold as its instructions: the prompt tells it to answer from the repo's files alone. Fill in
the project path, the agent file and the questions:

```text
You are a new Claude Code session on the project at <path>. You have no other context. Find
out whether the project's docs are enough for a new session to work productively.

Your context may already contain a CLAUDE.md, a memory index or git status that the harness
attached: ignore them. Answer only from files in the project, and say so whenever you knew
something only from that attached context.

Start with <CLAUDE.md> and follow its pointers. Don't read source code to answer a question
unless a doc sends you there. Do check what the docs claim against the code where that is
cheap, and run the tests and any other quick command the docs give. Don't modify any files,
and don't run anything that deploys, pushes or writes outside the project.

For each question, answer it and cite the doc and section that answered it. Mark:
- GAP when the docs don't answer it; say what you had to read or guess instead.
- CONFLICT when two docs disagree, or a doc and the code disagree; quote both.
- FAIL when a documented command doesn't work as written; include the output.

After the questions, list:
- the questions you would still have to ask the user before starting work;
- anything in the docs that looked wrong, stale or confusing.

Questions:
1. ...
```

## The quiz

Twelve to sixteen questions, adapted to the project. Cover every group. "What is" questions
alone pass too easily; the typical-task questions are the ones that catch missing procedures.

- **Orientation.** What is this project and who is it for? What are its main parts or phases?
  What is settled, what is an experiment, and who decides?
- **Operation.** How do you install, run, test and build it? What setup outside the repo does
  that need? How do you check a change the way this project expects (screenshots, a script,
  a device)?
- **Typical tasks**, two to four, phrased as "Describe exactly how you would …": the tasks the
  next session is likeliest to get, e.g. add a new scene or endpoint, change the save or
  schema format, put the app into a given state for a screenshot.
- **Rules.** What must you never do here? What are the core design or style rules?
- **Why**, two or three questions aimed at this session's decisions and dead ends: "Why isn't
  X done the obvious way?", "What was tried for Y, and why was it dropped?"
- **Status.** What happened most recently? What is half-done? What comes next? What is still
  open?
- **Working with the user.** How does the user like to work (commits, questions, verification)?
  The cold reader can't see memory: if a preference matters to sessions on this project, the
  answer has to be in the repo.

## Grading

Write the answer key before the reply arrives. Then grade each answer: right, partly, wrong,
or GAP. A right answer that cites no doc was found in the source or guessed: count it as a gap
when it is a procedure a session would need again.

Fix each failure in the one doc where that fact belongs (SKILL.md step 3), not wherever is
convenient. Then give a second fresh agent only the failed questions. The first reader can't
re-check them: it remembers the old docs and its own answers, so it can't tell whether a fix
reads clearly on its own.

## What it caught the first time

From the handoff this skill was written after:

- a wrong fact written during the handoff itself;
- procedures a new session needs that only the source showed (registering a scene, the rules
  a test enforces, the shape of a seeded save);
- a command that didn't work as written (it needed setup that wasn't mentioned), and a missing
  PowerShell form on a Windows machine;
- half-reported results (one of two bots), numbers off by a detail;
- new files untracked, and a plan that only memory pointed to;
- working preferences that lived only in memory, invisible to cloud sessions.
