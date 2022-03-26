import React, { Component } from 'react';
import axios from 'axios';

import DataTable from './../../Common/DataTable';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import DeleteCategory from './DeleteCategory';
import config from '../../../config';

class category extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openForm: '',
            categoryObj: { id: null, name: '' },
            errFlag: false,
            errorMsg: '',
            category: []
        }
    }

    componentDidMount() {
        this.getCategories();
    }

    handleAdd = () => {
        this.setState({openForm: 'add'});
    }

    handleEdit = ({id, name}) => {
        this.setState({openForm: 'edit', categoryObj: { id: id, name: name }, errFlag: false});
    }

    handleDelete = ({id, name}) => {
        this.setState({openForm: 'delete', categoryObj: { id: id, name: name }, errFlag: false});
    }

    handleClose = (formtype) => {
        this.setState({openForm: ''});
    }

    getCategories = () => {
        axios.get(config.serverUrl + 'category')
        .then(res => {
            var data = res.data;
            if(data.status === "success") {
                this.setState({
                    category: data.result, 
                    openForm: '', 
                    errFlag: false, 
                    errorMsg: ''
                });
            } else {
                this.setState({errorMsg: "Some error occured", errFlag: true});
            }
        })
        .catch(err => {
            var error = err.message || "some error occured";
            if(err.response && err.response.data) {
                error = err.response.data.error;
            }
            return this.setState({errorMsg: error, errFlag: true});
        });
    }

    getDataTableColumns = () => {
        // {id: 1, name: "drinks"}
        return [
            {id: "id", label: 'ID', show: false},
            {id: "name", label: "Name"},
            {id: "actions", label: "Action"}
        ];
    }

    render() {
        return (
            <div className="category-section">
                {this.state.errFlag && <h3>{this.state.errorMsg}</h3>}

                <DataTable
                    rows={this.state.category} 
                    columns={this.getDataTableColumns()}
                    title="Category Data"
                    handleAdd={this.handleAdd}
                    handleEdit={this.handleEdit}
                    handleDelete={this.handleDelete} />

                {this.state.openForm === "add" && <AddCategory 
                                                    open={true} 
                                                    handleClose={() => this.handleClose("add")} 
                                                    handleSuccess={this.getCategories} />}
                
                {this.state.openForm === "edit" && <EditCategory 
                                                        open={true} 
                                                        handleClose={() => this.handleClose("edit")} 
                                                        categoryObj={this.state.categoryObj}
                                                        handleSuccess={this.getCategories} />}

                {this.state.openForm === "delete" && <DeleteCategory
                                                        open={true} 
                                                        handleClose={() => this.handleClose("delete")} 
                                                        categoryObj={this.state.categoryObj}
                                                        handleSuccess={this.getCategories} />}
            </div>
        );
    }
}

export default category;