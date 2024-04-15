
class MonthEntryList {
    monthDescription?: string
    month?: number
    categorizedEntries: CategorizedEntries[]
}

class CategorizedEntries{
    category: string
    entries: Entry[]
    total: number
}

class Entry {
    id?: number
    date: Date
    value: number
    category: Category
    description: string
    isIgnored: boolean
}
