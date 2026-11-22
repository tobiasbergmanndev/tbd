---
type: llm
focus: trace
weight: 1
---

The docs record the rate-limit gotcha: 200 with an empty list and X-RateLimit-Remaining: 0 rather than 429, and that the board keeps the last result
