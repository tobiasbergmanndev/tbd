"""The board: one HTML page with the next departures."""
import os

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from .api import RateLimited, fetch_departures

app = FastAPI()
_last_board = []


def render(departures):
    rows = "".join(
        f"<tr><td>{t.strftime('%H:%M')}</td><td>{dest}</td></tr>" for t, dest in departures[:8]
    )
    return f"""<!doctype html><meta http-equiv="refresh" content="30">
<title>Departures</title><table>{rows}</table>"""


@app.get("/", response_class=HTMLResponse)
def board():
    global _last_board
    try:
        _last_board = fetch_departures(os.environ["FERRY_API_KEY"])
    except RateLimited:
        pass  # keep the last board; the page refreshes in 30 s anyway
    return render(_last_board)
