
import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database';
import { IProduct } from '../../../interfaces';
import Product from '../../../models/Product';

type Data = 
	|{ message: string }
	| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	
	switch ( req.method ) {
		case 'GET':
			return getProductSlug( req, res )
			
		default:
			return res.status(400).json({
				message: 'Bad reques'
			});
	}
	
}

const getProductSlug = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
	
	
	await db.connect();
	
	const { slug } = req.query;
	const product = await Product.findOne({ slug }).lean();;
	await db.disconnect();

	if(!product){
		return res.status(400).json({
			message: 'Producto no encontrado'
		})
	}
	
	product.images = product.images.map( image => {
			return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
	})



	res.status(200).json( product )

	
}

