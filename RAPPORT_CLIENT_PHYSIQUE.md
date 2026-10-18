# Rapport de livraison — Site Lovely Invitations (version imprimée)

**Date :** 18 octobre 2026  
**Environnement :** Production (Firebase Hosting v2)  
**URL :** https://lovely-wedding-v2.web.app  
**Page d’accueil imprimée :** https://lovely-wedding-v2.web.app/imprimee  
**Catalogue imprimée :** https://lovely-wedding-v2.web.app/invitations-physique

---

## Objectif de cette livraison

Finaliser la page d’accueil **imprimée** (parité avec la digitale), brancher les boutons vers le catalogue / les fiches produit, aligner les prix affichés, et corriger le scroll pour arriver toujours en haut de page après un clic.

---

## Ce qui a été livré

### 1. Accueil imprimée (`/imprimee`)
- Hero avec rail d’invitations en défilement continu (mockups téléphone).
- Boutons **Découvrir la collection** et clics sur les cartes du hero → catalogue `/invitations-physique`.
- Sections : collection, étapes / livraison, bestsellers, expérience, dragées, communauté, avis, FAQ, footer.
- **Pas de section Packs** sur l’imprimée (volontairement retirée).

### 2. Prix
- Affichage unifié : **Start at 49$** (bestsellers + catalogue).
- Remplacement des anciens libellés « à partir de 1.5dt/pcs ».

### 3. Boutons & navigation
- Bestsellers : clic produit → fiche modèle (`/invitation-model/...`) avec prix 49$.
- Collection / CTAs → catalogue imprimée.
- Fil d’Ariane du catalogue : **Accueil** renvoie vers `/imprimee` (et non la digitale).
- Header : mode Imprimée (switch Digitale / Imprimée) cohérent.

### 4. Hero (visuels)
- 6 visuels distincts sur le rail (correction du doublon d’image).

### 5. Communauté (imprimée)
- Espacement / padding aligné pour la version physique uniquement.

### 6. Scroll après navigation
- Correction : après un clic (catalogue, produit, etc.), la page s’ouvre **en haut**, plus au milieu ni en bas.
- Composant global `ScrollToTop` sur tous les changements de route.

---

## Points déjà en place (rappel)

- Page catalogue `/invitations-physique`.
- Parcours modèle / personnalisation existant.
- Switch Digitale (`/`) ↔ Imprimée (`/imprimee`).
- Footer partagé (réseaux Instagram / Facebook, ancres FAQ / communauté / avis).

---

## Points en attente / à valider avec vous

| Élément | Statut | Action client |
|--------|--------|----------------|
| Prix « Start at 49$ » | Affiché partout imprimée | Confirmer devises / libellé FR si besoin (ex. « À partir de 49 $ ») |
| Fiches produit imprimée | Navigation vers `/invitation-model` | Valider que le parcours personnalisation / commande imprint est le bon |
| Textes FAQ & avis (physique) | Structure en place | Valider / remplacer par contenus définitifs |
| Section Packs imprimée | Absente (demandé) | Indiquer si une offre packs papier doit être réintroduite plus tard |
| Contenu communauté (vidéos / handles) | Layout prêt | Fournir contenus spécifiques imprimée si différents de la digitale |

---

## Comment tester rapidement

1. Ouvrir https://lovely-wedding-v2.web.app/imprimee  
2. Vérifier le hero (rail fluide, 6 invitations distinctes).  
3. Cliquer **Découvrir la collection** → catalogue, **en haut de page**.  
4. Depuis les bestsellers, cliquer un produit → fiche modèle, **en haut**.  
5. Vérifier les prix **Start at 49$**.  
6. Tester le switch **Digitale / Imprimée**.  
7. Sur le catalogue, cliquer **Accueil** → revient sur `/imprimee`.

---

## Technique (interne)

- Commit : `132695b` — *Ship imprint home: CTAs, Start at 49$, scroll-to-top, client reports.*
- Dépôt : `Anouar0000/Lovely_Wedding_front_end` (branche `master`)
- Déploiement : `firebase deploy --only hosting:v2` → `lovely-wedding-v2.web.app`
- Rapport digital précédent : `RAPPORT_CLIENT_DIGITAL.md`

---

## Prochaine étape proposée

1. Valider prix / devise et parcours fiche produit imprimée.  
2. Valider textes FAQ + avis côté physique.  
3. Confirmer si des packs papier sont prévus ultérieurement.

Merci — n’hésitez pas à remonter tout écart par rapport à la maquette Figma ou aux contenus réels.
