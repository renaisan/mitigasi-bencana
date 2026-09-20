from datetime import datetime, timezone

def today_iso() -> str:
    """Return today's date in ISO format (YYYY-MM-DD)."""
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")