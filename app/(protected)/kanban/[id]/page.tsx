'use client'

import {
  Add,
  ArrowLeft,
  Checkmark,
  Close,
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
  Trash,
  AddImage,
  Delete
} from '@/components/icons'
import styles from './page.module.scss'
import { useParams, useRouter } from 'next/navigation'
import { axios_instance } from '@/lib/axios'
import { useCardStore } from '@/provider/card-store-provider'
import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { CompanyData } from '@/types'
import Field from '@/ui/form/Field/Field'
import ActivityCard from '@/components/ActivityCard/ActivityCard'
import TagModal from '@/components/TagModal/TagModal'
import { useOutsideClickListener } from '@/hooks/useOutsideClickListener'
import { useTagsStore } from '@/provider/tags-store-provider'

const Page = () => {
  const userTags = useTagsStore(state => state.tags)
  const addTags = useTagsStore(state => state.addTags)
  const selectedCard = useCardStore(state => state.selectedCard)
  const setSelectedCard = useCardStore(state => state.setSelectedCard)

  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const [newContactFields, setNewContactFields] = useState<{
    show: boolean
    name: string
    value: string
  }>({
    show: false,
    name: '',
    value: ''
  })

  const [newCompanyFields, setNewCompanyFields] = useState<{
    show: boolean
    name: string
    value: string
  }>({
    show: false,
    name: '',
    value: ''
  })

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    designation: '',
    image_url: ''
  })
  const [uploading, setUploading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const [showAddNoteForm, setShowAddNoteForm] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  const [isTagSearchOpen, setIsTagSearchOpen] = useState(false)
  const [tagSearchQuery, setTagSearchQuery] = useState('')

  const tagModalRef = useRef<HTMLDivElement>(null)
  const menuModalRef = useRef<HTMLDivElement>(null)

  useOutsideClickListener(tagModalRef, () => {
    setIsTagSearchOpen(false)
  })

  useOutsideClickListener(menuModalRef, () => {
    setShowMoreMenu(false)
  })

  const fetchCard = useCallback(() => {
    if (!id) {
      return
    }
    axios_instance.get(`/card/${id}`).then(response => {
      setSelectedCard(response?.data?.data)
    })
  }, [id, setSelectedCard])

  const fetchAvailableTags = useCallback(() => {
    axios_instance
      .get('/tag')
      .then(response => {
        const tags = response?.data?.data?.tags
        addTags(Array.isArray(tags) ? tags : [])
      })
      .catch(error => {
        console.error('Failed to fetch tags:', error)
        addTags([])
      })
  }, [])
  const handleMailClick = () => {
    if (selectedCard?.email) {
      window.location.href = `mailto:${selectedCard.email}`
    }
  }

  const handleImageError = () => setImageError(true)

  const handleProfileDoubleClick = () => {
    if (!isEditingProfile) {
      setIsEditingProfile(true)
    }
  }

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      try {
        const base64data = reader.result
        const token = localStorage.getItem('token')
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64data })
        })
        if (!res.ok) throw new Error('Upload failed')
        const data = await res.json()
        if (!data.url) throw new Error('Upload response did not contain a URL')
        setEditedProfile(prev => ({ ...prev, image_url: data.url }))
        setImageError(false)
      } catch (err) {
        console.error('Upload failed:', err)
      } finally {
        setUploading(false)
      }
    }
    reader.onerror = () => {
      console.error('File reading failed')
      setUploading(false)
    }
  }

  const handleProfileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (!uploading) handleProfileSave()
    }
  }

  const handleProfileSave = async () => {
    if (uploading || !selectedCard) return

    const unchanged =
      editedProfile.name === selectedCard.name &&
      editedProfile.designation === selectedCard.designation &&
      editedProfile.image_url === selectedCard.image_url

    if (unchanged) {
      setIsEditingProfile(false)
      return
    }

    try {
      const data = {
        id: selectedCard.id,
        name: editedProfile.name,
        designation: editedProfile.designation,
        email: selectedCard.email,
        phone: selectedCard.phone,
        image_url: editedProfile.image_url,
        location: selectedCard.location,
        company_name: selectedCard.company.name,
        company_role: selectedCard.company.role,
        company_location: selectedCard.company.location,
        company_phone: selectedCard.company.phone,
        company_email: selectedCard.company.email
      }

      await axios_instance.put(`/card/details/${selectedCard.id}`, data)

      setSelectedCard({
        ...selectedCard,
        name: editedProfile.name,
        designation: editedProfile.designation,
        image_url: editedProfile.image_url
      })

      setIsEditingProfile(false)
    } catch (err) {
      console.error('Profile update failed:', err)
      setEditedProfile({
        name: selectedCard.name || '',
        designation: selectedCard.designation || '',
        image_url: selectedCard.image_url || ''
      })
    }
  }

  const handleDelete = async () => {
    setShowMoreMenu(false)
    try {
      const token = localStorage.getItem('token')
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card/${selectedCard?.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      router.back()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const toggleMoreMenu = () => setShowMoreMenu(prev => !prev)

  const handleAddNoteClick = () => {
    setShowAddNoteForm(true)
    setNoteContent('')
  }

  const handleCloseNote = () => {
    setShowAddNoteForm(false)
    setNoteContent('')
  }

  const handleSaveNote = async () => {
    if (!noteContent.trim() || !selectedCard || savingNote) return

    setSavingNote(true)
    try {
      await axios_instance.post('/activity/create', {
        card_id: selectedCard.id,
        text: noteContent.trim()
      })

      setShowAddNoteForm(false)
      setNoteContent('')
      fetchCard()
    } catch (err) {
      console.error('Failed to save note:', err)
    } finally {
      setSavingNote(false)
    }
  }

  const handleDeleteActivity = async (activityId: number) => {
    try {
      await axios_instance.delete(`/activity/${activityId}`)
      fetchCard()
    } catch (err) {
      console.error('Failed to delete activity:', err)
    }
  }

  const handleEditActivity = async (activityId: number, newContent: string) => {
    try {
      await axios_instance.put(`/activity/${activityId}`, {
        text: newContent
      })
      fetchCard()
    } catch (err) {
      console.error('Failed to update activity:', err)
      throw err
    }
  }

  // Tag management functions
  const addTagToCard = (
    tagID: number,
    cardID: number,
    onSuccess: () => void,
    onError: () => void
  ) => {
    if (!tagID || !cardID) return
    axios_instance
      .post('/tag/add-to-card', { tag_id: tagID, card_id: cardID })
      .then(onSuccess)
      .catch(err => {
        console.error('Add Tag Error:', err?.response?.data || err)
        onError()
      })
  }

  const removeTagFromCard = (
    tagID: number,
    cardID: number,
    onSuccess: () => void,
    onError: () => void
  ) => {
    if (!tagID || !cardID) return
    axios_instance
      .post('/tag/remove-from-card', { tag_id: tagID, card_id: cardID })
      .then(onSuccess)
      .catch(err => {
        console.error('Remove Tag Error:', err?.response?.data || err)
        onError()
      })
  }

  const handleTagToggle = (
    tagID: number,
    tagName: string,
    tagColor: string
  ) => {
    if (!selectedCard) return

    const currentTags = selectedCard.tags || []
    const isSelected = currentTags.some(t => t.name === tagName)

    if (isSelected) {
      removeTagFromCard(
        tagID,
        selectedCard.id,
        () => {
          const newTags = currentTags.filter(t => t.name !== tagName)
          setSelectedCard({ ...selectedCard, tags: newTags })
          fetchCard()
        },
        () => console.error('Failed to remove tag')
      )
    } else {
      addTagToCard(
        tagID,
        selectedCard.id,
        () => {
          const updatedTags = [
            ...currentTags,
            { id: tagID, name: tagName, color: tagColor }
          ]
          setSelectedCard({ ...selectedCard, tags: updatedTags })
          fetchCard()
        },
        () => console.error('Failed to add tag')
      )
    }
  }

  const filteredTags = Array.isArray(userTags)
    ? userTags.filter(t =>
        t.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
      )
    : []

  const handleSaveNewField = (type: 'CONTACT' | 'COMPANY') => {
    const fieldName =
      type === 'CONTACT' ? newContactFields.name : newCompanyFields.name
    const fieldValue =
      type === 'CONTACT' ? newContactFields.value : newCompanyFields.value

    if (!fieldName.trim() || !fieldValue.trim()) {
      return
    }
    axios_instance
      .post('/field/field-definitions', {
        type: type,
        field_name: fieldName
      })
      .then(response => {
        const field_id = response.data?.data?.id
        if (!field_id) {
          throw new Error('Could not get field ID from response.')
        }

        return axios_instance.post('/field/field-value', {
          field_id: field_id,
          card_id: parseInt(id, 10),
          value: fieldValue
        })
      })
      .then(response => {
        console.log('Field value saved successfully:', response)
        fetchCard()
        if (type === 'CONTACT') {
          setNewContactFields({ show: false, name: '', value: '' })
        } else {
          setNewCompanyFields({ show: false, name: '', value: '' })
        }
      })
      .catch(error => {
        console.error('Error saving new field:', error)
      })
  }

  const handleCardUpdate = () => {
    if (!selectedCard) {
      return
    }
    const data = {
      id: selectedCard.id,
      name: selectedCard.name,
      designation: selectedCard.designation,
      email: selectedCard.email,
      phone: selectedCard.phone,
      image_url: selectedCard.image_url,
      location: selectedCard.location,
      company_name: selectedCard.company.name,
      company_role: selectedCard.company.role,
      company_location: selectedCard.company.location,
      company_phone: selectedCard.company.phone,
      company_email: selectedCard.company.email
    }

    axios_instance.put(`/card/details/${selectedCard.id}`, data).then(() => {
      fetchCard()
    })
  }

  const handleContactCustomFieldUpdate = (
    card_id: number,
    field_def_id: number,
    value: string
  ) => {
    if (!card_id || !field_def_id) {
      return
    }

    axios_instance
      .post('/field/field-value', {
        field_id: field_def_id,
        card_id: card_id,
        value: value
      })
      .then(() => {
        fetchCard()
      })
  }

  const companyFields = [
    {
      key: 'name',
      label: 'Company',
      placeholder: 'Add company',
      Icon: Suitcase
    },
    { key: 'role', label: 'Role', placeholder: 'Add role', Icon: People },
    {
      key: 'location',
      label: 'Location',
      placeholder: 'Add location',
      Icon: Location
    },
    { key: 'phone', label: 'Phone', placeholder: 'Add phone', Icon: Phone2 },
    { key: 'email', label: 'Email', placeholder: 'Add email', Icon: Email2 }
  ]

  useEffect(() => {
    fetchCard()
  }, [fetchCard])

  useEffect(() => {
    fetchAvailableTags()
  }, [fetchAvailableTags])

  useEffect(() => {
    if (selectedCard && !isEditingProfile) {
      setEditedProfile({
        name: selectedCard.name || '',
        designation: selectedCard.designation || '',
        image_url: selectedCard.image_url || ''
      })
      setImageError(false)
    }
  }, [selectedCard, isEditingProfile])

  if (!selectedCard) {
    return (
      <div className={styles.page}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinnerOuter}></div>
          <p className={styles.spinnerText}>Organizing your pipeline...</p>
          <p className={styles.spinnerSubtext}>
            Stay with us, precision takes a moment.
          </p>
        </div>
      </div>
    )
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
          <div
            className={`${styles.user} ${
              isEditingProfile ? styles.editing : ''
            }`}
            onDoubleClick={handleProfileDoubleClick}
          >
            <div className={styles.avatar}>
              {isEditingProfile ? (
                <label
                  htmlFor={`profile-image-upload-${selectedCard.id}`}
                  className={`${styles.avatarUpload} ${
                    uploading ? styles.uploading : ''
                  }`}
                >
                  {uploading ? (
                    <div className={styles.uploadingSpinner}></div>
                  ) : editedProfile.image_url && !imageError ? (
                    <Image
                      src={editedProfile.image_url}
                      alt={editedProfile.name}
                      className={styles.avatar}
                      width={48}
                      height={48}
                      onError={handleImageError}
                      quality={100}
                    />
                  ) : (
                    <AddImage width={24} height={24} fill='#BCBBB8' />
                  )}
                  <input
                    id={`profile-image-upload-${selectedCard.id}`}
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    className={styles.hiddenInput}
                    disabled={uploading}
                  />
                </label>
              ) : editedProfile.image_url && !imageError ? (
                <Image
                  src={editedProfile.image_url}
                  alt={editedProfile.name}
                  className={styles.avatar}
                  width={48}
                  height={48}
                  onError={handleImageError}
                />
              ) : (
                <AddImage width={24} height={24} fill='#BCBBB8' />
              )}
            </div>
            <div className={styles.userDetails}>
              {isEditingProfile ? (
                <>
                  <input
                    name='name'
                    placeholder='name...'
                    className={`${styles.name} ${styles.editableInput}`}
                    value={editedProfile.name}
                    onChange={handleProfileInputChange}
                    onKeyDown={handleProfileKeyDown}
                    disabled={uploading}
                  />
                  <input
                    name='designation'
                    placeholder='designation...'
                    className={`${styles.designation} ${styles.editableInput}`}
                    value={editedProfile.designation}
                    onChange={handleProfileInputChange}
                    onKeyDown={handleProfileKeyDown}
                    disabled={uploading}
                  />
                </>
              ) : (
                <>
                  <p className={styles.name}>
                    {editedProfile.name || (
                      <span className={styles.placeholder}>name...</span>
                    )}
                  </p>
                  <p className={styles.designation}>
                    {editedProfile.designation || (
                      <span className={styles.placeholder}>designation...</span>
                    )}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className={styles.actions}>
            <div className={styles.icons} onClick={handleMailClick}>
              <div className={styles.icon_wrapper}>
                <div className={styles.icon_unif}>
                  <Mail
                    width={20}
                    height={16}
                    fill='#194EFF'
                    className={styles.actionIcons}
                  />
                </div>
              </div>
              <p className={styles.actionTitle}>Email</p>
            </div>
            <div className={styles.icons}>
              <div className={styles.icon_wrapper}>
                <div className={styles.icon_unif}>
                  <Phone
                    width={24}
                    height={24}
                    fill='#194EFF'
                    className={styles.actionIcons}
                  />
                </div>
              </div>
              <p className={styles.actionTitle}>Phone</p>
            </div>
            <div className={styles.icons}>
              <div className={styles.icon_wrapper}>
                <div className={styles.icon_unif}>
                  <Streak
                    width={24}
                    height={24}
                    fill='#194EFF'
                    className={styles.actionIcons}
                  />
                </div>
              </div>
              <p className={styles.actionTitle}>Enrich</p>
            </div>
            <div
              className={`${styles.icons} ${
                isEditingProfile && uploading ? styles.disabled : ''
              }`}
              onClick={e => {
                e.stopPropagation()
                if (isEditingProfile && !uploading) {
                  handleProfileSave()
                } else if (!isEditingProfile) {
                  toggleMoreMenu()
                }
              }}
            >
              <div className={styles.icon_wrapper}>
                <div className={styles.icon_unif}>
                  <Dots
                    width={24}
                    height={24}
                    fill='#194EFF'
                    className={styles.actionIcons}
                  />
                </div>
              </div>
              <p className={styles.actionTitle}>More</p>

              {showMoreMenu && !isEditingProfile && (
                <div
                  className={styles.moreMenu}
                  onClick={e => e.stopPropagation()}
                >
                  <div
                    className={styles.deleteButton}
                    onClick={e => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                  >
                    <div className={styles.delete}>
                      <Delete width={16} height={16} fill='#FB7285' />
                    </div>
                    <div className={styles.deleteText}>Delete</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.tags}>
          <div
            className={styles.tag}
            style={{ backgroundColor: selectedCard?.list_color }}
          >
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
                <Trash
                  width={16}
                  height={16}
                  fill='white'
                  onClick={e => {
                    e.stopPropagation()
                    handleTagToggle(tag.id, tag.name, tag.color)
                  }}
                />
              </div>
            </div>
          ))}

          <div
            className={styles.addTag}
            onClick={e => {
              e.stopPropagation()
              setIsTagSearchOpen(prev => !prev)
            }}
          >
            <Add width={16} height={16} fill='#194EFF' />
            <p className={styles.add}>Add tag...</p>
          </div>

          {isTagSearchOpen && (
            <div className={styles.tagModal}>
              <TagModal
                ref={tagModalRef}
                tagSearchQuery={tagSearchQuery}
                setTagSearchQuery={setTagSearchQuery}
                filteredTags={filteredTags}
                editedCard={selectedCard?.tags || []}
                handleTagToggle={handleTagToggle}
              />
            </div>
          )}
        </div>
        <div className={styles.cardDetails}>
          <div className={styles.details}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>Contact Information</p>
            </div>
            <div className={styles.form}>
              <Field
                label='Location'
                placeholder='Add here...'
                value={selectedCard?.location}
                onChange={value => {
                  setSelectedCard({
                    ...selectedCard,
                    location: value
                  })
                }}
                onEnter={() => {
                  handleCardUpdate()
                }}
                labelIcon={
                  <Location
                    stroke='#3D3D3D'
                    width={20}
                    height={20}
                    fill='none'
                  />
                }
              />
              <Field
                label='Phone'
                placeholder='Add here...'
                value={selectedCard?.phone}
                onChange={value => {
                  setSelectedCard({
                    ...selectedCard,
                    phone: value
                  })
                }}
                onEnter={() => {
                  handleCardUpdate()
                }}
                labelIcon={
                  <Phone2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                }
              />
              <Field
                label='Email'
                placeholder='Add here...'
                value={selectedCard?.email}
                onChange={value => {
                  setSelectedCard({
                    ...selectedCard,
                    email: value
                  })
                }}
                onEnter={() => {
                  handleCardUpdate()
                }}
                labelIcon={
                  <Email2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                }
              />
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
                  style={{ backgroundColor: selectedCard?.list_color }}
                >
                  <p className={styles.tagTitle}>{selectedCard?.list_name}</p>
                </div>
              </div>
              {selectedCard?.additional_contact?.map(contact => (
                <Field
                  key={contact.id}
                  label={contact.name}
                  placeholder={`Add ${contact.name}`}
                  value={contact.value}
                  onChange={value => {
                    setSelectedCard({
                      ...selectedCard,
                      additional_contact: selectedCard.additional_contact.map(
                        c =>
                          c.name === contact.name ? { ...c, value: value } : c
                      )
                    })
                  }}
                  onEnter={() => {
                    handleContactCustomFieldUpdate(
                      selectedCard.id,
                      contact.id,
                      contact.value
                    )
                  }}
                />
              ))}
              <div>
                <div className={styles.newField}>
                  {!newContactFields.show ? (
                    <div
                      className={styles.addNewField}
                      onClick={() =>
                        setNewContactFields(prev => ({
                          ...prev,
                          show: true
                        }))
                      }
                    >
                      <Add width={16} height={16} fill='#194EFF' />
                      <p className={styles.add}>Add new field...</p>
                    </div>
                  ) : (
                    <div
                      className={styles.row}
                      style={{ alignItems: 'center' }}
                    >
                      <input
                        type='text'
                        className={styles.input}
                        placeholder='Field name...'
                        value={newContactFields.name}
                        onChange={e =>
                          setNewContactFields(prev => ({
                            ...prev,
                            name: e.target.value
                          }))
                        }
                      />
                      <input
                        type='text'
                        className={styles.input}
                        placeholder='Add value...'
                        value={newContactFields.value}
                        onChange={e =>
                          setNewContactFields(prev => ({
                            ...prev,
                            value: e.target.value
                          }))
                        }
                        onKeyUp={event => {
                          if (event.key === 'Enter') {
                            handleSaveNewField('CONTACT')
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>Company Information</p>
            </div>
            <div className={styles.form}>
              {companyFields.map(field => (
                <Field
                  key={field.key}
                  label={field.label}
                  placeholder={`Add here...`}
                  value={selectedCard.company[field.key as keyof CompanyData]}
                  onChange={value => {
                    setSelectedCard({
                      ...selectedCard,
                      company: {
                        ...selectedCard.company,
                        [field.key as keyof CompanyData]: value
                      }
                    })
                  }}
                  onEnter={() => {
                    handleCardUpdate()
                  }}
                  labelIcon={
                    <field.Icon
                      stroke='#3D3D3D'
                      width={20}
                      height={20}
                      fill='none'
                    />
                  }
                />
              ))}
              {selectedCard?.additional_company?.map(contact => (
                <Field
                  key={contact.id}
                  label={contact.name}
                  placeholder={`Add here...`}
                  value={contact.value}
                  onChange={value => {
                    setSelectedCard({
                      ...selectedCard,
                      additional_company: selectedCard.additional_company.map(
                        c =>
                          c.name === contact.name ? { ...c, value: value } : c
                      )
                    })
                  }}
                  onEnter={() => {
                    handleContactCustomFieldUpdate(
                      selectedCard.id,
                      contact.id,
                      contact.value
                    )
                  }}
                />
              ))}
              <div>
                <div className={styles.newField}>
                  {!newCompanyFields.show ? (
                    <div
                      className={styles.addNewField}
                      onClick={() =>
                        setNewCompanyFields(prev => ({
                          ...prev,
                          show: true
                        }))
                      }
                    >
                      <Add width={16} height={16} fill='#194EFF' />
                      <p className={styles.add}>Add new field...</p>
                    </div>
                  ) : (
                    <div
                      className={styles.row}
                      style={{ alignItems: 'center' }}
                    >
                      <input
                        type='text'
                        className={styles.input}
                        placeholder='Field name...'
                        value={newCompanyFields.name}
                        onChange={e =>
                          setNewCompanyFields(prev => ({
                            ...prev,
                            name: e.target.value
                          }))
                        }
                      />
                      <input
                        type='text'
                        className={styles.input}
                        placeholder='Add value...'
                        value={newCompanyFields.value}
                        onChange={e =>
                          setNewCompanyFields(prev => ({
                            ...prev,
                            value: e.target.value
                          }))
                        }
                        onKeyUp={e => {
                          if (e.key === 'Enter') {
                            handleSaveNewField('COMPANY')
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>
                Activity
                {selectedCard?.activity?.length > 0
                  ? ` (${selectedCard.activity.length})`
                  : ''}
              </p>
              <div className={styles.addNote} onClick={handleAddNoteClick}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add note...</p>
              </div>
            </div>
            <div className={styles.newActivity}>
              {showAddNoteForm && (
                <div className={styles.addNoteForm}>
                  <textarea
                    className={styles.addNoteInput}
                    placeholder='Add your note...'
                    value={noteContent}
                    onChange={e => setNoteContent(e.target.value)}
                  />
                  <div className={styles.saveContainer}>
                    <div
                      className={styles.cancelAction}
                      onClick={handleCloseNote}
                    >
                      <Close width={16} height={16} fill='#3D3D3D' />
                    </div>
                    <div
                      className={`${styles.saveAction} ${
                        savingNote || !noteContent.trim() ? styles.disabled : ''
                      }`}
                      onClick={() => {
                        if (!savingNote && noteContent.trim()) {
                          handleSaveNote()
                        }
                      }}
                    >
                      <Checkmark width={16} height={16} fill='white' />
                    </div>
                  </div>
                </div>
              )}
              {selectedCard?.activity?.map(activity => {
                return (
                  <ActivityCard
                    key={activity.id}
                    id={activity.id}
                    content={activity.content}
                    date={activity.created_at}
                    onDelete={handleDeleteActivity}
                    onEdit={handleEditActivity}
                  />
                )
              })}
              <div>
                {!showAddNoteForm && (
                  <div
                    className={styles.addNewField}
                    onClick={handleAddNoteClick}
                  >
                    <Add width={16} height={16} fill='#194EFF' />
                    <p className={styles.add}>Add new note...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
