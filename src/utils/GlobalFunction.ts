export function currencyFormat(value: number) {
    return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
}

export function formatDate(date: Date) {
    return new Date(date).toLocaleDateString('pt-BR', {year: 'numeric', month: '2-digit', day: '2-digit'})
}