// title: 统计

import React from 'react'
import css from './index.scss'

import _inputData from '../../../scripts-2020-02-17/result.json'
import { splitByValues, splitByMultiValues } from '../lib/utils'
import moment from 'moment'
import commentData from '../../../scripts-2020-02-17/resultComment.json'

const resultData = _inputData 
  // .filter(x => x.statusText === '招募中')

resultData.forEach(d => {
  d.tags = d.cutTags.map(x => x.word)
})

export default class index extends React.Component {
  render () {
    return <div className={ css.index }>
      <h2>码市公开项目数据分析</h2>
      <div className={ css.blocks }>
        <div className={ css.block }>
          <BasicStat />
        </div>
        <div className={ css.block }>
          <PriceStat />
        </div>
        <div className={ css.block }>
          <TypeStat />
        </div>
        <div className={ css.block }>
          <RoleStat />
        </div>
        <div className={ css.block }>
          <DurationStat />
        </div>
        <div className={ css.block }>
          <PubTimeStat />
        </div>
        <div className={ css.block }>
          <CutTagStat />
        </div>
        <div className={ css.block }>
          <ManualStat />
        </div>
      </div>
    </div>
  }
}

class BasicStat extends React.Component {
  render () {
    let { stat } = this.state

    if (!stat) {
      return null
    }

    let total = stat.total

    let _statusParts = Object.values(stat.statusParts).map((x, idx) => {
      let value = x.value
      let count = x.subarr.length
      let percent = ((count / total) * 100).toFixed(2)
      return <div className={ css.data } key={ idx }>
        <span>{ value }</span><span>{ count } ({ percent }%)</span>
      </div>
    })

    let _bargainParts = Object.values(stat.bargainParts).map((x, idx) => {
      let value = x.value ? '可议价' : '不可议价'
      let count = x.subarr.length
      let percent = ((count / total) * 100).toFixed(2)
      return <div className={ css.data } key={ idx }>
        <span>{ value }</span><span>{ count } ({ percent }%)</span>
      </div>
    })

    return <div className={ css.Stat }>
      <h3>基本统计</h3>

      <div className={ css.header }>
        <span>指标</span><span>数值</span>
      </div>

      <div className={ css.data }>
        <span>目前公开项目总数</span><span>{ total }</span>
        <span>项目状态</span><span>{ stat.statusValues.join(' | ') }</span>
      </div> 

      { _statusParts }
      { _bargainParts }
    </div>
  }

  state = {
    stat: null
  }

  componentDidMount () {
    let total = resultData.length

    let s1 = splitByValues({ arr: resultData, field: 'statusText' })
    let s2 = splitByValues({ arr: resultData, field: 'bargain' })


    this.setState({
      stat: {
        total, 
        statusValues: s1.values, statusParts: s1.parts,
        bargainValues: s2.values, bargainParts: s2.parts
      }
    })
  }
}

class PriceStat extends React.Component {
  render () {
    let { stat } = this.state

    if (!stat) {
      return null
    }

    let _parts = Object.values(stat.parts).map((p, idx) => {
      return <div className={ css.data } key={ idx }>
        <span>{ p.min } ~ { p.max < Infinity ? p.max : '' }</span>
        <span>{ p.projects.length }</span>
      </div>
    })

    return <div className={ css.Stat }>
      <h3>报价统计</h3>

      <div className={ css.header }>
        <span>指标</span><span>数值</span>
      </div>

      <div className={ css.data }>
        <span>最高报价</span><span>{ stat.max.price } <CMLink id={ stat.max.project.id } /> </span>
        <span>最低报价</span><span>{ stat.min.price } <CMLink id={ stat.min.project.id } /> </span>
      </div> 

      { _parts }
    </div>
  }

  state = {
    stat: null
  }

