import unittest
from datetime import datetime, timezone

from ferry_board.api import parse_departures


class LocalTime(unittest.TestCase):
    def test_winter_time_is_utc_plus_one(self):
        [(t, _)] = parse_departures({"departures": [{"time": "2026-11-22T14:05:00", "destination": "Insel"}]})
        self.assertEqual(t.astimezone(timezone.utc), datetime(2026, 11, 22, 13, 5, tzinfo=timezone.utc))

    def test_summer_time_is_utc_plus_two(self):
        [(t, _)] = parse_departures({"departures": [{"time": "2026-07-01T09:30:00", "destination": "Insel"}]})
        self.assertEqual(t.astimezone(timezone.utc), datetime(2026, 7, 1, 7, 30, tzinfo=timezone.utc))


if __name__ == "__main__":
    unittest.main()
