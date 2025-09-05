"use client";
import Image from "next/image";
import styles from "./AddCard.module.scss";
import { useState, useRef, useEffect } from "react";
import { CardType } from "@/types";
import { Add, AddImage, Checkmark, Mail, Phone } from "../icons";

type Props = {
  listId: number;
  tags?: Tag[];
  onCardAdded: (newCard: CardType) => void;
  onCancel: () => void;
};

type Tag = {
  id: number;
  name: string;
  color: string;
};

const uploadToCloudinary = async (file: File): Promise<string> => {
  if (!file || !(file instanceof File)) {
    throw new Error("Invalid file provided");
  }

  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const base64data = reader.result;
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64data }),
        });
        const data = await res.json();
        if (data.url) {
          resolve(data.url);
        } else {
          reject("Upload failed");
        }
      } catch (err) {
        console.error("Upload error:", err);
        reject(err);
      }
    };
    reader.onerror = () => reject("File reading failed");
  });
};

const AddCard = ({ listId, tags = [], onCardAdded, onCancel }: Props) => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTagSearchOpen, setIsTagSearchOpen] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addTagContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isTagSearchOpen &&
        addTagContainerRef.current &&
        !addTagContainerRef.current.contains(event.target as Node)
      ) {
        setIsTagSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTagSearchOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagName)
        ? prevTags.filter((t) => t !== tagName)
        : [...prevTags, tagName],
    );
  };

  const handleSubmit = async () => {
    if (email && !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      let uploadedUrl = "";
      if (imageFile && imageFile instanceof File) {
        uploadedUrl = await uploadToCloudinary(imageFile);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/card/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            name: name.trim() || null,
            designation: title.trim() || null,
            email: email.trim() || null,
            phone: contact.trim() || null,
            image_url: uploadedUrl || null,
            list_id: listId,
            tags: selectedTags,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add the new card. Please try again.");
      }

      const jsonResponse = await response.json();

      const newCardData = {
        id: jsonResponse.data.id || Date.now(),
        name: name.trim() || null,
        designation: title.trim() || null,
        email: email.trim() || null,
        phone: contact.trim() || null,
        image_url: uploadedUrl || null,
        list_id: listId,
        tags: selectedTags,
        ...jsonResponse.data,
      };

      onCardAdded(newCardData);

      setName("");
      setTitle("");
      setEmail("");
      setContact("");
      setSelectedTags([]);
      setImageFile(null);
      setImageUrl(null);
      onCancel();
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = (tags || []).filter((tag) =>
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()),
  );

  return (
    <div className={styles.cardContainer}>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.userInfo}>
        <div className={styles.avatar} onClick={handleImageClick}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Preview"
              width={40}
              height={40}
              className={styles.avatarImage}
            />
          ) : (
            <AddImage width={24} height={24} fill="#BCBBB8" />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.hiddenInput}
          />
        </div>

        <div className={styles.userDetails}>
          <input
            type="text"
            placeholder="name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.userName}
          />
          <input
            type="text"
            placeholder="professional exp..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.userTitle}
          />
        </div>

        <div className={styles.userActions}>
          <Checkmark
            onClick={handleSubmit}
            width={24}
            height={24}
            fill="#194EFF"
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          />
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.userEmail}>
          <Mail width={16} height={16} fill="#3D3D3D" />
          <input
            type="email"
            placeholder="email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.email}
          />
        </div>

        <div className={styles.userContact}>
          <Phone width={16} height={16} fill="#3D3D3D" />
          <input
            type="text"
            placeholder="phone..."
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className={styles.contact}
          />
        </div>
      </div>

      <div className={styles.userTags}>
        {selectedTags.map((tagName, idx) => {
          const tagObject = tags.find((t) => t.name === tagName);
          if (!tagObject) return null;

          const color = tagObject.color;
          return (
            <div
              key={idx}
              className={styles.userTag}
              style={{
                color: color,
                background: `${color}1A`,
              }}
            >
              {tagName}
            </div>
          );
        })}

        <div className={styles.addTagContainer} ref={addTagContainerRef}>
          <div
            className={styles.addTag}
            onClick={() => setIsTagSearchOpen(!isTagSearchOpen)}
          >
            <Add width={16} height={16} />
            <p className={styles.addTagText}>Add tag...</p>
          </div>
          {isTagSearchOpen && (
            <div className={styles.searchTag}>
              <input
                type="text"
                placeholder="Search tags..."
                className={styles.searchTagInput}
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
              />
              <div className={styles.allTags}>
                {filteredTags.length > 0 ? (
                  filteredTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                      <div
                        key={tag.id}
                        className={styles.allTag}
                        onClick={() => handleTagToggle(tag.name)}
                      >
                        <div
                          className={`${styles.checkbox} ${
                            isSelected ? styles.checked : ""
                          }`}
                        >
                          {isSelected ? (
                            <Checkmark width={12} height={12} fill="white" />
                          ) : (
                            <Checkmark width={12} height={12} fill="white" />
                          )}
                        </div>
                        <div
                          className={styles.tagName}
                          style={{ backgroundColor: tag.color }}
                        >
                          <p className={styles.tagNameText}>{tag.name}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p></p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCard;
