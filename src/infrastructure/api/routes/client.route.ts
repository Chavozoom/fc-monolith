import { Request, Response, Router } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";

export const customerRoute = Router();

customerRoute.post("/", async (req: Request, res: Response) => {
    const clientFacadeFactory = ClientAdmFacadeFactory.create();
    try {
        const { name, address, document, email, id } = req.body;

        const customerDto = {
            id: id,
            name: name,
            document: document,
            email: email,
            address: address
        };

        await clientFacadeFactory.add(customerDto);

        return res.status(200).send({ message: "User Created" });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

customerRoute.get("/:id", async (req: Request, res: Response) => {
    try {
        const clientFacadeFactory = ClientAdmFacadeFactory.create();
        const output = await clientFacadeFactory.find({ id: req.params.id });
        return res.status(200).send(output);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});