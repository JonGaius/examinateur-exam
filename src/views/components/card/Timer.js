import React, { useEffect, useRef, useState } from 'react';
import {CircularProgressbar, buildStyles} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"
import audio from "../../../assets/audio/sonnerie-reveil.mp3"

const music = new Audio(audio);

const Timer = ({fnc, socket, time = 30 * 8, examen}) => {
    const green = "#EF233C"
    const [secondLeft, setSecondLeft] = useState(0)
    const secondLeftRef = useRef(secondLeft)
    const settingsInfo = {
        workMinutes: 2
    }
    
    
    useEffect(() => {
        secondLeftRef.current = time
        setSecondLeft(secondLeftRef.current)
        const timer = setInterval(() => {
            if(secondLeftRef.current === 0){
            //    navigate("/examens/fin")
                music.play();
                music.loop =true;
                fnc(true)
                // console.log("finished")

                let data = {
                    room: examen,
                    statut: true,
                }
                socket.emit("finish_composition", data)
                localStorage.setItem('finish-exam', JSON.stringify(true))
            }
            if(secondLeftRef.current > 0){
                secondLeftRef.current = secondLeftRef.current - 1;
                setSecondLeft(secondLeftRef.current)
            }
        }, 1000)
        return () => clearInterval(timer)

    },[fnc,socket,time,examen])
    return (
        <CircularProgressbar value={secondLeft / (60 * settingsInfo.workMinutes) * 100} text={`${Math.floor(secondLeft / 60)} : ${(secondLeft % 60) < 10 ? "0"+secondLeft % 60 : secondLeft % 60}`} styles={buildStyles({
            pathColor: green,
            textColor: green,
            textSize: 19
        })} />
    );
};

export default Timer;