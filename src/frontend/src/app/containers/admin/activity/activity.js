import React, { Component } from 'react'

import Title from './../../../components/title/title'
import Button from './../../../components/button/button'
import InfoActivity from './../../../components/infoActivity/infoActivity'

class Activity extends Component{
	render(){
		console.log(this.props.title)
		return(
			<React.Fragment>
				<Title> Hoạt động sinh viên </Title>
				<div>
					<Button>Thêm</Button>
					<Button>Xóa</Button>
					<Button>Sữa</Button>
				</div>
				<div>
					<InfoActivity 
						name='Tuần lễ tình nguyện'
						time='12/12/2019'
						location='Lầu 1'
					/>
					<InfoActivity 
						name='Tuần lễ hiến máu'
						time='3/8/2019'
						location='Phòng họp'
					/>
				</div>
			</React.Fragment>
		)
	}
}

export default Activity