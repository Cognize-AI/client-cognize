'use client'
import { useState } from 'react'
import styles from './List.module.scss'
import Card from '../Card/Card'
import AddCard from '../AddCard/AddCard'
import { CardType, ListType } from '@/types'
import { Add, AddUser } from '../icons'

type Tag = {
  id: number
  name: string
  color: string
}

// Props are updated to receive handlers from the parent page
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
  onCardClick: (cardId: number) => void
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
  onTagUpdate,
  onCardClick
}: Props) => {
  const [showAddUser, setShowAddUser] = useState(false)
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleNewCard = (newCard: CardType) => {
    onCardAdded(newCard)
    setShowAddUser(false)
  }
  const handleCardUpdated = (updatedCard: CardType) => {
    onCardUpdated(updatedCard)
  }
  const handleCardDeleted = (cardId: number) => {
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

      <div
        className={styles.listItemsContainer}
        style={{
          overflowY: isTagModalOpen ? 'unset' : 'auto'
        }}
      >
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
            tags={tags}
            index={idx}
            list_id={list.id}
            onClick={() => onCardClick(card.id)}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onCardUpdated={handleCardUpdated}
            onCardDeleted={handleCardDeleted}
            onTagUpdate={onTagUpdate}
            isTagModalOpen={isTagModalOpen}
            setIsTagModalOpen={setIsTagModalOpen}
          />
        ))}
        
        <div
          className={styles.addNewContact}
          style={{
            border: `1px solid ${list.color}`,
            '--hover-color': `${list.color}14`
          } as React.CSSProperties}
          onClick={() => setShowAddUser(prev => !prev)}
        >
          <div className={styles.addNewContactButton}>
            <Add width={24} height={24} className={styles.addNewContactIcon} stroke={list.color} />

            <p className={styles.addNewContactText} style={{ color: list.color }}>
              Add New Contact
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default List
