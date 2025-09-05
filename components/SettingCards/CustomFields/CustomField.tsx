import { Delete, Edit } from '@/components/icons'
import styles from './CustomField.module.scss'
import { axios_instance } from '@/lib/axios'
import { useEffect, useState } from 'react'
import { FieldType } from '@/types'

type Props = {}

const CustomField = () => {
  const [fields, setFields] = useState<FieldType[]>([])

  useEffect(() => {
    axios_instance
      .get('/field')
      .then(res => {
        setFields(res?.data?.data?.fields || [])
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className={styles.main}>
      {fields.map(field => (
        <div className={styles.container}>
          <div className={styles.sno}>{field.ID}</div>
          <div className={styles.field}>{field.Name}</div>
          <div className={styles.value}>{field.SampleValue}</div>
          <div
            className={`${styles.type} ${
              field.Type?.toLowerCase() === 'company'
                ? styles.type1
                : field.Type?.toLowerCase() === 'contact'
                ? styles.type2
                : ''
            }`}
          >
            {field.Type}
          </div>

          <div className={styles.action}>
            <div>
              <Delete width={20} height={20} fill='#F77272' />
            </div>
            <div>
              <Edit width={20} height={20} fill='#194EFF' />
            </div>
            
          </div>
          
        </div>
      ))}
      
      <div className={styles.seprater}>dsfsdf</div>
    </div>
  )
}

export default CustomField

