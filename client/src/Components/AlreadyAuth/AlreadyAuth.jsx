import React, { useContext } from 'react'
import { KingOfTheCourtContext } from '../../Context/ContextProvider';
import { Navigate } from 'react-router-dom';

export const AlreadyAuth = ({children}) => {
  
    const {token, isLogued} = useContext(KingOfTheCourtContext);    
  
    return token && isLogued == true ? (<Navigate to={'/'} />) : children
}
