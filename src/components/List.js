import React from 'react'
import { connect } from 'dva'
import { Card, Col, Row, Progress, Icon } from 'antd'

import styles from './List.css'

const renderCard = inner => (
  <Col sm={24} md={8} key={inner.id}>
    <Card title={inner.user_name} className={styles.card} bordered={false}>
      连接端口： {inner.port} <br/>
      流量使用： {inner.used_f} / {inner.transfer_enable_f} <Icon type="plus-circle-o" className={styles.btnAdd} /> <br />
      <Progress percent={(inner.used / parseInt(inner.transfer_enable, 10) * 100).toFixed(1)}/>
    </Card>
  </Col>
)

const mapState = ({ users }) => ({ list: users.list })

class List extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'users/fetch'
    })
  }
  render() {
    const { list } = this.props
    console.log(list)
    return (
      <div>
        <Row gutter={16}>
          {list.map(item => {
            return renderCard(item)
          })}
        </Row>
      </div>
    )
  }
}

export default connect(mapState)(List)