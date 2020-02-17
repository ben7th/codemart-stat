# codemart-stat

抓取码市 <https://codemart.com/projects> 的公开项目数据，并进行数据分析；

## web

用于展示分析结果的网页

## scripts-2020-02-17

2020 年 2 月 17 日进行的数据抓取与分析，主要思路：

- 通过 codemart 公共 api <https://codemart.com/api/project?page=1> 获取各个分页的公开项目数据
- 将数据保存为一个 json
- 对 json 文件进行各种分析