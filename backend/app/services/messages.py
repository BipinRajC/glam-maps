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
}


def pick_message(pothole_count: int) -> str:
    if pothole_count == 0:
        category = 'smooth_stretch'
    elif pothole_count <= 2:
        category = 'medium_severity'
    else:
        category = 'high_severity'
    return random.choice(MESSAGES[category])
