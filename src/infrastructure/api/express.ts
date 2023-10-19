import express, { Express, json } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { customerRoute } from "./routes/client.route";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import { productRoute } from "./routes/product.route";
import { checkOutRoute } from "./routes/checkout.route";
import { invoiceRouter } from "./routes/invoice.route";

export const app: Express = express();
app.use(json());

app.use("/customer", customerRoute);
app.use("/product", productRoute);
app.use("/checkout", checkOutRoute);
app.use("/invoice", invoiceRouter);

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    });
    await sequelize.addModels([ProductModel, TransactionModel, InvoiceModel, ClientModel, InvoiceItemModel]);
    await sequelize.sync();
}
setupDb();