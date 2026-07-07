'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { getStaffProfile, logActivity } from '@/lib/staff'
import { CATEGORIES, GENDERS, getTypesForGender, getSubcategoriesForType, FIT_TAGS } from '@/lib/categories'
import { getSizesFor } from '@/lib/productSizes'
import { getColorSwatch } from '@/lib/colorSwatches'

const USD_MULTIPLIER = 1.25
const EUR_MULTIPLIER = 1.15

const emptyForm = {
  name: '', gender: '', type: '', subcategory: '',
  description: '', fabric: '', care: '',
  fitTags: [], priceGbp: '', priceUsd: '', priceEur: '',
  colorsInput: '', selectedSizes: [], featured: false,
}

export default function AdminProductsPage() {
  const { user } = useAuth()
  const [staffId, setStaffId] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [variantStock, setVariantStock] = useState({})
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (user) getStaffProfile(user.id).then((s) => setStaffId(s?.id))
    loadProducts()
  }, [user])

  async function loadProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }

  const types = getTypesForGender(form.gender)
  const subcategories = getSubcategoriesForType(form.gender, form.type)
  const availableSizes = form.gender && form.type ? getSizesFor(form.gender, form.type, form.subcategory) : []
  const colors = form.colorsInput.split(',').map((c) => c.trim()).filter(Boolean)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleGenderChange(gender) {
    setForm((prev) => ({ ...prev, gender, type: '', subcategory: '', selectedSizes: [] }))
  }

  function handleTypeChange(type) {
    setForm((prev) => ({ ...prev, type, subcategory: '', selectedSizes: [] }))
  }

  function handlePriceGbpChange(value) {
    const gbp = parseFloat(value) || 0
    setForm((prev) => ({
      ...prev,
      priceGbp: value,
      priceUsd: gbp ? (gbp * USD_MULTIPLIER).toFixed(2) : '',
      priceEur: gbp ? (gbp * EUR_MULTIPLIER).toFixed(2) : '',
    }))
  }

  function toggleSize(size) {
    setForm((prev) => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size],
    }))
  }

  function toggleFitTag(tag) {
    setForm((prev) => ({
      ...prev,
      fitTags: prev.fitTags.includes(tag) ? prev.fitTags.filter((t) => t !== tag) : [...prev.fitTags, tag],
    }))
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)

    for (const file of files) {
      const path = `${crypto.randomUUID()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from('products').upload(path, file)
      if (!uploadError) {
        const { data } = supabase.storage.from('products').getPublicUrl(path)
        setImages((prev) => [...prev, data.publicUrl])
      }
    }
    setUploading(false)
  }

  function removeImage(url) {
    setImages((prev) => prev.filter((i) => i !== url))
  }

  function resetForm() {
    setForm(emptyForm)
    setVariantStock({})
    setImages([])
    setEditingId(null)
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.gender || !form.type || !form.subcategory || !form.priceGbp) {
      setError('Please fill in name, category, and price at minimum.')
      return
    }
    if (form.gender !== 'Accessories' && colors.length === 0) {
      setError('Add at least one color.')
      return
    }

    const variants = form.selectedSizes.length > 0
      ? form.selectedSizes.flatMap((size) =>
          (colors.length > 0 ? colors : ['Default']).map((color) => ({
            size, color, stock: Number(variantStock[`${size}-${color}`] || 0),
          }))
        )
      : (colors.length > 0 ? colors : ['Default']).map((color) => ({
          size: null, color, stock: Number(variantStock[`none-${color}`] || 0),
        }))

    setSaving(true)

    const payload = {
      name: form.name,
      category_group: form.gender,
      category_type: form.type,
      subcategory: form.subcategory,
      description: form.description,
      fabric: form.fabric,
      care: form.care,
      fit_tags: form.fitTags,
      images,
      price_gbp: parseFloat(form.priceGbp),
      price_usd: parseFloat(form.priceUsd),
      price_eur: parseFloat(form.priceEur),
      variants,
      is_featured: form.featured,
    }

    const { error: saveError } = editingId
      ? await supabase.from('products').update(payload).eq('id', editingId)
      : await supabase.from('products').insert(payload)

    if (saveError) {
      setError(saveError.message)
      setSaving(false)
      return
    }

    await logActivity(staffId, editingId ? 'product_updated' : 'product_created', { name: form.name })
    setSaving(false)
    resetForm()
    loadProducts()
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      gender: product.category_group,
      type: product.category_type,
      subcategory: product.subcategory,
      description: product.description || '',
      fabric: product.fabric || '',
      care: product.care || '',
      fitTags: product.fit_tags || [],
      priceGbp: String(product.price_gbp),
      priceUsd: String(product.price_usd),
      priceEur: String(product.price_eur),
      colorsInput: [...new Set(product.variants.map((v) => v.color))].join(', '),
      selectedSizes: [...new Set(product.variants.map((v) => v.size).filter(Boolean))],
      featured: product.is_featured,
    })
    const stockMap = {}
    product.variants.forEach((v) => {
      stockMap[`${v.size || 'none'}-${v.color}`] = v.stock
    })
    setVariantStock(stockMap)
    setImages(product.images || [])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deleteProduct(product) {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    await supabase.from('products').delete().eq('id', product.id)
    await logActivity(staffId, 'product_deleted', { name: product.name })
    loadProducts()
  }

  if (loading) {
    return <div className="p-8"><p className="font-body text-sm text-white/40">Loading...</p></div>
  }

  return (
    <div className="p-8">
      <h1 className="font-display mb-6 text-2xl font-bold uppercase tracking-tight">
        Products
      </h1>

      {/* Create/Edit form */}
      <form onSubmit={handleSave} className="mb-10 flex flex-col gap-5 rounded-lg border border-white/10 bg-white/[0.03] p-6">
        <p className="font-body text-sm font-semibold">{editingId ? 'Edit Product' : 'Add New Product'}</p>

        <input
          type="text"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
        />

        {/* Category cascade */}
        <div className="grid grid-cols-3 gap-3">
          <select
            value={form.gender}
            onChange={(e) => handleGenderChange(e.target.value)}
            className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none"
          >
            <option value="">Gender</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select
            value={form.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={!form.gender}
            className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none disabled:opacity-40"
          >
            <option value="">Type</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={form.subcategory}
            onChange={(e) => updateField('subcategory', e.target.value)}
            disabled={!form.type}
            className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none disabled:opacity-40"
          >
            <option value="">Subcategory</option>
            {subcategories.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Fit tags */}
        {form.gender !== 'Accessories' && (
          <div className="flex flex-wrap gap-2">
            {FIT_TAGS.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => toggleFitTag(tag)}
                className={`font-body rounded-full border px-3 py-1 text-xs ${
                  form.fitTags.includes(tag) ? 'border-white bg-white text-black' : 'border-white/20 text-white/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Description / fabric / care */}
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={2}
          className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Fabric (e.g. 88% Polyester, 12% Elastane)"
            value={form.fabric}
            onChange={(e) => updateField('fabric', e.target.value)}
            className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
          />
          <input
            type="text"
            placeholder="Care instructions"
            value={form.care}
            onChange={(e) => updateField('care', e.target.value)}
            className="font-body rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
          />
        </div>

        {/* Pricing */}
        <div>
          <p className="font-body mb-2 text-xs text-white/40">PRICING (USD/EUR auto-convert, editable)</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-white/50">£</span>
              <input
                type="number"
                step="0.01"
                placeholder="GBP"
                value={form.priceGbp}
                onChange={(e) => handlePriceGbpChange(e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-white/50">$</span>
              <input
                type="number"
                step="0.01"
                placeholder="USD"
                value={form.priceUsd}
                onChange={(e) => updateField('priceUsd', e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-white/50">€</span>
              <input
                type="number"
                step="0.01"
                placeholder="EUR"
                value={form.priceEur}
                onChange={(e) => updateField('priceEur', e.target.value)}
                className="font-body w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <p className="font-body mb-2 text-xs text-white/40">IMAGES</p>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="font-body text-xs" />
          {uploading && <p className="font-body mt-1 text-xs text-white/40">Uploading...</p>}
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((url) => (
                <div key={url} className="relative h-16 w-16 overflow-hidden rounded border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute right-0 top-0 bg-black/70 px-1 text-[10px] text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sizes + colors + stock */}
        {form.type && (
          <div>
            <p className="font-body mb-2 text-xs text-white/40">
              {availableSizes[0] === 'One Size' ? 'SIZE' : 'AVAILABLE SIZES'}
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`font-body rounded-full border px-3 py-1 text-xs ${
                    form.selectedSizes.includes(size) ? 'border-white bg-white text-black' : 'border-white/20 text-white/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Colors, comma separated (e.g. Black, White, Grey)"
              value={form.colorsInput}
              onChange={(e) => updateField('colorsInput', e.target.value)}
              className="font-body mb-2 w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-white/30"
            />
            {colors.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <span key={color} className="font-body flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/70">
                    <span
                      className="h-3 w-3 rounded-full border border-white/20"
                      style={{ backgroundColor: getColorSwatch(color) }}
                    />
                    {color}
                  </span>
                ))}
              </div>
            )}

            {/* Stock grid */}
            {(form.selectedSizes.length > 0 || colors.length > 0) && (
              <div className="overflow-x-auto rounded-md border border-white/10">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40">
                      <th className="p-2 text-left">Size</th>
                      <th className="p-2 text-left">Color</th>
                      <th className="p-2 text-left">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(form.selectedSizes.length > 0 ? form.selectedSizes : [null]).flatMap((size) =>
                      (colors.length > 0 ? colors : ['Default']).map((color) => {
                        const key = `${size || 'none'}-${color}`
                        return (
                          <tr key={key} className="border-b border-white/5">
                            <td className="p-2">{size || '—'}</td>
                            <td className="p-2">
                              <span className="flex items-center gap-1.5">
                                <span
                                  className="h-3 w-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: getColorSwatch(color) }}
                                />
                                {color}
                              </span>
                            </td>
                            <td className="p-2">
                              <input
                                type="number"
                                min="0"
                                value={variantStock[key] || ''}
                                onChange={(e) => setVariantStock((prev) => ({ ...prev, [key]: e.target.value }))}
                                className="w-20 rounded border border-white/15 bg-black/30 px-2 py-1 outline-none"
                              />
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <label className="font-body flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} />
          Featured on homepage
        </label>

        {error && <p className="font-body text-xs text-red-400">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="font-body rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="font-body text-sm text-white/50 underline">
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Product list */}
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              {p.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images[0]} alt="" className="h-12 w-12 rounded object-cover" />
              )}
              <div>
                <p className="font-body text-sm font-semibold">{p.name}</p>
                <p className="font-body text-xs text-white/40">
                  {p.category_group} · {p.category_type} · {p.subcategory} · £{Number(p.price_gbp).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="font-body rounded-md border border-white/20 px-3 py-1.5 text-xs">
                Edit
              </button>
              <button onClick={() => deleteProduct(p)} className="font-body rounded-md border border-red-400/30 px-3 py-1.5 text-xs text-red-400">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
