class Category{
    id: number
    name: string
    values: string[]
    colorHex: string

    constructor(id: number, name: string, values: string[], colorHex: string){
        this.id = id
        this.name = name
        this.values = values
        this.colorHex = colorHex
    }
}