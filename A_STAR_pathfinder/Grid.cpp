#include "Grid.h"

Grid::Grid(int rows, int cols) : rows_(rows), cols_(cols)
{
    grid_.resize(rows_, std::vector<int>(cols_, 0));
}

void Grid::addObstacle(int x, int y)
{
    if (x >= 0 && x < rows_ && y >= 0 && y < cols_)
    {
        grid_[x][y] = 1;
    }
}

void Grid::display(const std::vector<Point> &path, Point start, Point goal)
{
    for (int i = 0; i < rows_; i++)
    {
        for (int j = 0; j < cols_; j++)
        {
            Point p = {i, j};
            if (p == start)
                std::cout << "S ";
            else if (p == goal)
                std::cout << "G ";
            else if (std::find(path.begin(), path.end(), p) != path.end())
                std::cout << "* ";
            else if (grid_[i][j] == 1)
                std::cout << "■ ";
            else
                std::cout << ". ";
        }
        std::cout << std::endl;
    }
    std::cout << std::endl;
}

std::vector<std::vector<int>> Grid::getGrid() const
{
    return grid_;
}

bool operator==(const Point &a, const Point &b)
{
    return a.first == b.first && a.second == b.second;
}
