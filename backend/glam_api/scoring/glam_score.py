import json
from pathlib import Path

COPY_PATH = Path(__file__).resolve().parents[3] / "shared" / "copy.json"

SCORE_BANDS = [
    (85, "Winged Eyeliner Approved"),
    (65, "Mascara Stable"),
    (40, "Smudge Risk"),
    (0, "Full Reapply Required"),
]


def compute_glam_score(pothole_count: int, distance_m: int, d_max: float) -> int:
    """Density → 0–100. Higher = smoother. Zero potholes = 100."""
    if distance_m <= 0 or pothole_count == 0:
        return 100
    density = pothole_count / (distance_m / 1000)
    return round(100 * (1 - min(density / d_max, 1)))


def get_score_band(score: int) -> str:
    for threshold, band in SCORE_BANDS:
        if score >= threshold:
            return band
    return SCORE_BANDS[-1][1]


def classify_intensity(pothole_count: int) -> str:
    if pothole_count <= 1:
        return "minor"
    if pothole_count <= 3:
        return "moderate"
    return "heavy"


def compute_sub_metrics(
    glam_score: int,
    worst_zone_score: int,
    longest_smooth_m: float,
    total_distance_m: float,
) -> dict:
    contour_confidence = (
        round(100 * min(longest_smooth_m / total_distance_m, 1))
        if total_distance_m > 0
        else 100
    )
    return {
        "mascaraStability": glam_score,
        "smudgeRisk": 100 - worst_zone_score,
        "contourConfidence": contour_confidence,
    }


def load_copy_templates() -> dict:
    with open(COPY_PATH) as f:
        return json.load(f)
