import React from 'react';
import axios from 'axios';

import config from '../../../config';

import FormDialog from '../../Common/FormDialog';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const EditCategory = (props) => {
    var [category, setCategory] = React.useState(props.categoryObj.name);
    var [errMsg, setErrMsg] = React.useState("");

    var handleChange = (event) => {
        var value = event.target.value;

        setCategory(value);
    }

    var handleUpdate = () => {
        if(!category) {
            setErrMsg("please enter valid category name");
        } else if(props.categoryObj.name === category) {
            setErrMsg("please enter different category name");
        } else {
            updateCategory();
        }
    }

    const updateCategory = () => {
        axios.post(config.serverUrl + "category", {id: props.categoryObj.id, value: category})
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
                handleClose={props.handleClose} 
                title="Edit Category" 
                primaryBtnLabel="Update"
                secondaryBtnLabel="Cancel"
                handlePrimaryBtn={handleUpdate} 
                handleSecondaryBtn={props.handleClose} >

                <Grid container direction="row" className="form-group" justifyContent="space-around">
                    <Grid item>
                        <TextField className="form-field" name="category" value={category} onChange={handleChange} />
                    </Grid>
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

export default EditCategory;