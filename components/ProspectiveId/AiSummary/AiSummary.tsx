import styles from '@/components/ProspectiveId/AiSummary/AiSummary.module.scss'
import { useCardStore } from '@/provider/card-store-provider'

type Props = {}

const AiSummary = (props: Props) => {
  const selectedCard = useCardStore(state => state.selectedCard)

  return (
    <div className={styles.ai_summary}>
      {selectedCard?.profile_url && (
        <div className={styles.profile_url}>
          {selectedCard.profile_url}
        </div>
      )}
      {selectedCard?.ai_summary && (
        <div className={styles.ai_summary_text}>
          {selectedCard.ai_summary}
        </div>
      )}
    </div>
  )
}

export default AiSummary
