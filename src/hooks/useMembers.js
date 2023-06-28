import { useEffect, useState } from 'react'
import { dataBase } from "../firebase/database";
import { doc, onSnapshot} from "firebase/firestore";
import { useDocument } from 'react-firebase-hooks/firestore';

const useMembers = ({ chat }) => {
    const [members, setMembers] = useState([]);
    const [value, loading, error] = useDocument(doc(dataBase, "chats", chat.id));

    console.log(value);

    // useEffect(() => {
    //     async function getMembers () {
    //         const chatRef = doc(dataBase, "chats", chat.id);
    //         const membersDb = onSnapshot(await chatRef, (chat) => { // Atualiza os dados em tempo real
    //               setMembers(chat.data()); // puxa os objetos 'Chats' para o state
    //             });
    //         return membersDb;
    //     }
        
    //     getMembers();
    // },[chat])

  return value;
}

export default useMembers