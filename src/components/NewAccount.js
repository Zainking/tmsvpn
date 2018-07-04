import React from 'react'
import { Modal, Form, Input, Icon } from 'antd'
import styles from './NewAccount.css'

class NewAccount extends React.Component {
  constructor () {
    super()
    this.state = { isModalVisible: false }
  }

  showModal = () => this.setState({ isModalVisible: true })

  hideModal = e => {
    e.stopPropagation()
    this.setState({ isModalVisible: false })
  }

  render() {
    return (
      <div className={styles.newbtn} onClick={this.showModal}>
        创建新账号 +
        <Modal
          title='创建新账号'
          visible={this.state.isModalVisible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <Form>
            <Form.Item>
              <Input prefix={<Icon type="user" />} placeholder="用户名(请牢记)" />
            </Form.Item>
            <Form.Item>
              <Input prefix={<Icon type="lock" />} type="password" placeholder="密码" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default NewAccount
