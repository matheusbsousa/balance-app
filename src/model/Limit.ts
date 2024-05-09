class MonthLimit {
    id?: number
    monthDescription: string
    month: number
    year: number
    limits: Limit[]
}

class Limit {
    id?: number
    description: string
    percentage: number
    monthLimitId?: number
    month: number
    year: number
    categoryIds?: number[]
    limitCategories?: LimitCategory[]
}

class LimitCategory{
    id: number
    categoryId: number
    description: string
    limit: number
}
