import InvoiceItemModel from "../../repository/invoice-item.model";
import InvoiceModel from "../../repository/invoice.model";
import InvoiceRepository from "../../repository/invoice.repository";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import { Sequelize } from "sequelize-typescript";

describe("Generate Invoice usecase unit test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
    it("should add a Invoice", async () => {
        const invoiceRepository = new InvoiceRepository();
        const usecase = new GenerateInvoiceUseCase(invoiceRepository);

        const input: GenerateInvoiceUseCaseInputDto = {
            name: "Product 1",
            document: "123.456.789-10",
            street: "Rua 1",
            number: "123",
            complement: "building",
            city: "Cidade 1",
            state: "SP",
            zipCode: "12345678",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    salesPrice: 100,
                    quantity: 3,
                },
            ]
        };

        const result = await usecase.execute(input);

        const dbResult = await invoiceRepository.find(result.id);

        expect(dbResult.name).toBe(result.name);
        expect(dbResult.document).toBe(result.document);
        expect(dbResult.address.street).toBe(result.street);
        expect(dbResult.address.number).toBe(result.number);
        expect(dbResult.address.complement).toBe(result.complement);
        expect(dbResult.address.city).toBe(result.city);
        expect(dbResult.address.state).toBe(result.state);
        expect(dbResult.address.zipCode).toBe(result.zipCode);
        expect(dbResult.items[0].name).toBe(result.items[0].name);
        expect(dbResult.items[0].salesPrice).toBe(result.items[0].salesPrice);
        expect(dbResult.items[0].quantity).toBe(result.items[0].quantity);
    });
});