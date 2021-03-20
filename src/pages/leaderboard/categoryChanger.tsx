import categoryButton from "./categoryButton";

const categoryChanger = ()=>{
    const gen = categoryButton("Общий");
    const sci = categoryButton("Наука");
    const pop = categoryButton("Поп-культура");
    return (
        <select className = "category-changer">
            {gen} {sci} {pop}
        </select>
    )
}

export default categoryChanger;