import React from 'react';
import axios from 'axios';
import FormDialog from '../../Common/FormDialog';
import Grid from '@material-ui/core/Grid';
import config from '../../../config';

const DeleteMenu = (props) => {
    var [errMsg, setErrMsg] = React.useState('');

    const handleDelete = () => {
        axios.delete(config.serverUrl + 'menu', {data: {id: props.menuObj.id}})
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
                title="Delete Menu" 
                description={("Are you sure to delete menu " + props.menuObj.item + " from category " + props.menuObj.cname)}
                primaryBtnLabel="Delete"
                secondaryBtnLabel="Cancel"
                handlePrimaryBtn={handleDelete} 
                handleSecondaryBtn={props.handleClose}>

                <Grid container direction="column" alignContent="center">
                    <Grid item>
                        <div className="message error">{errMsg}</div>
                    </Grid>
                </Grid>
            </FormDialog>
        </div>
    );
};

export default DeleteMenu;