import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import data from '../../dummy';
import { Redirect, useParams } from "react-router";
import { IonAlert, IonLoading } from "@ionic/react";
import { loadData, setData } from "../../api.js";

const Announcements = (props) => {
  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  let { category } = useParams();
  let myData = [];
  for (let i = 0; i < data.length; i++) {
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
  const [lives, setLives] = useState(-1);
  const [name, setName] = useState('<username>');
  const [redirect, setRedirect] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getMe() {
    try {
      console.log('Loading')
      const data = await aituBridge.getMe();
      const doc = await loadData(data.name)
      let life;
      if (doc.exists)
        life = doc.data().lives;
      else life = 3;
      console.log(life);
      setLives();
      setName(data.name);
    } catch (e) {
      // handle error
      console.log(e);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleLoss = async (fscore = -1, alerted = false) => {
    fscore = Math.max(fscore, score);
    if (!alerted && lives > 0 && index + 1 < myData.length) {
      setShowAlert(true);
    } else if (name !== '<username>') {
      const doc = await loadData(name);
      const tempScore = {
        'general': (category === 'general' ? fscore : 0),
        'science': (category === 'science' ? fscore : 0),
        'popculture': (category === 'popculture' ? fscore : 0)
      }
      const data = {
        'username': name,
        'categories': [
          {
            'category': 'general',
            'score': tempScore['general']
          },
          {
            'category': 'science',
            'score': tempScore['science']
          },
          {
            'category': 'popculture',
            'score': tempScore['popculture']
          }
        ],
        'lives': lives
      }
      if (doc.exists) {
        const fData = doc.data()
        for (let i = 0; i < 3; i++) {
          let curScore = tempScore[fData['categories'][i]['category']];
          fData['categories'][i]['score'] = Math.max(curScore, fData['categories'][i]['score']);
        }
        fData['lives'] = data['lives'];
        await setData(name, fData);
      } else {
        await setData(name, data);
      }
      setRedirect(true);
    }
  }

  const handleClick = async (choice) => {
    setLoading(true);
    let fscore = score;
    if (cnt === 0) {
      let topObj, botObj;
      if (myData[index].src === topImg) {
        topObj = myData[index];
        botObj = myData[index - 1];
      }
      else {
        topObj = myData[index - 1];
        botObj = myData[index];
      }
      // setCnt(cnt => cnt + 1);
      setBotOp("100%");
      setTopOp("100%");
      if ((choice === "top" && topObj.value > botObj.value) || (choice === "bot" && botObj.value > topObj.value)) {
        setScore(score + 1);
        fscore++;
      }
      else {
        setLoading(false);
        await handleLoss();
        return;
      }
      // return;
    }
    // setCnt(cnt => cnt - 1);
    setBotOp("0%");
    setTopOp("0%");
    await sleep(800);
    let topObj, botObj, changeTop;
    if (myData[index].src === topImg) {
      topObj = myData[index];
      botObj = myData[index - 1];
      changeTop = false;
    }
    else {
      topObj = myData[index - 1];
      botObj = myData[index];
      changeTop = true;
    }
    if ((choice === "top" && topObj.value > botObj.value) || (choice === "bot" && botObj.value > topObj.value)) {
      if (index === myData.length) {
        setLoading(false);
        await handleLoss();
        return;
      }
      await animate(fscore);
    }
    else {
      await handleLoss();
    }
    setLoading(false);
  }
  const animate = async (fscore = -1) => {
    if (index + 1 == myData.length) {
      await handleLoss(fscore);
      return;
    }
    let changeTop;
    if (myData[index].src === topImg) {
      changeTop = false;
    }
    else {
      changeTop = true;
    }
    setIndex(index => index + 1);
    if (topTop === 0) {
      setTopTop(50);
      setBotTop(0);
    }
    else {
      setTopTop(0);
      setBotTop(50);
    }
    if (!changeTop) {
      setBotTitle(myData[index + 1].title);
      setBotImg(myData[index + 1].src);
      setBotAns(myData[index + 1].value);
      setTopOp("100%");
    }
    else {
      setTopTitle(myData[index + 1].title);
      setTopImg(myData[index + 1].src);
      setTopAns(myData[index + 1].value);
      setBotOp("100%");
    }
  }
  useEffect(() => {
    setIndex(1);
    setScore(0);
    setTopImg(myData[0].src);
    setBotImg(myData[1].src);
    setTopTitle(myData[0].title);
    setBotTitle(myData[1].title);
    getMe();
  }, []);

  if (redirect)
    return <Redirect to="/ranking" />

  return (
    <div className="announcements">
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Хотите использовать жизнь?'}
        message={`У вас <strong>${lives}</strong> жизней!!!`}
        buttons={[
          {
            text: 'Отмена',
            role: 'cancel',
            cssClass: 'secondary',
            handler: async (blah) => {
              await handleLoss(score, true);
            }
          },
          {
            text: 'Использовать',
            handler: async () => {
              let cLives = lives;
              cLives--;
              setLives(cLives);
              setBotOp("0%");
              setTopOp("0%");
              await animate();
            }
          }
        ]}
      />
      <IonLoading
        isOpen={lives === -1}
        onDidDismiss={() => { }}
        message={'Подождите...'}
      // duration={1000}
      />
      <img style={{ top: topTop + "%" }} onClick={() => { handleClick("top") }} className="gameImg-top" src={topImg} />
      <div style={{ top: (topTop + 22) + "%" }} className="topTitle" onClick={() => { handleClick("top") }}>{topTitle}</div>
      <div style={{ top: (topTop + 35) + "%", opacity: topOp }} onClick={() => { handleClick("top") }} className="topAns">{topAns.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
      <div className="betweener">Что больше? Score: {score}</div>
      <img style={{ top: (botTop) + "%" }} onClick={() => { handleClick("bot") }} className="gameImg-bot" src={botImg} />
      <div style={{ top: (botTop + 22) + "%" }} onClick={() => { handleClick("bot") }} className="botTitle">{botTitle}</div>
      <div style={{ top: (botTop + 35) + "%", opacity: botOp }} onClick={() => { handleClick("bot") }} className="botAns">{botAns.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
    </div>
  )

}

export default Announcements;
