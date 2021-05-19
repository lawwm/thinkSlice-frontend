import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = () => {
    return (
        <Container>
            <Spinner animation="border" variant="dark" />
        </Container>
    )
}

export default LoadingSpinner