import {
    Table,
    Model,
    PrimaryKey,
    Column,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
    tableName: "invoice_items",
    timestamps: false,
})
export default class InvoiceItemModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @ForeignKey(() => InvoiceModel)
    @Column({ allowNull: false })
    declare invoice_id: string;

    @BelongsTo(() => InvoiceModel)
    declare invoice: InvoiceModel;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare salesPrice: number;

    @Column({ allowNull: false })
    declare quantity: number;
}