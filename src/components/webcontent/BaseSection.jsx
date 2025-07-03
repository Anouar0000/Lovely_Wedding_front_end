import React from "react";
import { useNavigate } from "react-router-dom";

function BaseSection({ title, description, setSelectedCategory }) {
  const navigate = useNavigate();

  // THE FIX: We determine if we are on a specific category page.
  // The `title` prop will be a non-empty string if a category is selected.
  const isCategoryPage = title && title.length > 0;

  return (
    <section className="w-full pt-24 max-w-full mx-auto p-4 bg-gray-100 flex flex-col justify-center items-center">
      {/* Breadcrumb Navigation */}
      <div className="w-full text-xs font-urbanist flex items-center space-x-2">
        {/* Accueil Link */}
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer hover:underline"
        >
          Accueil
        </span>
        <span>{">"}</span>
        
        {/* Invitations Physique Link */}
        <span
          onClick={() => {
            setSelectedCategory("");
            navigate("/invitations-physique");
          }}
          // THE FIX: Use a template literal to conditionally add the 'font-bold' class.
          // If we are NOT on a category page, this part is bold.
          className={`cursor-pointer hover:underline ${
            !isCategoryPage ? "font-bold text-black" : ""
          }`}
        >
          Invitations Physique
        </span>
        
        {/* Category Title (if it exists) */}
        {isCategoryPage && (
          <>
            <span>{">"}</span>
            {/* THE FIX: This part is now a simple, non-clickable bold span. */}
            <span className="font-bold text-black">{title}</span>
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