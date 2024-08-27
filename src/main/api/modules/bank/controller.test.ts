import { test, expect, describe, beforeEach, beforeAll, vi, it } from 'vitest'
import { BankController } from './controller'
import { Pool } from 'pg';
import { BankService } from './service';
import { BankDAO } from './dao';
import { Bank } from './types';

describe('Bank controller', () => {
    let pool: Pool;
    let dao: BankDAO;
    let service: BankService;
    let sut: BankController;

    beforeAll(() => {
        pool = new Pool();
        dao = new BankDAO(pool);
        service = new BankService(dao);
        sut = new BankController(service);
    })

    describe('New Bank', () => {

        describe('Errors', () => {

            describe('Invalid input', () => {
                it.each([
                    {
                        name: 'Description'
                    },
                    {
                        userId: 1234567,
                        name: 'Description'
                    },
                    {
                        userId: 1,
                        name: 'Really long description Really long description Really long description Really long description'
                    }
                ])(
                    'Should return error 400 when bad bank data', async (input) => {
                        const result = await sut.newBank(input);
                        expect(result.statusCode).toBe(400);
                    }
                )
            });

        });

        describe('Success', () => {

            test("Should create a valid bank", async () => {
                const spy = vi.spyOn(sut, 'newBank').mockResolvedValueOnce({ statusCode: 201, body: {} });

                const success = await sut.newBank({
                    userId: 1,
                    name: 'Banco'
                });

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(201);
            });

        })
    })

    describe('List banks from user', () => {

        describe("Errors", () => {

            test("Should return error 400 when bad userId data", async () => {
                const spy = vi.spyOn(sut, 'getFromUser').mockResolvedValueOnce({ statusCode: 400, body: {} });

                const success = await sut.getFromUser(NaN);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(400);
            });

        });

        describe("Success", () => {

            test("Should return empty array when no data", async () => {
                const response = [] as Bank[];

                const spy = vi.spyOn(sut, 'getFromUser').mockResolvedValueOnce({ statusCode: 200, body: [] });

                const success = await sut.getFromUser(1);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(200);
                expect(success.body).toStrictEqual(response);
            });

            test("Should return data", async () => {
                const response = [
                    {
                        userId: 1,
                        name: 'Test'
                    },
                    {
                        userId: 2,
                        name: 'Test 2'
                    }
                ];

                const spy = vi.spyOn(sut, 'getFromUser').mockResolvedValueOnce({ statusCode: 200, body: response });

                const success = await sut.getFromUser(1);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(200);
                expect(success.body).toStrictEqual(response);
            });

        });

    });

    describe('List banks from ID', () => {

        describe("Errors", () => {

            test("Should return 404 when id not match in the database", async () => {
                const spy = vi.spyOn(sut, 'getFromId').mockResolvedValueOnce({ statusCode: 404, body: {} });

                const success = await sut.getFromId(1);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(404);
            });

            test("Should return error 400 when bad id data", async () => {
                const spy = vi.spyOn(sut, 'getFromId').mockResolvedValueOnce({ statusCode: 400, body: {} });

                const success = await sut.getFromId(1);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(400);
            });

        });

        describe("Success", () => {

            test("Should return Bank data when valid id", async () => {

                const response = {
                    userId: 1,
                    id: 1,
                    name: "Test"
                }

                const spy = vi.spyOn(sut, 'getFromId').mockResolvedValueOnce({ statusCode: 200, body: response });

                const success = await sut.getFromId(1);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(200);
                expect(success.body).toBe(response);
            })

        });

    });

    describe("Update bank", () => {

        describe("Errors", () => {

            describe('Invalid input', () => {
                it.each([
                    {
                        name: 'Description'
                    },
                    {
                        userId: 1234567,
                        name: 'Description'
                    },
                    {
                        userId: 1,
                        name: 'Really long description Really long description Really long description Really long description'
                    }
                ])(
                    'Should return error 400 when bad bank data', async (input) => {
                        const result = await sut.editBank(1, input);
                        expect(result.statusCode).toBe(400);
                    }
                )
            });

            test("Should return error 400 when bad id data", async () => {

                const editBank = {
                    id: 1,
                    name: "Test"
                }

                const spy = vi.spyOn(sut, 'editBank').mockResolvedValueOnce({ statusCode: 400, body: {} });

                const success = await sut.editBank(NaN, editBank);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(400);
            });

            test("Should return 404 when id not match in the database", async () => {

                const editBank = {
                    id: 1,
                    name: "Test"
                }

                const spy = vi.spyOn(sut, 'editBank').mockResolvedValueOnce({ statusCode: 404, body: {} });

                const success = await sut.editBank(1, editBank);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(404);
            });

        });

        describe("Success", () => {

            test("Should edit a valid bank", async () => {

                const editBank = {
                    userId: 1,
                    name: 'Banco'
                }

                const edittedBank = {
                    id: 1,
                    name: "Banco"
                }

                const spy = vi.spyOn(sut, 'editBank').mockResolvedValueOnce({ statusCode: 201, body: edittedBank });

                const success = await sut.editBank(1, editBank);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(201);
                expect(success.body).toBe(edittedBank);
            });

        });

    });

    describe("Delete bank", () => {

        describe("Errors", () => {

            test("Should return error 400 when bad id data", async () => {
                const spy = vi.spyOn(sut, 'deleteBank').mockResolvedValueOnce({ statusCode: 400, body: {} });

                const success = await sut.deleteBank(NaN);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(400);
            });

            test("Should return 404 when id not match in the database", async () => {
                const spy = vi.spyOn(sut, 'deleteBank').mockResolvedValueOnce({ statusCode: 404, body: {} });

                const success = await sut.deleteBank(1);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(404);
            });

        });

        describe("Success", () => {

            test("Should delete a bank successfully", async () => {
                const spy = vi.spyOn(sut, 'deleteBank').mockResolvedValueOnce({ statusCode: 200, body: {} });

                const success = await sut.deleteBank(1);

                expect(spy).toBeCalledTimes(1);
                expect(success.statusCode).toBe(200);
            });

        });

    });

})