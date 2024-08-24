export const SQLNewBank = `
    insert into "Bank" (
        user_id
        , name
    ) values (
        $1
        , $2
    ) RETURNING id`;

export const SQLGet = `
    select 
        id
        , user_id as userId
        , "name" 
    from "Bank" 
`

export const SQLByUser = ` where user_id = $1`;

export const SQLById = ` where id = $1`;

export const SQLEditBank = `
    update "Bank"
        set name = $1
    where id = $2;
`;

export const SQLDeleteBank = `
    delete from "Bank" where id = $1
`