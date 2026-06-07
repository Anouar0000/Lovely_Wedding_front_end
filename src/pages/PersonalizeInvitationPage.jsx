// PersonalizeInvitationPage.js

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainMenu from '../components/canvas/MainMenu';
import BottomMenu from '../components/canvas/BottomMenu';
import TextBox from '../components/canvas/TextBox';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { FiCornerDownLeft, FiCornerUpRight } from 'react-icons/fi';
import useHistory from '../hooks/useHistory';
import { templateData } from '../data/templateData.js';
import { useCanvasLayout } from '../hooks/useCanvasLayout';
import { usePanAndZoom } from '../hooks/usePanAndZoom';
import CardSwitcher from '../components/canvas/CardSwitcher';
import { fontOptions } from '../config/fontConfig';
import { useUnsafeZoneCollision } from '../hooks/useUnsafeZoneCollision';
import ApparenceMenu from '../components/canvas/ApparenceMenu';
import data from '../data/categories.json';

const DEFAULT_CARD_SIZE_MM = { width: 100, height: 141.4 };

const getCardSizeFromFormat = (formatValue) => {
  if (!formatValue) return DEFAULT_CARD_SIZE_MM;

  if (formatValue.includes('9.5 x 21')) return { width: 95, height: 210 };
  if (formatValue.includes('10 x 15')) return { width: 100, height: 150 };
  if (formatValue.includes('14 x 14')) return { width: 140, height: 140 };

  return DEFAULT_CARD_SIZE_MM;
};

const waitForImages = async (element) => {
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(images.map((image) => {
    if (image.complete) return Promise.resolve();
    return new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });
  }));
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const getCanvasDimensionsFromStyle = (canvasStyle) => ({
  width: parseFloat(canvasStyle.width) || 0,
  height: parseFloat(canvasStyle.height) || 0,
});

const toPixelTextBox = (box, dimensions) => ({
  ...box,
  position: {
    x: ((box.position?.x || 0) / 100) * dimensions.width,
    y: ((box.position?.y || 0) / 100) * dimensions.height,
  },
  width: ((box.width || 0) / 100) * dimensions.width,
});

const toPercentPosition = (position, dimensions) => ({
  x: dimensions.width ? ((position?.x || 0) / dimensions.width) * 100 : 0,
  y: dimensions.height ? ((position?.y || 0) / dimensions.height) * 100 : 0,
});

const toPercentWidth = (width, dimensions) => (
  dimensions.width ? ((width || 0) / dimensions.width) * 100 : 0
);

const getResponsiveFontSize = (fontSize, dimensions) => {
  const scale = dimensions.width ? dimensions.width / 390 : 1;
  return Math.max(8, Math.round((fontSize || 16) * scale * 10) / 10);
};

