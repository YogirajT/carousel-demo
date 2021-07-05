import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  root: {
    background: (props) => {
        switch(props.color) {
            case "red":
                return 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)';
            case "green":
                return 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)';
            default:
                return 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)';
        }
    },
    border: 0,
    borderRadius: 3,
    boxShadow: (props) => {
        switch(props.color) {
            case "red":
                return '0 3px 5px 2px rgba(255, 105, 135, .3)';
            case "green":
                return  '0 3px 5px 2px rgba(33, 203, 243, .3)';
            default:
                return  '0 3px 5px 2px rgba(33, 203, 243, .3)';
        }
    },
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 8,
  },
});

function ThemeBtn(props) {
  const { color, ...other } = props;
  const classes = useStyles(props);
  return <Button className={classes.root} {...other} />;
}

ThemeBtn.propTypes = {
  color: PropTypes.oneOf(['blue', 'red']).isRequired,
};

export function GreenButton() {
  return <ThemeBtn color="green">Accept</ThemeBtn>
}

export function RedButton() {
    return <ThemeBtn color="red">Reject</ThemeBtn>;
}

export function DefaultButton() {
    return <ThemeBtn >Skip</ThemeBtn>;
}