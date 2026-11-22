"""Client for the ferry timetable API."""
from datetime import datetime, timezone

API_URL = "https://api.ferrydata.example/v2/departures"


def parse_departures(payload):
    """Turn the API's JSON into (time, destination) pairs, soonest first."""
    out = []
    for d in payload.get("departures", []):
        t = datetime.fromisoformat(d["time"]).replace(tzinfo=timezone.utc)
        out.append((t, d["destination"]))
    return sorted(out)


def fetch_departures(api_key, stop="pier-1"):
    import httpx  # imported here so the parsing above can be tested without dependencies

    r = httpx.get(API_URL, params={"stop": stop}, headers={"X-Api-Key": api_key}, timeout=10)
    r.raise_for_status()
    return parse_departures(r.json())
