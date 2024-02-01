import { useEffect, useState } from 'react'
import './App.css'

type Ingredient = {
  ingredient: string,
  quantity: string,
  unit: string
}

function App() {
  const [entryID, setEntryID] = useState<number>(19517)
  const [title, setTitle] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  //const [description, setDescription] = useState<string>('')
  const [servings, setServings] = useState<number>(0)
  const [servingsInput, setServingsInput] = useState<number>(0)
  const [prepTime, setPrepTime] = useState<number>(0)
  const [cookTime, setCookTime] = useState<string>('')
  const [ingredients, setIngredients] = useState<Ingredient[]>()
  const [directions, setDirections] = useState<string>('')
  const [photos, setPhotos] = useState<string[]>()
  const [multiplier, setMultiplier] = useState<number>(1)

  useEffect(() => {
    setEntryID(19517)
  })

  useEffect(() => {
    
    try {
      fetch('https://script.google.com/macros/s/AKfycbzEOc3b1une7RNqBHA1VXFuRKiWt3SUnmJ6-UsusElFm50PbSIGlsTkNxt06QJaGI6L/exec')
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then(response => {
          // Process the JSON data here
          console.log(response)
          response = response.data[`${entryID}`]
          //setResponse(response)
          setTitle(response["Dish Title"])

          setReason(response["What makes your recipe special to you?"])
          setPrepTime(response["Prep time"])
          setCookTime(response["Cook Time"])
          setPhotos((response["Photos"]).split(','))

          //setDescription(response["Description"])
          setDirections(response["Directions"])
          setServings(parseInt(response["Servings"]))
          setServingsInput(parseInt(response["Servings"]))
          setPrepTime(response["Prep time"])
          const parsedIngredients: Ingredient[] = JSON.parse(response["Ingredients"]).map((rawIngredient: any) => {
            return {
              ingredient: rawIngredient.Ingredient,
              quantity: rawIngredient.Quantity,
              unit: rawIngredient.Unit
            }
          });
          setIngredients(parsedIngredients)
        })

        .catch(error => {
          // Handle errors here
          console.error('Fetch error:', error);
        });
    } catch (error) {
      console.error('Fetch error:', error);
    }
  }, [])

  useEffect(() => {
    console.log(ingredients as Ingredient[], ingredients ? typeof ingredients[0] : '')
  }, [ingredients])

  const handleServingsChange = (event: any) => {
    setServingsInput(event.target.value)
    let newMult = parseFloat(event.target.value) as number / servings;
    if (!newMult) {
      newMult = 0
    }
    setMultiplier(newMult)
  }

  return (
    <>
      <div className="card" style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', background: 'none' }}>
        <h1>{title}</h1>
        <h3 style={{ textAlign: 'left', fontSize: '18px' }}>{reason}</h3>
        <div style={{ display: 'flex', alignItems: "center", gap: "10px" }}>
          <h4>Serves</h4>
          <input value={`${servingsInput}`} onChange={handleServingsChange}></input>
          <h4>multiplier: {multiplier.toFixed(2)}</h4>
        </div>
        <h5 style={{ fontWeight: 'normal', textAlign: 'left', fontSize: '14px' }}>
          Tip: Input your the number of servings you'd like to cook for, and watch the recipe automatically change!
        </h5>
        <div style={{ display: 'flex', alignItems: "center", gap: "24px", fontWeight: 'bold', border: '1px solid rgb(63, 63, 63)', borderRadius: '12px', padding: '12px' }}>
          <p style={{ margin: '0' }}>Prep Time: {prepTime} min.</p>
          <p style={{ margin: '0' }}>Cook Time: {cookTime} min.</p>
        </div>
        <h2>Ingredients</h2>
        {ingredients ? ingredients.map((ingredient, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <p>
              {ingredient["quantity"] ? parseFloat(((validateNumber(`${ingredient["quantity"]}`) * multiplier).toFixed(2)).toString()) : '0'}
              &nbsp;
              {ingredient["unit"] ? ingredient["unit"] : ''}
            </p>
            <p style={{ fontWeight: 'bold' }}>{ingredient['ingredient']}</p>
          </div>
        )) : ''}
        <h2>Directions</h2>
        <p>{directions}</p>
        {/* {photos ? photos.map((src, index) => {
          <img key={index} src={src} alt="" />
        }) : ''} */}
        {photos ? <img src={photos[0]} alt="" style={{width: '100%', objectFit: 'contain'}}/> : ''}
      </div>
    </>
  )
}

export default App

function validateNumber(str: string): number {
  // cycle through all character of string
  // if unicode fraction, convert and append
  let dec: number;
  let num: number = parseFloat(str);
  if (!num) num = 0;

  for (const char of str) {
    //console.log(char);
    const normalized = char.normalize("NFKD");
    const operands: any = normalized.split("⁄");
    if (operands[0] / operands[1]) {
      console.log(char, operands[0] + "/" + operands[1], operands[0] / operands[1]);
      dec = operands[0] / operands[1];
      return num + dec;
    }
  }
  return num;
}