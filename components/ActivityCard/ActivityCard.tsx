import React, { useState } from 'react'
import { format } from 'date-fns'
import styles from "./ActivityCard.module.scss"
import { Pen, Trash, Checkmark, Close } from '../icons'

type Props = {
  id: number
  content: string
  date: string
  onDelete: (id: number) => void
  onEdit: (id: number, newContent: string) => void
}

const ActivityCard = ({ id, content, date, onDelete, onEdit }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true)
    setEditContent(content)
  }

  const handleSaveClick = async () => {
    if (!editContent.trim()) {
      return
    }
    
    setIsUpdating(true)
    try {
      await onEdit(id, editContent.trim())
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update activity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelClick = () => {
    setEditContent(content)
    setIsEditing(false)
  }

  const handleDeleteClick = () => {
    onDelete(id)
  }

  return (
    <div className={styles.activity}>
      {isEditing ? (
        <textarea 
          className={styles.editTextarea}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Edit your note..."
          disabled={isUpdating}
        />
      ) : (
        <p className={styles.content}>{content}</p>
      )}
      
      <div className={styles.info}>
        <p className={styles.created}>
          Created on {format(new Date(date), 'MMM dd, yyyy')}
        </p>
        
        {isEditing ? (
          <div className={styles.editActions}>
           
            <div 
              className={styles.cancelAction}
              onClick={handleCancelClick}
            >
              <Close width={16} height={16} fill='#3D3D3D' />
            </div>
             <div 
              className={`${styles.saveAction} ${isUpdating || !editContent.trim() ? styles.disabled : ''}`}
              onClick={handleSaveClick}
            >
              <Checkmark width={16} height={16} fill='white' />
            </div>
          </div>
        ) : (
          <div className={styles.actions}>
            <div onClick={handleDeleteClick} className={styles.delete}>
              <Trash width={20} height={20} fill='#F77272'/>
            </div>
            <div onClick={handleEditClick} className={styles.edit}>
              <Pen width={20} height={20} fill='#194EFF'/>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityCard
