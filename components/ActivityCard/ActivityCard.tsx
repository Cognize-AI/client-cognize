import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import styles from "./ActivityCard.module.scss";
import { Pen, Trash, Checkmark, Close } from "../icons";

type Props = {
	id: number;
	content: string;
	date: string;
	onDelete: (id: number) => void;
	onEdit: (id: number, newContent: string) => void;
};

const ActivityCard = ({ id, content, date, onDelete, onEdit }: Props) => {
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(content);
	const [isUpdating, setIsUpdating] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const autoResize = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.max(textarea.scrollHeight, 72)}px`;
		}
	};

	useEffect(() => {
		if (isEditing && textareaRef.current) {
			setTimeout(() => {
				autoResize();
				textareaRef.current?.focus();
			}, 0);
		}
	}, [isEditing]);

	useEffect(() => {
		if (isEditing) {
			autoResize();
		}
	}, [editContent, isEditing]);

	const handleEditClick = () => {
		setIsEditing(true);
		setEditContent(content);
	};

	const handleSaveClick = async () => {
		if (!editContent.trim()) {
			return;
		}

		setIsUpdating(true);
		try {
			await onEdit(id, editContent.trim());
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to update activity:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleCancelClick = () => {
		setEditContent(content);
		setIsEditing(false);
	};

	const handleDeleteClick = () => {
		onDelete(id);
	};

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setEditContent(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();
			handleSaveClick();
		}
		if (e.key === "Escape") {
			e.preventDefault();
			handleCancelClick();
		}
	};

	return (
		<div className={styles.activity}>
			<div className={styles.contentContainer}>
				{isEditing ? (
					<textarea
						ref={textareaRef}
						className={styles.editTextarea}
						value={editContent}
						onChange={handleTextareaChange}
						onKeyDown={handleKeyDown}
						placeholder="Edit your note..."
						disabled={isUpdating}
					/>
				) : (
					<p className={styles.content}>{content}</p>
				)}
			</div>

			<div className={styles.info}>
				<p className={styles.created}>
					Created on {format(new Date(date), "MMM dd, yyyy")}
				</p>

				{isEditing ? (
					<div className={styles.editActions}>
						<div className={styles.cancelAction} onClick={handleCancelClick}>
							<Close width={16} height={16} fill="#3D3D3D" />
						</div>
						<div
							className={`${styles.saveAction} ${isUpdating || !editContent.trim() ? styles.disabled : ""}`}
							onClick={handleSaveClick}
						>
							<Checkmark width={16} height={16} fill="white" />
						</div>
					</div>
				) : (
					<div className={styles.actions}>
						<div onClick={handleDeleteClick} className={styles.delete}>
							<Trash width={20} height={20} fill="#F77272" />
						</div>
						<div onClick={handleEditClick} className={styles.edit}>
							<Pen width={20} height={20} fill="#194EFF" />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ActivityCard;
