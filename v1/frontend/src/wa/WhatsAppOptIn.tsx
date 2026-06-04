import { useState } from "react";
import { subscribeWhatsApp } from "@/api/client";

interface Props {
  routeId: string;
  onSubscribed: (sessionId: string) => void;
  onSkip: () => void;
}

export function WhatsAppOptIn({ routeId, onSubscribed, onSkip }: Props) {
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const cleaned = phone.replace(/[\s-]/g, "");
    if (!/^\+?91\d{10}$/.test(cleaned)) {
      setError("Enter a valid Indian mobile number (+91XXXXXXXXXX)");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { sessionId } = await subscribeWhatsApp(cleaned, routeId);
      onSubscribed(sessionId);
    } catch {
      setError("Could not subscribe. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "white",
          borderRadius: "20px 20px 0 0",
          padding: 24,
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Get alerts on WhatsApp?
        </h3>
        <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
          We'll send pothole alerts during your journey and your Glam Score at the end.
        </p>

        <input
          type="tel"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 16,
            border: "1.5px solid #D1D5DB",
            borderRadius: 10,
            marginBottom: 8,
            outline: "none",
          }}
        />
        {error && (
          <p style={{ color: "#DC2626", fontSize: 13, marginBottom: 8 }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            width: "100%",
            padding: 14,
            background: "#25D366",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: submitting ? "default" : "pointer",
            marginBottom: 10,
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Sending…" : "Subscribe"}
        </button>

        <button
          onClick={onSkip}
          style={{
            width: "100%",
            padding: 12,
            background: "transparent",
            border: "none",
            color: "#6B7280",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
