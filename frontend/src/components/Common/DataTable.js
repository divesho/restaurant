import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadRoundedIcon from '@material-ui/icons/CloudUploadRounded';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Actions = (props) => {
  return (
    <div>
      <IconButton aria-label="edit" color="primary" onClick={props.handleEdit}><EditIcon /></IconButton>
      &nbsp;&nbsp;
      <IconButton aria-label="delete" color="secondary" onClick={props.handleDelete}><DeleteIcon /></IconButton>
    </div>
  );
}

export default function DataTable(props) {
  console.log("props", props);
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className="data-table">
      <Grid container direction="row" className="title-section">
        <Typography variant="h6" className="title">
          {props.title}
        </Typography>
        {props.handleUpload && <Button className="btns upload-btn" variant="contained" color="primary" onClick={props.handleUpload} ><CloudUploadRoundedIcon /></Button>}
        <Button className="btns add-btn" variant="contained" color="primary" onClick={props.handleAdd} ><AddIcon /></Button>
      </Grid>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {props.columns.filter(col => col.show !== false).map(column => {
                return (
                    <TableCell
                        key={column.id}
                        align={column.align ? column.align : "left"}
                        >
                        {column.label}
                    </TableCell>
                );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, index) => (
            <TableRow key={index}>
              {props.columns.filter(col => col.show !== false).map(column => {
                  return (
                    <TableCell 
                        key={column.id}
                        align={column.align ? column.align : "left"}
                        >
                        {column.id !== "actions" ? (row[column.id]) : (<Actions handleEdit={() => props.handleEdit(row)} handleDelete={() => props.handleDelete(row)} />)}
                    </TableCell>
                  );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}