type LoginAuthResponse = {
    access: string
    refresh: string
}

type UserDataResponse  = {
    avatar : string  
    email: string
    first_name: string
    last_name: string
    username: string
    phone_number: string
    ref_code: string
    balance: number
    usdt_wallet: string
    is_fundator: boolean
}