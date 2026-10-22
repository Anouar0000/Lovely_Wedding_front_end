import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import DigitalHomeHeader from "../components/home/DigitalHomeHeader";
import { useAuth } from "../components/auth/AuthProvider";
import { createOrder } from "../services/orders";
import { createFlouciPaymentSession, isFlouciLiveMode } from "../services/payments";
import { DIGITAL_PRODUCTS } from "./DigitalProductDetailPage";
import {
  resolveDigitalExtra,
  resolveDigitalPack,
  resolveDigitalSection,
} from "../data/digital/orderAddons";

/**
 * Récapitulatif commande digitale — Figma 1319:1054 / Checkout.png
 */
function DigitalRecapPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const product = DIGITAL_PRODUCTS[slug] || DIGITAL_PRODUCTS["sidi-bousaid"];
  const pack = resolveDigitalPack(location.state?.pack);
  const extra = resolveDigitalExtra(location.state?.extraId);
  const section = resolveDigitalSection(location.state?.sectionId);

  const total = useMemo(
    () => pack.price + (extra?.price || 0) + (section?.price || 0),
    [pack.price, extra, section]
  );

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
          unitPrice: pack.price,
          format: "",
          motif: "",
          meta: { pack: pack.id },
        },
      ];
      if (extra) {
        items.push({
          productType: "digital",
          productId: `${product.slug}-extra-${extra.id}`,
          title: extra.label,
          qty: 1,
          unitPrice: extra.price,
          format: "",
          motif: "",
          meta: { kind: "extra", extraId: extra.id },
        });
      }
      if (section) {
        items.push({
          productType: "digital",
          productId: `${product.slug}-section-${section.id}`,
          title: section.label,
          qty: 1,
          unitPrice: section.price,
          format: "",
          motif: "",
          meta: { kind: "section", sectionId: section.id },
        });
      }

      const orderId = await createOrder({
        items,
        userId: user?.uid || null,
        customer: {
          fullName: user?.displayName || "",
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white font-glacial text-lw-text">
      <DigitalHomeHeader mode="none" context="digitale" />

      <header className="mx-auto flex w-full max-w-[428px] items-center justify-between border-b border-[#E8E0D8] px-4 py-4 lg:max-w-xl lg:px-8">
        <h1 className="font-lora text-[26px] font-medium leading-9 tracking-[-0.26px] text-[#4B4242]">
          Récapitulatif
        </h1>
        <button
          type="button"
          onClick={closeToExtras}
          className="rounded p-2 text-[#4B4242] hover:bg-[#F7F2EC]"
          aria-label="Fermer"
        >
          <FiX className="size-5" strokeWidth={1.5} />
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-[428px] flex-1 flex-col bg-[#F7F2EC] lg:max-w-xl">
        <div className="border-b border-[#E8E0D8] px-4 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-glacial text-[16px] font-bold leading-6 text-[#4B4242]">
                {product.name} digitale
              </p>
              <ul className="mt-2 space-y-1">
                {extra ? (
                  <li className="font-glacial text-[14px] leading-[18px] text-[#78716c]">
                    + {extra.label}
                  </li>
                ) : null}
                {section ? (
                  <li className="font-glacial text-[14px] leading-[18px] text-[#78716c]">
                    + {section.label}
                  </li>
                ) : null}
                <li className="font-glacial text-[14px] leading-[18px] text-[#78716c]">
                  Forfait {pack.label}
                </li>
              </ul>
            </div>
            <p className="shrink-0 font-glacial text-[16px] font-bold leading-6 text-[#4B4242]">
              {total}dt
            </p>
          </div>
        </div>

        {error ? (
          <p className="mx-4 mt-4 rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}

        <div className="flex-1" />

        <div className="bg-white px-4 py-5">
          <button
            type="button"
            disabled={busy}
            onClick={handlePay}
            className="mx-auto flex h-[48px] w-full max-w-[360px] items-center justify-center rounded-full bg-[#A97C72] px-6 font-glacial text-[14px] font-bold text-white shadow-[0px_8px_10px_rgba(168,125,115,0.28)] hover:bg-[#966B62] disabled:opacity-60"
          >
            {busy ? "…" : `Payer ${total}dt en toute sécurité`}
          </button>
          <p className="mt-3 text-center font-glacial text-[12px] text-[#7D6E66]">
            Ou{" "}
            <Link
              to={product.demoTo}
              state={{ pack: pack.id, extraId: extra?.id, sectionId: section?.id }}
              className="font-semibold text-[#A97C72] underline"
            >
              personnaliser l&apos;invitation
            </Link>{" "}
            d&apos;abord
          </p>
        </div>
      </main>
    </div>
  );
}

export default DigitalRecapPage;
