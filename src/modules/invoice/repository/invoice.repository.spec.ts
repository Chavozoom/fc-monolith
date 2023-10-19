import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceModel from "./invoice.model";
import Invoice, { InvoiceProps } from "../domain/invoice";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItems from "../domain/invoice_items";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
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

    it("should generate an invoice", async () => {

        const address = new Address("street", "159", "building", "city", "state", "zip",);

        const item = new InvoiceItems({
            id: new Id("123"),
            name: "Product",
            salesPrice: 100,
            quantity: 3,
        });

        const invoiceProps: InvoiceProps = {
            id: new Id("1"),
            name: "invoice",
            document: "123456789",
            address: address,
            items: [item]
        };

        const invoice = new Invoice(invoiceProps);

        const invoiceRepository = new InvoiceRepository();
        await invoiceRepository.generate(invoice);

        const result = await InvoiceModel.findOne({
            where: { id: invoiceProps.id.id },
            include: ["items"],
        });

        const resultToJson = result.toJSON();

        expect(resultToJson.id).toBe(invoiceProps.id.id);
        expect(resultToJson.name).toBe(invoiceProps.name);
        expect(resultToJson.document).toBe(invoiceProps.document);
        expect(resultToJson.street).toBe(address.street);
        expect(resultToJson.number).toBe(address.number);
        expect(resultToJson.zipCode).toBe(address.zipCode);
        expect(resultToJson.city).toBe(address.city);
        expect(resultToJson.items[0].id).toBe(item.id.id);
        expect(resultToJson.items[0].name).toBe(item.name);
        expect(resultToJson.items[0].salesPrice).toBe(item.salesPrice);
        expect(resultToJson.items[0].quantity).toBe(item.quantity);
    });

    it("should find an invoice", async () => {
        const productRepository = new InvoiceRepository();

        const address = new Address("street", "159", "building", "city", "state", "zip",);

        const item = new InvoiceItems({
            id: new Id("123"),
            name: "Product",
            salesPrice: 100,
            quantity: 3,
        });

        const invoiceProps: InvoiceProps = {
            id: new Id("1"),
            name: "invoice",
            document: "123456789",
            address: address,
            items: [item]
        };

        const invoice = new Invoice(invoiceProps);

        await InvoiceModel.create(
            {
                id: invoiceProps.id.id,
                name: invoiceProps.name,
                document: invoiceProps.document,
                street: address.street,
                number: address.number,
                zipCode: address.zipCode,
                complement: address.complement,
                state: address.state,
                city: address.city,
                items: invoiceProps.items.map((item) => ({
                    id: item.id.id,
                    name: item.name,
                    salesPrice: item.salesPrice,
                    quantity: item.quantity,
                })),
                total: invoice.total()
            },
            { include: [{ model: InvoiceItemModel }] }
        );

        const modelInvoice = await InvoiceModel.findOne({
            where: { id: invoiceProps.id.id },
            include: ["items"],
        });
        const modelInvoiceToJson = modelInvoice.toJSON();

        const result = await productRepository.find(invoiceProps.id.id);

        expect(result.id.id).toBe(modelInvoiceToJson.id);
        expect(result.name).toBe(modelInvoiceToJson.name);
        expect(result.document).toBe(modelInvoiceToJson.document);
        expect(result.address.street).toBe(modelInvoiceToJson.street);
        expect(result.address.number).toBe(modelInvoiceToJson.number);
        expect(result.address.zipCode).toBe(modelInvoiceToJson.zipCode);
        expect(result.address.city).toBe(modelInvoiceToJson.city);
        expect(result.items[0].id.id).toBe(modelInvoiceToJson.items[0].id);
        expect(result.items[0].name).toBe(modelInvoiceToJson.items[0].name);
        expect(result.items[0].salesPrice).toBe(modelInvoiceToJson.items[0].salesPrice);
        expect(result.items[0].quantity).toBe(modelInvoiceToJson.items[0].quantity);
        expect(result.total()).toBe(modelInvoiceToJson.total);
    });
});