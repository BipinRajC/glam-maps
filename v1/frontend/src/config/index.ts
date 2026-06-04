export const config = {
  mapsApiKey: import.meta.env.VITE_MAPS_BROWSER_KEY ?? "",
  campaignToken: import.meta.env.VITE_CAMPAIGN_TOKEN ?? "changeme",
  journeyDefaultMode: (import.meta.env.VITE_JOURNEY_MODE ?? "simulated") as
    | "simulated"
    | "gps",
};
