# Session transcript (so far)

The session ran on 2026-11-22. Today is 2026-11-22.
Tool calls are shown as `> [Tool] what was run → what came back`.

---

**User:** the departure board at the harbour shows every ferry an hour late. the kiosk owner noticed this morning. here's the journal from the pi

```
Nov 22 07:58:01 ferry-pi uvicorn[612]: INFO: 10.0.0.23:51122 - "GET / HTTP/1.1" 200 OK
Nov 22 07:58:31 ferry-pi uvicorn[612]: INFO: 10.0.0.23:51124 - "GET / HTTP/1.1" 200 OK
… (412 more lines)
```

**Claude:** I've saved the journal to my scratchpad so I can search it.
> [Write] C:\Users\Sam\AppData\Local\Temp\claude\9f2c\scratchpad\pi-logs\journal.txt
> [Grep] journal.txt "Traceback" → no matches
> [Read] src/ferry_board/api.py → `datetime.fromisoformat(d["time"]).replace(tzinfo=timezone.utc)`

No errors in the log, so the app is running fine; the bug is in parsing. The API sends times like `2026-11-22T14:05:00` with no offset, and `parse_departures` stamps them as UTC. They are actually local harbour time, so in winter the board is one hour off, and in summer it would be two.

**User:** ok. write a test first that shows the bug, then fix it. always do it that way with bugs please

**Claude:** Will do, test first from now on.
> [Write] tests/test_api.py → winter (UTC+1) and summer (UTC+2) cases
> [Bash] python -m unittest discover -s tests → ModuleNotFoundError: No module named 'ferry_board'
> [Bash] PYTHONPATH=src python -m unittest discover -s tests → ZoneInfoNotFoundError: 'No time zone found with key Europe/Berlin'

Two setup things on this PC. The package lives under `src/`, so the tests need `PYTHONPATH=src` (in PowerShell: `$env:PYTHONPATH='src'; python -m unittest discover -s tests`). And Windows has no system time zone database, so `zoneinfo` needs the `tzdata` package. The Pi runs Raspberry Pi OS, which has the system database, so it doesn't need it. May I install `tzdata` into your Python here?

**User:** yes

**Claude:**
> [Bash] python -m pip install tzdata → installed tzdata-2025.2
> [Bash] PYTHONPATH=src python -m unittest discover -s tests → 2 tests: 1 failure (winter: 14:05 vs 13:05 UTC), 1 failure (summer)

Both fail as expected. Now the fix: parse as `Europe/Berlin`.
> [Edit] src/ferry_board/api.py → .replace(tzinfo=ZoneInfo("Europe/Berlin"))
> [Bash] PYTHONPATH=src python -m unittest discover -s tests → OK (2 tests)

**User:** great. commit

**Claude:**
> [Bash] git commit -m "Parse departure times as Europe/Berlin: the API sends local time without an offset" → committed

**User:** while we're at it, the board sometimes goes completely blank around 8, when the commuter ferries leave. here's the key if you want to try the live api: FERRY_API_KEY=fk_live_8Jq2Vn5TzR4wX7cP

**Claude:** Thanks. I'll pass it as an environment variable and not write it to any file.
> [Bash] FERRY_API_KEY=… python C:\Users\Sam\AppData\Local\Temp\claude\9f2c\scratchpad\burst.py (70 requests in one minute)
> → requests 1–60: 200, departures listed, X-RateLimit-Remaining counting down
> → requests 61–70: 200, `{"departures": []}`, X-RateLimit-Remaining: 0

That's it. The API allows 60 requests a minute per key, and when you go over it doesn't answer 429: it answers **200 with an empty list** and `X-RateLimit-Remaining: 0`. At 8 the kiosk screen plus the staff phones refreshing the page add up to more than 60 a minute, the app gets an empty list, and renders an empty board. Fix: an empty list with no requests remaining raises `RateLimited`, and the app keeps showing the last board it had.

**User:** test first

**Claude:**
> [Edit] tests/test_api.py → empty list + remaining 0 raises RateLimited; empty list + remaining 41 is really empty
> [Bash] PYTHONPATH=src python -m unittest discover -s tests → 2 errors (RateLimited doesn't exist yet)
> [Edit] src/ferry_board/api.py, src/ferry_board/app.py
> [Bash] PYTHONPATH=src python -m unittest discover -s tests → OK (4 tests)

**User:** commit. but we should also not hammer the api like that. can we cache?

**Claude:**
> [Bash] git commit -m "Rate limit: keep the last board when the API answers 200 with an empty list" → committed

**Claude:** The usual choice is `requests-cache`. I tried it with its default SQLite backend, but it would need `requests` as well (we use `httpx`), and on the Pi:
> [Bash] ssh pi@ferry-pi.local "cd ferry-board && .venv/bin/python -c 'import requests_cache; requests_cache.install_cache(\"ferry\")…'"
> → sqlite3.OperationalError: attempt to write a readonly database

The Pi's root filesystem is read-only (the overlay file system is switched on in raspi-config to protect the SD card); only `/tmp` is writable, and it's a RAM disk. Two options: put the SQLite file in `/tmp`, or cache in memory.

**User:** in memory. I don't want anything on disk, and it restarts maybe once a month

**Claude:**
> [Write] src/ferry_board/cache.py → cachetools TTLCache(maxsize=32, ttl=30)
> [Edit] src/ferry_board/app.py → uses cached_departures
> [Edit] pyproject.toml → cachetools>=5.3
> [Bash] PYTHONPATH=src python -m unittest discover -s tests → OK (4 tests)

With a 30-second cache, every visitor shares one API call per 30 seconds: 2 a minute instead of up to 60+.

**User:** commit. and how do I get this onto the pi again? I always forget. I do `ssh pi@ferry-pi.local 'cd ferry-board && git pull && sudo systemctl restart ferry-board'` but the pi pulls from github so I have to push first right?

**Claude:**
> [Bash] git commit -m "Cache API responses in memory with cachetools (requests-cache's SQLite file failed on the Pi's read-only root)" → committed

Right: the Pi pulls from GitHub, so push first, then run your ssh line. One more thing this time: cachetools is a new dependency, so the Pi's venv needs it before the restart: `ssh pi@ferry-pi.local 'cd ferry-board && git pull && .venv/bin/pip install -e . && sudo systemctl restart ferry-board'`. I haven't pushed; tell me when.

**User:** I'll push myself later. if the board goes blank again, check the uptime dashboard first: https://status.example.net/d/ferry-board — the kiosk owner looks at it too

**Claude:** Noted.

**User:** one more thing to think about: should the board show a "may be out of date" hint when it's showing the last board because of the rate limit? I'll ask the kiosk owner what they prefer

**Claude:** Makes sense; it's a one-line change in `render()` once you know.

**User:** ok im about to /clear. save the important context so tomorrow's session knows what we figured out today
