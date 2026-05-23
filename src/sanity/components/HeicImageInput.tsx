'use client'

import { useEffect, useRef } from 'react'
import type { ObjectInputProps } from 'sanity'
import heic2any from 'heic2any'

function isHeic(file: File) {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.(heic|heif)$/i.test(file.name)
  )
}

async function toJpeg(file: File): Promise<File> {
  const result = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 })
  const blob = Array.isArray(result) ? result[0] : result
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
    type: 'image/jpeg',
  })
}

export function HeicImageInput(props: ObjectInputProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const onFileChange = async (e: Event) => {
      const input = e.target as HTMLInputElement
      if (input.tagName !== 'INPUT' || input.type !== 'file' || !input.files) return

      const files = Array.from(input.files)
      if (!files.some(isHeic)) return

      // Stop Sanity's handler from running with the raw HEIC file
      e.stopImmediatePropagation()

      const converted = await Promise.all(
        files.map((f) => (isHeic(f) ? toJpeg(f) : Promise.resolve(f))),
      )

      const dt = new DataTransfer()
      converted.forEach((f) => dt.items.add(f))

      // Replace the input's file list with converted JPGs
      Object.defineProperty(input, 'files', { value: dt.files, configurable: true })

      // Re-fire so Sanity's handler processes the JPG file
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }

    // Capture phase so we run before Sanity's handlers
    container.addEventListener('change', onFileChange, { capture: true })
    return () => container.removeEventListener('change', onFileChange, true)
  }, [])

  return <div ref={ref}>{props.renderDefault(props)}</div>
}
