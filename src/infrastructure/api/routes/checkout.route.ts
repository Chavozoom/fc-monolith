import { Request, Response, Router } from "express";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/facade.factory";

export const checkOutRoute = Router();

checkOutRoute.post('/', (req: Request, res: Response) => {
    const clientFacadeFactory = ClientAdmFacadeFactory.create();
    const productFacadeFactory = ProductAdmFacadeFactory.create();
    const catalogFacadeFactory = StoreCatalogFacadeFactory.create();
    const invoiceFacadeFactory = InvoiceFacadeFactory.create();
    const paymentFacadeFactory = PaymentFacadeFactory.create();

    const checkout = new PlaceOrderUseCase(clientFacadeFactory, productFacadeFactory, catalogFacadeFactory,
        null, invoiceFacadeFactory, paymentFacadeFactory);

});