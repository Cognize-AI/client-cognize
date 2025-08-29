'use client'
import {
  Add,
  ArrowLeft,
  Dots,
  Email2,
  Lifecycle,
  Location,
  Mail,
  Pen,
  People,
  Phone,
  Phone2,
  Streak,
  Suitcase,
  Trash
} from '@/components/icons'
import styles from './page.module.scss'
import { useParams, useRouter } from 'next/navigation'
import { axios_instance } from '@/lib/axios'
import { useCardStore } from '@/provider/card-store-provider'
import { useEffect } from 'react'
import Image from 'next/image'

const Page = () => {
  const selectedCard = useCardStore(state => state.selectedCard)
  const setSelectedCard = useCardStore(state => state.setSelectedCard)

  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  if (!id) {
    return null
  }

  const fetchCard = async () => {
    axios_instance
      .get(`/card/${id}`)
      .then(response => {
        setSelectedCard(response?.data?.data)
        console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    fetchCard()
  }, [id])

  const handleMailClick = () => {
    window.location.href = `mailto:${selectedCard?.email}`
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.top_row}>
          <div
            className={styles.btn_back}
            onClick={() => {
              router.back()
            }}
          >
            <ArrowLeft width={20} height={24} stroke='#194EFF' fill='none' />
            <p>Go back</p>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.user}>
            <div className={styles.avatar}>
              {selectedCard?.image_url && (
                <Image
                  src={selectedCard?.image_url}
                  alt={selectedCard?.name}
                  className={styles.avatar}
                  width={36}
                  height={36}
                />
              )}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.name}>{selectedCard?.name}</p>
              <p className={styles.designation}>{selectedCard?.designation}</p>
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.icons} onClick={handleMailClick}>
              <Mail
                width={24}
                height={24}
                fill='#194EFF'
                className={styles.actionIcons}
              />
              <p className={styles.actionTitle}>Email</p>
            </div>
            <div className={styles.icons}>
              <Phone
                width={24}
                height={24}
                fill='#194EFF'
                className={styles.actionIcons}
              />
              <p className={styles.actionTitle}>Phone</p>
            </div>
            <div className={styles.icons}>
              <Streak
                width={24}
                height={24}
                fill='#194EFF'
                className={styles.actionIcons}
              />
              <p className={styles.actionTitle}>Enrich</p>
            </div>
            <div className={styles.icons}>
              <Dots
                width={24}
                height={24}
                fill='#194EFF'
                className={styles.actionIcons}
              />
              <p className={styles.actionTitle}>More</p>
            </div>
          </div>
        </div>

        <div className={styles.tags}>
          <div className={styles.tag} style={{ backgroundColor: '#F8BBD0' }}>
            <p className={styles.tagTitle}>{selectedCard?.list_name}</p>
          </div>

          <div className={styles.seprater}></div>
          {selectedCard?.tags?.map(tag => (
            <div
              key={tag.id}
              className={styles.tag}
              style={{ backgroundColor: tag.color }}
            >
              <p className={styles.tagTitle}>{tag.name}</p>
              <div className={styles.tagIcons}>
                <Pen width={16} height={16} fill='white' />
                <Trash width={16} height={16} fill='white' />
              </div>
            </div>
          ))}
          <div className={styles.addTag}>
            <Add width={16} height={16} fill='#194EFF' />
            <p className={styles.add}>Add tag...</p>
          </div>
        </div>

        <div className={styles.cardDetails}>
          <div className={styles.details} style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>Contact Information</p>
              <div className={styles.addNote}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add note...</p>
              </div>
            </div>
            <div className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Location
                    stroke='#3D3D3D'
                    width={20}
                    height={20}
                    fill='none'
                  />
                  <p className={styles.fieldTitle}>Location</p>
                </div>
                <input
                  className={styles.input}
                  placeholder='Add location'
                  type='text'
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Phone2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                  <p className={styles.fieldTitle}>Phone</p>
                </div>
                {selectedCard?.phone ? (
                  <input
                    className={styles.input}
                    value={selectedCard.phone}
                    readOnly
                  />
                ) : (
                  <input
                    className={styles.input}
                    placeholder='Add phone'
                    type='text'
                  />
                )}
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Email2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                  <p className={styles.fieldTitle}>Email</p>
                </div>
                {selectedCard?.email ? (
                  <input
                    className={styles.input}
                    value={selectedCard.email}
                    readOnly
                  />
                ) : (
                  <input
                    className={styles.input}
                    placeholder='Add email'
                    type='text'
                  />
                )}
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Lifecycle
                    stroke='#3D3D3D'
                    width={20}
                    height={20}
                    fill='none'
                  />
                  <p className={styles.fieldTitle}>Lifecycle</p>
                </div>
                <div
                  className={styles.tag}
                  style={{ backgroundColor: '#F8BBD0' }}
                >
                  <p className={styles.tagTitle}>{selectedCard?.list_name}</p>
                </div>
              </div>
              <div className={styles.row}>
                <input
                  type='text'
                  className={styles.input}
                  placeholder=' Field name...'
                />
                <input
                  type='text'
                  className={styles.input}
                  placeholder='Add value...'
                />
              </div>
            </div>
            <div className={styles.newField}>
              <div className={styles.addNewField}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add new field...</p>
              </div>
            </div>
          </div>

          <div className={styles.details} style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>Company Information</p>
              <div className={styles.addNote}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add note...</p>
              </div>
            </div>
            <div className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Suitcase
                    stroke='#3D3D3D'
                    width={20}
                    height={20}
                    fill='none'
                  />
                  <p className={styles.fieldTitle}>Company</p>
                </div>
                <input
                  className={styles.input}
                  placeholder='Add company'
                  type='text'
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <People stroke='#3D3D3D' width={20} height={20} fill='none' />
                  <p className={styles.fieldTitle}>Role</p>
                </div>
                {selectedCard?.designation ? (
                  <input
                    className={styles.input}
                    value={selectedCard.designation}
                    readOnly
                  />
                ) : (
                  <input
                    className={styles.input}
                    placeholder='Add role'
                    type='text'
                  />
                )}
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Location
                    stroke='#3D3D3D'
                    width={20}
                    height={20}
                    fill='none'
                  />
                  <p className={styles.fieldTitle}>Location</p>
                </div>
                <input
                  className={styles.input}
                  placeholder='Add location'
                  type='text'
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Phone2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                  <p className={styles.fieldTitle}>Phone</p>
                </div>
                <input
                  className={styles.input}
                  placeholder='Add phone'
                  type='text'
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <Email2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                  <p className={styles.fieldTitle}>Email</p>
                </div>
                <input
                  className={styles.input}
                  placeholder='Add email'
                  type='text'
                />
              </div>
              <div className={styles.row}>
                <input
                  type='text'
                  className={styles.input}
                  placeholder=' Field name...'
                />
                <input
                  type='text'
                  className={styles.input}
                  placeholder='Add value...'
                />
              </div>
            </div>
            <div className={styles.newField}>
              <div className={styles.addNewField}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add new field...</p>
              </div>
            </div>
          </div>

          <div className={styles.details} style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>Activity (8)</p>
              <div className={styles.addNote}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add note...</p>
              </div>
            </div>
            <div className={styles.newField}>
              <div className={styles.addNewField}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add new note...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page