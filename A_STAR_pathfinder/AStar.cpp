#include "AStar.h"
#include "Utils.h"
#include <cstdlib> // pour std::abs

AStar::AStar(const std::vector<std::vector<int>> &grid, Point start, Point goal)
    : grid_(grid), start_(start), goal_(goal)
{
    rows_ = grid_.size();
    cols_ = grid_[0].size();
}

int AStar::heuristic(Point a, Point b)
{
    // Distance de Manhattan
    return std::abs(a.first - b.first) + std::abs(a.second - b.second);
}

std::vector<Point> AStar::getNeighbors(Point p)
{
    std::vector<Point> neighbors;
    const std::vector<Point> directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    for (auto &d : directions)
    {
        int nx = p.first + d.first;
        int ny = p.second + d.second;
        if (nx >= 0 && nx < rows_ && ny >= 0 && ny < cols_ && grid_[nx][ny] == 0)
        {
            neighbors.emplace_back(nx, ny);
        }
    }
    return neighbors;
}

std::vector<Point> AStar::findPath()
{
    std::priority_queue<Node, std::vector<Node>, CompareNode> openSet;
    std::unordered_map<int, Node> allNodes; // clé = x*cols + y

    auto hashPoint = [this](Point p)
    {
        return p.first * cols_ + p.second;
    };

    Node startNode(start_, 0, heuristic(start_, goal_), {-1, -1});
    openSet.push(startNode);
    allNodes[hashPoint(start_)] = startNode;

    while (!openSet.empty())
    {
        Node current = openSet.top();
        openSet.pop();

        if (current.pos == goal_)
        {
            // reconstruire chemin
            return reconstructPath(allNodes, current.pos, hashPoint);
        }

        for (auto &neighbor : getNeighbors(current.pos))
        {
            int tentativeG = current.gCost + 1;

            int neighborKey = hashPoint(neighbor);
            if (allNodes.find(neighborKey) == allNodes.end() || tentativeG < allNodes[neighborKey].gCost)
            {
                Node neighborNode(neighbor, tentativeG, heuristic(neighbor, goal_), current.pos);
                allNodes[neighborKey] = neighborNode;
                openSet.push(neighborNode);
            }
        }
    }

    return {}; // Aucun chemin trouvé
}
