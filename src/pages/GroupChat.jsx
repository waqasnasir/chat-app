import React, { useState, useEffect } from 'react';
import {
    useHistory,
    useParams
  } from "react-router-dom";
import {
    Container, 
    Row, 
    Col,
    Card,
    CardBody,
    CardSubtitle,
    Button,
    Form,
    InputGroup,
    Input,
    InputGroupAddon
} from 'reactstrap';
import Moment from 'moment';
import { useAuthState } from 'react-firebase-hooks/auth';
import {db, auth} from '../services/firebase';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../Styles.css';

const GroupChat = () =>  {
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [user] = useAuthState(auth());
    const [groupname, setGroupname] = useState('');
    const history = useHistory();
    const { group } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setGroupname(group);
            db.ref('chats/').orderByChild('groupname').equalTo(groupname).on('value', resp => {
              setChats([]);
              setChats(snapshotToArray(resp));
            });
            db.ref('groupusers/').orderByChild('groupname').equalTo(groupname).on('value', (resp2) => {
                setUsers([]);
                const groupusers = snapshotToArray(resp2);
                setUsers(groupusers.filter(x => x.status === 'online'));
              });
        };
      
        fetchData();
    }, [group, groupname]);

    const snapshotToArray = (snapshot) => {
        const returnArr = [];

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            item.key = childSnapshot.key;
            returnArr.push(item);
        });

        return returnArr;
    }

    const submitMessage = (e) => {
        e.preventDefault();
        const chat = {};
        chat.email = user.email;
        chat.name = user.displayName;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.type = 'message';
        chat.message = message;
        chat.groupname = groupname;
        const newMessage = db.ref('chats/').push();
        newMessage.set(chat);
    };

    const onChange = (e) => {
        e.persist();
        setMessage(e.target.value);
    }

    const exitChat = (e) => {
        const chat = { };
        chat.groupname = groupname;
        chat.name = user.displayName;
        chat.email = user.email;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.message = `${user.displayName} leave the group`;
        chat.type = 'exit';
        const newMessage = db.ref('chats/').push();
        newMessage.set(chat);
    
        db.ref('groupusers/').orderByChild('groupname').equalTo(groupname).once('value', (resp) => {
          let groupuser = [];
          groupuser = snapshotToArray(resp);
          const userExist = groupuser.find(x => x.email === user.email);
          if (userExist !== undefined) {
            const userRef = db.ref('groupusers/' + userExist.key);
            userRef.update({status: 'offline'});
          }
        });
    
        history.goBack();
    }

    return (
        <div className="Container">
            <Container>
                <Row>
                    <Col xs="4">
                        <div>
                            <Card className="UsersCard">
                                <CardBody>
                                    <CardSubtitle>
                                        <Button variant="primary" type="button" onClick={() => { exitChat() }}>
                                            Exit Chat
                                        </Button>
                                    </CardSubtitle>
                                </CardBody>
                            </Card>
                            {users.map((item, idx) => (
                                <Card key={idx} className="UsersCard">
                                    <CardBody>
                                        <CardSubtitle>{item.name}</CardSubtitle>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </Col>
                    <Col xs="8">
                        <ScrollToBottom className="ChatContent">
                            {chats.map((item, idx) => (
                                <div key={idx} className="MessageBox">
                                    {item.type ==='join'||item.type === 'exit'?
                                        <div className="ChatStatus">
                                            <span className="ChatDate">{item.date}</span>
                                            <span className="ChatContentCenter">{item.message}</span>
                                        </div>:
                                        <div className="ChatMessage">
                                            <div className={`${item.email === user.email? "RightBubble":"LeftBubble"}`}>
                                            {item.email === user.email ? 
                                                <span className="MsgName">Me</span>:<span className="MsgName">{item.name}</span>
                                            }
                                            <span className="MsgDate"> at {item.date}</span>
                                            <p>{item.message}</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            ))}
                        </ScrollToBottom>
                        <footer className="StickyFooter">
                            <Form className="MessageForm" onSubmit={submitMessage}>
                                <InputGroup>
                                <Input type="text" name="message" id="message" placeholder="Enter message here" value={message} onChange={onChange} />
                                    <InputGroupAddon addonType="append">
                                        <Button variant="primary" type="submit">Send</Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </Form>
                        </footer>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default GroupChat;