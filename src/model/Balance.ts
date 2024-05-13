class CategoryBalance {
    description: string;
    limit: number;
    value: number;

    constructor(description: string, limit: number, value: number) {
        this.description = description;
        this.limit = limit;
        this.value = value;
    }
}

class Balance {
    description: string;
    percentage: number;
    categories: CategoryBalance[];
    limitValue: number;
    limitTotal: number;
    total: number;

    constructor(description: string, percentage: number, categories: CategoryBalance[], limitValue: number, limitTotal: number, total: number) {
        this.description = description;
        this.percentage = percentage;
        this.categories = categories;
        this.limitValue = limitValue;
        this.limitTotal = limitTotal;
        this.total = total;
    }
}

class MonthBalance {
    month: number;
    balances: Balance[];
    income: number;
    expenses: number;
    total: number;

    constructor(month: number, balances: Balance[], income: number, expenses: number, total: number) {
        this.month = month;
        this.balances = balances;
        this.income = income;
        this.expenses = expenses;
        this.total = total;
    }
}