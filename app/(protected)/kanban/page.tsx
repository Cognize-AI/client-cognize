'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { List } from '@/components'
import { CardType, ListType, Tag } from '@/types'
import styles from './page.module.scss'
import { useTagsStore } from '@/provider/tags-store-provider'

const Page = () => {
  const [lists, setLists] = useState<ListType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  const tags = useTagsStore(state => state.tags)
  const addTags = useTagsStore(state => state.addTags)
  
  const dragItem = useRef<{ listId: number; cardId: number } | null>(null)
  const dragOverItem = useRef<{ listId: number; cardIndex: number } | null>(null)
  const router = useRouter()

  const fetchTags = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tag/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Failed to fetch tags')
      const data = await res.json()
      addTags(data.data.tags)
    } catch (error) {
      console.error('Failed to fetch tags:', error)
    }
  }

  const fetchLists = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/list/all`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (!res.ok) {
        if (res.status === 404) {
          const defaultRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/list/create-default`,
            {
              method: 'GET',
              headers: { Authorization: `Bearer ${token}` }
            }
          )
          if (!defaultRes.ok)
            throw new Error('Failed to create default lists')
          const defaultJson = await defaultRes.json()
          setLists(defaultJson.data.lists || [])
        } else {
          throw new Error('Failed to fetch lists')
        }
      } else {
        const json = await res.json()
        const listsWithCards = (json.data.lists || []).map(
          (list: any) => ({
            ...list,
            cards: (list.cards || []).map((card: any) => ({
              ...card,
              tags: Array.isArray(card.tags) ? card.tags.map((tag: any) => 
                typeof tag === 'string' ? tag : tag.name
              ) : []
            }))
          })
        )
        setLists(listsWithCards)
      }
    } catch (err: unknown) {
      console.error(err)
      setError(
        (err as Error).message || 'Could not load the board. Please try again later.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initializeData = async (): Promise<void> => {
      await Promise.all([fetchLists(), fetchTags()])
    }
    initializeData()
  }, [router])

  const handleCardAdded = (newCard: CardType): void => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (String(list.id) === String(newCard.list_id)) {
          return {
            ...list,
            cards: [...(list.cards || []), newCard]
          }
        }
        return list
      })
    )
  }

  const handleCardUpdated = (updatedCard: CardType): void => {
    setLists(prevLists =>
      prevLists.map(list => ({
        ...list,
        cards: (list.cards || []).map(card =>
          card.id === updatedCard.id ? updatedCard : card
        )
      }))
    )
  }

  const handleCardDeleted = (listId: number, cardId: number): void => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: (list.cards || []).filter(card => card.id !== cardId)
          }
        }
        return list
      })
    )
  }

  const handleTagUpdate = (): void => {
    fetchTags()
  }

  const handleDragStart = (listId: number, cardId: number): void => {
    dragItem.current = { listId, cardId }
  }

  const handleDragEnter = (listId: number, cardIndex: number): void => {
    dragOverItem.current = { listId, cardIndex }
  }

  const handleDragEnd = async (): Promise<void> => {
    if (!dragItem.current || !dragOverItem.current) return
    
    const { listId: fromListId, cardId } = dragItem.current
    const { listId: toListId, cardIndex } = dragOverItem.current
    
    const originalLists = JSON.parse(JSON.stringify(lists))
    let draggedCard: CardType | undefined
    
    const updatedLists = lists
      .map(list => {
        if (list.id === fromListId) {
          draggedCard = list.cards.find(c => c.id === cardId)
          return { ...list, cards: list.cards.filter(c => c.id !== cardId) }
        }
        return list
      })
      .map(list => {
        if (list.id === toListId && draggedCard) {
          const newCards = [...list.cards]
          newCards.splice(cardIndex, 0, draggedCard)
          return { ...list, cards: newCards }
        }
        return list
      })
    
    setLists(updatedLists)
    
    dragItem.current = null
    dragOverItem.current = null

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/card/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_id: cardId,
          new_list_id: toListId,
          new_position: cardIndex,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save card position.')
      }
    } catch (error) {
      console.error('Drag and drop failed:', error)
      setLists(originalLists)
    }
  }

  if (loading) {
    return (
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinnerOuter}></div>
        <p className={styles.spinnerText}>Organizing your pipeline...</p>
        <p className={styles.spinnerSubtext}>Stay with us, precision takes a moment.</p>
      </div>
    )
  }

  if (error) {
    return <div className={styles.errorState}>{error}</div>
  }

  return (
    <div className={styles.kanbanPage}>
      <div className={styles.kanbanLists}>
        {lists.map(list => (
          <List
            key={list.id}
            list={list}
            tags={tags}
            onCardAdded={handleCardAdded}
            onCardUpdated={handleCardUpdated}
            onCardDeleted={handleCardDeleted}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
            onTagUpdate={handleTagUpdate}
          />
        ))}
      </div>
    </div>
  )
}

export default Page
