import rankIndex from "./rankIndex";
import rankName from "./rankName";
import rankScore from "./rankScore";

function BoardRow(name: string, index: number, score: number) {
    const rankIdx = rankIndex(index);
    const rankNme = rankName(name);
    const rankSc = rankScore(score);
    return (<div className = "boardRow">{rankIdx} {rankNme} {rankSc}</div>);
}

export default BoardRow;