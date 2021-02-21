import React, { useState } from 'react';
import {
    useHistory
} from "react-router-dom";
import {
    Alert,
    Jumbotron,
    Spinner,
    Form,
    Button,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import {db} from '../services/firebase';

const AddGroup = () => {
    const history = useHistory();
    const [group, setGroup] = useState({ groupname: '' });
    const [showLoading, setShowLoading] = useState(false);
    const ref = db.ref('groups/');

    const save = (e) => {
        e.preventDefault();
        setShowLoading(true);
        ref.orderByChild('groupname').equalTo(group.groupname).once('value', snapshot => {
            if (snapshot.exists()) {
                return (
                    <div>
                        <Alert color="primary">
                            Group name already exist!
                        </Alert>
                    </div>
                );
            } else {
                const newGroup = db.ref('groups/').push();
                newGroup.set(group);
                setShowLoading(false);
            }
        });
    };

    const onChange = (e) => {
        e.persist();
        setGroup({ ...group, [e.target.name]: e.target.value });
    }

    return (
        <div>
            {showLoading &&
                <Spinner color="primary" />
            }
            <Jumbotron>
                <h2>Please enter new Group</h2>
                <Form onSubmit={save}>
                    <FormGroup>
                        <Label>Group Name</Label>
                        <Input type="text" name="groupname" id="groupname" placeholder="Enter Group Name" value={group.groupname} onChange={onChange} />
                    </FormGroup>
                    <Button variant="primary" type="submit">
                        Add
                    </Button>
                </Form>
            </Jumbotron>
        </div>
    );

}

export default AddGroup;