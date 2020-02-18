const yaml = require('js-yaml')
const fs = require('fs')

let doc = yaml.safeLoad(fs.readFileSync('resultComment.yaml', 'utf8'))
doc.forEach(d => {
  d.skill = d.skill ? d.skill.split(', ') : []
  d.area = d.area ? d.area.split(', ') : []
  d.domain = d.domain ? d.domain.split(', ') : []
  d.demand = d.demand ? d.demand.split(', ') : []
})
console.log(doc)
fs.writeFileSync('resultComment.json', JSON.stringify(doc, null, 2))