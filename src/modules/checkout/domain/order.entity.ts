import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "./client.entity";
import Product from "./product.entity";

type OrderProps = {
    id?: Id;
    client: Client;
    product: Product[];
    status?: string;
};

export default class Order extends BaseEntity implements AggregateRoot {

    private _client: Client;
    private _product: Product[];
    private _status: string;

    constructor(props: OrderProps) {
        super(props.id);
        this._client = props.client;
        this._product = props.product;
        this._status = props.status || "pending";
    }

    get client(): Client {
        return this._client;
    }

    get product(): Product[] {
        return this._product;
    }

    get status(): string {
        return this._status;
    }

    approved(): void {
        this._status = "approved";
    }

    rejected(): void {
        this._status = "rejected";
    }

    get total(): number {
        return this._product.reduce((total, product) => {
            return total + product.salesPrice;
        }, 0);
    }
} 