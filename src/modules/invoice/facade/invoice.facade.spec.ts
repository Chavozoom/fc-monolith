import { Sequelize } from "sequelize-typescript"; import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice_items";
import Invoice, { InvoiceProps } from "../domain/invoice";
import InvoiceModel from "../repository/invoice.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import { GenerateInvoiceFacadeInputDto } from "./interfaces/generate-invoice.facade.dto";
import InvoiceItemModel from "../repository/invoice-item.model";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import { FindInvoiceFacadeInputDto } from "./interfaces/find-invoice.facade.dto";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceFacadeFactory from "../factory/facade.factory";
;

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    };
};

const address = new Address("street", "1", "12345", "city", "building", "state");

const item = new InvoiceItems({
    name: "Item 1",
    salesPrice: 100,
    quantity: 3,
});

const invoiceProps: InvoiceProps = {
    id: new Id("1"),
    name: "prod",
    document: "1234567890",
    address: address,
    items: [item]
};

const invoice = new Invoice(invoiceProps);

describe("InvoiceFacade test", () => {
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

    it("should generate, an invoice", async () => {
        const invoiceRepository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);

        const invoiceFacade = new InvoiceFacade({
            generateInvoiceUseCase: generateInvoiceUseCase,
            findInvoiceUseCase: undefined
        });

        const input: GenerateInvoiceFacadeInputDto = {
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

        const invoice = await invoiceFacade.generate(input);

        const invoiceFound = await invoiceRepository.find(invoice.id);

        expect(invoiceFound.address.city).toBe(invoice.city);
        expect(invoiceFound.address.state).toBe(invoice.state);
        expect(invoiceFound.address.zipCode).toBe(invoice.zipCode);
        expect(invoiceFound.address.street).toBe(invoice.street);
        expect(invoiceFound.address.number).toBe(invoice.number);
        expect(invoiceFound.address.complement).toBe(invoice.complement);
        expect(invoiceFound.name).toBe(invoice.name);
        expect(invoiceFound.document).toBe(invoice.document);
        expect(invoiceFound.items[0].name).toBe(invoice.items[0].name);
        expect(invoiceFound.items[0].salesPrice).toBe(invoice.items[0].salesPrice);
        expect(invoiceFound.items[0].quantity).toBe(invoice.items[0].quantity);
        expect(invoiceFound.total()).toBe(invoice.total);
    });

    it("should generate an invoice using factoy", async () => {
        const invoiceRepository = new InvoiceRepository();
        const invoiceFactory = InvoiceFacadeFactory.create();

        const input: GenerateInvoiceFacadeInputDto = {
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

        const invoice = await invoiceFactory.generate(input);

        const invoiceFound = await invoiceRepository.find(invoice.id);

        expect(invoiceFound.address.city).toBe(invoice.city);
        expect(invoiceFound.address.state).toBe(invoice.state);
        expect(invoiceFound.address.zipCode).toBe(invoice.zipCode);
        expect(invoiceFound.address.street).toBe(invoice.street);
        expect(invoiceFound.address.number).toBe(invoice.number);
        expect(invoiceFound.address.complement).toBe(invoice.complement);
        expect(invoiceFound.name).toBe(invoice.name);
        expect(invoiceFound.document).toBe(invoice.document);
        expect(invoiceFound.items[0].name).toBe(invoice.items[0].name);
        expect(invoiceFound.items[0].salesPrice).toBe(invoice.items[0].salesPrice);
        expect(invoiceFound.items[0].quantity).toBe(invoice.items[0].quantity);
        expect(invoiceFound.total()).toBe(invoice.total);
    });

    it("should find an invoice", async () => {
        const invoiceRepository = MockRepository();

        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);

        const invoiceFacade = new InvoiceFacade({
            generateInvoiceUseCase: undefined,
            findInvoiceUseCase: findInvoiceUseCase
        });

        const input: FindInvoiceFacadeInputDto = {
            id: "1"
        };

        const invoiceFound = await invoiceFacade.find(input);

        expect(invoiceFound.id).toEqual(input.id);
        expect(invoiceFound.name).toEqual(invoice.name);
        expect(invoiceFound.document).toEqual(invoice.document);
        expect(invoiceFound.address.city).toEqual(invoice.address.city);
        expect(invoiceFound.address.state).toEqual(invoice.address.state);
        expect(invoiceFound.address.zipCode).toEqual(invoice.address.zipCode);
        expect(invoiceFound.address.street).toEqual(invoice.address.street);
        expect(invoiceFound.address.number).toEqual(invoice.address.number);
        expect(invoiceFound.address.complement).toEqual(invoice.address.complement);
        expect(invoiceFound.items[0].name).toEqual(invoice.items[0].name);
        expect(invoiceFound.items[0].salesPrice).toEqual(invoice.items[0].salesPrice);
        expect(invoiceFound.items[0].quantity).toEqual(invoice.items[0].quantity);
        expect(invoiceFound.total).toEqual(invoice.total());
        expect(invoiceFound.createdAt).toEqual(invoice.createdAt);
    });

    it("should find an invoice using factory", async () => {

        const invoiceRepository = new InvoiceRepository();
        const invoiceFactory = InvoiceFacadeFactory.create();

        const input: FindInvoiceFacadeInputDto = {
            id: "1"
        };

        await invoiceRepository.generate(invoice);

        const invoiceFound = await invoiceFactory.find(input);

        expect(invoiceFound.id).toEqual(input.id);
        expect(invoiceFound.name).toEqual(invoice.name);
        expect(invoiceFound.document).toEqual(invoice.document);
        expect(invoiceFound.address.city).toEqual(invoice.address.city);
        expect(invoiceFound.address.state).toEqual(invoice.address.state);
        expect(invoiceFound.address.zipCode).toEqual(invoice.address.zipCode);
        expect(invoiceFound.address.street).toEqual(invoice.address.street);
        expect(invoiceFound.address.number).toEqual(invoice.address.number);
        expect(invoiceFound.address.complement).toEqual(invoice.address.complement);
        expect(invoiceFound.items[0].name).toEqual(invoice.items[0].name);
        expect(invoiceFound.items[0].salesPrice).toEqual(invoice.items[0].salesPrice);
        expect(invoiceFound.items[0].quantity).toEqual(invoice.items[0].quantity);
        expect(invoiceFound.total).toEqual(invoice.total());
    });
});