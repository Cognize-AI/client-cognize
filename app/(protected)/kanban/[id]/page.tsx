"use client";

import {
  Add,
  ArrowLeft,
  Dots,
  Mail,
  Phone,
  Streak,
  AddImage,
  Delete,
  Pen,
  Trash,
  SparklesSoft,
  ListBullet,
  Activity,
  Admin,
} from "@/components/icons";
import styles from "./page.module.scss";
import { useParams, useRouter } from "next/navigation";
import { axios_instance } from "@/lib/axios";
import { useCardStore } from "@/provider/card-store-provider";
import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import TagModal from "@/components/TagModal/TagModal";
import { useOutsideClickListener } from "@/hooks/useOutsideClickListener";
import { useTagsStore } from "@/provider/tags-store-provider";
import GeneralField from "@/components/ProspectiveId/GeneralField/GeneralField";
// import TabGroup from '@/components/TabGroup/TabGroup'
import AiSummary from "@/components/ProspectiveId/AiSummary/AiSummary";
import Suggestions from "@/components/ProspectiveId/Suggestions/Suggestions";
import ActivityTimeline from "@/components/ProspectiveId/ActivityTimeline/ActivityTimeline";
import Tabs from "@/components/Tabs/Tabs";
import Tab from "@/components/Tab/Tab";

