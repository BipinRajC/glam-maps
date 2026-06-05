import random

MESSAGES = {
    'high_severity': [
        'Smudge zone ahead! Put away the kajal, seal everything with setting spray 🚨',
        'Arre yaar, full pothole cluster incoming — hands off the face! 😬',
        'This stretch is NOT it for makeup application. Hold on tight bestie 💀',
    ],
    'medium_severity': [
        'Small bump coming up — maybe hold off on the lip liner for a sec 💋',
        'One little pothole spotted. Nothing to panic about, just pause the touch-up 🙂',
        'Slight turbulence ahead. Mascara wand DOWN 👇',
    ],
    'smooth_stretch': [
        'Open runway! Perfect moment to reapply that gloss ✨',
        "Silky smooth stretch — you've got at least 2 minutes of mirror time 🪞",
        'Zero potholes detected. Contour freely, queen 👑',
        'This is your moment. Lipstick? Go for it 💄',
    ],
    'traffic_normal': [
        'Smooth traffic flow — roads are clear, enjoy the glide 🚗',
        'Green lights ahead! Traffic is moving nicely ✅',
        'No traffic worries here — cruise mode activated 😎',
    ],
    'traffic_slow': [
        'Traffic is slowing down — great time for a quick touch-up! 💅',
        'Slow traffic ahead. Silver lining? More mirror time 🪞',
        'Bumper-to-bumper beauty window opening up… 💋',
    ],
    'traffic_jam': [
        'Full traffic jam! You could do a whole skincare routine right now 🧴',
        'Gridlock alert — perfect time for that bold lip look 💄✨',
        'Not moving anytime soon. Might as well blend that concealer 💀',
    ],
}


def pick_message(pothole_count: int = 0, traffic_speed: str | None = None) -> str:
    """Pick a contextual message based on checkpoint type."""
    if traffic_speed is not None:
        category = {
            'NORMAL': 'traffic_normal',
            'SLOW': 'traffic_slow',
            'TRAFFIC_JAM': 'traffic_jam',
        }.get(traffic_speed, 'traffic_normal')
    elif pothole_count == 0:
        category = 'smooth_stretch'
    elif pothole_count <= 2:
        category = 'medium_severity'
    else:
        category = 'high_severity'
    return random.choice(MESSAGES[category])
