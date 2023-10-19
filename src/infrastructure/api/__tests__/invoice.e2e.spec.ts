import Address from "../../../modules/@shared/domain/value-object/address";
import Id from "../../../modules/@shared/domain/value-object/id.value-object";
import Invoice, { InvoiceProps } from "../../../modules/invoice/domain/invoice";
import InvoiceItems from "../../../modules/invoice/domain/invoice_items";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/facade.factory";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should find an invoice", async () => {
        const invoiceFacadeFactory = InvoiceFacadeFactory.create();
        const address = new Address("street", "159", "building", "city", "state", "zip",);

        const item = ({
            id: "123",
            name: "Product",
            salesPrice: 100,
            quantity: 3,
        });

        await invoiceFacadeFactory.generate({
            name: "invoice",
            document: "123456789",
            street: address.street,
            number: address.number,
            complement: address.complement,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            items: [item]
        });

        const response = await request(app)
            .post("/invoice/")
            .send({
                name: "prod",
                description: "description",
                purchasePrice: 156,
                stock: 20
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("prod");
        expect(response.body.description).toBe("description");
        expect(response.body.purchasePrice).toBe(156);
        expect(response.body.stock).toBe(20);
    });

    it("should not create a product", async () => {
        const response = await request(app).post("/product").send({
            name: "prod",
        });
        expect(response.status).toBe(500);
    });
});