export type Credentials = {
    email: string;
    password: string;
}

export type User = {
    name: string;
    email: string;
    multiple_bank: boolean;
    type_currency: string;
}

export type InfoUser = User & {
    password: string;
}

export type tokens = {
    token: string;
    refreshToken: string;
}