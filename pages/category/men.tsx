import type { NextPage } from 'next'
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

// const fetcher = (...args: [ key: string ] ) => fetch(...args).then((res) => res.json())


const MenPage: NextPage = () => {
  
  const { products, isLoading } = useProducts('/products?gender=men');


  return (
    <ShopLayout title='Teslo-Shop - Men' pageDescription='Encuentra los mejores productos de Teslo aqui'>
      <Typography variant="h1" component="h1">Hombres</Typography>
      <Typography variant="h2" sx={{ marginBottom: 1 }}>Productos para hombres</Typography>
      

      {
        isLoading 
          ? <FullScreenLoading />
          : <ProductList products={ products } />
      }


    </ShopLayout>
  )
}

export default MenPage
