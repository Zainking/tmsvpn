import styles from './Info.css'
export default () => (
    <div className={styles.info}>
        服务器为 <span className={styles.val}>cn2.ip.tms.im</span> <br/>
        流量有效期至 <span className={styles.val}>本月月末</span>
    </div>
)