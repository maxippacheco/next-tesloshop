
import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database';
import { IProduct } from '../../../interfaces';
import Product from '../../../models/Product';

type Data = 
	|{ message: string }
	| IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	
	switch ( req.method ) {
		case 'GET':
			return getProducts( req, res )
			
		default:
			return res.status(400).json({
				message: 'Bad reques'
			});
	}
	
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

	const { gender = 'all' } = req.query;

	let condition = {};

	if( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes( `${gender}` ) ){
		condition = { gender };
	}

	await db.connect();
	// select: seleccionar campos
	const products = await Product.find( condition )
																.select('title images price inStock slug -_id')
																.lean();
	await db.disconnect();

	const updatedProducts = products.map( product => {
		product.images = product.images.map( image => {
			return image.includes('http') ? image : `http://localhost:3000/products/${ image }`
		})

		return product;
	})


	return res.status(200).json( updatedProducts );

}

