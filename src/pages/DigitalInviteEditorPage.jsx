import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiClock,
  FiCopy,
  FiEdit2,
  FiExternalLink,
  FiFileText,
  FiHome,
  FiLink,
  FiLayers,
  FiMapPin,
  FiPlus,
  FiSave,
  FiSettings,
  FiTrash2,
  FiUploadCloud,
  FiChevronDown,
  FiChevronRight,
  FiMove,
  FiRotateCcw,
} from "react-icons/fi";
import {
  createDigitalInviteDraft,
  deleteDigitalInvite,
  getDigitalInviteById,
  saveDigitalInvite,
  updateDigitalInvite,
  uploadInviteAsset,
} from "../services/digitalInvites";
import {
  digitalInviteTemplates,
  getDefaultDigitalInviteTemplate,
  getDigitalInviteTemplate,
} from "../templates/digitalInviteTemplates";

const defaultTemplate = getDefaultDigitalInviteTemplate();

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDateLabel(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");

  if (!year || !month || !day) {
    return "";
  }

  return `${day}.${month}.${year}`;
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full border border-[#D8DDE2] bg-white px-4 py-3 text-base outline-none focus:border-black"
    />
  );
}

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#E4E8EA] bg-[#F9FAF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="inline-flex items-center gap-3 font-abhaya text-3xl leading-none">
        <span className="inline-flex h-9 w-9 items-center justify-center border border-[#D8DDE2] bg-white text-base">
          <Icon aria-hidden="true" />
        </span>
        {title}
      </h2>
      {action}
    </div>
  );
}

function EditorSection({ icon, title, children, action }) {
  return (
    <div className="border border-[#D8DDE2] bg-white shadow-sm">
      <SectionHeader icon={icon} title={title} action={action} />
      <div className="p-5">{children}</div>
    </div>
  );
}




const SECTION_LIST = [
  { id: 'hero', label: 'Ouverture (Hero)' },
  { id: 'reveal', label: 'Dévoilement (النهار جاء)' },
  { id: 'our-story', label: 'Notre Histoire (حكايتنا)' },
  { id: 'countdown', label: 'Compte à rebours' },
  { id: 'celebrations', label: 'Célébrations' },
  { id: 'dress-code', label: 'Dress Code' },
  { id: 'programme', label: 'Programme' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'footer', label: 'Pied de page' },
  { id: 'settings', label: 'Animations & Musique' }
];

const getElementsForSection = (sectionId) => {
  switch (sectionId) {
    case 'hero': return [
      { id: 'sec-hero', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'hero-bg', label: 'Arrière-plan', controls: ['upload'] },
      { id: 'hero-initials', label: 'Cercle Initiales (Groupe)', controls: ['position', 'radius', 'color', 'font', 'fontSize'], subElements: [ { id: 'hero-initial-1', label: 'Initiale 1' }, { id: 'hero-initial-2', label: 'Initiale 2' } ] },
      { id: 'hero-names', label: 'Noms du Couple (Groupe)', controls: ['position', 'font', 'fontSize', 'color'], subElements: [ { id: 'hero-name-1', label: 'Nom 1' }, { id: 'hero-name-2', label: 'Nom 2' } ] },
      { id: 'hero-date', label: 'Date (Groupe)', controls: ['position', 'font', 'fontSize', 'color'], subElements: [ { id: 'hero-date-month', label: 'Mois' }, { id: 'hero-date-year', label: 'Année' } ] },
      { id: 'hero-subtitle', label: 'Sous-titre', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'hero-btn', label: 'Bouton Scroll', controls: ['position', 'radius', 'color', 'font', 'fontSize', 'text'] }
    ];
    case 'reveal': return [
      { id: 'sec-reveal', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'reveal-title', label: 'Titre EN', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'reveal-title-ar', label: 'Titre AR (النهار جاء)', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'reveal-doors', label: 'Portes (Images)', controls: ['position', 'upload'] },
      { id: 'reveal-date', label: 'Date cachée', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'reveal-hands', label: 'Mains (Image bas)', controls: ['position', 'upload'] }
    ];
    case 'our-story': return [
      { id: 'sec-story', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'story-title', label: 'Titre EN', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'story-title-ar', label: 'Titre AR (حكايتنا)', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'story-quote', label: 'Texte Rotatif', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'story-photo', label: 'Photo de Couple', controls: ['position', 'upload'] },
      { id: 'story-ornaments', label: 'Ornements (Fleurs, Timbres)', controls: ['position', 'upload'] }
    ];
    case 'countdown': return [
      { id: 'sec-countdown', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'countdown-title', label: 'Titre EN', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'countdown-title-ar', label: 'Titre AR (العد التنازلي)', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'countdown-date', label: 'Date et Chiffres', controls: ['position', 'font', 'fontSize', 'color'] }
    ];
    case 'celebrations': return [
      { id: 'sec-celeb', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'celeb-title', label: 'Titre EN', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'celeb-title-ar', label: 'Titre AR (الليالي)', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'celeb-venue', label: 'Nom du Lieu', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'celeb-list', label: 'Liste des Événements (Timeline)', controls: ['eventList'] }
    ];
    case 'dress-code': return [
      { id: 'sec-dress', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'dress-title', label: 'Titre EN', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'dress-title-ar', label: 'Titre AR (التبديلة)', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'dress-text', label: 'Texte Instructions', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'dress-illustration', label: 'Illustration', controls: ['position', 'upload'] }
    ];
    case 'programme': return [
      { id: 'sec-prog', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'prog-title', label: 'Titre EN', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'prog-title-ar', label: 'Titre AR (البرنامج)', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'prog-steps', label: 'Étapes du Programme', controls: ['progStepsList', 'position', 'font', 'fontSize', 'color'] }
    ];
    case 'rsvp': return [
      { id: 'sec-rsvp', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'rsvp-title', label: 'Titre RSVP', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'rsvp-form', label: 'Formulaire / Sous-titre', controls: ['position', 'font', 'fontSize', 'color', 'text'] }
    ];
    case 'footer': return [
      { id: 'sec-footer', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'footer-initials', label: 'Cercle Final', controls: ['position', 'radius', 'color', 'font', 'fontSize'], subElements: [ { id: 'footer-initial-1', label: 'Initiale 1' }, { id: 'footer-initial-2', label: 'Initiale 2' } ] },
      { id: 'footer-arabic', label: 'Texte de clôture', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'footer-names', label: 'Noms', controls: ['position', 'font', 'fontSize', 'color', 'text'] }
    ];
    case 'settings': return [
      { id: 'global-music', label: 'Musique de fond (MP3)', controls: ['musicUpload'] },
      { id: 'global-video', label: 'Vidéo d\'ouverture (MP4)', controls: ['videoUpload'] },
      { id: 'visual-effects', label: 'Effets Visuels', controls: ['petalsToggle'] },
      { id: 'text-animation', label: 'Apparition du texte', controls: ['animationType', 'animationDuration', 'animationDelay'] }
    ];
    default: return [];
  }
};

