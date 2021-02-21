import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { auth, db } from "../services/firebase";
import { useAuthState } from 'react-firebase-hooks/auth';
import {
    Col,
    Jumbotron,
    Form,
    Button,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';

const Signup = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [user={}] = useAuthState(auth());

    const handleSubmit = async (event) => {
        console.log('handle submit');
        event.preventDefault();
        setError('');
        try {
            let createdUser = await auth().createUserWithEmailAndPassword(email, pass);
            let user = auth().currentUser;
            user.updateProfile({displayName: name})
            const newUser = db.ref('users/').push();
            newUser.set({email: email, name:name, id: createdUser.user.uid});
        } catch (error) {
            setError(error.message);
        }
    }

    const redirectToSignin = () => {
        history.push('/signin');
    }

    const googleSignIn = async () => {
        try {
            const provider = new auth.GoogleAuthProvider();
            let createdUser = await auth().signInWithPopup(provider);
            const newUser = db.ref('users/').push();
            newUser.set({email: email, name: createdUser.user.displayName, id: createdUser.user.uid});
        } catch (error) {
            setError(error.message);
        }
    }

    return (
            <Jumbotron>

                <Col xm="12" md={{ size: 4, offset: 4 }} sm={{ size: 6, offset: 3 }}>
                    <h2 className="TextCenter">Sign Up</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                        <Label>Name</Label>
                            <Input type="text" name="name" id="name" placeholder="Enter Your Name" value={name} onChange={(e) => { setName(e.target.value) }} />
                            <Label>Email</Label>
                            <Input type="text" name="email" id="email" placeholder="Enter Your Email" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            <Label>Password</Label>
                            <Input type="text" name="password" id="password" placeholder="Enter Your Password" value={pass} onChange={(e) => { setPass(e.target.value) }} />
                        </FormGroup>
                        {error ? <p className="ErrorMessage">{error}</p> : null}
                        <Button variant="primary" type="submit" size="lg" block>
                            Create Account
                    </Button>
                    </Form>
                    <p className="TextCenter">Or</p>

                    <Button variant="primary" size="lg" block onClick={googleSignIn}>
                        Sign Up with Google
                    </Button>

                    <p className="TextCenter">Already registered?</p>

                    <Button variant="primary" size="lg" block onClick={redirectToSignin}>
                        Go to Login
                    </Button>

                </Col>
            </Jumbotron>
        );
}

export default Signup;