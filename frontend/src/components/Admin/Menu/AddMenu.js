import React from 'react';
import axios from 'axios';

import config from '../../../config';

import FormDialog from '../../Common/FormDialog';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';

const AddCategory = (props) => {
    const emptyobj = {cid: '', item: '', shortdesc: '', fullprice: 0, halfprice: 0, foodtype: 'veg', available: "yes"};
    const [values, setValues] = React.useState([{...emptyobj}]);
    const [errMsg, setErrMsg] = React.useState('');

    const handleChange = (i, event) => {
        var oldValues = values.map(obj => ({...obj}));
        var value = event.target.value;
        var intValues = ['fullprice', 'halfprice'];
        if(intValues.indexOf(event.target.name) > -1) {
            value = parseInt(value);
        }
        oldValues[i][event.target.name] = value;

        setValues([...oldValues]);
    }

    const addNewRow = () => {
        setValues([...values, {...emptyobj}]);
    }

    const removeNewRow = (i) => {
        var oldValues = values.map(obj => ({...obj}));
        oldValues.splice(i, 1);
        setValues([...oldValues]);
    }

    const handleClick = () => {
        if(values.length > 0) {
            for(let i=0; i<values.length; i++) {
                let keys = Object.keys(values[i]);
                for(let j=0; j<keys.length; j++) {
                    let val = values[i][keys[j]];
                    if(!val && val !== 0 && keys[j] !== "shortdesc") {
                        return setErrMsg('please enter valid data');
                    }
                }
            }
            submitNewMenu(values);
        } else {
            setErrMsg('please enter valid data');
        }
    }

    const submitNewMenu = (values) => {
        axios.put(config.serverUrl + 'menu', {list: values})
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
        <div className="form add-form menu">
            <FormDialog
                open={props.open} 
                width="lg"
                handleClose={props.handleClose} 
                title="Add Menu" 
                primaryBtnLabel="Submit"
                secondaryBtnLabel="Cancel"
                handlePrimaryBtn={handleClick} 
                handleSecondaryBtn={props.handleClose}>

                <TableContainer>
                    <Table aria-label="form table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Category Name</TableCell>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Short Description</TableCell>
                                <TableCell>Full Price</TableCell>
                                <TableCell>Half Price</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Is Available</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {values.map((menu, i) => {
                                return (
                                    <TableRow>
                                        <TableCell>
                                            <Select name="cid" value={menu.cid} onChange={(e) => handleChange(i, e)}>
                                                <MenuItem value="">Food Category</MenuItem>
                                                {props.category.map(({id, name}) => (<MenuItem key={name} value={id}>{name}</MenuItem>))}
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <TextField className="form-field" name="item" value={menu.item} onChange={(e) => handleChange(i, e)} />
                                        </TableCell>
                                        <TableCell>
                                            <TextField className="form-field" name="shortdesc" value={menu.shortdesc} multiline onChange={(e) => handleChange(i, e)} />
                                        </TableCell>
                                        <TableCell>
                                            <TextField className="form-field" type="number" name="fullprice" value={menu.fullprice} onChange={(e) => handleChange(i, e)} />
                                        </TableCell>
                                        <TableCell>
                                            <TextField className="form-field" type="number" name="halfprice" value={menu.halfprice} onChange={(e) => handleChange(i, e)} />
                                        </TableCell>
                                        <TableCell>
                                            <Select name="foodtype" value={menu.foodtype} onChange={(e) => handleChange(i, e)}>
                                                <MenuItem value="" disabled>Food type</MenuItem>
                                                <MenuItem value="veg">Veg</MenuItem>
                                                <MenuItem value="nonveg">Non Veg</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select name="available" value={menu.available} onChange={(e) => handleChange(i, e)}>
                                                <MenuItem value="" disabled>Food Available</MenuItem>
                                                <MenuItem value="no">Not Available</MenuItem>
                                                <MenuItem value="yes">Available</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={addNewRow}>+</Button> &nbsp; <Button onClick={() => removeNewRow(i)}>-</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container direction="column" alignContent="center">
                    <Grid item>
                        <div className="message error">{errMsg}</div>
                    </Grid>
                </Grid>
            </FormDialog>
        </div>
    );
};

export default AddCategory;