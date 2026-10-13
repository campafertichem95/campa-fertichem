export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Category, 'id' | 'created_at'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      blog_posts: {
        Row: BlogPost
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BlogPost, 'id' | 'created_at'>>
      }
      enquiries: {
        Row: Enquiry
        Insert: Omit<Enquiry, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Enquiry, 'id' | 'created_at'>>
      }
      site_settings: {
        Row: SiteSetting
        Insert: Omit<SiteSetting, 'id' | 'updated_at'>
        Update: Partial<Omit<SiteSetting, 'id'>>
      }
    }
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_path: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  slug: string
  short_description: string | null
  description: string | null
  image_path: string | null
  gallery: string[] | null
  specifications: Json | null
  usage_information: string | null
  seo_title: string | null
  seo_description: string | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  created_at: string
  updated_at: string
  categories?: Category
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  featured_image_path: string | null
  category: string | null
  seo_title: string | null
  seo_description: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  product_id: string | null
  message: string
  status: 'new' | 'in_progress' | 'resolved'
  internal_notes: string | null
  created_at: string
  updated_at: string
  products?: Pick<Product, 'id' | 'name'>
}

export interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string | null
  updated_at: string
}
