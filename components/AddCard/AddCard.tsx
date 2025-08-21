'use client';
import Image from 'next/image';
import styles from './AddCard.module.scss';
import { useState } from 'react';
import { CardType } from '@/types';

type Props = {
  listId: number;
  onCardAdded: (newCard: CardType) => void;
  onCancel: () => void;
};

const AddCard = ({ listId, onCardAdded, onCancel }: Props) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagColors, setTagColors] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = ['#16a34a', '#f97316', '#dc2626', '#2563eb', '#7c3aed', '#d97706'];

  const handleSubmit = async () => {
    if (!name || !title || !email || !contact) {
      setError('All fields are required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/card/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name,
          designation: title,
          email,
          phone: contact,
          image_url: '', 
          list_id: listId,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add the new card. Please try again.');
      }

      const jsonResponse = await response.json();
      onCardAdded(jsonResponse.data);
      setName('');
      setTitle('');
      setEmail('');
      setContact('');
      setTags([]);
      setTagColors([]);
      onCancel();

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setTags(prev => [...prev, trimmed]);
      setTagColors(prev => [...prev, randomColor]);
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={styles.cardContainer}>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          <Image src="/images/add.png" alt="Avatar" width={24} height={24} />
        </div>
        <div className={styles.userDetails}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles.userName}
          />
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.userTitle}
          />
        </div>
        <div className={styles.userActions}>
          <Image
            src="/images/tick.png"
            alt="Submit"
            width={22}
            height={14}
            style={{ cursor: 'pointer' }}
            onClick={handleSubmit}
          />
           <Image
            src="/images/cancel.png" 
            alt="Cancel"
            width={16}
            height={16}
            style={{ cursor: 'pointer', marginLeft: '8px' }}
            onClick={onCancel}
          />
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <Image src="/images/email.png" alt="Email" width={16} height={16} />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.email}
          />
        </div>
        <div className={styles.userContact}>
          <Image src="/images/phone.png" alt="Phone" width={16} height={16} />
          <input
            type="text"
            placeholder="Enter Contact"
            value={contact}
            onChange={e => setContact(e.target.value)}
            className={styles.contact}
          />
        </div>
      </div>

      <div className={styles.userTags}>
        {tags.map((tag, idx) => (
          <div
            key={idx}
            className={styles.userTag}
            style={{
              color: tagColors[idx],
              background: `${tagColors[idx]}1A`,
            }}
          >
            {tag}
          </div>
        ))}
        <div className={styles.addTag}>
          <Image src="/images/add.png" alt="Tag" width={16} height={16} />
          <input
            type="text"
            placeholder="Add tag"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            className={styles.tagInput}
          />
        </div>
      </div>
      {loading && <p>Saving...</p>}
    </div>
  );
};

export default AddCard;
