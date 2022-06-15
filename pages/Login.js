import React,{useState} from 'react'
import styled from "styled-components";
import Head from "next/head"
import {  Button } from "@mui/material";
import {auth,provider} from "../firebase";
import {Circle} from 'better-react-spinkit'

export default function Login() {

    const signin = () =>{
        auth.signInWithPopup(provider).catch(alert)
        // setLoading(!loading);
    }

    const [ loading ,setLoading ] =useState(false)
  return (
    <Container>
        <Head>
            <title>Login</title>
        </Head>
        <LoginContainer>
           <Logo 
            src= {'https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'}
           />
           <Btn onClick={signin} variant="outlined">{!loading ? "Sign in with Google" : <Circle color="#3cbc28" size={30} style={{position: "relative"}}/>}</Btn>
        </LoginContainer>
    </Container>
  )
}

const Container = styled.div`
height: 100vh;
display: grid;
place-items: center;
background-color:whitesmoke;

`;

const LoginContainer  = styled.div`
padding:100px;
display:flex;
flex-direction:column;
align-items:center;
background-color:white;
border-radius:10px;
box-shadow: 0px 4px 14px -3px rgba(0,0,0,0.7);
`;

const Logo  = styled.img`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
`;

const Btn = styled(Button)`
width: 200px;
background-color:#f9f9f9;
transition: 0.3s;
color:#3cbc28;
border: 1px solid #3cbc28;
:hover{
    box-shadow: 0px 2px 5px -2px rgba(0,0,0,0.7);
    background-color:#f9f9f9;
    border: 1px solid #3cbc28;
}
`;
