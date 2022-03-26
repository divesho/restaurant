import React from 'react';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { makeStyles } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

const getColor = (color) => {
    return color ? color : blue;
}

const useStyles = makeStyles({
    root: {
        color: props => getColor(props.color)[400],
        '&.Mui-checked': {
            color: props => getColor(props.color)[600],
        }
    }
});

const CustomCheckbox = (props) => {
    const styles = useStyles(props);

    return (
        <FormControlLabel
            control={<Checkbox className={styles.root} checked={props.checked} onChange={props.handleChange} name={props.name} />}
            label={props.label}
        />
    );
};

export default CustomCheckbox;