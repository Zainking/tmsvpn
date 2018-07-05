import React from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Icon } from 'antd'
import styles from './NewAccount.css'

const mapState = ({ users }) => ({ signup: users.signup })

class NewAccount extends React.Component {
  constructor () {
    super()
    this.state = { isModalVisible: false }
  }

  showModal = () => this.setState({ isModalVisible: true })

  hideModal = e => {
    if (e) { e.stopPropagation() }
    this.setState({ isModalVisible: false })
  }

  handleInput = (e) => {
    const { dispatch } = this.props
    dispatch({
      type: 'users/saveRegInfo',
      payload: {[e.target.id]: e.target.value}
    })
  }

  handleSubmit = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'users/submitRegist'
    }).then( res =>{
      if (res === 1) { this.hideModal() }
    })
  }

  render() {
    const { username, password, isRegisting } = this.props.signup
    return (
      <div className={styles.newbtn} onClick={this.showModal}>
        创建新账号 +
        <Modal
          title='创建新账号'
          visible={this.state.isModalVisible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          okText="注册"
          cancelText="取消"
          confirmLoading={isRegisting}
        >
          <Form>
            <Form.Item>
              <Input id="username"  onInput={this.handleInput} prefix={<Icon value={username} type="user" />} placeholder="用户名" />
            </Form.Item>
            <Form.Item>
              <Input id="password" onInput={this.handleInput} prefix={<Icon value={password} type="lock" />} type="password" placeholder="密码(请牢记)" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default connect(mapState)(NewAccount)
