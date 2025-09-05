import styles from '@/components/ProspectiveId/AiSummary/AiSummary.module.scss'
import { useCardStore } from '@/provider/card-store-provider'

type Props = {}

const AiSummary = (props: Props) => {
  const selectedCard = useCardStore(state => state.selectedCard)

  return (
    <div className={styles.ai_summary}>
      <div className={styles.profile_url}>
        {selectedCard?.profile_url || "https://cognize.com"}
      </div>
      
      <div className={styles.ai_summary_text}>
        {selectedCard?.ai_summary || 
          "I'm a Software Developer & Product Designer with over 2 years of experience creating digital products that matter. I bridge the gap between beautiful design and robust functionality. My experience spans across healthcare, SaaS, coaching, telecom, and marketing industries, where I've helped businesses transform their ideas into successful digital products. With full-stack expertise across modern frameworks and tools, I handle everything from initial concept and design to development, launch, and ongoing support."
        }
      </div>
    </div>
  )
}

export default AiSummary
