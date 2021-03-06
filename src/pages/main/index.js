import { useEffect, useRef, useState } from "react";
import aituBridge from "@btsd/aitu-bridge";
import {
	IonSelectOption,
	IonLabel,
	IonContent,
	IonList,
	IonItem,
	IonListHeader,
	IonSelect,
	IonImg,
	IonButton,
	IonModal,
	IonAlert
} from "@ionic/react";

import { firebase_app } from "../../config";

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
import { Link } from "react-router-dom";

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
const MainPage = (props) => {
	const [category, setCategory] = useState('general');

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
	const [showModal, setShowModal] = useState(false);

	return (
		<IonContent>
			<IonList>
				<IonListHeader>
					<IonLabel>
						?????? ????????????, ?????? ?????????????
            </IonLabel>
				</IonListHeader>

				<IonItem>
					<IonLabel>??????????????????</IonLabel>
					<IonSelect value={category} placeholder="???????????????? ??????????????????" onIonChange={e => setCategory(e.detail.value)}>
						<IonSelectOption value="general">??????????</IonSelectOption>
						<IonSelectOption value="science">??????????</IonSelectOption>
						<IonSelectOption value="popculture">??????????????????????</IonSelectOption>
					</IonSelect>
				</IonItem>
			</IonList>
			<Link to={"/game/" + category}>
				<IonButton color="warning">
					????????????
			</IonButton>
			</Link>
			<Link to={"/ranking"}>
				<IonButton color="success">
					??????????????????
			</IonButton>
			</Link>
		</IonContent>
	);
};

export default MainPage;
