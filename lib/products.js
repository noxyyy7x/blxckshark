// Real product catalog — pulls from Supabase "products" table (admin-managed
// via /admin/products). Replaces the old mock data file.
import { supabase } from './supabaseClient'
import { GENDERS } from './categories'

export const CATEGORIES = GENDERS

export function getProductStock(product) {
  return (product.variants || []).reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
}

export function isInStock(product) {
  return getProductStock(product) > 0
}

export function getUniqueSizes(product) {
  return [...new Set((product.variants || []).map((v) => v.size).filter(Boolean))]
}

export function getUniqueColors(product) {
  return [...new Set((product.variants || []).map((v) => v.color))]
}

export async function getAllProducts() {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function getProductById(id) {
  const { data } = await supabase.from('products').select('*').eq('id', id).single()
  return data || null
}

export async function getProductsByCategory(category) {
  if (!category) return getAllProducts()
  const { data } = await supabase
    .from('products')
    .select('*')
    .ilike('category_group', category)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)
  return data || []
}

export async function searchProducts(query) {
  const q = query.trim()
  if (!q) return []
  const { data } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${q}%,subcategory.ilike.%${q}%,category_type.ilike.%${q}%`)
  return data || []
}

export async function getRelatedProducts(product, limit = 4) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category_group', product.category_group)
    .neq('id', product.id)
    .limit(limit)
  return data || []
}

// One representative product per top-level category (Men/Women/Accessories),
// used for the homepage collection tiles. Returns null for any category
// that has no products with images yet — the UI shows a placeholder then.
export async function getCategoryPreviews() {
  const { GENDERS } = await import('./categories')
  const previews = {}

  for (const gender of GENDERS) {
    const { data } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('category_group', gender)
      .not('images', 'eq', '{}')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    previews[gender] = data || null
  }

  return previews
}
