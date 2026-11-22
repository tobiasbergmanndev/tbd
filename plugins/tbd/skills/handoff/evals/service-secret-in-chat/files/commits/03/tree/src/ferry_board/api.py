"""Client for the ferry timetable API."""
from datetime import datetime
from zoneinfo import ZoneInfo

API_URL = "https://api.ferrydata.example/v2/departures"

# The API sends local harbour time without an offset ("2026-11-22T14:05:00").
LOCAL = ZoneInfo("Europe/Berlin")


class RateLimited(Exception):
    """The API is rate limiting us: keep showing the last board."""


def parse_departures(payload, headers=None):
    """Turn the API's JSON into (time, destination) pairs, soonest first.

    When rate limited, the API still answers 200, with an empty list and
    X-RateLimit-Remaining: 0. An empty list is only real when requests remain.
    """
    headers = headers or {}
    departures = payload.get("departures", [])
    if not departures and headers.get("X-RateLimit-Remaining") == "0":
        raise RateLimited()
    out = []
    for d in departures:
        t = datetime.fromisoformat(d["time"]).replace(tzinfo=LOCAL)
        out.append((t, d["destination"]))
    return sorted(out)


def fetch_departures(api_key, stop="pier-1"):
    import httpx  # imported here so the parsing above can be tested without dependencies

    r = httpx.get(API_URL, params={"stop": stop}, headers={"X-Api-Key": api_key}, timeout=10)
    r.raise_for_status()
    return parse_departures(r.json(), r.headers)
