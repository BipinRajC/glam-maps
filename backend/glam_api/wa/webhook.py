from __future__ import annotations

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class WebhookMessage:
    sender: str
    sender_name: str
    message_id: str
    timestamp: str
    type: str
    text: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    image_id: Optional[str] = None
    image_mime: Optional[str] = None
    button_id: Optional[str] = None
    button_title: Optional[str] = None


def parse_webhook(payload: dict) -> List[WebhookMessage]:
    """Parse a Meta whatsapp_business_account webhook payload into WebhookMessage list."""
    messages: List[WebhookMessage] = []
    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            contacts = {
                c["wa_id"]: c["profile"]["name"]
                for c in value.get("contacts", [])
            }
            for msg in value.get("messages", []):
                sender = msg["from"]
                msg_type = msg["type"]
                m = WebhookMessage(
                    sender=sender,
                    sender_name=contacts.get(sender, ""),
                    message_id=msg["id"],
                    timestamp=msg["timestamp"],
                    type=msg_type,
                )
                if msg_type == "text":
                    m.text = msg["text"]["body"]
                elif msg_type == "location":
                    loc = msg["location"]
                    m.latitude = loc["latitude"]
                    m.longitude = loc["longitude"]
                    m.address = loc.get("address")
                elif msg_type == "image":
                    img = msg["image"]
                    m.image_id = img["id"]
                    m.image_mime = img.get("mime_type")
                elif msg_type == "interactive":
                    interactive = msg["interactive"]
                    if interactive["type"] == "button_reply":
                        m.type = "button_reply"
                        m.button_id = interactive["button_reply"]["id"]
                        m.button_title = interactive["button_reply"]["title"]
                messages.append(m)
    return messages
