'use client'
import React, { useRef } from 'react'
import styles from './ApiManagement.module.scss'
import { Copy, Delete, Key } from '@/components/icons'
// import { useApiStore } from '@/provider/api-store-provider'

const ApiManagement = () => {
  // const apiKey = useApiStore((state) => state.apiKey)
  // const setApiKey = useApiStore((state) => state.setApiKey)
  
  const textRef = useRef<HTMLDivElement>(null)

  const handleCopy = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.innerText)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.icon}>
          <Key width={20} height={20} fill='none' />
        </div>
        <div className={styles.text} ref={textRef}>
          cgnz_sk_VfDAnISTM0hFJDsjGjofdsfsdufiusadiofjasodfasKftN5QUyxzOAlf
        </div>
        <div className={styles.actions}>
          <div className={styles.delete}>
            <Delete width={20} height={20} fill='#F77272' />
          </div>
          <div className={styles.copy} onClick={handleCopy}>
            <Copy width={20} height={20} fill='none' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiManagement
