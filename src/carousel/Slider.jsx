import React, { useRef, useCallback, useState } from 'react'
import { useDrag } from 'react-use-gesture'
import { useSprings, a, useSpring } from 'react-spring'
import debounce from 'lodash.debounce'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { Chip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import SkipNextIcon from '@material-ui/icons/SkipNext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    height: '125px',
    width: '100%',
    position: 'absolute',
    top: 0,
    display: 'flex',
    alignItems: 'center',
    top: "100%",
    '& > *': {
      margin: theme.spacing(0.5),
    },
    '& > .MuiChip-root': {
      height: "45px",
      minWidth: "95px",
      borderRadius: "5px"
    }
  },
  approve: {
    color: "green",
    borderColor: "green",
    minWidth: "94px"
  },
  skip: {
    color: "#f8f8f5",
    borderColor: "#f8f8f5",
  },
  reject: {
    color: "red",
    borderColor: "red",
  }
}));

const styles = {
  container: { display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', height: '100%', width: '100%' },
  item: { position: 'absolute', height: '100%', willChange: 'transform' },
  dotcontainer: {
    padding: '0.7rem 1rem',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    borderRadius: '99px',
    background: '#fff',
    width: '5px',
    height: '5px',
    margin: '.3rem',
    color: '#000'
  },
}

export default function SliderContainer(props) {
  const [width, setWidth] = useState(0)

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width)
    }
  }, [])

  return (
    <>
      <div ref={measuredRef} style={{ height: '100%', position: 'relative' }}>
        {width !== 0 ? (
          <Slider {...props} itemWidth={width}>
            {props.children}
          </Slider>
        ) : (
          'null'
        )}
      </div>
    </>
  )
}

/**
 * Calculates a spring-physics driven infinite slider
 *
 * @param {Array} items - display items
 * @param {Function} children - render child
 * @param {number} width - fixed item with
 * @param {number} visible - number of items that must be visible on screen
 * @param {object} style - container styles
 * @param {boolean} showButtons - shows buttons
 * @param {boolean} showCounter - shows counter
 */
function Slider({ items, itemWidth = 'full', visible = items.length - 2, style, children, showButtons = true, showCounter = true }) {

  const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  let width = itemWidth === 'full' ? windowWidth : Math.ceil(itemWidth)
  const idx = useCallback((x, l = items.length) => (x < 0 ? x + l : x) % l, [items])
  const getPos = useCallback((i, firstVis, firstVisIdx) => idx(i - firstVis + firstVisIdx), [idx])
  // Important only if specifyng width, centers the element in the slider
  const offset = 0
  const [springs, set] = useSprings(items.length, (i) => ({ x: (i < items.length - 1 ? i : -1) * width + offset }))
  const prev = useRef([0, 1])
  const index = useRef(0)
  const [active, setActive] = useState(1)
  const classes = useStyles();
  const runSprings = useCallback(
    (y, vy, down, xDir, cancel, xMove) => {
      // This decides if we move over to the next slide or back to the initial
      if (!down) {
        index.current += ((-xMove + (width + xMove)) / width) * (xDir > 0 ? -1 : 1)
        // cancel()
      }
      if (index.current + 1 > items.length) {
        setActive((index.current % items.length) + 1)
      } else if (index.current < 0) {
        setActive(items.length + ((index.current + 1) % items.length))
      } else {
        setActive(index.current + 1)
      }
      // The actual scrolling value
      const finalY = index.current * width
      // Defines currently visible slides
      const firstVis = idx(Math.floor(finalY / width) % items.length)
      const firstVisIdx = vy < 0 ? items.length - visible - 1 : 1
      set((i) => {
        const position = getPos(i, firstVis, firstVisIdx)
        const prevPosition = getPos(i, prev.current[0], prev.current[1])
        let rank = firstVis - (finalY < 0 ? items.length : 0) + position - firstVisIdx + (finalY < 0 && firstVis === 0 ? items.length : 0)
        return {
          // x is the position of each of our slides
          x: (-finalY % (width * items.length)) + width * rank + (down ? xMove : 0) + offset,
          // this defines if the movement is immediate
          // So when an item is moved from one end to the other we don't
          // see it moving
          immediate: vy < 0 ? prevPosition > position : prevPosition < position
        }
      })
      prev.current = [firstVis, firstVisIdx]
    },
    [idx, getPos, width, visible, set, items.length]
  )

  const bind = useDrag(({ offset: [x], vxvy: [vx], down, direction: [xDir], cancel, movement: [xMove] }) => {
    vx && runSprings(-x, -vx, down, xDir, cancel, xMove)
  })

  const buttons = (next) => {
    index.current += next
    runSprings(0, next, true, -0, () => {}, -0)
  }

  const debounceTransition = debounce(buttons, 10)

  return (
    <>
      {showButtons ? (
        <><div className={classes.root} >
          <Chip
            className={classes.approve}
            size="medium"
            icon={<CheckCircleOutlineIcon fontSize="medium"/>}
            label="Approve"
            clickable
            variant="outlined"
            onClick={() => debounceTransition(1)}
            color="primary"
          />
          <Chip
            className={classes.skip}
            size="medium"
            icon={<SkipNextIcon fontSize="medium"/>}
            label="Skip"
            clickable
            variant="outlined"
            onClick={() => debounceTransition(1)}
            color="default"
          />
          <Chip
            className={classes.reject}
            clickable
            icon={<CancelIcon style={{ color: 'red' }}/>}
            label="Reject"
            variant="outlined"
            onClick={() => debounceTransition(1)}
            color="secondary"
          />
        </div>
        {showCounter ? <InstaCounter currentIndex={active} data={items} /> : null}
        </>
      ) : null}

      <div style={{ ...style, ...styles.container }}>
        {springs.map(({ x, vel }, i) => (
          <a.div key={i} style={{ ...styles.item, width, x }} children={children(items[i], i)} />
        ))}
      </div>
    </>
  )
}

function InstaCounter({ currentIndex, data }) {
  const dots = []

  for (const [index] of data.entries()) {
    dots.push(<Dot key={index} active={currentIndex - 1 === index} />)
  }
  return (
    <div style={{ ...styles.navigation }}>
      <div style={{ ...styles.dotcontainer }}>{dots}</div>
    </div>
  )
}

function Dot({ active }) {
  const { transform, opacity } = useSpring({
    opacity: active ? 1 : 0.8,
    transform: active ? `scale(1.5)` : `scale(1)`,
    config: { mass: 5, tension: 500, friction: 80 }
  })
  return <a.div style={{ opacity: opacity.to((o) => o), transform, ...styles.dot }} />
}