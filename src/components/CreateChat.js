import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { addDoc, serverTimestamp } from "firebase/firestore";

import Swal from "sweetalert2";
import './CreateChat.scss'

import Public from '../images/icons/Public.svg'
import Private from '../images/icons/Private.svg'

const CreateChat = ({ removeCreateChat, chatCollectionRef, user }) => {
  const [formChat, setFormChat] = useState();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (userData) => {
    try {
      Swal.fire({
        html: `Chat criado com sucesso!`,
        icon: "success",
        showConfirmButton: true,
        confirmButtonColor: "#D3394C",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await addDoc(chatCollectionRef, {
            ...userData,
            created: serverTimestamp(),
            createdBy: {
              name: user.name,
              id: user.id
            },
            type: formChat,
            members: [{
              name: user.name,
              photo: user.photoURL,
              id: user.id
            }]
          });
          removeCreateChat();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='modal-createChat'>
    <div className='container-createChat'>
      <div>
        <button className='btn-close' onClick={removeCreateChat} />
      </div>
      <h1 className='title'>Criar Chat</h1>
      {!formChat &&
      <><div className='form-chat'>
          <button className='btn-forms' onClick={() => setFormChat('Público')}>
            Publico
            <img src={Public} alt=""/>
          </button>
          <button className='btn-forms' onClick={() => setFormChat('Privado')}>
            Privado
            <img src={Private} alt=""/>
          </button>
        </div><button className='btn-return' onClick={removeCreateChat}>Fechar</button></>
      }
      {formChat === 'Privado' && 
      <><form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input-texts private"
          type="text"
          placeholder="Nome*"
          {...register("name", {
            required: true
          })}
          required
        />
        <input
          className="input-texts private"
          type="text"
          placeholder="Descrição*"
          {...register("description", {
            required: true
          })}
          required
        />
        <input 
        className='input-texts private'
        type="password"
        placeholder='Senha*'
        maxLength={15}
        {...register("pass", {
          required: true
        })}/>
        <label htmlFor='color'> Escolha uma cor para o Chat</label>
        <input 
        className='input-color'
        type="color"
        name='color'
        {...register("color", {required: true})}/>
        <input className='btn-create-private' type="submit" value="Criar"/>
      </form>
      <button className='btn-return' onClick={() => setFormChat(null)}>Voltar</button>
      </>
    }
      {formChat === 'Público' &&
      <><form onSubmit={handleSubmit(onSubmit)}>
      <input
        className="input-texts public"
        type="text"
        placeholder="Nome*"
        {...register("name", {
          required: true
        })}
        required
      />
      <input
        className="input-texts public"
        type="text"
        placeholder="Descrição*"
        {...register("description", {
          required: true
        })}
        required
      />
      <label htmlFor='color'> Escolha uma cor para o Chat</label>
      <input 
      className='input-color'
      type="color"
      name='color'
      {...register("color", {required: true})}/>
      <input className='btn-create-public' type="submit" value="Criar"/>
    </form>
    <button className='btn-return' onClick={() => setFormChat(null)}>Voltar</button>
    </>
    }
    </div>
  </div>
  )
}

export default CreateChat