{
    "name": "Helpdesk AI Sentiment",
    "version": "1.0.0",
    "summary": "Analyse simple du sentiment des tickets de support",
    "description": """
Module Odoo permettant d'analyser automatiquement le sentiment (positif, neutre, négatif)
des tickets de support, à partir de la description, grâce à une IA simple basée sur des mots-clés.
    """,
    "author": "Ton Nom",
    "license": "LGPL-3",
    "depends": ["base"],
    "data": [
        "security/ir.model.access.csv",
        "views/helpdesk_ticket_views.xml",
    ],
    "installable": True,
    "application": True,
}
