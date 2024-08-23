import { DAO } from '@main/base/dao';
import { Pool } from 'pg';
import { Bank, BankDTO, PostBank } from '../types';
import { SQLById, SQLByUser, SQLDeleteBank, SQLEditBank, SQLGet, SQLNewBank } from './sql';

export class BankDAO extends DAO {
    constructor(public readonly connectionPool: Pool) {
        super(connectionPool);
    }

    async newBank(bank: PostBank): Promise<Bank> {
        try {
            const id = await this.execPostSQL(SQLNewBank, [bank.userId, bank.name], false);

            const newBank = await this.getFromId(id);

            if (!newBank) throw new Error;

            return newBank;
        } catch (error) {
            throw error;
        }
    }

    async getFromUser(userId: number): Promise<Bank[]> {
        let sql = SQLGet + SQLByUser;
        try {
            const banks = await this.query<BankDTO>(sql, [userId]);

            const formatted: Bank[] = banks.map((bank) => {
                return {
                    id: bank.id,
                    userId: bank.user_id,
                    name: bank.name
                }
            })

            return formatted;
        } catch (error) {
            throw error;
        }
    }

    async getFromId(id: number): Promise<Bank | null> {
        let sql = SQLGet + SQLById;
        try {
            const bank = await this.queryOne<BankDTO>(sql, [id]);

            if (!bank) return null;

            const formatted: Bank = {
                id: bank.id,
                userId: bank.user_id,
                name: bank.name
            }

            return formatted;
        } catch (error) {
            throw error;
        }
    }

    async editBank(
        id: number,
        bank: PostBank
    ): Promise<Bank> {
        try {
            await this.execSQL(SQLEditBank, [bank.name, id]);

            const editted = await this.getFromId(id);

            if (!editted) throw new Error;

            return editted;
        } catch (error) {
            throw error;
        }
    }

    async deleteBank(id: number): Promise<void> {
        try {
            await this.execSQL(SQLDeleteBank, [id]);
            return;
        } catch (error) {
            throw error;
        }
    }
}
