import { Copy, Delete, Edit } from '@/components/icons'
import styles from './CustomField.module.scss'
import { axios_instance } from '@/lib/axios'
import { useEffect, useRef, useState } from 'react'
import { FieldType } from '@/types'
import toast from 'react-hot-toast'

const CustomField = () => {
  const [fields, setFields] = useState<FieldType[]>([])
  const [editFieldId, setEditFieldId] = useState<number | null>(null)
  const [editFieldName, setEditFieldName] = useState('')

  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    axios_instance
      .get('/field/')
      .then(res => {
        setFields(res?.data?.data?.fields || [])
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleEditClick = (field: FieldType) => {
    setEditFieldId(field.id)
    setEditFieldName(field.name)
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFieldName(e.target.value)
  }

  const handleEditSave = async (fieldId: number) => {
    if (!editFieldName.trim()) return

    try {
      await axios_instance.put(`/field/`, {
        id: fieldId,
        name: editFieldName.trim()
      })

      setFields(prev =>
        prev.map(f =>
          f.id === fieldId ? { ...f, name: editFieldName.trim() } : f
        )
      )
      setEditFieldId(null)
      setEditFieldName('')
    } catch (err) {
      console.error('Failed to update field name:', err)
    }
  }

  const handleEditCancel = () => {
    setEditFieldId(null)
    setEditFieldName('')
  }

  const handleDeleteClick = async (fieldId: number) => {
    try {
      await axios_instance.delete(`/field/delete/${fieldId}`)

      setFields(prev => prev.filter(f => f.id !== fieldId))
    } catch (err) {
      console.error('Failed to delete field:', err)
    }
  }

  const handleCopy = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.innerText)
      toast.success('Copied!')
    }
  }

  return (
    <div className={styles.main}>
      {fields.map(field => (
        <div key={field.id} className={styles.card}>
          <div className={styles.container}>
            <div className={styles.sno}>
              for (let index = 0; index < fields.length; index++) {
                
              }
            </div>
            <div className={styles.field}>
              {editFieldId === field.id ? (
                <input
                  type='text'
                  value={editFieldName}
                  onChange={handleEditChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleEditSave(field.id)
                    }
                    if (e.key === 'Escape') {
                      handleEditCancel()
                    }
                  }}
                  onBlur={() => handleEditCancel()}
                  autoFocus
                  className={styles.editInput}
                />
              ) : (
                field.name
              )}
            </div>
            <div className={styles.value }>
              <p  ref={textRef}>{field.id}</p>
            </div>
            <div className={styles.type_box}>
              <div
                className={`${styles.type} ${
                  field.type?.toLowerCase() === 'company'
                    ? styles.type1
                    : field.type?.toLowerCase() === 'contact'
                    ? styles.type2
                    : ''
                }`}
              >
                {field.type}
              </div>
            </div>

            <div className={styles.action}>
              <div
                className={styles.delete}
                onClick={() => handleDeleteClick(field.id)}
                style={{ cursor: 'pointer' }}
              >
                <Delete width={20} height={20} fill='#F77272' />
              </div>
              <div className={styles.copy} onClick={handleCopy} style={{ cursor: 'pointer' }}>
                <Copy width={20} height={20} fill='none' />
              </div>
              <div
                className={styles.edit}
                onClick={() => handleEditClick(field)}
                style={{ cursor: 'pointer' }}
              >
                <Edit width={20} height={20} fill='#194EFF' />
              </div>
            </div>
          </div>

          <div className={styles.separator}></div>
        </div>
      ))}
    </div>
  )
}

export default CustomField
