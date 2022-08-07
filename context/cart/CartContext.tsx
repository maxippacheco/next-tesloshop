import { createContext } from 'react';
import { ICartProduct, ShippingAdress } from '../../interfaces';

interface ContextProps{
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;

	shippingAdress?: ShippingAdress;

	// Methods
	addProductToCart: ( product: ICartProduct ) => void;
	updateCartQuantity: ( product: ICartProduct ) => void;
	removeCartProduct: ( product: ICartProduct ) => void;
	updateAdress:( adress: ShippingAdress ) => void;

	// orders
	createOrder: () => Promise<{ hasError: boolean; message: string; }>; 
}


export const CartContext = createContext({} as ContextProps);