import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link'
import Cookies from 'js-cookie';
import { Grid, Typography, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import { ShopLayout } from "../../components/layouts"
import { CartList, OrderSummary } from "../../components/cart";
import { CartContext } from '../../context';
import { countries } from '../../utils';

const SumaryPage = () => {

	const { shippingAdress, numberOfItems, createOrder } = useContext( CartContext );
	const router = useRouter();

	const [isPosting, setIsPosting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if( !Cookies.get('firstName') ){
			router.push('/checkout/adress');
		}
	}, [ router ])
	



	const onCreateOrder = async() => {
		setIsPosting(true);

		const { hasError, message } = await createOrder(); 
		
		if( hasError ){
			setIsPosting( false);
			setErrorMessage( message );
			return
		}

		router.replace(`/orders/${ message }`);
	}

	if( !shippingAdress ){
		return <></>;
	}
	
	const { firstName, lastName, adress, adress2 = '', city, country, phone, zip } = shippingAdress;

	return (
		<ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
			<Typography variant="h1" component="h1">Resumen de la orden</Typography>
			<Grid container>
				<Grid item xs={ 12 } sm={ 7 }>
						<CartList />
				</Grid>
				<Grid item xs={ 12 } sm={ 5 }>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Resumen ({numberOfItems} { numberOfItems === 1 ? 'producto' : 'productos'})</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="space-between">
								<Typography variant="subtitle1">Dirección de la entrega</Typography>
								<NextLink href="/checkout/adress" passHref>
									<Link underline='always'>Editar</Link>
								</NextLink>
							</Box>

							<Typography>{`${ firstName } ${ lastName }`}</Typography>
							<Typography>{ adress}{ adress2 ? `, ${adress2}` : '' }</Typography>
							<Typography>{ city } { zip}</Typography>
							{/* <Typography>{ countries.find( c => c.code === country )?.name }</Typography> */}
							<Typography>{ country }</Typography>
							<Typography>+{ phone }</Typography>

							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="end">
								<NextLink href="/cart" passHref>
									<Link underline='always'>Editar</Link>
								</NextLink>
							</Box>

							<OrderSummary />

							<Box sx={{ mt: 3 }} display={ 'flex' } flexDirection="column">
								<Button 
									color="secondary" 
									className="circular-btn" 
									fullWidth
									onClick={ onCreateOrder }
									disabled={ isPosting }
								>Confirmar orden</Button>

								<Chip
									color="error"
									label={ errorMessage }
									sx={{ display: errorMessage ? 'flex' : 'none', mt: 2 }}
								/>
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		
		</ShopLayout>
	)
}

export default SumaryPage