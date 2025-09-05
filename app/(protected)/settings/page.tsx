'use client'
// import SettingTab from '@/components/SettingTab/SettingTab'
import styles from './page.module.scss'
import CustomField from '@/components/SettingCards/CustomFields/CustomField'
import ApiManagement from '@/components/SettingCards/ApiManagement/ApiManagement'
import { useState } from 'react'
import EventTracking from '@/components/SettingCards/EventTracking/EventTracking'
import Tabs from '@/components/Tabs/Tabs'
import Tab from '@/components/Tab/Tab'
import { Activity, Admin, Key, ListBullet } from '@/components/icons'

const Page = () => {
  const [activeTab, setActiveTab] = useState('Custom Fields')
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'Custom Fields':
        return <CustomField />
      case 'API Management':
        return <ApiManagement />
      case 'Event Tracking':
        return <EventTracking />
      case 'Suggestions':
      // return <Suggestions />
      default:
      // return <GeneralField  />
    }
  }

  return (
    <div className={styles.main}>
      <Tabs>
        <Tab
          onClick={() => setActiveTab('Custom Fields')}
          isActive={activeTab === 'Custom Fields'}
        >
          <ListBullet
            className={`${styles.fill_icon} ${
              activeTab === 'Custom Fields' ? styles.active : ''
            }`}
            width={20}
            height={20}
          />
          <p>Custom Fields</p>
        </Tab>
        <Tab
          onClick={() => setActiveTab('API Management')}
          isActive={activeTab === 'API Management'}
        >
          <Key className={`${styles.stroke_icon} ${
              activeTab === 'API Management' ? styles.active : ''
            }`} width={20} height={20} />
          <p>API Management</p>
        </Tab>
        <Tab
          onClick={() => setActiveTab('Activity')}
          isActive={activeTab === 'Activity'}
        >
          <Activity className={`${styles.stroke_icon} ${
              activeTab === 'Activity' ? styles.active : ''
            }`}
            width={20}
            height={20}
          />
          <p>Activity</p>
        </Tab>
        <Tab
          onClick={() => setActiveTab('Suggestions')}
          isActive={activeTab === 'Suggestions'}
        >
          <Admin className={`${styles.fill_icon} ${
              activeTab === 'Suggestions' ? styles.active : ''
            }`} width={20} height={20} />
          <p>Suggestions</p>
        </Tab>
      </Tabs>
      <div>{renderActiveComponent()}</div>
    </div>
  )
}

export default Page
