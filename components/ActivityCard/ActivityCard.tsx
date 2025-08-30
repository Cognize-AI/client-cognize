import { format } from 'date-fns'

import styles from "./ActivityCard.module.scss"
import { Pen, Trash } from '../icons'

type Props = {
  content: string
  date: string
  onDelete: () => void
  onEdit: () => void
}

const ActivityCard = ({ content, date, onDelete, onEdit }: Props) => {
  return (
    <div className={styles.activity}>
      <p className={styles.content}>{content}</p>
      <div className={styles.info}>
        <p className={styles.created}>
          Created on {format(new Date(date), 'MMM dd, yyyy')}
        </p>
        <div onClick={onDelete} className={styles.delete}>
          <Trash width={20} height={20} fill='#F77272'/>
        </div>
        <div onClick={onEdit} className={styles.edit}>
          <Pen width={20} height={20} fill='#194EFF'/>
        </div>
      </div>
    </div>
  )
}

export default ActivityCard