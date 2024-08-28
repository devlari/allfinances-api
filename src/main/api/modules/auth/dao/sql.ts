export const SQLRegister = `
    insert into "User" (
        name
        , email
        , "password"
        , multiple_bank 
        , type_currency 
    ) values (
        $1
        , $2
        , $3
        , $4
        , $5
    ) RETURNING id
`;

export const SQLLogin = `
    select id, password from "User" where email = $1;
`;

export const SQLGetUser = `
    select 
        name
        , email
        , multiple_bank
        , type_currency 
    from "User" 
    where id = $1;
`;