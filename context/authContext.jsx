import { createUserWithEmailAndPassword,onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);


   useEffect(() => {
       const unSub = onAuthStateChanged(auth, (user)=>{
        // console.log('got user', user);
        if(user){
          setIsAuthenticated(true);
          setUser(user);
          updateUserData(user.uid)
        }else{
          setIsAuthenticated(false);
          setUser(null);
        }
       });
       return unSub;
   }, [])

   const updateUserData = async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
        let data = docSnap.data();
        setUser({...user, username: data.username, profileUrl: data.profileUrl, userId: data.userId});
   }
}

   const login = async (email, password) => {   
     try{
         const response = await signInWithEmailAndPassword(auth, email, password);
         return {success: true};
     }catch(e){
        let msg = e.message;
        if(msg.includes('(auth/invalid-email)')) msg="Invalid email"
        if(msg.includes('(auth/invalid-credential)')) msg="Invalid credential"
       return {success: false, msg};
     }
   };

   const logOut = async () => {   
    try{
      await signOut(auth);
      console.log('log out succesfully')
      return {success: true};
    }catch(e){
       console.log('logout failed')
       return {success: false, msg: e.message, error: e};
       };
    }

  const register = async (email, password, username, profileUrl) => {   
    try{
       const response = await createUserWithEmailAndPassword(auth, email, password);
       console.log('response.user :', response?.user);

    //    setUser(response?.user);
    //    setIsAuthenticated(true);  

    await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        password,
        profileUrl,
        userId: response?.user?.uid
    });
    return {success: true, data: response?.user};
    }catch(e){
        let msg = e.message;
        if(msg.includes('(auth/invalid-email)')) msg="Invalid email"
        if(msg.includes('(auth/email-already-in-use)')) msg="This email already in use"
       return {success: false, msg};
        }
  };

  return (
    <AuthContext.Provider value={{user, isAuthenticated, login, logOut, register}}>
        {children}
    </AuthContext.Provider>
  )

}

export const useAuth = () => {
  const value = useContext(AuthContext);

  if(!value) {
    throw new Error("useAuth must be wrapped within an AuthContextProvider");
  }
  return value;
};
