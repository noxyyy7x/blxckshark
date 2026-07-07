// Size sets by product type — each product picks the right set based on
// its category, per the sizing plan confirmed with real measurements.

export const SIZE_SETS = {
  apparel: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  socks: ['UK 3-5', 'UK 6-8', 'UK 9-11', 'UK 12-14'],
  capsAdjustable: ['One Size', 'Adjustable'],
  oneSize: ['One Size'],
  shakers: ['700ml', '1000ml'],
  bottles: ['500ml', '750ml', '1000ml', '2000ml'],
}

export function getSizeSetKey(gender, type, subcategory) {
  if (gender === 'Accessories') {
    if (type === 'Socks') return 'socks'
    if (type === 'Caps') return 'capsAdjustable'
    if (type === 'Water Bottles') return 'bottles'
    if (type === 'Shaker Bottles') return 'shakers'
    return 'oneSize' // bags, backpacks, beanies, straps, towels
  }
  if (type === 'Underwear & Basics' && subcategory === 'Socks') return 'socks'
  return 'apparel' // all clothing, including Base Layers and Sports Bras
}

export function getSizesFor(gender, type, subcategory) {
  return SIZE_SETS[getSizeSetKey(gender, type, subcategory)]
}