  componentDidMount () {
    let max = { price: 0 }
    let min = { price: Infinity }

    let parts = {
      p0: { min: 0, max: 1000, projects: [] },
      p1: { min: 1000, max: 3000, projects: [] },
      p2: { min: 3000, max: 5000, projects: [] },
      p3: { min: 5000, max: 10000, projects: [] },
      p4: { min: 10000, max: 20000, projects: [] },
      p5: { min: 20000, max: 50000, projects: [] },
      p6: { min: 50000, max: 100000, projects: [] },
      p7: { min: 100000, max: 200000, projects: [] },
      p8: { min: 200000, max: 500000, projects: [] },
      p9: { min: 500000, max: Infinity, projects: [] },
    }
    
    for (let d of resultData) {
      let price = parseInt(d.price)
      if (price > max.price) {
        max = { price, project: d }
      }
      if (price < min.price) {
        min = { price, project: d }
      }

      Object.keys(parts).forEach(p => {
        let part = parts[p]
        if (part.min < price && price <= part.max) { part.projects.push(d) }
      })
    }

    this.setState({
      stat: {
        max, min, parts
      }
    })
  }
}

class TypeStat extends React.Component {
  render () {
    let { stat } = this.state

    if (!stat) {
      return null
    }

    let _parts = Object.values(stat.parts).map((p, idx) => {
      return <div className={ css.data } key={ idx }>
        <span>{ p.value }</span>
        <span>{ p.subarr.length }</span>
      </div>
    })

    return <div className={ css.Stat }>
      <h3>项目类型统计</h3>
      <div className={ css.header }>
        <span>指标</span><span>数值</span>
      </div>

      <div className={ css.data }>
        <span>项目类型</span><span>{ stat.values.join(' | ') }</span>
      </div> 

      { _parts }
    </div>
  }

  state = {
    stat: null
  }

  componentDidMount () {
    let { values, parts } = splitByValues({ arr: resultData, field: 'typeText' })
    this.setState({
      stat: { values, parts }
    })
  }
}

class RoleStat extends React.Component {
  render () {
    let { stat } = this.state

    if (!stat) {
      return null
    }

    let _parts = Object.values(stat.parts).map((p, idx) => {
      return <div className={ css.data } key={ idx }>
        <span>{ p.value }</span>
        <span>{ p.subarr.length }</span>
      </div>
    })

    return <div className={ css.Stat }>
      <h3>招募角色统计</h3>
      <div className={ css.header }>
        <span>指标</span><span>数值</span>
      </div>

      <div className={ css.data }>
        <span>项目类型</span><span>{ stat.values.join(' | ') }</span>
      </div> 

      { _parts }
    </div>
  }

  state = {
    stat: null
  }

  componentDidMount () {
    let { values, parts } = splitByValues({ arr: resultData, field: 'roles' })
    this.setState({
      stat: { values, parts }
    })
  }
}

class DurationStat extends React.Component {
  render () {
    let { stat } = this.state

    if (!stat) {
      return null
    }

    let _parts = Object.values(stat.parts).map((p, idx) => {
      return <div className={ css.data } key={ idx }>
        <span>{ p.min } ~ { p.max < Infinity ? p.max : '' }</span>
        <span>{ p.projects.length }</span>
      </div>
    })

    return <div className={ css.Stat }>
      <h3>开发周期统计</h3>

      <div className={ css.header }>
        <span>指标</span><span>数值</span>
      </div>

      <div className={ css.data }>
        <span>最高天数</span><span>{ stat.max.duration } <CMLink id={ stat.max.project.id } /> </span>
        <span>最低天数</span><span>{ stat.min.duration } <CMLink id={ stat.min.project.id } /> </span>
      </div>

      { _parts }
    </div>
  }

  state = {
    stat: null
  }

