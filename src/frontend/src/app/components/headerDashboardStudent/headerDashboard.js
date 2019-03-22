
import { Nav, Image, NavDropdown, Navbar, Form, Button, FormControl } from 'react-bootstrap'
import React from 'react'

class HeaderDashboardStudent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Navbar  sticky="top" bg="primary" variant="dark" expand="lg">
                    <Navbar.Brand >
                        Kí túc xá Trần Hưng Đạo
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Trang chủ</Nav.Link>
                            <Nav.Link href="#link">Tin tức</Nav.Link>
                            <Nav.Link href="#link">Giới thiệu</Nav.Link>
                            
                        </Nav>
                        <Form inline>
                            <Nav className="mr-auto">
                                <NavDropdown title="Chào bạn" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Đổi mật khẩu</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.2">Đăng xuất</NavDropdown.Item>
                            </NavDropdown>
                            </Nav>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>;
            </React.Fragment>
        )
    }
}

export default HeaderDashboardStudent;