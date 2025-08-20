'use client'
import { useState } from 'react'
import styles from './list.module.scss'
import { ListType } from '../kanban/page'
import Image from 'next/image'
import Card from './card'
import AddCard from './AddCard'

const List = ({ list }: { list: ListType }) => {
  const [showAddUser, setShowAddUser] = useState(false)

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
          <Image
            src='/images/addUser.png'
            alt='Add User'
            width={16}
            height={16}
            onClick={() => setShowAddUser(prev => !prev)}
            style={{ cursor: 'pointer' }}
          />
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
        {showAddUser && <AddCard />}
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  )
}

export default List
