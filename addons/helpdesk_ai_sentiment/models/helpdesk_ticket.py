from odoo import api, fields, models


class HelpdeskTicket(models.Model):
    _name = "helpdesk.ticket"
    _description = "Ticket de support avec analyse de sentiment"

    name = fields.Char("Titre", required=True)
    description = fields.Text("Description")
    sentiment = fields.Selection(
        [
            ("positive", "Positif"),
            ("neutral", "Neutre"),
            ("negative", "Négatif"),
        ],
        string="Sentiment",
        default="neutral",
    )

    def _compute_sentiment_from_text(self, text):
        """
        Analyse ULTRA simple basée sur des mots-clés.
        Si le texte contient des mots positifs → score positif.
        Si le texte contient des mots négatifs → score négatif.
        Sinon → neutre.
        """
        if not text:
            return "neutral"

        txt = text.lower()

        positive_keywords = ["merci", "parfait", "super", "bien", "satisfait", "bravo"]
        negative_keywords = ["problème", "nul", "déçu", "pas content", "mauvais", "catastrophe"]

        score = 0

        for word in positive_keywords:
            if word in txt:
                score += 1

        for word in negative_keywords:
            if word in txt:
                score -= 1

        if score > 0:
            return "positive"
        elif score < 0:
            return "negative"
        else:
            return "neutral"

    def action_analyze_sentiment(self):
        """
        Bouton appelé depuis le formulaire.
        Pour chaque ticket sélectionné, on lit la description et on calcule le sentiment.
        """
        for record in self:
            record.sentiment = record._compute_sentiment_from_text(record.description)
