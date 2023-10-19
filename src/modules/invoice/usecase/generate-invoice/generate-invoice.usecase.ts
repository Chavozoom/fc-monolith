import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice, { InvoiceProps } from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice_items";
import InvoiceGateway from "../../gateway/invoice.gateway";
import Address from "../../../@shared/domain/value-object/address";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {
    private _invoiceRepository: InvoiceGateway;

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

        const address = new Address(input.street, input.number, input.zipCode, input.city, input.complement, input.state);
        const items = input.items.map((item) => {
            return new InvoiceItems({
                id: new Id(item.id),
                name: item.name,
                salesPrice: item.salesPrice,
                quantity: item.quantity
            });
        });

        const invoiceProps: InvoiceProps = {
            name: input.name,
            document: input.document,
            address: address,
            items: items
        };

        const invoice = new Invoice(invoiceProps);

        await this._invoiceRepository.generate(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => {
                return {
                    id: item.id.id,
                    name: item.name,
                    salesPrice: item.salesPrice,
                    quantity: item.quantity
                };
            }),
            total: invoice.total()
        };
    }
}