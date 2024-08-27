import { HttpResponse } from '@/main/api/helpers/http';
import { ValidateInputSchema } from '@/main/api/helpers/schema/validate-input-schema';
import { badRequest, created, notFound, ok, serverError } from '@/main/api/helpers/http-helper';
import { PostBank } from './types';
import { PostBankSchema } from './schema';
import { BankService } from './service';

export class BankController {
  constructor(private bankService: BankService) { }

  async newBank(
    bank: PostBank,
  ): Promise<HttpResponse> {
    const validateError = ValidateInputSchema(bank, PostBankSchema);

    if (validateError) {
      return badRequest(validateError);
    }

    try {
      const response = await this.bankService.newBank(bank);
      return created(response);
    }
    catch (error) {
      return serverError(error, 'Erro ao criar banco');
    }
  }

  async getFromUser(userId: number): Promise<HttpResponse> {
    try {

      if (!userId || Number.isNaN(userId)) {
        return badRequest(new Error("ID de usuário inválido"));
      }

      const response = await this.bankService.getFromUser(userId);
      return ok(response);
    } catch (error) {
      return serverError(error, 'Erro ao capturar bancos do usuário');
    }
  }

  async getFromId(id: number): Promise<HttpResponse> {
    try {

      if (!id || Number.isNaN(id)) {
        return badRequest(new Error("ID inválido"));
      }

      const response = await this.bankService.getFromId(id);

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

    if (!id || Number.isNaN(id)) {
      return badRequest(new Error("ID inválido"));
    }

    try {
      const bankExists = await this.bankService.getFromId(id);

      if (!bankExists) {
        return notFound();
      }

      const response = await this.bankService.editBank(id, bank);

      return ok(response);
    } catch (error) {
      return serverError(error, 'Erro ao alterar banco');
    }
  }

  async deleteBank(id: number): Promise<HttpResponse> {
    try {

      if (!id || Number.isNaN(id)) {
        return badRequest(new Error("ID inválido"));
      }

      const bankExists = await this.bankService.getFromId(id);

      if (!bankExists) {
        return notFound();
      }

      const response = await this.bankService.deleteBank(id);

      return ok(response);
    } catch (error) {
      return serverError(error, 'Erro ao deletar banco');
    }
  }
}
