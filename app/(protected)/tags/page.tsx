"use client";

import { useEffect, useState } from "react";
// import { useRouter } from 'next/navigation'

import { axios_instance } from "@/lib/axios";
import { useTagsStore } from "@/provider/tags-store-provider";

import { Add, Tag as TagIcon } from "@/components/icons";
import AddInput from "@/components/AddInput/AddInput";

import styles from "./page.module.scss";
import Tag from "@/components/Tag/Tag";

const Page = () => {
	const groupedTags = useTagsStore((state) => state.groupedTags);
	const addTags = useTagsStore((state) => state.addTags);

	const [tagOpen, setTagOpen] = useState<boolean | string | number>(false);
	const [newTagData, setNewTagData] = useState({ name: "", color: "" });
	const [tagEditing, setTagEditing] = useState<number | boolean | string>(
		false,
	);
	const [editTagData, setEditTagData] = useState({ name: "", color: "" });

	const createTag = async () => {
		axios_instance
			.post("/tag/create", { ...newTagData })
			.then(() => {
				setNewTagData({ name: "", color: "" });
				setTagOpen(false);
				fetchTags();
			})
			.catch(() => {
				setNewTagData({ name: "", color: "" });
				setTagOpen(false);
				fetchTags();
			});
	};

	const updateTag = async () => {
		const payload = {
			id: tagEditing,
			name: editTagData.name,
		};

		if (payload.id == 0 || !payload.name) {
			return;
		}

		axios_instance
			.put(`/tag/`, payload)
			.then(() => {
				fetchTags();
				setTagEditing(false);
				setEditTagData({ name: "", color: "" });
			})
			.catch(() => {
				fetchTags();
				setTagEditing(false);
				setEditTagData({ name: "", color: "" });
			});
	};

	const deleteTag = async (id: number) => {
		axios_instance
			.delete(`/tag/${id}`)
			.then(() => {
				fetchTags();
			})
			.catch(() => {
				fetchTags();
			});
	};

	const fetchTags = async () => {
		axios_instance.get("/tag/").then((response) => {
			addTags(response.data?.data?.tags);
		});
	};

	useEffect(() => {
		fetchTags();
	}, []);
	return (
		<div className={styles.main}>
			<div className={styles.tags}>
				{Object.keys(groupedTags)?.map((key) => {
					return (
						<div
							className={styles.tag_row}
							key={key}
							style={{ background: key + "14" }}
						>
							<div className={styles.icon} style={{ background: key + "1F" }}>
								<TagIcon width={24} height={24} fill="#00020F" />
							</div>
							<div className={styles.ta_gs_row}>
								{groupedTags[key]?.map((tag) =>
									tagEditing === tag.id ? (
										<AddInput
											key={tag.id}
											color={key}
											createTag={updateTag}
											name={editTagData.name}
											setNewTagData={setEditTagData}
											setTagOpen={setTagEditing}
											newTagData={editTagData}
										/>
									) : (
										<Tag
											key={tag.id}
											id={tag.id}
											name={tag.name}
											color={key}
											setEditTagData={setEditTagData}
											setTagEditing={setTagEditing}
											deleteTag={deleteTag}
										/>
									),
								)}
								{!(tagOpen && tagOpen === key) && (
									<div
										onClick={() => {
											setTagOpen(key);
											setNewTagData({ ...newTagData, color: key });
										}}
										className={styles.add_tag}
									>
										<Add width={16} height={16} stroke="#194EFF" />
										<p>Add tag</p>
									</div>
								)}
								{/* {
                  tagOpen && tagOpen === key && <div style={{
                    border: `1px solid ${key}`
                  }} className={styles.new_tag}>
                    <input placeholder='New tag name' onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        createTag()
                      }
                    }} autoFocus type="text" value={newTagData.name} onChange={(e) => setNewTagData({ ...newTagData, name: e.target.value })} />
                    <Tick width={16} height={16} fill={key} onClick={createTag} />
                  </div>
                } */}
								{tagOpen && tagOpen === key && (
									<AddInput
										color={key}
										createTag={createTag}
										name={newTagData.name}
										setNewTagData={setNewTagData}
										setTagOpen={setTagOpen}
										newTagData={newTagData}
									/>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Page;
