import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from "../services/firebase";
import {
    Col,
    Jumbotron,
    Form,
    Button,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
const Signin = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = async (event) => {
        console.log('handle submit');
        event.preventDefault();
        setError('');
        try {
            const user = await auth().signInWithEmailAndPassword(email, pass);
        } catch (error) {
            setError(error.message);
        }
    }

    const redirectToSignup = () => {
        history.push('/signup');
    }

    return (
        <div>
            <Jumbotron>

                <Col xm="12" md={{ size: 4, offset: 4 }} sm={{ size: 6, offset: 3 }}>
                    <h2 className="TextCenter">Sign in</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label>Email</Label>
                            <Input type="text" name="email" id="email" placeholder="Enter Your Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            <Label>Password</Label>
                            <Input type="text" name="password" id="password" placeholder="Enter Your Password" value={pass} onChange={(e) => { setPass(e.target.value) }} />
                        </FormGroup>
                        {error ? <p className="ErrorMessage">{error}</p> : null}
                        <Button variant="primary" type="submit" size="lg" block>
                            Login
                    </Button>
                    </Form>
                    <p className="TextCenter">Do not have an account?</p>

                    <Button variant="primary" size="lg" block onClick={redirectToSignup}>
                        Sign Up
                    </Button>

                </Col>
            </Jumbotron>
        </div>);
}

export default Signin;