import React, { createContext, useState, useEffect } from 'react';
import { fetchData } from '../helpers/axiosHelper';

// Crear el contexto
export const KingOfTheCourtContext = createContext();

// Proveedor del contexto
export const ContextProvider = ({children}) => {
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLogued, setIsLogued] = useState(false)

    
    const logOut = () =>{
        setToken();
        setUser();
        localStorage.removeItem("token")
    }
    
    //preguntar si hay token en localStorage (para saber si este usuario tenia sesión abierta)
    useEffect(()=>{
        const tokenLocal = localStorage.getItem("token")
        setIsLoading(true)
        const fetchUser = async() =>{

            try {
                if (tokenLocal) {
                    const result = await fetchData('/users/userById', "get", null, {Authorization: `Bearer ${tokenLocal}`});
                    
                    setUser(result.data);
                    setToken(tokenLocal);
                    setIsLogued(true)
                }
            } catch (error) {
                console.log(error);
                setIsLogued(false)
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    },[])

   

  return (
    <KingOfTheCourtContext.Provider value={{
        user,
        setUser,
        token,
        setToken,
        logOut,
        isLogued,
        setIsLogued
    }}>
        {!isLoading && children}
    </KingOfTheCourtContext.Provider>
  )
}
