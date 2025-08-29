'use client'

import {
  Add,
  ArrowLeft,
  Checkmark,
  Close,
  Dots,
  Edit,
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
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { CompanyData } from '@/types'
import Field from '@/ui/form/Field/Field'


const Page = () => {
  const selectedCard = useCardStore(state => state.selectedCard)
  const setSelectedCard = useCardStore(state => state.setSelectedCard)

  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const [showContactFieldForm, setShowContactFieldForm] = useState(false)
  const [newContactFieldName, setNewContactFieldName] = useState('')
  const [newContactFieldValue, setNewContactFieldValue] = useState('')

  const [showCompanyFieldForm, setShowCompanyFieldForm] = useState(false)
  const [newCompanyFieldName, setNewCompanyFieldName] = useState('')
  const [newCompanyFieldValue, setNewCompanyFieldValue] = useState('')

  const fetchCard = useCallback(() => {
    if (!id) {
      return
    }
    axios_instance
      .get(`/card/${id}`)
      .then(response => {
        setSelectedCard(response?.data?.data)
        console.log(response?.data?.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [id, setSelectedCard])

  const handleMailClick = () => {
    if (selectedCard?.email) {
      window.location.href = `mailto:${selectedCard.email}`
    }
  }

  const handleSaveNewField = (type: 'CONTACT' | 'COMPANY') => {
    const fieldName =
      type === 'CONTACT' ? newContactFieldName : newCompanyFieldName
    const fieldValue =
      type === 'CONTACT' ? newContactFieldValue : newCompanyFieldValue

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
          setNewContactFieldName('')
          setNewContactFieldValue('')
          setShowContactFieldForm(false)
        } else {
          setNewCompanyFieldName('')
          setNewCompanyFieldValue('')
          setShowCompanyFieldForm(false)
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

    axios_instance.put(`/card/details/${selectedCard.id}`, data).then(response => {
      fetchCard()
    })
  }

  const handleContactCustomFieldUpdate = (card_id: number, field_def_id: number, value: string) => {
    if (!card_id || !field_def_id) {
      return
    }

    axios_instance.post('/field/field-value', {
      field_id: field_def_id,
      card_id: card_id,
      value: value
    }).then(() => {
      fetchCard()
    })
  }

  const companyFields = [
    { key: 'name', label: 'Company', placeholder: 'Add company', Icon: Suitcase },
    { key: 'role', label: 'Role', placeholder: 'Add role', Icon: People },
    { key: 'location', label: 'Location', placeholder: 'Add location', Icon: Location },
    { key: 'phone', label: 'Phone', placeholder: 'Add phone', Icon: Phone2 },
    { key: 'email', label: 'Email', placeholder: 'Add email', Icon: Email2 }
  ]

  useEffect(() => {
    fetchCard()
  }, [fetchCard])


  if (!selectedCard) {
    return <div>Loading...</div>
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
                  src={selectedCard.image_url}
                  alt={selectedCard.name}
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
            <div className={styles.icons}>
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
          {/* CONTACT INFORMATION */}
          <div className={styles.details}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>Contact Information</p>
              <div className={styles.addNote}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add note...</p>
              </div>
            </div>
            <div className={styles.form}>
              <Field
                label="Location"
                placeholder='Add location'
                value={selectedCard?.location}
                onChange={(value) => {
                  setSelectedCard({
                    ...selectedCard,
                    location: value,
                  });
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
                label="Phone"
                placeholder='Add Phone'
                value={selectedCard?.phone}
                onChange={(value) => {
                  setSelectedCard({
                    ...selectedCard,
                    phone: value,
                  });
                }}
                onEnter={() => {
                  handleCardUpdate()
                }}
                labelIcon={
                  <Phone2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                }
              />
              <Field
                label="Email"
                placeholder='Add Email'
                value={selectedCard?.email}
                onChange={(value) => {
                  setSelectedCard({
                    ...selectedCard,
                    email: value,
                  });
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
                // <div className={styles.row} key={contact.name}>
                //   <div className={styles.field}>
                //     <p className={styles.fieldTitle}>{contact.name}</p>
                //   </div>
                //   <input
                //     className={styles.input}
                //     value={contact.value}
                //     readOnly
                //   />
                // </div>
                <Field
                  label={contact.name}
                  placeholder={`Add ${contact.name}`}
                  value={contact.value}
                  onChange={(value) => {
                    setSelectedCard({
                      ...selectedCard,
                      additional_contact: selectedCard.additional_contact.map((c) =>
                        c.name === contact.name ? { ...c, value: value } : c
                      ),
                    });
                  }}
                  onEnter={() => {
                    handleContactCustomFieldUpdate(
                      selectedCard.id,
                      contact.id,
                      contact.value
                    )
                  }}
                  labelIcon={
                    <Email2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                  }
                />
              ))}
            </div>
            <div className={styles.newField}>
              {!showContactFieldForm ? (
                <div
                  className={styles.addNewField}
                  onClick={() => setShowContactFieldForm(true)}
                >
                  <Add width={16} height={16} fill='#194EFF' />
                  <p className={styles.add}>Add new field...</p>
                </div>
              ) : (
                <div className={styles.row} style={{ alignItems: 'center' }}>
                  <input
                    type='text'
                    className={styles.input}
                    placeholder='Field name...'
                    value={newContactFieldName}
                    onChange={e => setNewContactFieldName(e.target.value)}
                  />
                  <input
                    type='text'
                    className={styles.input}
                    placeholder='Add value...'
                    value={newContactFieldValue}
                    onChange={e => setNewContactFieldValue(e.target.value)}
                    onKeyUp={() => handleSaveNewField('CONTACT')}
                  />
                </div>
              )}
            </div>
          </div>

          {/* COMPANY INFORMATION */}
          <div className={styles.details}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>Company Information</p>
              <div className={styles.addNote}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add note...</p>
              </div>
            </div>
            <div className={styles.form}>
              {companyFields.map(field => (
                // <div className={styles.row} key={field.key}>
                //   <div className={styles.field}>
                //     <field.Icon
                //       stroke='#3D3D3D'
                //       width={20}
                //       height={20}
                //       fill='none'
                //     />
                //     <p className={styles.fieldTitle}>{field.label}</p>
                //   </div>
                //   {selectedCard?.company?.[field.key as keyof CompanyData] ? (
                //     <input
                //       className={styles.input}
                //       type='string'
                //       value={
                //         selectedCard.company[field.key as keyof CompanyData]
                //       }
                //       readOnly
                //     />
                //   ) : (
                //     <input
                //       className={styles.input}
                //       placeholder={field.placeholder}
                //       type='text'
                //     />
                //   )}
                // </div>
                <Field
                  label={field.label}
                  placeholder={`Add ${field.label.toLowerCase()}`}
                  value={selectedCard.company[field.key as keyof CompanyData]}
                  onChange={(value) => {
                    setSelectedCard({
                      ...selectedCard,
                      company: {
                        ...selectedCard.company,
                        [field.key as keyof CompanyData]: value,
                      },
                    });
                  }}
                  onEnter={() => {
                    handleCardUpdate()
                  }}
                  labelIcon={
                    <field.Icon
                      stroke='#3D3D3D'
                      width={20}
                      height={20}
                      fill='none' />
                  }
                />
              ))}
              {selectedCard?.additional_company?.map(contact => (
                // <div className={styles.row} key={contact.name}>
                //   <div className={styles.field}>
                //     <p className={styles.fieldTitle}>{contact.name}</p>
                //   </div>
                //   <input
                //     className={styles.input}
                //     value={contact.value}
                //     placeholder={`Add ${contact.name.toLowerCase()}`}
                //     onChange={(e) => {
                //       const newValue = e.target.value;
                //       setSelectedCard({
                //         ...selectedCard,
                //         additional_company: selectedCard.additional_company.map((c) =>
                //           c.name === contact.name ? { ...c, value: newValue } : c
                //         ),
                //       });
                //     }}
                //   />
                // </div>
                <Field
                  label={contact.name}
                  placeholder={`Add ${contact.name.toLowerCase()}`}
                  value={contact.value}
                  onChange={(value) => {
                    setSelectedCard({
                      ...selectedCard,
                      additional_company: selectedCard.additional_company.map((c) =>
                        c.name === contact.name ? { ...c, value: value } : c
                      ),
                    });
                  }}
                  onEnter={() => {
                    handleContactCustomFieldUpdate(
                      selectedCard.id,
                      contact.id,
                      contact.value
                    )
                  }}
                  labelIcon={
                    <Email2 stroke='#3D3D3D' width={20} height={20} fill='none' />
                  }
                />
              ))}
            </div>
            <div className={styles.newField}>
              {!showCompanyFieldForm ? (
                <div
                  className={styles.addNewField}
                  onClick={() => setShowCompanyFieldForm(true)}
                >
                  <Add width={16} height={16} fill='#194EFF' />
                  <p className={styles.add}>Add new field...</p>
                </div>
              ) : (
                <div className={styles.row} style={{ alignItems: 'center' }}>
                  <input
                    type='text'
                    className={styles.input}
                    placeholder='Field name...'
                    value={newCompanyFieldName}
                    onChange={e => setNewCompanyFieldName(e.target.value)}
                  />
                  <input
                    type='text'
                    className={styles.input}
                    placeholder='Add value...'
                    value={newCompanyFieldValue}
                    onChange={e => setNewCompanyFieldValue(e.target.value)}
                    onKeyUp={() => handleSaveNewField('COMPANY')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.detailHeader}>
              <p className={styles.detailTitle}>Activity (8)</p>
              <div className={styles.addNote}>
                <Add width={16} height={16} fill='#194EFF' />
                <p className={styles.add}>Add note...</p>
              </div>
            </div>
            <div className={styles.newField}>
              <div className={styles.addNoteForm}>
                <textarea className={styles.addNoteInput} />
                <div className={styles.saveContainer}>
                  <Close width={20} height={20} fill='#3D3D3D' />
                  <div className={styles.save}>
                    <Checkmark width={20} height={20} fill='white' />
                    <p className={styles.saveButton}>Save</p>
                  </div>
                </div>
              </div>
              <div className={styles.addNoteForm}>
                <p className={styles.note}>
                  {' '}
                  Yes, that’s a great idea, let’s try out soon
                </p>
                <div className={styles.noteOptions}>
                  <div className={styles.date}>Created on Aug 14, 2025</div>
                  <Trash width={20} height={20} fill='#F77272' />
                  <Edit width={20} height={20} fill='#194EFF' />
                </div>
              </div>
            </div>
            <div className={styles.addNewField}>
              <Add width={16} height={16} fill='#194EFF' />
              <p className={styles.add}>Add new note...</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page