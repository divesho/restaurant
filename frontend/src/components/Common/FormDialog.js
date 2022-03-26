import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog(props) {
    console.log("dialog props", props);
    return (
        <div>
            <Dialog className="form" maxWidth={props.width || false} open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    {props.description && <DialogContentText>{props.description}</DialogContentText>}
                    {props.children}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={props.handleSecondaryBtn} color="secondary">
                        {props.secondaryBtnLabel}
                    </Button>
                    <Button variant="contained" onClick={props.handlePrimaryBtn} color="primary">
                        {props.primaryBtnLabel}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}