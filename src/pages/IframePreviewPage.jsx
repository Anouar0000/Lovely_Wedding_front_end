import React, { useEffect, useState } from "react";
import { getDigitalInviteTemplate } from "../templates/digitalInviteTemplates";
import sidiBouSaidFullReference from "../assets/digital/sidi-bousaid/fresh-figma/sidi_bou_said_full_reference.png";

export default function IframePreviewPage() {
  const [invite, setInvite] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const [isDiffMode, setIsDiffMode] = useState(false);
  const [isQaExpanded, setIsQaExpanded] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === "UPDATE_INVITE") {
        setInvite(event.data.payload.invite);
        setSelectedElementId(event.data.payload.selectedElementId);
      }
    };
    window.addEventListener("message", handleMessage);
    
    // Notify parent that the iframe has mounted and is ready to receive data
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "IFRAME_READY" }, "*");
    }
    
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!invite) {
    return <div className="min-h-screen bg-[#F6F7F5]" />;
  }

  const template = getDigitalInviteTemplate(invite.template);
  if (!template || !template.Component) {
    return <div className="p-4 text-center text-red-500">Template non trouvé.</div>;
  }
  
  const Component = template.Component;
  const bgColor = invite?.backgroundColor || "#DCEBF0";

  return (
    <div className="min-h-screen relative overflow-x-hidden overflow-y-auto" style={{ width: 430, minWidth: 430, maxWidth: 430, margin: '0 auto', backgroundColor: bgColor }}>
      {/* Active Template Component */}
      <Component
        invite={invite}
        editable={true}
        selectedElementId={selectedElementId}
        onSelectElement={(id) => {
          if (window.parent && window.parent !== window) {
             window.parent.postMessage({ type: "SELECT_ELEMENT", id }, "*");
          }
        }}
      />

      {/* Figma Reference Image Overlay */}
      {overlayOpacity > 0 && (
        <img
          src={sidiBouSaidFullReference}
          alt="Figma Reference"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "430px",
            height: "4017px",
            opacity: overlayOpacity,
            pointerEvents: "none",
            mixBlendMode: isDiffMode ? "difference" : "normal",
            zIndex: 9999,
          }}
        />
      )}

      {/* Slide-under Arrow Toggle QA Toolbar */}
      <div
        style={{
          position: "fixed",
          bottom: isQaExpanded ? "12px" : "-46px",
          left: "50%",
          transform: "translateX(-50%)",
          transition: "bottom 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 100000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Toggle Arrow Handle Tab */}
        <button
          type="button"
          onClick={() => setIsQaExpanded(!isQaExpanded)}
          title={isQaExpanded ? "Masquer le menu QA" : "Afficher le menu QA"}
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.92)",
            backdropFilter: "blur(10px)",
            color: "#38BDF8",
            border: "1px solid rgba(255,255,255,0.15)",
            borderBottom: isQaExpanded ? "none" : undefined,
            borderRadius: "12px 12px 0 0",
            padding: "3px 14px",
            fontSize: "11px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <span style={{ fontSize: "10px" }}>{isQaExpanded ? "▼" : "▲"}</span>
          <span style={{ fontSize: "10px", fontWeight: 600 }}>QA</span>
        </button>

        {/* Toolbar Body */}
        <div
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.94)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#9CA3AF", marginRight: "2px" }}>Overlay:</span>
          {[0, 0.25, 0.5, 0.75, 1].map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => setOverlayOpacity(op)}
              style={{
                backgroundColor: overlayOpacity === op ? "#2563EB" : "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                padding: "3px 7px",
                cursor: "pointer",
                fontSize: "10px",
                fontWeight: overlayOpacity === op ? "bold" : "normal",
              }}
            >
              {op === 0 ? "Off" : `${op * 100}%`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsDiffMode(!isDiffMode)}
            style={{
              marginLeft: "4px",
              backgroundColor: isDiffMode ? "#DC2626" : "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              padding: "3px 7px",
              cursor: "pointer",
              fontSize: "10px",
              fontWeight: isDiffMode ? "bold" : "normal",
            }}
          >
            {isDiffMode ? "Diff: ON" : "Diff: OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}
