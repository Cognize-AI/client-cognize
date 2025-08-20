'use client'
import styles from './list.module.scss'
import { ListType } from '../kanban/page'
import Image from 'next/image'
import Card from './card'
import AddCard from './AddCard'

const List = ({ list }: { list: ListType }) => {
  return (
    <div
      className={styles.listItem}
      style={{
        borderTop: `6px solid ${list.color}`,
        backgroundColor: `${list.color}08` 
      }}
    >
      <div className={styles.listHeader}>
        <p className={styles.listTitle}>{list.name}</p>
        <div className={styles.listActions}>
          <Image src='/images/addUser.png' alt='Edit' width={16} height={16} />
        </div>
      </div>
      <div
        className={styles.searchContainer}
        style={{ border: `1px solid ${list.color}` }}
      >
        <input
          type='text'
          className={styles.searchInput}
          placeholder='Search contacts'
        />
      </div>
      <div className={styles.listItemsContainer}>
        <AddCard />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  )
}

export default List
