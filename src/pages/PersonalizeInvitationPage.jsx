import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainMenu from '../components/canvas/MainMenu';
import BottomMenu from '../components/canvas/BottomMenu';
import TextBox from '../components/canvas/TextBox';
import { pdf } from '@react-pdf/renderer';
import TestDocument from '../components/pdf/PdfInvitationDocument';
import { FiCornerDownLeft, FiCornerUpRight } from 'react-icons/fi';
import data from '../data/categories.json';

function PersonalizeInvitationPage() {
    const [activeTab, setActiveTab] = useState(null);
    const [textBoxes, setTextBoxes] = useState([]);
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [designOptions, setDesignOptions] = useState([]);

    const lastTouch = useRef(null);
    const lastDistance = useRef(null);
    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { model, qté, format, motif } = location.state || {};
    const [selectedTemplate, setSelectedTemplate] = useState(model?.modelImage || null);

    useEffect(() => {
        if (!model) {
            navigate('/invitations-physique');
        }
    }, [model, navigate]);

    useEffect(() => {
        if (model?.modelImage && model?.name) {
            const category = model.name.split(' ')[1];
            const capitalizedCategory = category?.charAt(0).toUpperCase() + category?.slice(1);
            const models = data.models[capitalizedCategory] || [];

            const loadImages = async () => {
                const options = [];
                for (let i = 0; i < models.length; i++) {
                    const index = i + 1;
                    const basePath = `/assets/models/${category?.toLowerCase()}/model/${category?.toLowerCase()}${index}`;

                    const checkImage = (path, ext) => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.src = `${path}.${ext}`;
                            img.onload = () => resolve(`${path}.${ext}`);
                            img.onerror = () => resolve(null);
                        });
                    };

                    const [png, jpg] = await Promise.all([checkImage(basePath, 'png'), checkImage(basePath, 'jpg')]);
                    const validImage = png || jpg;
                    if (validImage) options.push({ id: index, image: validImage });
                }
                setDesignOptions(options);
            };

            loadImages();
        }
    }, [model]);

    const handleAddText = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const canvasWidth = canvas.clientWidth;
            const canvasHeight = canvas.clientHeight;

            const newTextBox = {
                id: Date.now(),
                text: 'Nouveau texte',
                style: {
                    fontSize: 16,
                    bold: false,
                    italic: false,
                    alignment: 'center',
                    fontFamily: 'Playfair Display',
                    color: '#000000'
                },
                position: { x: canvasWidth / 2 - 75, y: canvasHeight / 2 - 20 }
            };

            setTextBoxes([...textBoxes, newTextBox]);
        }
    };

    const handleUpdateText = (id, newText) => {
        setTextBoxes((prev) => prev.map((box) => (box.id === id ? { ...box, text: newText } : box)));
    };

    const handleUpdatePosition = (id, position) => {
        setTextBoxes((prev) => prev.map((box) => (box.id === id ? { ...box, position } : box)));
    };

    const handleDeleteText = () => {
        if (selectedTextId) {
            setTextBoxes((prev) => prev.filter((box) => box.id !== selectedTextId));
            setSelectedTextId(null);
        }
    };

    const updateTextStyle = (key, value) => {
        setTextBoxes((prev) =>
            prev.map((box) =>
                box.id === selectedTextId ? { ...box, style: { ...box.style, [key]: value } } : box
            )
        );
    };

    const handleCanvasClick = (e) => {
        if (e.target === canvasRef.current) {
            setSelectedTextId(null);
        }
    };

    const handleDownload = async () => {
        const blob = await pdf(
            <TestDocument
                selectedTemplate={selectedTemplate}
                textBoxes={textBoxes}
                model={model.name}
                qte={qté}
                format={format}
                motif={motif}
            />
        ).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = model.name + '.pdf';
        link.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const wrapper = wrapperRef.current;

        const getDistance = (touches) => {
            const [a, b] = touches;
            return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        };

        const handleTouchStart = (e) => {
            if (e.touches.length === 1) {
                lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                setIsDragging(true);
            } else if (e.touches.length === 2) {
                lastDistance.current = getDistance(e.touches);
                setIsDragging(false);
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const distance = getDistance(e.touches);
                if (lastDistance.current) {
                    const delta = distance / lastDistance.current;
                    setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 2));
                }
                lastDistance.current = distance;
            } else if (e.touches.length === 1 && isDragging) {
                const { clientX, clientY } = e.touches[0];
                const dx = clientX - lastTouch.current.x;
                const dy = clientY - lastTouch.current.y;
                setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
                lastTouch.current = { x: clientX, y: clientY };
            }
        };

        const handleTouchEnd = () => {
            lastDistance.current = null;
            lastTouch.current = null;
            setIsDragging(false);
        };

        wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
        wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
        wrapper.addEventListener('touchend', handleTouchEnd);

        return () => {
            wrapper.removeEventListener('touchstart', handleTouchStart);
            wrapper.removeEventListener('touchmove', handleTouchMove);
            wrapper.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <div className="relative min-h-screen shadow-md bg-gray-100" onClick={handleCanvasClick}>
            <div className="fixed top-0 left-0 w-full bg-white z-50 py-6">
                <div className="flex items-center justify-between px-4 space-x-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => navigate('/invitations-physique')}
                            className="border border-black px-2 py-1 mr-1 rounded-md w-6 h-6 flex items-center justify-center"
                        >
                            x
                        </button>
                        <button onClick className="border border-black px-1 py-1 rounded-md w-6 h-6 flex items-center justify-center">
                            <FiCornerDownLeft className="text-xl" />
                        </button>
                        <button onClick className="border border-black px-1 py-1 rounded-md w-6 h-6 flex items-center justify-center">
                            <FiCornerUpRight className="text-xl" />
                        </button>
                    </div>

                    <h1 className="text-base font-urbanist font-medium text-center whitespace-nowrap flex-1">
                        {model?.name?.replace(/^Modèle\s/, '') || 'Personnalisation'}
                    </h1>

                    <button className="bg-black text-white text-sm px-4 py-2 font-urbanist font-medium" onClick={handleDownload}>
                        Commander
                    </button>
                </div>
            </div>

            <div className="flex justify-center items-center p-4 mt-14">
                <div
                    ref={wrapperRef}
                    className="w-full max-w-[400px] h-[700px] overflow-hidden rounded-lg touch-none relative"
                >
                    <div
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full"
                        style={{
                            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                            transformOrigin: 'center center',
                            backgroundImage: `url(${selectedTemplate})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        {textBoxes.map((box) => (
                            <TextBox
                                key={box.id}
                                id={box.id}
                                text={box.text}
                                style={box.style}
                                position={box.position}
                                isSelected={box.id === selectedTextId}
                                onSelect={setSelectedTextId}
                                onUpdate={handleUpdateText}
                                onUpdatePosition={handleUpdatePosition}
                            />
                        ))}
                    </div>
                </div>
            </div>

<MainMenu
  onAddText={handleAddText}
  onUndo={() => alert('Undo not implemented')}
  onRedo={() => alert('Redo not implemented')}
  onDelete={handleDeleteText}
  selectedTemplate={selectedTemplate}
  setSelectedTemplate={setSelectedTemplate}
  activeTab={activeTab}
  setActiveTab={setActiveTab}  
  model={model}
/>

            {selectedTextId && (
                <BottomMenu
                    onDelete={handleDeleteText}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    fontSize={textBoxes.find((box) => box.id === selectedTextId)?.style.fontSize || 16}
                    setFontSize={(size) => updateTextStyle('fontSize', size)}
                    lineHeight={textBoxes.find((box) => box.id === selectedTextId)?.style.lineHeight || 1.5}
                    setLineHeight={(height) => updateTextStyle('lineHeight', height)}
                    isBold={textBoxes.find((box) => box.id === selectedTextId)?.style.bold || false}
                    setIsBold={(bold) => updateTextStyle('bold', bold)}
                    isItalic={textBoxes.find((box) => box.id === selectedTextId)?.style.italic || false}
                    setIsItalic={(italic) => updateTextStyle('italic', italic)}
                    alignment={textBoxes.find((box) => box.id === selectedTextId)?.style.alignment || 'center'}
                    setAlignment={(align) => updateTextStyle('alignment', align)}
                    fontFamily={textBoxes.find((box) => box.id === selectedTextId)?.style.fontFamily || 'Playfair Display'}
                    setFontFamily={(family) => updateTextStyle('fontFamily', family)}
                    textColor={textBoxes.find((box) => box.id === selectedTextId)?.style.color || '#000000'}
                    setTextColor={(color) => updateTextStyle('color', color)}
                    model={model}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                />
            )}
        </div>
    );
}

export default PersonalizeInvitationPage;