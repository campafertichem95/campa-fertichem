import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import PublicLayout from '@/components/layout/PublicLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import AdminLayout from '@/components/layout/AdminLayout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const BlogPage = lazy(() => import('@/pages/BlogPage'))
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'))
const AdminProductFormPage = lazy(() => import('@/pages/admin/AdminProductFormPage'))
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'))
const AdminCategoryFormPage = lazy(() => import('@/pages/admin/AdminCategoryFormPage'))
const AdminBlogPage = lazy(() => import('@/pages/admin/AdminBlogPage'))
const AdminBlogFormPage = lazy(() => import('@/pages/admin/AdminBlogFormPage'))
const AdminEnquiriesPage = lazy(() => import('@/pages/admin/AdminEnquiriesPage'))
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage'))

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
