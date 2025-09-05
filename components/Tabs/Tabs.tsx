import styles from "./Tabs.module.scss";

type TabsProps = {
	children: React.ReactNode;
};

const Tabs = ({ children }: TabsProps) => {
	return <div className={styles.tabs}>{children}</div>;
};

export default Tabs;
