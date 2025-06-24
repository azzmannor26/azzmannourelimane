#include <iostream>
#include "Grid.h"
#include "AStar.h"

int main()
{
    int rows = 10, cols = 10;
    Grid grid(rows, cols);

    // Obstacles
    std::vector<Point> obstacles = {{1, 5}, {2, 5}, {3, 5}, {4, 5}, {5, 5}, {6, 5}, {7, 5}};
    for (auto &o : obstacles)
    {
        grid.addObstacle(o.first, o.second);
    }

    Point start = {0, 0};
    Point goal = {9, 9};

    std::cout << "Grille initiale:\n";
    grid.display({}, start, goal);

    AStar astar(grid.getGrid(), start, goal);
    std::vector<Point> path = astar.findPath();

    if (!path.empty())
    {
        std::cout << "Chemin optimal trouvé:\n";
        grid.display(path, start, goal);
        std::cout << "Chemin (coordonnées): ";
        for (auto &p : path)
            std::cout << "(" << p.first << "," << p.second << ") ";
        std::cout << std::endl;
    }
    else
    {
        std::cout << "Aucun chemin trouvé.\n";
    }

    return 0;
}
