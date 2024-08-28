import { HttpResponse } from '@/main/api/helpers/http';
import { ValidateInputSchema } from '@/main/api/helpers/schema/validate-input-schema';
import { badRequest, created, notFound, ok, serverError, unauthorized } from '@/main/api/helpers/http-helper';
import { Credentials, InfoUser } from './types';
import { CredentialsSchema, InfoUserSchema } from './schema';
import { AuthService } from './service';
import bcrypt from 'bcrypt';

export class AuthController {
    constructor(private authService: AuthService) { }

    // todo: erro ao cadastrar email já cadastrado
    async register(
        info: InfoUser,
    ): Promise<HttpResponse> {
        const validateError = ValidateInputSchema(info, InfoUserSchema);

        if (validateError) {
            return badRequest(validateError);
        }

        try {
            const response = await this.authService.register({
                ...info,
                password: await this.hashPassword(info.password)
            });
            return created(response);
        }
        catch (error) {
            return serverError(error, 'Erro ao registrar usuário');
        }
    }

    async login(credentials: Credentials): Promise<HttpResponse> {
        if (!credentials.email || !credentials.password) {
            return badRequest(new Error("Email ou senha inválidos"));
        }

        try {
            const response = await this.authService.login(credentials);

            if (!response) {
                return badRequest(new Error("Credenciais inválidas"));
            }

            return ok(response);
        } catch (error) {
            return serverError(error, 'Erro ao logar');
        }
    }

    async me(id: number): Promise<HttpResponse> {
        try {
            if (!id || Number.isNaN(id)) {
                return badRequest(new Error("ID inválido"));
            }

            const response = await this.authService.me(id);

            if (!response) {
                return notFound();
            }

            return ok(response);
        } catch (error) {
            return serverError(error, 'Erro ao capturar informações do usuário');
        }
    }

    async refreshToken(
        token: string
    ): Promise<HttpResponse> {
        if (!token || Number.isNaN(token)) {
            return badRequest(new Error("Token inválido"));
        }

        try {
            const response = await this.authService.refreshToken(token);

            return ok(response);
        } catch (error) {
            return serverError(error, 'Erro ao acessar refresh-token');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const ROUNDS = 10;
        const salt = await bcrypt.genSalt(ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }
}
