// 根据指定枚举维度的取值对集合进行划分
const splitByValues = ({ arr, field }) => {
  let values = []
  let parts = {}

  for (let x of arr) {
    let value = x[field]

    if (values.includes(value)) {
      parts[value].subarr.push(x)
    } else {
      values.push(value)
      parts[value] = { value, subarr: [ x ] }
    }
  }

  return { values, parts }
}

module.exports = {
  splitByValues
}