const Page = () => {
  const userTags = useTagsStore((state) => state.tags);
  const addTags = useTagsStore((state) => state.addTags);
  const selectedCard = useCardStore((state) => state.selectedCard);
  const setSelectedCard = useCardStore((state) => state.setSelectedCard);

  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [activeTab, setActiveTab] = useState("General Field");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    designation: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const [isTagSearchOpen, setIsTagSearchOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  const tagModalRef = useRef<HTMLDivElement>(null);
  const menuModalRef = useRef<HTMLDivElement>(null);

  useOutsideClickListener(tagModalRef, () => {
    setIsTagSearchOpen(false);
  });

  useOutsideClickListener(menuModalRef, () => {
    setShowMoreMenu(false);
  });

  const fetchCard = useCallback(() => {
    if (!id) {
      return;
    }
    axios_instance.get(`/card/${id}`).then((response) => {
      setSelectedCard(response?.data?.data);
    });
  }, [id, setSelectedCard]);

  const fetchAvailableTags = useCallback(() => {
    axios_instance
      .get("/tag/")
      .then((response) => {
        const tags = response?.data?.data?.tags;
        addTags(Array.isArray(tags) ? tags : []);
      })
      .catch((error) => {
        console.error("Failed to fetch tags:", error);
        addTags([]);
      });
  }, [addTags]);

  const handleMailClick = () => {
    if (selectedCard?.email) {
      window.location.href = `mailto:${selectedCard.email}`;
    }
  };

  const handleImageError = () => setImageError(true);

  const handleProfileDoubleClick = () => {
    if (!isEditingProfile) {
      setIsEditingProfile(true);
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64data = reader.result;
        const token = localStorage.getItem("token");
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ image: base64data }),
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        if (!data.url) throw new Error("Upload response did not contain a URL");
        
        const newImageUrl = data.url;
        setEditedProfile((prev) => ({ ...prev, image_url: newImageUrl }));
        setImageError(false);

        // Auto-save the profile with the new image
        if (selectedCard) {
          try {
            const updateData = {
              id: selectedCard.id,
              name: editedProfile.name || selectedCard.name,
              designation: editedProfile.designation || selectedCard.designation,
              email: selectedCard.email,
              phone: selectedCard.phone,
              image_url: newImageUrl, // Use the new image URL
              location: selectedCard.location,
              company_name: selectedCard.company.name,
              company_role: selectedCard.company.role,
              company_location: selectedCard.company.location,
              company_phone: selectedCard.company.phone,
              company_email: selectedCard.company.email,
            };

            await axios_instance.put(`/card/details/${selectedCard.id}`, updateData);

            // Update the selected card with the new image
            setSelectedCard({
              ...selectedCard,
              image_url: newImageUrl,
            });

            console.log("Profile image auto-saved successfully");
          } catch (saveErr) {
            console.error("Failed to auto-save profile image:", saveErr);
          }
        }
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      console.error("File reading failed");
      setUploading(false);
    };
  };

  const handleProfileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!uploading) handleProfileSave();
    }
  };

  const handleProfileSave = async () => {
    if (uploading || !selectedCard) return;

    const unchanged =
      editedProfile.name === selectedCard.name &&
      editedProfile.designation === selectedCard.designation &&
      editedProfile.image_url === selectedCard.image_url;

    if (unchanged) {
      setIsEditingProfile(false);
      return;
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
        company_email: selectedCard.company.email,
      };

      await axios_instance.put(`/card/details/${selectedCard.id}`, data);

      setSelectedCard({
        ...selectedCard,
        name: editedProfile.name,
        designation: editedProfile.designation,
        image_url: editedProfile.image_url,
      });

      setIsEditingProfile(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      if (selectedCard) {
        setEditedProfile({
          name: selectedCard.name || "",
          designation: selectedCard.designation || "",
          image_url: selectedCard.image_url || "",
        });
      }
    }
  };

  const handleDelete = async () => {
    setShowMoreMenu(false);
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card/${selectedCard?.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      router.back();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const toggleMoreMenu = () => setShowMoreMenu((prev) => !prev);

  const addTagToCard = (
    tagID: number,
    cardID: number,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    if (!tagID || !cardID) return;
    axios_instance
      .post("/tag/add-to-card", { tag_id: tagID, card_id: cardID })
      .then(onSuccess)
      .catch((err) => {
        console.error("Add Tag Error:", err?.response?.data || err);
        onError();
      });
  };

  const removeTagFromCard = (
    tagID: number,
    cardID: number,
    onSuccess: () => void,
    onError: () => void,
  ) => {
    if (!tagID || !cardID) return;
    axios_instance
      .post("/tag/remove-from-card", { tag_id: tagID, card_id: cardID })
      .then(onSuccess)
      .catch((err) => {
        console.error("Remove Tag Error:", err?.response?.data || err);
        onError();
      });
  };

  const handleTagToggle = (
    tagID: number,
    tagName: string,
    tagColor: string,
  ) => {
    if (!selectedCard) return;

    const currentTags = selectedCard.tags || [];
    const isSelected = currentTags.some((t) => t.name === tagName);

    if (isSelected) {
      removeTagFromCard(
        tagID,
        selectedCard.id,
        () => {
          const newTags = currentTags.filter((t) => t.name !== tagName);
          setSelectedCard({ ...selectedCard, tags: newTags });
          fetchCard();
        },
        () => console.error("Failed to remove tag"),
      );
    } else {
      addTagToCard(
        tagID,
        selectedCard.id,
        () => {
          const updatedTags = [
            ...currentTags,
            { id: tagID, name: tagName, color: tagColor },
          ];
          setSelectedCard({ ...selectedCard, tags: updatedTags });
          fetchCard();
        },
        () => console.error("Failed to add tag"),
      );
    }
  };

  const filteredTags = Array.isArray(userTags)
    ? userTags.filter((t) =>
        t.name.toLowerCase().includes(tagSearchQuery.toLowerCase()),
      )
    : [];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "AI Summary":
        return <AiSummary />;
      case "General Field":
        return <GeneralField fetchCard={fetchCard} />;
      case "Activity":
        return <ActivityTimeline />;
      case "Suggestions":
        return <Suggestions />;
      default:
        return <GeneralField fetchCard={fetchCard} />;
    }
  };

  useEffect(() => {
    fetchCard();
  }, [fetchCard]);

  useEffect(() => {
    fetchAvailableTags();
  }, [fetchAvailableTags]);

  useEffect(() => {
    if (selectedCard && !isEditingProfile) {
      setEditedProfile({
        name: selectedCard.name || "",
        designation: selectedCard.designation || "",
        image_url: selectedCard.image_url || "",
      });
      setImageError(false);
    }
  }, [selectedCard, isEditingProfile]);

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
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.top_row}>
          <div
            className={styles.btn_back}
            onClick={() => {
              router.back();
            }}
          >
            <ArrowLeft width={20} height={24} stroke="#194EFF" fill="none" />
            <p>Go back</p>
          </div>
        </div>
        <div className={styles.content}>
          <div
            className={`${styles.user} ${
              isEditingProfile ? styles.editing : ""
            }`}
            onClick={handleProfileDoubleClick}
          >
            <div className={styles.avatar}>
              {isEditingProfile ? (
                <label
                  htmlFor={`profile-image-upload-${selectedCard.id}`}
                  className={`${styles.avatarUpload} ${
                    uploading ? styles.uploading : ""
                  }`}
                >
                  {uploading ? (
                    <div className={styles.uploadingSpinner}>
                      <AddImage width={24} height={24} fill="#FFFFFF" />
                    </div>
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
                    <AddImage width={24} height={24} fill="#BCBBB8" />
                  )}
                  <input
                    id={`profile-image-upload-${selectedCard.id}`}
                    type="file"
                    accept="image/*"
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
                <div className={styles.avatar}>
                  <AddImage width={24} height={24} fill="#BCBBB8" />
                </div>
              )}
            </div>
            <div className={styles.userDetails}>
              {isEditingProfile ? (
                <>
                  <input
                    name="name"
                    placeholder="name..."
                    className={`${styles.name} ${styles.editableInput}`}
                    value={editedProfile.name}
                    onChange={handleProfileInputChange}
                    onKeyDown={handleProfileKeyDown}
                    disabled={uploading}
                  />
                  <input
                    name="designation"
                    placeholder="designation..."
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
                    fill="#194EFF"
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
                    fill="#194EFF"
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
                    fill="#194EFF"
                    className={styles.actionIcons}
                  />
                </div>
              </div>
              <p className={styles.actionTitle}>Enrich</p>
            </div>
            <div
              className={`${styles.icons} ${
                isEditingProfile && uploading ? styles.disabled : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (isEditingProfile && !uploading) {
                  handleProfileSave();
                } else if (!isEditingProfile) {
                  toggleMoreMenu();
                }
              }}
            >
              <div className={styles.icon_wrapper}>
                <div className={styles.icon_unif}>
                  <Dots
                    width={24}
                    height={24}
                    fill="#194EFF"
                    className={styles.actionIcons}
                  />
                </div>
              </div>
              <p className={styles.actionTitle}>More</p>

              {showMoreMenu && !isEditingProfile && (
                <div
                  ref={menuModalRef}
                  className={styles.moreMenu}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    <div className={styles.delete}>
                      <Delete width={16} height={16} fill="#FB7285" />
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

          {selectedCard?.tags?.map((tag) => (
            <div
              key={tag.id}
              className={styles.tag}
              style={{ backgroundColor: tag.color }}
            >
              <p className={styles.tagTitle}>{tag.name}</p>
              <div className={styles.tagIcons}>
                <Pen width={16} height={16} fill="white" />
                <Trash
                  width={16}
                  height={16}
                  fill="white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagToggle(tag.id, tag.name, tag.color);
                  }}
                />
              </div>
            </div>
          ))}

          <div
            className={styles.addTag}
            onClick={(e) => {
              e.stopPropagation();
              setIsTagSearchOpen((prev) => !prev);
            }}
          >
            <Add width={16} height={16} fill="#194EFF" />
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
        <Tabs>
          <Tab
            onClick={() => setActiveTab("AI Summary")}
            isActive={activeTab === "AI Summary"}
          >
            <SparklesSoft
              className={`${styles.fill_icon} ${activeTab === "AI Summary" ? styles.active : ""}`}
              width={20}
              height={20}
            />
            <p>AI Summary</p>
          </Tab>
          <Tab
            onClick={() => setActiveTab("General Field")}
            isActive={activeTab === "General Field"}
          >
            <ListBullet
              className={`${styles.fill_icon} ${
                activeTab === "General Field" ? styles.active : ""
              }`}
              width={20}
              height={20}
            />
            <p>General Field</p>
          </Tab>
          <Tab
            onClick={() => setActiveTab("Activity")}
            isActive={activeTab === "Activity"}
          >
            <Activity
              className={`${styles.stroke_icon} ${
                activeTab === "Activity" ? styles.active : ""
              }`}
              width={20}
              height={20}
            />
            <p>Activity</p>
          </Tab>
          <Tab
            onClick={() => setActiveTab("Suggestions")}
            isActive={activeTab === "Suggestions"}
          >
            <Admin
              className={`${styles.fill_icon} ${
                activeTab === "Suggestions" ? styles.active : ""
              }`}
              width={20}
              height={20}
            />
            <p>Suggestions</p>
          </Tab>
        </Tabs>
        <div className={styles.componentWrapper}>{renderActiveComponent()}</div>
      </div>
    </>
  );
};

export default Page;
