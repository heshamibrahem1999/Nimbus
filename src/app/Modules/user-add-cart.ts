export interface UserAddCart {
    id: string,
    ItemsInCart: Array<{
        Id: number,
        Count: number
    }>
}
