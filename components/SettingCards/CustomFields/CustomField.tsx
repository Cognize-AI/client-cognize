import { Delete, Edit } from '@/components/icons'
import styles from './CustomField.module.scss'

type Props = {}

const CustomField = (props: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.sno}>
          <div>1</div>
        </div>
        <div className={styles.field}>
          <div>Company linkedin</div>
        </div>
        <div className={styles.value}>
          <div>shq636878yne89</div>
        </div>
        <div className={styles.type}> company</div>
        <div className={styles.action}>
          <div>
            <Delete width={20} height={20} fill='#F77272' />
          </div>
          <div>
            <Edit width={20} height={20} fill='#194EFF' />
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.sno}> 1</div>
        <div className={styles.field}>Company linkedin</div>
        <div className={styles.value}>shq636878yne89</div>
        <div className={styles.type}> company</div>
        <div className={styles.action}>
          <div>
            <Delete width={20} height={20} fill='#F77272' />
          </div>
          <div>
            <Edit width={20} height={20} fill='#194EFF' />
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.sno}> 1</div>
        <div className={styles.field}>Company linkedin</div>
        <div className={styles.value}>shq636878yne89</div>
        <div className={styles.type}> company</div>
        <div className={styles.action}>
          <div>
            <Delete width={20} height={20} fill='#F77272' />
          </div>
          <div>
            <Edit width={20} height={20} fill='#194EFF' />
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.sno}> 1</div>
        <div className={styles.field}>Company linkedin</div>
        <div className={styles.value}>shq636878yne89</div>
        <div className={styles.type}> company</div>
        <div className={styles.action}>
          <div>
            <Delete width={20} height={20} fill='#F77272' />
          </div>
          <div>
            <Edit width={20} height={20} fill='#194EFF' />
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.sno}> 1</div>
        <div className={styles.field}>Company linkedin</div>
        <div className={styles.value}>shq636878yne89</div>
        <div className={styles.type}> company</div>
        <div className={styles.action}>
          <div>
            <Delete width={20} height={20} fill='#F77272' />
          </div>
          <div>
            <Edit width={20} height={20} fill='#194EFF' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomField
