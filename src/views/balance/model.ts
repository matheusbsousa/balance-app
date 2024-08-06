import {BASE_URL} from "../../utils/Constants.ts";
import {Ref, ref} from "vue";
import {BalanceItemModel} from "../../components/balance-item/Type.ts";

type MonthBalance = {
    month: number,
    balanceItems: BalanceItemModel[]
}

export class BalanceModel {

    currentYear: Ref<number> = ref(new Date().getFullYear())
    currentMonth: Ref<number> = ref(new Date().getMonth())
    balances: Ref<MonthBalance[]> = ref<MonthBalance[]>([])

    constructor() {
        this.getYearBalance()
    }


    async getYearBalance() {
        try {
            let url = new URL(BASE_URL + '/balances')
            url.searchParams.append('year', this.currentYear.value.toString())
            const response = await fetch(url)
            // this.balances.value = await response.json()
            this.balances.value = [
                {
                    month: 7,
                    balanceItems: [
                        {
                            title: 'Income',
                            balance: 1000,
                            percentageValue: 100,
                            percentage: 100,
                            categoryBalances: [
                                {
                                    real: 1000,
                                    estimation: 1010,
                                    description: 'Salary'
                                }
                            ],
                            total: {
                                real: 1000,
                                estimation: 1010
                            },
                            isLimitOverextended(real: number, estimation: number): boolean {
                                return real > estimation

                            }
                        }
                    ]
                }
                ]
        } catch (error) {
            console.error('Error:', error);
        }
    }

    updateYear(newYear: number) {
        this.currentYear.value = newYear
        this.getYearBalance()
    }

    updateMonth(newMonth: number) {
        this.currentMonth.value = newMonth
    }

}