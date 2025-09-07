import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Copy, Delete, Edit } from '@/components/icons'
import { axios_instance } from '@/lib/axios'
import { FieldType } from '@/types'
import styles from './CustomField.module.scss'

const CustomField = () => {
  const [fields, setFields] = useState<FieldType[]>([])
  const [editField, setEditField] = useState<{
    id: number
    name: string
  } | null>(null)

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
    setEditField({ id: field.id, name: field.name })
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editField) {
      setEditField({ ...editField, name: e.target.value })
    }
  }

  const handleEditSave = async () => {
    if (!editField?.name.trim()) return

    try {
      await axios_instance.put(`/field/`, {
        id: editField.id,
        name: editField.name.trim()
      })

      setFields(prev =>
        prev.map(f =>
          f.id === editField.id ? { ...f, name: editField.name.trim() } : f
        )
      )
      setEditField(null)
    } catch (err) {
      console.error('Failed to update field name:', err)
    }
  }

  const handleEditCancel = () => {
    setEditField(null)
  }

  const handleDeleteClick = async (fieldId: number) => {
    try {
      await axios_instance.delete(`/field/delete/${fieldId}`)
      setFields(prev => prev.filter(f => f.id !== fieldId))
    } catch (err) {
      console.error('Failed to delete field:', err)
    }
  }

  const handleCopy = (textToCopy: string | number) => {
    navigator.clipboard.writeText(String(textToCopy))
    toast.success('Copied!')
  }

  return (
    <div className={styles.main}>
      {fields.map((field, index) => (
        <div key={field.id} className={styles.card}>
          <div className={styles.container}>
            <div className={styles.sno}>{index + 1}</div>
            <div className={styles.field}>
              {editField?.id === field.id ? (
                <input
                  type='text'
                  value={editField.name}
                  onChange={handleEditChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleEditSave()
                    }
                    if (e.key === 'Escape') {
                      handleEditCancel()
                    }
                  }}
                  onBlur={handleEditCancel}
                  autoFocus
                  className={styles.editInput}
                />
              ) : (
                field.name
              )}
            </div>
            <div className={styles.value}>
              <p>{field.id}</p>
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
              {/* <div
                className={styles.delete}
                onClick={() => handleDeleteClick(field.id)}
                style={{ cursor: 'pointer' }}
              >
                <Delete width={20} height={20} fill='#F77272' />
              </div> */}
              <div
                className={styles.copy}
                onClick={() => handleCopy(field.id)}
                style={{ cursor: 'pointer' }}
              >
                <Copy width={20} height={20} fill='none' />
              </div>
              {/* <div
                className={styles.edit}
                onClick={() => handleEditClick(field)}
                style={{ cursor: 'pointer' }}
              >
                <Edit width={20} height={20} fill='#194EFF' />
              </div> */}
            </div>
          </div>

          <div className={styles.separator}></div>
        </div>
      ))}
    </div>
  )
}

export default CustomField
