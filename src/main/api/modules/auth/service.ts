import { Credentials, InfoUser, tokens, User } from './types';
import { AuthDAO } from './dao';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { badRequest, notFound } from '../../helpers/http-helper';
import { HttpResponse } from '../../helpers/http';

export class AuthService {
    constructor(private authDAO: AuthDAO) { }

    async register(info: InfoUser): Promise<tokens> {
        try {
            await this.authDAO.openConnection();

            const id = await this.authDAO.register(info);

            await this.authDAO.commit();
            await this.authDAO.closeConnection();

            const tokens = this.getTokens(id);

            return tokens;
        } catch (error) {
            await this.authDAO.rollback();
            await this.authDAO.closeConnection();
            throw error;
        }
    }

    async login(credentials: Credentials): Promise<tokens | null> {
        try {
            await this.authDAO.openConnection();
            const id = await this.authDAO.login(credentials);
            await this.authDAO.closeConnection();

            if (!id) return null;

            const tokens = this.getTokens(id);

            return tokens;
        } catch (error) {
            await this.authDAO.closeConnection();
            throw error;
        }
    }

    async me(id: number): Promise<User | null> {
        try {
            await this.authDAO.openConnection();
            const response = await this.authDAO.me(id);

            await this.authDAO.closeConnection();

            return response;
        } catch (error) {
            await this.authDAO.closeConnection();
            throw error;
        }
    }

    //todo
    async refreshToken(token: string): Promise<HttpResponse> {
        try {
            await this.authDAO.openConnection();

            const response = notFound();

            await this.authDAO.commit();
            await this.authDAO.closeConnection();

            return response;
        } catch (error) {
            await this.authDAO.rollback();
            await this.authDAO.closeConnection();
            throw error;
        }
    }

    private async getTokens(userId: number): Promise<tokens> {
        return {
            token: await this.generateAccessToken(userId),
            refreshToken: uuid()
        }
    }

    private async generateAccessToken(userId: number): Promise<string> {
        const secret = process.env.JWT_SECRET || 'secret';
        const minutesToExpire = process.env.JWT_MINUTES_TO_EXPIRE || '10';
        return jwt.sign({ userId: userId }, secret, {
            expiresIn: `${minutesToExpire}m`
        });
    }
}
