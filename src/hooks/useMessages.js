import { useEffect, useState } from 'react';
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { dataBase } from '../firebase/database';

async function useMessages ({chat}) {
  const [messages, setMessages] = useState([])
  const chatCollectionSelected = collection(dataBase, "chats", chat.id, "messages");
  const q = query(chatCollectionSelected, orderBy("created"), limit(500)); // Pega as Mensagens pela ordem descrescente do 'Created'
  const dataMessages = await getDocs(q);

  useEffect(() => {
    const newMessages = dataMessages.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

    setMessages(newMessages)
  }, [dataMessages.docs])

  return {
    messages
  }
}

export default useMessages