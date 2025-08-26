'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './Header.module.scss'
import { User } from '@/types'
import { ArrowDown, Logout, Settings } from '../icons'
import { useUserStore } from '@/provider/user-store-provider'
import { axios_instance } from '@/lib/axios'
import { AxiosError } from 'axios'

const Header = () => {
  const router = useRouter()
  const _user = useUserStore(state => state.user)
  const setUser = useUserStore(state => state.setUser)
  const logoutUser = useUserStore(state => state.logoutUser)

  const [mounted, setMounted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [imageError, setImageError] = useState<boolean>(false)

  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchUser = async (): Promise<void> => {
    if (_user || loading) return
    
    try {
      setLoading(true)
      const response = await axios_instance.get('/user/me')
      const userData = response.data?.data
      if (userData) {
        setUser(userData)
      }
    } catch (err) {
      const error = err as AxiosError
      console.error('Failed to fetch user:', error)
      logoutUser()
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted && !_user) {
      fetchUser()
    }
  }, [mounted, _user])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element
      if (showMenu && !target.closest(`.${styles.actions}`)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  const handleLogout = (): void => {
    logoutUser()
    router.push('/')
  }

  const handleTag = (): void => {
    setShowMenu(false)
    router.push('/tags')
  }

  const toggleMenu = (): void => {
    setShowMenu(!showMenu)
  }

  const handleImageError = (): void => {
    setImageError(true)
  }

  const getPageTitle = (): string => {
    switch (pathname) {
      case '/tags':
        return 'My Tags'
      case '/kanban':
        return 'My Contacts'
      default:
        return 'Dashboard'
    }
  }

  const getPageSubtitle = (): string => {
    switch (pathname) {
      case '/tags':
        return 'Manage your tags'
      case '/kanban':
        return 'List of people for communication'
      default:
        return 'Welcome to your dashboard'
    }
  }

  const renderUserSection = () => {
    if (!mounted) {
      return <p className={styles.user}>Profile</p>
    }

    if (loading) {
      return <p className={styles.user}>Loading...</p>
    }

    if (_user) {
      return (
        <>
          <div className={styles.profileArea} onClick={toggleMenu}>
            {_user.profilePicture && !imageError ? (
              <Image
                src={_user.profilePicture}
                alt="User Profile Picture"
                width={24}
                height={24}
                className={styles.userPic}
                quality={100}
                onError={handleImageError}
                priority
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {_user.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <p className={styles.user}>{_user.name}</p>
            <div className={styles.dropdownArrow}>
              <ArrowDown width={20} height={20} fill='none' stroke='#00020F' />
            </div>
          </div>

          {showMenu && (
            <div className={styles.logoutmenu}>
              <div onClick={handleTag} className={styles.tagMenu}>
                <div className={styles.setting}>
                  <Settings width={16} height={16} fill='#00020F' />
                </div>
                <div className={styles.tag}>Tags management</div>
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
      )
    }

    return <p className={styles.user}>Profile</p>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.heading}>{getPageTitle()}</p>
        <p className={styles.subheading}>{getPageSubtitle()}</p>
      </div>

      <div className={styles.actions}>
        {renderUserSection()}
      </div>
    </div>
  )
}

export default Header
