import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
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
  { id: 'reveal', label: 'Dévoilement (الكشف)' },
  { id: 'countdown', label: 'Compte à rebours' },
  { id: 'location', label: 'Localisation' },
  { id: 'our-story', label: 'Notre Histoire' },
  { id: 'timeline', label: 'Programme (Timeline)' },
  { id: 'celebrations', label: 'Célébrations' },
  { id: 'dress-code', label: 'Dress Code' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'footer', label: 'Pied de page' },
  { id: 'settings', label: 'Animations & Musique' }
];

const getElementsForSection = (sectionId, templateId) => {
  if (templateId === 'bridgerton') {
    switch (sectionId) {
      case 'hero': return [
        { id: 'hero-names', label: 'Noms des Mariés (Calligraphie)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Karim\n&\nAzza" },
        { id: 'hero-quote', label: 'Texte d\'Introduction ("Our Happy Ever After")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Our Happy Ever After" },
        { id: 'hero-photo', label: 'Photo du Couple (Cadre Principal)', controls: ['upload'] }
      ];
      case 'countdown': return [
        { id: 'event-date', label: 'Date Vintage (3 Lignes)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "23\n11\n26" },
        { id: 'countdown-waiting', label: 'Texte d\'Attente ("waiting for you...")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "waiting for you..." }
      ];
      case 'celebrations': return [
        { id: 'banner-quote', label: 'Citation Bannière ("Join Us For The...")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Join Us For The \nBest Day Ever" }
      ];
      case 'location': return [
        { id: 'venue-title', label: 'Titre Lieu ("Wedding Venue")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Wedding\nVenue" },
        { id: 'venue-details', label: 'Détails & Adresse du Lieu', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Dar Bouraoui \nCarthage\nSalle Malaga\n18H - 20H" },
        { id: 'venue-photo', label: 'Photo Ovale du Lieu', controls: ['upload'] }
      ];
      case 'dress-code': return [
        { id: 'dress-title', label: 'Titre Dress Code', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Dress Code" },
        { id: 'dress-text', label: 'Consignes Vestimentaires', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "We'd love for guests to embrace a formal look for our celebration." },
        { id: 'transport-title', label: 'Titre Transport', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Transport" },
        { id: 'transport-text', label: 'Consignes Transport & Parking', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Parking: On-site parking will be available at the venue.\nTaxis: We recommend booking taxis in advance." }
      ];
      case 'our-story': return [
        { id: 'message-title', label: 'Titre Livre d\'Or ("Leave a message")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Leave\na message" },
        { id: 'message-subtitle', label: 'Texte d\'Invitation au Message', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Leave a heartfelt message to the brides" }
      ];
      case 'rsvp': return [
        { id: 'rsvp-title', label: 'Titre (RSVP)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "RSVP" },
        { id: 'rsvp-deadline', label: 'Texte Date Limite RSVP', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "The favour of a reply is kindly requested by the 15th of June, 2026" },
        { id: 'rsvp-btn', label: 'Bouton de Confirmation', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Send Confirmation" }
      ];
      case 'footer': return [
        { id: 'footer-names', label: 'Monogramme Sceau Dentelle', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Karim\n&\nAzza" }
      ];
      case 'settings': return [
        { id: 'global-music', label: 'Musique de fond (MP3)', controls: ['musicUpload'] },
        { id: 'visual-effects', label: 'Effets Particules & Scintillements (Sparkles)', controls: ['petalsToggle'] },
        { id: 'text-animation', label: 'Apparition du texte', controls: ['animationType', 'animationDuration', 'animationDelay'] }
      ];
      default: return [];
    }
  }

  if (templateId === 'celestial') {
    switch (sectionId) {
      case 'hero': return [
        { id: 'hero-names', label: 'Noms du Couple (Carte Invitation)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "JONATHAN\n&\nMARRISAH" },
        { id: 'visual-effects', label: 'Effet Scintillements (Sparkles)', controls: ['petalsToggle'] },
      ];
      case 'our-story': return [
        { id: 'story-title', label: 'Titre ("OUR STORY")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "OUR STORY" },
        { id: 'story-subtitle', label: 'Sous-titre Cérémonie', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "To celebrate their wedding ceremony" },
        { id: 'story-photo', label: 'Photo du Couple (Cadre Ovale)', controls: ['upload'] },
      ];
      case 'reveal': return [
        { id: 'reveal-title', label: 'Titre ("REVEAL")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "REVEAL" },
        { id: 'reveal-subtitle', label: 'Sous-titre Lune & Soleil', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Join the moon  to the sun.." },
        { id: 'date-text', label: 'Date Astronomique ("10 . 10 .2026")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "10 . 10 .2026" },
      ];
      case 'location':
      case 'venue': return [
        { id: 'venue-title', label: 'Titre ("VENUE")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "VENUE" },
        { id: 'venue-name', label: 'Nom du Lieu & Adresse', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Kobbet Ennhas Manouba" },
        { id: 'venue-photo', label: 'Illustration Porte du Palais', controls: ['upload'] },
        { id: 'venue-time', label: 'Horaires Cérémonie', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "19:00 - 21:00" },
        { id: 'venue-map-btn', label: 'Bouton Localisation ("Open in maps")', controls: ['text', 'mapAddress', 'font', 'fontSize', 'color'], defaultText: "Open in maps" },
      ];
      case 'timeline':
      case 'programme': return [
        { id: 'programme-title', label: 'Titre ("PROGRAMME")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "PROGRAMME" },
        { id: 'timeline-1', label: 'Étape 1 (Accueil)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "19:00\nAccueil" },
        { id: 'timeline-2', label: 'Étape 2 (Contrat)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "19:15\nContrat" },
        { id: 'timeline-3', label: 'Étape 3 (Réception)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "19:45\nRéception" },
        { id: 'timeline-4', label: 'Étape 4 (Photos)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "20:30\nPhotos" },
        { id: 'timeline-5', label: 'Étape 5 (Fin)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "21:00\nFin" },
      ];
      case 'celebrations':
      case 'principles': return [
        { id: 'principles-title', label: 'Titre ("PRINCIPLES")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "PRINCIPLES" },
        { id: 'principles-text-1', label: 'Paragraphe Principes 1', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Voluptatum non fugiat qui ab non. At ut quasi dolorum numquam voluptas rerum qui. Non rem sunt fugiat numquam molestiae vero dolores dolores. Dolor ut sit quos accusantium vitae aliquid ducimus" },
        { id: 'principles-text-2', label: 'Paragraphe Principes 2', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Voluptatum non fugiat qui ab non. At ut quasi dolorum numquam voluptas rerum qui." },
      ];
      case 'rsvp': return [
        { id: 'rsvp-title', label: 'Titre (RSVP)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "RSVP" },
        { id: 'rsvp-attend-label', label: 'Question de Présence', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Will you attend" },
        { id: 'rsvp-submit-btn', label: 'Bouton de Confirmation ("Send !")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Send !" },
      ];
      case 'footer': return [
        { id: 'footer-infinity', label: 'Citation Calligraphie ("Untill infinity")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Untill infinity" },
        { id: 'footer-names', label: 'Noms Monogramme', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "JONATHAN & MARRISAH" },
      ];
      case 'settings': return [
        { id: 'global-music', label: 'Musique de fond (MP3)', controls: ['musicUpload'] },
        { id: 'visual-effects', label: 'Scintillements & Étoiles (Sparkles)', controls: ['petalsToggle'] },
      ];
      default: return [];
    }
  }

  if (templateId === 'brezza-marina') {
    switch (sectionId) {
      case 'hero': return [
        { id: 'hero-subtitle', label: 'Texte de la Citation', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "L'amour n'est qu'un mot, jusqu'à ce que quelqu'un vienne lui donner un sens." },
        { id: 'hero-names', label: 'Noms des Mariés', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Houssem\n&\nDorra" }
      ];
      case 'countdown': return [
        { id: 'countdown-title', label: 'Titre (Countdown)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Countdown" },
        { id: 'countdown-title-ar', label: 'Titre Arabe (العد التنازلي)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "العد التنازلي" }
      ];
      case 'location': return [
        { id: 'location-title', label: 'Titre (Location)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Location" },
        { id: 'location-title-ar', label: 'Titre Arabe (وين بش نتقابلو)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "وين بش نتقابلو" },
        { id: 'location-intro', label: 'Texte d\'invitation', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "The ceremony will take place at" },
        { id: 'location-venue', label: 'Nom du Lieu', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Dar Bouraoui Carthage Malaga" },
        { id: 'location-btn', label: 'Bouton Carte ("Open in maps")', controls: ['text', 'mapAddress', 'font', 'fontSize', 'color'], defaultText: "Open in maps" }
      ];
      case 'our-story': return [
        { id: 'story-title', label: 'Titre (Our Story)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Our Story" },
        { id: 'story-title-ar', label: 'Titre Arabe (حكايتنا)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "حكايتنا" },
        { id: 'story-photo', label: 'Photo du Couple (Cadre)', controls: ['upload'] },
        { id: 'story-card-title', label: 'Titre Carte Postale ("Hi, it\'s Us !")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Hi, it's\nUs !" },
        { id: 'story-card-quote', label: 'Message Carte Postale', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Placeat accusamus\n in rem a id et ad. \nAdipisci quia et eos " }
      ];
      case 'timeline': return [
        { id: 'timeline-title', label: 'Titre (Timeline)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Timeline" },
        { id: 'timeline-title-ar', label: 'Titre Arabe (البرنامج)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "البرنامج" },
        { id: 'timeline-stage-1', label: 'Étape 1 (Accueil)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Accueil" },
        { id: 'timeline-stage-2', label: 'Étape 2 (Contrat de mariage)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Contrat\nde mariage" },
        { id: 'timeline-stage-3', label: 'Étape 3 (Fête)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Fête" },
        { id: 'timeline-stage-4', label: 'Étape 4 (Photos)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Photos" },
        { id: 'timeline-stage-5', label: 'Étape 5 (La fin)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "La fin" },
        { id: 'timeline-instructions', label: 'Instruction Perle', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Drag the Pearl to complete the schedule" }
      ];
      case 'dress-code': return [
        { id: 'dress-title', label: 'Titre (Dress Code)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Dress Code" },
        { id: 'dress-title-ar', label: 'Titre Arabe (الهندام)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "الهندام" },
        { id: 'dress-text', label: 'Consignes Vestimentaires', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "Nous prions nos invités d'éviter de porter du blanc et du noir" }
      ];
      case 'rsvp': return [
        { id: 'rsvp-title', label: 'Titre (RSVP)', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "RSVP" },
        { id: 'rsvp-deadline', label: 'Texte Date Limite', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "The favour of a reply is kindly requested by the fifteenth of June, 2026" }
      ];
      case 'footer': return [
        { id: 'footer-title', label: 'Message Final ("See you there!")', controls: ['text', 'font', 'fontSize', 'color'], defaultText: "See you there!" }
      ];
      case 'settings': return [
        { id: 'global-music', label: 'Musique de fond (MP3)', controls: ['musicUpload'] },
        { id: 'visual-effects', label: 'Scintillements & Particules (Sparkles)', controls: ['petalsToggle'] }
      ];
      default: return [];
    }
  }

  // Sidi Bou Said (default)
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
    case 'location': return [
      { id: 'sec-location', label: 'Position Globale (Y)', controls: ['positionYOnly'] },
      { id: 'location-title', label: 'Titre EN', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'location-title-ar', label: 'Titre AR', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'location-venue', label: 'Nom du lieu', controls: ['position', 'font', 'fontSize', 'color', 'text'] },
      { id: 'location-map', label: 'Lien Google Maps', controls: ['text'] },
      { id: 'location-btn', label: 'Bouton Voir la carte', controls: ['position', 'color', 'font', 'fontSize'] }
    ];
    case 'timeline': return [
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
      { id: 'visual-effects', label: 'Effets Particules & Scintillements (Sparkles)', controls: ['petalsToggle'] },
      { id: 'text-animation', label: 'Apparition du texte', controls: ['animationType', 'animationDuration', 'animationDelay'] }
    ];
    default: return [];
  }
};

function ElementMenu({ sectionId, expandedElement, setExpandedElement, invite, updateInvite, handleMusicUpload, uploadingMusic, handleVideoUpload, uploadingVideo, addTimelineItem, updateTimelineItem, removeTimelineItem, FiPlus, FiTrash2 }) {
   const elements = getElementsForSection(sectionId, invite?.template);
   
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
                            <option>MADE Voyager PERSONAL_USE</option>
                            <option>Black Mango</option>
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

                  {/* Map Address / Google Maps Link Control */}
                  {el.controls.includes('mapAddress') && invite && updateInvite && (
                    <div className="space-y-2">
                      <label className="block text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Adresse ou Lien Google Maps
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Dar Bouraoui Carthage Malaga ou https://maps.google.com/..."
                        value={invite.styleOverrides?.[el.id]?.address !== undefined 
                          ? invite.styleOverrides[el.id].address 
                          : (invite.mapAddress || invite.mapUrl || "")}
                        onChange={(e) => {
                          const val = e.target.value;
                          const current = invite.styleOverrides?.[el.id] || {};
                          updateInvite('styleOverrides', {
                            ...invite.styleOverrides,
                            [el.id]: { ...current, address: val }
                          });
                          updateInvite('mapAddress', val);
                          if (val.startsWith("http://") || val.startsWith("https://")) {
                            updateInvite('mapUrl', val);
                          } else if (val) {
                            updateInvite('mapUrl', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(val)}`);
                          } else {
                            updateInvite('mapUrl', '');
                          }
                        }}
                        className="w-full border border-gray-300 p-2 text-xs outline-none focus:border-black bg-white"
                      />
                      <p className="text-[10px] text-gray-400">
                        Entrez une adresse ou un lien Google Maps. En cliquant sur le bouton, vos invités ouvriront directement cette destination.
                      </p>
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

                  {/* Sparkles / Particles Toggle & Amount Controls */}
                  {el.controls.includes('petalsToggle') && invite && updateInvite && (() => {
                    const isCelestial = invite.template === "celestial";
                    const isBridgerton = invite.template === "bridgerton";
                    const isEnabled = isCelestial
                      ? (invite.enableStars !== false && invite.enableSparkles !== false)
                      : invite.enablePetals !== false;
                    const currentCount = isCelestial
                      ? (invite.starsIntensity || invite.sparklesIntensity || 250)
                      : (invite.petalsIntensity || invite.sparklesIntensity || (isBridgerton ? 28 : 30));
                    const currentColor = isCelestial
                      ? (invite.starsColor || invite.sparklesColor || "#E0E7FF")
                      : (invite.petalsColor || (isBridgerton ? "#FFFFFF" : "#E87A90"));
                    const defaultParticleType = isCelestial ? "sparkles" : (isBridgerton ? "petals" : "mixed");
                    const particleType = invite.particleType || defaultParticleType;

                    const handleAmountChange = (num) => {
                      const val = Math.max(5, Math.min(300, parseInt(num) || 5));
                      if (isCelestial) {
                        updateInvite('starsIntensity', val);
                        updateInvite('sparklesIntensity', val);
                      } else {
                        updateInvite('petalsIntensity', val);
                        updateInvite('sparklesIntensity', val);
                      }
                    };

                    const handleColorChange = (hex) => {
                      if (isCelestial) {
                        updateInvite('starsColor', hex);
                        updateInvite('sparklesColor', hex);
                      } else {
                        updateInvite('petalsColor', hex);
                        updateInvite('sparklesColor', hex);
                      }
                    };

                    return (
                      <div className="space-y-4">
                        {/* Toggle Checkbox */}
                        <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded">
                          <label className="flex items-center gap-2.5 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={isEnabled} 
                              onChange={(e) => {
                                if (isCelestial) {
                                  updateInvite('enableStars', e.target.checked);
                                  updateInvite('enableSparkles', e.target.checked);
                                }
                                updateInvite('enablePetals', e.target.checked);
                              }}
                              className="w-4 h-4 accent-black rounded cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-gray-800">
                              {isCelestial 
                                ? "✨ Scintillements & Poussière d'Étoiles" 
                                : isBridgerton 
                                ? "🌸 Chute de Pétales (Standard)" 
                                : "✨ Chute de Particules & Scintillements"}
                            </span>
                          </label>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${isEnabled ? "bg-amber-100 text-amber-800 border border-amber-300" : "bg-gray-200 text-gray-500"}`}>
                            {isEnabled ? "Actif" : "Désactivé"}
                          </span>
                        </div>

                        {isEnabled && (
                          <div className="space-y-4 pt-1">
                            {/* Particle Mode Selection (for non-celestial templates) */}
                            {!isCelestial && (
                              <div>
                                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                  Type d'Effet Visuel
                                </label>
                                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded border border-gray-200">
                                  <button
                                    type="button"
                                    onClick={() => updateInvite('particleType', 'petals')}
                                    className={`py-1.5 px-2 text-[11px] font-medium rounded text-center transition-all ${particleType === 'petals' ? 'bg-white text-black shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                                  >
                                    🌸 Pétales {isBridgerton ? "(Standard)" : ""}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateInvite('particleType', 'mixed')}
                                    className={`py-1.5 px-2 text-[11px] font-medium rounded text-center transition-all ${particleType === 'mixed' ? 'bg-white text-black shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                                  >
                                    🌸+✨ Mixte
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateInvite('particleType', 'sparkles')}
                                    className={`py-1.5 px-2 text-[11px] font-medium rounded text-center transition-all ${particleType === 'sparkles' ? 'bg-white text-black shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                                  >
                                    ✨ Scintillements
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Amount / Intensity Slider & Direct Controls */}
                            <div className="p-3 bg-white border border-gray-200 rounded space-y-2.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                                  <span>✨ Quantité de {isCelestial || particleType === 'sparkles' ? 'scintillements' : (particleType === 'petals' ? 'pétales' : 'particules')}</span>
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-gray-400 font-medium">
                                    {currentCount < 50 ? "Léger" : currentCount < 120 ? "Équilibré" : currentCount < 200 ? "Dense" : "Galaxie Intense"}
                                  </span>
                                  <input
                                    type="number"
                                    min="5"
                                    max="300"
                                    value={currentCount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    className="w-14 px-1.5 py-0.5 text-center text-xs font-bold border border-gray-300 rounded focus:border-black focus:outline-none bg-gray-50"
                                  />
                                </div>
                              </div>

                             {/* Range Slider */}
                             <input
                               type="range"
                               min="5"
                               max="300"
                               step="1"
                               value={currentCount}
                               onChange={(e) => handleAmountChange(e.target.value)}
                               className="w-full accent-black cursor-pointer"
                             />

                             {/* Quick Increase / Presets */}
                             <div className="flex items-center justify-between gap-1 pt-1">
                               <div className="flex items-center gap-1">
                                 <button
                                   type="button"
                                   onClick={() => handleAmountChange(currentCount - 15)}
                                   className="px-2 py-1 text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                                   title="Diminuer de 15"
                                 >
                                   -15
                                 </button>
                                 <button
                                   type="button"
                                   onClick={() => handleAmountChange(currentCount + 15)}
                                   className="px-2 py-1 text-[10px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                                   title="Augmenter de 15"
                                 >
                                   +15
                                 </button>
                                 <button
                                   type="button"
                                   onClick={() => handleAmountChange(currentCount + 35)}
                                   className="px-2 py-1 text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded transition-colors"
                                   title="Augmenter de 35 (Beaucoup de scintillements)"
                                 >
                                   +35 ✨
                                 </button>
                               </div>

                               {/* Quick Preset Buttons */}
                               <div className="flex items-center gap-1">
                                 {[
                                   { label: "35", val: 35, tip: "Léger" },
                                   { label: "80", val: 80, tip: "Équilibré" },
                                   { label: "150", val: 150, tip: "Dense" },
                                   { label: "250", val: 250, tip: "Standard Céleste" },
                                 ].map((preset) => (
                                   <button
                                     key={preset.val}
                                     type="button"
                                     onClick={() => handleAmountChange(preset.val)}
                                     title={preset.tip}
                                     className={`px-1.5 py-0.5 text-[10px] rounded transition-all ${currentCount === preset.val ? 'bg-black text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                   >
                                     {preset.label}
                                   </button>
                                 ))}
                               </div>
                             </div>
                           </div>

                           {/* Color Picker & Presets */}
                           <div>
                             <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                               Couleur {isCelestial || particleType === 'sparkles' ? 'des Scintillements' : (particleType === 'petals' ? 'des Pétales' : 'des Particules')}
                             </label>
                             <div className="flex items-center gap-2.5 border border-gray-200 bg-white p-2 rounded">
                               <input 
                                 type="color" 
                                 className="h-7 w-7 border-0 p-0 cursor-pointer rounded overflow-hidden" 
                                 value={currentColor}
                                 onChange={(e) => handleColorChange(e.target.value)}
                               />
                               <span className="text-xs text-gray-700 font-mono uppercase font-semibold">
                                 {currentColor}
                               </span>
                               {/* Quick Presets */}
                               <div className="ml-auto flex items-center gap-1.5">
                                 {isCelestial || particleType === 'sparkles' ? (
                                   <>
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#E0E7FF')}
                                       className="w-5 h-5 rounded-full border border-indigo-300 bg-[#E0E7FF] shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Lueur Céleste (Standard)"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#F8E4A0')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-[#F8E4A0] shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Or Stellaire"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#FFFFFF')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-white shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Diamant Pur"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#FDE68A')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-[#FDE68A] shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Champagne Doré"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#D48744')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-[#D48744] shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Or Cuivré Solaire"
                                     />
                                   </>
                                 ) : (
                                   <>
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#FFFFFF')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-white shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Blanc Pur"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#FDF6EC')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-[#FDF6EC] shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Ivoire"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#F5C2C7')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-[#F5C2C7] shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Rose Pâle"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#722F37')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-[#722F37] shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Mauve Bridgerton"
                                     />
                                     <button
                                       type="button"
                                       onClick={() => handleColorChange('#D4AF37')}
                                       className="w-5 h-5 rounded-full border border-gray-300 bg-[#D4AF37] shadow-xs cursor-pointer hover:scale-115 transition-transform"
                                       title="Or Vintage"
                                     />
                                   </>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                   );
                 })()}

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
                        placeholder={el.defaultText || "Valeur personnalisée..."} 
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
                       {invite.styleOverrides?.[el.id]?.image || (el.id === 'story-photo' && invite.storyPhoto) || (el.id === 'hero-photo' && invite.heroPhoto) || (el.id === 'venue-photo' && invite.venuePhoto) ? (
                         <div className="flex items-center justify-between border border-emerald-200 bg-emerald-50 p-2">
                           <span className="text-xs text-emerald-800 font-semibold truncate max-w-[200px]">
                             {String(invite.styleOverrides?.[el.id]?.image || invite.storyPhoto || invite.heroPhoto || invite.venuePhoto).includes('video') || String(invite.styleOverrides?.[el.id]?.image).endsWith('.mp4') ? "▶ Vidéo active" : "🖼 Image active"}
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
                               if (el.id === 'hero-photo') updateInvite('heroPhoto', '');
                               if (el.id === 'venue-photo') updateInvite('venuePhoto', '');
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
                             if (el.id === 'hero-photo') updateInvite('heroPhoto', b64);
                             if (el.id === 'venue-photo') updateInvite('venuePhoto', b64);
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
  const location = useLocation();
  const isEditing = Boolean(id);

  const initialTemplate = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlTemplateId = searchParams.get("template");
    if (urlTemplateId) {
      const found = getDigitalInviteTemplate(urlTemplateId);
      if (found) return found;
    }
    return defaultTemplate;
  }, [location.search]);

  const [invite, setInvite] = useState(() =>
    createDigitalInviteDraft(initialTemplate.defaults)
  );
  const [initialDocId, setInitialDocId] = useState(id || "");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
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
        if (elementId === "hero-photo") {
          next.heroPhoto = fileUrl;
        }
        if (elementId === "venue-photo") {
          next.venuePhoto = fileUrl;
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
    if (!nextTemplate) return;
    const defaults = nextTemplate.defaults || {};

    setInvite((currentInvite) => ({
      ...currentInvite,
      ...defaults,
      template: templateId,
      coupleNames: currentInvite.coupleNames || defaults.coupleNames,
      eventDate: currentInvite.eventDate || defaults.eventDate,
      slug: currentInvite.slug,
      id: currentInvite.id,
      status: currentInvite.status,
      timeline: defaults.timeline || [],
      activeSections: defaults.activeSections,
      backgroundColor: defaults.backgroundColor || (templateId === "bridgerton" ? "#FFFFFF" : (templateId === "brezza-marina" ? "#DCEBF0" : "#F6F7F5")),
      styleOverrides: {},
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
    setSaveSuccess(false);

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

      const rawTimeline = Array.isArray(invite.timeline) ? invite.timeline : [];
      const lastEvent = rawTimeline.length > 0 ? rawTimeline[rawTimeline.length - 1] : null;

      const cleanedInvite = {
        ...inviteFields,
        slug: normalizedSlug,
        template: selectedTemplate.id,
        eventDate: isSidiBouSaid && lastEvent?.date ? lastEvent.date : invite.eventDate,
        time: isSidiBouSaid && lastEvent?.time ? lastEvent.time : invite.time,
        ...(rawTimeline.length > 0 || isSidiBouSaid || selectedTemplate.fixedTimelineSteps?.length
          ? {
              timeline: rawTimeline
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
            }
          : {}),
      };

      if (Array.isArray(invite.timelineEvents)) {
        cleanedInvite.timelineEvents = invite.timelineEvents;
      }

      const docId = normalizedSlug;

      await saveDigitalInvite(docId, cleanedInvite);
      try {
        localStorage.setItem("digital_invite_" + docId, JSON.stringify(cleanedInvite));
      } catch (lsErr) {}

      if (initialDocId && initialDocId !== docId) {
        try {
          await deleteDigitalInvite(initialDocId);
        } catch (delErr) {
          console.warn("Could not delete old invite document:", delErr);
        }
      }

      navigate(`/dashboard/invitations/${docId}/edit`, { replace: true });
      setInitialDocId(docId);
      setInvite(cleanedInvite);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (saveError) {
      console.error("Erreur lors de l'enregistrement:", saveError);
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


  // Resizable Sidebar State
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(600);
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedElement, setExpandedElement] = useState(null);

  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ 
        type: "UPDATE_INVITE", 
        payload: { invite, selectedElementId: expandedElement } 
      }, "*");
    }
  }, [invite, expandedElement]);

  useEffect(() => {
    const handleMessage = (e) => {
       if (e.data && e.data.type === 'IFRAME_READY') {
          if (iframeRef.current && iframeRef.current.contentWindow) {
             iframeRef.current.contentWindow.postMessage({ 
               type: "UPDATE_INVITE", 
               payload: { invite, selectedElementId: expandedElement } 
             }, "*");
          }
       }
       if (e.data && (e.data.type === 'ELEMENT_CLICKED' || e.data.type === 'SELECT_ELEMENT')) {
          const elementId = e.data.payload?.elementId || e.data.payload?.id || e.data.id;
          let targetSectionId = e.data.payload?.sectionId;
          if (!targetSectionId && elementId) {
            const sections = ['hero', 'countdown', 'celebrations', 'location', 'our-story', 'timeline', 'dress-code', 'rsvp', 'footer', 'settings'];
            for (const sId of sections) {
              const els = getElementsForSection(sId, invite?.template);
              if (els.some(el => el.id === elementId)) {
                targetSectionId = sId;
                break;
              }
            }
          }
          if (targetSectionId) {
            setExpandedSection(targetSectionId);
          }
          setExpandedElement(elementId);
          setTimeout(() => {
             const el = document.getElementById(`editor-el-${elementId}`);
             if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
       }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [invite, expandedElement]);

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
    if (invite.template === "celestial") {
      const demoData = {
        template: "celestial",
        status: "draft",
        title: "Celestial",
        coupleNames: "JONATHAN & MARRISAH",
        groomName: "Jonathan",
        brideName: "Marrisah",
        eventDate: "2026-10-10",
        storyTitle: "OUR STORY",
        storySubtitle: "To celebrate their wedding ceremony",
        revealTitle: "REVEAL",
        revealSubtitle: "Join the moon  to the sun..",
        venueTitle: "VENUE",
        venueName: "Kobbet Ennhas Manouba",
        eventTime: "19:00 - 21:00",
        mapUrl: "https://maps.google.com/?q=Kobbet+Ennhas+Manouba",
        mapAddress: "Kobbet Ennhas Manouba",
        programmeTitle: "PROGRAMME",
        timelineEvents: [
          { time: "19:00", title: "Accueil" },
          { time: "19:15", title: "Contrat" },
          { time: "19:45", title: "Réception" },
          { time: "20:30", title: "Photos" },
          { time: "21:00", title: "Fin" }
        ],
        principlesTitle: "PRINCIPLES",
        principlesP1: "Voluptatum non fugiat qui ab non. At ut quasi dolorum numquam voluptas rerum qui. Non rem sunt fugiat numquam molestiae vero dolores dolores. Dolor ut sit quos accusantium vitae aliquid ducimus",
        principlesP2: "Voluptatum non fugiat qui ab non. At ut quasi dolorum numquam voluptas rerum qui.",
        rsvpTitle: "RSVP",
        rsvpAttendLabel: "Will you attend",
        footerQuote: "Untill infinity",
        activeSections: [
          "hero",
          "our-story",
          "reveal",
          "location",
          "timeline",
          "celebrations",
          "rsvp",
          "footer"
        ],
        animationType: "fade-up",
        animationDuration: 1.2,
        enableStars: true,
        musicUrl: "",
        slug: "jonathan-marrisah"
      };
      setInvite((prev) => ({ ...prev, ...demoData }));
      return;
    }

    if (invite.template === "bridgerton") {
      const demoData = {
        template: "bridgerton",
        status: "draft",
        title: "Bridgerton",
        coupleNames: "Karim & Azza",
        eventDate: "2026-11-23",
        heroQuote: "Our Happy Ever After",
        bannerQuote: "Join Us For The \nBest Day Ever",
        venueName: "Dar Bouraoui Carthage",
        venueDetails: "Dar Bouraoui \nCarthage\nSalle Malaga\n18H - 20H",
        city: "Carthage",
        mapUrl: "https://maps.google.com",
        mapAddress: "Dar Bouraoui Carthage",
        dressCodeText: "We'd love for guests to embrace a formal look for our celebration.",
        transportText: "Parking: On-site parking will be available at the venue.\nTaxis: We recommend booking taxis in advance.",
        messagePrompt: "Leave a heartfelt message to the brides",
        rsvpDeadline: "The favour of a reply is kindly requested by the 15th of June, 2026",
        activeSections: [
          "hero",
          "countdown",
          "celebrations",
          "location",
          "dress-code",
          "our-story",
          "rsvp",
          "footer"
        ],
        animationType: "fade-up",
        animationDuration: 1.2,
        enablePetals: true,
        petalsIntensity: 28,
        petalsColor: "#FFFFFF",
        musicUrl: "",
        slug: "karim-azza"
      };
      setInvite((prev) => ({ ...prev, ...demoData }));
      return;
    }

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
              className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-all disabled:cursor-not-allowed ${
                saveSuccess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-black hover:bg-gray-800 disabled:bg-gray-400"
              }`}
            >
              <FiSave aria-hidden="true" /> {saving ? "Sauvegarde..." : saveSuccess ? "Enregistré ✓" : "Enregistrer"}
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
                <div className="border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 rounded">
                  {error}
                </div>
              ) : null}
              {saveSuccess ? (
                <div className="border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 rounded flex items-center justify-between">
                  <span>✓ Invitation enregistrée avec succès !</span>
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
                  {(getDigitalInviteTemplate(invite.template)?.defaults?.activeSections ? SECTION_LIST.filter(s => getDigitalInviteTemplate(invite.template).defaults.activeSections.includes(s.id) || s.id === 'settings') : SECTION_LIST).map(sec => (
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


