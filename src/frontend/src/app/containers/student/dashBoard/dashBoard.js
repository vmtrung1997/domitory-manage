import React from 'react'
import StudentMenu from './../../../components/menuStudentDashboard/menuStudentDashboard'
import ProfileStudent from './../../../components/profileStudent/profileStudent'
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