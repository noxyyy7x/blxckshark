// Full product taxonomy, confirmed against Gymshark's actual site structure
// for Base Layers and Sports Bras (both standalone top-level types, not
// nested under Tops). Gift Cards intentionally excluded — on hold.

export const CATEGORIES = {
  Men: {
    Tops: [
      'Oversized T-Shirts', 'Performance T-Shirts', 'Graphic T-Shirts',
      'Long Sleeve Tops', 'Tank Tops', 'Stringers', 'Compression Tops', 'Quarter Zips',
    ],
    Bottoms: [
      'Shorts', '2-in-1 Shorts', 'Running Shorts', 'Joggers',
      'Sweatpants', 'Training Pants', 'Compression Shorts',
    ],
    Outerwear: ['Hoodies', 'Zip Hoodies', 'Sweatshirts', 'Jackets', 'Windbreakers', 'Gilets / Vests'],
    'Base Layers': ['Base Layers'],
    'Underwear & Basics': ['Boxers', 'Socks'],
  },
  Women: {
    Tops: [
      'Oversized T-Shirts', 'Gym T-Shirts', 'Crop Tops', 'Tank Tops',
      'Long Sleeve Tops', 'Running Tops',
    ],
    Bottoms: [
      'Leggings', 'Flared Leggings', 'Shorts', 'Cycling Shorts',
      'Joggers', 'Sweatpants', 'Unitards / All-in-Ones',
    ],
    Outerwear: ['Hoodies', 'Sweatshirts', 'Jackets', 'Tracksuits'],
    'Sports Bras': ['Low Support', 'Medium Support', 'High Support'],
  },
  Accessories: {
    'Gym Bags': ['Gym Bags'],
    'Duffel Bags': ['Duffel Bags'],
    Backpacks: ['Backpacks'],
    'Water Bottles': ['Water Bottles'],
    'Shaker Bottles': ['Shaker Bottles'],
    Caps: ['Caps'],
    Beanies: ['Beanies'],
    Socks: ['Socks'],
    'Lifting Straps': ['Lifting Straps'],
    Towels: ['Towels'],
  },
}

export const GENDERS = Object.keys(CATEGORIES)

export function getTypesForGender(gender) {
  return gender ? Object.keys(CATEGORIES[gender] || {}) : []
}

export function getSubcategoriesForType(gender, type) {
  return gender && type ? CATEGORIES[gender]?.[type] || [] : []
}

// General fit tags — Sports Bra support level is handled via subcategory
// itself (Low/Medium/High Support), not a separate fit tag.
export const FIT_TAGS = ['Slim Fit', 'Muscle Fit', 'Compression', 'Relaxed Fit']
