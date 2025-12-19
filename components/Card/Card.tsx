"use client";
import Image from "next/image";
import styles from "./Card.module.scss";
import { CardType } from "@/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import {
  Add,
  AddImage,
  Checkmark,
  Delete,
  Dots,
  Edit,
  Mail,
  Phone,
} from "../icons";
import { axios_instance } from "@/lib/axios";
import TagModal from "../TagModal/TagModal";
import { useOutsideClickListener } from "@/hooks/useOutsideClickListener";

type Tag = { id: number; name: string; color: string };
type CardTag = Tag;

type Props = {
  card: CardType;
  tags: Tag[];
  onDragStart: (list_id: number, card_id: number) => void;
  onDragEnd: () => void;
  onDragEnter: (listId: number, cardIndex: number) => void;
  list_id: number;
  index: number;
  onCardUpdated?: (updatedCard: CardType) => void;
  onCardDeleted?: (cardId: number) => void;
  onTagUpdate?: () => void;
  isTagModalOpen: boolean;
  setIsTagModalOpen: Dispatch<SetStateAction<boolean>>;
  onClick: () => void;
};

const Card = ({
  card,
  tags,
  onDragStart,
  onDragEnd,
  onDragEnter,
  index,
  list_id,
  onCardUpdated,
  onCardDeleted,
  onTagUpdate,
  setIsTagModalOpen,
  onClick,
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<CardType>(card);
  const [uploading, setUploading] = useState(false);
  const [isTagSearchOpen, setIsTagSearchOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  const tagModalRef = useRef<HTMLDivElement>(null);
  const menuModalRef = useRef<HTMLDivElement>(null);

  useOutsideClickListener(tagModalRef, () => {
    setIsTagSearchOpen(false);
    setIsTagModalOpen(false);
  });

  useOutsideClickListener(menuModalRef, () => {
    setShowMenu(false);
    setIsTagModalOpen(false);
  });

  useEffect(() => {
    if (!isEditing) setEditedCard(card);
    setImageError(false);
  }, [card, isEditing]);

  const getTagName = (tag: CardTag) => tag.name;
  const handleImageError = () => setImageError(true);
  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!uploading) handleSave();
    }
  };

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
    const currentTags = editedCard.tags || [];
    const isSelected = currentTags.some((t) => getTagName(t) === tagName);
    if (isSelected) {
      removeTagFromCard(
        tagID,
        card.id,
        () => {
          const newTags = currentTags.filter((t) => getTagName(t) !== tagName);
          const updatedCard = { ...editedCard, tags: newTags };
          setEditedCard(updatedCard);
          onCardUpdated?.(updatedCard);
          onTagUpdate?.();
        },
        () => console.error("Failed to remove tag"),
      );
    } else {
      addTagToCard(
        tagID,
        card.id,
        () => {
          const updatedCard = {
            ...editedCard,
            tags: [
              ...currentTags,
              { id: tagID, name: tagName, color: tagColor },
            ],
          };
          setEditedCard(updatedCard);
          onCardUpdated?.(updatedCard);
          onTagUpdate?.();
        },
        () => console.error("Failed to add tag"),
      );
    }
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
        setEditedCard((prev) => ({ ...prev, image_url: data.url }));
        setImageError(false);
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

  const handleSave = async () => {
    if (uploading) return;
    setShowMenu(false);
    const unchanged =
      editedCard.name === card.name &&
      editedCard.email === card.email &&
      editedCard.phone === card.phone &&
      editedCard.designation === card.designation &&
      editedCard.image_url === card.image_url &&
      JSON.stringify(editedCard.tags) === JSON.stringify(card.tags);
    if (unchanged) {
      setIsEditing(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card/${card.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editedCard.name,
            email: editedCard.email,
            phone: editedCard.phone,
            designation: editedCard.designation,
            image_url: editedCard.image_url,
            list_id: editedCard.list_id,
          }),
        },
      );
      if (!res.ok) throw new Error("Failed to update card");
      const updatedCard = {
        ...editedCard,
        id: card.id,
        list_id: card.list_id,
        tags: editedCard.tags || card.tags || [],
      };
      onCardUpdated?.(updatedCard);
      setIsEditing(false);
    } catch (err) {
      console.error("Edit failed:", err);
      setEditedCard(card);
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/card/${card.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      onCardDeleted?.(card.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredTags = tags?.filter((t) =>
    t.name.toLowerCase().includes(tagSearchQuery.toLowerCase()),
  );

  return (
    <div
      className={`${styles.cardContainer} ${isEditing ? styles.editing : ""}`}
      draggable={!isEditing}
      onDragStart={() => !isEditing && onDragStart(list_id, card.id)}
      onDragEnter={() => !isEditing && onDragEnter(list_id, index)}
      onDragEnd={onDragEnd}
      onClick={isEditing ? undefined : onClick}
    >
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {isEditing ? (
            <label
              htmlFor={`file-upload-${card.id}`}
              className={styles.avatarUpload}
            >
              {uploading ? (
                <div className={styles.uploadingText}></div>
              ) : editedCard.image_url && !imageError ? (
                <Image
                  src={editedCard.image_url}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className={styles.avatarImage}
                  onError={handleImageError}
                  quality={100}
                />
              ) : (
                <AddImage width={24} height={24} fill="#BCBBB8" />
              )}
              <input
                id={`file-upload-${card.id}`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.hiddenInput}
                disabled={uploading}
              />
            </label>
          ) : editedCard.image_url && !imageError ? (
            <Image
              src={editedCard.image_url}
              alt="Avatar"
              width={40}
              height={40}
              className={styles.avatarImage}
              onError={handleImageError}
              quality={100}
            />
          ) : (
            <AddImage width={24} height={24} fill="#BCBBB8" />
          )}
        </div>

        <div className={styles.userDetails}>
          {isEditing ? (
            <>
              <input
                name="name"
                placeholder="name..."
                className={styles.userName}
                value={editedCard.name || ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={uploading}
              />
              <input
                name="designation"
                placeholder="professional exp..."
                className={styles.userTitle}
                value={editedCard.designation || ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={uploading}
              />
            </>
          ) : (
            <>
              <p className={styles.userName}>
                {editedCard.name || (
                  <span className={styles.userNamePlaceholder}>name...</span>
                )}
              </p>
              <p className={styles.userTitle}>
                {editedCard.designation || (
                  <span className={styles.userTitlePlaceholder}>
                    professional exp...
                  </span>
                )}
              </p>
            </>
          )}
        </div>

        <div
          className={styles.userEdit}
          onClick={(e) => {
            e.stopPropagation();
            if (isEditing && !uploading) {
              handleSave();
            } else if (!isEditing) {
              toggleMenu();
            }
          }}
          style={{
            opacity: isEditing && uploading ? 0.5 : 1,
            cursor: isEditing && uploading ? "not-allowed" : "pointer",
          }}
        >
          {!isEditing ? (
            <Dots width={24} height={24} fill="#3D3D3D" />
          ) : (
            <Checkmark
              width={24}
              height={24}
              fill={uploading ? "#BCBBB8" : "#194EFF"}
            />
          )}

          {showMenu && !isEditing && (
            <div
              ref={menuModalRef}
              className={styles.userMenu}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={styles.editMenu}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setShowMenu(false);
                }}
              >
                <div className={styles.edit}>
                  <Edit width={16} height={16} fill="#00020F" />
                </div>
                <div className={styles.editText}>Edit</div>
              </div>

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

      <div className={styles.cardContent}>
        {isEditing ? (
          <>
            <div className={styles.userEmail}>
              <Mail width={16} height={16} fill="#3D3D3D" />
              <input
                name="email"
                placeholder="email..."
                className={styles.email}
                value={editedCard.email || ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={uploading}
              />
            </div>
            <div className={styles.userContact}>
              <Phone width={16} height={16} fill="#3D3D3D" />
              <input
                name="phone"
                placeholder="phone..."
                className={styles.contact}
                value={editedCard.phone || ""}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={uploading}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.userEmail}>
              <Mail width={16} height={12} fill="#3D3D3D" />
              <p className={styles.email}>
                {editedCard.email || (
                  <span className={styles.emailPlaceholder}>email...</span>
                )}
              </p>
            </div>
            <div className={styles.userContact}>
              <Phone width={16} height={16} fill="#3D3D3D" />
              <p className={styles.contact}>
                {editedCard.phone || (
                  <span className={styles.contactPlaceholder}>phone...</span>
                )}
              </p>
            </div>
          </>
        )}
      </div>

      <div className={styles.userTags}>
        {editedCard.tags?.map((tag, i) => (
          <div
            key={`${card.id}-tag-${i}`}
            className={styles.userTag}
            style={{ color: "black", backgroundColor: tag.color }}
          >
            {tag.name}
          </div>
        ))}

        <div
          className={styles.addTag}
          onClick={(e) => {
            e.stopPropagation();
            if (!uploading) {
              setIsTagSearchOpen((prev) => !prev);
              setIsTagModalOpen((prev) => !prev);
            }
          }}
          style={{
            opacity: uploading ? 0.5 : 1,
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          <Add width={16} height={16} />
          <p className={styles.addTagText}>Add tag...</p>
        </div>
      </div>

      {isTagSearchOpen && !uploading && (
        <TagModal
          ref={tagModalRef}
          tagSearchQuery={tagSearchQuery}
          setTagSearchQuery={setTagSearchQuery}
          filteredTags={filteredTags}
          editedCard={editedCard}
          handleTagToggle={handleTagToggle}
        />
      )}
    </div>
  );
};

export default Card;
