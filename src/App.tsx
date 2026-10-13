import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import PublicLayout from '@/components/layout/PublicLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'

import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import ContactPage from '@/pages/ContactPage'
import NotFoundPage from '@/pages/NotFoundPage'

import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminProductFormPage from '@/pages/admin/AdminProductFormPage'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage'
import AdminCategoryFormPage from '@/pages/admin/AdminCategoryFormPage'
import AdminBlogPage from '@/pages/admin/AdminBlogPage'
import AdminBlogFormPage from '@/pages/admin/AdminBlogFormPage'
import AdminEnquiriesPage from '@/pages/admin/AdminEnquiriesPage'
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin login (no layout) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/products/:id" element={<AdminProductFormPage />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/categories/:id" element={<AdminCategoryFormPage />} />
              <Route path="/admin/blog" element={<AdminBlogPage />} />
              <Route path="/admin/blog/:id" element={<AdminBlogFormPage />} />
              <Route path="/admin/enquiries" element={<AdminEnquiriesPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
