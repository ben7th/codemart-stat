import React from 'react'
import css from './index.scss'

export default class BasicLayout extends React.Component {
  render () {
    return <div className={ css.BasicLayout }>{ this.props.children }</div>
  }
}