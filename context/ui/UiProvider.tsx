import { useReducer } from 'react';
import { FC } from 'react';
import { uiReducer, UiContext } from './';

interface FCProps{
 children: React.ReactNode;
}

export interface UiState {
 isMenuOpen: boolean;
}


const UI_INITIAL_STATE: UiState = {
 isMenuOpen: false,
}


const { Provider } = UiContext;

export const UiProvider: FC<FCProps> = ({ children }) => {

	const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

	const toggleSideMenu = () => {
		dispatch({ type: '[UI] - ToggleMenu' })
	}


	return(
		<Provider value={{
			...state,

			// Methods
			toggleSideMenu
		}}>
			{ children}
		</Provider>
	)
}