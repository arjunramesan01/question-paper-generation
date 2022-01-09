// @ts-nocheck
import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/index.module.css'
import {getAllAssesments, titleGenerator, getIntent, getEntity} from '../common';
import {useState} from "react";
import { useRouter } from 'next/router'
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController
);

const Home: NextPage = () => {

  var [status, setStatus] = useState('');
  var [topMatches, setTopMatches] = useState([]);
  var [loadingText, setLoadingText] = useState('Detecting intent...');
  var [micClicked, setMicClicked] = useState(false);
  var [graphData, setGraphData] = useState(null);
  var [textEntities, setTextEntities] = useState([])
  const router = useRouter();
  const commands = [
    {
      command: '*',
      callback: (text) => (speechDetect(text))
    },
  ]
  const {
    transcript,
    listening,
    resetTranscript,
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({commands});
  const startListening = () => SpeechRecognition.startListening({ continuous: false });


  function speechDetect(text){
    document.getElementById('searchInput').value = text;
    if(text){
      window.setTimeout(()=>{
        intentDetector(text);
      },1000)
    }
  }

  function intentDetector(text){
    setStatus('detecting');
    setLoadingText('Detecting intent...');
    setTopMatches([])
    setMicClicked(false);
    setGraphData(null);
    setTextEntities([]);

    var input = text;
    if(!text){
     input = document.getElementById('searchInput') as HTMLInputElement
     input = input.value;
    }

    if(!input){
      setStatus('');
      return
    }

    getIntent(input).then(r=>r.json()).then(res=>{
      console.log(res);
      var labels = [];
      var marksData = [];

      var count = 5;

      if(res['intents']){
        for(var i=0;i<res['intents'].length;i++){
          count--;
          if(count<0){
            break;
          }
          labels.push(res['intents'][i]['intent'])
          marksData.push(parseFloat(res['intents'][i]['score']).toFixed(2))
        }
      }


      var data = {
        labels: labels,
       
        datasets: [{
          label: 'Intent',
          data: marksData,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
        }]
      }

      setGraphData(data);
      getQuestionPaper(input.split(' '))

      getEntity(input).then(r=>r.json()).then(res=>{
        var tempIntentArry = []
        for(var i=res['entities'].length-1; i>-1; i--){
          tempIntentArry.push({
            'entity' : res['entities'][i]['entity'],
            'intent' : res['entities'][i]['intent'].split('_').join(' ')
          })
        }
        setTextEntities(tempIntentArry);
        setStatus('');
        document.getElementById('searchInput').value = input;

      }).catch(res => {
        setStatus('');
        document.getElementById('searchInput').value = input;
      });

    }).catch(res => {
      setStatus('');
      document.getElementById('searchInput').value = input;
    });



    // var text = input.replace(/\s+$/, '');;
    // var textArray = text.split(' ');
    // var boardList = ['cbse', 'ncert'];
    // var yearList = ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021', 'papers', 'paper'];
    // var subjectList = ['maths', 'chemistry', 'biology', 'physics', 'history', 'mathematics'];
    // var gradeList = ['iv', 'v', 'vi', 'i', 'ii', 'iii', 'vii', 'viii', 'ix', 'x','xi', 'xii']
    // var importantQuestionPhrases = ['question', 'questions', 'important']

    // var questionPaperScore = 0;
    // var importantQuestionScore = 0;
    // var questionScore = 0;


    // for(var i=0;i<textArray.length;i++){
    //   if(boardList.includes(textArray[i].toLocaleLowerCase()) || yearList.includes(textArray[i].toLocaleLowerCase())  || subjectList.includes(textArray[i].toLocaleLowerCase()) || gradeList.includes(textArray[i].toLocaleLowerCase())){
    //     questionPaperScore++;
    //   }

    //   if(importantQuestionPhrases.includes(textArray[i].toLocaleLowerCase()) || subjectList.includes(textArray[i])){
    //     importantQuestionScore++;
    //   }

    // }

    // window.setTimeout(()=>{
    //   if((questionPaperScore > importantQuestionScore) && (questionPaperScore > questionScore)){
    //     setLoadingText('Loading question papers...');
    //     getQuestionPaper(textArray);
    //   }
    //   else if((importantQuestionScore > questionPaperScore) && (importantQuestionScore > questionScore)){
    //     setLoadingText('Loading textbook questions...');
    //     window.setTimeout(()=>{
    //       setStatus('');
    //     },1000)
    //   }
    //   else if(((questionScore > importantQuestionScore) && (questionScore > questionPaperScore)) || (questionScore==0 && importantQuestionScore==0 && questionPaperScore==0)){
    //     setLoadingText('Loading solution...');
    //     window.setTimeout(()=>{
    //       setStatus('');
    //     },1000)
    //   }
    //   else{
    //     noMatch();
    //   }
    // },1000)
  }

  function noMatch(){
    setLoadingText('Could not find any match.');
    window.setTimeout(()=>{
      setStatus('');
    },3000)
  }

  function sortResults(people:any, prop:any, asc:any) {
    return people.sort(function(a:any, b:any) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}

  function getQuestionPaper(textArray:any){
    var uniquePapers:any = [];

   getAllAssesments().then(r=>r.json()).then(res=>{
     var matches = [];
     if(!res['assessments']){
        noMatch();
        return
     }

    if(res['assessments']['draft']){
      for(var i=0;i<res['assessments']['draft'].length;i++){
        var check1arr = [res['assessments']['draft'][i]['grade'].toLocaleLowerCase(), res['assessments']['draft'][i]['board'].toLocaleLowerCase(), res['assessments']['draft'][i]['subject'].toLocaleLowerCase()]
          var MatchCount = 0;
          for(var j=0;j<textArray.length;j++){
            for(var k=0;k<check1arr.length;k++){
              if(check1arr[k].includes(textArray[j].toLocaleLowerCase())){
                MatchCount++;
              }
            }
          }
          if(MatchCount>0){
            res['assessments']['draft'][i]['matchScore'] = MatchCount
            matches.push(res['assessments']['draft'][i])
          }
      }
    }


    var sortedResults = sortResults(matches,'matchScore',false)
    var counter = 0;
    var filteredList = []

    for(var i=0;i<sortedResults.length;i++){
      counter++
      if(counter>8){
        break
      }
      var text = titleGenerator(sortedResults[i]['title'])
      var checker = sortedResults[i]['title'].split('-')[0] + sortedResults[i]['title'].split('-')[1] + sortedResults[i]['title'].split('-')[2] + sortedResults[i]['title'].split('-')[3] + sortedResults[i]['title'].split('-')[4]
      if(uniquePapers.includes(checker)==false){
        filteredList.push({
          text : text,
          id : sortedResults[i]['id'],
          type : 'questionPaper'
        })
  
        uniquePapers.push(checker)
      }

    }

    // @ts-ignore
    setTopMatches(filteredList);
    if(filteredList.length==0){
      noMatch();
    }

    window.setTimeout(()=>{
      setStatus('');
    },1000);
   })
  }

  function openPage(type:any, id:any){
    var href = '/question-paper/' + id;
    router.push(href)
  }

  function keyPressed(event:any){
    if(event.key === 'Enter'){
      intentDetector();
    }

    // setStatus('')
  }



  return (
   <>
    <div className={styles.searchBarContainer}>
      <div>
        <h1>Byjus Universal Search</h1>

        { status!= 'detecting' &&
        <>
        <div className={styles.searchContainerDiv}>
          <div className={styles.searchBarDiv}>
            <div className={styles.centerAlign}>
              <input id="searchInput" className={styles.searchBar} onKeyPress={(e) => {keyPressed(e)}} placeholder='Type here...'></input>
            </div>
            <div>
              <div className={styles.centerAlign}>
                <Image className="pointer" onClick={() => intentDetector(null)} src="/images/Search.png" height="50" width="50"></Image>
              </div>
            </div>
          </div>
          <div className={styles.micContainer}>
            <div className={styles.microphoneDiv + " pointer"} onClick={() => {setMicClicked(true); if(isMicrophoneAvailable){startListening();}}}>
                <Image src="/images/microphone-2.png" height="25" width="20"></Image>
            </div>
          </div>
        </div>
        <div>
          { !isMicrophoneAvailable && micClicked && 
          <>
            <div className={styles.listeningDiv}>
              <span>Microphone is disabled. Please enable it from the browser settings.</span>
            </div>
          </>
          }
          { listening==true &&
          <>
          <div className={styles.listeningDiv}>
              <span><div className={styles.blinkRed}></div>Listening</span>
          </div>
          <div className={styles.transcript}>
              <span>&quot;{transcript}&quot;</span>
          </div>
          </>
          }
        </div>
        </>
        }
        { status== 'detecting' &&
        <div className={styles.loaderDiv}>
          <div className={styles.loaderImageDiv}><Image src="/images/loader3.gif" layout='fill'></Image></div>
          <div className={styles.loaderImageText}>{loadingText}</div>
        </div>
        }
        {status!='detecting' &&  graphData &&

        <div className={styles.graphHolder}>
          <Bar
            data={graphData}
            width={400}
            height={200}
            options={{
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                    x: {
                        ticks: {
                            callback: function(value, index, values) {
                                var newString = graphData['labels'][index].split('_intent')[0]
                                return newString;//truncate
                            },
                        }
                    },
                }
            }}
          />
          <br></br>
          {textEntities.map((el,i) =>
            <div key={'intent' + '_'  + i} className={styles.entititesBox}>
              <div className={styles.textBox}>{el['entity']}</div>
              <div className={styles.intentBox}>{el['intent']}</div>
            </div>
          )}
          </div>
        }
        { status!='detecting' && topMatches.length>0 &&
        <>
        <div className={styles.topMatches}>
          <h3>Top Matches : </h3>
          {topMatches.map((el,i) =>
            <div key={'suggest_' + i} className={styles.topMatchesDiv} onClick={() => {openPage(el['type'], el['id'])}}>
              <div>
                <span>{el['text']}</span>
              </div>
              <div>
                <span><Image src="/images/right-chiron.png" height="20" width="20"></Image></span>
              </div>
            </div>
          )}
         </div>
         </>
        }
      </div>
    </div>
   </>
  )
}

export default Home
