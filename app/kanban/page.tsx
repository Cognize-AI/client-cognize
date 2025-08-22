'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header, List } from '@/components'
import { CardType, ListType } from '@/types'
import styles from './page.module.scss'

const Page = () => {
  const [lists, setLists] = useState<ListType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const dragItem = useRef<{ listId: number; cardId: number } | null>(null)
  const dragOverItem = useRef<{ listId: number; cardIndex: number } | null>(
    null
  )
  const router = useRouter()

  const handleDragStart = (listId: number, cardId: number) => {
    dragItem.current = { listId, cardId }
  }

  const handleDragEnter = (listId: number, cardIndex: number) => {
    dragOverItem.current = { listId, cardIndex }
  }

  const handleDragEnd = () => {
    if (!dragItem.current || !dragOverItem.current) return

    const { listId: fromListId, cardId } = dragItem.current
    const { listId: toListId, cardIndex } = dragOverItem.current

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

    const targetList = updatedLists.find(l => l.id === toListId)
    if (targetList) {
      const idx = targetList.cards.findIndex(c => c.id === cardId)
      const aboveCard = targetList.cards[idx - 1] || null
      const belowCard = targetList.cards[idx + 1] || null
      console.log('Dragged Card ID:', cardId)
      console.log('Target List ID:', toListId)
      console.log('Card Above:', aboveCard)
      console.log('Card Below:', belowCard)
    }

    setLists(updatedLists)
    dragItem.current = null
    dragOverItem.current = null
  }

  useEffect(() => {
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

            if (!defaultRes.ok) {
              throw new Error('Failed to create default lists')
            }
            const defaultJson = await defaultRes.json()
            setLists(defaultJson.data.lists || [])
          } else {
            throw new Error('Failed to fetch lists')
          }
        } else {
          const json = await res.json()
          const existingLists = json.data.lists || []
          const listsWithCards = existingLists.map((list: ListType) => ({
            ...list,
            cards: list.cards || []
          }))
          setLists(listsWithCards)
        }
      } catch (err: any) {
        console.error(err)
        setError(
          err.message || 'Could not load the board. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLists()
  }, [router])

  const handleCardAdded = (newCard: CardType) => {
    setLists(prevLists => {
      const newLists = prevLists.map(list => {
        if (String(list.id) === String(newCard.list_id)) {
          return {
            ...list,
            cards: [...(list.cards || []), newCard]
          }
        }
        return list
      })
      return [...newLists]
    })
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
        {lists.map(list => (
          <List
            key={list.id}
            list={list}
            onCardAdded={handleCardAdded}
            onDragStart={(list_id, card_id) => handleDragStart(list_id, card_id)}
            onDragEnter={(list_id, cardIndex) => handleDragEnter(list_id, cardIndex)}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

export default Page
