import React, { useEffect, useRef, useState, memo } from 'react'
import Swal from "sweetalert2";
import { doc, addDoc, onSnapshot, collection, query, orderBy, limit, deleteDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { dataBase } from '../../firebase/database';
import { getDatabase, ref, onValue } from "firebase/database";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import { SnackbarProvider, useSnackbar } from 'notistack';

import useAuth from '../../hooks/useAuth';

import Messages from '../../components/Messages';
import Members from '../../components/Members';
import CreateChat from '../../components/CreateChat';

import Public from '../../images/icons/Public.svg';
import Private from '../../images/icons/Private.svg';

import './styles.scss';

const Chat = () => {
  const { user } = useAuth(); // Chama o state 'User' que contém os dados do usuário logado
  const chatCollectionRef = collection(dataBase, "chats");
  const usersCollectionRef = collection(dataBase, "membros");
  const alertCollectionRef = collection(dataBase, "avisos");
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState();
  const [chatCollectionMessages, setChatCollectionMessages] = useState();
  const [members, setMembers] = useState();
  const [users, setUsers] = useState();
  const [check, setCheck] = useState(false);
  const [alerts, setAlerts] = useState();
  // const [chatCollectionMembers, setChatCollectionMembers] = useState();
  const [chat, setChat] = useState();
  const [createChat, setCreateChat] = useState();
  const findMember = useRef();
  const db = getDatabase();
  const connectedRef = ref(db, ".info/connected");
  const avisoRef = ref(db, "avisos");
  const { customAlert } = useSnackbar();


  useEffect(() => {
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        updateDoc(doc(dataBase, "membros", user.id), {
          state: 'online'
        })
        if (!check) {
          addDoc(alertCollectionRef, {
            message: `${user.name} está online`,
            id: user.id,
            date: serverTimestamp()
          })
          setCheck(true);
        }
      }
    });
  },[connectedRef, user, alertCollectionRef])

  onValue(avisoRef, (snap) => {
    const data = snap.val();
    setAlerts(data);
    console.log(alerts);
  })

  window.addEventListener("beforeunload", () => {
      updateDoc(doc(dataBase, "membros", user.id), {
            state: 'offline'
          })
  })

  useEffect(() => {
   
  },[users])

  useEffect(() => {
    if(collection) { 
        const q = query(chatCollectionRef, orderBy("created")); // Pega aos chats pela ordem descrescente do 'Created'
        const unsub = onSnapshot(q, (chats) => { // Atualiza os dados em tempo real
          let documents = [];
          chats.forEach(doc => {
            documents.push({ ...doc.data(), id: doc.id })
          })
          setChats(documents); // puxa a coleção 'Chats' para o state
        });
        
        return unsub;
      };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collection]);

  useEffect(() => {
    if(collection) { 
        const unsub = onSnapshot(usersCollectionRef, (user) => { // Atualiza os dados em tempo real
          let documents = [];
          user.forEach(doc => {
            documents.push({ ...doc.data()})
          })
          setUsers(documents); // puxa a coleção 'Chats' para o state
        });
        
        return unsub;
      };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collection]);

  useEffect(() => {
    if(collection) { 
        const unsub = onSnapshot(alertCollectionRef, (user) => { // Atualiza os dados em tempo real
          let documents = [];
          user.forEach(doc => {
            documents.push({ ...doc.data()})
          })
          setAlerts(documents); // puxa a coleção 'Chats' para o state
        });
        
        return unsub;
      };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collection]);


    const SmallAvatar = styled(Avatar)(({ theme }) => ({
      width: 30,
      height: 30,
      border: `2px solid #202024`,
    }));

  const addChat = async () => {
    setCreateChat(true)
    }

    const MembersChat = async (chat) => {
      const chatRef = doc(dataBase, "chats", chat.id)
      const membersDb = onSnapshot(await chatRef, (chat) => { // Atualiza os dados em tempo real
        setMembers(chat.data()); // puxa os objetos 'Chats' para o state
      });
      
      return membersDb;
      
    }

    const messageWelcome = async (chat) => {
      const chatCollectionMessages = doc(dataBase, "chats", chat.id);
      const colChatCollectionMessages = collection(chatCollectionMessages, 'messages');
      await addDoc(colChatCollectionMessages, {
        notice: `${user.name} entrou na sala.`,
        created: serverTimestamp(),
      })
    }

    const setChatView = async (chat) => {
      setCreateChat(null); //Oculta a tela de criação de Chat
      MembersChat(chat);
      const chatRef = doc(dataBase, "chats", chat.id);
      let members = chat.members;
      console.log(members);
      if(!members) { //  se não tiver ninguem no array 'members', a pessoa é adicionada ao array
        members = [{
          name: user.name,
          photo: user.photoURL,
          id: user.id
        }];
        messageWelcome(chat);
        console.log(`${user.name} entrou na sala!`)
        await updateDoc(chatRef,{ //  Adiciona o array no documento do chat escolhido no firebase
          members: members
        })
      } else {
        findMember.current = members.find(el => el.id === user.id); // Verifica através do id se o usuario já é cadastrado no array 'Members' do chat escolhido no firebase
        console.log(findMember.current)

        if (!findMember.current) { // Caso não encontrar o usuário, o usuário será adicionado 
          members.push({
            name: user.name,
            photo: user.photoURL,
            id: user.id
          })
          messageWelcome(chat);
          // console.log(members);
          await updateDoc(chatRef,{
            members: members
          })
        }
      }

      if (collection) {
        const chatCollectionMessages = collection(dataBase, "chats", chat.id, "messages"); // Pega a coleção do chat escolhido
        // const chatCollectionMembers = collection(dataBase, "chats", chat.id, "members"); // Pega a coleção do chat escolhido

        const q = query(chatCollectionMessages, orderBy("created"), limit(500)); // Pega as Mensagens pela ordem descrescente do 'Created'
        // const qm = query(chatCollectionMembers, orderBy("name"), limit(500)); // Pega as Mensagens pela ordem descrescente do 'Created'
        
        const unsub = onSnapshot(await q, (messages) => { // Atualiza os dados em tempo real
          setMessages(messages.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // puxa os objetos 'Chats' para o state
          setChatCollectionMessages(chatCollectionMessages);
          setChat(chat);
        });
      
        // const unsubM = onSnapshot(await qm, (members) => { // Atualiza os dados em tempo real
        //   setMembers(members.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // puxa os objetos 'Chats' para o state
        //   setChatCollectionMembers(chatCollectionMembers);
        //   setChat(chat);
        //   console.log(members)
        // });
  
        return unsub;
        
      }
    }

    const chatPermission = async (chat) => {
      if (chat.type === 'Público') {
        setChatView(chat)
      } else {
        const findMember = chat.members.find(member => member.id === user.id); // Procura se existe algum membro com o mesmo ID que o usuário logado
        console.log(findMember);
        if (!findMember) { // Caso não encontre o membro, o bloco abaixo é chamado
          const { value: pass } = await Swal.fire({
                icon: 'warning',
                title: 'Chat Privado',
                input: "password",
                html: `O Chat <b>${chat.name}</b> é privado.<br />`
                + `Para acessar, insira a senha abaixo:`,
                inputPlaceholder: "Digite a senha do Chat",
                confirmButtonColor: "#111",
                confirmButtonText: 'Entrar',
                showCancelButton: true,
                cancelButtonColor: "#ccc",
                cancelButtonText: "Cancelar",
                inputAttributes: {
                   maxlength: 15
                 },
                inputValidator: (value) => {
                  if (value !== chat.pass) {
                    return "Senha incorreta!";
                  }
                },
              })
              if (pass) {
                Swal.fire({ 
                  title: 'Parabéns!',
                  html: `Seja bem vindo ao Chat <b>${chat.name}</b>`,
                  icon: 'success' 
                });
                setChatView(chat);
              }
        }
        else {
          setChatView(chat);
        }
      }
    }

    const removeChat = async (chat) => {
      setMessages(null);
      setMembers(null);

      await deleteDoc(doc(dataBase, "chats", chat))

      setTimeout(async () => {
        await deleteDoc(doc(dataBase, "chats", chat.id, "messages"))
      }, 2000); 

    };

    const removeCreateChat = () => {
      setCreateChat(null);
    }

    const infoChat = (chat) => {
      const dateChat = new Date(chat.created.seconds*1000);
      const dateChatFormated = dateChat.toString().substr(4);
      Swal.fire({
        icon: 'info',
        title: 'Informações do Chat',
        html: `Nome: <b>${chat.name}</b><br/>`
        + `Descrição: <b>${chat.description}</b><br/>`
        + `Tipo: <b>${chat.type}</b><br/>`
        + `Criado por: <b>${chat.createdBy}</b><br/>`
        + `Data: <b>${dateChatFormated}</b><br/>`,
        confirmButtonColor: "#111"
      })
    }

  return (
    <div className='content-chat'>
      <div className="container-chats">
        <div className='header-chats'>
          <h1>MITT CHAT</h1>
          <h2>Chats</h2>
        </div>
        <div className='rooms'>
          {chats && chats.map((chat, index) =>(
            <div key={index} className='room'>
            <div className='room-content' onClick={() => chatPermission(chat)}>
            <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <SmallAvatar sx={{ backgroundColor: '#202024' }} alt="Publico" src={chat.type === 'Público' ? Public : Private} />
            }
            >
              <div className='image-chat' style={{backgroundColor: chat.color}}>
                <span className='image-chat__text'>{chat.name.substr(0,1)}</span>
                <img src="" alt="" />
              </div>
            </Badge>
              <div className="title-chat">
                <h5>{chat.name}</h5>
                <p>{chat.description}</p>
              </div>
            </div>
          </div>
          ))}
        </div>
        <div className='footer-chats'>
          <button onClick={addChat}>Adicionar</button>
        </div>
      </div>
      {createChat == null ? null :  <CreateChat removeCreateChat={removeCreateChat} chatCollectionRef={chatCollectionRef} user={user}></CreateChat>}
      {messages == null || members == null ? null : 
      <><Messages user={user} chat={chat} messagesCollection={chatCollectionMessages} messages={messages}></Messages>
      <Members user={user} chat={chat} members={members} users={users}></Members></>
      }
    </div>
  )
}

export default memo(Chat);