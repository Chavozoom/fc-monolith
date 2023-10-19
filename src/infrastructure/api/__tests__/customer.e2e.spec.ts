import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const { status } = await request(app)
            .post("/customer")
            .send({
                name: "John",
                address: {
                    street: "Street",
                    city: "City",
                    number: "123",
                    zipCode: "12345",
                    state: "State",
                },
                email: "email@example.com",
                document: "123456789"
            });

        expect(status).toBe(200);
    });

    it("should not create a customer", async () => {
        const response = await request(app).post("/customer").send({
            name: "john",
        });
        expect(response.status).toBe(500);
    });

    it("should find a customer", async () => {
        const { status } = await request(app)
            .post("/customer")
            .send({
                id: "1",
                name: "John",
                address: {
                    street: "Street",
                    city: "City",
                    number: "123",
                    zipCode: "12345",
                    state: "State",
                },
                email: "email@example.com",
                document: "123456789"
            });
        expect(status).toBe(200);

        const { body } = await request(app)
            .get(`/customer/1`)
            .send({});

        expect(body.name).toBe("John");
        expect(body.id).toBe("1");
        expect(body.document).toBe("123456789");
        expect(body.email).toBe("email@example.com");
        expect(body.address._street).toBe("Street");
        expect(body.address._city).toBe("City");
        expect(body.address._number).toBe("123");
        expect(body.address._zipCode).toBe("12345");
        expect(body.address._state).toBe("State");
        expect(body.createdAt).toBeDefined();
        expect(body.updatedAt).toBeDefined();

    });
});