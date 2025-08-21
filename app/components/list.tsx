'use client'
import { useState } from 'react'
import styles from './list.module.scss'
import { ListType, CardType } from '../kanban/page'
import Image from 'next/image'
import Card from './card'
import AddCard from './AddCard'

type Props = {
  list?: ListType
  onCardAdded: (newCard: CardType) => void
}

const List = ({ list, onCardAdded }: Props) => {
  const [showAddUser, setShowAddUser] = useState(false)

  const handleNewCard = (newCard: CardType) => {
    if (!newCard || !newCard.id) return
    onCardAdded(newCard)
    setShowAddUser(false)
  }

  if (!list) return null

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
        {showAddUser && <AddCard listId={list.id} onCardAdded={handleNewCard} />}

        {list.cards && list.cards.length > 0 ? (
          list.cards.map(card => <Card key={card.id} card={card} />)
        ) : (
          !showAddUser && <p>No cards available</p>
        )}
      </div>
    </div>
  )
}

export default List