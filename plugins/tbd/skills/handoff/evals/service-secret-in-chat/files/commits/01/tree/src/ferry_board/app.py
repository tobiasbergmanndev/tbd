"""The board: one HTML page with the next departures."""
import os

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from .api import fetch_departures

app = FastAPI()


def render(departures):
    rows = "".join(
        f"<tr><td>{t.strftime('%H:%M')}</td><td>{dest}</td></tr>" for t, dest in departures[:8]
    )
    return f"""<!doctype html><meta http-equiv="refresh" content="30">
<title>Departures</title><table>{rows}</table>"""


@app.get("/", response_class=HTMLResponse)
def board():
    return render(fetch_departures(os.environ["FERRY_API_KEY"]))
