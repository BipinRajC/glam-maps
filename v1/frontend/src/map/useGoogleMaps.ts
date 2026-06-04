import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";
import { config } from "@/config";

let loaderPromise: Promise<void> | null = null;

export function useGoogleMaps(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loaderPromise) {
      const loader = new Loader({
        apiKey: config.mapsApiKey,
        version: "weekly",
        libraries: ["geometry", "marker"],
      });
      loaderPromise = loader.load().then(() => undefined);
    }
    loaderPromise!.then(() => setReady(true)).catch(() => setReady(false));
  }, []);

  return ready;
}
