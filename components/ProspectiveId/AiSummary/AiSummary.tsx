import styles from "@/components/ProspectiveId/AiSummary/AiSummary.module.scss";
import { useCardStore } from "@/provider/card-store-provider";

const AiSummary = () => {
  const selectedCard = useCardStore((state) => state.selectedCard);

  return (
    <div className={styles.ai_summary}>
      <div className={styles.profile_url}>
        {selectedCard?.profile_url || "No profile URL available."}
      </div>

      <div className={styles.ai_summary_text}>
        {selectedCard?.ai_summary ||
          "AI summary will be displayed here once generated."}
      </div>
    </div>
  );
};

export default AiSummary;
