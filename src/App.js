import React from 'react'
import './App.css';
import styled from 'styled-components'
import { a } from 'react-spring'
import InfiniteSlider from './carousel/Slider'
import items from './carousel/items'
import SpringSlider from './spring-slider/SpringSlider'

const Main = styled.div`
  height: min(600px,100vh - 100px);
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 100px;
`

const Content = styled.div`
  width: 100%;
  height: 100%;
`

const Image = styled(a.div)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
`

export default function App() {
  return (
    <Main>
      <InfiniteSlider items={items}>
        {({ css }, i) => (
          <Content>
            <SpringSlider />
          </Content>
        )}
      </InfiniteSlider>
    </Main>
  )
}

