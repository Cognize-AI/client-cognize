'use client';
import { useState } from 'react';
import styles from './List.module.scss';
import Image from 'next/image';
import Card from '../Card/Card';
import AddCard from '../AddCard/AddCard';
import { CardType, ListType } from '@/types';

type Props = {
  list: ListType;
  onCardAdded: (newCard: CardType) => void;
};

const List = ({ list, onCardAdded }: Props) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleNewCard = (newCard: CardType) => {
    onCardAdded(newCard);
    setShowAddUser(false);
  };

  const filteredCards = (list.cards || []).filter(card =>
    (card.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (card.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={styles.listItem}
      style={{
        borderTop: `6px solid ${list.color}`,
        backgroundColor: `${list.color}10`,
      }}
    >
      <div className={styles.listHeader}>
        <p className={styles.listTitle}>{list.name}</p>
        <div className={styles.listActions}>
          <Image
            src="/images/addUser.png"
            alt="Add User"
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
          type="text"
          className={styles.searchInput}
          placeholder="Search contacts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

        {filteredCards.length > 0 ? (
          filteredCards.map(card => <Card key={card.id} card={card} />)
        ) : (
          !showAddUser && (
            <div className={styles.emptyListState}>
              No contacts found
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default List;
