#include "Utils.h"
#include "AStar.h"
#include <algorithm> // std::reverse

std::vector<Point> reconstructPath(const std::unordered_map<int, Node> &nodes, Point current, std::function<int(Point)> hashPoint)
{
    std::vector<Point> path;
    while (current.first != -1 && current.second != -1)
    {
        path.push_back(current);
        int key = hashPoint(current);
        if (nodes.find(key) == nodes.end())
            break;
        current = nodes.at(key).parent;
    }
    std::reverse(path.begin(), path.end());
    return path;
}
