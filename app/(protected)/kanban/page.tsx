'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { List } from '@/components'
import { CardType, ListType } from '@/types'
import styles from './page.module.scss'
import { useTagsStore } from '@/provider/tags-store-provider'

type Tag = {
  id: number
  name: string
  color: string
}

const Page = () => {
  const [lists, setLists] = useState<ListType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tags = useTagsStore(state => state.tags)
  const addTags = useTagsStore(state => state.addTags)
  const dragItem = useRef<{ listId: number; cardId: number } | null>(null)
  const dragOverItem = useRef<{ listId: number; cardIndex: number } | null>(null)
  const router = useRouter()

  const fetchTags = async () => {
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

  const fetchLists = async () => {
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
          (list: ListType) => ({
            ...list,
            cards: list.cards || []
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
    const initializeData = async () => {
      await Promise.all([fetchLists(), fetchTags()])
    }
    initializeData()
  }, [router])

  const handleCardAdded = (newCard: CardType) => {
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

  const handleTagUpdate = () => {
    Promise.all([fetchTags(), fetchLists()])
  }

  const handleDragStart = (listId: number, cardId: number) => {
    dragItem.current = { listId, cardId }
    console.log('Drag started:', { listId, cardId })
  }

  const handleDragEnter = (listId: number, cardIndex: number) => {
    dragOverItem.current = { listId, cardIndex }
    console.log('Drag entered:', { listId, cardIndex })
  }

  const handleDragEnd = async () => {
    if (!dragItem.current || !dragOverItem.current) {
      console.log('Missing drag references')
      return
    }

    const { listId: fromListId, cardId } = dragItem.current
    const { listId: toListId, cardIndex } = dragOverItem.current

    console.log('Drag end:', { fromListId, toListId, cardId, cardIndex })

    const sourceList = lists.find(list => list.id === fromListId)
    const draggedCard = sourceList?.cards.find(c => c.id === cardId)
    
    if (!draggedCard) {
      console.error('Card not found in source list:', { cardId, fromListId })
      setError('Card not found. Please refresh and try again.')
      dragItem.current = null
      dragOverItem.current = null
      return
    }

    console.log('Found card to move:', draggedCard)

    if (fromListId === toListId) {
      const currentIndex = sourceList?.cards.findIndex(c => c.id === cardId) || 0
      if (currentIndex === cardIndex) {
        console.log('Same position, skipping')
        dragItem.current = null
        dragOverItem.current = null
        return
      }
    }

    const originalLists = JSON.parse(JSON.stringify(lists))

    const targetList = lists.find(list => list.id === toListId)
    const targetCards = targetList?.cards || []
    
    let prevCard = 0
    let nextCard = 0
    
    if (cardIndex > 0) {
      prevCard = targetCards[cardIndex - 1]?.id || 0
    }
    
    if (cardIndex < targetCards.length) {
      nextCard = targetCards[cardIndex]?.id || 0
    }

    console.log('Move payload calculation:', {
      targetCards: targetCards.map(c => ({ id: c.id, name: c.name })),
      cardIndex,
      prevCard,
      nextCard,
      currCard: draggedCard.id
    })

    const updatedLists = lists
      .map(list => {
        if (list.id === fromListId) {
          return { ...list, cards: list.cards.filter(c => c.id !== cardId) }
        }
        return list
      })
      .map(list => {
        if (list.id === toListId) {
          const newCards = [...list.cards]
          newCards.splice(cardIndex, 0, { ...draggedCard, list_id: toListId })
          return { ...list, cards: newCards }
        }
        return list
      })

    setLists(updatedLists)
    try {
      const token = localStorage.getItem('token')
      const payload = {
        prev_card: Number(prevCard),
        curr_card: Number(draggedCard.id),
        next_card: Number(nextCard),
        list_id: Number(toListId)
      }
      
      console.log('Calling /card/move API with payload:', payload)
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card/move`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      )

      console.log('API Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const errorText = errorData ? JSON.stringify(errorData) : await response.text()
        console.error('API Error response:', errorData || errorText)
        throw new Error(`Failed to move card: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Card moved successfully:', result)

    } catch (error) {
      console.error('Failed to move card:', error)
      
      setLists(originalLists)
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to move card'
      setError(errorMessage)
      setTimeout(() => setError(null), 5000)
    }
    dragItem.current = null
    dragOverItem.current = null
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

  return (
    <div className={styles.kanbanPage}>
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}
      <div className={styles.kanbanLists}>
        {lists.map(list => (
          <List
            key={list.id}
            list={list}
            tags={tags}
            onCardAdded={handleCardAdded}
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
