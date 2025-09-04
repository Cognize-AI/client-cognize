import styles from './Tab.module.scss'

type TabProps = {
  onClick: () => void
  isActive: boolean
  children: React.ReactNode
}

const Tab = ({ onClick, isActive, children }: TabProps) => {
  return (
    <div onClick={onClick} className={`${styles.tab} ${isActive ? styles.active : ''}`}>
      {children}
    </div>
  )
}

export default Tab
