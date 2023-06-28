// import { addDoc } from "firebase/firestore";
// import { useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { dataBase } from "../firebase/database";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import Auth from "../hooks/Auth";

import Private from '../images/icons/Private.svg'
import Public from '../images/icons/Public.svg'

const Members = ({ users, members, chat }) => {
  console.log(chat);

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 30,
    height: 30,
    border: `2px solid #202024`,
  }));

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }));

  const logoff = () => { // Chama a função 'logoff' que está dentro da função 'Auth'
    Auth.logoff();
  };

 useEffect(() => {
  console.log(users);
 },[members])


  return (
    <div className="container-members">
      <div className="container-members__header">
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <SmallAvatar sx={{ backgroundColor: '#202024' }} alt="Publico" src={chat.type === 'Público' ? Public : Private} />
        }
      >
        <div className="img" style={{backgroundColor: chat.color}}></div>
      </Badge>
        <h2>{chat.name}</h2>
        <h5>{chat.description}</h5>
      </div>
      <h2>Membros ({members.members.length})</h2>
      <div className="members">
        {users && users.map((user, index) => (
        <li key={index}>
          {members.members.find((member) => member.id === user.id && user.state === "online") ? 
          <div className="members-info online">
            <StyledBadge overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot">
                <Avatar alt={user.name} src={user.photo} />
              </StyledBadge><p>{user.name}</p>
            </div> 
           :
            <div className="members-info offline">
              <Avatar alt={user.name} src={user.photo} /><p>{user.name}</p>
            </div>   
        }
        </li>
        ))}
      </div>
      <div className="container-members__footer">

      </div>
      <button onClick={logoff}>Deslogar</button>
    </div>
  );
};

export default Members;
