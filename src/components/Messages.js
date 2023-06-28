import React, { useEffect, useRef } from 'react'
import { addDoc, serverTimestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";

import '../pages/Chat/styles.scss'

const Messages = ({user, messagesCollection, messages, chat}) => {
  const { register, handleSubmit, reset } = useForm();
  const ref = useRef(null)
  

  console.log(messages);


  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight
  }, [messages])

  console.log(messagesCollection)

  
  const onSubmit = async (userData) => {
    const date = new Date();
    const text = userData.text;
    const dateFormated = {
      dd: date.getDate(),
      mm: date.getMonth() + 1,
      yy: date.getFullYear(),
      hh: date.getHours(),
      mi: date.getMinutes(),
      ss: date.getSeconds(),
    }
    await addDoc(messagesCollection, {
      user: {
        name: user.name,
        photo: user.photoURL,
      }, 
      text,
      created: serverTimestamp(),
      date: `${dateFormated.dd}/${dateFormated.mm}/${dateFormated.yy} ${dateFormated.hh}:${dateFormated.mi}`
    });
    
    reset({text: ''}); // Limpa a input
  }

  return (
    <div className="container-messages">
      <div className='view-messages' ref={ref}>
        {messages && messages.map((message, index) => {
          return message.notice === undefined ? // verifica se na coleção existe a string 'notice'
        <div key={index} className='content-message'>
          <img src={message.user.photo} alt="" />
            <div className='name'>
              <h5>{message.user.name}</h5>
              <span>{message.date}</span>
            </div>
            <span className='message'>{message.text}</span>
        </div>
        :
        <div key={index} className='notice'>
          <span>{message.notice}</span>
        </div>
        })}
      </div>
      <div className='container-message'>
      <form className='box-message' onSubmit={handleSubmit(onSubmit)}>
        <input type="text"
          placeholder='Mensagem'
          {...register('text', {
            required: true
          })}
        />
        <input type="submit" value="" />
      </form> 
      </div>
    </div>
  )
}

export default Messages