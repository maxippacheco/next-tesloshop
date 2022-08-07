import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = 
| { message: string }
|
{
	numberOfOrders: number;
	paidOrders: number; // isPaid true
	notPaidOrders: number;
	numberOfClients: number; // role: client
	numberOfProducts: number;
	productsWithNoInventory: number; // 0
	lowInventory: number; // productos con 10 o menor
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

	if( req.method !== 'GET') {
		return res.status(400).json({ message: 'Bad Request' })
	}

	await db.connect();


	// const numberOfOrders =  await Order.count();
	// const paidOrders =  await Order.find({ isPaid: true }).count();
	// const notPaidOrders =  await Order.find({ isPaid: false }).count();
	// or
	// const notPaidOrders = numberOfOrders - paidOrders;
	// const numberOfClients =  await User.find({ role: 'client' }).count();
	// const numberOfProducts =  await Product.find().count();
	// const productsWithNoInventory =  await Product.find({ inStock: 0 }).count();
	// const lowInventory =  await Product.find({ inStock: { $lte: 10 }}).count();
	

	const [		
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory
	] = await Promise.all([
		Order.count(),
		Order.find({ isPaid: true }).count(),
		Order.find({ isPaid: false }).count(),
		User.find({ role: 'client' }).count(),
		Product.find().count(),
		Product.find({ inStock: 0 }).count(),
		Product.find({ inStock: { $lte: 10 }}).count()
	])

	await db.disconnect();

	return res.status(200).json({
		numberOfOrders,
		paidOrders,
		notPaidOrders,
		numberOfClients,
		numberOfProducts,
		productsWithNoInventory,
		lowInventory
	});

}