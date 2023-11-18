export interface Address {
    city: string
    country: string
    state: string
    postal_code: string
}

export interface CreditCard {
    number: string
    expire_at: string
}

export interface Person {
    uid: string
    first_name: string
    last_name: string
    addresses: Array<Address>
    medical_status: Array<string>
    credit_card: CreditCard
}

export interface User {
    user_id: string
    roles: Array<string>
}