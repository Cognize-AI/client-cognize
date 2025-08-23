"use client"

import { ArrowLeft, Pen, Tag, Trash } from '@/components/icons'
import styles from './page.module.scss'
import { useEffect } from 'react'
import { useTagsStore } from '@/provider/tags-store-provider'
import { axios_instance } from '@/lib/axios'

const page = () => {
  // const tags = useTagsStore((state) => state.tags)
  const groupedTags = useTagsStore((state) => state.groupedTags)
  const addTags = useTagsStore((state) => state.addTags)

  const fetchTags = async () => {
    axios_instance.get('/tag/')
      .then(response => {
        console.log(response.data?.data?.tags)
        addTags(response.data?.data?.tags)
      })
      .catch(error => {
        // Handle error
      });
  }

  useEffect(() => {
    fetchTags()
  }, [])
  return (
    <div className={styles.main}>
      <div className={styles.top_row}>
        <div className={styles.btn_back}>
          <ArrowLeft width={20} height={20} stroke='#194EFF' fill='none' />
          <p>Go back</p>
        </div>
      </div>
      <div className={styles.heading}>
        Tag management
      </div>
      <div className={styles.tags}>
        {
          Object.keys(groupedTags)?.map((key) => {
            return <div className={styles.tag_row} key={key} style={{ background: key+"14" }}>
              <div className={styles.icon} style={{ background: key+"1F" }}>
                <Tag width={24} height={24} fill='#00020F' />
              </div>
              <div className={styles.ta_gs_row}>
                  {
                    groupedTags[key]?.map((tag) => (
                      <div className={styles.tag} style={{ background: key }} key={tag.id}>
                        <p>
                          {tag.name}
                        </p>
                        <Pen className={styles.icons} width={16} height={16} fill='white' />
                        <Trash className={styles.icons} width={16} height={16} fill='white' />
                      </div>
                    ))
                  }
                </div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default page