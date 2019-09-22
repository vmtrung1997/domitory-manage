import { css } from '@emotion/core';
import React, { Component} from 'react'
import { ScaleLoader } from 'react-spinners';

const override = css`
    z-index: 100000;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
	background: #2125290a;
`;

class Loader extends Component{
	static defaultProps = {
		loading: false
	}
	render(){
		return(
			<ScaleLoader
				css={override}
			    loading={this.props.loading}
			    sizeUnit={"px"}
          		size={200}
          		height={40}
          		width={5}
          		color={'#1ACCAB'}
			/>
		)
	}
} 

export default Loader