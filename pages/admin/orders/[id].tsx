import { GetServerSideProps, NextPage } from 'next'
import { Grid, Typography, Card, CardContent, Divider, Box, Chip } from '@mui/material';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { AdminLayout, ShopLayout } from "../../../components/layouts"
import { CartList, OrderSummary } from "../../../components/cart";
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';


interface Props{
	order: IOrder;
}

const AdminOrderPage: NextPage<Props> = ({ order }) => {

	const { _id, isPaid, numberOfItems, subTotal, tax, total, shippingAddress } = order;

	

	return (
		<AdminLayout title="Resumen de orden" subtitle={`OrdenId: ${ order._id }`} icon={<AirplaneTicketOutlined /> }>
			
			{
				isPaid 
				? (
					<Chip 
						sx={{ my: 2 }}
						label="Orden ya fue pagada"
						variant="outlined"
						color="success"
						icon={ <CreditScoreOutlined /> }
					/>	

				)
				: (
					<Chip 
						sx={{ my: 2 }}
						label="Pendiente de pago"
						variant="outlined"
						color="error"
						icon={ <CreditCardOffOutlined /> }
					/>
				)
			}

		
			<Grid container>
				<Grid item xs={ 12 } sm={ 7 }>
						<CartList products={ order.orderItems } />
				</Grid>
				<Grid item xs={ 12 } sm={ 5 }>
					<Card className="summary-card">
						<CardContent>
							<Typography variant="h2">Resumen ({ numberOfItems } { numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
							<Divider sx={{ my: 1 }} />

							<Box display="flex" justifyContent="space-between">
								<Typography variant="subtitle1">Dirección de la entrega</Typography>
							</Box>

							<Typography>{`${ shippingAddress.firstName } ${ shippingAddress.lastName }`}</Typography>
							<Typography>{ shippingAddress.adress }{ shippingAddress.adress2 ? `, ${ shippingAddress.adress2 }` : '' }</Typography>
							<Typography>{ shippingAddress.city } { shippingAddress.zip}</Typography>
							{/* <Typography>{ countries.find( c => c.code === country )?.name }</Typography> */}
							<Typography>{ shippingAddress.country }</Typography>
							<Typography>+{ shippingAddress.phone }</Typography>


							<Divider sx={{ my: 1 }} />

							<OrderSummary 
								orderValues={{
									numberOfItems,
									subTotal,
									total,
									tax,
								}} 
							/>

							<Box sx={{ mt: 3 }} display="flex" flexDirection="column">
								{/* Todo */}

								<Box sx={{ display: 'flex', flex: 1 }} flexDirection="column">
									{
										order.isPaid
										? (
											<Chip 
												sx={{ my: 2 }}
												label="Orden ya fue pagada"
												variant="outlined"
												color="success"
												icon={ <CreditScoreOutlined /> }
											/>	

										): (
											<Chip 
												sx={{ my: 2 }}
												label="Pendiente de Pago"
												variant="outlined"
												color="error"
												icon={ <CreditCardOffOutlined /> }
											/>	

										)
									}
								</Box>

							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		
		</AdminLayout>
	)
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

	const { id = '' } = query;

	const order = await dbOrders.getOrderById( id.toString() );
	
	if( !order ){
		return {
			redirect: {
				destination: '/admin/orders',
				permanent: false,
			}
		}
	}


	return {
		props: {
			order
		}
	}
}

export default AdminOrderPage