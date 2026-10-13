---
description: "Turn a game premise report's jam MVP pitch into a time-slotted task checklist for a game jam. Use when: scoping a jam build, planning a 1-hour jam, breaking a pitch into tasks."
name: "jam-scope"
argument-hint: "Path to a premise report (defaults to the open file); optional jam length, e.g. 2h"
agent: "agent"
tools: [read, edit, search]
---
Read the game premise report (the given path, or the currently open file in `reports/`). Use its **Jam MVP Pitch** section as the scope source. Default jam length is **1 hour** unless the user gives another.

Produce `reports/<same-slug>-jam-plan.md` (replace `-game-premise` with `-jam-plan`).

## Rules
- Time slots must sum exactly to the jam length. Reserve ~10% at the end for buffer + submission.
- A **playable build** (core loop works, even ugly) must exist by the 50% mark.
- Each task is small enough to finish in its slot (≤10 min for a 1-hour jam). Split anything bigger.
- Order: setup → core loop → win/lose → feedback/juice → stretch → buffer.
- Everything in the pitch's "Cuts" stays cut. Stretch goals go in a separate optional block that is only started if the previous milestone is met on time.
- Assume the default engine is a single-file HTML5 Canvas + vanilla JS build unless the report or user names another engine.

## Output format

```markdown
# <Game Name> — Jam Plan (<length>)

Engine: <engine>
Source: [report](./<slug>-game-premise.md)

## Checklist
| Time | Task | Done when |
|---|---|---|
| 0:00–0:05 | ... | ... |

## Milestones
- **0:30 — Playable:** ...
- **0:54 — Feature freeze:** ...

## Stretch (only if on schedule)
- [ ] ...

## Cut list (do not build)
- ...
```

Then reply in chat with the milestone times and the single riskiest task.
