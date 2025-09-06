import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from '../components/layout/Layout'
import Home from '../pages/Home'
import Properties from '../pages/Properties'
import PropertyDetail from '../pages/PropertyDetail'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'

import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
