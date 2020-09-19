#include <iostream>
#include <algorithm>
#include <vector>

// #include <opencv2/opencv.hpp>

using namespace std;

struct bbox
{
  int m_left;
  int m_top;
  int m_width;
  int m_height;

  bbox() {}
  bbox(int left, int top, int width, int height)
  {
    m_left = left;
    m_top = top;
    m_width = width;
    m_height = height;
  }
};

float IOU(const bbox &b1, const bbox &b2)
{
  float w = std::min(b1.m_left + b1.m_width, b2.m_left + b2.m_width) - std::max(b1.m_left, b2.m_left);
  float h = std::min(b1.m_top + b1.m_height, b2.m_top + b2.m_height) - std::max(b1.m_top, b2.m_top);

  if (w <= 0 || h <= 0)
    return 0;

  // std::cout << "w :" << w << "h :" << h << std::endl;

  return (w * h) / ((b1.m_height * b1.m_width) + (b2.m_height * b2.m_width) - (w * h));
}

vector<bbox> blue_green_no_red(vector<bbox> blue, vector<bbox> green, vector<bbox> red)
{
  vector<bbox> res = {};
  for (auto i = blue.begin(); i != blue.end(); i++)
  {
    int i_is_green = 0;
    int i_is_red = 0;
    for (auto g_i = green.begin(); g_i != green.end(); g_i++)
    {
      float iou_res = IOU(*i, *g_i);
      i_is_green = iou_res > 0.5 ? 1 : 0;
      if (i_is_green)
        break;
    }

    for (auto r_i = red.begin(); r_i != red.end(); r_i++)
    {
      float iou_res = IOU(*i, *r_i);
      i_is_red = iou_res > 0.5 ? 1 : 0;
      if (i_is_red)
        break;
    }
    if (i_is_green && !i_is_red)
      res.push_back(*i);
  }

  return res;
}

int printBBox(bbox a)
{
  cout << a.m_left << " - " << a.m_top << " - " << a.m_height << " - " << a.m_width << endl;
  return 0;
}

int main()
{
  // test
  vector<bbox> blue = {{0, 0, 10, 10}, {100, 100, 110, 110}, {200, 200, 210, 210}};
  vector<bbox> green = {{2, 2, 8, 8}, {101, 101, 109, 109}, {200, 200, 210, 210}};
  vector<bbox> red = {{0, 0, 10, 4}, {101, 101, 108, 108}, {0, 0, 1, 1}};

  bbox a = {0, 0, 0, 0};

  vector<bbox> res = blue_green_no_red(blue, green, red);
  for (auto i = res.begin(); i != res.end(); i++)
  {
    printBBox(*i);
  }

  return 0;
}
