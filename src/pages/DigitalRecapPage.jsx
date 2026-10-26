import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useAuth } from "../components/auth/AuthProvider";
import { createOrder } from "../services/orders";
import { createFlouciPaymentSession, isFlouciLiveMode } from "../services/payments";
import { getDigitalPricing, defaultDigitalPricing } from "../services/pricing";
import { DIGITAL_PRODUCTS } from "./DigitalProductDetailPage";
import {
  resolveDigitalExtra,
  resolveDigitalPack,
  resolveDigitalSection,
} from "../data/digital/orderAddons";

/**
 * Récapitulatif — Figma mobile + shell projet comme les autres pages digitales
 */
function DigitalRecapPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const product = DIGITAL_PRODUCTS[slug] || DIGITAL_PRODUCTS["sidi-bousaid"];
  const packBase = resolveDigitalPack(location.state?.pack);
  const extraBase = resolveDigitalExtra(location.state?.extraId);
  const sectionBase = resolveDigitalSection(location.state?.sectionId);

  const [pricing, setPricing] = useState(defaultDigitalPricing());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const next = await getDigitalPricing();
        if (active) setPricing(next);
      } catch {
        /* keep defaults */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const pack = useMemo(() => {
    const fromFs = pricing.packs?.[packBase.id];
    return {
      ...packBase,
      price: Number(fromFs?.price) || packBase.price,
      label: fromFs?.label || packBase.label,
    };
  }, [packBase, pricing]);

  const extra = useMemo(() => {
    if (!extraBase) return null;
    const fromFs = pricing.extras?.[extraBase.id];
    return {
      ...extraBase,
      price: Number(fromFs?.price) || extraBase.price,
      label: fromFs?.label || extraBase.label,
    };
  }, [extraBase, pricing]);

  const section = useMemo(() => {
    if (!sectionBase) return null;
    const fromFs = pricing.sections?.[sectionBase.id];
    return {
      ...sectionBase,
      price: Number(fromFs?.price) || sectionBase.price,
      label: fromFs?.label || sectionBase.label,
    };
  }, [sectionBase, pricing]);

  const total = useMemo(
    () => pack.price + (extra?.price || 0) + (section?.price || 0),
    [pack.price, extra, section]
  );

  const addonLines = useMemo(() => {
    const lines = [];
    if (extra) lines.push(`+ ${extra.label}`);
    if (section) lines.push(`+ ${section.label}`);
    return lines;
  }, [extra, section]);

  const closeToExtras = () => {
    navigate(`/invitations-digital/${product.slug}/extras`, {
      state: {
        pack: pack.id,
        extraId: extra?.id,
        sectionId: section?.id,
      },
    });
  };

  const handlePay = async () => {
    setError("");
    setBusy(true);
    try {
      const items = [
        {
          productType: "digital",
          productId: product.slug,
          title: `${product.name} digitale · ${pack.label}`,
          qty: 1,
          meta: { pack: pack.id },
        },
      ];
      if (extra) {
        items.push({
          productType: "digital",
          productId: product.slug,
          title: extra.label,
          qty: 1,
          meta: { kind: "extra", extraId: extra.id },
        });
      }
      if (section) {
        items.push({
          productType: "digital",
          productId: product.slug,
          title: section.label,
          qty: 1,
          meta: { kind: "section", sectionId: section.id },
        });
      }

      const orderId = await createOrder({
        items,
        customer: {
          fullName: user?.displayName || user?.email || "Client",
          email: user?.email || "",
          phone: "",
        },
        shipping: null,
      });

      const origin = window.location.origin;
      const successLink = `${origin}/invitations-digital/${product.slug}/merci?orderId=${encodeURIComponent(orderId)}`;
      const failLink = `${origin}/payment/result?status=fail&orderId=${encodeURIComponent(orderId)}`;

      if (isFlouciLiveMode()) {
        const payment = await createFlouciPaymentSession({
          orderId,
          successLink,
          failLink,
        });
        window.location.href = payment.link;
        return;
      }

      navigate(`/invitations-digital/${product.slug}/merci`, {
        state: { orderId, pack: pack.id, total },
      });
    } catch (err) {
      setError(String(err?.message || err?.code || "Impossible de créer la commande."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#F7F2EC] pb-[86px] font-glacial text-[#4B4242]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[428px] flex-1 flex-col pb-[86px] md:max-w-3xl lg:max-w-6xl">
        <header className="flex h-[86px] shrink-0 items-center justify-between border-b-[0.5px] border-[#A19A9A] bg-white px-4 shadow-[0px_1px_5px_rgba(0,0,0,0.08)] lg:px-8">
          <h1 className="font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242] lg:text-[26px]">
            Récapitulatif
          </h1>
          <button
            type="button"
            onClick={closeToExtras}
            className="flex size-6 items-center justify-center text-[#4B4242] hover:opacity-70"
            aria-label="Fermer"
          >
            <FiX className="size-5" strokeWidth={2} />
          </button>
        </header>

        {/* Beige jusqu’à la barre bas — plus de bande blanche */}
        <main className="flex flex-1 flex-col bg-[#F7F2EC]">
          <div className="flex min-h-[108px] items-start justify-between gap-3 border-b-[0.5px] border-[#A19A9A] px-4 pt-8 lg:px-8 lg:py-10">
            <div className="min-w-0 flex-1">
              <p className="font-glacial text-[14px] font-bold leading-6 text-[#4B4242] lg:text-[16px]">
                {product.name} digitale
              </p>
              {addonLines.length > 0 ? (
                <div className="mt-0.5 max-w-[273px] space-y-0 font-glacial text-[14px] font-normal leading-[18px] text-[#78716C] lg:max-w-xl lg:text-[15px]">
                  {addonLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ) : (
                <p className="mt-0.5 font-glacial text-[14px] font-normal leading-[18px] text-[#78716C]">
                  Forfait {pack.label}
                </p>
              )}
            </div>
            <p className="shrink-0 pt-0.5 text-right font-glacial text-[14px] font-bold leading-6 text-[#4B4242] lg:text-[16px]">
              {total}dt
            </p>
          </div>

          {error ? (
            <p className="mx-4 mt-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 lg:mx-8">
              {error}
            </p>
          ) : null}
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t-[0.5px] border-[#A19A9A] bg-white px-4 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="mx-auto flex h-[86px] w-full max-w-[428px] items-center justify-center md:max-w-3xl lg:max-w-6xl">
          <button
            type="button"
            disabled={busy}
            onClick={handlePay}
            className="inline-flex h-12 w-[232px] shrink-0 items-center justify-center rounded-full bg-[#A97C72] p-0 font-glacial text-[14px] font-bold leading-6 text-white shadow-[0px_8px_20px_rgba(168,125,115,0.28)] hover:bg-[#966B62] disabled:opacity-60 lg:w-[280px]"
          >
            {busy ? "…" : `Payer ${total}dt en toute sécurité`}
          </button>
        </div>
      </div>

      <p className="sr-only">
        Produit <Link to={`/invitations-digital/${product.slug}`}>{product.name}</Link>
      </p>
    </div>
  );
}

export default DigitalRecapPage;
