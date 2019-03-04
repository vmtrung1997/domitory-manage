import React, { Component } from 'react'

import './activity.css'
import Title from './../../../components/title/title'
import Button from './../../../components/button/button'
import InfoActivity from './../../../components/infoActivity/infoActivity'
import InfoActivityTable from './../../../components/infoActivity/infoActivityTable'

class Activity extends Component{
	constructor(props){
		super(props)
		this.state = {
			isTable: true
		}
	}
	isCheckTable = (val) => {
		this.setState({
			isTable: val
		})
	}
	render(){	
		const data = [
			{
				name: 'Tuần lể hiến máu',
				time: '12/12/2019',
				location: 'Phòng 101',
				par: 10,
				rule: 'Không bắt buộc',
				status: 'Hoàn thành'
			},
			{
				name: 'Tuần lể hiến máu',
				time: '12/12/2019',
				location: 'Phòng 101',
				par: 10,
				rule: 'Không bắt buộc',
				status: 'Hoàn thành'
			},
			{
				name: 'Tuần lể hiến máu',
				time: '12/12/2019',
				location: 'Phòng 101',
				par: 10,
				rule: 'Không bắt buộc',
				status: 'Hoàn thành'
			},
			{
				name: 'Tuần lể hiến máu',
				time: '12/12/2019',
				location: 'Phòng 101',
				par: 10,
				rule: 'Không bắt buộc',
				status: 'Hoàn thành'
			},
		]
		const tmp = data.map((item , i) => {
			return(
				<InfoActivity 
					name = {item.name}
					time = {item.time}
					location= {item.location}
					par = {item.par}
					rule = {item.rule}
					status = {item.status}
				/>
			)
		})
		return(
			<React.Fragment>
				<Title> Hoạt động sinh viên </Title>
				<div className='header-optimize'>
					<div>
						<Button color='default' style={{margin: '5px'}} onClick={() => this.isCheckTable(true)}>
							<i className="fas fa-list-ul"></i>
						</Button>
						<Button color='default' onClick={() => this.isCheckTable(false)}>
							<i className="fas fa-table"></i>
						</Button>
					</div>
					<div className='bts-header'>
						<Button className='bt-header'>Thêm</Button>
						<Button className='bt-header'>Báo cáo</Button>
					</div>
				</div>
				{ this.state.isTable ? 
					<InfoActivityTable data={data}/>
					:
					<div className="infor-activity">
						{tmp}
					</div>

				}
			</React.Fragment>
		)
	}
}

export default Activity