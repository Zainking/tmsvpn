import React from 'react'
import { connect } from 'dva'
import { Button, Card, Col, Row, Progress, Icon, Modal, Tabs, Form, Input } from 'antd'
import Pay from './Pay'

import styles from './List.css'

const renderCard = (inner, handleClick) => (
  <Col sm={24} md={8} key={inner.id}>
    <Card title={inner.user_name} className={styles.card} bordered={false}>
      连接端口： {inner.port} <br/>
      流量使用： {inner.used_f} / {inner.transfer_enable_f} <Icon onClick={handleClick(inner)} type="plus-circle-o" className={styles.btnAdd} /> <br />
      <Progress status={inner.used / parseInt(inner.transfer_enable, 10) >= 1 ? 'exception' : 'active'} percent={(inner.used / parseInt(inner.transfer_enable, 10) * 100).toFixed(1)}/>
    </Card>
  </Col>
)

const mapState = ({ users }) => ({ list: users.list, currentUser: users.currentUser })

class List extends React.Component {
  constructor() {
    super()
    this.state = { isModalVisible: false }
  }

  componentDidMount() {
    const { dispatch } = this.props
    window.dispatch = dispatch
    dispatch({
      type: 'users/fetch'
    })
  }

  showModal = user => {
    return () => {
      const { dispatch } = this.props
      dispatch({
        type: 'users/setCurrentUser',
        payload: user
      })
      this.setState({ isModalVisible: true })
    }
  }

  hideModal = e => {
    const { dispatch } = this.props
    dispatch({
      type: 'users/closePay',
    })
    this.setState({ isModalVisible: false })
  }

  render() {
    const { list, currentUser } = this.props
    return (
      <div>
        <Row gutter={16}>
          {list.map(item => {
            return renderCard(item, this.showModal)
          })}
        </Row>
        <Modal
          title={`${currentUser.user_name} · 增加流量`}
          visible={this.state.isModalVisible}
          footer={<Button onClick={this.hideModal}>关闭</Button>}
          onCancel={this.hideModal}
        >
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="充值" key="1">
              <Pay />
            </Tabs.TabPane>
            <Tabs.TabPane tab="开箱" key="2">
              剩余箱子数量: {currentUser.box_num} <br/>
              <br/>
              <Form>
                <Form.Item>
                  <Input type="password" placeholder={`请输入${currentUser.user_name}的密码`} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">一键开箱子</Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    )
  }
}

export default connect(mapState)(List)