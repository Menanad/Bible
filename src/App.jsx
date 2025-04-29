import { useEffect, useState } from "react"
import './App.css'
import { data } from "./comp/data"
import Loading from "./comp/header/loading"

// ------------------
//  الإصحاح (chapter)
// الآية (verse)
// النص (text)
// -----------------
function App() {
  const [main, setmain] = useState([])
  const [as7a7, setas7a7] = useState(1)
  const [as7a7Name, setas7a7Name] = useState('التكوين')
  const [chapter, setchapter] = useState(1)
  const [activeVerse, setactiveVerse] = useState('')
  const [activeChapter, setactiveChapter] = useState('')
  const [activebook, setactivebook] = useState('')
  const [numofChapter, setnumofChapter] = useState(50)
  const [zoom, setzoom] = useState(16)
  const [loading, setloading] = useState(true)



  const database = data
  console.log(database)
  console.log(as7a7)
  useEffect(() => {
    setloading(true)
    fetch('/svd.json')
      .then(response => response.json())
      .then(data => { setmain(data.verses); console.log(data.verses) })
      .catch(error => console.error('Error loading Bible data:', error))
      .finally(()=>setloading(false))
  }, [])

  const filter = as7a7 ?
    main.filter((item) => item.book == as7a7 && item.chapter == chapter)
    : main.slice(0, 200)
  function handleActive(e) {
    setactiveChapter(e.chapter)
    setactiveVerse(e.verse)
    setactivebook(e.book)

  }
  const showdata =
    database.map((item, index) => {
      return (
        <option key={index} name={item.name} value={item.value}>{item.name}</option>
      )
    })


  // {as7a7name : as7a7name ,verse : verse ,chapter :chapter,value:value}
  useEffect(() => {
    database.map((item, index) => {
      if (item.value == as7a7) {
        setas7a7Name(item.name)

        setnumofChapter(item.chapters)
      }

    })
  }, [as7a7])
  // handle next and prev
  function handlenext() {
    if (chapter < numofChapter) {
      setchapter((prev) => Number(prev) + 1)
    }
  }
  function handleprev() {
    if (chapter > 1) {
      setchapter((prev) =>  Number(prev)- 1)
    }
  }

  const shownumofchaptersarray = []

  function stars() {
    for (let i = 1; i <= numofChapter; i++) {
      shownumofchaptersarray.push(
        <option value={i}>{i}</option>
      )
    }
  }
  stars()

  return (
    <div style={{ margin: '5px' }}  id="top" className="mena">
      <div className="flex allheader">
        <select value={as7a7} onChange={(e) => { setas7a7(e.target.value); setas7a7Name(e.target.name), setchapter(1) }} className="p-2 border rounded-md text-right ">

          {showdata}
        </select>

        <select value={chapter} onChange={(e) => setchapter(e.target.value > 0 && e.target.value <= numofChapter ? e.target.value : 1)} className="p-2 border rounded-md text-right ">
          {shownumofchaptersarray}
        </select>
        {/* <div style={{ alignItems: 'center' }} className="flex">
          <button className="btn" onClick={() => { zoom < 40 && setzoom((prev) => prev + 1) }}>+</button>
          <span>{zoom} px</span>
          <button className="btn" onClick={() => { zoom > 16 && setzoom((prev) => prev - 1) }}>-</button>
        </div> */}
        <div style={{ justifyContent: 'center', alignItems: 'center' }} className="inline-flex">
          <button onClick={() => { zoom < 40 && setzoom((prev) => prev + 2) }} className=" btn px-4 rounded-l">
            +
          </button>
          <span className="count">{zoom} px</span>
          <button onClick={() => { zoom > 16 && setzoom((prev) => prev - 2) }} className=" btn px-4 rounded-r">
            -
          </button>
        </div>

      </div>
      <div className="flex header" >
        <div style={{ fontSize: zoom + 8 }} className="text-right"> {chapter} الإصحاح</div>
        <div style={{ fontSize: zoom + 8 }} className="text-right"> {as7a7Name}</div>

      </div>
      <div style={{ minHeight: '73vh' }} className="mb-6 text-right mainofverse">
        {filter.map((verse, index) => (

          <p style={{ fontSize: zoom }} dir="rtl" onClick={() => handleActive(verse)} className={` text-lg leading-loosebtn ${activeVerse === verse.verse &&
            activeChapter === verse.chapter && activebook == verse.book ?
            "active" : null}`} key={index}>
            <strong className="font-bold text-indigo-500">
              {verse.verse}
            </strong>{" "}
            - {verse.text}
          </p>
        ))}
      </div>

      <div className="flex" style={{ margin: ' 10px 0', justifyContent: 'center' }}>
        <div className="inline-flex">
          <a href="#top">
            <button onClick={handlenext} style={{cursor:'pointer'}} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
              Next
            </button>
          </a>
          <a href="#top">
            <button style={{cursor:'pointer'}} onClick={handleprev} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
              Prev
            </button>
          </a>
        </div>
      </div>
      {loading && <Loading/>}
    </div>
  )
}

export default App
