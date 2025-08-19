import styles from './card.module.scss'
type Props = {}

const Card = (props: Props) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}></div>
        <div className={styles.userDetails}>
          <p className={styles.userName}>John Doe</p>
          <p className={styles.userTitle}>Software Engineer</p>
        </div>
        <div className={styles.userActions}></div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <p className={styles.email}>johndoe@example.com</p>
        </div>
        <div className={styles.userContact}>
          <p className={styles.contact}>2374982752</p>
        </div>
      </div>

      <div className={styles.userTags}>
        <div className={styles.userTag}>Frontend</div>
        <div className={styles.userTag}>Backend</div>
        <div className={styles.addTag}>Add Tag....</div>
      </div>
    </div>
  )
}

export default Card
