import React, { useState, useEffect } from 'react';
import { AiOutlineColumnHeight, AiOutlineFontSize } from "react-icons/ai";
import { CiTextAlignCenter, CiTextAlignLeft, CiTextAlignRight } from "react-icons/ci";
import data from "../../data/categories.json";

function BottomMenu({ 
    activeTab, setActiveTab, fontSize, setFontSize, alignment, setAlignment, fontFamily, 
    setFontFamily, setTextColor, lineHeight, setLineHeight, selectedTemplate, setSelectedTemplate, model
}) {
    const [activeSubTab, setActiveSubTab] = useState(null);
    const [designOptions, setDesignOptions] = useState([]);

    // Toggle main tabs
    const toggleTab = (tab) => {
        setActiveTab(activeTab === tab ? null : tab);
        setActiveSubTab(null);
    };

    // Toggle sub-tabs
    const toggleSubTab = (tab) => {
        setActiveSubTab(activeSubTab === tab ? null : tab);
    };

    // Alignment icons
    const alignmentIcons = {
        left: <CiTextAlignLeft />,
        center: <CiTextAlignCenter />,
        right: <CiTextAlignRight />
    };

    // Font options for text styling
    const fontOptions = [
        { name: 'Amiri Quran', family: 'font-amiri' },
        { name: 'Playfair Display', family: 'font-playfair' },
        { name: 'Pinyon Script', family: 'font-pinyon' },
        { name: 'Josefin Sans', family: 'font-josefin' },
        { name: 'Urbanist', family: 'font-urbanist' },
        { name: 'Antic Didone', family: 'font-antic' },
        { name: 'Roboto', family: 'font-roboto' },
        { name: 'Montserrat', family: 'font-montserrat' },
        { name: 'Lora', family: 'font-lora' },
        { name: 'Raleway', family: 'font-raleway' },
        { name: 'Open Sans', family: 'font-opensans' }
    ];

    // Color options for text styling
    const colorOptions = [
        '#D8C3D5', '#E6E6E6', '#F2D8C7', '#EDEAD0', '#000000',
        '#FFFFFF', '#7F7F7F', '#E63946', '#4A4A4A'
    ];

    // Line height options for text spacing
    const lineHeightOptions = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    // Fetch design options based on model name and category
    useEffect(() => {
        if (model?.modelImage && model?.name) {
            const category = model.name.split(' ')[1]; // Extract category from name (e.g., "Mariage")
            const capitalizedCategory = category?.charAt(0).toUpperCase() + category?.slice(1);
            const models = data.models[capitalizedCategory] || [];

            const options = [];

            models.forEach((_, index) => {
                const i = index + 1;
                const basePath = `/assets/models/${category?.toLowerCase()}/model/${category?.toLowerCase()}${i}`;

                // Check for .png first, then fallback to .jpg
                const checkImage = (path, ext) => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        img.src = `${path}.${ext}`;
                        img.onload = () => resolve(`${path}.${ext}`);
                        img.onerror = () => resolve(null);
                    });
                };

                // Check both formats
                Promise.all([checkImage(basePath, 'png'), checkImage(basePath, 'jpg')])
                    .then(([png, jpg]) => {
                        const validImage = png || jpg;
                        if (validImage) {
                            options.push({ id: i, image: validImage });
                            setDesignOptions([...options]); // Update state once valid images are found
                        }
                    });
            });
        }
    }, [model]);

    return (
        <div className="fixed bottom-[60px] left-0 w-full bg-white shadow-lg border-t z-50">
            {/* Main Tabs */}
            <div className="flex justify-around py-2">
                {["format", "textStyle", "design"].map((tab) => (
                    <button
                        key={tab}
                        className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-black' : ''}`}
                        onClick={() => toggleTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Sub-options */}
            {activeTab && (
                <div className="bg-gray-50 p-4 border-t">
                    {/* Format Tab */}
                    {activeTab === 'format' && (
                        <div>
                            <div className="flex justify-around mb-4">
                                <button onClick={() => toggleSubTab('FontSize')}>
                                    <AiOutlineFontSize />
                                </button>
                                <button onClick={() => toggleSubTab('LineHeight')}>
                                    <AiOutlineColumnHeight />
                                </button>
                                <button onClick={() => toggleSubTab('TextAlign')}>
                                    <CiTextAlignCenter />
                                </button>
                            </div>

                            {/* Font Size Sub-tab */}
                            {activeSubTab === 'FontSize' && (
                                <div className="flex justify-center gap-2 overflow-x-auto">
                                    {[10, 12, 14, 16, 18, 20, 22, 24, 26, 28].map((size) => (
                                        <button
                                            key={size}
                                            className={`px-2 py-1 ${fontSize === size ? 'bg-black text-white' : 'bg-gray-200'}`}
                                            onClick={() => setFontSize(size)}
                                        >
                                            {size}px
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Line Height Sub-tab */}
                            {activeSubTab === 'LineHeight' && (
                                <div className="flex justify-center gap-2">
                                    {lineHeightOptions.map((height) => (
                                        <button
                                            key={height}
                                            className={`px-2 py-1 ${lineHeight === height ? 'bg-black text-white' : 'bg-gray-200'}`}
                                            onClick={() => setLineHeight(height)}
                                        >
                                            {height}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Text Alignment Sub-tab */}
                            {activeSubTab === 'TextAlign' && (
                                <div className="flex justify-center gap-2">
                                    {['left', 'center', 'right'].map((align) => (
                                        <button
                                            key={align}
                                            className={`px-2 py-1 ${alignment === align ? 'bg-black text-white' : 'bg-gray-200'}`}
                                            onClick={() => setAlignment(align)}
                                        >
                                            {alignmentIcons[align]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text Style Tab */}
                    {activeTab === 'textStyle' && (
                        <div>
                            {/* Font Selection */}
                            <div className="flex gap-2 mb-4 overflow-x-auto">
                                {fontOptions.map((font) => (
                                    <button
                                        key={font.name}
                                        className={`p-2 rounded-lg text-center ${fontFamily === font.family ? 'bg-black text-white' : 'bg-white'} ${font.family}`}
                                        onClick={() => setFontFamily(font.family)}
                                    >
                                        {font.name}
                                    </button>
                                ))}
                            </div>

                            {/* Color Selection */}
                            <div className="flex justify-center gap-2 overflow-x-auto">
                                {colorOptions.map((color, index) => (
                                    <button
                                        key={index}
                                        className="w-8 h-8 rounded-full"
                                        style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #000' : 'none' }}
                                        onClick={() => setTextColor(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

<div className="bg-gray-50 border-t">
    {activeTab === 'design' && (
        <div>

            {/* Scrollable Image Grid */}
            <div className="flex overflow-x-auto ">
                {designOptions.map((design) => (
                    <div
                        key={design.id}
                        className={`relative flex-shrink-0 w-[80px] h-[100px] rounded-lg overflow-hidden border ${
                            selectedTemplate === design.image ? 'border-blue-500' : 'border-gray-300'
                        } hover:opacity-80 transition-all duration-300 cursor-pointer`}
                        onClick={() => setSelectedTemplate(design.image)}
                    >
                        <img
                            src={design.image}
                            alt={`Template ${design.id}`}
                            className="w-full h-full object-cover"
                        />
                        {selectedTemplate === design.image && (
                            <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )}
</div>

                </div>
            )}
        </div>
    );
}

export default BottomMenu;
