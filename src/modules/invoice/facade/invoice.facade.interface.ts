import { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto } from "./interfaces/find-invoice.facade.dto";
import { GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./interfaces/generate-invoice.facade.dto";

export default interface InvoiceFacadeInterface {
    generate(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto>;
    find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
}