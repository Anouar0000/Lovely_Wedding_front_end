import React, { useState } from "react";
import { Link } from "react-router-dom";

function DigitalHomeFooter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <footer className="bg-lw-footer px-4 pb-12 pt-14 text-white lg:px-8 lg:pb-16 lg:pt-20">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-center lw-h1 lg:text-[40px]">
          Join our community
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center lw-sub lg:text-[18px]">
          Classic stationery-inspired designs and Elevate your event with curated envelopes.
        </p>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex max-w-md overflow-hidden rounded-[5px]"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="uiverse@verse.io"
            className="min-w-0 flex-1 border border-lw-accent bg-white px-4 py-3 font-urbanist text-[15px] text-lw-text outline-none"
          />
          <button
            type="submit"
            className="bg-lw-accent px-6 py-3 font-urbanist text-[14px] font-bold text-white hover:bg-lw-accentDark"
          >
            Subscribe
          </button>
        </form>
        {done ? (
          <p className="mt-2 text-center font-urbanist text-xs text-white/80">Merci — inscription UI.</p>
        ) : null}

        <div className="mt-12 grid grid-cols-2 gap-8 text-left sm:grid-cols-4 sm:text-center">
          <div>
            <h3 className="font-urbanist text-[18px] font-medium">SHOP</h3>
            <ul className="mt-3 space-y-2 font-urbanist text-[14px] text-white/90">
              <li>Envelopes</li>
              <li>Liners</li>
              <li>Stamps</li>
            </ul>
          </div>
          <div>
            <h3 className="font-urbanist text-[18px] font-medium">ABOUT</h3>
            <ul className="mt-3 space-y-2 font-urbanist text-[14px] text-white/90">
              <li>Our Story</li>
              <li>Commitments</li>
            </ul>
          </div>
          <div>
            <h3 className="font-urbanist text-[18px] font-medium">HELP</h3>
            <ul className="mt-3 space-y-2 font-urbanist text-[14px] text-white/90">
              <li><a href="#faq">FAQ</a></li>
              <li><Link to="/login">Contact</Link></li>
              <li>Shipping</li>
            </ul>
          </div>
          <div>
            <h3 className="font-urbanist text-[18px] font-medium">SOCIAL</h3>
            <ul className="mt-3 space-y-2 font-urbanist text-[14px] text-white/90">
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center font-urbanist text-[14px] text-white/80">
          © 2026 Your Brand Name. Privacy Policy | Terms
        </p>
      </div>
    </footer>
  );
}

export default DigitalHomeFooter;
