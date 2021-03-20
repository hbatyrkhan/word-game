import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import BoardRow from "./BoardRow";
import iconWrapper from "./iconWrapper";
import {firebase_app} from "../../config"

function compareRows(a:{name: string, score: number}, b:{name: string, score: number}){
  if (a.score === b.score)
    return a.name.localeCompare(b.name);
  return a.score - b.score;
}

let general:any = [];
let science:any = [];
let pop:any = [];
let generalEls:any = [];
let scienceEls:any = [];
let popEls:any = [];

const loadFirebase = async () => {
  const db = firebase_app.firestore();
  return db.collection('users_aitu')
    .get()
    .then(querySnapshot => {
      general = [];
      generalEls = [];
      science = [];
      scienceEls = [];
      pop = [];
      popEls = [];
      const documents = querySnapshot.docs.map(doc => doc.data())
      for (let i = 0; i<documents.length; i++){
        const categories = documents[i].categories;
        const username = documents[i].username;
        for (let i = 0; i<categories.length; i++){
          const obj = categories[i];
          if (obj.category === "general")
            general.push({name: username, score: obj.score});
          else if (obj.category === "science")
            science.push({name: username, score: obj.score});
          else if (obj.category === "popculture")
            pop.push({name: username, score: obj.score});
        }
      }
      general.sort(compareRows); general.reverse(compareRows);
      science.sort(compareRows); science.reverse(compareRows);
      pop.sort(compareRows); pop.reverse(compareRows);
      for (let i=0; i<general.length; i++)
        generalEls.push(BoardRow(general[i].name, i+1, general[i].score));
      for (let i=0; i<science.length; i++)
        scienceEls.push(BoardRow(science[i].name, i+1, science[i].score));
      for (let i=0; i<pop.length; i++)
        popEls.push(BoardRow(pop[i].name, i+1, pop[i].score));
      console.log(generalEls)
      return generalEls;
    })
}

const Leaderboard = () => {

  const [rowElements, setRowElements] = useState([]);

  useEffect(() => {
    loadFirebase().then((res) => {setRowElements(res); console.log(res)});
  }, []);

  const resetEls = (sel:string) => {
    if (sel === "general")
      setRowElements(generalEls);
    else if (sel === "science")
      setRowElements(scienceEls);
    else
      setRowElements(popEls);
  }

  const iconWr = iconWrapper();
  return (
    <div className = "board">
      {iconWr}
      <select id = "changer" className = "category-changer" onChange = {(e) => {
        resetEls(e.target.value)}}>
        <option value="general" className = "category-button">Общий</option>
        <option value="science" className = "category-button">Наука</option>
        <option value="popculture" className = "category-button">Поп-культура</option>
      </select>
      <div className = "rowSet">
        {rowElements}
      </div>
      <Link to='../'>
        <button className="board-back-button">Back</button>
      </Link>
      </div>
    )
}

export default Leaderboard;
