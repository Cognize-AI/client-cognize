'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { List } from '@/components'
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
  const moveCardToServer = async (
    prevCard: CardType | null,
    currCard: CardType,
    nextCard: CardType | null,
    listId: number
  ) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No auth token')
      }

      const payload = {
        prev_card: prevCard?.id || null,
        curr_card: currCard.id,
        next_card: nextCard?.id || null,
        list_id: listId
      }

      console.log('Sending payload to server:', payload)

      const res = await fetch(
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

      if (!res.ok) {
        const errorText = await res.text()
        console.error('Server error:', errorText)
        throw new Error(`Failed to move card: ${res.status} - ${res.statusText}`)
      }

      const data = await res.json()
      return data
    } catch (error) {
      console.error('Error moving card:', error)
      throw error
    }
  }

  const handleDragStart = (listId: number, cardId: number) => {
    dragItem.current = { listId, cardId }
  }

  const handleDragEnter = (listId: number, cardIndex: number) => {
    dragOverItem.current = { listId, cardIndex }
  }

  const handleDragEnd = async () => {
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

    if (draggedCard) {
      try {
        const targetList = updatedLists.find(l => l.id === toListId)
        if (targetList) {
          const droppedCardIndex = targetList.cards.findIndex(
            c => c.id === cardId
          )
          const prevCard =
            droppedCardIndex > 0
              ? targetList.cards[droppedCardIndex - 1]
              : null
          const nextCard =
            droppedCardIndex < targetList.cards.length - 1
              ? targetList.cards[droppedCardIndex + 1]
              : null

          await moveCardToServer(prevCard, draggedCard, nextCard, toListId)
        }
      } catch (error) {
        console.error('Failed to move card, reverting UI.', error)
        setLists(originalLists)
        setError('Failed to move the card. Please try again.')
        setTimeout(() => setError(null), 3000)
      }
    }

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
        // @typescript-eslint/no-explicit-any
      } catch (err: unknown) {
        console.error(err)
        setError(
          (err as Error).message || 'Could not load the board. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLists()
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

  if (loading) {
    return <p className={styles.message}>Loading board...</p>
  }

  if (error) {
    return <p className={styles.message}>{error}</p>
  }

  return (
    <div className={styles.kanbanPage}>
      {/* <Header /> */}
      <div className={styles.kanbanLists}>
        {lists.map(list => (
          <List
            key={list.id}
            list={list}
            onCardAdded={handleCardAdded}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

export default Page