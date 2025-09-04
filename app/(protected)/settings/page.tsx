'use client'
import SettingTab from '@/components/SettingTab/SettingTab'
import styles from './page.module.scss'
import CustomField from '@/components/SettingCards/CustomFields/CustomField'
import ApiManagement from '@/components/SettingCards/ApiManagement/ApiManagement'
import { useState } from 'react'

type Props = {}
const page = () => {
  const [activeTab, setActiveTab] = useState('Custom Fields')
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'Custom Fields':
        return <CustomField/>
      case 'Api Management':
        return <ApiManagement/>
      case 'Activity':
        // return <ActivityTimeline />
      case 'Suggestions':
        return <Suggestions />
      default:
        // return <GeneralField  />
    }
  }

  return (
    <div className={styles.main}>
      <SettingTab activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {renderActiveComponent()}
      </div>
    </div>
  )
}

export default page