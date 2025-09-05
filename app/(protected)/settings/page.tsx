'use client'
import SettingTab from '@/components/SettingTab/SettingTab'
import styles from './page.module.scss'
import CustomField from '@/components/SettingCards/CustomFields/CustomField'
import ApiManagement from '@/components/SettingCards/ApiManagement/ApiManagement'
import { useState } from 'react'
import EventTracking from '@/components/SettingCards/EventTracking/EventTracking'

type Props = {}
const page = () => {
  const [activeTab, setActiveTab] = useState('Custom Fields')
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'Custom Fields':
        return <CustomField/>
      case 'API Management':
        return <ApiManagement/>
      case 'Event Tracking':
       return  <EventTracking />
      case 'Suggestions':
        // return <Suggestions />
      default:
        // return <GeneralField  />
    }
  }

  return (
    <div className={styles.main}>
      <SettingTab activeTab={activeTab} setActiveTab={setActiveTab} onTabClick={(tabName: string) => setActiveTab(tabName)} />
      <div>
        {renderActiveComponent()}
      </div>
    </div>
  )
}

export default page