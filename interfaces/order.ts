import { IUser } from "./";
import { ISize } from "./";

export interface IOrder{
	_id?          : string;
	user?         : IUser | string;
	orderItems    : IOrderItem[];
	shippingAddress: ShippingAdress;
	paymentResult?: string;

	numberOfItems : number;
	subTotal      : number;
	tax           : number;
	total         : number;

	isPaid        : boolean;
	paidAt?       : string;

	transactionId?: string;
	
	createdAt?     : string;
	updatedAt?     : string;
}

export interface IOrderItem{
	_id      : string;
	title    : string;
	size     :  ISize;
	quantity : number;
	slug     : string;
	image    : string;
	price    : number;
	gender   : string;
}

export interface ShippingAdress {
	firstName: string;
	lastName : string;
	adress   : string;
	adress2? : string;
	zip      : string;
	city     : string;
	country  : string;
	phone    : string;
}