function ElementMenu({ sectionId, expandedElement, setExpandedElement, invite, updateInvite, handleMusicUpload, uploadingMusic, handleVideoUpload, uploadingVideo, addTimelineItem, updateTimelineItem, removeTimelineItem, FiPlus, FiTrash2 }) {
   const elements = getElementsForSection(sectionId);
   
   return (
     <div className="space-y-2">
       {elements.map(el => (
         <div key={el.id} id={`editor-el-${el.id}`} className="border border-gray-200 bg-white shadow-sm overflow-hidden">
            <button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                setExpandedElement(expandedElement === el.id ? null : el.id);
              }} 
              className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              {el.label}
              <FiChevronDown className={`transition-transform ${expandedElement === el.id ? 'rotate-180' : ''}`} />
            </button>
            
            {expandedElement === el.id && (
               <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-4">
                 
                 
                 {/* Position Controls */}
                 {el.controls.includes('position') && invite && updateInvite && (
                   <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Pos X (Gauche)</label>
                        <input 
                          type="number" 
                          value={invite.styleOverrides?.[el.id]?.posX || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const current = invite.styleOverrides?.[el.id] || {};
                            updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, posX: val } });
                          }}
                          className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black" 
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Pos Y (Haut)</label>
                        <input 
                          type="number" 
                          value={invite.styleOverrides?.[el.id]?.posY || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const current = invite.styleOverrides?.[el.id] || {};
                            updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, posY: val } });
                          }}
                          className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black" 
                          placeholder="0"
                        />
                      </div>
                   </div>
                 )}
                 {/* Sub Elements Position Controls */}
                 {el.subElements && invite && updateInvite && (
                   <div className="space-y-3 mt-4 pt-3 border-t border-gray-200">
                     {el.subElements.map(subEl => (
                       <div key={subEl.id}>
                         <div className="text-[10px] font-bold text-gray-700 uppercase mb-2 flex items-center gap-1.5"><FiMove size={12} className="text-gray-400"/> {subEl.label}</div>
                         <div className="grid grid-cols-2 gap-2">
                           <div>
                             <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Pos X (Gauche)</label>
                             <input 
                               type="number" 
                               value={invite.styleOverrides?.[subEl.id]?.posX || 0}
                               onChange={(e) => {
                                 const val = parseInt(e.target.value) || 0;
                                 const current = invite.styleOverrides?.[subEl.id] || {};
                                 updateInvite('styleOverrides', { ...invite.styleOverrides, [subEl.id]: { ...current, posX: val } });
                               }}
                               className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black bg-white" 
                             />
                           </div>
                           <div>
                             <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Pos Y (Haut)</label>
                             <input 
                               type="number" 
                               value={invite.styleOverrides?.[subEl.id]?.posY || 0}
                               onChange={(e) => {
                                 const val = parseInt(e.target.value) || 0;
                                 const current = invite.styleOverrides?.[subEl.id] || {};
                                 updateInvite('styleOverrides', { ...invite.styleOverrides, [subEl.id]: { ...current, posY: val } });
                               }}
                               className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black bg-white" 
                             />
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 
                 {/* Position Y Only Controls */}
                 {el.controls.includes('positionYOnly') && invite && updateInvite && (
                   <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Offset Global Section Y (Haut/Bas)</label>
                        <input 
                          type="number" 
                          value={invite.styleOverrides?.[el.id]?.posY || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const current = invite.styleOverrides?.[el.id] || {};
                            updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, posY: val } });
                          }}
                          className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black" 
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1 mt-2">Hauteur Supplémentaire (px)</label>
                        <input 
                          type="number" 
                          value={invite.styleOverrides?.[el.id]?.height || 0}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            const current = invite.styleOverrides?.[el.id] || {};
                            updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, height: val } });
                          }}
                          className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black" 
                          placeholder="0"
                        />
                      </div>
                   </div>
                 )}

                 {/* Text Spacing Control */}
                 {el.controls.includes('textSpacing') && (
                   <div>
                     <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Espace (En / Ar)</label>
                     <input type="number" className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black" placeholder="px" />
                   </div>
                 )}

                 {/* Radius Controls */}
                 {el.controls.includes('radius') && (
                   <div>
                     <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Border Radius</label>
                     <input type="number" className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black" placeholder="Radius (px ou %)" />
                   </div>
                 )}

                 {/* Typography Controls */}
                 {(el.controls.includes('font') || el.controls.includes('color') || el.controls.includes('fontSize')) && (
                   <div className="grid grid-cols-3 gap-2">
                      {el.controls.includes('font') && (
                        <div className="col-span-2">
                          <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Police (Font)</label>
                          <select 
                            className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black"
                            value={invite.styleOverrides?.[el.id]?.fontFamily || "Défaut du Template"}
                            onChange={(e) => {
                              const val = e.target.value;
                              const current = invite.styleOverrides?.[el.id] || {};
                              updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, fontFamily: val } });
                            }}
                          >
                            <option>Défaut du Template</option>
                            <option>Urbanist</option>
                            <option>Pinyon Script</option>
                            <option>Crimson Text</option>
                            <option>Antic Didone</option>
                            <option>Gulzar</option>
                            <option>Cormorant</option>
                            <option>Cormorant Infant</option>
                            <option>Beau Rivage</option>
                            <option>B Fantezy</option>
                            <option>Bodoni Moda</option>
                            <option>Sue Ellen Francisco</option>
                            <option>Rosario</option>
                            <option>Onirom</option>
                          </select>
                        </div>
                      )}
                      {el.controls.includes('fontSize') && (
                        <div>
                          <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Taille (px)</label>
                          <input 
                            type="number" 
                            className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black" 
                            placeholder="24"
                            value={invite.styleOverrides?.[el.id]?.fontSize || ""}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              const current = invite.styleOverrides?.[el.id] || {};
                              updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, fontSize: val || undefined } });
                            }}
                          />
                        </div>
                      )}
                   </div>
                 )}

                 {el.controls.includes('color') && (
                   <div>
                     <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Couleur</label>
                     <div className="flex items-center gap-2">
                       <input 
                         type="color" 
                         className="h-7 w-7 border-0 p-0 cursor-pointer" 
                         value={invite.styleOverrides?.[el.id]?.color || "#08306b"}
                         onChange={(e) => {
                           const val = e.target.value;
                           const current = invite.styleOverrides?.[el.id] || {};
                           updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, color: val } });
                         }}
                       />
                       <span className="text-xs text-gray-600 font-mono uppercase">{invite.styleOverrides?.[el.id]?.color || "#08306b"}</span>
                     </div>
                   </div>
                 )}

                 
                 {/* Event List Array Editor */}
                 {el.controls.includes('eventList') && invite && (
                   <div className="space-y-4">
                      {invite.timeline && invite.timeline.map((event, index) => (
                        <div key={index} className="border border-gray-200 bg-white p-3 space-y-3 relative">
                           <div className="flex items-center justify-between">
                             <span className="text-xs font-bold text-gray-700">Événement {index + 1}</span>
                             <button type="button" onClick={() => removeTimelineItem(index)} className="text-red-500 hover:text-red-700"><FiTrash2 size={14} /></button>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                             <div>
                               <label className="block text-[9px] font-semibold text-gray-500 uppercase">Titre (EN)</label>
                               <input type="text" value={event.title || ''} onChange={(e) => updateTimelineItem(index, 'title', e.target.value)} className="w-full border p-1.5 text-xs outline-none focus:border-black" />
                             </div>
                             <div>
                               <label className="block text-[9px] font-semibold text-gray-500 uppercase">Titre (AR)</label>
                               <input type="text" value={event.titleAr || ''} onChange={(e) => updateTimelineItem(index, 'titleAr', e.target.value)} className="w-full border p-1.5 text-xs outline-none focus:border-black" />
                             </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                             <div>
                               <label className="block text-[9px] font-semibold text-gray-500 uppercase">Date</label>
                               <input type="date" value={event.date || ''} onChange={(e) => updateTimelineItem(index, 'date', e.target.value)} className="w-full border p-1.5 text-xs outline-none focus:border-black" />
                             </div>
                             <div>
                               <label className="block text-[9px] font-semibold text-gray-500 uppercase">Heure</label>
                               <input type="text" value={event.time || ''} onChange={(e) => updateTimelineItem(index, 'time', e.target.value)} className="w-full border p-1.5 text-xs outline-none focus:border-black" />
                             </div>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                             <div>
                               <label className="block text-[9px] font-semibold text-gray-500 uppercase">Lieu</label>
                               <input type="text" value={event.venue || ''} onChange={(e) => updateTimelineItem(index, 'venue', e.target.value)} className="w-full border p-1.5 text-xs outline-none focus:border-black" />
                             </div>
                             <div>
                               <label className="block text-[9px] font-semibold text-gray-500 uppercase">Ville</label>
                               <input type="text" value={event.city || ''} onChange={(e) => updateTimelineItem(index, 'city', e.target.value)} className="w-full border p-1.5 text-xs outline-none focus:border-black" />
                             </div>
                           </div>
                           <div>
                             <label className="block text-[9px] font-semibold text-gray-500 uppercase">Lien Maps</label>
                             <input type="text" value={event.mapUrl || ''} onChange={(e) => updateTimelineItem(index, 'mapUrl', e.target.value)} className="w-full border p-1.5 text-xs outline-none focus:border-black" />
                           </div>
                        </div>
                      ))}
                      <button type="button" onClick={addTimelineItem} className="w-full py-2 border border-dashed border-gray-400 text-xs font-semibold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50">
                        <FiPlus size={14} /> Ajouter un événement
                      </button>
                   </div>
                 )}

                  {/* Music Upload Control */}
                  {el.controls.includes('musicUpload') && invite && (
                    <div className="space-y-2">
                      <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Fichier Audio (MP3)</label>
                      {invite.musicUrl ? (
                        <div className="flex items-center justify-between mb-2 border border-emerald-200 bg-emerald-50 p-2">
                          <div className="text-xs text-emerald-800 font-semibold truncate max-w-[200px]">♪ Musique active</div>
                          <button type="button" onClick={() => updateInvite('musicUrl', '')} className="text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer">Supprimer</button>
                        </div>
                      ) : null}
                      <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleMusicUpload} 
                        disabled={uploadingMusic}
                        className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black file:border-0 file:bg-black file:text-white file:px-3 file:py-1 file:mr-2 file:text-xs cursor-pointer disabled:opacity-50" 
                      />
                      {uploadingMusic && <div className="text-xs text-amber-600 font-semibold">Téléchargement en cours...</div>}
                      <div>
                        <label className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Ou URL Audio directe (.mp3)</label>
                        <input
                          type="text"
                          placeholder="https://.../music.mp3"
                          value={invite.musicUrl || ""}
                          onChange={(e) => updateInvite('musicUrl', e.target.value)}
                          className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black bg-white"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Video Upload Control */}
                  {el.controls.includes('videoUpload') && invite && (
                    <div className="space-y-2">
                      <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Fichier Vidéo d'ouverture (MP4)</label>
                      {invite.videoUrl ? (
                        <div className="flex items-center justify-between mb-2 border border-emerald-200 bg-emerald-50 p-2">
                          <div className="text-xs text-emerald-800 font-semibold truncate max-w-[200px]">▶ Vidéo active</div>
                          <button type="button" onClick={() => updateInvite('videoUrl', '')} className="text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer">Supprimer</button>
                        </div>
                      ) : null}
                      <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleVideoUpload} 
                        disabled={uploadingVideo}
                        className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black file:border-0 file:bg-black file:text-white file:px-3 file:py-1 file:mr-2 file:text-xs cursor-pointer disabled:opacity-50" 
                      />
                      {uploadingVideo && <div className="text-xs text-amber-600 font-semibold">Téléchargement en cours...</div>}
                      <div>
                        <label className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Ou URL Vidéo directe (.mp4)</label>
                        <input
                          type="text"
                          placeholder="https://.../intro.mp4"
                          value={invite.videoUrl || ""}
                          onChange={(e) => updateInvite('videoUrl', e.target.value)}
                          className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black bg-white"
                        />
                      </div>
                      
                      <label className="flex items-center gap-2 mt-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={invite.videoIntroEnabled !== false} 
                          onChange={(e) => updateInvite('videoIntroEnabled', e.target.checked)}
                          className="w-4 h-4 accent-black"
                        />
                        <span className="text-xs font-semibold text-gray-700">Activer la vidéo d'ouverture</span>
                      </label>
                    </div>
                  )}

                 {/* Petals Toggle */}
                 {el.controls.includes('petalsToggle') && invite && updateInvite && (
                   <div className="space-y-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                       <input 
                         type="checkbox" 
                         checked={invite.enablePetals !== false} 
                         onChange={(e) => updateInvite('enablePetals', e.target.checked)}
                         className="w-4 h-4 accent-black"
                       />
                       <span className="text-xs font-semibold text-gray-700">Activer la chute de pétales</span>
                     </label>
                     {invite.enablePetals !== false && (
                       <div>
                         <label className="flex items-center justify-between text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                           Intensité (Nombre)
                           <span className="text-black font-bold">{invite.petalsIntensity || 30}</span>
                         </label>
                         <input
                           type="range"
                           min="5"
                           max="150"
                           step="1"
                           value={invite.petalsIntensity || 30}
                           onChange={(e) => updateInvite('petalsIntensity', parseInt(e.target.value))}
                           className="w-full accent-black cursor-pointer"
                         />
                       </div>
                     )}
                   </div>
                 )}

                 {/* Text Animation Controls */}
                 {el.controls.includes('animationType') && invite && updateInvite && (
                   <div className="space-y-4">
                     <div>
                       <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Type d'apparition</label>
                       <select 
                         value={invite.animationType || 'fade-up'} 
                         onChange={(e) => updateInvite('animationType', e.target.value)}
                         className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-black"
                       >
                         <option value="none">Aucune (Désactivé)</option>
                         <option value="fade-up">Glissement vers le haut (Fade Up)</option>
                         <option value="fade-in">Fondu simple (Fade In)</option>
                         <option value="zoom-in">Zoom (Zoom In)</option>
                       </select>
                     </div>
                     <div>
                       <div className="flex justify-between items-center mb-1">
                         <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Durée (vitesse)</label>
                         <span className="text-[10px] font-mono text-gray-600">{invite.animationDuration || 1.2}s</span>
                       </div>
                       <input 
                         type="range" min="0.3" max="3.0" step="0.1" 
                         value={invite.animationDuration || 1.2} 
                         onChange={(e) => updateInvite('animationDuration', parseFloat(e.target.value))}
                         className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                         disabled={invite.animationType === 'none'}
                       />
                     </div>
                     <div>
                       <div className="flex justify-between items-center mb-1">
                         <label className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider">Délai initial (lag)</label>
                         <span className="text-[10px] font-mono text-gray-600">{invite.animationDelay !== undefined ? invite.animationDelay : 0.2}s</span>
                       </div>
                       <input 
                         type="range" min="0.0" max="3.0" step="0.1" 
                         value={invite.animationDelay !== undefined ? invite.animationDelay : 0.2} 
                         onChange={(e) => updateInvite('animationDelay', parseFloat(e.target.value))}
                         className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                         disabled={invite.animationType === 'none'}
                       />
                     </div>
                   </div>
                 )}

                 {/* Content Control */}
                 {el.controls.includes('text') && (
                   <div>
                      <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Texte / Contenu</label>
                      <textarea
                        value={invite.styleOverrides?.[el.id]?.text !== undefined ? invite.styleOverrides[el.id].text : ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const current = invite.styleOverrides?.[el.id] || {};
                          updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, text: val } });
                        }}
                        className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-black resize-y bg-white" 
                        rows={2} 
                        placeholder="Valeur personnalisée..." 
                      />
                   </div>
                 )}

                 {/* Programme Steps Array Editor */}
                 {el.controls.includes('progStepsList') && invite && (
                   <div className="space-y-3">
                     {(invite.programmeSteps || [
                       { time: "17:00", name: "Sdek" },
                       { time: "18:00", name: "Reception" },
                       { time: "20:00", name: "Dinner" },
                       { time: "00:00", name: "Dance" }
                     ]).map((step, sIndex) => (
                       <div key={sIndex} className="grid grid-cols-2 gap-2 border border-gray-200 bg-white p-2">
                         <div>
                           <label className="block text-[9px] font-semibold text-gray-500 uppercase">Heure</label>
                           <input
                             type="text"
                             value={step.time || ""}
                             onChange={(e) => {
                               const newSteps = [...(invite.programmeSteps || [
                                 { time: "17:00", name: "Sdek" },
                                 { time: "18:00", name: "Reception" },
                                 { time: "20:00", name: "Dinner" },
                                 { time: "00:00", name: "Dance" }
                               ])];
                               newSteps[sIndex] = { ...newSteps[sIndex], time: e.target.value };
                               updateInvite('programmeSteps', newSteps);
                             }}
                             className="w-full border p-1 text-xs outline-none focus:border-black"
                           />
                         </div>
                         <div>
                           <label className="block text-[9px] font-semibold text-gray-500 uppercase">Étape</label>
                           <input
                             type="text"
                             value={step.name || ""}
                             onChange={(e) => {
                               const newSteps = [...(invite.programmeSteps || [
                                 { time: "17:00", name: "Sdek" },
                                 { time: "18:00", name: "Reception" },
                                 { time: "20:00", name: "Dinner" },
                                 { time: "00:00", name: "Dance" }
                               ])];
                               newSteps[sIndex] = { ...newSteps[sIndex], name: e.target.value };
                               updateInvite('programmeSteps', newSteps);
                             }}
                             className="w-full border p-1 text-xs outline-none focus:border-black"
                           />
                         </div>
                       </div>
                     ))}
                   </div>
                 )}

                 {/* Media Upload (Image / Video) */}
                  {el.controls.includes('upload') && (
                    <div className="space-y-2">
                       <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Remplacer l'Image / Fond (Image ou Vidéo MP4)</label>
                       {invite.styleOverrides?.[el.id]?.image || (el.id === 'story-photo' && invite.storyPhoto) ? (
                         <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50 p-2">
                           <span className="text-xs text-emerald-800 font-semibold truncate max-w-[200px]">
                             {String(invite.styleOverrides?.[el.id]?.image || invite.storyPhoto).includes('video') || String(invite.styleOverrides?.[el.id]?.image).endsWith('.mp4') ? "▶ Vidéo active" : "🖼 Image active"}
                           </span>
                           <button
                             type="button"
                             onClick={() => {
                               const updated = { ...invite.styleOverrides };
                               if (updated[el.id]) {
                                 const copy = { ...updated[el.id] };
                                 delete copy.image;
                                 updated[el.id] = copy;
                               }
                               if (el.id === 'story-photo') updateInvite('storyPhoto', '');
                               updateInvite('styleOverrides', updated);
                             }}
                             className="text-xs text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                           >
                             Supprimer
                           </button>
                         </div>
                       ) : null}
                       <input
                         type="file"
                         accept="image/*,video/*"
                         onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (!file) return;
                           const reader = new FileReader();
                           reader.onload = (uploadEv) => {
                             const b64 = uploadEv.target.result;
                             const current = invite.styleOverrides?.[el.id] || {};
                             if (el.id === 'story-photo') updateInvite('storyPhoto', b64);
                             updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, image: b64 } });
                           };
                           reader.readAsDataURL(file);
                         }}
                         className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black file:border-0 file:bg-black file:text-white file:px-3 file:py-1 file:mr-2 file:text-xs cursor-pointer"
                       />
                       <div>
                         <label className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Ou URL directe (Image ou Vidéo MP4)</label>
                         <input
                           type="text"
                           placeholder="https://.../video.mp4 ou image.png"
                           value={invite.styleOverrides?.[el.id]?.image || ""}
                           onChange={(e) => {
                             const val = e.target.value;
                             const current = invite.styleOverrides?.[el.id] || {};
                             if (el.id === 'story-photo') updateInvite('storyPhoto', val);
                             updateInvite('styleOverrides', { ...invite.styleOverrides, [el.id]: { ...current, image: val } });
                           }}
                           className="w-full border border-gray-300 p-1.5 text-xs outline-none focus:border-black bg-white"
                         />
                       </div>
                    </div>
                  )}

               </div>
            )}
         </div>
       ))}
     </div>
   )
}

function DigitalInviteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [invite, setInvite] = useState(() =>
    createDigitalInviteDraft(defaultTemplate.defaults)
  );
  const [initialDocId, setInitialDocId] = useState(id || "");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [openEvents, setOpenEvents] = useState({});
  const [uploadingMusic, setUploadingMusic] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState({});

  const handleMediaUpload = async (elementId, file) => {
    if (!file) return;
    setUploadingMedia((prev) => ({ ...prev, [elementId]: true }));
    setError("");

    try {
      const inviteId = id || invite.slug || slugify(invite.coupleNames) || "temp-invite";
      let fileUrl;
      try {
        fileUrl = await uploadInviteAsset(inviteId, file, elementId);
      } catch (storageErr) {
        console.warn("Storage upload failed or not configured, using fallback:", storageErr);
        if (file.size < 600 * 1024) {
          const reader = new FileReader();
          fileUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
          });
        } else {
          throw new Error("Ce fichier est trop volumineux (>600Ko) pour Firestore. Utilisez une URL directe (https://...) ou configurez Firebase Storage.");
        }
      }

      setInvite((currentInvite) => {
        const currentOverrides = currentInvite.styleOverrides || {};
        const elOverrides = currentOverrides[elementId] || {};
        const updated = {
          ...currentOverrides,
          [elementId]: {
            ...elOverrides,
            image: fileUrl,
          },
        };
        const next = {
          ...currentInvite,
          styleOverrides: updated,
        };
        if (elementId === "story-photo") {
          next.storyPhoto = fileUrl;
        }
        return next;
      });
    } catch (err) {
      setError(err.message || "Erreur lors du téléchargement du média.");
    } finally {
      setUploadingMedia((prev) => ({ ...prev, [elementId]: false }));
    }
  };

  const toggleEvent = (index) => {
    setOpenEvents((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDragStart = (event, index) => {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, index) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setInvite((currentInvite) => {
      const updatedTimeline = [...currentInvite.timeline];
      const [removed] = updatedTimeline.splice(draggedIndex, 1);
      updatedTimeline.splice(index, 0, removed);

      setOpenEvents((prev) => {
        const nextOpen = {};
        updatedTimeline.forEach((item, idx) => {
          const oldIdx = currentInvite.timeline.indexOf(item);
          nextOpen[idx] = prev[oldIdx] || false;
        });
        return nextOpen;
      });

      return {
        ...currentInvite,
        timeline: updatedTimeline,
      };
    });

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  useEffect(() => {
    let isMounted = true;

    const loadInvite = async () => {
      if (!id) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        let loadedInvite = await getDigitalInviteById(id);
        if (!loadedInvite) {
          try {
            const cached = localStorage.getItem("digital_invite_" + id);
            if (cached) loadedInvite = JSON.parse(cached);
          } catch (e) {}
        }

        if (!isMounted) {
          return;
        }

        if (!loadedInvite) {
          if (id === "test" || id === "demo") {
            const sidiTpl = getDigitalInviteTemplate("sidi-bousaid") || defaultTemplate;
            loadedInvite = {
              ...createDigitalInviteDraft(sidiTpl.defaults),
              slug: id,
            };
          } else {
            setError("Invitation introuvable.");
            return;
          }
        }

        const loadedTemplate = getDigitalInviteTemplate(loadedInvite.template) || defaultTemplate;

        setInvite({
          ...createDigitalInviteDraft(loadedTemplate.defaults),
          ...loadedInvite,
          timeline: loadedInvite.timeline?.length
            ? loadedInvite.timeline
            : loadedTemplate.defaults.timeline,
        });
        setInitialDocId(loadedInvite.id);
      } catch (loadError) {
        if (isMounted) {
          setError("Impossible de charger cette invitation.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadInvite();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const publicPath = useMemo(() => {
    if (!invite.slug) {
      return "";
    }

    return `/${invite.slug}`;
  }, [invite.slug]);

  const dashboardPreviewPath = useMemo(() => {
    const previewId = initialDocId || invite.slug;

    if (!previewId) {
      return "";
    }

    return `/dashboard/invitations/${previewId}/preview`;
  }, [initialDocId, invite.slug]);

  const publicUrl = useMemo(() => {
    if (!publicPath) {
      return "";
    }

    return `${window.location.origin}${publicPath}`;
  }, [publicPath]);

  const selectedTemplate = getDigitalInviteTemplate(invite.template) || defaultTemplate;
  const isSidiBouSaid = invite.template === "sidi-bousaid";
  const getNames = (coupleNames) => {
    if (!coupleNames) return { wife: "", husband: "" };
    const parts = coupleNames.split("&");
    return {
      wife: parts[0]?.trim() || "",
      husband: parts[1]?.trim() || "",
    };
  };
  const { wife, husband } = getNames(invite.coupleNames || "");

  const handlePartnerNameChange = (partnerIndex, newName) => {
    const current = getNames(invite.coupleNames || "");
    const updatedWife = partnerIndex === 0 ? newName : current.wife;
    const updatedHusband = partnerIndex === 1 ? newName : current.husband;
    const combined = updatedWife && updatedHusband ? `${updatedWife} & ${updatedHusband}` : (updatedWife || updatedHusband || "");
    updateInvite("coupleNames", combined);
  };

  const fixedTimelineSteps = selectedTemplate.fixedTimelineSteps || [];
  const maxTimelineItems = isSidiBouSaid ? 3 : (fixedTimelineSteps.length || Infinity);
  const getTimelineStepKey = (item, index) =>
    item.step || item.image || fixedTimelineSteps[index]?.image || fixedTimelineSteps[0]?.image || "";
  const getNextTimelineStepKey = (timeline) => {
    const usedKeys = new Set(timeline.map((item, index) => getTimelineStepKey(item, index)));
    return (
      fixedTimelineSteps.find((step) => !usedKeys.has(step.image))?.image ||
      fixedTimelineSteps[0]?.image ||
      ""
    );
  };

  const updateInvite = (key, value) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      [key]: value,
    }));
  };

  const handleMusicUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const inviteId = id || invite.slug;
    if (!inviteId) {
      setError("Veuillez d'abord spécifier un Slug pour l'invitation.");
      return;
    }

    setUploadingMusic(true);
    setError("");

    try {
      const inviteId = id || invite.slug || "temp-invite";
      const downloadUrl = await uploadInviteAsset(inviteId, file, "music");
      updateInvite("musicUrl", downloadUrl);
    } catch (uploadError) {
      console.warn("Firebase upload failed, using local FileReader fallback:", uploadError);
      const reader = new FileReader();
      reader.onload = (e) => {
        updateInvite("musicUrl", e.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingMusic(false);
    }
  };

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingVideo(true);
    setError("");

    try {
      const inviteId = id || invite.slug || "temp-invite";
      const downloadUrl = await uploadInviteAsset(inviteId, file, "video");
      updateInvite("videoUrl", downloadUrl);
    } catch (uploadError) {
      console.warn("Firebase video upload failed, using local FileReader fallback:", uploadError);
      const reader = new FileReader();
      reader.onload = (e) => {
        updateInvite("videoUrl", e.target.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingVideo(false);
    }
  };

  const updateTimelineItem = (index, key, value) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      timeline: currentInvite.timeline.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addTimelineItem = () => {
    setInvite((currentInvite) => {
      const isSidi = currentInvite.template === "sidi-bousaid";
      let newItem;

      if (isSidi) {
        const count = currentInvite.timeline.length;
        let title = "New Event";
        let titleAr = "حدث جديد";

        if (count === 0) {
          title = "Outeya";
          titleAr = "الوطية";
        } else if (count === 1) {
          title = "Mariage";
          titleAr = "العرس";
        } else if (count === 2) {
          title = "Dîner";
          titleAr = "عشاء";
        }

        const lastItem = currentInvite.timeline[count - 1];
        newItem = {
          title,
          titleAr,
          date: lastItem?.date || currentInvite.eventDate || "",
          time: lastItem?.time || "19:00",
          venue: lastItem?.venue || currentInvite.venueName || "Dar Sidi Bou Said",
          city: lastItem?.city || currentInvite.city || "Sidi Bou Said",
          mapUrl: lastItem?.mapUrl || currentInvite.mapUrl || "https://maps.google.com"
        };
      } else {
        newItem = {
          step: getNextTimelineStepKey(currentInvite.timeline),
          time: "",
        };
      }

      const maxLimit = isSidi ? 3 : maxTimelineItems;
      return {
        ...currentInvite,
        timeline:
          currentInvite.timeline.length >= maxLimit
            ? currentInvite.timeline
            : [...currentInvite.timeline, newItem],
      };
    });
  };

  const removeTimelineItem = (index) => {
    setInvite((currentInvite) => ({
      ...currentInvite,
      timeline: currentInvite.timeline.filter((item, itemIndex) => itemIndex !== index),
    }));
  };

  const handleTemplateChange = (templateId) => {
    const nextTemplate = getDigitalInviteTemplate(templateId);

    setInvite((currentInvite) => ({
      ...currentInvite,
      template: templateId,
      timeline: nextTemplate.defaults.timeline,
    }));
  };

  const handleCoupleBlur = () => {
    if (!invite.slug && invite.coupleNames) {
      updateInvite("slug", slugify(invite.coupleNames));
    }
  };

  const handleDateChange = (dateValue) => {
    setInvite((currentInvite) => {
      const isSidi = currentInvite.template === 'sidi-bousaid';
      if (isSidi && currentInvite.timeline && currentInvite.timeline.length > 0) {
        const lastIndex = currentInvite.timeline.length - 1;
        const updatedTimeline = [...currentInvite.timeline];
        updatedTimeline[lastIndex] = {
          ...updatedTimeline[lastIndex],
          date: dateValue
        };
        return {
          ...currentInvite,
          eventDate: dateValue,
          timeline: updatedTimeline
        };
      }
      return {
        ...currentInvite,
        eventDate: dateValue,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedSlug = slugify(invite.slug || invite.coupleNames);

    if (!normalizedSlug) {
      setError("Ajoute un slug ou les noms du couple.");
      return;
    }

    setSaving(true);

    try {
      const inviteFields = { ...invite };
      delete inviteFields.id;
      delete inviteFields.createdAt;
      delete inviteFields.updatedAt;
      delete inviteFields.introLabel;
      delete inviteFields.introText;
      delete inviteFields.closingText;
      delete inviteFields.dateLabel;
      const lastEvent = invite.timeline && invite.timeline.length > 0
        ? invite.timeline[invite.timeline.length - 1]
        : null;

      const cleanedInvite = {
        ...inviteFields,
        slug: normalizedSlug,
        template: selectedTemplate.id,
        eventDate: isSidiBouSaid && lastEvent?.date ? lastEvent.date : invite.eventDate,
        time: isSidiBouSaid && lastEvent?.time ? lastEvent.time : invite.time,
        timeline: invite.timeline
          .slice(0, maxTimelineItems)
          .map((item, index) => {
            if (isSidiBouSaid) {
              return {
                title: item.title || "",
                titleAr: item.titleAr || "",
                date: item.date || "",
                time: item.time || "",
                venue: item.venue || "",
                city: item.city || "",
                mapUrl: item.mapUrl || "",
              };
            }
            return {
              step: getTimelineStepKey(item, index),
              time: item.time || "",
            };
          }),
      };
      const docId = normalizedSlug;

      await saveDigitalInvite(docId, cleanedInvite);
      try {
        localStorage.setItem("digital_invite_" + docId, JSON.stringify(cleanedInvite));
      } catch (lsErr) {}

      if (initialDocId && initialDocId !== docId) {
        await deleteDigitalInvite(initialDocId);
      }

      navigate(`/dashboard/invitations/${docId}/edit`, { replace: true });
      setInitialDocId(docId);
      setInvite(cleanedInvite);
    } catch (saveError) {
      setError("Impossible d'enregistrer cette invitation.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setError("");

    const docId = initialDocId || invite.slug;

    if (!docId) {
      setError("Enregistre d'abord l'invitation avant de la publier.");
      return;
    }

    setSaving(true);

    try {
      await updateDigitalInvite(docId, { status: "published" });
      setInvite((currentInvite) => ({ ...currentInvite, status: "published" }));
    } catch (publishError) {
      setError("Impossible de publier cette invitation.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    if (!publicUrl) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(publicUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = publicUrl;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (copyError) {
      setError("Impossible de copier le lien.");
    }
  };


  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ 
        type: "UPDATE_INVITE", 
        payload: { invite } 
      }, "*");
    }
  }, [invite]);

  useEffect(() => {
    const handleMessage = (e) => {
       if (e.data && e.data.type === 'IFRAME_READY') {
          if (iframeRef.current && iframeRef.current.contentWindow) {
             iframeRef.current.contentWindow.postMessage({ 
               type: "UPDATE_INVITE", 
               payload: { invite } 
             }, "*");
          }
       }
       if (e.data && e.data.type === 'ELEMENT_CLICKED') {
          console.log("RECEIVED ELEMENT CLICK:", e.data.payload);
          const { sectionId, elementId } = e.data.payload;
          setExpandedSection(sectionId);
          setExpandedElement(elementId);
          setTimeout(() => {
             const el = document.getElementById(`editor-el-${elementId}`);
             if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
       }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [invite]);

  // Resizable Sidebar State
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedElement, setExpandedElement] = useState(null);

  const startResizing = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e) => {
      const minWidth = 320;
      const maxWidth = window.innerWidth * 0.7;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);
  
  const handleResetChanges = () => {
    if (window.confirm("Voulez-vous réinitialiser toutes les modifications au modèle par défaut ?")) {
      const templateObj = getDigitalInviteTemplate(invite.template) || defaultTemplate;
      const resetInvite = {
        ...createDigitalInviteDraft(templateObj.defaults),
        ...templateObj.defaults,
        id: invite.id,
        slug: invite.slug,
        status: invite.status,
      };
      setInvite(resetInvite);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: "UPDATE_INVITE",
          payload: { invite: resetInvite }
        }, "*");
      }
    }
  };

  const handleFillDemoData = () => {
    const demoData = {
      template: "sidi-bousaid",
      status: "draft",
      title: "Sidi Bou Said",
      coupleNames: "Bilel & Dorra",
      eventDate: "2027-08-12",
      venueName: "Dar Sidi Bou Said",
      city: "Sidi Bou Said",
      locationLabel: "TUNISIE",
      time: "19H00",
      mapUrl: "https://maps.google.com",
      rsvpEnabled: true,
      videoIntroEnabled: true,
      welcomeSubtitle: "Welcome To Our\nMediterranean Abode",
      ourStoryQuote: "Our Happy Ever After\nstarts\nnow",
      closingTextAr: "ان شاء الله ليلتكم زينة",
      dressCodeText: "We Request Attending The Outeya\nWith A Traditional Attire",
      timeline: [
        {
          title: "Outeya",
          titleAr: "الوطية",
          date: "2027-08-11",
          time: "19:00",
          venue: "Dar Sidi Bou Said",
          city: "Sidi Bou Said",
          mapUrl: "https://maps.google.com"
        },
        {
          title: "Mariage",
          titleAr: "العرس",
          date: "2027-08-12",
          time: "20:00",
          venue: "Dar Sidi Bou Said",
          city: "Sidi Bou Said",
          mapUrl: "https://maps.google.com"
        }
      ],
      programmeSteps: [
        { time: "17:00", name: "Sdek" },
        { time: "18:00", name: "Reception" },
        { time: "20:00", name: "Dinner" },
        { time: "00:00", name: "Dance" }
      ],
      activeSections: ["hero", "our-story", "countdown", "celebrations", "dress-code", "programme", "rsvp", "footer"],
      enablePetals: true,
      enableBirds: true
    };
    setInvite((prev) => ({ ...prev, ...demoData }));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F4EF] font-urbanist">
        <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Chargement</p>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-[#F6F7F5] font-urbanist text-[#141414] overflow-hidden flex flex-col h-screen">
      <header className="border-b border-[#D8DDE2] bg-white px-6 py-4 shrink-0">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-abhaya text-2xl font-semibold sm:text-3xl">
              {isEditing ? "Modifier l'invitation" : "Nouvelle invitation"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Personnalisez votre invitation en temps reel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleResetChanges}
              className="inline-flex items-center gap-2 border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
              title="Réinitialiser toutes les modifications"
            >
              <FiRotateCcw aria-hidden="true" /> Réinitialiser
            </button>
            <button
              type="button"
              onClick={handleFillDemoData}
              className="inline-flex items-center gap-2 border border-dashed border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Remplir Démo
            </button>
            {dashboardPreviewPath ? (
              <Link
                to={dashboardPreviewPath}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-black px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                <FiExternalLink aria-hidden="true" /> Apercu
              </Link>
            ) : null}
            {isEditing && invite.status !== "published" ? (
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="inline-flex items-center gap-2 border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-gray-400"
              >
                <FiUploadCloud aria-hidden="true" /> Publier
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(invite, null, 2));
                alert("JSON copié !");
              }}
              className="inline-flex items-center gap-2 bg-gray-200 px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-gray-800 hover:bg-gray-300"
            >
              Dev JSON
            </button>
            <button
              type="submit"
              form="digital-invite-form"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-black px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <FiSave aria-hidden="true" /> {saving ? "Sauvegarde..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-89px)] w-full overflow-hidden">
        {/* Left Column: Form Settings */}
        <div 
          className="w-full h-full shrink-0 border-r border-[#D8DDE2] bg-white overflow-y-auto"
          style={{ width: sidebarWidth }}
        >
          <form
            id="digital-invite-form"
            onSubmit={handleSubmit}
            className="p-6 pb-24"
          >
                    
            <div className="space-y-6">
              {error ? (
                <div className="border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              ) : null}

              <EditorSection icon={FiSettings} title="Informations">
                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date de l'événement</label>
                    <input
                      type="date"
                      value={invite.eventDate || ""}
                      onChange={(event) => handleDateChange(event.target.value)}
                      className="w-full border border-[#D8DDE2] bg-white px-4 py-3 text-base outline-none focus:border-black"
                    />
                  </div>
                  <Field label="Nom de la mariée / Partenaire 1">
                    <TextInput
                      value={wife}
                      onChange={(event) => handlePartnerNameChange(0, event.target.value)}
                      placeholder="Sarah"
                      required
                    />
                  </Field>
                  <Field label="Nom du marié / Partenaire 2">
                    <TextInput
                      value={husband}
                      onChange={(event) => handlePartnerNameChange(1, event.target.value)}
                      placeholder="Hedi"
                      required
                    />
                  </Field>
                  <Field label="Slug du lien">
                    <TextInput
                      value={invite.slug || ""}
                      onChange={(event) => updateInvite("slug", slugify(event.target.value))}
                      placeholder="sarah-hedi"
                      required
                    />
                  </Field>
                  <Field label="Template">
                    <select
                      value={invite.template}
                      onChange={(event) => handleTemplateChange(event.target.value)}
                      className="w-full border border-[#D8DDE2] bg-white px-4 py-3 text-base outline-none focus:border-black"
                    >
                      {digitalInviteTemplates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Couleur d'arrière-plan">
                    <div className="flex items-center gap-3 border border-[#D8DDE2] bg-white px-3 py-2">
                      <input
                        type="color"
                        value={invite.backgroundColor || "#DCEBF0"}
                        onChange={(e) => updateInvite("backgroundColor", e.target.value)}
                        className="h-8 w-8 cursor-pointer border-0 p-0"
                      />
                      <span className="font-mono text-sm font-semibold uppercase text-gray-700">
                        {invite.backgroundColor || "#DCEBF0"}
                      </span>
                    </div>
                  </Field>
                  <div className="flex items-end">
                    <div className={`w-full border px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] ${
                      invite.status === "published"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}>
                      {invite.status === "published" ? "Publiee" : "Brouillon"}
                    </div>
                  </div>
                </div>
              </EditorSection>

              <EditorSection
                icon={FiLayers}
                title="Structure & Design"
                action={
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (window.confirm("Êtes-vous sûr de vouloir vider toutes les personnalisations de Structure & Design ?")) {
                        updateInvite("styleOverrides", {});
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
                    title="Vider tous les styles, textes et positions personnalisés"
                  >
                    <FiTrash2 size={13} />
                    Vider Structure & Design
                  </button>
                }
              >
                <div className="space-y-2">
                  {SECTION_LIST.map(sec => (
                    <div key={sec.id} className="border border-[#D8DDE2] bg-white">
                        <button 
                          type="button" 
                          onClick={(e) => {
                            e.preventDefault();
                            setExpandedSection(expandedSection === sec.id ? null : sec.id);
                          }} 
                          className="w-full flex items-center justify-between p-4 font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            {sec.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Actif</span>
                            <FiChevronDown className={`transition-transform ${expandedSection === sec.id ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        
                        {expandedSection === sec.id && (
                          <div className="p-4 border-t border-[#D8DDE2] bg-[#F9FAF8]">
                              <ElementMenu 
                                sectionId={sec.id} 
                                expandedElement={expandedElement} 
                                setExpandedElement={setExpandedElement}
                                invite={invite}
                                addTimelineItem={addTimelineItem}
                                updateInvite={updateInvite}
                                handleMusicUpload={handleMusicUpload}
                                uploadingMusic={uploadingMusic}
                                handleVideoUpload={handleVideoUpload}
                                uploadingVideo={uploadingVideo}
                                updateTimelineItem={updateTimelineItem}
                                removeTimelineItem={removeTimelineItem}
                                handleMediaUpload={handleMediaUpload}
                                uploadingMedia={uploadingMedia}
                                FiPlus={FiPlus}
                                FiTrash2={FiTrash2}
                              />
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </EditorSection>
            </div>
          </form>
        </div>
        
        {/* Resizer Handle */}
        <div
          className="w-[1.5px] cursor-col-resize bg-gray-200 hover:bg-blue-400 active:bg-blue-600 transition-colors shrink-0 z-10"
          onMouseDown={startResizing}
        />

        {/* Right Column: Isolated Iframe Preview */}
        <div className="flex-1 overflow-y-auto relative bg-[#141414] h-full flex justify-center border-t border-gray-100">
          <iframe
            ref={iframeRef}
            src="/iframe-preview"
            title="Invitation Preview"
            className="h-full border-none shadow-2xl mx-auto bg-white"
            style={{ width: "430px", minWidth: "430px", maxWidth: "430px" }}
          />
        </div>
      </div>
    </main>
  );

}

export default DigitalInviteEditorPage;
