# Rapport de livraison — Product overview physique (Rustique)

**Date :** 18 octobre 2026  
**Environnement :** Production (Firebase Hosting v2)  
**URL :** https://lovely-wedding-v2.web.app/  
**Exemple produit :** https://lovely-wedding-v2.web.app/invitation-model/Rustique%203  

---

## Objectif

Finaliser la page **détail invitation imprimée** (Product overview physique) selon Figma : configuration quantité / format / motif, commande, avis, recommandations — sans créer de pages hors périmètre.

---

## Ce qui a été livré

### 1. Catalogue imprimée
- Filtres Rustique / Outeya / Cire
- Marge **18px** entre le dernier prix « Start at 49$ » et le footer

### 2. Page produit (ex. Rustique 3)
- Image produit (coins arrondis 20px)
- Note 4.7 (21), prix unitaire 1.5 DT
- Sélecteurs **Quantité**, **Format**, **Motif** via popup
- Résumé + total (ex. 100 → **150dt**, Glacial Bold 18/24)
- Bouton **Passer la commande** → panier

### 3. Popups Quantité / Format / Motif
- Overlay avant-plan `#C4A69C` à **50 %**
- Ligne sélectionnée : **bordure** `#C4A69C` (plus de fond jaune)
- Padding gauche / droite sur les lignes
- Quantités 100 → 270 avec totaux (150DT … 405DT)

### 4. Accordéons + avis
- Fond beige `#F7F2EC` (Comment ça marche / Délai / Ce qui est inclus + avis)
- Cartes avis Figma (Lilia & Rayen, étoiles, dates)
- Bouton **Ecrire un avis** sans ombre
- Espacement **52px** entre dernière ligne d’accordéon et cartes avis
- **53px** entre le bloc beige et « Autres recommandations »
- **53px** entre le titre et les cartes recommandations
- **53px** sous la section recommandations

### 5. Recommandations
- Produits physiques de la même catégorie (ex. Versailles, Passeport Rosé)

### 6. Correctif technique
- Accès direct URL `/invitation-model/Rustique%203` fonctionne (paramètre de route `modelName`)

---

## Tests effectués

| Action | Résultat |
|--------|----------|
| Quantité 200 | Total 300dt |
| Format Carré | OK |
| Motif Fleurs Blanches | OK |
| Accordéon Comment ça marche | OK |
| Passer la commande | Panier avec Rustique 3, 300 DT |

---

## Points en attente / à valider

| Élément | Statut |
|--------|--------|
| Textes FAQ accordéons | Placeholders — à valider |
| Vrais avis clients | Structure Figma — contenus à confirmer |
| Images catalogue physiques | Vérifier assets prod si manquants |
| Formulaire « Ecrire un avis » | Bouton UI — pas encore de backend |

---

## Technique

- Commit : `62f57ce` — *Ship physical product overview: qty popups, reviews, spacing.*
- Branche : `master`
- Déploiement : `firebase deploy --only hosting:v2`

---

Merci — n’hésitez pas à remonter tout écart Figma ou contenu à ajuster.
