// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { User, Product } from '../../models';

type Data = {
  ok: boolean;
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if( process.env.NODE_ENV === 'production'){
		return res.status(401).json({ ok: false, message: 'No tiene acceso a este servicio'});
	}


  await db.connect();

  await User.deleteMany();
  await User.insertMany( seedDatabase.initialData.users );


  await Product.deleteMany();
  await Product.insertMany( seedDatabase.initialData.products );

  await db.disconnect();

  res.json({
    ok: true,
    message: 'insert correctamente',

  })

}
