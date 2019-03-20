import React from 'react'
import StudentMenu from './../../../components/menuStudentDashboard/menuStudentDashboard'
class StudenDashboard extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className = 'dashboard'>
                    <StudentMenu></StudentMenu>
                </div>
            </React.Fragment>
        )
    }
}

export default StudenDashboard