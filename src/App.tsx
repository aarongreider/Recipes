import { useEffect, useState } from 'react'
import './App.css'
import Carousel from './carousel'

type Ingredient = {
  ingredient: string,
  quantity: string,
  unit: string
}

export let buttonStyle = {
  verticalAlign: 'top',
  font: '900 16px / 1.20 Alegreya Sans, Arial, Helvetica, sans-serif',
  color: '#30553a',
  borderRadius: '10px',
  border: 'none',
  boxShadow: ' 4px 4px 2px 0 rgba(77, 77, 77, .22)',
  textDecoration: 'none',
  background: 'linear-gradient(to bottom, #f3de54 0%, #e2b733 100%)',
  padding: '10px 15px',
}

function App() {
  const [entryID, setEntryID] = useState<number>()
  const [title, setTitle] = useState<string>('')
  const [reason, setReason] = useState<string>('')
  //const [description, setDescription] = useState<string>('')
  const [servings, setServings] = useState<number>(0)
  const [servingsInput, setServingsInput] = useState<number>(0)
  const [prepTime, setPrepTime] = useState<number>(0)
  const [cookTime, setCookTime] = useState<string>('')
  const [ingredients, setIngredients] = useState<Ingredient[]>()
  const [directions, setDirections] = useState<string[]>()
  const [photos, setPhotos] = useState<string[]>()
  const [multiplier, setMultiplier] = useState<number>(1)

  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  useEffect(() => {
    let scriptTag = document.getElementById("injector");
    let id = scriptTag?.getAttribute("entryid");
    setEntryID(id ? parseInt(id) : 20412) // 20412 19517
    console.log('version 0.5')
  })

  useEffect(() => {
    console.log(entryID)
    if (entryID) {
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
            setDirections(JSON.parse(response["Directions"]))
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

            setDataLoaded(true)
          })

          .catch(error => {
            // Handle errors here
            console.error('Fetch error:', error);
          });
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
  }, [entryID])

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

  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
  }, [])

  return (
    dataLoaded ?
      <>
        <div style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row', background: 'none', border: 'none', gap: '90px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', background: 'none', border: 'none', gap: '30px' }}>
            <div>
              <h1 style={{ textAlign: 'left' }}>{title}</h1>
              <h3 style={{ textAlign: 'left', fontSize: '18px' }}>{reason}</h3>
              <div style={{
                width: 'max-content', margin:'16px 0', display: 'flex', alignItems: "center", gap: "24px", fontWeight: 'bold', border: '1px solid rgb(63, 63, 63)', borderRadius: '12px', padding: '12px',
                background: 'linear-gradient(to bottom, #f3de54 0%, #e2b733 100%)', font: '900 16px / 1.20 Alegreya Sans, Arial, Helvetica, sans-serif',
                color: '#30553a', boxShadow: ' 4px 4px 2px 0 rgba(77, 77, 77, .22)',
              }}>
                <p style={{ margin: '0' }}>Prep Time: {prepTime} min.</p>
                <p style={{ margin: '0' }}>Cook Time: {cookTime} min.</p>
              </div>

            </div>
            {photos && viewportWidth < 1250 ? <Carousel images={photos}></Carousel> : ''}
            <div>
              <div style={{ display: 'flex', alignItems: "center", gap: "10px" }}>
                <h4 style={{ margin: '0' }}>Serves</h4>
                <input value={`${servingsInput}`} onChange={handleServingsChange}></input>
                {/* <h4 style={{ margin: '0' }}>multiplier: {multiplier.toFixed(2)}</h4> */}
              </div>
              <h5 style={{ fontWeight: 'normal', textAlign: 'left', fontSize: '14px', margin: '0' }}>
                Tip: Input your the number of servings you'd like to cook for, and watch the recipe automatically change!
              </h5>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2>Directions</h2>
              {directions ? directions.map((direction, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15px' }}>
                  <h2 style={{ fontWeight: ' 900', color: '#30553a', fontSize: '30px', margin: '0', /* width: '30px', textAlign:'right' */ }}>{index}</h2>
                  <p style={{ margin: '0' }}>{direction}</p>
                </div>
              )) : ''}
            </div>
          </div>
          {photos && viewportWidth > 1250 ? <Carousel images={photos}></Carousel> : ''}
        </div>
      </> : <>
        <div style={{ width: '100%', alignItems: 'center' }}>
          <img src='https://junglejims.com/wp-content/uploads/monkey.gif'></img>
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