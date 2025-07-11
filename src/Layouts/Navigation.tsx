import Logo from '../components/Common/Logo'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import AppMenu from './Menu'
import { useTranslation } from 'react-i18next'
import { useGetUserQuery } from '../store/api/auth/authApiSlice'
import { MenuItemTypes } from '../constants/menu'
import { useGetDashboardStadisticsQuery } from '../store/api/dashboard/useDashboardApiSlice'

const SideBarContent = () => {

  const { t } = useTranslation()

  const MENU_ITEMS: MenuItemTypes[] = [
    //Navigation
    {
      key: 'main',
      label: t('Main'),
      isTitle: true,
    },
    {
      key: 'Admin withdrawals',
      label: t('Admin Withdrawals'),
      isTitle: false,
      icon: 'fi fi-rr-money',
      url: "/admin-withdrawals",
      onlyAdmin: true
    },
    {
      key: 'dashboard',
      label: t('Dashboard'),
      isTitle: false,
      icon: 'fi fi-rr-dashboard',
      url: "/dashboard"
    },
    // {
    //   key: 'marketplace',
    //   label: t('Marketplace'),
    //   isTitle: false,
    //   icon: 'fi fi-rr-shop',
    //   url: "https://marketplace.capitalmarket.app/",
    //   isExternal: true
    // },
    {
      key: 'deposits',
      label: t('Deposits'),
      isTitle: false,
      icon: 'fi fi-rr-sack-dollar',
      url: "/deposits"
    },
    {
      key: 'withdrawals',
      label: t('Withdrawals'),
      isTitle: false,
      icon: 'fi fi-rr-bank',
      url: "/withdrawals"
    },


    {
      key: 'profile',
      label: t('Profile'),
      isTitle: false,
      icon: 'fi fi-rr-user',
      url: "/profile"
    },

    // {
    //   key: 'binarytree',
    //   label: t('My Tree'),
    //   isTitle: false,
    //   icon: 'fi fi-tr-sitemap',
    //   url: "/network-marketing"
    // },
    {
      key: 'referrals',
      label: t('Referrals'),
      isTitle: false,
      icon: 'fi fi-rr-users-alt',
      url: "/referrals"
    },
    {
      key: 'payments',
      label: t('Payments'),
      isTitle: false,
      icon: 'fi fi-rr-checklist-task-budget',
      url: "/payments"
    },
    {
      key: 'investment-all',
      label: t('Investment Panel'),
      isTitle: false,
      icon: 'fi fi-rr-newspaper',
      url: "/investment-panel"
    },


  ]

  return (
    <>
      <AppMenu menuItems={MENU_ITEMS} />
      <div className="clearfix" />
    </>
  )
}
const Navigation = () => {

  const { t } = useTranslation()
  const { data: user } = useGetUserQuery()
  const { data: dashboard } = useGetDashboardStadisticsQuery()


  return (
    <>
      <aside className="leftside-menu position-fixed top-0 bottom-0 z-1040">
        <div className="navigation-header top-0 sticky-top z-1020 px-4">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <SimpleBar
          id="leftside-menu-container"
          data-simplebar=""
          style={{ height: 'calc(100%  - 4.5rem)' }}>
          {/* Sidemenu */}
          <SideBarContent />
          {/* Sidemenu Card */}
          <div className='px-4 mt-4'>
            <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
              <span>{t("Balance")}</span>
              <span>${user?.balance?.toLocaleString() || 0} USD</span>
            </div>
            <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
              <span>{t("Earnings")}</span>
              <span>${user?.investment_balance?.toLocaleString() || 0} USD</span>
            </div>
            <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
              <span>{t("Investment")}</span>
              <span>${dashboard?.investment_amount?.toLocaleString() || 0} USD</span>
            </div>
            <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
              <span>{t("Cuenta Metatrader5")}</span>
              <span>*****</span>
            </div>
            <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
              <span>{t("Contraseña")}</span>
              <span>***</span>
            </div>
            <div className='d-flex justify-content-between border-bottom pb-2 mb-2'>
              <span>{t("Servidor")}</span>
              <span>***</span>
            </div>
          </div>
        </SimpleBar>
      </aside>
    </>
  )
}

export default Navigation
