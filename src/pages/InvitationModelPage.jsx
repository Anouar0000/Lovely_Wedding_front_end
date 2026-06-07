import React, { useState, useEffect, useRef, useMemo  } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import { FiChevronDown, FiX } from "react-icons/fi";
import ExpandableSections from "../components/webcontent/ExpandableSections";
import data from "../data/categories.json";

function InvitationModelPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const model = location.state?.model;
    const selectedCategory = location.state?.selectedCategory || model.name.split(" ")[1];

    const [popup, setPopup] = useState(null);
    const popupRef = useRef(null);

    // State for selections
    const [qté, setQté] = useState("");
    const [format, setFormat] = useState("");
    const [motif, setMotif] = useState("");

     // --- NEW: LOGIC TO GET RECOMMENDED MODELS ---
    const recommendedModels = useMemo(() => {
        // Ensure we have a category and that it exists in our data
        if (!selectedCategory || !data.models[selectedCategory]) {
            return [];
        }
        // 1. Get all models from the same category
        const allModelsInCategory = data.models[selectedCategory];

        // 2. Filter out the current model to get the recommendations
        return allModelsInCategory.filter(m => m.name !== model.name);

    }, [model.name, selectedCategory]);

    const openPopup = (label) => {
        setPopup(label);
        document.body.style.overflow = "hidden"; // Disable scrolling
    };

    const closePopup = () => {
        setPopup(null);
        document.body.style.overflow = "auto"; // Re-enable scrolling
    };

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopup();
            }
        };

        if (popup) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popup]);

    // Options for each dropdown
    const quantityOptions = [100, 120, 150, 170, 200, 220, 250, 270];
    const formatOptions = ["Page plié (9.5 x 21 cm)", "Page simple (10 x 15 cm)", "Carré (14 x 14 cm)"];
    const motifOptions = ["Bagues Doré", "Fleurs Blanches", "Motif Classique"];

    // Check if all required fields are filled
    const isFormValid = qté && format && motif;

    // Handle personalization navigation
    const handlePersonalize = () => {
        if (isFormValid) {
            navigate("/personalize", {
                state: {
                    model,
                    qté,
                    format,
                    motif
                }
            });
        }
    };

    if (!model) return <div className="text-center p-6">No model selected.</div>;

    return (
        <div className="font-sans flex flex-col min-h-screen bg-gray-100">
            <Header />

            {/* Breadcrumb Navigation */}
            <div className="mx-auto w-full max-w-6xl text-xs font-urbanist px-6 pt-10 flex items-center space-x-2 overflow-hidden whitespace-nowrap">
                <span className="cursor-pointer hover:underline" onClick={() => navigate("/")}>
                    Accueil
                </span>
                <span>{">"}</span>
                <span className="cursor-pointer hover:underline" onClick={() => navigate("/invitations-physique")}>
                    Invitations Physique
                </span>
                <span>{">"}</span>
                <span className="cursor-pointer hover:underline" 
                onClick={() => navigate(`/invitations-physique`,
                {state: {selectedCategory },})}>
                    {selectedCategory}
                </span>
                <span>{">"}</span>
                <span className="truncate flex-1 font-bold">{model.name}</span>
                </div>

            <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start lg:px-6">
            {/* Model Image */}
            <div className="bg-white p-4 lg:sticky lg:top-6">
                <img src={require(`../${model.thumbnail}`)} alt={model.name} className="h-[450px] w-full lg:mx-auto lg:h-[640px] lg:object-contain" />
            </div>

            {/* Model Details */}
            <div className="px-0 lg:bg-white lg:p-6">
                <h1 className="text-xl font-bold lg:text-3xl">{model.name}</h1>
                <h2 className="text-gray-500">{selectedCategory || "Invitations Physique"}</h2>

                {/* Dropdown Selections */}
                <div className="mt-10 space-y-4 border-t border-gray-400">
                    {[
                        { label: "Quantité", value: qté },
                        { label: "Format", value: format },
                        { label: "Motif", value: motif },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex justify-between items-center border-b mt-4 -mx-2 px-2 py-3 border-gray-400 cursor-pointer transition-colors hover:bg-gray-50"
                            onClick={() => openPopup(label)}
                        >
                            <span>{label} :</span>
                            <span className={`text-gray-500 ${value ? "text-black" : ""}`}>
                                {value || "Sélectionner"}
                            </span>
                            <FiChevronDown />
                        </div>
                    ))}
                </div>

                {/* Pricing and Personalization */}
                <div className="px-0 mt-10 text-center">
                    <p className="text-lg font-bold">À partir de {model.price}DT la pièce</p>
                    <button
                        className={`px-6 py-4 mt-2 w-full font-urbanist ${
                            isFormValid ? "bg-black text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                        }`}
                        onClick={handlePersonalize}
                        disabled={!isFormValid}
                    >
                        PERSONNALISER
                    </button>
                </div>

                <ExpandableSections className="mt-10" />
            </div>
            </main>

            {recommendedModels.length > 0 && (
                <section className="mx-auto w-full max-w-6xl p-2">
                    <h2 className="text-center text-xl font-abhaya mb-6">Autres Recommendation</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-10 px-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                        {/* Map over the NEW recommendedModels array */}
                        {recommendedModels.map((recModel) => (
                            <div
                                key={recModel.name} // Use a unique key like the name
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() =>
                                    // Navigate to the new model's page
                                    navigate(`/invitation-model/${encodeURIComponent(recModel.name)}`, {
                                        state: { model: recModel, selectedCategory }, // Pass the new model's data
                                    })
                                }
                            >
                                <div className="bg-gray-200 h-44 w-full flex items-center justify-center overflow-hidden md:h-auto md:aspect-[3/4]">
                                    <img
                                        src={require(`../${recModel.thumbnail}`)}
                                        alt={recModel.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <h1 className="mt-2 text-sm font-bold text-left w-full font-urbanist">{recModel.name}</h1>
                                <p className="text-sm text-left w-full font-urbanist">à partir de {recModel.price}DT</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {/* Popup Modal for Selection */}
            {popup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
                    <div ref={popupRef} className="max-h-[75vh] w-full overflow-hidden rounded-t-lg bg-white p-4 sm:max-w-md sm:rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">{popup}</h2>
                            <FiX className="text-xl cursor-pointer" onClick={closePopup} />
                        </div>

                        <div className="max-h-[58vh] space-y-2 overflow-y-auto pr-1">
                            {popup === "Quantité" &&
                                quantityOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center border-b px-3 py-3 cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100"
                                        onClick={() => {
                                            setQté(`${option} (à 1.5DT l’unité)`);
                                            closePopup();
                                        }}
                                    >
                                        <span>{option} (à 1.5DT l’unité)</span>
                                        <span className="font-bold">{option * 1.5}DT</span>
                                    </div>
                                ))}

                            {popup === "Format" &&
                                formatOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center border-b px-3 py-3 cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100"
                                        onClick={() => {
                                            setFormat(option);
                                            closePopup();
                                        }}
                                    >
                                        <span>{option}</span>
                                    </div>
                                ))}

                            {popup === "Motif" &&
                                motifOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center border-b px-3 py-3 cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100"
                                        onClick={() => {
                                            setMotif(option);
                                            closePopup();
                                        }}
                                    >
                                        <span>{option}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default InvitationModelPage;
