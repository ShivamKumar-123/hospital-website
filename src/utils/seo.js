// Tiny per-page SEO hook. Mutates <title>, meta tags, canonical link and
// Open Graph / Twitter cards on route change. Cleaner than pulling in
// react-helmet just to set a few tags.

import { useEffect } from 'react'

// Override at build time with VITE_SITE_URL=https://your-domain.com
const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SITE_URL) ||
  'https://medicare.health'

const SITE_NAME = 'MediCare+ Hospital'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.jpg`
const DEFAULT_DESCRIPTION =
  'MediCare+ is a premium multi-specialty hospital with 24/7 emergency, expert consultants and modern diagnostics. Book appointments, find doctors and read health insights.'

// Find an existing tag matching the attr/value, or create one.
const upsertMeta = (attr, value, content) => {
  if (typeof document === 'undefined') return
  let el = document.head.querySelector(`meta[${attr}="${value}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const upsertLink = (rel, href) => {
  if (typeof document === 'undefined') return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * useSeo({ title, description, image, type, noindex, keywords, path })
 *
 *   title       — page title (suffixed with site name automatically unless ends with it)
 *   description — meta description (~150-160 chars)
 *   image       — absolute or root-relative OG image
 *   type        — og:type ('website' | 'article' | 'profile' …)
 *   noindex     — true → robots: noindex,nofollow
 *   keywords    — array of strings
 *   path        — override canonical path (default = window.location.pathname)
 */
export const useSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  keywords,
  path
} = {}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return

    const fullTitle = title
      ? (title.includes(SITE_NAME.split(' ')[0]) ? title : `${title} | ${SITE_NAME}`)
      : `${SITE_NAME} — Premium Multi-Specialty Healthcare`

    document.title = fullTitle

    const pathname = path || (typeof window !== 'undefined' ? window.location.pathname : '/')
    const url = `${SITE_URL}${pathname}`
    const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

    upsertMeta('name', 'description', description)
    if (keywords?.length) upsertMeta('name', 'keywords', keywords.join(', '))
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')

    upsertLink('canonical', url)

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:site_name', SITE_NAME)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)
  }, [title, description, image, type, noindex, keywords?.join('|'), path])
}

export const SEO_SITE_URL = SITE_URL
export const SEO_SITE_NAME = SITE_NAME