function PersonalizeInvitationPage() {
  const [activeTab, setActiveTab] = useState(null);
  const [currentCard, setCurrentCard] = useState('front');
  const unsafeZoneEditorEnabled = process.env.REACT_APP_UNSAFE_ZONE_EDITOR === 'true';
  
  const navigate = useNavigate();
  const location = useLocation();
  const { model, format, motif } = location.state || {};
  const selectedCardSize = useMemo(() => getCardSizeFromFormat(format), [format]);
  const [designAspectRatio, setDesignAspectRatio] = useState(DEFAULT_CARD_SIZE_MM.width / DEFAULT_CARD_SIZE_MM.height);
  const [unsafeZoneEditorOpen, setUnsafeZoneEditorOpen] = useState(false);
  const [editableUnsafeZones, setEditableUnsafeZones] = useState(model?.unsafeZones || []);
  const [selectedUnsafeZoneId, setSelectedUnsafeZoneId] = useState(model?.unsafeZones?.[0]?.id || '');

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
  const exportFrontRef = useRef(null);
  const exportBackRef = useRef(null);
  const isChildInteracting = useRef(false);
  const prevSelectedTextIdRef = useRef();

  const { canvasStyle, mainPadding } = useCanvasLayout({
    headerRef,
    mainMenuRef,
    aspectRatio: designAspectRatio,
  });
  const effectiveModel = useMemo(() => ({
    ...model,
    unsafeZones: editableUnsafeZones,
  }), [model, editableUnsafeZones]);
  const canvasDimensions = useMemo(() => getCanvasDimensionsFromStyle(canvasStyle), [canvasStyle]);
  const renderedCardContent = useMemo(() => ({
    front: {
      textBoxes: (cardContent.front?.textBoxes || []).map((box) => ({
        ...toPixelTextBox(box, canvasDimensions),
        style: {
          ...box.style,
          fontSize: getResponsiveFontSize(box.style?.fontSize, canvasDimensions),
        },
      })),
    },
    back: {
      textBoxes: (cardContent.back?.textBoxes || []).map((box) => ({
        ...toPixelTextBox(box, canvasDimensions),
        style: {
          ...box.style,
          fontSize: getResponsiveFontSize(box.style?.fontSize, canvasDimensions),
        },
      })),
    },
  }), [cardContent, canvasDimensions]);
  const { scale, translate, isInteracting } = usePanAndZoom({ wrapperRef, isChildInteracting });

  const handleChildInteraction = (isInteracting) => {
    isChildInteracting.current = isInteracting;
  };

  const stableSetCardContent = useRef(setCardContent);
  useEffect(() => {
    stableSetCardContent.current = setCardContent;
  }, [setCardContent]);

  useEffect(() => {
    if (!model?.modelImage) return;

    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        setDesignAspectRatio(image.naturalWidth / image.naturalHeight);
      }
    };
    image.src = model.modelImage;
  }, [model?.modelImage]);

  useEffect(() => {
    const zones = model?.unsafeZones || [];
    setEditableUnsafeZones(zones);
    setSelectedUnsafeZoneId(zones[0]?.id || '');
  }, [model?.unsafeZones]);
  
  const updateCurrentCardTextBoxes = useCallback((newTextBoxes) => {
    setCardContent(cardContent => {
      const resolvedTextBoxes = typeof newTextBoxes === 'function' 
        ? newTextBoxes(cardContent[currentCard].textBoxes) 
        : newTextBoxes;
      
      return {
        ...cardContent,
        [currentCard]: { ...cardContent[currentCard], textBoxes: resolvedTextBoxes },
      };
    });
  }, [currentCard, setCardContent]);

  // Corrected initial load and template logic
useEffect(() => {
  // This logic now runs only when the template ID changes.
  const templateId = model?.templateId;
  if (!templateId) return;

  // We check if there's already text. If so, it means the user has started editing,
  // and we should not overwrite their work with the default template.
  if (cardContent.front.textBoxes.length > 0) return;

  const template = templateData[templateId];
  if (template?.prefilledTextBoxes) {
    const responsiveTextBoxes = template.prefilledTextBoxes.map(box => ({
      ...box,
      position: { x: box.position.x, y: box.position.y },
      width: box.width,
    }));
    
    const initialContent = { front: { textBoxes: responsiveTextBoxes }, back: { textBoxes: [] } };
    setCardContent(initialContent, true); 
  }
}, [model?.templateId, cardContent.front.textBoxes.length, setCardContent]);

  useEffect(() => {
    setSelectedTextId(null);
  }, [currentCard]);

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
    if (!canvasDimensions.width || !canvasDimensions.height) return;
    const defaultWidth = Math.min(150, canvasDimensions.width * 0.45);
    const newTextBox = {
      id: Date.now(),
      text: 'Nouveau texte',
      style: { fontSize: 16, bold: false, italic: false, alignment: 'center', color: '#000000', lineHeight: 1.5, fontFamily: 'Playfair Display' },
      position: toPercentPosition({ x: canvasDimensions.width / 2 - defaultWidth / 2, y: canvasDimensions.height / 2 - 20 }, canvasDimensions),
      width: toPercentWidth(defaultWidth, canvasDimensions),
    };
    updateCurrentCardTextBoxes(prevTextBoxes => [...prevTextBoxes, newTextBox]); 
    setSelectedTextId(newTextBox.id);
  };
  
  const handleUpdateText = (id, newText) => updateCurrentCardTextBoxes(textBoxes.map(box => box.id === id ? { ...box, text: newText } : box));
  const handleUpdatePosition = (id, position) => updateCurrentCardTextBoxes(textBoxes.map(box => (
    box.id === id ? { ...box, position: toPercentPosition(position, canvasDimensions) } : box
  )));
  const handleUpdateWidth = (id, newWidth) => updateCurrentCardTextBoxes(textBoxes.map(box => (
    box.id === id ? { ...box, width: toPercentWidth(newWidth, canvasDimensions) } : box
  )));
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
  
  const handleDownloadExact = async () => {
    const canvas = contentContainerRef.current;
    if (!canvas) { alert("Erreur : La zone de personnalisation n'a pas pu etre trouvee."); return; }

    try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }

        const quantityValue = Object.entries(location.state || {}).find(([key]) => key.startsWith('qt'))?.[1];
        const cardSize = {
          width: selectedCardSize.width,
          height: selectedCardSize.width / designAspectRatio,
        };
        const pdfDoc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        pdfDoc.setFont('helvetica', 'bold');
        pdfDoc.setFontSize(20);
        pdfDoc.text('Recapitulatif de votre commande', 20, 30);
        pdfDoc.setFont('helvetica', 'normal');
        pdfDoc.setFontSize(12);
        pdfDoc.text(model?.name || '', 20, 42);
        pdfDoc.text(`Quantite: ${quantityValue || 'N/A'}`, 20, 60);
        pdfDoc.text(`Format: ${format || 'N/A'}`, 20, 72);
        pdfDoc.text(`Motif: ${motif || 'N/A'}`, 20, 84);

        const exportCards = [
          { ref: exportFrontRef },
          ...(model?.modelImagep2 ? [{ ref: exportBackRef }] : []),
        ];

        for (const card of exportCards) {
          const element = card.ref.current;
          if (!element) continue;

          await waitForImages(element);
          const cardCanvas = await html2canvas(element, {
            backgroundColor: '#ffffff',
            scale: 4,
            useCORS: true,
            logging: false,
          });

          const imageData = cardCanvas.toDataURL('image/png');
          pdfDoc.addPage([cardSize.width, cardSize.height], cardSize.width > cardSize.height ? 'landscape' : 'portrait');
          pdfDoc.addImage(imageData, 'PNG', 0, 0, cardSize.width, cardSize.height);
        }

        const blob = pdfDoc.output('blob');
        downloadBlob(blob, `${model?.name || 'invitation'}.pdf`);
    } catch (error) {
        console.error("Erreur lors de la generation du PDF:", error);
        alert("Une erreur est survenue lors de la creation du PDF. Veuillez reessayer.");
    }
  };
  
  // Corrected handler, now expects the full data object
