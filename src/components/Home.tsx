import React from 'react';
import {  signOut } from "firebase/auth";
import {auth} from '../firebase';
 
const Home = () => {
    const handleLogout = () => {               
        signOut(auth).then(() => {
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }
   
    return(
        <>
            <nav>
                <p>
                    Welcome Home
                </p>
 
                <div>
        			<button onClick={handleLogout}>
                        Logout
                    </button>
        		</div>
            </nav>
        </>
    )
}
 
export default Home;