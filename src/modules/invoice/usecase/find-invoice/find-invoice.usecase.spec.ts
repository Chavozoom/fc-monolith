import Invoice, { InvoiceProps } from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice_items";
import Address from "../../../@shared/domain/value-object/address";
import { FindInvoiceUseCaseInputDTO } from "./find-invoice.dto";
import FindInvoiceUseCase from "./find-invoice.usecase";
import InvoiceRepository from "../../repository/invoice.repository";
import { GenerateInvoiceUseCaseInputDto } from "../generate-invoice/generate-invoice.dto";
import GenerateInvoiceUseCase from "../generate-invoice/generate-invoice.usecase";
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../../repository/invoice.model";
import InvoiceItemModel from "../../repository/invoice-item.model";

const address = new Address("street", "1", "building", "city", "state", "12345");

const item = new InvoiceItems({
    name: "Item 1",
    salesPrice: 100,
    quantity: 3,
},
);

const invoiceProps: InvoiceProps = {
    name: "prod",
    document: "1234567890",
    address: address,
    items: [item]
};

const invoice = new Invoice(invoiceProps);

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    };
};

describe("Find invoice usecase unit test", () => {
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
    it("should find an invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);

        const input: FindInvoiceUseCaseInputDTO = {
            id: "1"
        };

        const result = await usecase.execute(input);

        expect(result.address.city).toBe(invoice.address.city);
        expect(result.address.street).toBe(invoice.address.street);
        expect(result.address.number).toBe(invoice.address.number);
        expect(result.address.complement).toBe(invoice.address.complement);
        expect(result.address.state).toBe(invoice.address.state);
        expect(result.address.zipCode).toBe(invoice.address.zipCode);
        expect(result.document).toBe(invoice.document);
        expect(result.name).toBe(invoice.name);
        expect(result.total).toBe(invoice.total());

        expect(result.items.length).toBe(1);
        expect(result.items[0].id).toBe(invoice.items[0].id.id);
        expect(result.items[0].name).toBe(invoice.items[0].name);
        expect(result.items[0].salesPrice).toBe(invoice.items[0].salesPrice);
        expect(result.total).toBe(invoice.total());
    });

    it("should generate an invoice", async () => {
        const invoiceRepository = new InvoiceRepository();
        const usecase = new GenerateInvoiceUseCase(invoiceRepository);

        const input: GenerateInvoiceUseCaseInputDto = {
            name: "prod",
            document: "1234567890",
            street: "street",
            number: "1",
            complement: "building",
            city: "city",
            state: "state",
            zipCode: "12345",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    salesPrice: 100,
                    quantity: 3,
                }
            ]
        };

        const result = await usecase.execute(input);
        const dbResult = await InvoiceModel.findOne({ where: { id: result.id }, include: ["items"] });
        const dbResultToJson = dbResult.toJSON();

        expect(result.id).toBe(dbResultToJson.id);
        expect(result.name).toBe(dbResultToJson.name);
        expect(result.document).toBe(dbResultToJson.document);
        expect(result.street).toBe(dbResultToJson.street);
        expect(result.number).toBe(dbResultToJson.number);
        expect(result.complement).toBe(dbResultToJson.complement);
        expect(result.city).toBe(dbResultToJson.city);
        expect(result.state).toBe(dbResultToJson.state);
        expect(result.zipCode).toBe(dbResultToJson.zipCode);
        expect(result.total).toBe(dbResultToJson.total);
        expect(result.items.length).toBe(1);
        expect(result.items[0].id).toBe(dbResultToJson.items[0].id);
        expect(result.items[0].name).toBe(dbResultToJson.items[0].name);
        expect(result.items[0].salesPrice).toBe(dbResultToJson.items[0].salesPrice);
        expect(result.items[0].quantity).toBe(dbResultToJson.items[0].quantity);
    });
});