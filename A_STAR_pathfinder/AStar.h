#ifndef ASTAR_H
#define ASTAR_H

#include <vector>
#include <queue>
#include <unordered_map>
#include <functional>
#include <utility>

using Point = std::pair<int, int>;

struct Node
{
    Point pos;
    int gCost;
    int hCost;
    Point parent;

    // Constructeur par défaut obligatoire pour unordered_map
    Node() : pos({-1, -1}), gCost(0), hCost(0), parent({-1, -1}) {}
    Node(Point p, int g, int h, Point par) : pos(p), gCost(g), hCost(h), parent(par) {}

    int fCost() const { return gCost + hCost; }
};

// Comparateur pour la priority_queue (min-heap)
struct CompareNode
{
    bool operator()(const Node &a, const Node &b)
    {
        return a.fCost() > b.fCost();
    }
};

class AStar
{
public:
    AStar(const std::vector<std::vector<int>> &grid, Point start, Point goal);

    std::vector<Point> findPath();

private:
    std::vector<std::vector<int>> grid_;
    Point start_;
    Point goal_;
    int rows_;
    int cols_;

    int heuristic(Point a, Point b);
    std::vector<Point> getNeighbors(Point p);
};

#endif
