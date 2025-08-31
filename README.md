# FINETRACK

**Plateforme de Gestion des Cartes de Dépenses Virtuelles et de Réconciliation Comptable pour Entreprises**  
(_Corporate Expense Cards & Reconciliation Platform_)

---

## 📖 Présentation

**FINETRACK** est une plateforme digitale conçue pour automatiser la gestion des dépenses d’entreprise via des **cartes virtuelles sécurisées**.  
Elle permet de contrôler les budgets par projet, d’automatiser la réconciliation comptable et de garantir la conformité en cas d’audit.

Exemple d’usage : une société de conseil comme **X Consulting** peut attribuer à chaque projet une carte virtuelle avec des règles de dépense, suivre les transactions en temps réel et exporter directement les rapports comptables.

---

## 🎯 Objectifs du projet

- Automatiser l’émission et la gestion des **cartes virtuelles**.
- Renforcer le **contrôle budgétaire** avec des règles configurables.
- Mettre en place une **validation hiérarchique** fluide des dépenses.
- Accélérer la **réconciliation comptable** (rapprochement automatique).
- Garantir la **sécurité et la conformité** (traçabilité infalsifiable, audit-ready).

---

## 🚀 Fonctionnalités principales

- Gestion des **projets et centres de coûts**.
- Émission et gestion des **cartes virtuelles** (activation, suspension, plafonds, catégories marchandes).
- Suivi des **transactions en temps réel**.
- Validation et **approbation hiérarchique** des transactions.
- **Rapprochement automatique** des dépenses avec les projets.
- **Reporting & exports** (Excel, CSV, PDF).
- **Ledger comptable sécurisé** (registre infalsifiable).
- Notifications (email/SMS, OTP, alertes).

---

## 👥 Acteurs principaux

- **Employé** : utilise la carte pour ses dépenses et soumet les justificatifs.
- **Manager** : attribue les cartes, configure les règles, valide ou rejette les transactions.
- **Finance/Comptabilité** : supervise, clôture les périodes, exporte les rapports, gère la conformité.

---

## 🛠️ Stack technologique

### Backend

- **Spring Boot 3** (Java 17) – microservices modulaires
- **Spring Cloud** (Config Server, Eureka, Gateway)
- **Spring Security + OAuth2/OIDC** (Keycloak)
- **Spring Data MongoDB**
- **Redis** (cache, OTP, rate limiting)
- **Kafka / RabbitMQ** (événements : transactions, validations)

### Frontend

- **Angular 17** (Standalone Components)
- **Angular Material / Tailwind CSS**
- **JWT Interceptor + RBAC**

### Base de données

- **MongoDB** (partitionnée par service/domaine)

### Sécurité

- Tokenisation des cartes (mock vault)
- mTLS entre microservices, HMAC pour webhooks
- RBAC multi-niveaux + MFA OTP
- Protection OWASP (CSRF, CSP, input validation)

### DevOps & Observabilité

- **Docker Compose / Kubernetes** (orchestration)
- **Prometheus & Grafana** (monitoring)
- **OpenTelemetry** (logs & traces distribuées)

---

## 📊 Architecture (Résumé)

- **API Gateway** : entrée unique, sécurisée avec OAuth2.
- **Microservices modulaires** : gestion des cartes, transactions, reporting, ledger.
- **Event-driven** : Kafka/ RabbitMQ pour la communication asynchrone.
- **Ledger sécurisé** : registre comptable basé sur double entrée et hashing.
- **Frontend Angular** : interface web moderne et responsive.

---

## ⚡ Installation (en local - mode dev)

### Prérequis

- Java 17+
- Node.js 20+
- Docker & Docker Compose
- MongoDB & Redis (containers ou instances locales)
