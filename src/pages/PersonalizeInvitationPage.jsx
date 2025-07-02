// PersonalizeInvitationPage.js

import React, { useState, useRef, useEffect, useCallback } from 'react'; // Import useCallback
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
import { fontOptions } from '../config/fontConfig';

function PersonalizeInvitationPage() {
  const [activeTab, setActiveTab] = useState(null);
  const [currentCard, setCurrentCard] = useState('front');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { model, qté, format, motif } = location.state || {};

const { 
  state: cardContent, 
  setState: setCardContent, 
  undo, 
  redo, 
  canUndo, 
  canRedo 
} = useHistory({ front: { textBoxes: [] }, back: { textBoxes: [] } });

  const textBoxes = cardContent[currentCard]?.textBoxes || [];
  const [selectedTextId, setSelectedTextId] = useState(null);
  
  const headerRef = useRef(null);
  const mainMenuRef = useRef(null);
  const wrapperRef = useRef(null);
  const contentContainerRef = useRef(null);
  const isChildInteracting = useRef(false);
  const prevSelectedTextIdRef = useRef();

  const { canvasStyle, mainPadding } = useCanvasLayout({ headerRef, mainMenuRef });
  const { scale, translate, isInteracting } = usePanAndZoom({ wrapperRef, isChildInteracting });

  const handleChildInteraction = (isInteracting) => {
    isChildInteracting.current = isInteracting;
  };

  const stableSetCardContent = useRef(setCardContent);
  useEffect(() => {
    stableSetCardContent.current = setCardContent;
  }, [setCardContent]);
  
  // --- FUNCTION MOVED HERE ---
  // It's now defined before the useEffect that needs it.
  // Wrapped in useCallback for stability, which is good practice.
  const updateCurrentCardTextBoxes = useCallback((newTextBoxes) => {
    setCardContent(cardContent => {
      // If newTextBoxes is a function, execute it to get the new array
      const resolvedTextBoxes = typeof newTextBoxes === 'function' 
        ? newTextBoxes(cardContent[currentCard].textBoxes) 
        : newTextBoxes;
      
      return {
        ...cardContent,
        [currentCard]: { ...cardContent[currentCard], textBoxes: resolvedTextBoxes },
      };
    });
  }, [currentCard, setCardContent]);

// This consolidated effect handles initial loading from either localStorage or the default template.
useEffect(() => {
  // Try to load from localStorage first.
  const savedDataJSON = localStorage.getItem('savedInvitation');
  if (savedDataJSON) {
    const savedData = JSON.parse(savedDataJSON);
    if (savedData.modelName === model?.name) {
      console.log("Loading saved work from localStorage...");
      // If found, load it and STOP.
      stableSetCardContent.current(savedData.content, true);
      return;
    }
  }

  // If no valid saved data was found, THEN load the default template.
  console.log("Loading default template...");
  const templateId = model?.name?.toLowerCase().replace("modèle ", "").replace(/ /g, "-");
  if (!templateId) return;
  if (!contentContainerRef.current) return;

  const containerWidth = contentContainerRef.current.clientWidth;
  const containerHeight = contentContainerRef.current.clientHeight;
  if (containerWidth === 0 || containerHeight === 0) return;

  const template = templateData[templateId];
  if (template?.prefilledTextBoxes) {
    const responsiveTextBoxes = template.prefilledTextBoxes.map(box => ({
      ...box,
      position: { 
        x: (box.position.x / 100) * containerWidth, 
        y: (box.position.y / 100) * containerHeight 
      },
      width: (box.width / 100) * containerWidth,
    }));
    
    const initialContent = { front: { textBoxes: responsiveTextBoxes }, back: { textBoxes: [] } };
    stableSetCardContent.current(initialContent, true); 
  }
// This effect runs only when the model changes or the canvas size is determined, ensuring it only runs once at the beginning.
}, [model?.name, canvasStyle.width, canvasStyle.height]);


  useEffect(() => {
    if (cardContent.front.textBoxes.length > 0 || cardContent.back.textBoxes.length > 0) {
      const dataToSave = {
        modelName: model?.name,
        content: cardContent
      };
      localStorage.setItem('savedInvitation', JSON.stringify(dataToSave));
    }
  }, [cardContent, model?.name]);

  useEffect(() => {
    setSelectedTextId(null);
  }, [currentCard]);

  // This is the "delete on deselect" effect. It now correctly comes AFTER updateCurrentCardTextBoxes is defined.
  useEffect(() => {
    if (selectedTextId === null && prevSelectedTextIdRef.current) {
      const deselectedBox = cardContent[currentCard]?.textBoxes.find(
        (box) => box.id === prevSelectedTextIdRef.current
      );

      if (deselectedBox && deselectedBox.text.trim() === '') {
        const newTextBoxes = cardContent[currentCard].textBoxes.filter(
          (box) => box.id !== deselectedBox.id
        );
        updateCurrentCardTextBoxes(newTextBoxes);
      }
    }
    prevSelectedTextIdRef.current = selectedTextId;
  }, [selectedTextId, cardContent, currentCard, updateCurrentCardTextBoxes]);
  
  const handleAddText = () => {
    const cardRect = contentContainerRef.current?.getBoundingClientRect();
    if (!cardRect) return;
    const newTextBox = { id: Date.now(), text: 'Nouveau texte', style: { fontSize: 16, bold: false, italic: false, alignment: 'center', color: '#000000', lineHeight: 1.5, fontFamily: 'Playfair Display' }, position: { x: cardRect.width / 2 - 75, y: cardRect.height / 2 - 20 }, width: 150 };
    updateCurrentCardTextBoxes(prevTextBoxes => [...prevTextBoxes, newTextBox]); 
    setSelectedTextId(newTextBox.id);
  };
  
  const handleUpdateText = (id, newText) => updateCurrentCardTextBoxes(textBoxes.map(box => box.id === id ? { ...box, text: newText } : box));
  const handleUpdatePosition = (id, position) => updateCurrentCardTextBoxes(textBoxes.map(box => box.id === id ? { ...box, position } : box));
  const handleUpdateWidth = (id, newWidth) => updateCurrentCardTextBoxes(textBoxes.map(box => (box.id === id ? { ...box, width: newWidth } : box)));
  const handleDeleteText = () => { updateCurrentCardTextBoxes(textBoxes.filter(box => box.id !== selectedTextId)); setSelectedTextId(null); };

  const updateTextStyle = (key, value) => {
    updateCurrentCardTextBoxes(textBoxes.map(box => {
      if (box.id === selectedTextId) {
        const newStyle = { ...box.style, [key]: value };
        
        if (key === 'fontFamily') {
          const selectedFont = fontOptions.find(font => font.pdfName === value);
          if (selectedFont?.isArabic) {
            newStyle.direction = 'rtl';
            newStyle.alignment = 'right';
          } else {
            newStyle.direction = 'ltr';
            if (box.style.alignment === 'right') {
              newStyle.alignment = 'left';
            }
          }
        }
        return { ...box, style: newStyle };
      }
      return box;
    }));
  };  

  const handleCanvasClick = (e) => { if (e.target === e.currentTarget) { setSelectedTextId(null); } };
  
  const handleDownload = async () => {
    const canvas = contentContainerRef.current;
    if (!canvas) { alert("Erreur : La zone de personnalisation n'a pas pu être trouvée."); return; }
    
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const frontData = { image: model.modelImage, textBoxes: cardContent.front.textBoxes };
    const backData = model.modelImagep2 ? { image: model.modelImagep2, textBoxes: cardContent.back.textBoxes } : null;

    try {
        const blob = await pdf(
            <FinalPDFDocument 
                frontData={frontData}
                backData={backData}
                canvasDimensions={{ width: canvasWidth, height: canvasHeight }} 
                qte={qté} 
                format={format} 
                motif={motif} 
                modelName={model.name}
                safeArea={{ top: 0, bottom: 0, left: 0, right: 0 }} 
                verticalAlignmentPercent={50} 
            />
        ).toBlob();
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${model.name || 'invitation'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) { 
        console.error("Erreur lors de la génération du PDF:", error); 
        alert("Une erreur est survenue lors de la création du PDF. Veuillez réessayer."); 
    }
  };

  const handleDesignChange = (newDesignData) => {
    if (newDesignData) {
        const updatedModel = {
            ...model,
            modelImage: newDesignData.modelImage,
            modelImagep2: newDesignData.modelImagep2,
        };
        navigate(location.pathname, { replace: true, state: { ...location.state, model: updatedModel } });
    }
  };

  const handleTemplateChange = (newTemplateData) => {
    if (newTemplateData?.templateId && templateData[newTemplateData.templateId]?.prefilledTextBoxes) {
        
        if (!contentContainerRef.current) return;
        const containerWidth = contentContainerRef.current.clientWidth;
        const containerHeight = contentContainerRef.current.clientHeight;
        if (containerWidth === 0 || containerHeight === 0) return;

        const template = templateData[newTemplateData.templateId];
        
        const responsiveTextBoxes = template.prefilledTextBoxes.map(box => ({
            ...box,
            position: { 
                x: (box.position.x / 100) * containerWidth, 
                y: (box.position.y / 100) * containerHeight 
            },
            width: (box.width / 100) * containerWidth,
        }));
        
        const newContent = {
            front: { textBoxes: responsiveTextBoxes },
            back: { textBoxes: [] }
        };

        setCardContent(newContent, true);
    }
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

  useEffect(() => {
    return () => {
      // localStorage.removeItem('savedInvitation');
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
        <MainMenu 
            onAddText={handleAddText} 
            onDelete={handleDeleteText} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            model={model}
            onDesignChange={handleDesignChange}
            onTemplateChange={handleTemplateChange}
        />
        {selectedTextId && textBoxes.find(b => b.id === selectedTextId) && ( <BottomMenu onDelete={handleDeleteText} activeTab={activeTab} setActiveTab={setActiveTab} fontSize={textBoxes.find(b => b.id === selectedTextId)?.style.fontSize || 16} setFontSize={size => updateTextStyle('fontSize', size)} lineHeight={textBoxes.find(b => b.id === selectedTextId)?.style.lineHeight || 1.5} setLineHeight={line => updateTextStyle('lineHeight', line)} isBold={textBoxes.find(b => b.id === selectedTextId)?.style.bold || false} setIsBold={val => updateTextStyle('bold', val)} isItalic={textBoxes.find(b => b.id === selectedTextId)?.style.italic || false} setIsItalic={val => updateTextStyle('italic', val)} alignment={textBoxes.find(b => b.id === selectedTextId)?.style.alignment || 'center'} setAlignment={val => updateTextStyle('alignment', val)} fontFamily={textBoxes.find(b => b.id === selectedTextId)?.style.fontFamily} setFontFamily={val => updateTextStyle('fontFamily', val)} textColor={textBoxes.find(b => b.id === selectedTextId)?.style.color || '#000000'} setTextColor={val => updateTextStyle('color', val)} setSelectedTextId={setSelectedTextId} /> )}
      </div>
    </div>
  );
}

export default PersonalizeInvitationPage;