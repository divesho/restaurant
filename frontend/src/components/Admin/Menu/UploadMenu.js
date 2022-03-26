import React from 'react';
import axios from 'axios';
import readXlsxFile from 'read-excel-file';

import config from '../../../config';

import FormDialog from '../../Common/FormDialog';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';

const UploadMenu = (props) => {
    const [fileUpload, setFileUpload] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [fileData, setFileData] = React.useState('');
    const emptyobj = {cid: '', item: '', shortdesc: '', fullprice: 0, halfprice: 0, foodtype: 'veg', available: "yes"};
    const [values, setValues] = React.useState([{...emptyobj}]);
    const [errMsg, setErrMsg] = React.useState('');

    const handleChange = (event) => {
        var value = event.target.value;
        var oldMenu = {...values};
        var intValues = ['fullprice', 'halfprice'];
        if(intValues.indexOf(event.target.name) > -1) {
            value = parseInt(value);
        }
        oldMenu[event.target.name] = value;
        setValues({...oldMenu});
    }

    const handleFile = (event) => {
        setFile(event.target.files[0]);
        setFileUpload(true);
        renderExcelData(event.target.files[0]);
    }

    const renderExcelData = (file) =>  {
        readXlsxFile(file)
        .then(data => {
            console.log('data', data);

            let keys = [];
            let newData = [];
            data.map((rows, index) => {
                if(index === 0) {
                    keys = rows;
                } else {
                    let obj = {};
                    rows.map((col, j) => {
                        obj[keys[j]] = col || (keys[j] === 'halfprice' ? 0 : '') ;
                    });
                    newData.push(obj);
                }
            });
            setValues(newData);
        });
    }

    const handleUpload = () => {
        if(values.length > 0) {
            for(let i=0; i<values.length; i++) {
                let keys = Object.keys(values[i]);
                for(let j=0; j<keys.length; j++) {
                    let val = values[i][keys[j]];
                    if(!val && val !== 0 && keys[j] !== "cid" && keys[j] !== "halfprice" && keys[j] !== "shortdesc") {
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
        // return console.log("values", values);
        axios.put(config.serverUrl + 'menu/upload', {list: values})
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
                title="Add Menu" 
                primaryBtnLabel="Submit"
                secondaryBtnLabel="Cancel"
                handlePrimaryBtn={handleUpload} 
                handleSecondaryBtn={props.handleClose}>

                <Grid container direction="row">
                    <Grid item className="form-group">
                        <span className="label">Upload file: </span>
                        <input type="file" className="form-field" name="file" onChange={handleFile} />
                    </Grid>
                </Grid>

                <Grid container direction="row">
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {values.map((menu, i) => {
                                    return (
                                        <TableRow>
                                            <TableCell>
                                                {menu.cname}
                                            </TableCell>
                                            <TableCell>
                                                {menu.item}
                                            </TableCell>
                                            <TableCell>
                                                {menu.shortdesc}
                                            </TableCell>
                                            <TableCell>
                                                {menu.fullprice}
                                            </TableCell>
                                            <TableCell>
                                                {menu.halfprice}
                                            </TableCell>
                                            <TableCell>
                                                {menu.foodtype}
                                            </TableCell>
                                            <TableCell>
                                                {menu.available}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid container direction="column" alignContent="center">
                    <Grid item>
                        <div className="message error">{errMsg}</div>
                    </Grid>
                </Grid>
            </FormDialog>
        </div>
    );
};

export default UploadMenu;