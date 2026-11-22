---
type: llm
focus: trace
weight: 1
---

The docs give a way to run the check script that can work (playwright@1.56.0 installed outside the repo), including the PowerShell form, and don't present the session's NODE_PATH command as working: check.mjs uses an ES-module import, which ignores NODE_PATH
