
import { ListType } from '@/types'
import React from 'react'

type Props = {
    children: React.ReactNode
    list?: ListType
}

const List = ({ list, children }: Props) => {
  return (
    <div>List</div>
  )
}

export default List