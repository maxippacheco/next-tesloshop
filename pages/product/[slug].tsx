import { useState, useContext } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { Grid, Box, Typography, Button, Chip } from '@mui/material';
import { ShopLayout } from '../../components/layouts'
import { ProductSlideshow, SizeSelector } from '../../components/products';
import { ItemCounter } from '../../components/ui';
import { ICartProduct, IProduct, ISize } from '../../interfaces';
import { dbProducts } from '../../database';
import { useRouter } from 'next/router';
import { CartContext } from '../../context';


interface Props {
	product: IProduct;
}


const ProductPage: NextPage<Props> = ({ product }) => {

	const { addProductToCart } = useContext( CartContext );
	const router = useRouter();
	

	// const { products: product, isLoading } = useProducts<IProduct>(`/products/${ router.query.slug }`);
	const [ tempCartProduct, setTempCartProduct ] = useState<ICartProduct>({
		_id: product._id,
		image: product.images[0],
		price: product.price,
		size: undefined,
		slug: product.slug,
		title: product.title,
		gender: product.gender,
		quantity: 1,
	});	

	const selectedSize = ( size: ISize ) => {
		
		setTempCartProduct( currenProduct => ({
			...currenProduct,
			size
		}))
		
	}

	const onUpdateQuantity = ( quantity: number ) => {
		
		setTempCartProduct( currenProduct => ({
			...currenProduct,
			quantity
		}))
		
	}


	const onAddProduct = () => {
		
		if( !tempCartProduct.size ) return;
		
		// TODO: llamar accion del context para agregar
		addProductToCart( tempCartProduct )

		console.log({ tempCartProduct });

		router.push('/cart')
		
	}

	return (
		<ShopLayout title={ product.title } pageDescription={ product.description }>
			<Grid container spacing={ 3 }>

				<Grid item xs={ 12 } sm={ 7 }>
					{/* Slideshow */}
					<ProductSlideshow images={ product.images } />
				</Grid>

				<Grid item xs={ 12 } sm={ 5 }>
					<Box display="flex" flexDirection="column">
						{/* titles */}
						<Typography variant="h1" component="h1">{ product.title }</Typography>
						<Typography variant="subtitle1" component="h2">{ `${ product.price }` }</Typography>

						<Box sx={{ my: 2 }}>
							<Typography variant="subtitle2">Cantidad</Typography>
							{/* ItemCounter */}
							<ItemCounter 
								currentValue={ tempCartProduct.quantity }
								updatedQuantity={ onUpdateQuantity }
								maxValue={ product.inStock > 10 ? 10 : product.inStock }
							/>
					
							<SizeSelector 
								sizes={ product.sizes }
								selectedSize={ tempCartProduct.size }
								onSelectedSize={ selectedSize }
							/>
						</Box>

						{/* Agregar al carrito */}
						{
							(product.inStock > 0)
							? (
								<Button 
									color="secondary" 
									className="circular-btn"
									onClick={ onAddProduct }
								>
									{
										tempCartProduct.size
										? 'Agregar al carrito'
										: 'Seleccione una talla'
									}
								</Button>
							)
							: (
								<Chip label="No hay disponibles" color="error" variant="outlined" />
							)
						}

						{/* Descripcion */}
						<Box sx={{ mt: 3 }}>
							<Typography variant="subtitle2">Descripcion</Typography>
							<Typography variant="body2">{ product.description }</Typography>
						</Box>
					</Box>
				</Grid>

			</Grid>
		</ShopLayout>
	)
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//! no usar esto...
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	// const product = await getProductBySlug(`${ query.slug }`);// your fetch function here 
	
// 	const { slug = '' } = params as { slug: string };

// 	const product = await getProductBySlug(slug);// your fetch function here 
		
// 	if( !product ){
// 		return{
// 			redirect:{
// 				destination: '/',
				// si es permanent esta pagina no se deberia volver a mostrar mas
// 				permanent: false
// 			}
// 		}
// 	}

// 	return {
// 		props: {
// 			product
// 		}
// 	}
// }



export const getStaticPaths: GetStaticPaths = async () => {
	const productSlugs = await dbProducts.getAllProductsSlugs(); // your fetch function here 


	return {
		paths: productSlugs.map( ({ slug }) => ({
			params: {
				slug
			}
		})),
		fallback: "blocking"
	}
}

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {

	const { slug = '' } = params as { slug: string };

	const product = await dbProducts.getProductBySlug( slug );

	if( !product ) {
    return{
       redirect: {
          destination: '/',
          permanent: false
       },
    } 
	};


	return {
		props: {
			product
		},
		revalidate: 60 * 60 * 24
	}
}

export default ProductPage