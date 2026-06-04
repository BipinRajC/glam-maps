from urllib.parse import urlencode

import httpx


class WabaClient:
    def __init__(self, base_url: str, license_number: str, api_key: str):
        self._base = base_url.rstrip("/")
        self._license = license_number
        self._key = api_key
        self._http = httpx.AsyncClient(timeout=30)

    def _base_params(self, contact: str) -> dict:
        return {
            "LicenseNumber": self._license,
            "APIKey": self._key,
            "Contact": contact,
        }

    def _url(self, endpoint: str, params: dict) -> str:
        return f"{self._base}/{endpoint}?{urlencode(params)}"

    async def send_text(self, contact: str, message: str) -> httpx.Response:
        params = {**self._base_params(contact), "Message": message}
        return await self._http.get(self._url("sendtextmessage.php", params))

    async def send_media(self, contact: str, media_type: str, file_url: str) -> httpx.Response:
        params = {**self._base_params(contact), "Type": media_type, "FileURL": file_url}
        return await self._http.get(self._url("sendmediamessage.php", params))

    async def send_button(
        self,
        contact: str,
        message: str,
        buttons: str,
        header_type: str = "text",
        header_text: str = "",
        header_url: str = "",
        footer_text: str = "",
    ) -> httpx.Response:
        params = {
            **self._base_params(contact),
            "Message": message,
            "Type": "button",
            "HeaderType": header_type,
            "HeaderText": header_text,
            "HeaderURL": header_url,
            "FooterText": footer_text,
            "Button": buttons,
        }
        return await self._http.get(self._url("sendmediamessage.php", params))

    async def send_list(
        self,
        contact: str,
        message: str,
        list_button_text: str,
        section_text: str,
        buttons: str,
        header_type: str = "text",
        header_text: str = "",
        footer_text: str = "",
    ) -> httpx.Response:
        params = {
            **self._base_params(contact),
            "Message": message,
            "Type": "list",
            "HeaderType": header_type,
            "HeaderText": header_text,
            "FooterText": footer_text,
            "ListButtonText": list_button_text,
            "SectionText": section_text,
            "Button": buttons,
        }
        return await self._http.get(self._url("sendmediamessage.php", params))

    async def close(self) -> None:
        await self._http.aclose()
