import React, { Component } from 'react';
import axios from 'axios';

import config from './../../config';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: { name: '', password: '' },
            errFlag: false,
            successMsg: '',
            errorMsg: ''
        }
    }

    handleChange = (event) => {
        var el = event.target;
        var user = this.state.user;

        user[el.name] = el.value;

        this.setState({ user: { ...user } });
    }

    handleClick = () => {
        var user = this.state.user;
        var url = config.serverUrl + "login";

        if (!user.name || !user.password) {
            return this.setState({ errorMsg: 'please enter valid user details', errFlag: true });
        }

        axios.post(url, user)
            .then((res) => {
                var data = res.data;
                if (data.status === "success") {
                    this.setState({ successMsg: data.result.msg, errFlag: false });
                    sessionStorage.jwtToken = data.result.jwtToken;
                    this.props.history.push("/admin");
                } else {
                    this.setState({ errorMsg: "Some error occured", errFlag: true });
                }
            })
            .catch((err) => {
                var error = err.message || "some error occured";
                if (err.response && err.response.data) {
                    error = err.response.data.error;
                }
                return this.setState({ errorMsg: error, errFlag: true });
            });
    }

    render() {
        return (
            <div className="login-page">
                <Container maxWidth="sm" className="container">
                    <Paper className="box">
                        <Grid container direction="column" alignItems="center" justify="center">
                            <Grid item className="form-item">
                                <TextField className="form-field" name="name" label="User" value={this.state.user.name} onChange={this.handleChange} variant="outlined" />
                            </Grid>
                            <Grid item className="form-item">
                                <TextField className="form-field" name="password" type="password" label="Password" value={this.state.user.password} onChange={this.handleChange} variant="outlined" />
                            </Grid>
                            <Grid item className="form-item">
                                <Button className="submit-btn" variant="contained" color="primary" onClick={this.handleClick}>Submit</Button>
                            </Grid>
                            <Grid item className={"message " + (this.state.errFlag ? "red" : "green")}>
                                {this.state.errFlag ? this.state.errorMsg : this.state.successMsg}
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </div>
        );
    }
}

export default Login;