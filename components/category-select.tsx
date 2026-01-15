"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name_en: string
  name_bn: string
  slug: string
}

interface CategorySelectProps {
  value?: string
  onChange: (categoryId: string) => void
  required?: boolean
}

export function CategorySelect({ value, onChange, required = false }: CategorySelectProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const result = await response.json()

        if (response.ok) {
          setCategories(result.data || [])
        } else {
          setError(result.error || "Failed to load categories")
        }
      } catch (err) {
        setError("Failed to load categories")
        console.error("Error fetching categories:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>বিভাগ (Category)</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="লোড হচ্ছে..." />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Label>বিভাগ (Category)</Label>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="category">
        বিভাগ (Category) {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger id="category">
          <SelectValue placeholder="একটি বিভাগ নির্বাচন করুন..." />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name_bn} ({category.name_en})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
