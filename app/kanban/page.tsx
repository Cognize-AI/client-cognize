'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' 
import Header from '../components/header'
import List from '../components/list'
import styles from './page.module.scss'
import { CardType, ListType } from '@/types'



const Page = () => {
  const [lists, setLists] = useState<ListType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [defaultListsCreated, setDefaultListsCreated] = useState(false)
  const router = useRouter() 

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/signin') 
          return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list/all`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        })

        if (!res.ok) throw new Error('Failed to fetch lists')

        const json = await res.json()
        const existingLists = json.data.lists

        if (existingLists && existingLists.length > 0) {
          const listsWithCards = existingLists.map((list: ListType) => ({
            ...list,
            cards: list.cards || []
          }))
          setLists(listsWithCards)
        } else if (!defaultListsCreated) {
          const defaultRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list/create-default`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include'
          });
          
          if (!defaultRes.ok) throw new Error('Failed to create default lists');
          
          const defaultJson = await defaultRes.json();
          const defaultLists = defaultJson.data.lists || [];
          
          const defaultListsWithCards = defaultLists.map((list: ListType) => ({
            ...list,
            cards: list.cards || []
          }))
          
          setLists(defaultListsWithCards);
          setDefaultListsCreated(true);
          
          localStorage.setItem('defaultListsCreated', 'true');
        } else {
          setLists([]);
        }

      } catch (err) {
        console.error(err)
        setError('Could not load the board. Please try again later.....') 
      } finally {
        setLoading(false) 
      }
    }

    // Check if default lists were already created
    const wasDefaultCreated = localStorage.getItem('defaultListsCreated') === 'true';
    setDefaultListsCreated(wasDefaultCreated);
    
    fetchLists()
  }, [router, defaultListsCreated])

  const handleCardAdded = (newCard: CardType) => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.id === newCard.list_id) {
          const updatedCards = list.cards ? [...list.cards, newCard] : [newCard]
          return { ...list, cards: updatedCards }
        }
        return list
      })
    )
  }
  
  if (loading) {
    return <p className={styles.message}>Loading board...</p>
  }

  if (error) {
    return <p className={styles.message}>{error}</p>
  }

  return (
    <div className={styles.kanbanPage}>
      <Header />
      <div className={styles.kanbanLists}>
        {lists.map(list =>
          <List key={list.id} list={list} onCardAdded={handleCardAdded} />
        )}
      </div>
    </div>
  )
}

export default Page
