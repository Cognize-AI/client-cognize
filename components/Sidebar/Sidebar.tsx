'use client'

import Image from "next/image"
import styles from "./Sidebar.module.scss"
import Link from "next/link"
import { Dashboard, Settings, Tag, User } from "../icons"
import { usePathname } from "next/navigation"
import { useUserStore } from "@/provider/user-store-provider"

const Sidebar = () => {
  const pathname = usePathname();
  const isKanbanActive = pathname.startsWith('/kanban');
  const user = useUserStore(state => state.user);

  return (
    <div className={styles.sidebar}>
      <Image alt="Logo" priority quality={100} src={"/logo.svg"} width={200} height={52} />
      <div className={styles.actions}>
        <Link className={`${styles.link} ${isKanbanActive ? styles.active : ""}`} href={"/kanban"}>
          <Dashboard width={20} height={20} fill={isKanbanActive ? "#194EFF" : "#3D3D3D"} />
          <p>Dashbaords</p>
        </Link>
        <Link className={`${styles.link} ${pathname === "/tags" ? styles.active : ""}`} href={"/tags"}>
          <Tag width={20} height={20} fill={pathname === "/tags" ? "#194EFF" : "#3D3D3D"} />
          <p>Tag Management</p>
        </Link>
        <Link className={`${styles.link} ${pathname === "/settings" ? styles.active : ""}`} href={"/settings"}>
          <Settings width={20} height={20} fill={pathname === "/settings" ? "#194EFF" : "#3D3D3D"} />
          <p>Settings</p>
        </Link>
        <Link className={`${styles.link} ${pathname === "/profile" ? styles.active : ""}`} href={"/profile"}>
          <User width={20} height={20} fill={pathname === "/profile" ? "#194EFF" : "#3D3D3D"} />
          <p>Profile</p>
        </Link>
      </div>
      <div className={styles.pfp}>
        <Image className={styles.img} alt="pfp" src={user?.profilePicture || ""} width={24} height={24} quality={100} />
        <p>{user?.name || "Guest"}</p>
      </div>
    </div>
  )
}

export default Sidebar