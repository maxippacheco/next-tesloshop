import { useReducer, useEffect } from 'react';
import { FC } from 'react';
import { useRouter } from 'next/router';

import { useSession, signOut } from 'next-auth/react';

import Cookies from 'js-cookie';
import axios, { AxiosError } from 'axios';
import { IUser } from '../../interfaces';
import { authReducer, AuthContext } from './';
import { tesloApi } from '../../api';

interface FCProps{
 children: React.ReactNode;
}

export interface AuthState {
	isLoggedIn: boolean;
	user?: IUser; 
}


const AUTH_INITIAL_STATE: AuthState = {
	isLoggedIn: false,
	user: undefined
}


const { Provider } = AuthContext;

export const AuthProvider: FC<FCProps> = ({ children }) => {

	const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE)
	const { data, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		
		if( status === 'authenticated' ) {
			
			dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
		}

	}, [ status, data ]);
	

	// useEffect(() => {
	// 	checkToken();
	// }, []);

	const checkToken = async() => {
		
		if( !Cookies.get('token') ) return;

		try {
			// axios manda las cookies, osea no hay q configurarlas
			const { data } = await tesloApi.get('/user/validate-token');
			const { token, user } = data;
			Cookies.set('token', token);			
			dispatch({type: '[Auth] - Login', payload: user });

		} catch (error) {
			Cookies.remove('token');
		}


	}
	


	const loginUser = async( email: string, password: string ): Promise<boolean> => {

		try {
			
			const { data } = await tesloApi.post('/user/login', { email, password });
			const { token, user } = data;

			Cookies.set('token', token);

			dispatch({type: '[Auth] - Login', payload: user });

			return true;

		} catch (error) {
			return false;			
		}

	}


	const registerUser = async( name: string, email: string, password: string): Promise<{hasError: boolean; message?: string; }> => {

		try {
			const { data } = await tesloApi.post('/user/register', { name, email, password });
			const { token, user } = data;

			Cookies.set('token', token);

			dispatch({type: '[Auth] - Login', payload: user });

			return {
				hasError: false
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
				message: "Error registering user. Please try again.",
			};
    }

			
	}

	const logout = () => {
		// Cookies.remove('token');
		
		Cookies.remove('cart');
		Cookies.remove('firstName');
		Cookies.remove('lastName');
		Cookies.remove('adress');
		Cookies.remove('adress2');
		Cookies.remove('zip');
		Cookies.remove('city');
		Cookies.remove('country');
		Cookies.remove('phone');

		signOut();
		// router.reload();


		// dispatch({})
	}
	
	
	return(
		<Provider value={{
			...state,

			// Methods
			loginUser,
			registerUser,
			logout
		}}>
			{ children}
		</Provider>
	)
}