const handleDesignChange = (newDesignData) => {
  if (newDesignData) {
      const updatedModel = {
          ...model,
          modelImage: newDesignData.modelImage,
          modelImagep2: newDesignData.modelImagep2,
          unsafeZones: newDesignData.unsafeZones || [],
      };
      
      // Reset history with the current text content for the new design
      setCardContent(cardContent, true); 

      navigate(location.pathname, { replace: true, state: { ...location.state, model: updatedModel } });
  }
};

  const updateUnsafeZone = (id, key, value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return;

    setEditableUnsafeZones((zones) => zones.map((zone) => (
      zone.id === id ? { ...zone, [key]: numericValue } : zone
    )));
  };

  const nudgeUnsafeZone = (id, key, amount) => {
    setEditableUnsafeZones((zones) => zones.map((zone) => (
      zone.id === id ? { ...zone, [key]: Math.round(((zone[key] || 0) + amount) * 10) / 10 } : zone
    )));
  };

  const selectedUnsafeZone = editableUnsafeZones.find((zone) => zone.id === selectedUnsafeZoneId) || editableUnsafeZones[0];

  // Corrected handler, now expects the full data object
  const handleTemplateChange = (newTemplateData) => {
    if (newTemplateData && newTemplateData.templateId && templateData[newTemplateData.templateId]?.prefilledTextBoxes) {
        const template = templateData[newTemplateData.templateId];
        
        const responsiveTextBoxes = template.prefilledTextBoxes.map(box => ({
            ...box,
            position: { x: box.position.x, y: box.position.y },
            width: box.width,
        }));
        
        const newContent = {
            front: { textBoxes: responsiveTextBoxes },
            back: { textBoxes: [] }
        };

        setCardContent(newContent, true);
    }
  };

  const renderTextBoxes = (cardKey) => {
    const boxes = renderedCardContent[cardKey]?.textBoxes || [];
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

  const renderExportTextBoxes = (cardKey) => {
    const boxes = cardContent[cardKey]?.textBoxes || [];

    return boxes.map((box) => {
      const style = box.style || {};

      return (
        <div
          key={box.id}
          style={{
            position: 'absolute',
            left: `${box.position?.x || 0}%`,
            top: `${box.position?.y || 0}%`,
            width: `${box.width || 40}%`,
            maxWidth: '100%',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            fontSize: `${getResponsiveFontSize(style.fontSize, canvasDimensions)}px`,
            fontWeight: style.bold ? 'bold' : 'normal',
            fontStyle: style.italic ? 'italic' : 'normal',
            textAlign: style.alignment || 'center',
            color: style.color || '#000000',
            lineHeight: style.lineHeight || 1.5,
            fontFamily: style.fontFamily || 'serif',
            direction: style.direction || 'ltr',
          }}
        >
          <div style={{ padding: '4px' }}>{box.text}</div>
        </div>
      );
    });
  };

  const renderExportCard = (cardKey, image, ref) => (
    <div
      ref={ref}
      className="relative overflow-hidden bg-white"
      style={{
        width: canvasStyle.width,
        height: canvasStyle.height,
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {image && <img src={image} alt="" className="hidden" crossOrigin="anonymous" />}
      {renderExportTextBoxes(cardKey)}
    </div>
  );

  const renderUnsafeZones = () => (
    (effectiveModel?.unsafeZones || []).map(zone => (
      <div
        key={zone.id}
        className={`absolute transition-opacity duration-300 hashed-background pointer-events-none z-20 outline outline-1 ${
          unsafeZoneEditorOpen || activeUnsafeZones.has(zone.id) ? 'opacity-100' : 'opacity-0'
        } ${
          selectedUnsafeZoneId === zone.id ? 'outline-red-600' : 'outline-transparent'
        }`}
        style={{
          left: `${zone.x}%`,
          top: `${zone.y}%`,
          width: `${zone.width}%`,
          height: `${zone.height}%`,
        }}
      />
    ))
  );
  
  const activeCardStyle = { transform: 'scale(1) translateX(-3%)', zIndex: 10 };
  const inactiveCardStyle = { transform: 'scale(0.92) translateX(9%)', zIndex: 5 };
  
// Determine the current active scale based on the card's style
const currentScale = (currentCard === 'front' ? activeCardStyle : inactiveCardStyle).transform.match(/scale\(([^)]+)\)/)[1] || 1;

// Pass this scale to the hook
const activeUnsafeZones = useUnsafeZoneCollision(effectiveModel, renderedCardContent, currentCard, contentContainerRef, currentScale);
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

  // NEW: State for design options, moved up from MainMenu
  const [designOptions, setDesignOptions] = useState([]);
  // NEW: useEffect to calculate designOptions. This logic is now here.
  useEffect(() => {
    if (model?.name) {
      const nameParts = model.name.split(' ');
      const category = nameParts[nameParts.length - 1];
      const capitalizedCategory = category?.charAt(0).toUpperCase() + category?.slice(1);
      const categoryModels = data.models[capitalizedCategory];

      if (categoryModels) {
        const options = Object.keys(categoryModels).map(templateId => ({
            templateId: templateId,
            name: categoryModels[templateId].name,
            frontImage: categoryModels[templateId].modelImage,
            fullData: categoryModels[templateId]
        }));
        setDesignOptions(options);
      } else {
        setDesignOptions([]);
      }
    }
  }, [model]);

  useEffect(() => {
    return () => {
      // localStorage.removeItem('savedInvitation');
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div
        aria-hidden="true"
        className="fixed pointer-events-none"
        style={{ left: '-10000px', top: 0, zIndex: -1 }}
      >
        {renderExportCard('front', model?.modelImage, exportFrontRef)}
        {model?.modelImagep2 && renderExportCard('back', model?.modelImagep2, exportBackRef)}
      </div>

      <div ref={headerRef} className="fixed top-0 left-0 w-full bg-white z-50 py-6">
        <div className="flex items-center justify-between px-4">
            <div className="flex space-x-2">
                <button onClick={() => navigate('/invitations-physique')} className="border border-black p-1 rounded">✕</button>
                <button onClick={undo} disabled={!canUndo} className="border border-black p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"><FiCornerDownLeft /></button>
                <button onClick={redo} disabled={!canRedo} className="border border-black p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"><FiCornerUpRight /></button>
            </div>
            <h1 className="text-base font-urbanist font-medium flex-1 text-center">{model?.name?.replace(/^Modèle\s/, '') || 'Personnalisation'}</h1>
            <div className="flex items-center gap-2">
              {unsafeZoneEditorEnabled && (
                <button
                  onClick={() => setUnsafeZoneEditorOpen((isOpen) => !isOpen)}
                  className={`border border-black px-3 py-2 font-urbanist text-sm ${
                    unsafeZoneEditorOpen ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  Zones
                </button>
              )}
              <button onClick={handleDownloadExact} className="bg-black text-white px-4 py-2 font-urbanist text-sm">Commander</button>
            </div>
        </div>
      </div>

      {unsafeZoneEditorEnabled && unsafeZoneEditorOpen && selectedUnsafeZone && (
        <div className="fixed top-24 right-2 z-50 w-[min(92vw,320px)] bg-white border border-gray-300 shadow-xl rounded-md p-3 font-urbanist text-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <strong className="text-sm">Unsafe zones</strong>
            <button
              onClick={() => setUnsafeZoneEditorOpen(false)}
              className="border border-gray-400 px-2 py-1"
            >
              Fermer
            </button>
          </div>

          <select
            className="w-full border border-gray-300 px-2 py-2 mb-3 bg-white"
            value={selectedUnsafeZone.id}
            onChange={(event) => setSelectedUnsafeZoneId(event.target.value)}
          >
            {editableUnsafeZones.map((zone) => (
              <option key={zone.id} value={zone.id}>{zone.id}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            {['x', 'y', 'width', 'height'].map((key) => (
              <label key={key} className="flex flex-col gap-1">
                <span className="uppercase text-[10px] text-gray-500">{key}</span>
                <input
                  type="number"
                  step="0.5"
                  value={selectedUnsafeZone[key]}
                  onChange={(event) => updateUnsafeZone(selectedUnsafeZone.id, key, event.target.value)}
                  className="border border-gray-300 px-2 py-1"
                />
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeUnsafeZone(selectedUnsafeZone.id, key, -0.5)}
                    className="border border-gray-300 py-1"
                  >
                    -0.5
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeUnsafeZone(selectedUnsafeZone.id, key, 0.5)}
                    className="border border-gray-300 py-1"
                  >
                    +0.5
                  </button>
                </div>
              </label>
            ))}
          </div>

          <textarea
            readOnly
            className="mt-3 h-24 w-full resize-none border border-gray-300 p-2 font-mono text-[10px]"
            value={JSON.stringify(editableUnsafeZones, null, 2)}
          />
        </div>
      )}
      
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
                    {renderUnsafeZones()}
                    {renderTextBoxes('front')}
                  </div>
              </div>
            </div>
          </div>
        </div>
        <CardSwitcher model={model} currentCard={currentCard} setCurrentCard={setCurrentCard} />
      </main>

      <div ref={mainMenuRef} className="fixed bottom-0 left-0 w-full z-40">
        {selectedTextId && textBoxes.find(b => b.id === selectedTextId) ? (
          <BottomMenu
            onDelete={handleDeleteText}
            setSelectedTextId={setSelectedTextId}
            fontSize={textBoxes.find(b => b.id === selectedTextId)?.style.fontSize || 16}
            setFontSize={size => updateTextStyle('fontSize', size)}
            lineHeight={textBoxes.find(b => b.id === selectedTextId)?.style.lineHeight || 1.5}
            setLineHeight={line => updateTextStyle('lineHeight', line)}
            alignment={textBoxes.find(b => b.id === selectedTextId)?.style.alignment || 'center'}
            setAlignment={val => updateTextStyle('alignment', val)}
            fontFamily={textBoxes.find(b => b.id === selectedTextId)?.style.fontFamily}
            setFontFamily={val => updateTextStyle('fontFamily', val)}
            textColor={textBoxes.find(b => b.id === selectedTextId)?.style.color || '#000000'}
            setTextColor={val => updateTextStyle('color', val)}
            activeTab={activeTab} // Pass these for BottomMenu's own tabs
            setActiveTab={setActiveTab}
            // Pass any other missing props like isBold, isItalic if your BottomMenu needs them
            isBold={textBoxes.find(b => b.id === selectedTextId)?.style.bold || false}
            setIsBold={val => updateTextStyle('bold', val)}
            isItalic={textBoxes.find(b => b.id === selectedTextId)?.style.italic || false}
            setIsItalic={val => updateTextStyle('italic', val)}
          />
        ) : activeTab === 'design' ? (
          <ApparenceMenu
            model={model}
            designOptions={designOptions}
            onDesignChange={handleDesignChange}
            onTemplateChange={handleTemplateChange}
            onClose={() => setActiveTab(null)}
          />
        ) : (
          <MainMenu
            onAddText={handleAddText}
            onShowApparenceMenu={() => setActiveTab('design')}
          />
        )}
      </div>
    </div>
  );
}

export default PersonalizeInvitationPage;
