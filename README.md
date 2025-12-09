# **README — Smart Support Sentiment (Module Odoo)**

### _Projet ERP — Analyse automatique des tickets avec IA simple_

---

## **1. Présentation du projet**

Le projet _Smart Support Sentiment_ consiste à développer un module Odoo permettant d’analyser automatiquement le sentiment exprimé dans les tickets de support.
Le module classe chaque ticket en **Positif**, **Neutre** ou **Négatif**, grâce à une analyse simple basée sur des mots-clés ou une IA externe (optionnelle).

Ce projet répond aux exigences pédagogiques suivantes :

- Choix d’une problématique réelle
- Rédaction d’un cahier de charges
- Développement et déploiement d’un module Odoo
- Travail avec Docker
- Réalisation d’un rapport + PPT
- Capture d’écran de chaque étape

---

## **2. Problématique**

Les services de support reçoivent de nombreux tickets utilisateur.
La lecture manuelle de toutes les descriptions est lente et ne permet pas d’identifier rapidement les utilisateurs mécontents.

**Problématique :**
_Comment automatiser l’analyse du sentiment d’un ticket afin d’aider les équipes support à prioriser leurs actions et améliorer la qualité du service ?_

---

## **3. Objectifs du module**

- Permettre la création et gestion des tickets
- Ajouter un champ sentiment automatique
- Détecter si un ticket est positif, neutre ou négatif
- Ajouter un bouton “Analyser avec IA”
- Déployer l’environnement Odoo totalement via Docker
- Installer et tester le module dans Odoo
- Fournir une documentation claire et illustrée

---

## **4. Architecture du projet**

```
ODDO_ERP/
│   docker-compose.yml
└── addons/
    └── helpdesk_ai_sentiment/
        ├── __init__.py
        ├── __manifest__.py
        ├── models/
        │   ├── __init__.py
        │   └── helpdesk_ticket.py
        ├── views/
        │   └── helpdesk_ticket_views.xml
        └── security/
            └── ir.model.access.csv
```

---

## **5. Environnement : Lancer Odoo avec Docker**

### **Étape 1 : Préparer le fichier `docker-compose.yml`**

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=odoo
      - POSTGRES_PASSWORD=odoo
    volumes:
      - db-data:/var/lib/postgresql/data

  odoo:
    image: odoo:17
    depends_on:
      - db
    ports:
      - "8069:8069"
    environment:
      - HOST=db
      - USER=odoo
      - PASSWORD=odoo
    volumes:
      - odoo-data:/var/lib/odoo
      - ./addons:/mnt/extra-addons

volumes:
  db-data:
  odoo-data:
```

### **Étape 2 : Lancer Odoo**

```bash
docker compose up -d
```

### **Étape 3 : Accéder à l’interface**

Ouvrir :
`http://localhost:8069`

Créer une base de données (admin + mot de passe).

---

## **6. Développement du module**

### **Modèle Python (backend)**

- Création du modèle `helpdesk.ticket`
- Champs : `name`, `description`, `sentiment`
- Fonction IA simple basée sur mots-clés
- Méthode `action_analyze_sentiment`

### **Vue XML (frontend)**

- Vue Liste (tree)
- Vue Formulaire (form)
- Bouton « Analyser avec IA »
- Menu « Support IA »

### **Sécurité**

- Droits d’accès pour utilisateurs internes

---

## **7. Installation du module**

1. Redémarrer Odoo :

   ```bash
   docker compose restart odoo
   ```

2. Activer le mode développeur
3. Aller dans Apps → Update Apps List
4. Rechercher : **helpdesk_ai_sentiment**
5. Installer

---

## **8. Tests du module**

### **Tests favorables :**

- Texte positif → sentiment = Positif
- Texte négatif → sentiment = Négatif
- Texte neutre → sentiment = Neutre
- Mise à jour correcte dans la vue liste
- Fonction retour après modification du ticket

### **Tests défavorables :**

- Description vide → Neutre
- Orthographe approximative → Résultat incertain
- Phrases ambiguës → Score neutre
- Longs textes → Limites de l’analyse par mots-clés

---

## **9. Captures d’écran incluses dans le rapport**

- Déploiement Docker
- Connexion Odoo
- Installation du module
- Création d’un ticket
- Analyse avec IA
- Mise à jour du sentiment
- Vue liste finale

---

## **10. Améliorations possibles**

- Analyse IA avancée via OpenAI ou HuggingFace
- Modèles NLP multilingues
- Dashboard statistique sur les sentiments
- Apprentissage automatique basé sur l’historique

---

## **11. Résultat final**

Le module **Smart Support Sentiment** fonctionne correctement dans Odoo, est déployé via Docker, testé, documenté et prêt pour présentation.
Ce projet montre la capacité à développer un module ERP complet, installer un environnement conteneurisé, appliquer une logique IA simple et documenter toutes les étapes.

---

## **12. Auteurs**

- AZZMAN NOUR ELIMANE

---
