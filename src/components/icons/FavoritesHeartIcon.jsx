import React, { useId } from "react";

/**
 * Cœur favoris Figma 1700:607 — 17×15, stroke weight 1, dégradé #EA5476 → #FF1247
 */
function FavoritesHeartIcon({
  width = 17,
  height = 15,
  filled = false,
  className = "",
  ...rest
}) {
  const uid = useId().replace(/:/g, "");
  const gradId = `fav-heart-${uid}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 16.1645"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...rest}
    >
      <path
        d="M9 15.5L7.7675 14.421C3.39 10.6035 0.5 8.07766 0.5 4.99591C0.5 2.47003 2.557 0.5 5.175 0.5C6.654 0.5 8.0735 1.16213 9 2.20027C9.9265 1.16213 11.346 0.5 12.825 0.5C15.443 0.5 17.5 2.47003 17.5 4.99591C17.5 8.07766 14.61 10.6035 10.2325 14.421L9 15.5Z"
        fill={filled ? `url(#${gradId})` : "none"}
        stroke={`url(#${gradId})`}
        strokeWidth={1}
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradId}
          x1="9"
          y1="0.5"
          x2="9"
          y2="15.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EA5476" />
          <stop offset="1" stopColor="#FF1247" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default FavoritesHeartIcon;
