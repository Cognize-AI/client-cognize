import Header from '../components/header'
import List from '../components/list'
import styles from './page.module.scss'

type Props = {}

const page = (props: Props) => {
  return (
    <div className={styles.kanbanPage}>
      <Header />
      <div className={styles.kanbanLists}>
        <List />
        <List />
        <List />
        <List />
        <List />
      </div>
    </div>
  )
}

export default page
