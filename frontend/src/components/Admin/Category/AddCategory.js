import React from 'react';
import axios from 'axios';

import config from '../../../config';

import FormDialog from '../../Common/FormDialog';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const AddCategory = (props) => {
    var [values, setValues] = React.useState(['']);
    var [errMsg, setErrMsg] = React.useState('');

    var handleChange = (i, event) => {
        var value = event.target.value;
        var oldValues = values;
        oldValues[i] = value;

        setValues([...oldValues]);
    }

    var addNewRow = () => {
        setValues([...values, '']);
    }

    var removeNewRow = (i) => {
        var oldValues = values;
        oldValues.splice(i, 1);
        setValues([...oldValues]);
    }

    var handleClick = () => {
        var i = 0;

        if(values.length > 0) {
            while(i < values.length) {
                if(!values[i]) {
                    return setErrMsg('please enter valid names');
                }
                i++;
            }

            submitNewCategory(values);
        } else {
            setErrMsg('please enter valid names');
        }
    }

    const submitNewCategory = (values) => {
        axios.put(config.serverUrl + 'category', {list: values})
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
        <div className="category add-category">
            <FormDialog
                open={props.open} 
                handleClose={props.handleClose} 
                title="Add Category" 
                primaryBtnLabel="Submit"
                secondaryBtnLabel="Cancel"
                handlePrimaryBtn={handleClick} 
                handleSecondaryBtn={props.handleClose} >

                <Grid container direction="row" justifyContent="space-around">
                    <Grid item className="form-field-title">Name</Grid>
                    <Grid item className="form-field-title">Actions</Grid>
                </Grid>
                {values.map((category, i) => {
                    return (
                        <Grid container direction="row" className="form-group" key={i}>
                            <Grid item>
                                <TextField className="form-field" name="category" value={category} onChange={(e) => handleChange(i, e)} />
                            </Grid>
                            <Grid item>
                                <Button onClick={addNewRow}>+</Button> &nbsp; <Button onClick={() => removeNewRow(i)}>-</Button>
                            </Grid>
                        </Grid>
                    )
                })}
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