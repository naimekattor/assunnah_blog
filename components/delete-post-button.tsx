"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deletePost } from "@/app/dashboard/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Swal from "sweetalert2"

interface DeletePostButtonProps {
  postId: string
  redirectUrl?: string
  variant?: "outline" | "destructive" | "ghost" | "default"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function DeletePostButton({ 
  postId, 
  redirectUrl, 
  variant = "destructive",
  size = "default",
  className 
}: DeletePostButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি এই নিবন্ধটি মুছে ফেলতে চাচ্ছেন! এটি আর ফিরে পাওয়া যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "oklch(0.35 0.06 183.01)",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল",
      background: "#ffffff",
      color: "#0f172a",
    })

    if (result.isConfirmed) {
      try {
        await deletePost(postId)
        toast.success("নিবন্ধটি মুছে ফেলা হয়েছে")
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.refresh()
        }
      } catch (error) {
        toast.error("মুছে ফেলতে সমস্যা হয়েছে")
      }
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleDelete}
      className={className}
    >
      <Trash2 className={size === "icon" ? "w-4 h-4" : "w-4 h-4 mr-2"} />
      {size !== "icon" && "ডিলিট করুন"}
    </Button>
  )
}
