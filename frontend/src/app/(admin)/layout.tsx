import React from 'react'
import AdminNav from '../../components/layout/AdminNav';

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='bg-slate-50'>
      <AdminNav>
        {children}
      </AdminNav>
    </div>
  )
}

export default Layout