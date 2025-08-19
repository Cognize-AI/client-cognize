import Card from './card'
import styles from './list.module.scss'

type Props = {}

const List = (props: Props) => {
  return (
    <div className={styles.listContainer}>
        <div>
            <p className={styles.listItem}>New Leads(5)</p>
        </div>

        <div className={styles.searchContainer}>
            <input type="text" placeholder='Search contacts' className={styles.searchInput}/>
        </div>

        <div className={styles.listItemsContainer}>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
        </div>

    </div>
  )
}

export default List