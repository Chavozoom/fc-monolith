import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItems from "../domain/invoice_items";
import InvoiceGateway from "../gateway/invoice.gateway";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async generate(input: Invoice): Promise<void> {
        try {
            await InvoiceModel.create({
                id: input.id.id,
                name: input.name,
                document: input.document,
                items: input.items.map((item) => ({
                    id: item.id.id,
                    name: item.name,
                    salesPrice: item.salesPrice,
                    quantity: item.quantity,
                })),
                total: input.total(),
                street: input.address.street,
                number: input.address.number,
                city: input.address.city,
                zipCode: input.address.zipCode,
                complement: input.address.complement,
                state: input.address.state,
            },
                { include: [{ model: InvoiceItemModel }] }
            );
        }
        catch (error) {
            console.log(error);
        }
    }


    async find(id: string): Promise<Invoice> {
        const result = await InvoiceModel.findOne({
            where: { id },
            include: ["items"],
        });

        const invoice = new Invoice({
            id: new Id(result.id),
            name: result.name,
            document: result.document,
            address: new Address(
                result.street,
                result.number,
                result.complement,
                result.city,
                result.state,
                result.zipCode,
            ),
            items: result.items.map((item) => {
                return new InvoiceItems({
                    id: new Id(item.id),
                    name: item.name,
                    salesPrice: item.salesPrice,
                    quantity: item.quantity,
                });
            })
        });
        return invoice;
    }
}