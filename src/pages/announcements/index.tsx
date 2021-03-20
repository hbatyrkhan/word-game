import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
  IonSlides,
  IonSlide,
  IonContent,
  IonButton,
  IonText,
  IonNote
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
const pics = [
  "/assets/slide1.png",
  "/assets/slide2.png",
  "/assets/slide3.png",
  "/assets/slide4.png"
]
const Announcements: React.FC = () => {
  // Optional parameters to pass to the swiper instance.
  // See http://idangero.us/swiper/api/ for valid options.
  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  const slider = useRef<HTMLIonSlidesElement>(null);
  const [score, setScore] = useState<number>(0);

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

  const handleButtonClick = async () => {
    await slider.current?.lockSwipes(false)
    await slider.current?.slideNext();
    setScore(score + 1);
    await slider.current?.lockSwipes(true)
  };
  const handleSlidesLoad = () => {
    if (slider.current != null)
      slider.current.lockSwipes(true)
  }
  return (
    <IonContent>
      <IonSlides onIonSlidesDidLoad={() => handleSlidesLoad()} options={slideOpts} ref={slider}>
        {pics.slice(1).map((src: string, i: number) => <IonSlide key={`${i}`}>
          <IonContent>
            <img src={i > 0 ? pics[i - 1] : pics[0]} onClick={handleButtonClick} />
            <IonNote color="primary">Score {score}</IonNote><br />
            <IonButton color="light" >What is more</IonButton>
            <img src={src} onClick={handleButtonClick} />
          </IonContent>
        </IonSlide>
        )}
      </IonSlides>
    </IonContent>
  );
};

export default Announcements;
