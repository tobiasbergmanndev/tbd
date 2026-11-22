"""In-memory cache for API responses: nothing is written to disk (the Pi's root is read-only)."""
from cachetools import TTLCache, cached

from .api import fetch_departures


@cached(TTLCache(maxsize=32, ttl=30))
def cached_departures(api_key, stop="pier-1"):
    return fetch_departures(api_key, stop)
