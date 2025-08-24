
import { useRef, useState } from 'react'

import { useOutsideClickListener } from '@/hooks/useOutsideClickListener'

import { Tick } from '../icons'

import styles from "./AddInput.module.scss"

type AddInputProps = {
  color: string
  createTag: () => void
  name: string | number
  setTagOpen: React.Dispatch<React.SetStateAction<boolean | string | number>>
  newTagData: { name: string; color: string }
  setNewTagData: React.Dispatch<React.SetStateAction<{ name: string; color: string }>>
}

const AddInput = ({
  color,
  createTag,
  name,
  newTagData,
  setNewTagData,
  setTagOpen,
}: AddInputProps) => {
  const [hover, setHover] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClickListener(ref, () => {
    setTagOpen(false);
    setNewTagData({ name: '', color: '' });
  });

  return (
    <div ref={ref} style={{
      border: `1px solid ${color}`,
    }} className={styles.new_tag} >
      <input placeholder='New tag name' onKeyUp={(e) => {
        if (e.key === 'Enter') {
          createTag()
        }
      }} autoFocus type="text" value={name} onChange={(e) => setNewTagData({ ...newTagData, name: e.target.value })} />
      <div className={styles.icon} style={{
        background: hover ? color + '14' : undefined
      }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} >
        <Tick width={16} height={16} fill={color} onClick={createTag} />
      </div>
    </div>
  )
}

export default AddInput