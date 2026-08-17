from collections import defaultdict, deque
from threading import Lock
from time import monotonic

from fastapi import HTTPException, Request, status


_requests = defaultdict(deque)
_lock = Lock()


def rate_limit(
    limit: int,
    window_seconds: int,
    name: str,
):
    def dependency(request: Request):
        client = request.client

        if client is None:
            client_ip = "unknown"
        else:
            client_ip = client.host

        key = f"{name}:{client_ip}"
        now = monotonic()
        window_start = now - window_seconds

        with _lock:
            timestamps = _requests[key]

            while timestamps and timestamps[0] <= window_start:
                timestamps.popleft()

            if len(timestamps) >= limit:
                retry_after = max(
                    1,
                    int(
                        timestamps[0]
                        + window_seconds
                        - now
                    ),
                )

                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=(
                        "Too many requests. "
                        f"Please try again in {retry_after} seconds."
                    ),
                    headers={
                        "Retry-After": str(retry_after)
                    },
                )

            timestamps.append(now)

            if len(_requests) > 10000:
                expired_keys = [
                    stored_key
                    for stored_key, stored_timestamps
                    in _requests.items()
                    if not stored_timestamps
                ]

                for stored_key in expired_keys[:5000]:
                    del _requests[stored_key]

        return True

    return dependency