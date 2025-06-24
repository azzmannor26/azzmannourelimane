#ifndef GRID_H
#define GRID_H

#include <vector>
#include <iostream>
#include <utility>
#include <algorithm>

using Point = std::pair<int, int>;

class Grid
{
public:
    Grid(int rows, int cols);
    void addObstacle(int x, int y);
    void display(const std::vector<Point> &path = {}, Point start = {-1, -1}, Point goal = {-1, -1});

    std::vector<std::vector<int>> getGrid() const;

private:
    std::vector<std::vector<int>> grid_;
    int rows_;
    int cols_;
};

bool operator==(const Point &a, const Point &b); // Déclaration opérateur ==

#endif
