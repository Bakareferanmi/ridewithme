import { useEffect } from 'react'

interface DocumentMetaOptions {
  title: string
  description?: string
  image?: string
}

function upsertMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function useDocumentMeta({ title, description, image }: DocumentMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    if (description) {
      upsertMetaTag('name', 'description', description)
      upsertMetaTag('property', 'og:description', description)
    }
    upsertMetaTag('property', 'og:title', title)
    if (image) {
      upsertMetaTag('property', 'og:image', image)
    }

    return () => {
      document.title = previousTitle
    }
  }, [title, description, image])
}
