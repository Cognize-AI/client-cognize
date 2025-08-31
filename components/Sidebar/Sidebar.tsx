'use client'
import Image from "next/image"
import styles from "./Sidebar.module.scss"
import Link from "next/link"
import { ArrowDown, Dashboard, Logout, Settings, Tag } from "../icons"
import { useUserStore } from "@/provider/user-store-provider"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { axios_instance } from "@/lib/axios"
import { User } from "@/types"

const Sidebar = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(true);
    const _user = useUserStore(state => state.user);
    const logoutUser = useUserStore(state => state.logoutUser);
    
    const [user, setUser] = useState<User | null>(_user);
    const router = useRouter();

    const fetchUser = async () => {
        axios_instance
            .get('/user/me')
            .then(response => {
                const fetchedUser = response.data?.data;
                setUser(fetchedUser);
            })
            .catch(error => {
                console.error("Failed to fetch user:", error);
                logoutUser();
                router.push('/');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (showMenu && !target.closest(`.${styles.userProfile}`)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    const toggleMenu = () => setShowMenu(!showMenu);

    const handleLogout = () => {
        logoutUser();
        router.push('/');
    };

    const handleTag = () => {
      router.push('/tags');
    };

    const pathname = usePathname();
    const isKanbanActive = pathname.startsWith('/kanban');

    return (
        <div className={styles.sidebar}>
            <Image alt="Logo" priority quality={100} src={"/logo.svg"} width={200} height={52} />
            
            <div className={styles.actions}>
                <Link className={`${styles.link} ${isKanbanActive ? styles.active : ""}`} href={"/kanban"}>
                    <Dashboard width={20} height={20} fill={isKanbanActive ? "#194EFF" : "#3D3D3D"} />
                    <p>Dashboards</p>
                </Link>
                <Link className={`${styles.link} ${pathname === "/tags" ? styles.active : ""}`} href={"/tags"}>
                    <Tag width={20} height={20} fill={pathname === "/tags" ? "#194EFF" : "#3D3D3D"} />
                    <p>Tag Management</p>
                </Link>
            </div>
            
            <div className={styles.userProfile}>
                {loading ? (
                    <p></p>
                ) : user && user?.profilePicture ? (
                    <>
                        <div className={styles.profileArea} onClick={toggleMenu}>
                            <Image
                                src={user.profilePicture}
                                alt="User Profile Picture"
                                width={24}
                                height={24}
                                className={styles.userPic}
                                quality={100}
                            />
                            <p className={styles.user}>{user.name}</p>
                            <div className={styles.dropdownArrow}>
                                <ArrowDown width={20} height={20} fill='none' stroke='#00020F' rotate={100} />
                            </div>
                        </div>
                        {showMenu && (
                            <div className={styles.logoutmenu}>
                                <div onClick={handleTag} className={styles.tagMenu}>
                                    <div className={styles.setting}>
                                        <Settings width={16} height={16} fill='#00020F' />
                                    </div>
                                    <div className={styles.tag}>
                                        Tags man..
                                    </div>
                                </div>
                                <div onClick={handleLogout} className={styles.logoutButton}>
                                    <div className={styles.logout}>
                                        <Logout width={16} height={16} fill='#FB7285' />
                                    </div>
                                    <div className={styles.logoutText}>Logout</div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className={styles.user}></p>
                )}
            </div>
        </div>
    );
}

export default Sidebar;
