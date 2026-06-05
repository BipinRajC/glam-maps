"""
Quick test: call Google Routes API with TRAFFIC_ON_POLYLINE
and print the speedReadingIntervals alongside decoded polyline coordinates.

Usage:
    uv run seed/test_traffic.py
"""

import json
import sys
from pathlib import Path

import httpx
import polyline as polyline_codec

# ---------------------------------------------------------------------------
# Pull API key from .env the same way the app does
# ---------------------------------------------------------------------------
sys.path.insert(0, str(Path(__file__).parent.parent))
from app.core.config import settings  # noqa: E402

COMPUTE_ROUTES_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes'

# ---------------------------------------------------------------------------
# Los Angeles: Downtown → Santa Monica via I-10 (notorious rush-hour corridor)
# It is currently ~4:50 PM PST — peak traffic time
# ---------------------------------------------------------------------------
ORIGIN = {'latitude': 12.8984, 'longitude': 77.6179}  # Downtown Los Angeles
DESTINATION = {'latitude': 12.9304, 'longitude': 77.6784}  # Santa Monica


def main():
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': settings.GOOGLE_MAPS_ROUTES_API,
        # Ask for speedReadingIntervals in addition to the usual fields
        'X-Goog-FieldMask': (
            'routes.distanceMeters,'
            'routes.polyline.encodedPolyline,'
            'routes.travelAdvisory.speedReadingIntervals'
        ),
    }

    payload = {
        'origin': {'location': {'latLng': ORIGIN}},
        'destination': {'location': {'latLng': DESTINATION}},
        'travelMode': 'DRIVE',
        'routingPreference': 'TRAFFIC_AWARE',
        # This is the key extra field that unlocks speedReadingIntervals
        'extraComputations': ['TRAFFIC_ON_POLYLINE'],
    }

    print('Calling Google Routes API...')
    resp = httpx.post(COMPUTE_ROUTES_URL, json=payload, headers=headers, timeout=15.0)

    if resp.status_code != 200:
        print(f'ERROR {resp.status_code}: {resp.text}')
        sys.exit(1)

    data = resp.json()
    print('\n=== FULL RAW JSON RESPONSE ===')
    print(json.dumps(data, indent=2))
    print('==============================\n')
    route = data['routes'][0]

    # -----------------------------------------------------------------------
    # 1. Decode the polyline into (lat, lng) coordinate list
    # -----------------------------------------------------------------------
    encoded = route['polyline']['encodedPolyline']
    coords = polyline_codec.decode(encoded)
    print(
        f'\nRoute has {len(coords)} polyline points, distance: {route.get("distanceMeters")}m\n'
    )

    # -----------------------------------------------------------------------
    # 2. Print the raw speedReadingIntervals
    # -----------------------------------------------------------------------
    intervals = route.get('travelAdvisory', {}).get('speedReadingIntervals', [])
    print(f'speedReadingIntervals ({len(intervals)} total):')
    print(json.dumps(intervals, indent=2))

    # -----------------------------------------------------------------------
    # 3. For each TRAFFIC_JAM interval, show the actual lat/lng midpoint
    #    — this is what would become a "red traffic" checkpoint
    # -----------------------------------------------------------------------
    jam_intervals = [i for i in intervals if i.get('speed') == 'TRAFFIC_JAM']
    print(f'\n--- TRAFFIC_JAM segments: {len(jam_intervals)} ---')
    for seg in jam_intervals:
        start_idx = seg['startPolylinePointIndex']
        end_idx = seg['endPolylinePointIndex']
        mid_idx = (start_idx + end_idx) // 2
        mid_lat, mid_lng = coords[mid_idx]
        frac = mid_idx / len(coords)  # fractional position along route (0.0 → 1.0)
        print(
            f'  Points [{start_idx}→{end_idx}]  '
            f'midpoint → lat={mid_lat:.6f}, lng={mid_lng:.6f}  '
            f'(t={frac:.3f} along route)'
        )

    if not jam_intervals:
        print('  No TRAFFIC_JAM segments at this time — try during peak hours!')

    slow_intervals = [i for i in intervals if i.get('speed') == 'SLOW']
    print(f'\n--- SLOW segments: {len(slow_intervals)} ---')
    for seg in slow_intervals:
        start_idx = seg['startPolylinePointIndex']
        end_idx = seg['endPolylinePointIndex']
        mid_idx = (start_idx + end_idx) // 2
        mid_lat, mid_lng = coords[mid_idx]
        frac = mid_idx / len(coords)
        print(
            f'  Points [{start_idx}→{end_idx}]  '
            f'midpoint → lat={mid_lat:.6f}, lng={mid_lng:.6f}  '
            f'(t={frac:.3f} along route)'
        )

    normal_intervals = [i for i in intervals if i.get('speed') == 'NORMAL']
    print(f'\n--- NORMAL segments: {len(normal_intervals)} ---')
    for seg in normal_intervals:
        start_idx = seg['startPolylinePointIndex']
        end_idx = seg['endPolylinePointIndex']
        mid_idx = (start_idx + end_idx) // 2
        mid_lat, mid_lng = coords[mid_idx]
        frac = mid_idx / len(coords)
        print(
            f'  Points [{start_idx}→{end_idx}]  '
            f'midpoint → lat={mid_lat:.6f}, lng={mid_lng:.6f}  '
            f'(t={frac:.3f} along route)'
        )


if __name__ == '__main__':
    main()
