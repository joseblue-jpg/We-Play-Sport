import React, { useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'

export const LayoutInscription = () => {


    const {event_id} = useParams();
    const [team, setTeam] = useState({
        members: [],
        team_name: "",
        team_owner: null,
        event_id: event_id,
        team_id: null
    });
    
  return (
    <Outlet context={{team, setTeam}} />
  )
}
