// @ts-nocheck
import type { NextPage } from 'next'
import Image from 'next/image'
import styles from '../styles/index.module.css'
import {getAllAssesments} from '../common';
import {useState} from "react";
import { useRouter } from 'next/router'
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Home: NextPage = () => {

  var [status, setStatus] = useState('');
  var [topMatches, setTopMatches] = useState([]);
  var [loadingText, setLoadingText] = useState('Detecting intent...');
  const router = useRouter();
  const commands = [
    {
      command: '*',
      callback: (text) => (document.getElementById('searchInput').value = text)
    },
  ]
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({commands});
  const startListening = () => SpeechRecognition.startListening({ continuous: false });

  function intentDetector(){
    setStatus('detecting');
    setLoadingText('Detecting intent...');
    setTopMatches([])

    var input = document.getElementById('searchInput') as HTMLInputElement
    if(!input.value){
      return
    }

    var text = input.value.replace(/\s+$/, '');;
    var textArray = text.split(' ');
    var boardList = ['cbse', 'ncert'];
    var yearList = ['2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021', 'papers', 'paper'];
    var subjectList = ['maths', 'chemistry', 'biology', 'physics', 'history', 'mathematics'];
    var gradeList = ['iv', 'v', 'vi', 'i', 'ii', 'iii', 'vii', 'viii', 'ix', 'x','xi', 'xii']
    var importantQuestionPhrases = ['question', 'questions', 'important']

    var questionPaperScore = 0;
    var importantQuestionScore = 0;
    var questionScore = 0;


    for(var i=0;i<textArray.length;i++){
      if(boardList.includes(textArray[i].toLocaleLowerCase()) || yearList.includes(textArray[i].toLocaleLowerCase())  || subjectList.includes(textArray[i].toLocaleLowerCase()) || gradeList.includes(textArray[i].toLocaleLowerCase())){
        questionPaperScore++;
      }

      if(importantQuestionPhrases.includes(textArray[i].toLocaleLowerCase()) || subjectList.includes(textArray[i])){
        importantQuestionScore++;
      }

    }

    window.setTimeout(()=>{
      if((questionPaperScore > importantQuestionScore) && (questionPaperScore > questionScore)){
        setLoadingText('Loading question papers...');
        getQuestionPaper(textArray);
      }
      else if((importantQuestionScore > questionPaperScore) && (importantQuestionScore > questionScore)){
        setLoadingText('Loading textbook questions...');
        window.setTimeout(()=>{
          setStatus('');
        },3000)
      }
      else if(((questionScore > importantQuestionScore) && (questionScore > questionPaperScore)) || (questionScore==0 && importantQuestionScore==0 && questionPaperScore==0)){
        setLoadingText('Loading solution...');
        window.setTimeout(()=>{
          setStatus('');
        },3000)
      }
      else{
        noMatch();
      }
    },3000)
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
     console.log(res);
     var matches = [];

     if(!res['assessments']){
        noMatch();
        return
     }

     if(res['assessments']['evaluated']){
      for(var i=0;i<res['assessments']['evaluated'].length;i++){
          // var check1arr = [res['assessments']['evaluated'][i]['grade'].toLocaleLowerCase(), res['assessments']['evaluated'][i]['board'].toLocaleLowerCase(), res['assessments']['evaluated'][i]['academicYear'].toLocaleLowerCase(), res['assessments']['evaluated'][i]['subject'].toLocaleLowerCase()]
          var check1arr = [res['assessments']['evaluated'][i]['grade'].toLocaleLowerCase(), res['assessments']['evaluated'][i]['board'].toLocaleLowerCase(), res['assessments']['evaluated'][i]['subject'].toLocaleLowerCase()]

          var MatchCount = 0;
          for(var j=0;j<textArray.length;j++){
            for(var k=0;k<check1arr.length;k++){
              if(check1arr[k].includes(textArray[j].toLocaleLowerCase())){
                MatchCount++;
              }
            }
          }
          if(MatchCount>0){
            res['assessments']['evaluated'][i]['matchScore'] = MatchCount
            matches.push(res['assessments']['evaluated'][i])
          }
      }
    }

    if(res['assessments']['draft']){
      for(var i=0;i<res['assessments']['draft'].length;i++){
        // var check1arr = [res['assessments']['draft'][i]['grade'].toLocaleLowerCase(), res['assessments']['draft'][i]['board'].toLocaleLowerCase(), res['assessments']['draft'][i]['academicYear'].toLocaleLowerCase(), res['assessments']['draft'][i]['subject'].toLocaleLowerCase()]
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

    if(res['assessments']['correcting']){
      for(var i=0;i<res['assessments']['correcting'].length;i++){
          // var check1arr = [res['assessments']['correcting'][i]['grade'].toLocaleLowerCase(), res['assessments']['correcting'][i]['board'].toLocaleLowerCase(), res['assessments']['correcting'][i]['academicYear'].toLocaleLowerCase(), res['assessments']['correcting'][i]['subject'].toLocaleLowerCase()]
          var check1arr = [res['assessments']['correcting'][i]['grade'].toLocaleLowerCase(), res['assessments']['correcting'][i]['board'].toLocaleLowerCase(), res['assessments']['correcting'][i]['subject'].toLocaleLowerCase()]
          var MatchCount = 0;
          for(var j=0;j<textArray.length;j++){
            for(var k=0;k<check1arr.length;k++){
              if(check1arr[k].includes(textArray[j].toLocaleLowerCase())){
                MatchCount++;
              }
            }
          }
          if(MatchCount>0){
            res['assessments']['correcting'][i]['matchScore'] = MatchCount
            matches.push(res['assessments']['correcting'][i])
          }
      }
    }

    var sortedResults = sortResults(matches,'matchScore',false)
    var counter = 0;
    var filteredList = []

    for(var i=0;i<sortedResults.length;i++){
      counter++
      if(counter>5){
        break
      }

      var text = 'Grade ' + sortedResults[i]['grade'] + " " + sortedResults[i]['subject'] + ' ' + sortedResults[i]['board'];

      if(uniquePapers.includes(text)==false){
        filteredList.push({
          text : text,
          id : sortedResults[i]['id'],
          type : 'questionPaper'
        })
  
        uniquePapers.push(text)
      }

    }

    // @ts-ignore
    setTopMatches(filteredList);
    if(filteredList.length==0){
      noMatch();
    }

    window.setTimeout(()=>{
      setStatus('');
    },3000);
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
                <Image className="pointer" onClick={() => intentDetector()} src="/images/Search.png" height="50" width="50"></Image>
              </div>
            </div>
          </div>
          <div className={styles.micContainer}>
            <div className={styles.microphoneDiv + " pointer"} onClick={startListening}>
                <Image src="/images/microphone-2.png" height="25" width="20"></Image>
            </div>
          </div>
        </div>
        <div>
          { listening==true &&
          <>
          <div className={styles.listeningDiv}>
              <span><div className={styles.blinkRed}></div>Listening</span>
          </div>
          <div className={styles.transcript}>
              <span>"{transcript}"</span>
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
