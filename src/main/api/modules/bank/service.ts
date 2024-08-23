import { Pool, PoolClient } from 'pg';
import { Bank, PostBank } from './types';
import { BankDAO } from './dao';

export class BankService {
    constructor(private connectionPool: Pool) { }

    async newBank(bank: PostBank): Promise<Bank> {
        const bankDAO = this.getDao();

        try {
            await bankDAO.openConnection();

            const response = await bankDAO.newBank(bank);

            await bankDAO.commit();
            await bankDAO.closeConnection();

            return response;
        } catch (error) {
            await bankDAO.rollback();
            await bankDAO.closeConnection();
            throw error;
        }
    }

    async getFromUser(userId: number): Promise<Bank[]> {
        const areasDAO = this.getDao();

        try {
            await areasDAO.openConnection();
            const response = await areasDAO.getFromUser(userId);
            await areasDAO.closeConnection();

            return response;
        } catch (error) {
            await areasDAO.closeConnection();
            throw error;
        }
    }

    async getFromId(id: number): Promise<Bank | null> {
        const areasDAO = this.getDao();

        try {
            await areasDAO.openConnection();
            const response = await areasDAO.getFromId(id);
            await areasDAO.closeConnection();

            return response;
        } catch (error) {
            await areasDAO.closeConnection();
            throw error;
        }
    }

    async editBank(id: number, bank: PostBank): Promise<Bank> {
        const areasDAO = this.getDao();

        try {
            await areasDAO.openConnection();

            const response = await areasDAO.editBank(id, bank);

            await areasDAO.commit();
            await areasDAO.closeConnection();

            return response;
        } catch (error) {
            await areasDAO.rollback();
            await areasDAO.closeConnection();
            throw error;
        }
    }

    async deleteBank(cod: number): Promise<void> {
        const areasDAO = this.getDao();

        try {
            await areasDAO.openConnection();
            const response = await areasDAO.deleteBank(cod);
            await areasDAO.commit();
            await areasDAO.closeConnection();

            return response;
        } catch (error) {
            await areasDAO.rollback();
            await areasDAO.closeConnection();
            throw error;
        }
    }

    private getDao(): BankDAO {
        return new BankDAO(this.connectionPool);
    }
}
