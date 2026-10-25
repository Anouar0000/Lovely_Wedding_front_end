import React from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../../../context/FavoritesContext";
import FavoritesHeartIcon from "../../icons/FavoritesHeartIcon";
import { homePhysicalAssets as a } from "../homePhysicalAssets";

const products = [
  {
    id: "versailles",
    name: "Versailles",
    img: a.productVersailles,
    price: "Start at 49$",
    category: "Rustique",
  },
  {
    id: "sacre-coeur",
    name: "Sacré cœur",
    img: a.productSacreCoeur,
    price: "Start at 49$",
    category: "Outeya",
  },
  {
    id: "aime",
    name: "Aimé",
    img: a.productAime,
    price: "Start at 49$",
    category: "Cire",
  },
  {
    id: "passeport-rose",
    name: "Passeport rosé",
    img: a.productPasseport,
    price: "Start at 49$",
    category: "Rustique",
  },
];

const openPhysicalProduct = (navigate, p) => {
  navigate(`/invitation-model/${encodeURIComponent(p.name)}`, {
    state: {
      model: {
        name: p.name,
        price: Number(p.unitPrice) || 1.5,
        unitPrice: Number(p.unitPrice) || 1.5,
        image: p.img,
        templateId: p.name,
      },
      productId: p.id,
      selectedCategory: p.category,
    },
  });
};

/** Invitations physiques — parity Digitale (grid, favoris, prix bold) */
function PhysicalBestsellersSection() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="bg-white px-0 py-8 lg:px-8 lg:py-24">
      <div className="mx-auto w-full max-w-[428px] lg:max-w-6xl">
        <div className="mx-auto flex w-[399px] max-w-[calc(100%-16px)] flex-col items-center gap-3 text-center lg:w-full lg:max-w-2xl">
          <h2 className="font-lora text-[26px] font-medium leading-[30px] text-lw-text lg:text-[40px] lg:leading-tight">
            Invitations physiques
          </h2>
          <p className="font-glacial text-[16px] font-normal leading-6 text-lw-muted lg:text-[20px] lg:leading-7">
            Une invitation personnalisée, imprimée
            <br className="lg:hidden" />
            <span className="hidden lg:inline"> </span>
            avec soin pour votre grand jour.
          </p>
        </div>

        <div className="mt-[35px] grid grid-cols-2 justify-items-center gap-x-4 gap-y-10 px-4 lg:mt-14 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-14 lg:px-0">
          {products.map((p) => {
            const liked = isFavorite(p.id);
            return (
              <article key={p.id} className="lw-product-card group flex w-[189px] flex-col">
                <div className="relative">
                  <button
                    type="button"
                    aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
                    aria-pressed={liked}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite({
                        id: p.id,
                        title: p.name,
                        to: `/invitation-model/${encodeURIComponent(p.name)}`,
                        image: p.img,
                        productType: "print",
                      });
                    }}
                    className="absolute right-2 top-2 z-30 flex h-8 w-8 items-center justify-center text-[#E23D48] transition-transform active:scale-90 lg:right-3 lg:top-3"
                  >
                    <FavoritesHeartIcon filled={liked} />
                  </button>
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => openPhysicalProduct(navigate, p)}
                  >
                    <div className="relative h-[224px] w-[189px] overflow-hidden rounded-[5px] bg-[#fffaed]">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 lg:group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-[9px] font-lora text-[18px] font-normal leading-[34px] tracking-[-1px] text-[#4B4242]">
                      {p.name}
                    </h3>
                    <p className="mt-[2px] font-glacial text-[14px] font-normal leading-[18px] tracking-normal text-[#78716c]">
                      Impression soignée · papier premium
                    </p>
                    <p className="mt-[2px] font-glacial text-[14px] font-bold leading-[24px] text-lw-text">
                      {p.price}
                    </p>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-[42px] flex justify-center lg:mt-16">
          <button
            type="button"
            onClick={() => navigate("/invitations-physique")}
            className="inline-flex h-12 items-center gap-1.5 font-glacial text-[14px] font-bold leading-[24px] text-[#A97C72] underline-offset-4 hover:underline"
          >
            Découvrir toute la collection
            <span aria-hidden className="text-[14px] font-bold leading-[24px]">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default PhysicalBestsellersSection;
