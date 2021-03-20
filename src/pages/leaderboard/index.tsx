import aituBridge from "@btsd/aitu-bridge";
import BoardRow from "./BoardRow";
import categoryChanger from "./categoryChanger";
import iconWrapper from "./iconWrapper";

function compareRows(a:{name: string, score: number}, b:{name: string, score: number}){
  if (a.score === b.score)
    return a.name.localeCompare(b.name);
  return a.score - b.score;
}

const Leaderboard = () => {
  let rows: {name: string, score: number}[] = [{name: "Alice Houston", score: 280}, {name: "James Adams", score: 250},{name: "Bob Marley", score: 382}, {name: "Daniel Clifford", score: 20},{name: "Virginia Lu", score: 140}, {name: "Dulat Aldazharov", score: 702}]; // This list should be fetched from the db
  rows.sort(compareRows);
  rows.reverse();
  let rowElements:any = [];
  for (let i = 0; i<rows.length; i++){
    rowElements.push(BoardRow(rows[i].name, i+1, rows[i].score));
  }
  const iconWr = iconWrapper();
  const selector = categoryChanger();
  return (
    <div className = "board">
      {iconWr}
      {selector}
      {rowElements}</div>
    )
}

export default Leaderboard;
