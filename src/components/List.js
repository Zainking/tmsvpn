import React from 'react'
import { connect } from 'dva'
import { Card, Col, Row } from 'antd'

import styles from './List.css'

const renderCard = inner => (
  <Col sm={24} md={8} key={inner.id}>
    <Card title={inner.user_name} className={styles.card} bordered={false}>
      {inner.toString()}
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