import { SetStateAction } from 'react'
import { Checkmark } from '../icons'
import styles from './TagModal.module.scss'
import { CardType, Tag } from '@/types'

type Props = {
  ref: React.RefObject<HTMLDivElement | null>
  tagSearchQuery: string
  setTagSearchQuery: (value: SetStateAction<string>) => void
  filteredTags: Tag[]
  editedCard: CardType | Tag[]
  handleTagToggle: (tagID: number, tagName: string, tagColor: string) => void
}

const TagModal = ({
  ref,
  tagSearchQuery,
  setTagSearchQuery,
  filteredTags,
  editedCard,
  handleTagToggle
}: Props) => {
  return (
    <div ref={ref} className={styles.searchTag} onClick={e => e.stopPropagation()}>
      <input
        type='text'
        placeholder='Search tags...'
        className={styles.searchTagInput}
        value={tagSearchQuery}
        onChange={e => setTagSearchQuery(e.target.value)}
      />
      <div className={styles.allTags}>
        {filteredTags?.map(tag => {
          const currentTags = Array.isArray(editedCard)
            ? editedCard
            : editedCard.tags || []
          const isSelected = currentTags.some(t => t.name === tag.name)

          return (
            <div key={tag.id} className={styles.allTag}>
              <div
                className={`${styles.checkbox} ${
                  isSelected ? styles.checked : ''
                }`}
                onClick={e => {
                  e.stopPropagation()
                  handleTagToggle(tag.id, tag.name, tag.color)
                }}
              >
                <Checkmark width={16} height={16} fill='white' />
              </div>
              <div
                className={styles.tagName}
                style={{ backgroundColor: tag.color }}
                
                onClick={e => {
                  e.stopPropagation()
                  handleTagToggle(tag.id, tag.name, tag.color)
                }}
              >
                <p className={styles.tagNameText}>{tag.name}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TagModal
