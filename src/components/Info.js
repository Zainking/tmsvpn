import React from 'react'
import { connect } from 'dva'
import styles from './Info.css'
const mapState = ({ users }) => ({ luckys: users.luckys })

const mapQualityToInfo = (quality) => {
  switch(quality) {
    case "1": return '垃圾'
    case "2": return '废旧'
    case "3": return '普通'
    case "4": return '漂亮'
    case "5": return '钻石'
    case "6": return 'TMs私藏'
    default: return '未知的'
  }
}
class Info extends React.Component {
  render() {
    const { luckys } = this.props
    return (
      <div>
        <div className={styles.info}>
          服务器为 <span className={styles.val}>cn2.ip.tms.im</span> <br />
          加密方式是 <span className={styles.val}>AES-256-GCM</span> <br />
          流量有效期至 <span className={styles.val}>本月月末</span>
        </div>
        {Boolean(luckys.length) && (
          <div className={styles.info}>
            {luckys.map(lucky => (
              <span key={lucky.time + lucky.flow}>
                <span className={styles.val}>{lucky.user_name}</span> 在 {lucky.time} 开出了一个 <span className={styles.val}>{mapQualityToInfo(lucky.quality)}</span> 品质的箱子，获得了 <span className={styles.val}>{lucky.flow}</span> 流量 <br/>
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }
}
export default connect(mapState)(Info)