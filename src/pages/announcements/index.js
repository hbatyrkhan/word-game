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
  IonImg,
  IonAlert
} from "@ionic/react";

import { firebase_app } from "../../config";
import { loadData, setData } from "../../api";

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
import { get } from "http";

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
const Announcements = (props) => {
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
  const [showAlert, setShowAlert] = useState(false);
  const [lives, setLives] = useState(-1);

  async function getMe() {
    try {
      console.log('Loading')
      const data = await aituBridge.getMe();
      const doc = await loadData(data.name)
      setLives(doc.data().lives);
      setName(data.name);
    } catch (e) {
      // handle error
      console.log(e);
    }
  }
  useEffect(() => {
    getMe();
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
    if (end || (!add && lives < 1)) {
      setShowToast(true);
      await handleFinish(score + add)
      return;
    }
    if (!add) {
      saveLife();
      return;
    }
    setShowToast(true);
    await slider.current?.slideNext();
    await slider.current?.lockSwipes(true)
  };
  const saveLife = () => {
    setShowAlert(true);
  }
  const handleFinish = async (fscore) => {
    if (name !== '<username>') {
      const doc = await loadData(name);
      const tempScore = {
        'general': (category === 'general' ? fscore : 0),
        'science': (category === 'science' ? fscore : 0),
        'popculture': (category === 'popculture' ? fscore : 0)
      }
      console.log(lives);
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
  const handleSlidesLoad = () => {
    if (slider.current != null)
      slider.current.lockSwipes(true)
  }
  if (redirect)
    return <Redirect to="/ranking" />
  return (
    <IonContent>
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
              setShowToast(true);
              setShowLoading(true);
              await handleFinish(score);
            }
          },
          {
            text: 'Использовать',
            handler: async () => {
              let cLives = lives;
              cLives--;
              setLives(cLives);
              await slider.current?.slideNext();
              await slider.current?.lockSwipes(true)
            }
          }
        ]}
      />
      <IonLoading
        isOpen={showLoading || lives === -1}
        onDidDismiss={() => setShowLoading(false)}
        message={'Please wait...'}
        duration={1000}
      />
      <IonSlides onIonSlidesDidLoad={() => handleSlidesLoad()} options={slideOpts} ref={slider}>
        {myData.questions.slice(1).map((src, i) => <IonSlide key={`${i}`}>
          <IonContent>
            <IonImg src={myData.questions[i].src} onClick={() => handleButtonClick(i, 'top')} />
            <IonNote color="danger">{myData.questions[i].title}</IonNote><br />
            <IonNote color="primary">Какое из этих значении больше?</IonNote><br />
            <IonNote color="warning">{src.title}</IonNote><br />
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={"Your score is " + score}
              duration={1000}
              position="middle"
            />
            <IonImg src={myData.questions[i + 1].src} onClick={() => handleButtonClick(i, 'bot')} />
          </IonContent>
        </IonSlide>
        )}
      </IonSlides>
    </IonContent>
  );
};

export default Announcements;
