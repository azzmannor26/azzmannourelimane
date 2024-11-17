import pygame as p

p.init()  # Initialize all imported pygame modules.

# Define a class for a square in the Tic Tac Toe grid.
class Square(p.sprite.Sprite):
    def __init__(self, x_id, y_id, number):
        super().__init__()
        self.width = 120  # Set the width of each square.
        self.height = 120  # Set the height of each square.
        self.x = x_id * self.width  # Calculate the x position based on the square’s index.
        self.y = y_id * self.height  # Calculate the y position based on the square’s index.
        self.content = ' '  # Placeholder content for the square, initially empty.
        self.number = number  # Unique identifier for the square.
        self.image = blank_image  # Assign the blank image to the square initially.
        self.image = p.transform.scale(self.image, (self.width, self.height))  # Resize the image to fit the square.
        self.rect = self.image.get_rect()  # Get the rectangle area of the image for positioning.

    def update(self):
        self.rect.center = (self.x, self.y)  # Update the rectangle’s center to the current position.

# Define a function to update and redraw the game window.
def Update():
    win.blit(background, (0, 0))  # Draw the background onto the game window.
    square_group.draw(win)  # Draw all squares in the group onto the game window.
    square_group.update()  # Update positions of all squares in the group.
    p.display.update()  # Refresh the display to show the latest visuals.

# Define window dimensions.
WIDTH = 500
HEIGHT = 500

# Initialize the game window with specified dimensions.
win = p.display.set_mode((WIDTH, HEIGHT))
p.display.set_caption('Tic Tac Toe')  # Set the window title.
clock = p.time.Clock()  # Create a clock object to control the game’s framerate.

# Load images for the blank square, X, O, and background.
blank_image = p.image.load('Blank.png')
x_image = p.image.load('x.png')
o_image = p.image.load('o.png')
background = p.image.load('Background.png')

# Scale the background image to fit the window dimensions.
background = p.transform.scale(background, (WIDTH, HEIGHT))

# Create a sprite group to manage all square objects.
square_group = p.sprite.Group()
squares = []  # List to keep track of individual square objects.

# Initialize each square and add it to the grid.
num = 1
for y in range(1, 4):  # Loop over rows.
    for x in range(1, 4):  # Loop over columns.
        sq = Square(x, y, num)  # Create a new square with position and ID.
        square_group.add(sq)  # Add the square to the sprite group for management.
        squares.append(sq)  # Add the square to the list for easy access.
        num += 1  # Increment the square ID for uniqueness.

# Main game loop.
run = True
while run:
    clock.tick(60)  # Cap the framerate at 60 frames per second.
    for event in p.event.get():  # Process events like mouse clicks, keystrokes, etc.
        if event.type == p.QUIT:  # If the user closes the window:
            run = False  # Stop the game loop and close the game.

    Update()  # Call the update function to redraw and refresh the game window.
