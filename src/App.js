import './index.css';
import React, {useState} from 'react';


    
    // const url = 'https://opentdb.com/api.php?amount=10&category=27&type=multiple'
    function MainWrapper(props) {
        const [num, setNum] = useState(0) 
        const [difficulty, setDifficulty] = useState('easy')
        const [questions, setQuestions] = useState([])
        const [answers, setAnswers] = useState([])
        const [wronganswers, setWrongAnswers] = useState([])
        const [page, setPage] = useState(0)
        const [seloptions, setSeloptions] = useState('')
    
        const feedb = document.getElementById('feedback')
        
        function reset(){    
        setQuestions([])
        setAnswers([])
        setWrongAnswers([])
        setPage(0)
        setSeloptions('')
        }
        
        function generate(){
            setQuestions([])
            setWrongAnswers([])
            setAnswers([])
            async function data() {
            const data = await fetch(`https://opentdb.com/api.php?amount=${num}&difficulty=${difficulty}&type=multiple`)
            const json = await data.json()
            json.results.forEach( (item) => {
 
                  setQuestions((prev) => [...prev, item.question])                
                  setAnswers((prev) => [...prev, item.correct_answer])
                  setWrongAnswers((prev) => [...prev, item.incorrect_answers[0], item.incorrect_answers[1], item.incorrect_answers[2]]);
                
            })
            
            return json
            }
        
           (async () => {console.log(await data())})()
           
           
         }
       
         function prev() {
           setPage(prev => prev - 1)
           feedb.innerHTML = ''
         }
         
         function next() {
             setPage(prev => prev + 1)
             feedb.innerHTML = ''
         }
         
         function handleradio(e) {

             document.getElementById('submit').disabled = false;

         }
         function anscheck(e) {
             e.preventDefault()
             const options = document.querySelectorAll('input[name="answer"]')
             const selected = function () {
                 for(let option of options) {
                      if(option.checked){
                          return option.value
                          break
                      }
                 }
             }
             
             if (selected() === answers[page]){
                 feedb.innerHTML = "Your are correct!"
             } else {feedb.innerHTML = "Your are incorrect!"}
             
         }
    return(<div className="MainContainer" >
    <h1> Quiz</h1>
    <App num={num} setNum={setNum} difficulty={difficulty} setDifficulty={setDifficulty} generate={generate} answers={answers} wronganswers={wronganswers} prev={prev} next={next} page={page} questions={questions} handleradio={handleradio} anscheck={anscheck} reset={reset}/> 
    </div>)
    }
    
    function Question({question , i}) {
        return(<p className="question" key={i}>{question}</p>)
    }      
            
    function Radio({answers, wronganswers, handleradio, page, anscheck}) {
        
            
            var a = [{key: page, id:page, answer: answers[page], value: answers[page]}, {key: (page + 100), id:page + 100, answer: wronganswers[3*page], value: wronganswers[3*page]}, {key: (page + 101), id: page + 101, answer: wronganswers[3*page + 1], value: wronganswers[3*page + 1]}, {key: (page + 102), id:page + 102, answer: wronganswers[3*page + 2], value: wronganswers[3*page + 2]}]
            
            let b = a.map(item => ({sort: Math.random(), value: item})).sort((a, b) => {return(a.sort - b.sort)}).map(a => {
                return a.value})
            
        return (
            
            <form className='options' key={page} onSubmit={anscheck} onChange={handleradio}>
            
            <label htmlFor={b[0].id}><input className="radio" type='radio' name='answer' id={b[0].id} value={b[0].value} ></input>{b[0].answer}</label>
            
            <label htmlFor={b[1].id}><input className="radio" type='radio' name='answer' id={b[1].id} value={b[1].value} ></input>{b[1].answer}</label>
            
            <label htmlFor={b[2].id}><input className="radio" type='radio' name='answer' id={b[2].id} value={b[2].value} ></input>{b[2].answer}</label>
            
            <label htmlFor={b[3].id}><input className="radio" type='radio' name='answer' id={b[3].id} value={b[3].value} ></input>{b[3].answer}</label>
            <button id="submit" className="submit" disabled>Submit</button>
            </form>)
    }
    
    function App({num, difficulty, setNum, setDifficulty, generate, questions, answers, wronganswers, prev, next, page, handleradio, anscheck, reset}) {
        
        return(<div className="App">
        <label>Enter difficulty:  
        <select className="difficulty" name='difficulty' id='difficulty' defaultValue={difficulty} onChange={(e) => 
            {reset()
                setDifficulty(e.target.value)      
            }}>
        <option value='easy' >Easy</option>
        <option value='medium' >Medium</option>
        <option value='hard' >Hard</option>
        </select>
        </label>
        <label>Enter no. of questions:     
        <input className="num" placeholder="1" type="number" min='1' max = '50' name='no_of_ques' id='no_of_ques' defaultValue={num} onChange={(e) => 
            {reset()
                setNum(e.target.value)
            }}/>
        </label>
        
        <button className="generate" onClick={generate}>Generate</button>
        <div className='nav-button-container'>
        <button className="prev" onClick={prev} disabled={page == 0 || num == 0 ? true : false} >Previous</button>
        <button className="next" onClick={next} disabled={page == (answers.length -1) || num == 0 || answers.length === 0 ? true : false} >Next</button>
        </div>
        <Question question={questions[page]} i={page} />
        <Radio answers={answers} wronganswers={wronganswers} page={page} handleradio={handleradio} anscheck={anscheck} />
        <h2 id='feedback'></h2>
        </div>)
    }
export default MainWrapper;
