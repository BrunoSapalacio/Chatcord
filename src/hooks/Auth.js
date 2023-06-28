import { auth } from "../firebase/database";
import { doc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { dataBase } from "../firebase/database";

const Auth = {
  async login() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        await setDoc(doc(dataBase, "membros", user.uid), {
          name: user.displayName,
          id: user.uid,
          photo: user.photoURL,
          state: 'online'
        })
        console.log(token, user);
        // ...
      })
      .catch((error) => {
        console.error(error);
      });
  },

  // async users () {
  //   const user = auth.currentUser;

  //   if(user) {
  //   }
  // },

  async logoff() {
    signOut(auth)
      .then(() => {
        console.log("Deslogado");
      })
      .catch((error) => {
        console.error(error);
      });
  },

};

export default Auth;
