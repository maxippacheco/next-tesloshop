import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../components/layouts/ShopLayout';
import { ProductList } from '../components/products';
import { useProducts } from '../hooks';
import { FullScreenLoading } from '../components/ui';

// const fetcher = (...args: [ key: string ] ) => fetch(...args).then((res) => res.json())


const HomePage: NextPage = () => {
  
  const { products, isLoading } = useProducts('/products');

  

  return (
    <ShopLayout title='Teslo-Shop - Home' pageDescription='Encuentra los mejores productos de Teslo aqui'>
      <Typography variant="h1" component="h1">Tienda</Typography>
      <Typography variant="h2" sx={{ marginBottom: 1 }}>Todos los productos</Typography>
      

      {
        isLoading 
          ? <FullScreenLoading />
          : <ProductList products={ products } />
      }


    </ShopLayout>
  )
}

export default HomePage
