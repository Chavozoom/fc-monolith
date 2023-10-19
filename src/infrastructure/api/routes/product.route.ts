import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { Request, Response, Router } from "express";

export const productRoute = Router();

productRoute.post('/', async (req: Request, res: Response) => {
    try {
        const productAdmFacadeFactory = ProductAdmFacadeFactory.create();
        const { id, name, description, purchasePrice, stock } = req.body;

        if (!name || !description || !purchasePrice || !stock) {
            return res.status(500).send({ message: "missing data" });
        }

        const productInputDto = {
            id,
            name,
            description,
            purchasePrice,
            stock,
        };
        const output = await productAdmFacadeFactory.addProduct(productInputDto);
        return res.status(200).send(output);
    }
    catch (error) {
        console.error(error);
        return res.status(500);
    }
});