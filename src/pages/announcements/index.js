import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonSlides,
  IonSlide,
  IonContent,
  IonButton,
  IonLoading,
  IonNote,
  IonToast,
  IonImg
} from "@ionic/react";

import { firebase_app } from "../../config";
import { loadData, setData } from "../../api";
import { makeStyles } from '@material-ui/core/styles';

import "../../App.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "../../theme/variables.css";

import { data } from "../../dummy";
import { Redirect, useParams } from "react-router";

// interface ISlideContentProps {
//   title: string;
//   onClick: () => void;
//   description: string;
//   buttonTitle: string;
//   imgSrc: string;
// }

// const SlideContent: React.FC = ({
//   onClick,
//   title,
//   description,
//   buttonTitle,
//   imgSrc,
// }) => {
//   return (
//     <>
//       <img src={imgSrc} />
//       <div className="slide-block">
//         <IonText color="dark">
//           <h2>{title}</h2>
//         </IonText>
//         <IonText>
//           <sub>{description}</sub>
//         </IonText>
//       </div>
//       <div className="slide-button">
//         <IonButton expand="full" onClick={onClick}>
//           {buttonTitle}
//         </IonButton>
//       </div>
//     </>
//   );
// };
const useStyles = makeStyles({
  clickable: {
    cursor: 'pointer',
    filter: 'brightness(50%)'
  },
  container: {
    position: 'relative',
    width: '100%'
  },
  img: {
    width: '100%',
    height: 'auto',
  },
  text: {
    fontSize: '6vh', 
    fontWeight: 'bold',
    position: 'absolute',
    top: '50%',
    left: '35%',
    color: 'white'
  }
});
const Announcements = (props) => {
  const classes = useStyles();
  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  let { category } = useParams();
  let myData = data[0];
  data.forEach(item => {
    if (item.category === category)
      myData = item;
  })
  const slideOpts = {
    initialSlide: 0,
    speed: 1100,
  };
  const slider = useRef(null);
  const [score, setScore] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [redirect, setRedirect] = useState(false);

  async function getMe() {
    try {
      const data = await aituBridge.getMe();
      setName(data.name);
    } catch (e) {
      // handle error
      console.log(e);
    }
  }
  useEffect(() => {
    if (aituBridge.isSupported()) {
      getMe();
    }
  }, []);

  const [name, setName] = useState("<username>");
  const [showLoading, setShowLoading] = useState(false);

  const handleButtonClick = async (index, type) => {
    if (showToast) return
    await slider.current?.lockSwipes(false)
    const top = myData.questions[index].value;
    const bot = myData.questions[index + 1].value
    let add = 0;
    if (type === 'top' && top > bot)
      add = 1;
    if (type === 'bot' && top < bot)
      add = 1;
    const end = await slider.current.isEnd();
    setScore(score + add);
    setShowToast(true);
    if (!add || end) {
      setShowLoading(true);
      await handleFinish(score + add)
      return;
    }
    await slider.current?.slideNext();
    await slider.current?.lockSwipes(true)
  };
  const handleFinish = async (fscore) => {
    await getMe();
    if (name !== '<username>') {
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
        ]
      }
      if (doc.exists) {
        const fData = doc.data()
        for (let i = 0; i < 3; i++) {
          let curScore = tempScore[fData['categories'][i]['category']];
          fData['categories'][i]['score'] = Math.max(curScore, fData['categories'][i]['score']);
        }
        await setData(name, fData);
      } else {
        await setData(name, data);
      }
      setRedirect(true);
    }
  }
  const handleSlidesLoad = () => {
    if (slider.current != null)
      slider.current.lockSwipes(true)
  }
  if (redirect)
    return <Redirect to="/ranking" />
  return (
    <IonContent>
      <IonLoading
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Please wait...'}
        duration={1100}
      />
      <IonSlides onIonSlidesDidLoad={() => handleSlidesLoad()} options={slideOpts} ref={slider}>
        {myData.questions.slice(1).map((src, i) => <IonSlide key={`${i}`}>
          <IonContent>
          <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={"Your score is " + score}
              duration={1000}
              position="middle"
            />
            <div className={classes.container}>
              <IonImg className={`${classes.clickable} + ${classes.img}`} src={myData.questions[i].src} onClick={() => handleButtonClick(i, 'top')} />
              <IonNote className={classes.text} color="danger">{myData.questions[i].title}</IonNote><br />
            </div>
            <IonNote style={{fontSize: '4vh', fontWeight: 'bold'}} color="primary">Какое из этих значении больше?</IonNote><br />
            <div className={classes.container}>
            <IonImg className={`${classes.clickable} + ${classes.img}`} src={myData.questions[i + 1].src} onClick={() => handleButtonClick(i, 'bot')} />
            <IonNote className={classes.text} color="warning">{src.title}</IonNote><br />

            </div>
          </IonContent>
        </IonSlide>
        )}
      </IonSlides>
    </IonContent>
  );
};

export default Announcements;
