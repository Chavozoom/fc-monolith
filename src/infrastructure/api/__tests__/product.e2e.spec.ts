import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
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