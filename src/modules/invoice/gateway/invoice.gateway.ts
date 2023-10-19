import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
    generate(input: Invoice): Promise<void>;
    find(id: string): Promise<Invoice>;
}