import { SetStateAction } from "react";
import { Pen, Trash } from "../icons";
import styles from "./Tag.module.scss";

type Props = {
	id: number;
	name: string;
	color: string;
	setEditTagData: (
		value: SetStateAction<{
			name: string;
			color: string;
		}>,
	) => void;
	setTagEditing: (value: SetStateAction<string | number | boolean>) => void;
	deleteTag: (id: number) => Promise<void>;
};

const Tag = ({
	id,
	name,
	color,
	setEditTagData,
	setTagEditing,
	deleteTag,
}: Props) => {
	return (
		<div className={styles.tag} style={{ background: color }} key={id}>
			<p>{name}</p>
			<Pen
				onClick={() => {
					setEditTagData({ name: name, color: color });
					setTagEditing(id);
				}}
				className={styles.icons}
				width={16}
				height={16}
				fill="white"
			/>
			<Trash
				onClick={() => deleteTag(id)}
				className={styles.icons}
				width={16}
				height={16}
				fill="white"
			/>
		</div>
	);
};

export default Tag;
