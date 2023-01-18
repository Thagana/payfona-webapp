import * as React from 'react'
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from 'react-router-dom';

import './Success.scss';

export default function Success() {
    const navigate = useNavigate();
    React.useEffect(() =>{
        setTimeout(() => {
            navigate('/');
        }, 2000)
    },[])
  return (
    <div className="success-container">
      <Player
        src="https://assets2.lottiefiles.com/packages/lf20_lk80fpsm.json"
        className="player-success"
        autoplay
      />
    </div>
  )
}
