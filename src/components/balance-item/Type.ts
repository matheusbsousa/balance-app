export class BalanceItemModel {
    title: string
    percentage: number
    percentageValue: number
    balance: number
    categoryBalances: CategoryEstimation[]
    total: Total

    constructor(title: string, balance: number, percentageValue: number, balanceClass: string, percentage: number, categoryValues: CategoryEstimation[], total: Total) {
        this.title = title
        this.balance = balance
        this.percentageValue = percentageValue
        this.percentage = percentage
        this.categoryBalances = categoryValues
        this.total = total
    }

    isLimitOverextended(real: number, estimation: number): boolean {
        return real > estimation
    }
}

type CategoryEstimation = {
    description: string,
    estimation: number,
    real: number,
}

type Total = {
    estimation: number,
    real: number,
}

