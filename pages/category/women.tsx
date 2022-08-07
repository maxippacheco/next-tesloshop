import type { NextPage } from 'next'
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

// const fetcher = (...args: [ key: string ] ) => fetch(...args).then((res) => res.json())


const WomenPage: NextPage = () => {
  
  const { products, isLoading } = useProducts('/products?gender=women');


  return (
    <ShopLayout title='Teslo-Shop - Women' pageDescription='Encuentra los mejores productos de Teslo aqui'>
      <Typography variant="h1" component="h1">Mujeres</Typography>
      <Typography variant="h2" sx={{ marginBottom: 1 }}>Productos para mujeres</Typography>
      

      {
        isLoading 
          ? <FullScreenLoading />
          : <ProductList products={ products } />
      }


    </ShopLayout>
  )
}

export default WomenPage
