import React from 'react'
import { connect } from 'dva'
import { Button, Form, Select } from 'antd'

import styles from './Pay.css'

const mapState = state => ({ pay: state.users.pay })

class Pay extends React.Component {
  handleSubmit = e => {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch({
      type: 'users/generatePayCode'
    })
  }
  handleSelect = val => {
    const { dispatch } = this.props
    dispatch({
      type: 'users/changeCat',
      payload: val
    })
  }
  render() {
    const { imgBase64, cat, isGenerating, isPaying } = this.props.pay
    return (
      <div className={styles.pay}>
        请选择套餐点击“信仰充值”生成支付二维码
        <Form onSubmit={this.handleSubmit}>
          <div className={styles.payCode}>
            {isPaying && <img className={styles.payImg} alt="paycode" src={`data:image/png;base64,${imgBase64}`}/>}
          </div>
          <Form.Item>
            <Select value={cat} placeholder="请选择购买套餐" onChange={this.handleSelect}>
              <Select.Option value="9">1 元购买 1 个箱子</Select.Option>
              <Select.Option value="8">10 元购买 12 个箱子</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button loading={isGenerating} htmlType="submit" type="primary">信仰充值</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default connect(mapState)(Pay)