  componentDidMount () {
    let max = { duration: 0 }
    let min = { duration: Infinity }

    let parts = {
      p0: { min: 0, max: 1, projects: [] },
      p1: { min: 1, max: 3, projects: [] },
      p2: { min: 3, max: 5, projects: [] },
      p3: { min: 5, max: 7, projects: [] },
      p4: { min: 7, max: 10, projects: [] },
      p5: { min: 10, max: 20, projects: [] },
      p6: { min: 20, max: 30, projects: [] },
      p7: { min: 30, max: 100, projects: [] },
      p8: { min: 100, max: 500, projects: [] },
      p9: { min: 500, max: Infinity, projects: [] },
    }
    
    for (let d of resultData) {
      let duration = parseInt(d.duration)
      if (duration > max.duration) {
        max = { duration, project: d }
      }
      if (duration < min.duration) {
        min = { duration, project: d }
      }

      Object.keys(parts).forEach(p => {
        let part = parts[p]
        if (part.min < duration && duration <= part.max) { part.projects.push(d) }
      })
    }

    this.setState({
      stat: {
        max, min, parts
      }
    })
  }
}

class PubTimeStat extends React.Component {
  render () {
    let { stat } = this.state

    if (!stat) {
      return null
    }

    let _parts = Object.values(stat.parts).map((p, idx) => {
      return <div className={ css.data } key={ idx }>
        <span>{ moment(p.min).format('YYYY-MM') } ~ { moment(p.max).subtract(1, 'day').format('YYYY-MM') }</span>
        <span>{ p.projects.length }</span>
      </div>
    })

    return <div className={ css.Stat }>
      <h3>发布时间统计</h3>

      <div className={ css.header }>
        <span>指标</span><span>数值</span>
      </div>

      <div className={ css.data }>
        <span>最晚发布</span><span>{ moment(stat.max.pubTime).format('YYYY-MM-DD HH:mm:ss') } <CMLink id={ stat.max.project.id } /> </span>
        <span>最早发布</span><span>{ moment(stat.min.pubTime).format('YYYY-MM-DD HH:mm:ss') } <CMLink id={ stat.min.project.id } /> </span>
      </div>

      { _parts }
    </div>
  }

  state = {
    stat: null
  }

  componentDidMount () {
    let max = { pubTime: 0 }
    let min = { pubTime: Infinity }

    let parts = {
      p00: { min: new Date('2016-01-01').getTime(), max: new Date('2016-04-01').getTime(), projects: [] },
      p01: { min: new Date('2016-04-01').getTime(), max: new Date('2016-07-01').getTime(), projects: [] },
      p02: { min: new Date('2016-07-01').getTime(), max: new Date('2016-10-01').getTime(), projects: [] },
      p03: { min: new Date('2016-10-01').getTime(), max: new Date('2017-01-01').getTime(), projects: [] },

      p10: { min: new Date('2017-01-01').getTime(), max: new Date('2017-04-01').getTime(), projects: [] },
      p11: { min: new Date('2017-04-01').getTime(), max: new Date('2017-07-01').getTime(), projects: [] },
      p12: { min: new Date('2017-07-01').getTime(), max: new Date('2017-10-01').getTime(), projects: [] },
      p13: { min: new Date('2017-10-01').getTime(), max: new Date('2018-01-01').getTime(), projects: [] },

      p30: { min: new Date('2018-01-01').getTime(), max: new Date('2018-04-01').getTime(), projects: [] },
      p31: { min: new Date('2018-04-01').getTime(), max: new Date('2018-07-01').getTime(), projects: [] },
      p32: { min: new Date('2018-07-01').getTime(), max: new Date('2018-10-01').getTime(), projects: [] },
      p33: { min: new Date('2018-10-01').getTime(), max: new Date('2019-01-01').getTime(), projects: [] },

      p40: { min: new Date('2019-01-01').getTime(), max: new Date('2019-04-01').getTime(), projects: [] },
      p41: { min: new Date('2019-04-01').getTime(), max: new Date('2019-07-01').getTime(), projects: [] },
      p42: { min: new Date('2019-07-01').getTime(), max: new Date('2019-10-01').getTime(), projects: [] },
      p43: { min: new Date('2019-10-01').getTime(), max: new Date('2020-01-01').getTime(), projects: [] },

      p50: { min: new Date('2020-01-01').getTime(), max: new Date('2020-04-01').getTime(), projects: [] },
      p51: { min: new Date('2020-04-01').getTime(), max: new Date('2020-07-01').getTime(), projects: [] },
      p52: { min: new Date('2020-07-01').getTime(), max: new Date('2020-10-01').getTime(), projects: [] },
      p53: { min: new Date('2020-10-01').getTime(), max: new Date('2021-01-01').getTime(), projects: [] },
    }
    
    for (let d of resultData) {
      let pubTime = parseInt(d.pubTime)
      if (pubTime > max.pubTime) {
        max = { pubTime, project: d }
      }
      if (pubTime < min.pubTime) {
        min = { pubTime, project: d }
      }

      Object.keys(parts).forEach(p => {
        let part = parts[p]
        if (part.min < pubTime && pubTime <= part.max) { part.projects.push(d) }
      })
    }

    this.setState({
      stat: {
        max, min, parts
      }
    })
  }
}

