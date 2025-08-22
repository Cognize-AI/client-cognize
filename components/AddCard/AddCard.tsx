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
  const [imageUrl, setImageUrl] = useState<string>('/images/add.png');

  // Add a ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // Function to trigger file input click
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
          name,
          designation: title,
          email,
          phone: contact,
          image_url: uploadedUrl,
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
        name: name,
        designation: title,
        email: email,
        phone: contact,
        image_url: uploadedUrl,
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
      // @typescript-eslint/no-explicit-any
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
          {/* <Image 
            src={imageUrl} 
            alt="Avatar" 
            width={48} 
            height={48}
            priority={true}
            unoptimized={imageUrl.startsWith('blob:')}
          /> */}
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
          {/* <Image
            src="/images/tick.png"
            alt="Submit"
            width={22}
            height={14}
            style={{ cursor: 'pointer' }}
            onClick={handleSubmit}
          /> */}
          <Checkmark onClick={handleSubmit} width={24} height={24} fill='#194EFF' />
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          {/* <Image src="/images/email.png" alt="Email" width={16} height={12} /> */}
                    <Mail width={16} height={16} fill='#3D3D3D' />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.email}
          />
        </div>

        <div className={styles.userContact}>
          {/* <Image src="/images/phone.png" alt="Phone" width={16} height={16} /> */}
                    <Phone width={16} height={16} fill='#3D3D3D' />

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
          {/* <Image src="/images/addTag.png" alt="Tag" width={16} height={16} /> */}
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

      {loading && <p>Saving...</p>}
    </div>
  );
};

export default AddCard;
