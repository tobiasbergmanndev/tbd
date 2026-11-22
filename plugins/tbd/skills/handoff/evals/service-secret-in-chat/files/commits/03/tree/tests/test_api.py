import unittest
from datetime import datetime, timezone

from ferry_board.api import RateLimited, parse_departures


class LocalTime(unittest.TestCase):
    def test_winter_time_is_utc_plus_one(self):
        [(t, _)] = parse_departures({"departures": [{"time": "2026-11-22T14:05:00", "destination": "Insel"}]})
        self.assertEqual(t.astimezone(timezone.utc), datetime(2026, 11, 22, 13, 5, tzinfo=timezone.utc))

    def test_summer_time_is_utc_plus_two(self):
        [(t, _)] = parse_departures({"departures": [{"time": "2026-07-01T09:30:00", "destination": "Insel"}]})
        self.assertEqual(t.astimezone(timezone.utc), datetime(2026, 7, 1, 7, 30, tzinfo=timezone.utc))



class RateLimit(unittest.TestCase):
    def test_empty_list_with_no_requests_left_is_a_rate_limit(self):
        with self.assertRaises(RateLimited):
            parse_departures({"departures": []}, {"X-RateLimit-Remaining": "0"})

    def test_empty_list_with_requests_left_is_really_empty(self):
        self.assertEqual(parse_departures({"departures": []}, {"X-RateLimit-Remaining": "41"}), [])


if __name__ == "__main__":
    unittest.main()
