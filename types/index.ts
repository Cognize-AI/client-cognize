export type ListType = {
  id: number
  name: string
  color: string
  list_order: number
  created_at: string
  updated_at: string
  cards: CardType[] | null
}

export type CardType = {
  id: number
  name: string
  designation: string
  email: string
  phone: string
  image_url: string
  list_id: number
  created_at: string
  updated_at: string
  tags: string
}

