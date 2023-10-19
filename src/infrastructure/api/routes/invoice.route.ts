import InvoiceFacadeFactory from "../../../modules/invoice/factory/facade.factory";
import { Request, Response, Router } from "express";

export const invoiceRouter = Router();

invoiceRouter.get('/:id', (req: Request, res: Response) => {
    const invoiceFacadeFactory = InvoiceFacadeFactory.create();
    const invoiceProps = {
        id: req.params.id
    };

    const output = invoiceFacadeFactory.find(invoiceProps);
    console.log(output);

    return res.status(200).send(output);
});

