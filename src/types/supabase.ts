export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content_md: string | null
          content_html: string | null
          featured_image: string | null
          status: 'draft' | 'published'
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content_md?: string | null
          content_html?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published'
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          content_md?: string | null
          content_html?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published'
          published_at?: string | null
          updated_at?: string
        }
      }
      metadata: {
        Row: {
          post_id: string
          seo_title: string | null
          seo_description: string | null
          og_image: string | null
          tags: string[]
        }
        Insert: {
          post_id: string
          seo_title?: string | null
          seo_description?: string | null
          og_image?: string | null
          tags?: string[]
        }
        Update: {
          seo_title?: string | null
          seo_description?: string | null
          og_image?: string | null
          tags?: string[]
        }
      }
      affiliate_links: {
        Row: {
          id: string
          post_id: string
          product_name: string
          merchant: 'mercadolivre' | 'amazon' | 'outros'
          affiliate_url: string
          display_text: string | null
          click_count: number
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          product_name: string
          merchant?: 'mercadolivre' | 'amazon' | 'outros'
          affiliate_url: string
          display_text?: string | null
          click_count?: number
          created_at?: string
        }
        Update: {
          post_id?: string
          product_name?: string
          merchant?: 'mercadolivre' | 'amazon' | 'outros'
          affiliate_url?: string
          display_text?: string | null
          click_count?: number
        }
      }
      settings: {
        Row: {
          id: number
          site_title: string
          site_description: string | null
          analytics_id: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          site_title?: string
          site_description?: string | null
          analytics_id?: string | null
          updated_at?: string
        }
        Update: {
          site_title?: string
          site_description?: string | null
          analytics_id?: string | null
          updated_at?: string
        }
      }
    }
  }
}
