'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './Header.module.scss'
import { User } from '@/types'
import { ArrowDown, Logout, Settings } from '../icons'

const Header = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) throw new Error('Failed to fetch user data')

        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error(error)
        localStorage.removeItem('token')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showMenu && !target.closest(`.${styles.actions}`)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.heading}>
          {pathname == "/tags" && "My Tags"}
          {pathname == "/kanban" && "My Contacts"}
        </p>
        <p className={styles.subheading}>
          {pathname == "/kanban" && "List of people for communication"}
          {pathname == "/tags" && "Manage your tags"}
        </p>
      </div>

      <div className={styles.actions}>
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
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
              <div className={styles.dropdownArrow}  >
                <ArrowDown width={20} height={20} fill='none' stroke='#00020F' />
              </div>
            </div>

            {showMenu && (
              <div className={styles.logoutmenu}>
                <div className={styles.tagMenu}>
                  <div className={styles.setting}>
                    {/* <Image src="/images/settings.png" alt="Settings" width={16} height={16} /> */}
                    <Settings width={16} height={16} fill='#00020F' />
                  </div>
                  <div className={styles.tag}>Tags man..</div>
                </div>
                <div onClick={handleLogout} className={styles.logoutButton}>
                  <div className={styles.logout}>
                    {/* <Image src="/images/logout.png" alt="Logout" width={16} height={16} /> */}
                    <Logout width={16} height={16} fill='#FB7285' />
                  </div>
                  <div className={styles.logoutText}>Logout</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className={styles.user}>Profile</p>
        )}
      </div>
    </div>
  )
}

export default Header
