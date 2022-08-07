import { useEffect, useReducer } from 'react';
import { FC } from 'react';
import Cookie from 'js-cookie'
import { ICartProduct, IOrder, ShippingAdress } from '../../interfaces';
import { cartReducer, CartContext } from './';
import Cookies from 'js-cookie';
import { tesloApi } from '../../api';
import axios, { AxiosError } from 'axios';

interface FCProps{
 children: React.ReactNode;
}

export interface CartState {
	isLoaded: boolean;
	cart: ICartProduct[];
	numberOfItems: number;
	subTotal: number;
	tax: number;
	total: number;

	shippingAdress?: ShippingAdress;
}

const CART_INITIAL_STATE: CartState = {
	isLoaded: false,
  cart: [],
	numberOfItems:0,
	subTotal: 0,
	tax: 0,
	total: 0,
	shippingAdress: undefined

}


const { Provider } = CartContext;

export const CartProvider: FC<FCProps> = ({ children }) => {

	const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

	useEffect(() => {
		try {
			const cookieProduct = Cookie.get('cart') ? JSON.parse( Cookie.get( 'cart' )! ) : [];	
			dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: cookieProduct })
			
		} catch (error) {
		
			dispatch({ type: '[Cart] - LoadCart from cookies | storage', payload: [] })
		}

	}, []);
	
	useEffect(() => {
	
		if( Cookies.get('firstName') ){
			const shippingAdress = {
				firstName: Cookies.get('firstName') || '',
				lastName : Cookies.get('lastName')  || '',
				adress   : Cookies.get('adress')    || '',
				adress2  : Cookies.get('adress2')   || '',
				zip      : Cookies.get('zip')       || '',
				city     : Cookies.get('city')      || '',
				country  : Cookies.get('country')   || '',
				phone    : Cookies.get('phone')     || '', 
	
			}
	
			dispatch({ type: '[Cart] - LoadAdress from Cookies', payload: shippingAdress})

		}

	}, [])
	

	useEffect(() => {
		if (state.cart.length > 0) Cookie.set('cart', JSON.stringify(state.cart))
	}, [state.cart]);
	
	useEffect(() => {

		const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev, 0 );
		const subTotal = state.cart.reduce( ( prev, current ) => (current.price * current.quantity) + prev, 0);
		const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 );

		const orderSummary = {
			numberOfItems,
			subTotal,
			tax: subTotal * taxRate,
			total: subTotal * ( taxRate + 1 )
		}

		dispatch({ type: '[Cart] - Update order summary', payload: orderSummary })
		

	}, [ state.cart ]);

	

	const addProductToCart = ( product: ICartProduct ) => { 
		// ! Nivel 1
		// dispatch({ type: '[Cart] - Add Product', payload: product });
		
		// ! Nivel 2
		// const productsInCart = state.cart.filter( p => p._id !== product._id && p.size !== product.size );
		// dispatch({ type: '[Cart] - Add Product', payload: [ ...productsInCart, product ] });
	
		// * Nivel Final
		// devuelve true o false si existe el producto en el carrito
		const productInCart = state.cart.some( p => p._id === product._id );
		if( !productInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload: [ ...state.cart, product ] })
		
		// mismo id y talla
		const productInCartButDifferentSize = state.cart.some( p => p._id === product._id && p.size === product.size );	
		if( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update products in cart', payload: [ ...state.cart, product ] })

		// Acumular
		const updatedProducts = state.cart.map( p => {

			if( p._id !== product._id ) return p;
			if( p.size !== product.size ) return p;

			// Actualizar la cantidad
			p.quantity += product.quantity;
			return p;
		});
		
		dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts })
		

	}

	const updateCartQuantity = ( product: ICartProduct ) => {
		dispatch({ type: '[Cart] - Change cart quantity', payload: product })
	}

	const removeCartProduct = ( product: ICartProduct ) => {
		dispatch({ type: '[Cart] - Remove product in cart', payload: product })
	}

	const updateAdress = ( adress: ShippingAdress ) => {
		Cookies.set('firstName', adress.firstName);
		Cookies.set('lastName', adress.lastName);
		Cookies.set('adress', adress.adress);
		Cookies.set('adress2', adress.adress2 || '');
		Cookies.set('zip', adress.zip);
		Cookies.set('city', adress.city);
		Cookies.set('country', adress.country);
		Cookies.set('phone', adress.phone);
		dispatch({ type: '[Cart] - Update Adress', payload: adress })
	}

	const createOrder = async(): Promise<{ hasError: boolean; message: string; }> => {

		try {
			
			if( !state.shippingAdress ){
				throw new Error('No hay direccion de entrega');
			}

			const body: IOrder = {
				orderItems: state.cart.map( p => ({
					...p,
					size: p.size!,
					title: p.title[0].toString()
				})),
				shippingAddress: state.shippingAdress,
				numberOfItems: state.numberOfItems,
				subTotal: state.subTotal,
				tax: state.tax,
				total: state.total,
				isPaid: false,

			}

			const { data } = await tesloApi.post<IOrder>('/orders', body);

			// Dispatch
			dispatch({ type: '[Cart] - Order completed' });
			// Cookies.remove('cart');
			
			return {
				hasError: false,
				message: data._id!
			}

		} catch (err) {
			
			if (axios.isAxiosError(err)) {
					const error = err as AxiosError
					return {
						hasError: true,
						message: error.message
					};
			}
			

			return {
				hasError: true,
				message: 'Error no esperado, hable con el administrador'
			}
		}

		
	}

	return(
		<Provider value={{
			...state,

			// Methods
			addProductToCart,
			updateCartQuantity,
			removeCartProduct,
			updateAdress,

			// orders
			createOrder,
		}}>
			{ children}
		</Provider>
	)
}