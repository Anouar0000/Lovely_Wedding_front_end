import React from "react";

/**
 * CelestialOrbit
 * 
 * Celestial planetary orbital diagram based on Figma node 1268-90.
 * Center of the celestial system: cx = 197.177, cy = 239.226
 * 
 * Strictly Halved Top-Half Motion:
 * - Planets travel exclusively along the 160° upper sky dome (-150° left horizon to +10° right horizon).
 * - The bottom half is completely eliminated (never traveled).
 * - Continuous Outer Track: seamless solid arc from edge to edge with ZERO empty space gap.
 * - Stacking & Occlusion:
 *   - Glides OVER "To celebrate their wedding ceremony" (zIndex: 4 vs zIndex: 3).
 *   - Dips BEHIND the Reveal section horizon (occluded by black arch curtain at zIndex: 5).
 * - Dynamic Speeds:
 *   - Inner Small Planet: 3.2s period (on shorter orbit)
 *   - Mid Planet: 4.0s period
 *   - Crescent Moon: 8.5s period (upright lunar tilt preserved)
 *   - Saturn: 13.0s period (slow majestic orbit, 25° ring tilt preserved via counter-rotation)
 * - 'animated' prop: when set to false, instantly renders the exact original static Figma graphic.
 */
export default function CelestialOrbit({
  style = {},
  themeBg = "#ECE5DF",
  animated = true,
  className = "",
}) {
  return (
    <div
      className={`celestial-orbit-wrapper ${className}`}
      style={{
        width: "430px",
        height: "479px",
        position: "absolute",
        pointerEvents: "none",
        userSelect: "none",
        overflow: "visible",
        ...style,
      }}
    >
      {animated && (
        <style>
          {`
            /* =========================================================================
               STRICTLY HALVED TOP-HALF ONLY MOTION
               - Traverses 160° upper sky dome (-150° left horizon to +10° right horizon)
               - The bottom half is completely eliminated (never traveled)
               - Over the story subtitle at zIndex: 4, behind reveal horizon at zIndex: 5
               ========================================================================= */

            /* Inner Small Planet on Shorter Orbit (3.2s top-half period: -60° left to +100° right) */
            @keyframes topHalfOnlyInner {
              0%   { transform: rotate(-60deg); opacity: 0; }
              5%   { opacity: 1; }
              88%  { transform: rotate(100deg); opacity: 1; }
              92%  { transform: rotate(100deg); opacity: 0; }
              94%  { transform: rotate(-60deg); opacity: 0; }
              100% { transform: rotate(-60deg); opacity: 0; }
            }

            /* Mid Planet (4.0s top-half period: -44° left to +116° right) */
            @keyframes topHalfOnlyMid {
              0%   { transform: rotate(-44deg); opacity: 0; }
              5%   { opacity: 1; }
              88%  { transform: rotate(116deg); opacity: 1; }
              92%  { transform: rotate(116deg); opacity: 0; }
              94%  { transform: rotate(-44deg); opacity: 0; }
              100% { transform: rotate(-44deg); opacity: 0; }
            }

            /* Saturn (13.0s top-half period: -104° left to +56° right, slower majestic motion with upright 25° rings) */
            @keyframes topHalfOnlySaturn {
              0%   { transform: rotate(-104deg); opacity: 0; }
              5%   { opacity: 1; }
              88%  { transform: rotate(56deg); opacity: 1; }
              92%  { transform: rotate(56deg); opacity: 0; }
              94%  { transform: rotate(-104deg); opacity: 0; }
              100% { transform: rotate(-104deg); opacity: 0; }
            }
            @keyframes topHalfOnlySaturnCounter {
              0%   { transform: rotate(104deg); }
              88%  { transform: rotate(-56deg); }
              92%  { transform: rotate(-56deg); }
              94%  { transform: rotate(104deg); }
              100% { transform: rotate(104deg); }
            }

            /* Crescent Moon (8.5s top-half period: -69° left to +91° right, upright lunar tilt) */
            @keyframes topHalfOnlyCrescent {
              0%   { transform: rotate(-69deg); opacity: 0; }
              5%   { opacity: 1; }
              88%  { transform: rotate(91deg); opacity: 1; }
              92%  { transform: rotate(91deg); opacity: 0; }
              94%  { transform: rotate(-69deg); opacity: 0; }
              100% { transform: rotate(-69deg); opacity: 0; }
            }
            @keyframes topHalfOnlyCrescentCounter {
              0%   { transform: rotate(69deg); }
              88%  { transform: rotate(-91deg); }
              92%  { transform: rotate(-91deg); }
              94%  { transform: rotate(69deg); }
              100% { transform: rotate(69deg); }
            }

            .celestial-anim-inner {
              transform-origin: 197.177px 239.226px;
              animation: topHalfOnlyInner 3.2s linear infinite -1.0s;
              will-change: transform, opacity;
            }

            .celestial-anim-mid {
              transform-origin: 197.177px 239.226px;
              animation: topHalfOnlyMid 4.0s linear infinite -1.2s;
              will-change: transform, opacity;
            }

            .celestial-anim-saturn {
              transform-origin: 197.177px 239.226px;
              animation: topHalfOnlySaturn 13.0s linear infinite -6.0s;
              will-change: transform, opacity;
            }
            .celestial-anim-saturn-counter {
              transform-origin: 351.18px 80.51px;
              animation: topHalfOnlySaturnCounter 13.0s linear infinite -6.0s;
              will-change: transform;
            }

            .celestial-anim-crescent {
              transform-origin: 197.177px 239.226px;
              animation: topHalfOnlyCrescent 8.5s linear infinite -4.0s;
              will-change: transform, opacity;
            }
            .celestial-anim-crescent-counter {
              transform-origin: 231.74px 10.78px;
              animation: topHalfOnlyCrescentCounter 8.5s linear infinite -4.0s;
              will-change: transform;
            }
          `}
        </style>
      )}

      <svg
        width="430"
        height="479"
        viewBox="0 0 430 479"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible" }}
      >
        {/* =========================================================================
            1. AUTHENTIC ORIGINAL FIGMA ORBITAL TRACKS
            ========================================================================= */}
        <g id="celestial-tracks">
          {/* Inner concentric ring pair */}
          <path
            d="M197.177 367.076C267.773 367.076 325.003 309.835 325.003 239.226C325.003 168.617 267.773 111.376 197.177 111.376C126.581 111.376 69.3516 168.617 69.3516 239.226C69.3516 309.835 126.581 367.076 197.177 367.076Z"
            stroke="black"
            strokeWidth="0.75"
            strokeMiterlimit="10"
          />
          <path
            d="M197.177 354.324C260.732 354.324 312.253 302.793 312.253 239.226C312.253 175.659 260.732 124.128 197.177 124.128C133.622 124.128 82.1011 175.659 82.1011 239.226C82.1011 302.793 133.622 354.324 197.177 354.324Z"
            stroke="black"
            strokeWidth="0.75"
            strokeMiterlimit="10"
          />

          {/* Middle double-ring open arcs */}
          <path
            d="M47.4253 325.498C66.4199 358.474 95.766 384.256 130.909 398.844C166.052 413.431 205.027 416.009 241.784 406.176C278.542 396.343 311.026 374.649 334.196 344.462C357.366 314.275 369.926 277.283 369.926 239.226C369.926 201.169 357.366 164.177 334.196 133.99C311.026 103.803 278.542 82.1091 241.784 72.2761C205.027 62.4431 166.052 65.0205 130.909 79.6083C95.766 94.1961 66.4199 119.978 47.4253 152.954"
            stroke="black"
            strokeWidth="0.75"
            strokeMiterlimit="10"
          />
          <path
            d="M41.4556 331.594C61.6919 365.715 92.5731 392.243 129.351 407.1C166.13 421.957 206.769 424.32 245.021 413.827C283.273 403.333 317.02 380.563 341.073 349.018C365.127 317.472 378.155 278.898 378.155 239.226C378.155 199.554 365.127 160.98 341.073 129.434C317.02 97.8892 283.273 75.1192 245.021 64.6254C206.769 54.1316 166.13 56.4948 129.351 71.3518C92.5731 86.2088 61.6919 112.737 41.4556 146.858"
            stroke="black"
            strokeWidth="0.75"
            strokeMiterlimit="10"
          />

          {/* Outer continuous arc: COMPLETE SOLID ARC WITH NO EMPTY SPACE! */}
          <path
            d="M 0.365234 120.406 A 229.89 229.89 0 1 1 0.365234 358.046"
            stroke="black"
            strokeWidth="0.75"
            strokeMiterlimit="10"
          />
        </g>

        {/* =========================================================================
            2. MID PLANET (4.0s top-half only motion)
            ========================================================================= */}
        <g id="body-mid-planet" className={animated ? "celestial-anim-mid" : undefined}>
          <path
            d="M150.665 57.6745C151.857 58.557 152.767 59.7672 153.284 61.1577C153.801 62.5482 153.902 64.0589 153.576 65.506C153.385 66.3168 153.056 67.0891 152.605 67.7893C151.941 68.8113 151.047 69.6638 149.995 70.2783C148.942 70.8928 147.761 71.2524 146.544 71.3283C144.626 71.3771 142.751 70.7481 141.251 69.5518C139.75 68.3554 138.718 66.6683 138.338 64.7868C138.244 63.3059 138.558 61.8276 139.247 60.513C139.935 59.1985 140.971 58.0982 142.241 57.332C143.534 56.5849 145.011 56.2204 146.503 56.281C147.994 56.3417 149.438 56.8249 150.665 57.6745Z"
            fill="black"
          />
        </g>

        {/* =========================================================================
            3. CRESCENT MOON (8.5s top-half only motion, upright counter-rotation)
            ========================================================================= */}
        <g id="body-crescent-moon" className={animated ? "celestial-anim-crescent" : undefined}>
          <g className={animated ? "celestial-anim-crescent-counter" : undefined}>
            <path
              d="M240.208 9.601C240.388 11.7927 239.908 13.9881 238.83 15.9046C237.752 17.8212 236.125 19.3711 234.158 20.355C233.485 20.6898 232.772 20.9354 232.035 21.0857C230.901 21.2659 229.745 21.2659 228.611 21.0857C226.706 20.8497 224.847 20.3262 223.098 19.5331L223.338 18.9965C225.411 19.358 227.545 19.0561 229.437 18.1337C231.328 17.2113 232.881 15.7155 233.873 13.8592C234.536 12.5228 234.924 11.0671 235.014 9.57817C235.243 6.23076 234.218 2.91809 232.138 0.2854C234.261 0.852533 236.164 2.04343 237.603 3.70414C239.041 5.36484 239.949 7.41899 240.208 9.601Z"
              fill="black"
            />
          </g>
        </g>

        {/* =========================================================================
            4. SATURN WITH RINGS (6.5s top-half only motion, upright 25° ring tilt preserved)
            ========================================================================= */}
        <g id="body-saturn" className={animated ? "celestial-anim-saturn" : undefined}>
          <g className={animated ? "celestial-anim-saturn-counter" : undefined}>
            {/* Matching background occlusion disk so tracks don't bleed through Saturn's center */}
            <ellipse
              cx="351.18"
              cy="80.51"
              rx="38"
              ry="20"
              transform="rotate(25, 351.18, 80.51)"
              fill={themeBg}
            />

            {/* Saturn Body & Rings */}
            <path
              d="M385.679 89.948C384.897 92.4915 383.784 94.9212 382.369 97.1745L382.175 97.8709C380.84 97.517 379.516 97.0946 378.214 96.7292C359.851 90.7274 342.104 82.9784 325.219 73.5886L325.516 73.0521C326.527 68.9045 328.398 65.0153 331.006 61.6359C332.447 59.7331 334.093 57.9949 335.914 56.453C340.043 52.8595 345.041 50.4112 350.41 49.3521C356.411 48.3656 362.569 49.1048 368.167 51.4837C373.764 53.8626 378.571 57.7833 382.027 62.7889C384.581 66.7702 386.232 71.2633 386.863 75.9517C387.495 80.6401 387.09 85.4099 385.679 89.9252V89.948Z"
              fill="black"
            />
            <path
              d="M376.229 105.029L376.172 105.223C371.643 108.735 366.28 111.012 360.608 111.829C354.936 112.646 349.149 111.977 343.813 109.886C338.478 107.796 333.776 104.355 330.169 99.9016C326.561 95.4481 324.171 90.1341 323.233 84.4797C328.861 87.1968 334.647 89.5828 340.469 91.9345C352.248 96.6608 364.107 101.456 376.229 105.029Z"
              fill="black"
            />
            <path
              d="M331.006 61.2706C327.349 59.3964 323.278 58.4738 319.17 58.5878C316.465 58.6677 311.18 58.8504 311.043 62.5378C310.906 66.2252 315.609 68.3372 318.325 69.9355C322.48 72.3937 326.699 74.7493 330.983 77.0021C339.24 81.3631 347.69 85.3321 356.334 88.9092C360.801 90.7586 365.305 92.4976 369.848 94.1263C374.313 95.8542 378.875 97.318 383.511 98.5102C385.958 99.1797 388.508 99.3925 391.033 99.1381C392.174 98.9668 393.692 98.4531 394.103 97.2315C394.685 95.5077 392.585 93.9893 391.466 93.0646C389.719 91.6471 387.773 90.4933 385.691 89.6398C385.36 89.5028 385.211 90.0508 385.542 90.1878C387.455 90.9777 389.246 92.0347 390.861 93.3272C391.497 93.824 392.092 94.3698 392.642 94.9597C393.224 95.5876 393.898 96.2612 393.407 97.243C393.2 97.5418 392.937 97.7966 392.631 97.9926C392.325 98.1886 391.984 98.3218 391.626 98.3846C387.882 99.4235 383.34 97.9622 379.756 96.8434C372.291 94.5602 364.917 91.7746 357.704 88.8521C342.987 82.9266 328.796 75.7739 315.278 67.4696C313.429 66.328 311.066 64.5356 311.66 62.0126C312.253 59.4897 315.974 59.3413 317.971 59.1814C322.387 58.8473 326.812 59.6986 330.789 61.6473C331.052 61.7729 331.28 61.3847 331.018 61.2478L331.006 61.2706Z"
              fill="black"
            />
            <path
              d="M335.663 55.8137C329.49 52.7637 322.688 51.1999 315.803 51.2472C312.457 51.2552 309.122 51.6381 305.861 52.3888C303.167 53.0053 300.291 53.8843 298.294 55.8936C293.865 60.3573 297.552 66.5791 301.17 70.1752C306.099 74.8414 311.658 78.7919 317.686 81.9111C323.603 85.0336 329.679 87.8421 335.891 90.3248C342.9 93.2017 349.908 96.0329 356.985 98.7499C364.061 101.467 371.366 103.979 378.728 106.022C382.449 107.057 386.204 107.955 389.994 108.716C393.108 109.497 396.316 109.839 399.525 109.732C402.435 109.481 405.722 108.237 407.046 105.417C408.496 102.369 406.544 99.1837 404.707 96.7978C400.178 90.8807 394.31 86.123 387.586 82.9157C387.3 82.7787 387.049 83.2011 387.334 83.3381C392.822 86.0633 397.753 89.7877 401.876 94.3204C403.965 96.6037 406.898 99.7317 406.944 103.065C407.012 106.935 402.823 108.773 399.536 109.116C396.385 109.225 393.234 108.891 390.176 108.123C386.821 107.46 383.499 106.673 380.212 105.839C373.603 104.07 367.12 101.889 360.705 99.5262C354.291 97.1631 347.933 94.5944 341.587 92.0258C335.697 89.6398 329.808 87.2538 324.078 84.5139C318.503 81.9169 313.181 78.8099 308.178 75.2326C303.693 71.9561 297.004 67.1499 296.867 60.9738C296.696 53.2679 308.281 52.1833 313.817 51.9093C321.261 51.6076 328.672 53.0666 335.446 56.1676C335.686 56.2703 335.891 55.9278 335.663 55.8137Z"
              fill="black"
            />
          </g>
        </g>

        {/* =========================================================================
            5. INNER SMALL PLANET (3.2s top-half only motion directly on the orbit line)
            ========================================================================= */}
        <g id="body-inner-planet" className={animated ? "celestial-anim-inner" : undefined}>
          <circle
            cx="197.177"
            cy="111.376"
            r="4.5"
            fill="black"
          />
        </g>
      </svg>
    </div>
  );
}
