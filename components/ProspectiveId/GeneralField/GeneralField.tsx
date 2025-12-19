import { useState, useMemo, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCardStore } from "@/provider/card-store-provider";
import { axios_instance } from "@/lib/axios";
import Field from "@/ui/form/Field/Field";
import ActivityCard from "@/components/ActivityCard/ActivityCard";
import {
  Location,
  Phone2,
  Email2,
  Lifecycle,
  Suitcase,
  People,
  Add,
  Close,
  Checkmark,
} from "@/components/icons";
import styles from "./GeneralField.module.scss";
import { CompanyData } from "@/types";

type GeneralFieldProps = {
  fetchCard: () => void;
};

const GeneralField = ({ fetchCard }: GeneralFieldProps) => {
  const { id } = useParams<{ id: string }>();
  const selectedCard = useCardStore((state) => state.selectedCard);
  const setSelectedCard = useCardStore((state) => state.setSelectedCard);

  // Add ref for auto-scroll functionality
  const activityContainerRef = useRef<HTMLDivElement>(null);

  const [newContactFields, setNewContactFields] = useState({
    show: false,
    name: "",
    value: "",
  });
  const [newCompanyFields, setNewCompanyFields] = useState({
    show: false,
    name: "",
    value: "",
  });
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Auto-scroll when showAddNoteForm becomes true
  useEffect(() => {
    if (showAddNoteForm && activityContainerRef.current) {
      setTimeout(() => {
        activityContainerRef.current?.scrollTo({
          top: activityContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [showAddNoteForm]);

  const handleAddNoteClick = () => {
    setShowAddNoteForm(true);
    setNoteContent("");
  };

  const handleCloseNote = () => {
    setShowAddNoteForm(false);
    setNoteContent("");
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim() || !selectedCard || savingNote) return;

    setSavingNote(true);
    try {
      await axios_instance.post("/activity/create", {
        card_id: selectedCard.id,
        text: noteContent.trim(),
      });
      setShowAddNoteForm(false);
      setNoteContent("");
      fetchCard();
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveNewField = (type: "CONTACT" | "COMPANY") => {
    const fieldName =
      type === "CONTACT" ? newContactFields.name : newCompanyFields.name;
    const fieldValue =
      type === "CONTACT" ? newContactFields.value : newCompanyFields.value;
    axios_instance
      .post("/field/field-definitions", {
        type: type,
        field_name: fieldName,
      })
      .then((response) => {
        const field_id = response.data?.data?.id;
        if (!field_id) {
          throw new Error("Could not get field ID from response.");
        }

        return axios_instance.post("/field/field-value", {
          field_id: field_id,
          card_id: parseInt(id, 10),
          value: fieldValue,
        });
      })
      .then(() => {
        fetchCard();
        if (type === "CONTACT") {
          setNewContactFields({ show: false, name: "", value: "" });
        } else {
          setNewCompanyFields({ show: false, name: "", value: "" });
        }
      })
      .catch((error) => {
        console.error("Error saving new field:", error);
      });
  };

  const handleCardUpdate = () => {
    if (!selectedCard) {
      return;
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
      company_email: selectedCard.company.email,
    };

    axios_instance
      .put(`/card/details/${selectedCard.id}`, data)
      .then(() => {
        fetchCard();
      })
      .catch((err) => {
        console.error("Failed to update card details:", err);
      });
  };

  const handleContactCustomFieldUpdate = (
    card_id: number,
    field_def_id: number,
    value: string,
  ) => {
    if (!card_id || !field_def_id) {
      return;
    }

    axios_instance
      .post("/field/field-value", {
        field_id: field_def_id,
        card_id: card_id,
        value: value,
      })
      .then(() => {
        fetchCard();
      })
      .catch((err) => {
        console.error("Failed to update custom field:", err);
      });
  };

  const handleDeleteActivity = async (activityId: number) => {
    try {
      await axios_instance.delete(`/activity/${activityId}`);
      fetchCard();
    } catch (err) {
      console.error("Failed to delete activity:", err);
    }
  };

  const handleEditActivity = async (activityId: number, newContent: string) => {
    try {
      await axios_instance.put(`/activity/${activityId}`, {
        text: newContent,
      });
      fetchCard();
    } catch (err) {
      console.error("Failed to update activity:", err);
      throw err;
    }
  };

  const companyFields = [
    {
      key: "name",
      label: "Company",
      placeholder: "Add company",
      Icon: Suitcase,
    },
    { key: "role", label: "Role", placeholder: "Add role", Icon: People },
    {
      key: "location",
      label: "Location",
      placeholder: "Add location",
      Icon: Location,
    },
    { key: "phone", label: "Phone", placeholder: "Add phone", Icon: Phone2 },
    { key: "email", label: "Email", placeholder: "Add email", Icon: Email2 },
  ];

  const sortedActivities = useMemo(() => {
    if (!selectedCard?.activity) {
      return [];
    }
    return [...selectedCard.activity].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [selectedCard?.activity]);

  if (!selectedCard) return null;

  return (
    <div className={styles.cardDetails}>
      <div className={styles.details}>
        <div className={styles.detailHeader}>
          <p className={styles.detailTitle}>Contact Information</p>
        </div>
        <div className={styles.form}>
          <Field
            label="Location"
            placeholder="Add here..."
            value={selectedCard?.location || ""}
            onChange={(value) => {
              setSelectedCard({ ...selectedCard, location: value });
            }}
            onEnter={handleCardUpdate}
            labelIcon={
              <Location stroke="#3D3D3D" width={20} height={20} fill="none" />
            }
          />
          <Field
            label="Phone"
            placeholder="Add here..."
            value={selectedCard?.phone || ""}
            onChange={(value) => {
              setSelectedCard({ ...selectedCard, phone: value });
            }}
            onEnter={handleCardUpdate}
            labelIcon={
              <Phone2 stroke="#3D3D3D" width={20} height={20} fill="none" />
            }
          />
          <Field
            label="Email"
            placeholder="Add here..."
            value={selectedCard?.email || ""}
            onChange={(value) => {
              setSelectedCard({ ...selectedCard, email: value });
            }}
            onEnter={handleCardUpdate}
            labelIcon={
              <Email2 stroke="#3D3D3D" width={20} height={20} fill="none" />
            }
          />
          <div className={styles.row}>
            <div className={styles.field}>
              <Lifecycle stroke="#3D3D3D" width={20} height={20} fill="none" />
              <p className={styles.fieldTitle}>Lifecycle</p>
            </div>
            <div
              className={styles.tag}
              style={{ backgroundColor: selectedCard?.list_color }}
            >
              <p className={styles.tagTitle}>{selectedCard?.list_name}</p>
            </div>
          </div>
          {selectedCard?.additional_contact?.map((contact) => (
            <Field
              key={contact.id}
              label={contact.name}
              placeholder="Add here..."
              value={contact.value}
              onChange={(value) => {
                const updatedContacts = selectedCard.additional_contact.map(
                  (c) => (c.id === contact.id ? { ...c, value } : c),
                );
                setSelectedCard({
                  ...selectedCard,
                  additional_contact: updatedContacts,
                });
              }}
              onEnter={() =>
                handleContactCustomFieldUpdate(
                  selectedCard.id,
                  contact.id,
                  contact.value,
                )
              }
            />
          ))}
          <div className={styles.newField}>
            {!newContactFields.show ? (
              <div
                className={styles.addNewField}
                onClick={() =>
                  setNewContactFields((prev) => ({ ...prev, show: true }))
                }
              >
                <Add width={16} height={16} fill="#194EFF" />
                <p className={styles.add}>Add new field...</p>
              </div>
            ) : (
              <div className={styles.row} style={{ alignItems: "center" }}>
                <input
                  type="text"
                  className={styles.input_name}
                  placeholder="Field name..."
                  value={newContactFields.name}
                  onChange={(e) =>
                    setNewContactFields((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Add value..."
                  value={newContactFields.value}
                  onChange={(e) =>
                    setNewContactFields((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  onKeyUp={(event) => {
                    if (event.key === "Enter") handleSaveNewField("CONTACT");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.detailHeader}>
          <p className={styles.detailTitle}>Company Information</p>
        </div>
        <div className={styles.form}>
          {companyFields.map((field) => (
            <Field
              key={field.key}
              label={field.label}
              placeholder="Add here..."
              value={selectedCard.company[field.key as keyof CompanyData] || ""}
              onChange={(value) => {
                setSelectedCard({
                  ...selectedCard,
                  company: {
                    ...selectedCard.company,
                    [field.key as keyof CompanyData]: value,
                  },
                });
              }}
              onEnter={handleCardUpdate}
              labelIcon={
                <field.Icon
                  stroke="#3D3D3D"
                  width={20}
                  height={20}
                  fill="none"
                />
              }
            />
          ))}
          {selectedCard?.additional_company?.map((contact) => (
            <Field
              key={contact.id}
              label={contact.name}
              placeholder="Add here..."
              value={contact.value}
              onChange={(value) => {
                const updatedCompany = selectedCard.additional_company.map(
                  (c) => (c.id === contact.id ? { ...c, value } : c),
                );
                setSelectedCard({
                  ...selectedCard,
                  additional_company: updatedCompany,
                });
              }}
              onEnter={() =>
                handleContactCustomFieldUpdate(
                  selectedCard.id,
                  contact.id,
                  contact.value,
                )
              }
            />
          ))}
          <div className={styles.newField}>
            {!newCompanyFields.show ? (
              <div
                className={styles.addNewField}
                onClick={() =>
                  setNewCompanyFields((prev) => ({ ...prev, show: true }))
                }
              >
                <Add width={16} height={16} fill="#194EFF" />
                <p className={styles.add}>Add new field...</p>
              </div>
            ) : (
              <div className={styles.row} style={{ alignItems: "center" }}>
                <input
                  type="text"
                  className={styles.input_name}
                  placeholder="Field name..."
                  value={newCompanyFields.name}
                  onChange={(e) =>
                    setNewCompanyFields((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Add value..."
                  value={newCompanyFields.value}
                  onChange={(e) =>
                    setNewCompanyFields((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                  onKeyUp={(e) => {
                    if (e.key === "Enter") handleSaveNewField("COMPANY");
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.details}>
        <div className={styles.detailHeader}>
          <p className={styles.detailTitle}>
            Activity
            {sortedActivities.length > 0 ? ` (${sortedActivities.length})` : ""}
          </p>
        </div>
        <div className={styles.newActivity} ref={activityContainerRef}>
          {sortedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              content={activity.content}
              date={activity.created_at}
              onDelete={handleDeleteActivity}
              onEdit={handleEditActivity}
            />
          ))}
          {showAddNoteForm && (
            <div className={styles.addNoteForm}>
              <textarea
                className={styles.addNoteInput}
                placeholder="Add your note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <div className={styles.saveContainer}>
                <div className={styles.cancelAction} onClick={handleCloseNote}>
                  <Close width={16} height={16} fill="#3D3D3D" />
                </div>
                <div
                  className={`${styles.saveAction} ${
                    savingNote || !noteContent.trim() ? styles.disabled : ""
                  }`}
                  onClick={handleSaveNote}
                >
                  <Checkmark width={16} height={16} fill="white" />
                </div>
              </div>
            </div>
          )}
          {!showAddNoteForm && (
            <div className={styles.addNewField} onClick={handleAddNoteClick}>
              <Add width={16} height={16} fill="#194EFF" />
              <p className={styles.add}>Add new note...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralField;
