export interface MembershipRequest {
  name: string
  description: string
  duration: number
  price: number
  discountPrice: number | null
  offerStartDate: string | null
  offerEndDate: string | null
  image: File | null
  status: boolean
  capacityLimit: number
}