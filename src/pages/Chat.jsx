import React, { useState, useEffect } from 'react';
import {
    useHistory
  } from "react-router-dom";
import {
    Jumbotron,
    Spinner,
    ListGroup,
    ListGroupItem,
    Button
} from 'reactstrap';
import Moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import {db, auth} from '../services/firebase';
import AddGroup from '../components/AddGroup';
import Header from "../components/Header";


const  Chat = () => {
    const [groups, setGroup] = useState([]);
    const [users, setUsers] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const history = useHistory();
    const [user={}] = useAuthState(auth());

    useEffect(() => {
        const fetchData = async () => {
            try {
                db.ref('groups/').on('value', resp => {
                    setGroup([]);
                    setGroup(snapshotToArray(resp));
                    setShowLoading(false);
                });
                db.ref('users/').on('value', resp => {
                    setUsers([]);
                    setUsers(snapshotToArray(resp));
                    setShowLoading(false);
                });
            } catch (error) {
                console.log(error);
            }
        };
      
        fetchData();
    }, []);

    const snapshotToArray = (snapshot) => {
        const returnArr = [];
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });
        return returnArr;
    }

    const enterGroupChat = (groupname) => {
        const chat = { groupname: '', email: '', name: '', message: '', date: '', type: '' };
        chat.groupname = groupname;
        chat.name = user.displayName;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.message = `${user.displayName} enter the group`;
        chat.type = 'join';
        const newMessage = db.ref('chats/').push();
        newMessage.set(chat);

        db.ref('groupusers/').orderByChild('groupname').equalTo(groupname).on('value', (resp) => {
            let groupuser = [];
            groupuser = snapshotToArray(resp);
            const userExist = groupuser.find(x => x.email === user.email);
            if (userExist !== undefined) {
              const userRef = db.ref('groupusers/' + userExist.key);
              userRef.update({status: 'online'});
            } else {
              const newGroupuser = { groupname: groupname, email: user.email, name: user.displayName, status: 'online' };
              const newGroupUser = db.ref('groupusers/').push();
              newGroupUser.set(newGroupuser);
            }
        });
    
        history.push('/groupchat/' + groupname);
    }

    const enterPersonalChat = (userId) => {
        history.push('/personalchat/' + userId);
    }

    const logout = () => {
        auth().signOut();
        history.push('/login');
    }

    return (
        <div>
           <Header/>
            <AddGroup/>
            <Jumbotron>
            {showLoading &&
                <Spinner color="primary" />
            }
                <h2>Groups</h2>
                <ListGroup>
                    {groups.map((item, idx) => (
                        <ListGroupItem key={idx} action onClick={() => { enterGroupChat(item.groupname) }}>{item.groupname}</ListGroupItem>
                    ))}
                </ListGroup>
            </Jumbotron>

            <Jumbotron>
            {showLoading &&
                <Spinner color="primary" />
            }
                <h2>Users</h2>
                <ListGroup>
                    {users.map((item, idx) => (
                        <ListGroupItem key={idx} action onClick={() => { enterPersonalChat(item.id) }}>{item.name}</ListGroupItem>
                    ))}
               </ListGroup>
            </Jumbotron>
        </div>
    );

}

export default Chat