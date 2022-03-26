import React from 'react';
import axios from 'axios';

import config from '../../../config';

import FormDialog from '../../Common/FormDialog';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const EditMenu = (props) => {
    const [menu, setMenu] = React.useState({...props.menuObj});
    const [errMsg, setErrMsg] = React.useState('');

    const handleChange = (event) => {
        var value = event.target.value;
        var oldMenu = {...menu};
        var intValues = ['fullprice', 'halfprice'];
        if(intValues.indexOf(event.target.name) > -1) {
            value = parseInt(value);
        }
        oldMenu[event.target.name] = value;
        setMenu({...oldMenu});
    }

    const handleUpdate = () => {
        var keys = Object.keys(menu);
        for(let i=0; i<keys.length; i++) {
            console.log(keys[i], !keys[i], (keys[i] !== 0));
            if(!menu[keys[i]] && menu[keys[i]] !== 0 && keys[i] !== "shortdesc") {
                return setErrMsg('please enter valid data');
            }
        }

        updateMenu(menu);
    }

    const updateMenu = (obj) => {
        axios.post(config.serverUrl + 'menu', {...obj})
        .then(res => {
            var data = res.data;
            if(data.status === "success") {
                props.handleSuccess();
            } else {
                setErrMsg("Some error occured");
            }
        })
        .catch(err => {
            var error = err.message || "some error occured";
            if(err.response && err.response.data) {
                error = err.response.data.error;
            }
            return setErrMsg(error);
        });
    }

    return (
        <div>
            <FormDialog
                open={props.open} 
                width="sm"
                handleClose={props.handleClose} 
                title="Edit Menu" 
                primaryBtnLabel="Update"
                secondaryBtnLabel="Cancel"
                handlePrimaryBtn={handleUpdate} 
                handleSecondaryBtn={props.handleClose}>

                <Grid container direction="column" className="edit-menu">
                    <Grid item className="form-group">
                        <span className="label">Category: </span>
                        <Select className="form-field" name="cid" value={menu.cid} onChange={handleChange}>
                            <MenuItem value="">Food Category</MenuItem>
                            {props.category.map(({id, name}) => (<MenuItem key={name} value={id}>{name}</MenuItem>))}
                        </Select>
                    </Grid>
                    <Grid item className="form-group">
                        <span className="label">Item: </span>
                        <TextField className="form-field" name="item" value={menu.item} onChange={handleChange} />
                    </Grid>
                    <Grid item className="form-group">
                        <span className="label">Short Description: </span>
                        <TextField className="form-field" name="shortdesc" value={menu.shortdesc} onChange={handleChange} />
                    </Grid>
                    <Grid item className="form-group">
                        <span className="label">Full Price: </span>
                        <TextField className="form-field" type="number" name="fullprice" value={menu.fullprice} onChange={handleChange} />
                    </Grid>
                    <Grid item className="form-group">
                        <span className="label">Half Price: </span>
                        <TextField className="form-field" type="number" name="halfprice" value={menu.halfprice} onChange={handleChange} />
                    </Grid>
                    <Grid item className="form-group">
                        <span className="label">Food Type: </span>
                        <Select className="form-field" name="foodtype" value={menu.foodtype} onChange={handleChange}>
                            <MenuItem value="" disabled>Food type</MenuItem>
                            <MenuItem value="veg">Veg</MenuItem>
                            <MenuItem value="nonveg">Non Veg</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item className="form-group">
                        <span className="label">Food Available: </span>
                        <Select className="form-field" name="available" value={menu.available} onChange={handleChange}>
                            <MenuItem value="" disabled>Food Available</MenuItem>
                            <MenuItem value="no">Not Available</MenuItem>
                            <MenuItem value="yes">Available</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item className="form-group">
                        <div className="message error">{errMsg}</div>
                    </Grid>
                </Grid>
            </FormDialog>
        </div>
    );
};

export default EditMenu;