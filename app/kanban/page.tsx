'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, List } from '@/components';
import { CardType, ListType } from '@/types';
import styles from './page.module.scss';

const Page = () => {
  const [lists, setLists] = useState<ListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            if (res.status === 404) {
                const defaultRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list/create-default`, {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!defaultRes.ok) {
                    throw new Error('Failed to create default lists');
                }
                const defaultJson = await defaultRes.json();
                setLists(defaultJson.data.lists || []);
            } else {
                 throw new Error('Failed to fetch lists');
            }
        } else {
            const json = await res.json();
            const existingLists = json.data.lists || [];
            const listsWithCards = existingLists.map((list: ListType) => ({
                ...list,
                cards: list.cards || [],
            }));
            setLists(listsWithCards);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Could not load the board. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [router]);

  const handleCardAdded = (newCard: CardType) => {
    setLists(prevLists => {
      const newLists = prevLists.map(list => {
        if (String(list.id) === String(newCard.list_id)) {
          return {
            ...list,
            cards: [...(list.cards || []), newCard]
          };
        }
        return list;
      });
      return [...newLists];
    });
  };

  if (loading) {
    return <p className={styles.message}>Loading board...</p>;
  }

  if (error) {
    return <p className={styles.message}>{error}</p>;
  }

  return (
    <div className={styles.kanbanPage}>
      <Header />
      <div className={styles.kanbanLists}>
        {lists.map(list => (
          <List key={list.id} list={list} onCardAdded={handleCardAdded} />
        ))}
      </div>
    </div>
  );
};

export default Page;
