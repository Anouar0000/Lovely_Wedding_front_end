import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainMenu from '../components/canvas/MainMenu';
import BottomMenu from '../components/canvas/BottomMenu';
import TextBox from '../components/canvas/TextBox';
import { pdf } from '@react-pdf/renderer';
import FinalPDFDocument from '../components/canvas/FinalPDFDocument'; 
import { FiCornerDownLeft, FiCornerUpRight } from 'react-icons/fi';

import useHistory from '../hooks/useHistory';
import { templateData } from '../data/templateData.js'; // Make sure this path is correct

const INVITATION_ASPECT_RATIO = 1 / 1.414;
const MIN_CANVAS_WIDTH = 320;
const zoomConfig = { zoomOriginOffset: { x: -200, y: -400 } };

function PersonalizeInvitationPage() {
  const [activeTab, setActiveTab] = useState(null);
  const { state: textBoxes, setState: setTextBoxes, undo, redo, canUndo, canRedo } = useHistory([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);
  const [canvasStyle, setCanvasStyle] = useState({ width: '100%', height: '100%' });
  const [mainPadding, setMainPadding] = useState({ top: 0, bottom: 0 });

  const navigate = useNavigate();
  const location = useLocation();
  const { model, qté, format, motif } = location.state || {};
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const headerRef = useRef(null);
  const mainMenuRef = useRef(null);
  const wrapperRef = useRef(null);
  const transformPlaneRef = useRef(null);
  const contentContainerRef = useRef(null);
  const initialPinchDistance = useRef(0);
  const lastTouch = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(scale);
  const translateRef = useRef(translate);
  useEffect(() => { scaleRef.current = scale; translateRef.current = translate; }, [scale, translate]);

  useEffect(() => {
    if (!model) {
      navigate('/invitations-physique');
      return;
    }
    
    setSelectedTemplate(model.modelImage || null);
    
    const templateId = model?.templateId;
    
    if (templateId && templateData[templateId]) {
      setTextBoxes(templateData[templateId].prefilledTextBoxes);
    } else {
      setTextBoxes([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  useEffect(() => {
    if (selectedTextId === null) return;
    const selectionExists = textBoxes.some(box => box.id === selectedTextId);
    if (!selectionExists) {
      setSelectedTextId(null);
    }
  }, [textBoxes, selectedTextId]);

  useLayoutEffect(() => {
    const calculateAndSetLayout = () => {
      const topOffset = headerRef.current ? headerRef.current.offsetHeight : 0;
      const bottomOffset = mainMenuRef.current ? mainMenuRef.current.offsetHeight : 0;
      const topPaddingValue = topOffset + 5;
      const bottomPaddingValue = bottomOffset + 64;
      setMainPadding({ top: topPaddingValue, bottom: bottomPaddingValue });
      const availableWidth = window.innerWidth - 32;
      const availableHeight = window.innerHeight - topPaddingValue - bottomPaddingValue;
      const widthIfLimitedByHeight = availableHeight * INVITATION_ASPECT_RATIO;
      let fitWidth = (widthIfLimitedByHeight < availableWidth) ? widthIfLimitedByHeight : availableWidth;
      const finalWidth = Math.max(fitWidth, MIN_CANVAS_WIDTH);
      const finalHeight = finalWidth / INVITATION_ASPECT_RATIO;
      setCanvasStyle({ width: `${finalWidth}px`, height: `${finalHeight}px` });
    };
    calculateAndSetLayout();
    window.addEventListener('resize', calculateAndSetLayout);
    return () => window.removeEventListener('resize', calculateAndSetLayout);
  }, []);

  const handleAddText = () => {
    const contentContainer = contentContainerRef.current;
    if (!contentContainer) return;
    const newTextBox = { id: Date.now(), text: 'Nouveau texte', style: { fontSize: 16, bold: false, italic: false, alignment: 'center', color: '#000000', lineHeight: 1.5, fontFamily: 'Playfair Display' }, position: { x: contentContainer.clientWidth / 2 - 75, y: contentContainer.clientHeight / 2 - 20 }, width: 150 };
    setTextBoxes([...textBoxes, newTextBox]); 
    setSelectedTextId(newTextBox.id);
  };
  
  const handleUpdateText = (id, newText) => setTextBoxes(textBoxes.map(box => box.id === id ? { ...box, text: newText } : box));
  const handleUpdatePosition = (id, position) => setTextBoxes(textBoxes.map(box => box.id === id ? { ...box, position } : box));
  const handleUpdateWidth = (id, newWidth) => setTextBoxes(textBoxes.map(box => (box.id === id ? { ...box, width: newWidth } : box)));
  const handleDeleteText = () => { setTextBoxes(textBoxes.filter(box => box.id !== selectedTextId)); setSelectedTextId(null); };
  const updateTextStyle = (key, value) => setTextBoxes(textBoxes.map(box => box.id === selectedTextId ? { ...box, style: { ...box.style, [key]: value } } : box));
  const handleCanvasClick = (e) => { if (e.target === contentContainerRef.current) { setSelectedTextId(null); } };
  
  const handleDownload = async () => {
    const canvas = contentContainerRef.current;
    if (!canvas) { alert("Erreur : La zone de personnalisation n'a pas pu être trouvée."); return; }
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    const defaultStyles = { fontSize: 16, color: '#000000', alignment: 'left', italic: false, bold: false, fontFamily: 'Helvetica', lineHeight: 1.5 };
    const sanitizedTextBoxes = textBoxes.map(box => ({ ...box, style: { ...defaultStyles, ...box.style } }));
    try {
      const blob = await pdf(<FinalPDFDocument selectedTemplate={selectedTemplate} textBoxes={sanitizedTextBoxes} canvasDimensions={{ width: canvasWidth, height: canvasHeight }} qte={qté} format={format} motif={motif} modelName={model.name} safeArea={{ top: 0, bottom: 0, left: 0, right: 0 }} verticalAlignmentPercent={50} />).toBlob();
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

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const getDistance = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    const getMidpoint = (touches) => ({ x: (touches[0].clientX + touches[1].clientX) / 2, y: (touches[0].clientY + touches[1].clientY) / 2 });
    let initialScale = 1; let initialTranslate = { x: 0, y: 0 };
    const handleTouchStart = (e) => { setIsInteracting(true); if (e.touches.length === 1) { lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; } else if (e.touches.length === 2) { initialPinchDistance.current = getDistance(e.touches); initialScale = scaleRef.current; initialTranslate = translateRef.current; } };
    const handleTouchMove = (e) => { e.preventDefault(); if (e.touches.length === 2 && initialPinchDistance.current > 0) { const newPinchDistance = getDistance(e.touches); const scaleDelta = newPinchDistance / initialPinchDistance.current; const newScale = Math.min(Math.max(initialScale * scaleDelta, 0.8), 4); const midpoint = getMidpoint(e.touches); const rect = wrapper.getBoundingClientRect(); const fingerPosInElement = { x: (midpoint.x - rect.left) + zoomConfig.zoomOriginOffset.x, y: (midpoint.y - rect.top) + zoomConfig.zoomOriginOffset.y, }; const newTranslate = { x: fingerPosInElement.x - (fingerPosInElement.x - initialTranslate.x) * (newScale / initialScale), y: fingerPosInElement.y - (fingerPosInElement.y - initialTranslate.y) * (newScale / initialScale), }; setScale(newScale); setTranslate(newTranslate); } else if (e.touches.length === 1) { if (scaleRef.current <= 1) return; const { clientX, clientY } = e.touches[0]; const dx = clientX - lastTouch.current.x; const dy = clientY - lastTouch.current.y; setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy })); lastTouch.current = { x: clientX, y: clientY }; } };
    
    const handleTouchEnd = () => {
      setIsInteracting(false);
      initialPinchDistance.current = 0;
      const currentScale = scaleRef.current;
      if (currentScale < 1) {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
      } else {
        const wrapperWidth = wrapper.clientWidth;
        const wrapperHeight = wrapper.clientHeight;
        const maxPan = {
          x: (wrapperWidth * currentScale - wrapperWidth) / 2,
          y: (wrapperHeight * currentScale - wrapperHeight) / 2,
        };
        setTranslate((prev) => ({
          x: Math.max(-maxPan.x, Math.min(prev.x, maxPan.x)),
          // *** THIS IS THE FIX ***
          // Corrected `maxAn.y` to `maxPan.y`
          y: Math.max(-maxPan.y, Math.min(prev.y, maxPan.y)),
        }));
      }
    };
    
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd);
    wrapper.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
      wrapper.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div ref={headerRef} className="fixed top-0 left-0 w-full bg-white z-50 py-6">
        <div className="flex items-center justify-between px-4">
            <div className="flex space-x-2">
                <button onClick={() => navigate('/invitations-physique')} className="border border-black p-1 rounded">✕</button>
                <button onClick={undo} disabled={!canUndo} className="border border-black p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiCornerDownLeft />
                </button>
                <button onClick={redo} disabled={!canRedo} className="border border-black p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiCornerUpRight />
                </button>
            </div>
            <h1 className="text-base font-urbanist font-medium flex-1 text-center">{model?.name?.replace(/^Modèle\s/, '') || 'Personnalisation'}</h1>
            <button onClick={handleDownload} className="bg-black text-white px-4 py-2 font-urbanist text-sm">Commander</button>
        </div>
      </div>
      
      <main style={{ paddingTop: `${mainPadding.top}px`, paddingBottom: `${mainPadding.bottom}px` }}>
        <div className="relative mx-auto" style={{ width: canvasStyle.width, height: canvasStyle.height }}>
          <div ref={wrapperRef} className="absolute top-0 left-0 w-full h-full bg-transparent touch-none">
            <div ref={transformPlaneRef} className="absolute top-0 left-0 w-full h-full" style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`, transition: isInteracting ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)'}}>
              <div ref={contentContainerRef} onClick={handleCanvasClick} className="absolute top-0 left-0 w-full h-full">
                {selectedTemplate && (
                  <div className="absolute top-0 bottom-0 left-0 right-0" style={{ backgroundImage: `url(${selectedTemplate})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', pointerEvents: 'none' }} />
                )}
                {textBoxes.map((box) => (
                  <TextBox key={box.id} id={box.id} text={box.text} style={box.style} position={box.position} width={box.width} isSelected={box.id === selectedTextId} onSelect={setSelectedTextId} onUpdate={handleUpdateText} onUpdatePosition={handleUpdatePosition} onUpdateWidth={handleUpdateWidth} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div ref={mainMenuRef} className="fixed bottom-0 left-0 w-full z-40">
        <MainMenu onAddText={handleAddText} onDelete={handleDeleteText} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} activeTab={activeTab} setActiveTab={setActiveTab} model={model} />
        {selectedTextId && textBoxes.find(b => b.id === selectedTextId) && ( <BottomMenu onDelete={handleDeleteText} activeTab={activeTab} setActiveTab={setActiveTab} fontSize={textBoxes.find(b => b.id === selectedTextId)?.style.fontSize || 16} setFontSize={size => updateTextStyle('fontSize', size)} lineHeight={textBoxes.find(b => b.id === selectedTextId)?.style.lineHeight || 1.5} setLineHeight={line => updateTextStyle('lineHeight', line)} isBold={textBoxes.find(b => b.id === selectedTextId)?.style.bold || false} setIsBold={val => updateTextStyle('bold', val)} isItalic={textBoxes.find(b => b.id === selectedTextId)?.style.italic || false} setIsItalic={val => updateTextStyle('italic', val)} alignment={textBoxes.find(b => b.id === selectedTextId)?.style.alignment || 'center'} setAlignment={val => updateTextStyle('alignment', val)} fontFamily={textBoxes.find(b => b.id === selectedTextId)?.style.fontFamily} setFontFamily={val => updateTextStyle('fontFamily', val)} textColor={textBoxes.find(b => b.id === selectedTextId)?.style.color || '#000000'} setTextColor={val => updateTextStyle('color', val)} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setSelectedTextId={setSelectedTextId} /> )}
      </div>
    </div>
  );
}

export default PersonalizeInvitationPage;