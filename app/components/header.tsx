import styles from './header.module.scss'
type Props = {}

const Header = (props: Props) => {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <p className={styles.heading}>My Contacts</p>
            <p className={styles.subheading}>List of people for communication</p>
        </div>
        <div className={styles.actions}>
            <div className={styles.userPic}></div>
            <p className={styles.user}>Profile</p>
        </div>
    </div>
  )
}

export default Header