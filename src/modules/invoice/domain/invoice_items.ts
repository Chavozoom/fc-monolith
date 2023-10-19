import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceItemsProps = {
    id?: Id;
    name: string;
    salesPrice: number;
    quantity: number;
};

export default class InvoiceItems {
    private _id: Id;
    private _name: string;
    private _salesPrice: number;
    private _quantity: number;

    constructor(props: InvoiceItemsProps) {
        this._id = props.id || new Id();
        this._name = props.name;
        this._salesPrice = props.salesPrice;
        this._quantity = props.quantity;
    }

    get id(): Id {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get salesPrice(): number {
        return this._salesPrice;
    }

    get quantity(): number {
        return this._quantity;
    }

    total(): number {
        return this._salesPrice * this._quantity;
    }
}