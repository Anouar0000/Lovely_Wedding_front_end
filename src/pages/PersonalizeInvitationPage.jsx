// PersonalizeInvitationPage.js

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainMenu from '../components/canvas/MainMenu';
import BottomMenu from '../components/canvas/BottomMenu';
import TextBox from '../components/canvas/TextBox';
import { pdf } from '@react-pdf/renderer';
import FinalPDFDocument from '../components/canvas/FinalPDFDocument';
import { FiCornerDownLeft, FiCornerUpRight } from 'react-icons/fi';
import useHistory from '../hooks/useHistory';
import { templateData } from '../data/templateData.js';
import { useCanvasLayout } from '../hooks/useCanvasLayout';
import { usePanAndZoom } from '../hooks/usePanAndZoom';
import CardSwitcher from '../components/canvas/CardSwitcher';

function PersonalizeInvitationPage() {
  const [activeTab, setActiveTab] = useState(null);
  const [currentCard, setCurrentCard] = useState('front');
  const { 
    state: cardContent, 
    setState: setCardContent, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useHistory({
    front: { textBoxes: [] },
    back: { textBoxes: [] },
  });

  const textBoxes = cardContent[currentCard]?.textBoxes || [];
  const [selectedTextId, setSelectedTextId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { model, qté, format, motif } = location.state || {};
  
  const headerRef = useRef(null);
  const mainMenuRef = useRef(null);
  const wrapperRef = useRef(null);
  const contentContainerRef = useRef(null);
  const isChildInteracting = useRef(false);

  const { canvasStyle, mainPadding } = useCanvasLayout({ headerRef, mainMenuRef });
  const { scale, translate, isInteracting } = usePanAndZoom({ wrapperRef, isChildInteracting });

  const handleChildInteraction = (isInteracting) => {
    isChildInteracting.current = isInteracting;
  };

  useEffect(() => {
    if (!model) { navigate('/invitations-physique'); return; }
    
    const templateId = model?.templateId;
    let initialContent = { front: { textBoxes: [] }, back: { textBoxes: [] } };
    if (templateId && templateData[templateId]) {
      const template = templateData[templateId];
      if (template.prefilledTextBoxes) {
        initialContent.front.textBoxes = template.prefilledTextBoxes;
      }
    }
    setCardContent(initialContent, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useEffect(() => {
    setSelectedTextId(null);
  }, [currentCard]);

  useEffect(() => {
    if (selectedTextId === null) return;
    if (!textBoxes.some(box => box.id === selectedTextId)) {
      setSelectedTextId(null);
    }
  }, [textBoxes, selectedTextId]);

  const updateCurrentCardTextBoxes = (newTextBoxes) => {
    setCardContent({
      ...cardContent,
      [currentCard]: { ...cardContent[currentCard], textBoxes: newTextBoxes },
    });
  };

  const handleAddText = () => {
    const cardRect = contentContainerRef.current?.getBoundingClientRect();
    if (!cardRect) return;
    const newTextBox = { id: Date.now(), text: 'Nouveau texte', style: { fontSize: 16, bold: false, italic: false, alignment: 'center', color: '#000000', lineHeight: 1.5, fontFamily: 'Playfair Display' }, position: { x: cardRect.width / 2 - 75, y: cardRect.height / 2 - 20 }, width: 150 };
    updateCurrentCardTextBoxes([...textBoxes, newTextBox]); 
    setSelectedTextId(newTextBox.id);
  };
  
  const handleUpdateText = (id, newText) => updateCurrentCardTextBoxes(textBoxes.map(box => box.id === id ? { ...box, text: newText } : box));
  const handleUpdatePosition = (id, position) => updateCurrentCardTextBoxes(textBoxes.map(box => box.id === id ? { ...box, position } : box));
  const handleUpdateWidth = (id, newWidth) => updateCurrentCardTextBoxes(textBoxes.map(box => (box.id === id ? { ...box, width: newWidth } : box)));
  const handleDeleteText = () => { updateCurrentCardTextBoxes(textBoxes.filter(box => box.id !== selectedTextId)); setSelectedTextId(null); };
  const updateTextStyle = (key, value) => updateCurrentCardTextBoxes(textBoxes.map(box => box.id === selectedTextId ? { ...box, style: { ...box.style, [key]: value } } : box));
  
  const handleCanvasClick = (e) => { if (e.target === e.currentTarget) { setSelectedTextId(null); } };
  
  const handleDownload = async () => {
    const canvas = contentContainerRef.current;
    if (!canvas) { alert("Erreur : La zone de personnalisation n'a pas pu être trouvée."); return; }
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    
    const frontTextBoxes = cardContent.front.textBoxes;
    const frontImage = model.modelImage;

    try {
      const blob = await pdf(<FinalPDFDocument selectedTemplate={frontImage} textBoxes={frontTextBoxes} canvasDimensions={{ width: canvasWidth, height: canvasHeight }} qte={qté} format={format} motif={motif} modelName={model.name} safeArea={{ top: 0, bottom: 0, left: 0, right: 0 }} verticalAlignmentPercent={50} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${model.name || 'invitation'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) { console.error("Erreur lors de la génération du PDF:", error); alert("Une erreur est survenue lors de la création du PDF. Veuillez réessayer."); }
  };

  const renderTextBoxes = (cardKey) => {
    const boxes = cardContent[cardKey]?.textBoxes || [];
    return (
      <div 
        className="absolute top-0 left-0 w-full h-full"
        style={{ 
            visibility: currentCard === cardKey ? 'visible' : 'hidden',
            pointerEvents: currentCard === cardKey ? 'auto' : 'none' 
        }}
      >
        {boxes.map((box) => (
          <TextBox key={box.id} {...box} isSelected={box.id === selectedTextId && currentCard === cardKey} onSelect={setSelectedTextId} onUpdate={handleUpdateText} onUpdatePosition={handleUpdatePosition} onUpdateWidth={handleUpdateWidth} scale={scale} onInteractionChange={handleChildInteraction} />
        ))}
      </div>
    );
  };
  
  // Define styles for active (front) and inactive (back) cards
  const activeCardStyle = { transform: 'scale(0.9) translateX(-5%)', zIndex: 10 };
  const inactiveCardStyle = { transform: 'scale(0.85) translateX(10%)', zIndex: 5 };

useEffect(() => {
  const handleClickOutside = (e) => {
    const clickedInsideCanvas = wrapperRef.current?.contains(e.target);
    const clickedOnTextBox = e.target.closest('.TextBox');

    if (clickedInsideCanvas && !clickedOnTextBox) {
      setSelectedTextId(null);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);



  return (
    <div className="relative min-h-screen bg-gray-100">
      <div ref={headerRef} className="fixed top-0 left-0 w-full bg-white z-50 py-6">
        <div className="flex items-center justify-between px-4">
            <div className="flex space-x-2">
                <button onClick={() => navigate('/invitations-physique')} className="border border-black p-1 rounded">✕</button>
                <button onClick={undo} disabled={!canUndo} className="border border-black p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"><FiCornerDownLeft /></button>
                <button onClick={redo} disabled={!canRedo} className="border border-black p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"><FiCornerUpRight /></button>
            </div>
            <h1 className="text-base font-urbanist font-medium flex-1 text-center">{model?.name?.replace(/^Modèle\s/, '') || 'Personnalisation'}</h1>
            <button onClick={handleDownload} className="bg-black text-white px-4 py-2 font-urbanist text-sm">Commander</button>
        </div>
      </div>
      
      <main style={{ paddingTop: `${mainPadding.top}px`, paddingBottom: `${mainPadding.bottom}px` }}>
        <div className="relative mx-auto" style={{ width: canvasStyle.width, height: canvasStyle.height }}>
          <div ref={wrapperRef} className="absolute top-0 left-0 w-full h-full bg-transparent touch-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full" style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`, transition: isInteracting ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)'}}>
              <div ref={contentContainerRef} onClick={handleCanvasClick} className="relative w-full h-full flex items-center justify-center">
                
                  {/* Back Card */}
                  {model?.modelImagep2 && (
                    <div
                      className="absolute w-full h-full transition-all duration-300 ease-in-out"
                      style={{
                        backgroundImage: `url(${model.modelImagep2})`,
                        backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                        ...(currentCard === 'back' ? activeCardStyle : inactiveCardStyle),
                      }}
                    >
                      {renderTextBoxes('back')}
                    </div>
                  )}

                  {/* Front Card */}
                  <div
                    className="absolute w-full h-full transition-all duration-300 ease-in-out"
                    style={{
                      backgroundImage: `url(${model?.modelImage})`,
                      backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                      ...(currentCard === 'front' ? activeCardStyle : (model?.modelImagep2 ? inactiveCardStyle : activeCardStyle)),
                    }}
                  >
                    {renderTextBoxes('front')}
                  </div>
              </div>
            </div>
          </div>
        </div>
                  <CardSwitcher model={model} currentCard={currentCard} setCurrentCard={setCurrentCard} />
      </main>

      <div ref={mainMenuRef} className="fixed bottom-0 left-0 w-full z-40">
        <MainMenu onAddText={handleAddText} onDelete={handleDeleteText} selectedTemplate={model?.modelImage} setSelectedTemplate={() => {}} activeTab={activeTab} setActiveTab={setActiveTab} model={model} />
        {selectedTextId && textBoxes.find(b => b.id === selectedTextId) && ( <BottomMenu onDelete={handleDeleteText} activeTab={activeTab} setActiveTab={setActiveTab} fontSize={textBoxes.find(b => b.id === selectedTextId)?.style.fontSize || 16} setFontSize={size => updateTextStyle('fontSize', size)} lineHeight={textBoxes.find(b => b.id === selectedTextId)?.style.lineHeight || 1.5} setLineHeight={line => updateTextStyle('lineHeight', line)} isBold={textBoxes.find(b => b.id === selectedTextId)?.style.bold || false} setIsBold={val => updateTextStyle('bold', val)} isItalic={textBoxes.find(b => b.id === selectedTextId)?.style.italic || false} setIsItalic={val => updateTextStyle('italic', val)} alignment={textBoxes.find(b => b.id === selectedTextId)?.style.alignment || 'center'} setAlignment={val => updateTextStyle('alignment', val)} fontFamily={textBoxes.find(b => b.id === selectedTextId)?.style.fontFamily} setFontFamily={val => updateTextStyle('fontFamily', val)} textColor={textBoxes.find(b => b.id === selectedTextId)?.style.color || '#000000'} setTextColor={val => updateTextStyle('color', val)} setSelectedTextId={setSelectedTextId} /> )}
      </div>
    </div>
  );
}

export default PersonalizeInvitationPage;