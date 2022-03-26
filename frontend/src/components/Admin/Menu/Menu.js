import React, { Component } from 'react';
import axios from 'axios';

import DataTable from './../../Common/DataTable';
import AddMenu from './AddMenu';
import UploadMenu from './UploadMenu';
import EditMenu from './EditMenu';
import DeleteMenu from './DeleteMenu';
import config from '../../../config';

import readXlsxFile from 'read-excel-file'

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openForm: '',
            menuObj: {},
            errFlag: false,
            errorMsg: '',
            menu: [],
            category: [],
            file: null
        }
    }

    componentDidMount() {
        this.getMenu();
        this.getCategories();
    }

    getCategories = () => {
        axios.get(config.serverUrl + 'category')
        .then(res => {
            var data = res.data;
            if(data.status === "success") {
                this.setState({category: data.result, openForm: '', errFlag: false});
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

    getMenu = () => {
        axios.get(config.serverUrl + 'fullMenu')
        .then(res => {
            var data = res.data;
            if(data.status === "success") {
                this.setState({menu: data.result, openForm: '', errFlag: false});
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

    handleAdd = () => {
        this.setState({openForm: 'add', errFlag: false});
    }

    handleUpload = () => {
        this.setState({openForm: 'upload', errFlag: false});
    }

    handleEdit = (obj) => {
        this.setState({openForm: 'edit', menuObj: { ...obj }, errFlag: false});
    }

    handleDelete = (obj) => {
        this.setState({openForm: 'delete', menuObj: { ...obj }, errFlag: false});
    }

    handleClose = (type) => {
        return this.getMenu();
    }

    getTableData = () => {
        let arr = [...this.state.menu];

        return arr.map(data => {
            delete data['cname'];
            return data;
        })
    }

    getDataTableRows = () => {
        let arr = [...this.state.menu];

        return [...arr];
    }

    getDataTableColumns = () => {
        return [
            {id: "id", label: 'ID', show: false},
            {id: "cid", label: "Category Id", show: false},
            {id: "cname", label: "Category Name"},
            {id: "item", label: "Item"},
            {id: "shortdesc", label: "Short Description"},
            {id: "fullprice", label: "fullprice"},
            {id: "halfprice", label: "halfprice"},
            {id: "foodtype", label: "foodtype"},
            {id: "available", label: "available"},
            {id: "actions", label: "Action"}
        ];
    }

    render() {
        return (
            <div className="menu-section">
                {this.state.errFlag && <h3>{this.state.errorMsg}</h3>}

                <DataTable
                    rows={this.state.menu} 
                    columns={this.getDataTableColumns()}
                    title="Menu Data"
                    handleAdd={this.handleAdd}
                    handleUpload={this.handleUpload}
                    handleEdit={this.handleEdit}
                    handleDelete={this.handleDelete} />

                {this.state.openForm === 'add' && <AddMenu 
                                                        open={true} 
                                                        handleClose={() => this.handleClose("add")} 
                                                        handleSuccess={this.getMenu}
                                                        category={this.state.category} />}

                {this.state.openForm === 'upload' && <UploadMenu 
                                                        open={true} 
                                                        handleClose={() => this.handleClose("upload")} 
                                                        handleSuccess={this.getMenu}
                                                        category={this.state.category} />}

                {this.state.openForm === 'edit' && <EditMenu
                                                        open={true} 
                                                        handleClose={() => this.handleClose("edit")} 
                                                        handleSuccess={this.getMenu} 
                                                        category={this.state.category} 
                                                        menuObj={this.state.menuObj} />}

                {this.state.openForm === "delete" && <DeleteMenu
                                                        open={true} 
                                                        handleClose={() => this.handleClose("delete")} 
                                                        menuObj={this.state.menuObj}
                                                        handleSuccess={this.getMenu} />}
            </div>
        );
    }
}

export default Menu;