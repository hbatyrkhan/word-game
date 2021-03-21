import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import data from '../../dummy';
import { Redirect, useParams } from "react-router";

const Announcements = (props) => {
  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  let { category } = useParams();
  let myData = [];
  for (let i=0; i<data.length; i++){
    if (data[i].category === category)
      myData = data[i].questions;
  }

  const [index, setIndex] = useState(1);
  const [topImg, setTopImg] = useState(myData[0].src);
  const [botImg, setBotImg] = useState(myData[1].src);
  const [topTitle, setTopTitle] = useState(myData[0].title);
  const [botTitle, setBotTitle] = useState(myData[1].title);
  const [score, setScore] = useState(0);
  const [topTop, setTopTop] = useState(0);
  const [botTop, setBotTop] = useState(50);
  const [topAns, setTopAns] = useState(myData[0].value);
  const [botAns, setBotAns] = useState(myData[1].value);
  const [topOp, setTopOp] = useState("0%");
  const [botOp, setBotOp] = useState("0%");
  const [cnt, setCnt] = useState(0);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleLoss = ()=>{

  } // COMPLETE THIS FUNCTION

  const handleClick = async (choice) => {
    if (cnt === 0){
      let topObj, botObj;
      if (myData[index].src === topImg){
        topObj = myData[index];
        botObj = myData[index-1];
      }
      else{
        topObj = myData[index-1];
        botObj = myData[index];
      }
      setCnt(cnt => cnt+1);
      setBotOp("100%");
      setTopOp("100%");
      if ((choice === "top" && topObj.value > botObj.value) || (choice === "bot" && botObj.value > topObj.value))
        setScore(score => score+1);
      else{
        handleLoss();
      }
      return;
    }
    setCnt(cnt => cnt-1);
    setBotOp("0%");
    setTopOp("0%");
    await sleep(2000);
    let topObj, botObj, changeTop;
    if (myData[index].src === topImg){
      topObj = myData[index];
      botObj = myData[index-1];
      changeTop = false;
    }
    else{
      topObj = myData[index-1];
      botObj = myData[index];
      changeTop = true;
    }
    if ((choice === "top" && topObj.value > botObj.value) || (choice === "bot" && botObj.value > topObj.value)){
      setIndex(index => index+1);
      if (topTop === 0){
        setTopTop(50);
        setBotTop(0);
      }
      else{
        setTopTop(0);
        setBotTop(50);
      }
      if (!changeTop){
        setBotTitle(myData[index+1].title);
        setBotImg(myData[index+1].src);
        setBotAns(myData[index+1].value);
        setTopOp("100%");
      }
      else{
        setTopTitle(myData[index+1].title);
        setTopImg(myData[index+1].src);
        setTopAns(myData[index+1].value);
        setBotOp("100%");
      }
    }
    else{
      handleLoss();
    }
  }

  useEffect(()=>{
    setIndex(1);
    setScore(0);
    setTopImg(myData[0].src);
    setBotImg(myData[1].src);
    setTopTitle(myData[0].title);
    setBotTitle(myData[1].title);
  }, []);

  return (
    <div className = "announcements">
      <img style={{top: topTop+"%"}} onClick = {() => {handleClick("top")}} className = "gameImg-top" src={topImg}/>
      <div style={{top: (topTop+22)+"%"}} className = "topTitle" onClick = {() => {handleClick("top")}}>{topTitle}</div>
      <div style={{top: (topTop+35)+"%", opacity: topOp}} onClick = {() => {handleClick("top")}} className = "topAns">{topAns.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
      <div className = "betweener">Что больше? Score: {score}</div>
      <img style={{top: (botTop)+"%"}} onClick = {() => {handleClick("bot")}} className = "gameImg-bot" src={botImg}/>
      <div style={{top: (botTop+22)+"%"}} onClick = {() => {handleClick("bot")}} className = "botTitle">{botTitle}</div>
      <div style={{top: (botTop+35)+"%", opacity: botOp}} onClick = {() => {handleClick("bot")}} className = "botAns">{botAns.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
    </div>
  )

}

export default Announcements;
