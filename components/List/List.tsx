'use client'
import { useState } from 'react'
import styles from './List.module.scss'
import Card from '../Card/Card'
import AddCard from '../AddCard/AddCard'
import { CardType, ListType, Tag } from '@/types'
import { AddUser } from '../icons'

type Props = {
  list: ListType
  tags: Tag[]
  onCardAdded: (newCard: CardType) => void
  onCardUpdated: (updatedCard: CardType) => void
  onCardDeleted: (listId: number, cardId: number) => void
  onDragStart: (list_id: number, card_id: number) => void
  onDragEnd: () => void
  onDragEnter: (listId: number, cardIndex: number) => void
  onTagUpdate: () => void
}

const List = ({
  list,
  tags,
  onCardAdded,
  onCardUpdated,
  onCardDeleted,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onTagUpdate
}: Props) => {
  const [showAddUser, setShowAddUser] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleNewCard = (newCard: CardType): void => {
    onCardAdded(newCard)
    setShowAddUser(false)
  }

  const handleCardUpdated = (updatedCard: CardType): void => {
    onCardUpdated(updatedCard)
  }

  const handleCardDeleted = (cardId: number): void => {
    onCardDeleted(list.id, cardId)
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
        backgroundColor: `${list.color}04`
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
          <AddUser
            width={24}
            height={24}
            fill='#3D3D3D'
            onClick={() => setShowAddUser(prev => !prev)}
          />
        </div>
      </div>

      <div
        className={styles.searchContainer}
        style={{ '--active-color': list.color } as React.CSSProperties}
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
            tags={tags}
            onCardAdded={handleNewCard}
            onCancel={() => setShowAddUser(false)}
          />
        )}

        {filteredCards.map((card, idx) => (
          <Card
            key={card.id}
            card={card}
            availableTags={tags}
            index={idx}
            list_id={list.id}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onCardUpdated={handleCardUpdated}
            onCardDeleted={handleCardDeleted}
            onTagUpdate={onTagUpdate}
          />
        ))}
      </div>
    </div>
  )
}

export default List
