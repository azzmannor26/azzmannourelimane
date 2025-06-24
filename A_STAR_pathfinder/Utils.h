#ifndef UTILS_H
#define UTILS_H

#include <vector>
#include <unordered_map>
#include <utility>
#include <functional>

using Point = std::pair<int, int>;

struct Node; // Déclaration anticipée

std::vector<Point> reconstructPath(const std::unordered_map<int, Node> &nodes, Point current, std::function<int(Point)> hashPoint);

#endif
