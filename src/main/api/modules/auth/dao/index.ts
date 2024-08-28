import { DAO } from '@/main/base/dao';
import { Pool } from 'pg';
import { User, Credentials, InfoUser } from '../types';
import { SQLGetUser, SQLLogin, SQLRegister } from './sql';
import bcrypt from 'bcrypt';

export class AuthDAO extends DAO {
    constructor(public readonly connectionPool: Pool) {
        super(connectionPool);
    }

    async register(info: InfoUser): Promise<number> {
        try {
            const id = await this.execPostSQL(SQLRegister, [info.name, info.email, info.password, info.multiple_bank, info.type_currency], false);
            return id;
        } catch (error) {
            throw error;
        }
    }

    async login(credentials: Credentials): Promise<number | null> {
        try {
            const res = await this.queryOne<{ id: number, password: string }>(SQLLogin, [credentials.email]);

            if (!res) return null;

            const isPasswordValid = await bcrypt.compare(credentials.password, res.password);

            if (!isPasswordValid) return null;

            return res.id;
        } catch (error) {
            throw error;
        }
    }

    async me(id: number): Promise<User | null> {
        try {
            const user = await this.queryOne<User>(SQLGetUser, [id]);

            if (!user) return null;

            const formatted: User = {
                email: user.email,
                multiple_bank: user.multiple_bank,
                name: user.name,
                type_currency: user.type_currency
            }

            return formatted;
        } catch (error) {
            throw error;
        }
    }

    //todo
    async refreshToken(token: string): Promise<void> {
        try {
        } catch (error) {
            throw error;
        }
    }
}
