from __future__ import annotations

from typing import List

from shapely.geometry import LineString, Point


def locate_point_on_line(line: LineString, point: Point) -> float:
    """Return the normalized fraction (0–1) of point projected onto line."""
    return line.project(point, normalized=True)


def interpolate_point_on_line(line: LineString, fraction: float) -> Point:
    """Return the point on line at normalized fraction."""
    return line.interpolate(fraction, normalized=True)


def gap_cluster(distances_m: List[float], gap_m: float) -> List[List[float]]:
    """
    Group sorted distances into clusters where consecutive items are within gap_m.
    Returns list of clusters, each cluster is a list of distances.
    """
    if not distances_m:
        return []
    sorted_d = sorted(distances_m)
    clusters: List[List[float]] = [[sorted_d[0]]]
    for d in sorted_d[1:]:
        if d - clusters[-1][-1] > gap_m:
            clusters.append([d])
        else:
            clusters[-1].append(d)
    return clusters
