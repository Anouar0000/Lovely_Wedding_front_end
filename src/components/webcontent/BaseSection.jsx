import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function BaseSection({ title, description, setSelectedCategory }) {
  const navigate = useNavigate(); // Initialize the navigation hook

  return (
    <section className="w-full pt-24 max-w-full mx-auto p-4 bg-gray-100 flex flex-col justify-center items-center">
      {/* Breadcrumb Navigation */}
      <div className="w-full text-xs font-urbanist flex items-center space-x-2">
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer hover:underline"
        >
          Accueil
        </span>
        <span>{">"}</span>
        <span
          onClick={() => {
            setSelectedCategory(""); // Reset category when clicking "Invitations Physique"
            navigate("/invitations-physique");
          }}
          className="cursor-pointer hover:underline"
        >
          Invitations Physique
        </span>
        {title && (
          <>
            <span>{">"}</span>
            <span>{title}</span>
          </>
        )}
      </div>

      {/* Title and Description */}
      <div className="pt-12 text-center">
        <h1 className="text-2xl font-abhaya mb-4">Invitations Physique {title}</h1>
        <p className="mb-8 font-urbanist">{description}</p>
      </div>
    </section>
  );
}

export default BaseSection;
