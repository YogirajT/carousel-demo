import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Carousel from "react-spring-3d-carousel";
import { config } from "react-spring";
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '90%',
      maxWidth: '500px',
      backgroundColor: "#909090",
      color: "#e0e0e0",
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    section1: {
      margin: theme.spacing(3, 2),
    },
    section2: {
      margin: theme.spacing(2),
    },
    section3: {
      margin: theme.spacing(3, 1, 1),
    },
}));

function MiddleDividers() {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <div className={classes.section1}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography gutterBottom variant="h4">
                Liquidity Fund
              </Typography>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="h6">
                -360
              </Typography>
            </Grid>
          </Grid>
          <Typography color="textSecondary" variant="body2">
            
          </Typography>
        </div>
        <Divider variant="middle" />
        <div className={classes.section2}>
          <Typography gutterBottom variant="body1">
            Permissions
          </Typography>
          <div>
            <Chip className={classes.chip} label="Admin" />
            <Chip className={classes.chip} color="primary" label="Manager" />
            <Chip className={classes.chip} label="Associate" />
          </div>
        </div>
        <div className={classes.section3}>
          <Button color="primary">Titles</Button>
        </div>
        <div className={classes.section1}>
          <Typography color="textSecondary" variant="body2">
            Assets invested are not tied up for a long time as liquid funds do not have a lock-in period.
          </Typography>
        </div>
        <Divider variant="middle" />
        <div className={classes.section1}>
          <Typography color="textSecondary" variant="body2">
            The dividends paid out by the debt fund or liquid fund are entirely tax free in the hands of the fund investor.
          </Typography>
        </div>
        <Divider variant="middle" />
      </div>
    );
}
  
export default function SpringSlide () {

  const [state, setState] = useState({
    goToSlide: 0,
    offsetRadius: 2,
    showNavigation: false,
    config: config.gentle
  });

  const slides = [
      {
          key: 1,
          content: <MiddleDividers />
      },
      {
          key: 2,
          content: <MiddleDividers />
      },
      {
          key: 3,
          content: <MiddleDividers />
      },
      {
          key: 4,
          content: <MiddleDividers />
      },
      {
          key: 5,
          content: <MiddleDividers />
      },
      {
          key: 6,
          content: <MiddleDividers />
      },
      {
          key: 7,
          content: <MiddleDividers />
      },
      {
          key: 8,
          content: <MiddleDividers />
      }
  ].map((slide, index) => {
    return { ...slide, onClick: () => setState({ goToSlide: index }) };
  });

  let xDown = null;
  let yDown = null;

  const getTouches = (evt) => {
    return (
      evt.touches || evt.originalEvent.touches // browser API
    ); // jQuery
  };

  const handleTouchStart = (evt) => {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };

  const handleTouchMove = (evt) => {
    if (!xDown || !yDown) {
      return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        /* left swipe */
        setState({ goToSlide: state.goToSlide + 1 });
      } else {
        /* right swipe */
        setState({ goToSlide: state.goToSlide - 1 });
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
      } else {
        /* down swipe */
      }
    }
    xDown = null;
    yDown = null;
  };

  return (<div
    style={{ width: "80vw", height: "100%", margin: "0 auto" }}
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
  >
    <Carousel
      slides={slides}
      goToSlide={state.goToSlide}
      offsetRadius={state.offsetRadius}
      showNavigation={state.showNavigation}
      animationConfig={state.config}
    />
  </div>
  );
}
