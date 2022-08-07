import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { ShopLayout } from '../../components/layouts';
import { countries } from '../../utils';
import { CartContext } from '../../context';

type FormData = {
	firstName: string;
	lastName : string;
	adress   : string;
	adress2? : string;
	zip      : string;
	city     : string;
	country  : string;
	phone    : string;
}

const getAdressFromCookies = (): FormData => {
	return {
		  firstName: Cookies.get('firstName') || '',
			lastName : Cookies.get('lastName')  || '',
			adress   : Cookies.get('adress')    || '',
			adress2  : Cookies.get('adress2')   || '',
			zip      : Cookies.get('zip')       || '',
			city     : Cookies.get('city')      || '',
			country  : Cookies.get('country')   || '',
			phone    : Cookies.get('phone')     || '', 
	}
}

const AdressPage = () => {

	const { updateAdress } = useContext(CartContext);
	const router = useRouter();

	const { register, handleSubmit, formState: { errors } , reset} = useForm<FormData>({
		defaultValues: {
			firstName: '',
			lastName : '',
			adress   : '',
			adress2  : '',
			zip      : '',
			city     : '',
			country  : '',
			phone    : '', 			
		}
	});

	useEffect(() => {
		reset( getAdressFromCookies() );
	}, [reset])
	

	const onSubmitAdress = (data: FormData) => {
		updateAdress( data );
		router.push('/checkout/summary');
	}

	return (
		<ShopLayout title="Direccion" pageDescription="Confirmar direccion del destino">
			<form onSubmit={ handleSubmit( onSubmitAdress ) }>
				<Typography variant="h1" component="h1">Dirección</Typography>
			
				<Grid container spacing={ 2 } sx={{ mt: 2 }}>
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField
							autoFocus
							label="Nombre" 
							variant="filled" 
							fullWidth 
							{ 
								...register('firstName', {
									required: 'Este campo es requerido',
								})
							}
							error={ !!errors.firstName } //transformo a valor booleano
							helperText={ errors.firstName?.message }

						/>
					</Grid>
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Apellidos" 
							variant="filled" 
							fullWidth 
							{ 
								...register('lastName', {
									required: 'Este campo es requerido',
								})
							}
							error={ !!errors.lastName } //transformo a valor booleano
							helperText={ errors.lastName?.message }

						/>
					</Grid>
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Direccion" 
							variant="filled" 
							fullWidth
							{ 
								...register('adress', {
									required: 'Este campo es requerido',
								})
							}
							error={ !!errors.adress } //transformo a valor booleano
							helperText={ errors.adress?.message }

						/>
					</Grid>
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Direccion 2" 
							variant="filled" 
							fullWidth
							{ 
								...register('adress2')
							}
						/>
					</Grid>
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Código Postal" 
							variant="filled" 
							fullWidth
							{ 
								...register('zip', {
									required: 'Este campo es requerido',
								})
							}
							error={ !!errors.zip } //transformo a valor booleano
							helperText={ errors.zip?.message }

						/>
					</Grid>
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Ciudad" 
							variant="filled" 
							fullWidth 
							{ 
								...register('city', {
									required: 'Este campo es requerido',
								})
							}
							error={ !!errors.city } //transformo a valor booleano
							helperText={ errors.city?.message }

						/>
					</Grid>
					<Grid item xs={ 12 } sm={ 6 }>
						{/* <FormControl fullWidth> */}
						<TextField
							key={Cookies.get('country') || countries[0].code}
							// select
							variant='filled'
							label='País'
							fullWidth
							// defaultValue={ Cookies.get('country') || countries[0].code }
							{ 
									...register('country', {
										required: 'Este campo es requerido',
									}) 
							}
							error={ !!errors.country }
							helperText={ errors.country?.message }
						/>

								{/* {
									countries.map( country => (
										<MenuItem
											key={ country.code }
											value={ country.code }
										>{ country.name }</MenuItem>
									))
								}
							</TextField> */}
						{/* </FormControl> */}
					</Grid>
					<Grid item xs={ 12 } sm={ 6 }>
						<TextField 
							label="Teléfono" 
							variant="filled" 
							fullWidth
							{ 
								...register('phone', {
									required: 'Este campo es requerido',
								})
							}
							error={ !!errors.phone } //transformo a valor booleano
							helperText={ errors.phone?.message }

						/>
					</Grid>
				</Grid>

				<Box sx={{ mt: 5 }} display="flex" justifyContent="center">
					<Button 
						color="secondary" 
						className="circular-btn" 
						size="large"
						type="submit"
					>Revisar pedido</Button>
				</Box>
			</form>
		</ShopLayout>
	)
}

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

// 	const { token = '' } = req.cookies;

// 	let isValidToken = false;

// 	try {
// 		await jwt.isValidToken( token );
// 		isValidToken = true;

// 	} catch (error) {
// 		isValidToken = false;
// 	}

// 	if( !isValidToken ) {
// 		return {
// 			redirect: {
// 				destination: '/auth/login?p=checkout/adress',
// 				permanent: false
// 			}
// 		}
// 	}

// 	return {
// 		props: {
			
// 		}
// 	}
// }



export default AdressPage