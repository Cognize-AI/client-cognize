'use client';
import Image from 'next/image';
import styles from './AddCard.module.scss';
import { useState, useRef } from 'react';
import { CardType } from '@/types';
import { Add, AddImage, AddUser, Checkmark, Mail, Phone } from '../icons';

type Props = {
  listId: number;
  onCardAdded: (newCard: CardType) => void;
  onCancel: () => void;
};

const colors = ['#16a34a', '#f97316', '#dc2626', '#2563eb', '#7c3aed', '#d97706'];

const uploadToCloudinary = async (file: File): Promise<string> => {
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided');
  }

  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64data = reader.result;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64data }),
        });
        const data = await res.json();
        if (data.url) {
          resolve(data.url);
        } else {
          reject('Upload failed');
        }
      } catch (err) {
        console.error('Upload error:', err);
        reject(err);
      }
    };
    reader.onerror = () => reject('File reading failed');
  });
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
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

  const handleSubmit = async () => {
    if (email && !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      let uploadedUrl = '';
      if (imageFile && imageFile instanceof File) {
        uploadedUrl = await uploadToCloudinary(imageFile);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/card/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          name: name.trim() || null,
          designation: title.trim() || null,
          email: email.trim() || null,
          phone: contact.trim() || null,
          image_url: uploadedUrl || null,
          list_id: listId,
          tags,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add the new card. Please try again.');
      }

      const jsonResponse = await response.json();
      
      const newCardData = {
        id: jsonResponse.data.id || Date.now(),
        name: name.trim() || null,
        designation: title.trim() || null,
        email: email.trim() || null,
        phone: contact.trim() || null,
        image_url: uploadedUrl || null,
        list_id: listId,
        tags: tags,
        ...jsonResponse.data
      };
      
      onCardAdded(newCardData);

      setName('');
      setTitle('');
      setEmail('');
      setContact('');
      setTags([]);
      setTagColors([]);
      setImageFile(null);
      setImageUrl('/images/add.png');
      onCancel();
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cardContainer}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.userInfo}>
        <div className={styles.avatar} onClick={handleImageClick}>
          <AddImage width={24} height={24} fill='#BCBBB8' /> 
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.hiddenInput}
          />
        </div>

        <div className={styles.userDetails}>
          <input
            type="text"
            placeholder="name..."
            value={name}
            onChange={e => setName(e.target.value)}
            className={styles.userName}
          />
          <input
            type="text"
            placeholder="professional exp..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.userTitle}
          />
        </div>

        <div className={styles.userActions}>
          <Checkmark onClick={handleSubmit} width={24} height={24} fill='#194EFF' />
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <Mail width={16} height={16} fill='#3D3D3D' />
          <input
            type="email"
            placeholder="email..."
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.email}
          />
        </div>

        <div className={styles.userContact}>
          <Phone width={16} height={16} fill='#3D3D3D' />
          <input
            type="text"
            placeholder="phone..."
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
          <Add width={16} height={16} />
          <input
            type="text"
            placeholder="Add tag..."
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddTag}
            className={styles.tagInput}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCard;
