export const SQLNewBank = `
    insert into "Bank" (
        user_id
        , name
    ) values (
        :user_id
        , :name
    )`;

export const SQLGet = `
    select 
        id
        , user_id as 'userId'
        , "name" 
    from "Bank" 
`

export const SQLByUser = ` where user_id = :user_id`;

export const SQLById = ` where id = :id`;

export const SQLEditBank = `
    update "Bank"
        set name = :name
    where id = :id;
`;

export const SQLDeleteBank = `
    delete from "Bank" where id = :id
`