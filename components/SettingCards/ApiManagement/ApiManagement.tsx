import React from 'react'
import styles from './ApiManagement.module.scss'
import { Copy, Delete, Key } from '@/components/icons'

type Props = {}

const ApiManagement = (props: Props) => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.icon}>
          <Key width={20} height={20} fill='none' />
        </div>
        <div className={styles.text}>
          cgnz_sk_VfDAnISTM0hFJDsjGjoKftN5QUyxzOAl
        </div>
        <div className={styles.actions}>
          <div className={styles.delete}>
            <Delete width={20} height={20} fill='#F77272' />
          </div>
          <div className={styles.copy}>
            <Copy width={20} height={20} fill='none'  />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiManagement
