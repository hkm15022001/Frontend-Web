import React from 'react';
import './index.css';

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// Source code: https://www.w3schools.com/howto/howto_css_fixed_footer.asp

export default function Footer() {
    return (
        <footer className="font-small py-2">
            <Container className="Footer-container text-center " fluid>
                <Row>
                    <Col className="md-6 mt-md-0 mt-3">
                        <h5 className="text-uppercase">Project Information</h5>
                        <p>Assignment - Your Major</p>
                        <p>Your School</p>
                    </Col>
                    <hr className="clearfix w-100 d-md-none pb-3" />
                    <Col className="col-md-3 mb-md-0 mb-3">
                        <h5 className="text-uppercase">Student</h5>
                        <p> Yourname - Code</p>
                    </Col>
                    <Col className="md-3 mb-md-0 mb-3">
                        <h5 className="text-uppercase">Lecturer</h5>
                        <p>Your Lecturer</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}