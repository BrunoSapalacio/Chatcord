import { dataBase, db } from "../firebase/database";
import useSnapshot from "firebase-usesnapshot";
import { doc, onSnapshot} from "firebase/firestore";

const UseDb = {
    
         async membersChat (props) {
            return db.doc(dataBase, "chats", props.id).then(() => {
                let members = [];
                
            })
    //         try {
    //             const chatRef = doc(dataBase, "chats", props.id)
    //             await onSnapshot(chatRef, (chat) => { // Atualiza os dados em tempo real
    //             let members = [];
    //                 members.push(chat.data()) // puxa os objetos 'Chats' para o state
    //         //   members.push(chat.data()); // puxa os objetos 'Chats' para o state
    //             return members.members;
    //         });
    //     } catch (error) {
    //         console.error(error);
    //   }
}
}

export default UseDb;