// 抓取码市公开项目
// 此脚本在本地运行即可，不用服务器环境

const fetch = require('node-fetch')
const fs = require('fs')
const nodejieba = require('nodejieba')

// 抓取一页
const getOnePage = async ({ page }) => {
  let url = `https://codemart.com/api/project?page=${page}`
  let res = await fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  })
  let data = await res.json()
  return data
}

// 抓取所有页
const getAllPages = async () => {
  let currentPage = 1
  let result = []

  while (true) {
    let data = await getOnePage({ page: currentPage })
    console.log(`. ${ currentPage }`)
    let { pager, rewards } =  data
    result = [].concat(result).concat(rewards)

    if (currentPage === pager.totalPage) {
      break
    }

    currentPage += 1
  }

  return result
}

const jiebaCut = (data) => {
  let res = data.map(d => {
    let { name, description } = d
    let str = `${name} ${description}`
    // let cutTags = nodejieba.tag(str)
    let cutTags = nodejieba.extract(str, 10)
    return Object.assign({}, d, { cutTags })
  })

  return res
}

const run = async () => {
  let result = await getAllPages()
  result = jiebaCut(result)

  fs.writeFileSync('result.json', JSON.stringify(result, null, 2))
  console.log('done.')
}

run().then()