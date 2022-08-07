import { useContext, useState } from 'react';
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';
import { AuthContext, UiContext } from "../../context";
import { useRouter } from 'next/router';


export const SideMenu = () => {
    
    const { user, isLoggedIn, logout } = useContext(AuthContext );
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
    
    const [searchTerm, setSearchTerm ] = useState('');
    
    const router = useRouter();
    
    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;
        
        navigateTo(`/search/${ searchTerm }`)
    }

    const navigateTo = ( url: string ) => {
        toggleSideMenu();
        router.push(url);
    }


    return (
        <Drawer
            open={ isMenuOpen }
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={ toggleSideMenu }
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                
                <List>

                    <ListItem>
                        <Input
                            autoFocus
                            value={ searchTerm }
                            onChange={ e => setSearchTerm( e.target.value ) }
                            onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    >
                                    <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>
                  
                    {
                        isLoggedIn && (
                            <>
                                <ListItem button>
                                    <ListItemIcon>
                                        <AccountCircleOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItem>

                                <ListItem button onClick={ () => navigateTo('/orders/history')}>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItem>  
                            </>
                        )
                    }


                    <ListItem 
                        button 
                        onClick={ () => navigateTo('/category/men') }
                        sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <MaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItem>

                    <ListItem 
                        button 
                        onClick={ () => navigateTo('/category/women') }
                        sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <FemaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItem>

                    <ListItem
                        button 
                        onClick={ () => navigateTo('/category/kid') }
                        sx={{ display: { xs: '', sm: 'none' } }}>
                        <ListItemIcon>
                            <EscalatorWarningOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItem>

                    {
                        !isLoggedIn 
                        ? (
                            <ListItem button>
                                <ListItemIcon>
                                    <VpnKeyOutlined/>
                                </ListItemIcon>
                                <ListItemText 
                                    primary={'Ingresar'} 
                                    onClick={ () => navigateTo(`/auth/login?p=${ router.asPath }`) }
                                />
                            </ListItem>
                        )
                        : (
                            <ListItem button onClick={ logout }>
                                <ListItemIcon>
                                    <LoginOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItem>
                        )
                    }



                    {/* Admin */}
                    {
                        user?.role === 'admin' && (
                            <>
                                <Divider />
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItem button onClick={ () => navigateTo('/admin/')}>
                                    <ListItemIcon>
                                        <DashboardOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItem>
                                <ListItem button onClick={() => navigateTo('/admin/products')}>
                                    <ListItemIcon>
                                        <CategoryOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItem>
                                <ListItem button onClick={() => navigateTo('/admin/orders')}>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItem>

                                <ListItem button onClick={() => navigateTo('/admin/users')}>
                                    <ListItemIcon>
                                        <AdminPanelSettings/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItem>
                            </>
                        )
                    }

                </List>
            </Box>
        </Drawer>
    )
}