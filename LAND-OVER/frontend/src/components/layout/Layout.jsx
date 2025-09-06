// import React from 'react'
// import Header from './Header'
// import Footer from './Footer'

// const Layout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
//       <Header />
//       <main className="flex-1">{children}</main>
//       <Footer />
//     </div>
//   )
// }

// export default Layout


import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1">
        <Outlet />   {/* 👈 This renders Home, Properties, etc. */}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
