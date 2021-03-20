import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonSlides,
  IonSlide,
  IonContent,
  IonButton,
  IonText,
  IonNote,
  IonToast,
  IonImg
} from "@ionic/react";

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

interface ISlideContentProps {
  title: string;
  onClick: () => void;
  description: string;
  buttonTitle: string;
  imgSrc: string;
}

const SlideContent: React.FC<ISlideContentProps> = ({
  onClick,
  title,
  description,
  buttonTitle,
  imgSrc,
}) => {
  return (
    <>
      <img src={imgSrc} />
      <div className="slide-block">
        <IonText color="dark">
          <h2>{title}</h2>
        </IonText>
        <IonText>
          <sub>{description}</sub>
        </IonText>
      </div>
      <div className="slide-button">
        <IonButton expand="full" onClick={onClick}>
          {buttonTitle}
        </IonButton>
      </div>
    </>
  );
};
interface ParamTypes {
  category: string
}
const Announcements: React.FC = () => {
  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  let { category } = useParams<ParamTypes>();
  let myData = data[0];
  data.forEach(item => {
    if (item.category === category)
      myData = item;
  })
  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  const slider = useRef<HTMLIonSlidesElement>(null);
  const [score, setScore] = useState<number>(0);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [redirect, setRedirect] = useState<boolean>(false);

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

  const handleButtonClick = async (index: number, type: string) => {
    await slider.current?.lockSwipes(false)
    await slider.current?.slideNext();
    const top = myData.questions[index].value;
    const bot = myData.questions[index + 1].value
    let add = 0;
    if (type === 'top' && top > bot)
      add = 1;
    if (type === 'bot' && top < bot)
      add = 1;
    if (!add)
      setRedirect(true);
    setScore(score + add);
    setShowToast(true);
    await slider.current?.lockSwipes(true)
  };
  const handleSlidesLoad = () => {
    if (slider.current != null)
      slider.current.lockSwipes(true)
  }
  if (redirect)
    return <Redirect to="/ranking" />
  return (
    <IonContent>
      <IonSlides onIonSlidesDidLoad={() => handleSlidesLoad()} options={slideOpts} ref={slider}>
        {myData.questions.slice(1).map((src: any, i: number) => <IonSlide key={`${i}`}>
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
