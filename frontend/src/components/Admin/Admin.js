import React from 'react';

import Category from './Category/Category';
import Menu from './Menu/Menu';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

const Admin = (props) => {
    const [view, setView] = React.useState('menu');

    const handleView = (type) => {
        setView(type);
    }

    const handleLogout = () => {
        sessionStorage.removeItem('jwtToken');
        props.history.push("/admin");
    }

    return (
        <div className="admin-page">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className="title">
                        Admin Page | Hotel Same Place
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>

            <Grid container direction="row" className="main-actions">
                <Button className="action" variant="contained" color={view === "menu" ? "primary" : "default"} onClick={() => handleView('menu')} >Menu</Button>
                <Button className="action" variant="contained" color={view === "category" ? "primary" : "default"} onClick={() => handleView('category')} >Categories</Button>
            </Grid>

            { view === 'category' ? <Category /> : <Menu /> }
        </div>
    );
};

export default Admin;