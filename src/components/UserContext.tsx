import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { User } from '../types/common';

interface UserContextProps {
    username: string;
    id: string;
    metadata: any; // Update with your actual metadata type
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserContextProps | null>(null);

    const loadUserMeta = async () => {
        const authUser = auth.currentUser;

        if(authUser){
            const { email: username, uid: id } = authUser;
            const userCollection = collection(db, 'user');
            const userSnap = await getDocs(userCollection);
            const userMeta = userSnap.docs.map(doc => doc.data() as User);

            const meta =  userMeta.find((u) => u.user_id === id)
            setUser({
                id,
                metadata: meta,
                username: username || ''
            });

        }   

    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            loadUserMeta()
        })
    }, [])

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);