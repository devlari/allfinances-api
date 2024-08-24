import { HttpResponse } from '@/main/api/helpers/http';
import { ValidateInputSchema } from '@/main/api/helpers/schema/validate-input-schema';
import { badRequest, created, notFound, ok, serverError } from '@/main/api/helpers/http-helper';
import { Pool, PoolClient } from 'pg';
import { PostBank } from './types';
import { PostBankSchema } from './schema';
import { BankService } from './service';

export class BankController {
  constructor(private connectionPool: Pool) { }

  async newBank(
    bank: PostBank,
  ): Promise<HttpResponse> {
    const validateError = ValidateInputSchema(bank, PostBankSchema);

    if (validateError) {
      return badRequest(validateError);
    }

    try {
      const bankService = this.getService();
      const response = await bankService.newBank(bank);

      return created(response);
    }
    catch (error) {
      return serverError(error, 'Erro ao criar banco');
    }
  }

  async getFromUser(userId: number): Promise<HttpResponse> {
    try {
      const bankService = this.getService();
      const response = await bankService.getFromUser(userId);

      return ok(response);
    } catch (error) {
      return serverError(error, 'Erro ao capturar bancos do usuário');
    }
  }

  async getFromId(id: number): Promise<HttpResponse> {
    try {
      const bankService = this.getService();
      const response = await bankService.getFromId(id);

      if (!response) {
        return notFound();
      }

      return ok(response);
    } catch (error) {
      return serverError(error, 'Erro ao capturar banco');
    }
  }

  async editBank(
    id: number,
    bank: PostBank
  ): Promise<HttpResponse> {
    const validateError = ValidateInputSchema(bank, PostBankSchema);

    if (validateError) {
      return badRequest(validateError);
    }

    try {
      const bankService = this.getService();
      const bankExists = await bankService.getFromId(id);

      if (!bankExists) {
        return notFound();
      }

      const response = await bankService.editBank(id, bank);

      return ok(response);
    } catch (error) {
      return serverError(error, 'Erro ao alterar banco');
    }
  }

  async deleteBank(id: number): Promise<HttpResponse> {
    try {
      const bankService = this.getService();
      const bankExists = await bankService.getFromId(id);

      if (!bankExists) {
        return notFound();
      }

      const response = await bankService.deleteBank(id);

      return ok(response);
    } catch (error) {
      return serverError(error, 'Erro ao deletar banco');
    }
  }

  private getService(): BankService {
    return new BankService(this.connectionPool);
  }
}