class ManualStat extends React.Component {
  render () {
    let { stat } = this.state

    if (!stat) {
      return null
    }

    return <div className={ css.Stat }>
      <h3>人工分析</h3>
      <div className={ css.header }>
        <span>指标</span><span>数值</span>
      </div>

      <div className={ css.data }>
        <span>招募职责</span><span>{ stat.s3.values.join(' | ') }</span>
      </div> 
      <Parts parts={ stat.s3.parts } />

      <br/>
      <div className={ css.data }>
        <span>需求明确度</span><span>{ stat.s1.values.join(' | ') }</span>
      </div> 
      <Parts parts={ stat.s1.parts } />

      <br/>
      <div className={ css.data }>
        <span>项目领域</span><span>{ stat.s2.values.join(' | ') }</span>
      </div> 
      <Parts parts={ stat.s2.parts } />

      <br/>
      <div className={ css.data }>
        <span>所需技能</span><span>{ stat.s4.values.join(' | ') }</span>
      </div> 
      <Parts parts={ stat.s4.parts } />
    </div>
  }

  state = {
    stat: null
  }

  componentDidMount () {
    let s1 = splitByMultiValues({ arr: commentData, field: 'demand' })
    let s2 = splitByMultiValues({ arr: commentData, field: 'domain' })
    let s3 = splitByValues({ arr: commentData, field: 'duty' })
    let s4 = splitByMultiValues({ arr: commentData, field: 'skill' })

    this.setState({
      stat: { s1, s2, s3, s4 }
    })
  }
}

class CutTagStat extends React.Component {
  render () {
    let { stat } = this.state

    if (!stat) {
      return null
    }

    return <div className={ css.Stat }>
      <h3>关键词自动提取统计</h3>
      <div className={ css.header }>
        <span>指标</span><span>数值</span>
      </div>

      <Parts parts={ stat.parts } />
    </div>
  }

  state = {
    stat: null
  }

  componentDidMount () {
    console.log(resultData)
    let { values, parts } = splitByMultiValues({ arr: resultData, field: 'tags' })
    this.setState({
      stat: { values, parts }
    })
  }
}

class CMLink extends React.Component {
  render () {
    return <a href={ `https://codemart.com/project/${this.props.id}` } target='_blank' rel='noopener noreferrer'>#{ this.props.id }</a>
  }
}

class Parts extends React.Component {
  render () {
    let lines = Object.values(this.props.parts).sort((a, b) => b.subarr.length - a.subarr.length).map((p, idx) => {
      return <div className={ css.data } key={ idx }>
        <span>{ p.value }</span>
        <span>{ p.subarr.length }</span>
      </div>
    })

    return <>
      { lines }
    </>
  }
}