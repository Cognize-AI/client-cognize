import { Location } from "@/components/icons";
import styles from "./Field.module.scss";

type Props = {
  labelIcon?: React.ReactNode;
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
  onEnter: () => void;
  label: string;
};

const Field = ({
  labelIcon,
  placeholder,
  onChange,
  value,
  onEnter,
  label,
}: Props) => {
  return (
    <div className={styles.field}>
      <div className={styles.label}>
        {labelIcon}
        <p>{label}</p>
      </div>
      <input
        className={styles.input}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onEnter();
          }
        }}
        type="text"
      />
    </div>
  );
};

export default Field;
