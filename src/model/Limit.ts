class MonthLimit {
    id?: number
    monthDescription: string
    month: number
    year: number
    limits: Limit[]

    constructor(monthDescription: string, month: number, year: number){
        this.monthDescription = monthDescription
        this.month = month
        this.year = year
        this.limits = []
    }
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

    constructor(description: string, percentage: number, month: number, year: number){
        this.description = description
        this.percentage = percentage
        this.month = month
        this.year = year
    }
}

class LimitCategory{
    id: number
    categoryId: number
    description: string
    limit: number

    constructor(id: number, categoryId: number, description: string, limit: number){
        this.id = id
        this.categoryId = categoryId
        this.description = description
        this.limit = limit
    }
}
