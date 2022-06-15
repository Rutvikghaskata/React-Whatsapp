import React, { useState, useRef, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@mui/material";          
import MoreVertIcon from "@mui/icons-material/MoreVert";          
import AttachFileIcon from "@mui/icons-material/AttachFile";          
import Message from "./Message";          
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";          
import MicIcon from "@mui/icons-material/Mic";          
import firebase from "firebase";          
import getRecipientEmail from "../utils/getRecipientEmail";          
import TimeAgo from "timeago-react";          
import SendIcon from "@mui/icons-material/Send";          
          
function ChatScreen({ chat, messages }) {          
  const [user] = useAuthState(auth);          
  const [input, setInput] = useState("");          
  const endOfMessagesRef = useRef(null);          
  const router = useRouter();          
          
  const [messagesSnapshot] = useCollection(          
    db          
      .collection("chats")          
      .doc(router.query.id)          
      .collection("messages")          
      .orderBy("timestamp", "asc")          
  );          
          
  const [recipientSnapshot] = useCollection(          
    db          
      .collection("users")          
      .where("email", "==", getRecipientEmail(chat.users, user))          
  );          
          
  const showMessages = () => {          
    if (messagesSnapshot) {          
      return messagesSnapshot.docs.map((message) => (          
        <Message          
          key={message.id}          
          user={message.data().user}          
          message={{          
            ...message.data(),          
            timestamp: message.data().timestamp?.toDate().getTime(),          
          }}          
        />          
      ));          
    } else {          
      return JSON.parse(messages).map((message) => (          
        <Message key={message.id} user={message.user} message={message} />          
      ));          
    }          
  };          
          
  const scrollToBottom = () => {          
    endOfMessagesRef.current.scrollIntoView({          
      behavior: "auto",          
      block: "start",          
    });          
  };          
          
  const sendMessage = (e) => {          
    e.preventDefault();          
          
    db.collection("users").doc(user.uid).set(          
      {          
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),          
      },          
      { merge: true }          
    );          
          
    db.collection("chats").doc(router.query.id).collection("messages").add({          
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),          
      message: input,          
      user: user.email,          
      photoURL: user.photoURL,          
    });          
          
    setInput("");          
  };          
          
  const recipient = recipientSnapshot?.docs?.[0]?.data();          
  const recipientEmail = getRecipientEmail(chat.users, user);          

  useEffect(() => {
    scrollToBottom();
  });
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient.photoURL} />
        ) : (
          <Avatar src={recipientEmail[0]} />
        )}
        <HeaderInformation>
          <h3 style={{ marginBottom: -10 }}>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active :{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Last active....</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>     
        </HeaderIcons>     
      </Header>     
     
      <MessageContainer>     
        {/* show messages */}     
        {showMessages()}     
        <EndOfMessage ref={endOfMessagesRef} />     
      </MessageContainer>     
       { recipient?.typing === true &&     
       <Loader>     
         <div className="ball"></div>     
         <div className="ball"></div>     
         <div className="ball"></div>     
       </Loader>      
}     
      <InputContainer>     
        <IconButton>     
          <InsertEmoticonIcon />     
        </IconButton>     
     
        <Input     
          value={input}     
          placeholder="Type a message..."     
          onChange={(e) => setInput(e.target.value)}     
          onFocus={() =>{     
                 
            db.collection("users").doc(user.uid).update({     
              typing: true     
            }).catch(err => {     
              alert(err.message)     
            })     
          }}     
          onBlur={() =>{     
                 
            db.collection("users").doc(user.uid).update({     
              typing: false     
            }).catch(err => {     
              alert(err.message)     
            })
          }}
        />
        <SendBtn
          disabled={!input}
          type="submit"
          onClick={sendMessage}
          style={{ opacity: !input ? 0.5 : 1, marginLeft: 10 }}
        >
          <Send />
        </SendBtn>
        <IconButton style={{ marginRight: 5, marginLeft: 10 }}>
          <MicIcon />
        </IconButton>
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div`
  background-color: #ddd;
  background: url("https://wallpapercave.com/wp/wp4410743.png") no-repeat center
    center fixed;
  background-size: cover;
`;

const Header = styled.div`
  position: sticky;
  background-color: #fff;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: grey;
  }
`;

const MessageContainer = styled.div`
  padding-top: 60px;
  padding-left: 30px;
  padding-right: 30px;
  /* background-color: #e5ded8; */
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const HeaderIcons = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  margin-left: 30px;
  margin-right: 30px;
  z-index: 100;
  border-radius: 10px;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
  background-color: whitesmoke;
  font-size: 16px;
`;

const SendBtn = styled.button`
  outline: none;
  border-width: 0;
  color: #fff;
  background-color: #0096ff;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  height: 43px;
  width: 43px;
  border-radius: 5px;
`;

const Send = styled(SendIcon)`
  margin-top: -2px;
  margin-left: 2px;
  transform: rotate(-30deg);
`;



const Loader = styled.div`
   width: 70px;
   display: flex;
   flex-wrap: wrap;
   align-items: flex-end;
   justify-content: space-between;
   margin-left: 35px;
   margin-bottom: 10px;
   background-color:#fff;
   padding-left: 15px;
   padding-right: 15px;
   padding-top: 12px;
   padding-bottom: 12px;
   border-radius: 10px;
   
   .ball{
     width:10px;
     height:10px;
     border-radius: 50%;
     background-color:#aaa;
     animation: bounce .4s alternate infinite;
   }
   .ball:nth-child(2){
     animation-delay: .16s;
   }
   .ball:nth-child(3){
     animation-delay: .32s;
   }
   
   @keyframes bounce {
     from { 
       transform: scale(1.25);
       background-color:#ccc;
     }
     to { 
      transform: scale(1);
      }
   }

`;


