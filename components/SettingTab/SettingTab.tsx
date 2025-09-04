'use client'
import { Activity, Admin, ListBullet, SparklesSoft } from '../icons'
import styles from './SettingTab.module.scss'

type Props = {
  activeTab: string
  onTabClick: (tabName: string) => void
}

const SettingTab = ({ activeTab, onTabClick }: Props) => {
  const tabs = ['Custom Fields', 'API Management', 'Event Tracking', 'Event Tracking']

  const getIcon = (tabName: string) => {
    switch (tabName) {
      case 'Custom Fields':
        return <ListBullet width={20} height={20} />
      case 'API Management':
        return <SparklesSoft width={20} height={20} />
      case 'Event Tracking':
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
      case 'Event Tracking':
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

export default SettingTab