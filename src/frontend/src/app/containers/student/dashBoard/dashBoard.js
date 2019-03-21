import React from 'react'
import StudentMenu from './../../../components/menuStudentDashboard/menuStudentDashboard'
import Header from './../../../components/headerDashboardStudent/headerDashboard'
class StudenDashboard extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className = 'dashboard'>
                    <Header></Header>
                    <StudentMenu></StudentMenu>
                </div>
            </React.Fragment>
        )
    }
}

export default StudenDashboard