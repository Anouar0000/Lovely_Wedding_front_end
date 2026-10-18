import React, { useState } from "react";

function scrollToSection(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}

/** Footer — Figma 1702:664 */
function DigitalHomeFooter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setDone(true);
  };

  return (
    <footer className="bg-[#483C38] px-4 pb-10 pt-12 text-[#E8DFD5] lg:px-8 lg:pb-14 lg:pt-16">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <h2 className="text-center font-lora text-[26px] font-medium leading-9 tracking-[-0.01em] text-white lg:text-[40px] lg:leading-tight">
          Rejoignez la communauté
        </h2>
        <p className="mx-auto mt-1 max-w-[372px] text-center font-glacial text-[18px] font-normal leading-6 text-[#E8DFD5] lg:mt-3 lg:max-w-xl">
          Nos nouveautés, inspirations et offres exclusives, une fois par mois.
        </p>

        <form
          onSubmit={onSubmit}
          className="relative mx-auto mt-10 flex h-[50px] w-full max-w-[251px] items-center lg:mt-12 lg:max-w-md"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="h-[42px] w-full rounded-full border border-[#5E554F] bg-[#463E3A] py-2.5 pl-4 pr-[108px] font-glacial text-[14px] leading-[18px] text-[#E8DFD5] outline-none placeholder:text-[#B5AAA0]"
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 flex h-[42px] w-[96px] -translate-y-1/2 items-center justify-center rounded-full bg-[#A97C72] font-glacial text-[14px] font-bold leading-6 text-white hover:bg-[#966B62]"
          >
            S&apos;inscrire
          </button>
        </form>
        {done ? (
          <p className="mt-2 text-center font-glacial text-xs text-[#E8DFD5]/80">
            Merci — inscription enregistrée.
          </p>
        ) : null}

        <div className="mt-12 grid grid-cols-4 gap-2 text-center lg:mt-16 lg:gap-8">
          <div>
            <h3 className="font-glacial text-[14px] font-bold leading-6 text-[#E8DFD5]">SHOP</h3>
            <ul className="mt-2.5 space-y-0 font-glacial text-[14px] font-normal leading-[18px] text-[#E8DFD5]">
              <li>Envelopes</li>
              <li>Liners</li>
              <li>Stamps</li>
            </ul>
          </div>
          <div>
            <h3 className="font-glacial text-[14px] font-bold leading-6 text-[#E8DFD5]">À PROPOS</h3>
            <ul className="mt-2.5 space-y-0 font-glacial text-[14px] font-normal leading-[18px] text-[#E8DFD5]">
              <li>
                <a href="#communaute" className="hover:underline" onClick={(e) => scrollToSection(e, "communaute")}>
                  Community
                </a>
              </li>
              <li>
                <a href="#our-story" className="hover:underline" onClick={(e) => scrollToSection(e, "our-story")}>
                  Our Story
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-glacial text-[14px] font-bold leading-6 text-[#E8DFD5]">HELP</h3>
            <ul className="mt-2.5 space-y-0 font-glacial text-[14px] font-normal leading-[18px] text-[#E8DFD5]">
              <li>
                <a href="#faq" className="hover:underline" onClick={(e) => scrollToSection(e, "faq")}>
                  FAQ
                </a>
              </li>
              <li>Contact</li>
              <li>Shipping</li>
            </ul>
          </div>
          <div>
            <h3 className="font-glacial text-[14px] font-bold leading-6 text-[#E8DFD5]">SUIVEZ-NOUS</h3>
            <ul className="mt-2.5 space-y-0 font-glacial text-[14px] font-normal leading-[18px] text-[#E8DFD5]">
              <li>
                <a
                  href="https://www.instagram.com/invitationsmariagetn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/InvitationsMariage1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-center font-glacial text-[12px] font-normal leading-6 text-[#A79C92] lg:mt-12">
          © 2026 Lovely Invitations · Confidentialité · CGV
        </p>
      </div>
    </footer>
  );
}

export default DigitalHomeFooter;
