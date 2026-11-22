"""Client for the ferry timetable API."""
from datetime import datetime
from zoneinfo import ZoneInfo

API_URL = "https://api.ferrydata.example/v2/departures"

# The API sends local harbour time without an offset ("2026-11-22T14:05:00").
LOCAL = ZoneInfo("Europe/Berlin")


def parse_departures(payload):
    """Turn the API's JSON into (time, destination) pairs, soonest first."""
    out = []
    for d in payload.get("departures", []):
        t = datetime.fromisoformat(d["time"]).replace(tzinfo=LOCAL)
        out.append((t, d["destination"]))
    return sorted(out)


def fetch_departures(api_key, stop="pier-1"):
    import httpx  # imported here so the parsing above can be tested without dependencies

    r = httpx.get(API_URL, params={"stop": stop}, headers={"X-Api-Key": api_key}, timeout=10)
    r.raise_for_status()
    return parse_departures(r.json())
