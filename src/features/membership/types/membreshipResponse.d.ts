export interface MembershipReponse {
    id: number
    name:string
    description: string
    duration:number
    price: number
    discountPrice: number | null
    offerStartDate: string | null  
    offerEndDate: string | null
    image: string
    status: boolean
    capacityLimit: number
    active: boolean | null
    expired: boolean | null
    remainingDays: number | null
    enrolledMembers: number
}