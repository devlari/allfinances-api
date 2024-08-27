import { Pool, PoolClient } from 'pg';
import { Bank, PostBank } from './types';
import { BankDAO } from './dao';

export class BankService {
    constructor(private bankDAO: BankDAO) { }

    async newBank(bank: PostBank): Promise<Bank> {
        try {
            await this.bankDAO.openConnection();

            const response = await this.bankDAO.newBank(bank);

            await this.bankDAO.commit();
            await this.bankDAO.closeConnection();

            return response;
        } catch (error) {
            await this.bankDAO.rollback();
            await this.bankDAO.closeConnection();
            throw error;
        }
    }

    async getFromUser(userId: number): Promise<Bank[]> {
        try {
            await this.bankDAO.openConnection();
            const response = await this.bankDAO.getFromUser(userId);
            await this.bankDAO.closeConnection();

            return response;
        } catch (error) {
            await this.bankDAO.closeConnection();
            throw error;
        }
    }

    async getFromId(id: number): Promise<Bank | null> {
        try {
            await this.bankDAO.openConnection();
            const response = await this.bankDAO.getFromId(id);
            await this.bankDAO.closeConnection();

            return response;
        } catch (error) {
            await this.bankDAO.closeConnection();
            throw error;
        }
    }

    async editBank(id: number, bank: PostBank): Promise<Bank> {
        try {
            await this.bankDAO.openConnection();

            const response = await this.bankDAO.editBank(id, bank);

            await this.bankDAO.commit();
            await this.bankDAO.closeConnection();

            return response;
        } catch (error) {
            await this.bankDAO.rollback();
            await this.bankDAO.closeConnection();
            throw error;
        }
    }

    async deleteBank(cod: number): Promise<void> {
        try {
            await this.bankDAO.openConnection();
            const response = await this.bankDAO.deleteBank(cod);
            await this.bankDAO.commit();
            await this.bankDAO.closeConnection();

            return response;
        } catch (error) {
            await this.bankDAO.rollback();
            await this.bankDAO.closeConnection();
            throw error;
        }
    }
}
