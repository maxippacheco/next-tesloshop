import type { NextPage, GetServerSideProps } from 'next'
import { Typography, Box } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

// const fetcher = (...args: [ key: string ] ) => fetch(...args).then((res) => res.json())

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  

  return (
    <ShopLayout title='Teslo-Shop - Search' pageDescription='Encuentra los mejores productos de Teslo aqui'>
      <Typography variant="h1" component="h1">Buscar un producto</Typography>

      {
        foundProducts
        ? <Typography variant="h2" sx={{ marginBottom: 1 }} textTransform="capitalize">Término: { query }</Typography>
        : (
          <Box display="flex">
            <Typography variant="h2" sx={{ mb: 1 }}>No encontramos ningun producto</Typography>  
            <Typography variant="h2" sx={{ ml: 1 }} color="secondary" textTransform="capitalize">{ query }</Typography>  
          </Box>
        ) 
        
      }

      <ProductList products={ products } />

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// usamos ssr props ya que no queremos generar una pagina estaticamente por cada solicitud que hace el usuario, lo hacemos bajo demanda

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { query = '' } = params as { query: string };

  if( query.length === 0 ) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  // y no hay productos
  let products = await dbProducts.getProductsByTerm( query );
  const foundProducts = products.length > 0;

  if( !foundProducts ) {
    // TODO: retornar otros productos
    products = await dbProducts.getProductsByTerm('shirts');
  }

  return {
    props: {
      products,
      query,
      foundProducts
    }
  }
}


export default SearchPage
