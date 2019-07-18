import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import Title from '../../../components/title/title';
import DatePicker from '../../../components/datePicker/datePicker'
import Button from '../../../components/button/button';
import Loader from '../../../components/loader/loader';
import * as dbLogAction from './databaseLogAction';
class DatabaseLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date: new Date(),
			loading: false,
			logs: ''
		}
	}
	componentDidMount() {
		this.onHandleSubmit();
	}
	arrayBufferToBase64 = (buffer) => {
		var binary = '';
		var bytes = [].slice.call(new Uint8Array(buffer));
		bytes.forEach((b) => binary += String.fromCharCode(b));
		return window.btoa(binary);
	};
	
	onHandleSubmit = () => {
		this.setState({ loading: true })
		console.log(this.state.date)
		var parameter = {
			time: this.state.date,
		}
		dbLogAction.getLog(parameter)
			.then(result => {
				if (result.data.rs.type && result.data.rs.type == 'Buffer'){
					var buffer = new Buffer(result.data.rs.data);
					this.setState({logs: buffer.toString()});
				}
				else 
					this.setState({logs: ''})
				this.setState({loading: false})
			})
			.catch({loading: false})

	}

	render() {
		return (
			<React.Fragment>
				<Loader loading={this.state.loading} />
				<Title>Database log</Title>
				<div className="content-body">
					<Row>
						<Col md={4}>
							Ngày
						<div>
								<DatePicker
									startDate={this.state.date}
									getValue={(date) => { this.setState({ date: date }) }}
								/>
							</div>
						</Col>
						<Col>&nbsp;<Col><Button onClick={e => this.onHandleSubmit()}><i className="fas fa-search" /></Button></Col></Col>
					</Row>
					<div>
						<textarea rows={20} value={this.state.logs} />
					</div>
				</div>
			</React.Fragment>

		)
	}
}

export default DatabaseLog