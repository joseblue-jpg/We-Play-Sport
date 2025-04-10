/* eslint-disable no-useless-catch */
 

import axios from 'axios';

const apiURL = import.meta.env.VITE_SERVER_URL;

export const fetchData = async(url, method, data=null, headers={}) =>{

    try {
        const config = {
            method,
            url: apiURL+url,
            headers,
            data
        }
        let response = await axios(config)
        
        return response
    } catch (error) {
        console.log(error)
        throw error;
    }
}