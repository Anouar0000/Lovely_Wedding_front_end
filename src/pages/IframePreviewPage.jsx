import React, { useEffect, useState } from "react";
import { getDigitalInviteTemplate } from "../templates/digitalInviteTemplates";

export default function IframePreviewPage() {
  const [invite, setInvite] = useState(null);
  const [selectedElementId, setSelectedElementId] = useState(null);

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
    return <div className="p-4 text-center text-red-500">Template non trouve.</div>;
  }
  
  const Component = template.Component;

  return (
    <div className="w-full min-h-screen bg-white relative overflow-x-hidden overflow-y-auto" style={{ maxWidth: 430, margin: '0 auto' }}>
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
    </div>
  );
}
