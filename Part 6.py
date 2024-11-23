# Importation des bibliothèques nécessaires
import pygame as p
import time

p.init()

# Cette classe représente chaque case (ou carré) du plateau de jeu.
class Square(p.sprite.Sprite):
    def __init__(self, x_id, y_id, number):
        super().__init__()
        self.width = 120  # Largeur d'une case
        self.height = 120  # Hauteur d'une case
        self.x = x_id * self.width  # Position X sur le plateau
        self.y = y_id * self.height  # Position Y sur le plateau
        self.content = ''  # Contenu de la case ('x', 'o' ou vide)
        self.number = number  # Numéro unique de la case
        self.image = blank_image  # Image par défaut (vide)
        self.image = p.transform.scale(self.image, (self.width, self.height))
        self.rect = self.image.get_rect()

    def update(self):
        # Met à jour la position de la case dans le jeu
        self.rect.center = (self.x, self.y)

    def clicked(self, x_val, y_val):
        # Détecte si une case a été cliquée et met à jour son contenu
        global turn, won

        if self.content == '':  # Si la case est vide
            if self.rect.collidepoint(x_val, y_val):  # Vérifie si le clic est sur cette case
                self.content = turn  # Associe le tour actuel ('x' ou 'o') à la case
                board[self.number] = turn  # Met à jour l'état du plateau

                if turn == 'x':
                    self.image = x_image  # Change l'image pour 'x'
                    self.image = p.transform.scale(self.image, (self.width, self.height))
                    turn = 'o'  # Change le tour pour 'o'
                    checkWinner('x')  # Vérifie si 'x' a gagné

                    if not won:  # Si personne n'a gagné, l'ordinateur joue
                        CompMove()

                else:
                    self.image = o_image  # Change l'image pour 'o'
                    self.image = p.transform.scale(self.image, (self.width, self.height))
                    turn = 'x'  # Change le tour pour 'x'
                    checkWinner('o')  # Vérifie si 'o' a gagné

# Vérifie si un joueur a gagné
def checkWinner(player):
    global background, won, startX, startY, endX, endY

    for i in range(8):  # Parcourt les 8 combinaisons gagnantes
        if board[winners[i][0]] == player and board[winners[i][1]] == player and board[winners[i][2]] == player:
            won = True  # Marque le jeu comme gagné
            getPos(winners[i][0], winners[i][2])  # Récupère les positions des cases pour dessiner une ligne
            break

    if won:
        Update()  # Met à jour l'écran
        drawLine(startX, startY, endX, endY)  # Dessine une ligne entre les cases gagnantes

        square_group.empty()  # Supprime les cases
        background = p.image.load(player.upper() + ' Wins.png')  # Charge l'image du gagnant
        background = p.transform.scale(background, (WIDTH, HEIGHT))  # Ajuste sa taille

# Permet à l'ordinateur de prendre une décision pour jouer
def CompMove():
    global move, background

    move = True  # Variable indiquant si l'ordinateur peut jouer

    # L'ordinateur essaie différentes stratégies pour jouer
    if move:
        Winner('o')  # Vérifie si 'o' peut gagner directement
    if move:
        Winner('x')  # Empêche 'x' de gagner si possible
    if move:
        checkDangerPos()  # Vérifie les positions dangereuses
    if move:
        checkCentre()  # Vérifie si le centre est libre
    if move:
        checkCorner()  # Vérifie les coins
    if move:
        checkEdge()  # Vérifie les bords

    if not move:  # Si une décision a été prise
        for square in squares:
            if square.number == compMove:  # Trouve la case correspondante et joue
                square.clicked(square.x, square.y)
    else:  # Sinon, le jeu est déclaré comme un match nul
        Update()
        time.sleep(1)
        square_group.empty()
        background = p.image.load('Tie Game.png')
        background = p.transform.scale(background, (WIDTH, HEIGHT))

# Vérifie les positions dangereuses et empêche l'adversaire de gagner
def checkDangerPos():
    global move, compMove

    if board == dangerPos1:
        compMove = 2  # Décide de jouer à une position pour éviter le danger
        move = False

    # Répète la logique pour d'autres situations dangereuses...

# Met à jour l'affichage
def Update():
    win.blit(background, (0, 0))  # Affiche le fond
    square_group.draw(win)  # Affiche les cases
    square_group.update()  # Met à jour leurs positions
    p.display.update()  # Actualise l'écran

# Initialise les dimensions de la fenêtre et d'autres variables globales
WIDTH = 500
HEIGHT = 500
win = p.display.set_mode((WIDTH, HEIGHT))
p.display.set_caption('Tic Tac Toe')
clock = p.time.Clock()

# Charge les images nécessaires pour le jeu
blank_image = p.image.load('Blank.png')
x_image = p.image.load('x.png')
o_image = p.image.load('o.png')
background = p.image.load('Background.png')
background = p.transform.scale(background, (WIDTH, HEIGHT))

# Initialise les variables nécessaires pour le plateau et le jeu
move = True
won = False
compMove = 5

square_group = p.sprite.Group()
squares = []

# Combinaisons gagnantes
winners = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
board = ['' for i in range(10)]  # État du plateau (vide au départ)

# Crée les cases et les ajoute au groupe
num = 1
for y in range(1, 4):
    for x in range(1, 4):
        sq = Square(x, y, num)
        square_group.add(sq)
        squares.append(sq)
        num += 1

turn = 'x'  # Le tour commence avec 'x'
run = True
while run:  # Boucle principale du jeu
    clock.tick(60)  # Limite à 60 images par seconde
    for event in p.event.get():
        if event.type == p.QUIT:  # Quitte le jeu si demandé
            run = False

        if event.type == p.MOUSEBUTTONDOWN and turn == 'x':  # Si c'est le tour de 'x' et qu'une case est cliquée
            mx, my = p.mouse.get_pos()
            for s in squares:
                s.clicked(mx, my)

    Update()  # Met à jour l'écran
