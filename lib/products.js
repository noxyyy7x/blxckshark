// Mock product data — structured to mirror what will eventually come from
// the admin panel (Supabase "products" table). Swap this file's contents
// for real Supabase queries once the admin panel/product schema is built.
// Field shape here is the contract the rest of the app expects.

export const CATEGORIES = ['Men', 'Women', 'Accessories']
export const FIT_TAGS = ['Slim Fit', 'Muscle Fit', 'Compression', 'Relaxed Fit']
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const PRODUCTS = [
  {
    id: 'bs-tee-001',
    name: 'Core Performance Tee',
    category: 'Men',
    fitTags: ['Muscle Fit'],
    price: { gbp: 30, usd: 38, eur: 34 },
    colors: ['Black', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    images: [],
    description:
      'Engineered from a lightweight, breathable performance fabric built to move with you. Tapered through the body for a muscle-fit silhouette without restricting movement.',
    fabric: '88% Polyester, 12% Elastane',
    care: 'Machine wash cold. Do not tumble dry.',
    isFeatured: true,
  },
  {
    id: 'bs-hoodie-001',
    name: 'Signature Hoodie',
    category: 'Men',
    fitTags: ['Relaxed Fit'],
    price: { gbp: 55, usd: 70, eur: 62 },
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    images: [],
    description:
      'Heavyweight fleece hoodie with a relaxed drop-shoulder fit. Brushed interior for warmth without the bulk.',
    fabric: '80% Cotton, 20% Polyester',
    care: 'Machine wash cold. Tumble dry low.',
    isFeatured: true,
  },
  {
    id: 'bs-legging-001',
    name: 'Flex Leggings',
    category: 'Women',
    fitTags: ['Compression'],
    price: { gbp: 38, usd: 48, eur: 42 },
    colors: ['Black', 'Grey'],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    images: [],
    description:
      'Second-skin compression leggings with four-way stretch. Squat-proof fabric with a high-waisted, sculpting fit.',
    fabric: '75% Nylon, 25% Elastane',
    care: 'Machine wash cold. Do not bleach.',
    isFeatured: true,
  },
  {
    id: 'bs-jogger-001',
    name: 'Tapered Joggers',
    category: 'Men',
    fitTags: ['Slim Fit'],
    price: { gbp: 45, usd: 58, eur: 50 },
    colors: ['Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: false,
    images: [],
    description:
      'Slim tapered joggers built for training or off-duty. Zippered pockets, ribbed cuffs, four-way stretch fabric.',
    fabric: '92% Polyester, 8% Elastane',
    care: 'Machine wash cold.',
    isFeatured: true,
  },
  {
    id: 'bs-sports-bra-001',
    name: 'Sculpt Sports Bra',
    category: 'Women',
    fitTags: ['Compression'],
    price: { gbp: 28, usd: 36, eur: 32 },
    colors: ['Black', 'White'],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    images: [],
    description: 'High-support sports bra with a racerback design and removable padding.',
    fabric: '78% Nylon, 22% Elastane',
    care: 'Hand wash recommended.',
    isFeatured: false,
  },
  {
    id: 'bs-cap-001',
    name: 'Monogram Cap',
    category: 'Accessories',
    fitTags: [],
    price: { gbp: 20, usd: 26, eur: 23 },
    colors: ['Black'],
    sizes: [],
    inStock: true,
    images: [],
    description: 'Structured six-panel cap with an embroidered monogram badge.',
    fabric: '100% Cotton twill',
    care: 'Spot clean only.',
    isFeatured: false,
  },
]

export function getAllProducts() {
  return PRODUCTS
}

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null
}

export function getProductsByCategory(category) {
  if (!category) return PRODUCTS
  return PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase())
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.isFeatured)
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.fitTags.some((tag) => tag.toLowerCase().includes(q))
  )
}

export function getRelatedProducts(product, limit = 4) {
  return PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit)
}
