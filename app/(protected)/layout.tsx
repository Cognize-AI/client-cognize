"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useUserStore } from "@/provider/user-store-provider";

import Sidebar from "@/components/Sidebar/Sidebar";

import styles from "./layout.module.scss";
import HeaderWrapper from "@/components/HeaderWrapper";

type Props = {
	children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
	const token = useUserStore((state) => state.token);
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!token) {
			router.push("/");
		}
	}, [token, router]);

	if (!token) {
		return null;
	}

	return (
		<div className={styles.main}>
			<Sidebar />
			<div className={styles.main_page}>
				{["/kanban", "/tags", "/settings"]?.includes(pathname) && (
					<HeaderWrapper />
				)}
				{children}
			</div>
		</div>
	);
};

export default Layout;
