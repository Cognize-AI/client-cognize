'use client'
import { useState } from 'react'
import styles from './List.module.scss'
import Image from 'next/image'
import Card from '../Card/Card'
import AddCard from '../AddCard/AddCard'
import { CardType, ListType } from '@/types'
import { AddUser } from '../icons'

type Props = {
  list: ListType
  onCardAdded: (newCard: CardType) => void
  onDragStart: (list_id: number, card_id: number) => void
  onDragEnd: () => void
  onDragEnter: (listId: number, cardIndex: number) => void
}

const List = ({
  list,
  onCardAdded,
  onDragStart,
  onDragEnd,
  onDragEnter
}: Props) => {
  const [showAddUser, setShowAddUser] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleNewCard = (newCard: CardType) => {
    onCardAdded(newCard)
    setShowAddUser(false)
  }

  const filteredCards = (list.cards || []).filter(
    card =>
      (card.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div
      className={styles.listItem}
      style={{
        borderTop: `6px solid ${list.color}`,
        backgroundColor: `${list.color}10`
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={onDragEnd}
      onDragEnter={() => {
        if (filteredCards.length === 0) {
          onDragEnter(list.id, 0)
        }
      }}
    >
      <div className={styles.listHeader}>
        <p className={styles.listTitle}>
          {`${list.name} (${filteredCards.length})`}
        </p>
        <div className={styles.listActions}>
          {/* <Image
            src='/images/addUser.png'
            alt='Add User'
            width={16}
            height={16}
            onClick={() => setShowAddUser(prev => !prev)}
            style={{ cursor: 'pointer' }}
          /> */}
          <AddUser width={24} height={24} fill='#3D3D3D' onClick={() => setShowAddUser(prev => !prev)} />
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
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.listItemsContainer}>
        {showAddUser && (
          <AddCard
            listId={list.id}
            onCardAdded={handleNewCard}
            onCancel={() => setShowAddUser(false)}
          />
        )}

        {filteredCards.map((card, idx) => (
          <Card
            key={card.id}
            card={card}
            index={idx}
            list_id={list.id}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
          />
        ))}

        {filteredCards.length > 0 && (
          <div
            className={styles.endDropZone}
            onDragEnter={() => onDragEnter(list.id, filteredCards.length)}
          />
        )}
      </div>
    </div>
  )
}

export default List