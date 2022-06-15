import { Avatar, Button, IconButton } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useCollection } from "react-firebase-hooks/firestore";
import {useRouter} from "next/router"

function Chat({ id, users }) {

  const router = useRouter()
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );
 
  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);
  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <div>
      <p>{recipientEmail}</p>
      {recipient?.typing ? <p className="typing-text">Typing....</p>:<p className="last-message-text">Last Message</p>}
      </div>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0px 15px;
  word-wrap: break-word;
  height: 80px;

  :hover {
    background-color: #e9eaeb;
  }
  .typing-text{
    font-size: 15px;
    font-weight: bold;
    margin-top:-10px;
    color: #00CA00;
  }
  .last-message-text{
    font-size: 15px;
    margin-top:-10px;
    color: #aaa;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
