import tkinter as tk

CELL_SIZE = 40

def draw_grid(canvas, grid, path, start, goal):
    canvas.delete("all")
    rows = len(grid)
    cols = len(grid[0])

    for i in range(rows):
        for j in range(cols):
            x1, y1 = j * CELL_SIZE, i * CELL_SIZE
            x2, y2 = x1 + CELL_SIZE, y1 + CELL_SIZE

            color = "white"
            if (i, j) == start:
                color = "blue"
            elif (i, j) == goal:
                color = "yellow"
            elif (i, j) in path:
                color = "green"
            elif grid[i][j] == 1:
                color = "red"

            canvas.create_rectangle(x1, y1, x2, y2, fill=color, outline="black")

def example_case():
    grid = [[0]*10 for _ in range(10)]
    obstacles = [(1,5),(2,5),(3,5),(4,5),(5,5),(6,5),(7,5)]
    for (x,y) in obstacles:
        grid[x][y] = 1
    start = (0,0)
    goal = (9,9)

    # Ici, tu pourrais appeler ta fonction A* en Python et récupérer le chemin.
    # Pour l’exemple, je mets un chemin fixe.
    path = [(0,0),(1,0),(2,0),(3,0),(3,1),(3,2),(4,2),(4,3),(4,4),
            (5,4),(6,4),(7,4),(8,4),(9,4),(9,5),(9,6),(9,7),(9,8),(9,9)]
    return grid, path, start, goal

def main():
    root = tk.Tk()
    root.title("Visualisation A*")

    canvas = tk.Canvas(root, width=400, height=400)
    canvas.pack(side=tk.LEFT)

    text = tk.Text(root, width=40, height=20)
    text.pack(side=tk.RIGHT)
    text.insert(tk.END,
                "Légende:\n"
                "Bleu = Départ\n"
                "Jaune = Arrivée\n"
                "Rouge = Obstacle\n"
                "Vert = Chemin optimal\n\n"
                "Exemple de visualisation simple du chemin trouvé.\n")

    grid, path, start, goal = example_case()
    draw_grid(canvas, grid, path, start, goal)

    root.mainloop()

if __name__ == "__main__":
    main()
