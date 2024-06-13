
class MonthEntryList {
    monthDescription?: string
    month?: number
    categorizedEntries: CategorizedEntries[]

    constructor(monthDescription: string, month: number){
        this.monthDescription = monthDescription
        this.month = month
        this.categorizedEntries = []
    }
}

class CategorizedEntries{
    category: string
    entries: Entry[]
    total: number
    colorHex: string

    constructor(category: string, colorHex: string){
        this.category = category
        this.colorHex = colorHex
        this.entries = []
        this.total = 0
    }


}

class Entry {
    id?: number
    date: Date
    value: number
    category: Category
    description: string
    isIgnored: boolean

    constructor(date: Date, value: number, category: Category, description: string, isIgnored: boolean){
        this.date = date
        this.value = value
        this.category = category
        this.description = description
        this.isIgnored = isIgnored
    }
}
