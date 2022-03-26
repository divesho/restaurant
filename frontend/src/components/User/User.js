import React, { Component } from 'react';
import axios from 'axios';
import config from './../../config';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import CustomCheckbox from '../Common/CustomCheckbox';
import { green } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';
import WOW from 'wowjs';

class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errFlag: false,
            errorMsg: '',
            category: '',
            menu: {},
            category: '',
            veg: false,
            available: false
        }
        this.wow = null;
    }

    componentDidMount() {
        this.getMenu();
        this.wow = new WOW.WOW({
            live: true
        });
        this.wow.init();
    }

    componentDidUpdate() {
        this.wow.sync();
    }

    getMenu = () => {
        axios.get(config.serverUrl + 'fullMenu')
            .then(res => {
                var data = res.data;
                if (data.status === "success") {
                    var finalData = {};
                    data.result.map(menu => {
                        if (!finalData[menu.cname]) {
                            finalData[menu.cname] = [];
                        }
                        finalData[menu.cname].push({ ...menu });
                    });
                    var category = (Object.keys(finalData).length > 0) ? Object.keys(finalData)[0] : '';
                    this.setState({ menu: finalData, category: category, errFlag: false });
                    console.log('finalData', finalData);
                } else {
                    this.setState({ errorMsg: "Some error occured", errFlag: true });
                }
            })
            .catch(err => {
                var error = err.message || "some error occured";
                if (err.response && err.response.data) {
                    error = err.response.data.error;
                }
                return this.setState({ errorMsg: error, errFlag: true });
            });
    }

    handleClick = (category) => {
        this.setState({ category: category });
    }

    handleChange = (name) => {
        var val = !this.state[name];
        this.setState({ [name]: val });
    }

    render() {
        return (
            <div className="user-page">
                <Paper square xs={12} className="header">
                    <h3 className="title">Welcome to Rasta Cafe</h3>
                </Paper>
                <Grid container direction="row" className="menu-actions wow fadeInUp" data-wow-delay="0.03s">
                    <Grid item>
                        <CustomCheckbox name="onlyVeg" label="only veg" checked={this.state.veg} color={green} handleChange={() => this.handleChange('veg')} />
                    </Grid>
                    <Grid className="vertical-divider"></Grid>
                    <Grid item>
                        <CustomCheckbox name="available" label="only available" checked={this.state.available} handleChange={() => this.handleChange('available')} />
                    </Grid>
                </Grid>
                <div className="body">
                    {this.state.errFlag && <h3>{this.state.errorMsg}</h3>}

                    <div className="category-list wow fadeInUp" data-wow-delay="0.03s">
                        {Object.keys(this.state.menu).map(category => {
                            return <Chip className="list-item" color={this.state.category === category ? "primary" : "default"} key={category} label={category} onClick={() => this.handleClick(category)} />
                        })}
                    </div>

                    <div className="menu-section">
                        <div className={"menu-title" + ((Object.keys(this.state.menu).length > 0) ? " wow fadeInUp" : "")}  data-wow-delay="1s">
                            <div className="name"><span>Name</span></div>
                            <div className="price full"><span>Full</span></div>
                            <div className="price half"><span>Half</span></div>
                        </div>
                        {Object.keys(this.state.menu).map(category => {
                            return (<div key={category} className={"menu-list " + ((this.state.category === category) ? "active" : "")}>
                                {this.state.menu[category].filter(menuitem => {
                                    if(this.state.veg && this.state.available) {
                                        return (menuitem.foodtype === "veg" && menuitem.available === "yes");
                                    }

                                    if(this.state.veg) {
                                        return (menuitem.foodtype === "veg");
                                    }

                                    if(this.state.available) {
                                        return (menuitem.available === "yes");
                                    }

                                    return true;
                                }).map(obj => {
                                    return (<div className={"menu-detail wow fadeInUp " + (obj.available === "yes" ? "available" : "")} key={obj.id} data-wow-delay="1s">
                                        <div className="name">
                                            {obj.foodtype === "veg" && <i className="icon veg"></i>}
                                            {obj.foodtype === "nonveg" && <i className="icon nonveg"></i>}                                            
                                            <span>{obj.item}</span>
                                            <div className="short-description">{obj.shortdesc}</div>
                                        </div>
                                        <div className="price full"><span>{obj.fullprice} Rs</span></div>
                                        <div className="price half">
                                            <span>{obj.halfprice == 0 ? "---" : (obj.halfprice + " Rs")}</span>
                                        </div>
                                    </div>);
                                })}
                            </div>);
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default User;