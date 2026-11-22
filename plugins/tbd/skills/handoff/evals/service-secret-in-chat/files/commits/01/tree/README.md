# ferry-board

The departure board on the kiosk screen at the harbour: the next ferries from the pier,
refreshed every 30 seconds, served as one HTML page by a small FastAPI app on a Raspberry Pi.

Run locally:

    python -m pip install -e .
    python -m uvicorn ferry_board.app:app --reload

The app needs `FERRY_API_KEY` in the environment (see `.env.example`).
