'use client'
import { Activity, Admin, ListBullet, SparklesSoft } from '../icons'
import styles from './TabGroup.module.scss'

type Props = {
  activeTab: string
  onTabClick: (tabName: string) => void
}

const TabGroup = ({ activeTab, onTabClick }: Props) => {
  const tabs = ['AI Summary', 'General Field', 'Activity', 'Suggestions']

  const getIcon = (tabName: string) => {
    switch (tabName) {
      case 'AI Summary':
        return <SparklesSoft width={20} height={20} />
      case 'General Field':
        return <ListBullet width={20} height={20} />
      case 'Activity':
        return (
          <Activity
            fill='none'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            width={20}
            height={20}
          />
        )
      case 'Suggestions':
        return <Admin width={20} height={20} />
      default:
        return null
    }
  }

  return (
    <div className={styles.tab_groups}>
      {tabs.map(tab => (
        <div
          key={tab}
          className={`${styles.tab_group} ${
            activeTab === tab ? styles.active : ''
          }`}
          onClick={() => onTabClick(tab)}
        >
          {getIcon(tab)}
          <p className={styles.text}>{tab}</p>
        </div>
      ))}
    </div>
  )
}

export default TabGroup