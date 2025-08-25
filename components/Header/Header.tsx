'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './Header.module.scss'
import { User } from '@/types'
import { ArrowDown, Logout, Settings } from '../icons'
import { useUserStore } from '@/provider/user-store-provider'
import { axios_instance } from '@/lib/axios'

const Header = () => {
  const router = useRouter()
  const storeUser = useUserStore(state => state.user)
  const logout = useUserStore(state => state.logoutUser)
  const [user, setUser] = useState<User | null>(storeUser)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  const pathname = usePathname();

  const fetchUser = async () => {
    axios_instance.get('/user/me')
      .then(response => {
        setLoading(false)
        console.log("User data:", response.data)
        setUser(response.data?.data)
      })
      .catch(error => {
        setLoading(false)
        console.error(error)
        localStorage.removeItem('token')
        router.push('/')
      })
  }

  useEffect(() => {
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
    logout()
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
        ) : user && user.profilePicture ? (
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
                  <div className={styles.tag} onClick={() => router.push('/tags')}>Tags man..</div>
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
