# Rapport de livraison — Site Lovely Invitations (version digitale)

**Date :** 18 octobre 2026  
**Environnement :** Production digitale (Firebase Hosting v2)  
**URL :** https://lovely-wedding-v2.web.app  
**Page d’accueil digitale :** https://lovely-wedding-v2.web.app/

---

## Objectif de cette livraison

Finaliser et publier la page d’accueil **digitale** selon les maquettes Figma, avec les contenus réels (communauté, avis, FAQ, réseaux sociaux) et une navigation cohérente vers les blocs déjà présents sur le site — sans créer de pages inutiles.

---

## Ce qui a été livré

### 1. Section Communauté
- Vidéos clients remplacées et renommées selon les vrais profils Instagram.
- Handles affichés à gauche, alignés avec le contenu de chaque vidéo :
  - `@nourlookie`
  - `@najla_chtourou`
  - `@wajd_chelly`
  - `@nourhen_khayati`
  - `@dr.raouia`

### 2. Lettres d’amour (avis)
- Section refaite selon Figma (cartes, typographie, fond).
- Ancre de navigation : **Our Story** dans le footer mène à cette section.

### 3. FAQ
- Mise en page Figma (fond blanc, chevrons).
- Accessible depuis le header, le menu mobile et le footer.

### 4. Hero
- Carrousel d’invitations ralenti pour une lecture plus fluide.
- Correction du trou / décalage visuel en fin de boucle.

### 5. Footer
- Newsletter + liens réseaux :
  - Instagram : https://www.instagram.com/invitationsmariagetn/
  - Facebook : https://www.facebook.com/InvitationsMariage1
- Liens internes uniquement vers des blocs existants :
  - **Community** → section Communauté  
  - **Our Story** → Lettres d’amour  
  - **FAQ** → FAQ  
- Pas de nouvelles pages créées pour Confidentialité / CGV / Contact / Shipping (textes conservés en attendant les contenus ou pages dédiées).

### 6. Navigation Digitale / Imprimée
- Switcher visible sur les pages d’accueil digitale (`/`) et imprimée (`/imprimee`) uniquement.

### 7. Favoris
- Page « Favoris » retirée (hors périmètre du contrat).
- Les cœurs sur les produits restent fonctionnels côté interface.

---

## Points déjà en place (rappel)

- Collections d’invitations digitales et parcours produit.
- Packs / forfaits, expérience, étapes.
- Templates d’invitation (Sakura, Capri, etc.) accessibles depuis le site.
- Espace client / connexion / panier (parcours existants).

---

## Points en attente / à valider avec vous

| Élément | Statut | Action client |
|--------|--------|----------------|
| Textes FAQ définitifs | Placeholder / à confirmer | Fournir ou valider les questions-réponses finales |
| Textes des avis (Lettres d’amour) | Structure Figma en place | Valider / remplacer par les vrais témoignages si besoin |
| Pages Confidentialité & CGV | Mentions en texte seul | Fournir les documents pour création des pages |
| Page Contact | Pas encore de page dédiée | Indiquer canal souhaité (formulaire, WhatsApp, e-mail…) |
| Newsletter | Enregistrement UI local | Brancher un outil e-mail (Mailchimp, Brevo, etc.) si souhaité |
| Contenu EN du footer (Envelopes, Liners…) | Libellés maquette | Traduire / adapter en FR si souhaité |

---

## Comment tester rapidement

1. Ouvrir https://lovely-wedding-v2.web.app/
2. Vérifier le hero (défilement fluide des invitations).
3. Scroller jusqu’à **Communauté** : handles Instagram corrects + lecture des vidéos.
4. Vérifier **Lettres d’amour** et **FAQ** (fond blanc, ouverture des questions).
5. En bas de page : cliquer **Community**, **Our Story**, **FAQ** → scroll vers les bonnes sections.
6. Cliquer Instagram / Facebook → ouverture des bons profils.
7. Tester le switch **Digitale / Imprimée**.

---

## Technique (interne)

- Commit : `d8c6059` — *Ship digital home polish: community handles, FAQ/avis Figma, footer anchors.*
- Dépôt : `Anouar0000/Lovely_Wedding_front_end` (branche `master`)
- Déploiement : `firebase deploy --only hosting:v2` → `lovely-wedding-v2.web.app`

---

## Prochaine étape proposée

1. Valider les textes FAQ + avis.  
2. Fournir Confidentialité / CGV / Contact pour les brancher.  
3. Brancher la newsletter si un outil e-mail est choisi.  

Merci — n’hésitez pas à nous remonter tout écart par rapport à la maquette Figma ou aux contenus réels.
