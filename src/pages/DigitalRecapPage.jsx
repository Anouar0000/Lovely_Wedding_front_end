import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useAuth } from "../components/auth/AuthProvider";
import { createOrder } from "../services/orders";
import { createFlouciPaymentSession, isFlouciLiveMode } from "../services/payments";
import { getDigitalPricing, defaultDigitalPricing } from "../services/pricing";
import { DIGITAL_PRODUCTS } from "./DigitalProductDetailPage";
import {
  DIGITAL_EXTRAS,
  DIGITAL_SECTIONS,
  normalizeAddonIds,
  resolveDigitalExtras,
  resolveDigitalPack,
  resolveDigitalSections,
} from "../data/digital/orderAddons";

const fieldClass =
  "w-full rounded-[5px] border border-[#A19A9A] bg-white px-4 py-3 font-glacial text-[14px] leading-[18px] tracking-normal text-[#4B4242] outline-none transition focus:border-[#A97C72] disabled:opacity-60";

/**
 * Checkout digital — récap + infos client (même design que /checkout)
 */
function DigitalRecapPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const product = DIGITAL_PRODUCTS[slug] || DIGITAL_PRODUCTS["sidi-bousaid"];
  const packBase = resolveDigitalPack(location.state?.pack);
  const extraIds = useMemo(
    () =>
      normalizeAddonIds(
        location.state?.extraIds ?? location.state?.extraId,
        DIGITAL_EXTRAS
      ),
    [location.state]
  );
  const sectionIds = useMemo(
    () =>
      normalizeAddonIds(
        location.state?.sectionIds ?? location.state?.sectionId,
        DIGITAL_SECTIONS
      ),
    [location.state]
  );
  const extrasBase = useMemo(() => resolveDigitalExtras(extraIds), [extraIds]);
  const sectionsBase = useMemo(
    () => resolveDigitalSections(sectionIds),
    [sectionIds]
  );

  const [pricing, setPricing] = useState(defaultDigitalPricing());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

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

  const extras = useMemo(
    () =>
      extrasBase.map((item) => {
        const fromFs = pricing.extras?.[item.id];
        return {
          ...item,
          price: Number(fromFs?.price) || item.price,
          label: fromFs?.label || item.label,
        };
      }),
    [extrasBase, pricing]
  );

  const sections = useMemo(
    () =>
      sectionsBase.map((item) => {
        const fromFs = pricing.sections?.[item.id];
        return {
          ...item,
          price: Number(fromFs?.price) || item.price,
          label: fromFs?.label || item.label,
        };
      }),
    [sectionsBase, pricing]
  );

  const total = useMemo(
    () =>
      pack.price +
      extras.reduce((sum, e) => sum + e.price, 0) +
      sections.reduce((sum, s) => sum + s.price, 0),
    [pack.price, extras, sections]
  );

  const addonLines = useMemo(() => {
    const lines = [];
    extras.forEach((e) => lines.push(`+ ${e.label}`));
    sections.forEach((s) => lines.push(`+ ${s.label}`));
    return lines;
  }, [extras, sections]);

  const closeToExtras = () => {
    navigate(`/invitations-digital/${product.slug}/extras`, {
      state: {
        pack: pack.id,
        extraIds,
        sectionIds,
      },
    });
  };

  const handlePay = async (event) => {
    event?.preventDefault?.();
    setError("");
    setBusy(true);
    try {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        throw new Error("Nom, email et téléphone sont requis.");
      }

      const items = [
        {
          productType: "digital",
          productId: product.slug,
          title: `${product.name} digitale · ${pack.label}`,
          qty: 1,
          unitPrice: pack.price,
          meta: { pack: pack.id },
        },
      ];
      extras.forEach((extra) => {
        items.push({
          productType: "digital",
          productId: product.slug,
          title: extra.label,
          qty: 1,
          unitPrice: extra.price,
          meta: { kind: "extra", extraId: extra.id },
        });
      });
      sections.forEach((section) => {
        items.push({
          productType: "digital",
          productId: product.slug,
          title: section.label,
          qty: 1,
          unitPrice: section.price,
          meta: { kind: "section", sectionId: section.id },
        });
      });

      const orderId = await createOrder({
        items,
        userId: user?.uid || null,
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        shipping: notes.trim() ? { address: "", city: "", notes: notes.trim() } : null,
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
    <>
      <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#F7F2EC] pb-[max(100px,calc(86px+env(safe-area-inset-bottom,0px)))] font-glacial text-[#4B4242]">
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-[428px] flex-1 flex-col pb-[max(100px,calc(86px+env(safe-area-inset-bottom,0px)))] md:max-w-3xl lg:max-w-6xl">
          <header className="flex h-[86px] shrink-0 items-center justify-between border-b border-[#C4BBB3] bg-white px-4 shadow-[0px_1px_5px_rgba(0,0,0,0.08)] lg:px-8">
            <h1 className="font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242] lg:text-[26px]">
              Checkout
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

          <main className="flex flex-1 flex-col bg-[#F7F2EC]">
            <div className="flex min-h-[108px] items-start justify-between gap-3 border-b border-[#C4BBB3] px-4 pt-8 lg:px-8 lg:py-10">
              <div className="min-w-0 flex-1">
                <p className="font-glacial text-[14px] font-bold leading-6 text-[#4B4242] lg:text-[16px]">
                  {product.name} digitale
                </p>
                {addonLines.length > 0 ? (
                  <div className="mt-0.5 max-w-[273px] space-y-0 font-glacial text-[14px] font-normal leading-[18px] tracking-normal text-[#78716C] lg:max-w-xl lg:text-[15px]">
                    {addonLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="mt-0.5 font-glacial text-[14px] font-normal leading-[18px] tracking-normal text-[#78716C]">
                    Forfait {pack.label}
                  </p>
                )}
              </div>
              <p className="shrink-0 pt-0.5 text-right font-glacial text-[14px] font-bold leading-6 text-[#4B4242] lg:text-[16px]">
                {total}dt
              </p>
            </div>

            <form
              id="digital-checkout-form"
              onSubmit={handlePay}
              className="space-y-4 px-4 py-6 lg:px-8 lg:py-8"
            >
              <h2 className="font-lora text-[22px] font-medium leading-[34px] tracking-[-0.22px] text-[#4B4242]">
                Vos informations
              </h2>
              <p className="font-glacial text-[14px] leading-[18px] tracking-normal text-[#78716C]">
                Renseignez vos coordonnées pour finaliser la commande.
              </p>

              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Nom complet
                </span>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={busy}
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Téléphone
                </span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={busy}
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-glacial text-[14px] font-bold text-[#4B4242]">
                  Notes (optionnel)
                </span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={busy}
                  className={fieldClass}
                />
              </label>

              {error ? (
                <p className="rounded-[5px] border border-red-200 bg-red-50 px-4 py-3 font-glacial text-[14px] font-bold text-red-700">
                  {error}
                </p>
              ) : null}
            </form>
          </main>
        </div>

        <p className="sr-only">
          Produit <Link to={`/invitations-digital/${product.slug}`}>{product.name}</Link>
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#C4BBB3] bg-white px-4 shadow-[0_-4px_24px_rgba(75,66,66,0.12)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="mx-auto flex h-[86px] w-full max-w-[428px] items-center justify-center md:max-w-3xl lg:max-w-6xl">
          <button
            type="submit"
            form="digital-checkout-form"
            disabled={busy}
            className="inline-flex h-12 w-[232px] shrink-0 items-center justify-center rounded-full bg-[#A97C72] p-0 font-glacial text-[14px] font-bold leading-6 text-white shadow-[0px_8px_20px_rgba(168,125,115,0.28)] hover:bg-[#966B62] disabled:opacity-60 lg:w-[280px]"
          >
            {busy ? "…" : `Payer ${total}dt en toute sécurité`}
          </button>
        </div>
      </div>
    </>
  );
}

export default DigitalRecapPage;
