// @ts-nocheck
import type { NextPage } from 'next'
import styles from '../../styles/question-paper.module.css'
import {useState} from "react";
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getQuestionPaperDetails, getAllAssesments, titleGenerator } from '../../common';
import { MathJax, MathJaxContext } from "better-react-mathjax";
import 'katex/dist/katex.min.css';
import 'react-sliding-side-panel/lib/index.css';

import dynamic from "next/dynamic";
const SolutionPopup = dynamic(() => import("../../components/solutionPopup"));
const Popup = dynamic(() => import("reactjs-popup"));
const SlidingPanel = dynamic(() => import("react-sliding-side-panel"));
const MarkingAssistPopup = dynamic(() => import("../../components/markingassistPopup"));
const Image = dynamic(() => import("next/image"));

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

const QuestionPaper: NextPage = () => {
    const router = useRouter();
    const { id } = router.query
    var [questionsList, setQuestionsList] = useState([]);
    var [assesmentDetails, setAssesmentDetails] = useState(null);
    var [loaded, setLoaded] = useState(false);
    var [showSolutionPopup, setShowSolutionPopup] = useState(false);
    var [clickedSolution, setClickedSolution] = useState(null);
    var [showMarkingAssistPopup, setShowMarkingAssistPopup] = useState(false);
    var [markingAssist, setMarkingAssist] = useState(null);
    var [dashboardMatrix, setDashboardMatrix] = useState(null);
    var [dashboardType, setDashboardType] = useState('count');
    var [wholeData, setWholeData] = useState(null);
    var [openDahboardPanel, setOpenDahboardPanel] = useState(false);
    var [filterSelected, setFilterSelected] = useState(null);
    const alphabet = ['A','B','C','D','E'];
    const bloomsMapping = [
        'Remember',
        'Understand', 
        'Apply' ,
        'Analyse',
        'Evaluate',
        'Create' ,
    ]
    var [graph1data, setGraph1data] = useState(null);
    var [graph2data, setGraph2data] = useState(null);
    var [summarytext, setSummarytext] = useState(null);
    var [selectedDashboardView, setSelectedDashboardView] = useState('Chapter')
    
    const mathjaxConfig = {
        "fast-preview": {
            disabled: true
          },
          tex2jax: {
            inlineMath: [
              ["$", "$"],
              ["\\(", "\\)"]
            ],
            displayMath: [
              ["$$", "$$"],
              ["\\[", "\\]"]
            ]
          },
          messageStyle: "none"
    }

    useEffect(() => {
        if(id){
        getQuestionPaperDetails(id).then(r=>r.json()).then(res=>{
            if(res['assessment']){
            setAssesmentDetails(res['assessment'])
            var questions = res['assessment']['paperSections'];
            setQuestionsList(questions);
            generateDashboardMatrix(questions);
            generateGraph1(questions, 'Chapter');
            generateGraph2(questions, 'Chapters', res['assessment']);
            setLoaded(true);
            }
        })
        }
      }, [router.query.id])

    function generateGraph2(data, type, assesmentDetailsLocal){

        // Old chart //

        if(!data){
            data = questionsList;
        }
        var chapters = []
        var labels = []
        var marksData = []
        var questionCountData = []

        if(type == 'Topic'){
            
        for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i]['groups'].length;j++){
                for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                    if(data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                        chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']] = {
                            'marks' : 0,
                            'count' : 0
                        }
                    }
                }
            }
        }
        for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i]['groups'].length;j++){
                for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                    if(data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                        chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']]['marks'] += data[i]['groups'][j]['questions'][k]['question']['marks']
                        chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']]['count'] += 1
                    }
                    }
                }
        }
        }

        else{

            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i]['groups'].length;j++){
                    for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                        if(data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                            chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['chapter']] = {
                                'marks' : 0,
                                'count' : 0
                            }
                        }
                    }
                }
            }
            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i]['groups'].length;j++){
                    for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                        if(data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                            chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['chapter']]['marks'] += data[i]['groups'][j]['questions'][k]['question']['marks']
                            chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['chapter']]['count'] += 1
                        }
                        }
                    }
            }
        }




        var chaptersArray = [];

        for(var key in chapters){
            chaptersArray.push({
                'marks' : chapters[key]['marks'],
                'count' : chapters[key]['count'],
                'chapter' : key
            });
        }
        var maxCount = 10;

        sortResults(chaptersArray,'marks', false)

        for(var i=0;i<chaptersArray.length;i++){
            maxCount--;
            if(maxCount<0){
                break;
            }
            labels.push(chaptersArray[i]['chapter']);
            marksData.push(chaptersArray[i]['marks'])
            questionCountData.push(chaptersArray[i]['count'])
        }

        var data = {
            labels: labels,
            datasets: [{
              label: 'Marks',
              data: marksData,
              backgroundColor: [
                'rgba(54, 162, 235, 0.2)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
              ],
              borderWidth: 1
            },
            {
                label: "Historical Average",
                data: [{ x: 1, y: 10 }, { x: 3, y: 10 }],
                type: "line",
                fill: "false",
                // pointRadius: 0,
                pointStyle: "circle",
              }
            ]
        }



        // /////////

        // Line Chart //
        if(!assesmentDetailsLocal){
            assesmentDetailsLocal = assesmentDetails
        }
        var currentPaperArray = assesmentDetailsLocal['title'].split('-')
        var similar_papers = []

        getAllAssesments().then(r=>r.json()).then(res=>{
            if(res['assessments']['draft']){
                var papers = res['assessments']['draft'];
                for(var i =0;i<papers.length;i++){
                    var currentLoopPaperArray = papers[i]['title'].split('-');
                    if(currentLoopPaperArray[0] == currentPaperArray[0] && currentLoopPaperArray[1] == currentPaperArray[1] && currentLoopPaperArray[2] == currentPaperArray[2] && currentLoopPaperArray[3] == currentPaperArray[3]){
                        similar_papers.push({
                            'id' : papers[i]['id'],
                            'title' : papers[i]['title']   
                        })
                    }
                }
                doTask(similar_papers, labels, data, type);
            }
        });

    }

    async function doTask(similar_papers, labels, old_graph_data, type){
        let result = wholeData;
        if(!result){
            result = await getDetails(similar_papers);
            setWholeData(result);
        }

        var average_list = []
        var totalPapers = result.length;

        for(var i=0;i<labels.length;i++){
            average_list[i] = 0
        }

        for(var a=0;a<result.length;a++){
            var data = result[a]['result']['assessment']['paperSections'];
            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i]['groups'].length;j++){
                    for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                        for(var l=0;l<labels.length;l++){
                            if(type == 'Topic'){
                                if(labels[l] == data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                                    average_list[l] += data[i]['groups'][j]['questions'][k]['question']['marks']
                                }
                            }
                            else{
                                if(labels[l] == data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['chapter']){
                                    average_list[l] += data[i]['groups'][j]['questions'][k]['question']['marks']
                                }
                            }
                            
                        }
                        }
                    }
            }
        }

        for(var i=0;i<average_list.length;i++){
            average_list[i] = Math.round(average_list[i]/totalPapers);
        }
        var newDataset = []
        for(var i=0;i<labels.length;i++){
            newDataset.push({
                x : (i+1),
                y : average_list[i]
            })
        }

        var historicalDataSet = old_graph_data;
        historicalDataSet['datasets'][1]['data'] = newDataset
        setGraph2data(historicalDataSet)
    }


    async function getDetails(id_list){
        for(let i = 0; i < id_list.length; i++){
            var res3 = await fetch('https://assessed.co.in:9080/api/teacher/paper/details/' + id_list[i]['id'], {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MWM0NWM3ZDE3YjBjOWU0NTBlMTQ3ODQiLCJyb2xlIjoidGVhY2hlciIsInRpbWVzdGFtcCI6IjIwMjEtMTItMjdUMDY6Mjg6MDYuMTEzWiIsImlhdCI6MTY0MDU4NjQ4Nn0.sWlR6mPYKMo4ZtUFmEgNBtPNAK1yZEO5Nzjm5L_SF_U'
                }
            })
            var result = await res3.json()
            id_list[i]['result'] = result;
        }
        return id_list;
    }

    function generateGraph1(data, type){
        if(!data){
            data = questionsList;
        }
        var chapters = []
        var labels = []
        var marksData = []
        var questionCountData = []

        if(type == 'Topic'){
            
        for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i]['groups'].length;j++){
                for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                    if(data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                        chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']] = {
                            'marks' : 0,
                            'count' : 0
                        }
                    }
                }
            }
        }
        for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i]['groups'].length;j++){
                for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                    if(data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                        chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']]['marks'] += data[i]['groups'][j]['questions'][k]['question']['marks']
                        chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']]['count'] += 1
                    }
                    }
                }
        }
        }

        else{

            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i]['groups'].length;j++){
                    for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                        if(data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                            chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['chapter']] = {
                                'marks' : 0,
                                'count' : 0
                            }
                        }
                    }
                }
            }
            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i]['groups'].length;j++){
                    for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                        if(data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['topic']){
                            chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['chapter']]['marks'] += data[i]['groups'][j]['questions'][k]['question']['marks']
                            chapters[data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['chapter']]['count'] += 1
                        }
                        }
                    }
            }
        }




        var chaptersArray = [];

        for(var key in chapters){
            chaptersArray.push({
                'marks' : chapters[key]['marks'],
                'count' : chapters[key]['count'],
                'chapter' : key
            });
        }
        var maxCount = 10;

        sortResults(chaptersArray,'marks', false)

        for(var i=0;i<chaptersArray.length;i++){
            maxCount--;
            if(maxCount<0){
                break;
            }
            labels.push(chaptersArray[i]['chapter']);
            marksData.push(chaptersArray[i]['marks'])
            questionCountData.push(chaptersArray[i]['count'])
        }

        var data = {
            labels: labels,
            datasets: [{
              label: 'Marks',
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


        setGraph1data(data);
        setSummarytext('This year\'s question paper had highest marks from the ' + ((type == 'Chapter') ? 'chapter ' : 'topic ') + ' <b>' + labels[0] + '</b>.')
    }

    function sortResults(jsonObject, prop, asc) {
        return jsonObject.sort(function(a, b) {
            if (asc) {
                return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
            } else {
                return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
            }
        });
    }

    function generateDashboardMatrix(data:any){
        var matrix = {
            'Remember': 
                {
                    'MC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'FITB' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'TF' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'MTC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'VSA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'SA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'LA' : {
                        'count' : 0,
                        'marks' : 0
                    }
                }
            ,
            'Understand': 
                {
                    'MC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'FITB' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'TF' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'MTC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'VSA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'SA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'LA' : {
                        'count' : 0,
                        'marks' : 0
                    }
                }
            ,
            'Apply': 
                {
                    'MC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'FITB' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'TF' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'MTC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'VSA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'SA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'LA' : {
                        'count' : 0,
                        'marks' : 0
                    }
                }
            ,
            'Analyse': 
                {
                    'MC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'FITB' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'TF' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'MTC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'VSA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'SA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'LA' : {
                        'count' : 0,
                        'marks' : 0
                    }
                }
            ,
            'Evaluate': 
                {
                    'MC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'FITB' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'TF' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'MTC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'VSA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'SA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'LA' : {
                        'count' : 0,
                        'marks' : 0
                    }
                }
            ,
            'Create': 
                {
                    'MC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'FITB' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'TF' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'MTC' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'VSA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'SA' : {
                        'count' : 0,
                        'marks' : 0
                    },
                    'LA' : {
                        'count' : 0,
                        'marks' : 0
                    }
                }
            
        }

        for(var i=0;i<data.length;i++){
            for(var j=0;j<data[i]['groups'].length;j++){
                for(var k=0;k<data[i]['groups'][j]['questions'].length;k++){
                    let index = 1;
                    for(var key in matrix){
                        if(index == data[i]['groups'][j]['questions'][k]['question']['matchingRelation']['bloomsIndex']){
                            try{
                                matrix[key][data[i]['groups'][j]['questions'][k]['question']['type']]['count']+= 1
                                matrix[key][data[i]['groups'][j]['questions'][k]['question']['type']]['marks']+= data[i]['groups'][j]['questions'][k]['question']['marks']
                            }
                            catch(err){

                            }
                        }
                        index++;
                    }
                }
            }
        }
        setDashboardMatrix(matrix);
    }

    function dateDormatter(dateStr:any){
        var exDate = new Date(dateStr);
        var returnString = exDate.getDate() + '/' + (exDate.getMonth() + 1) + '/' + exDate.getFullYear()
        return returnString
    }


    return (
        <>

        { loaded &&

        <>
        <div className={styles.topDashboardDiv}>
            <div className={styles.paperContainer}>
                <div className={styles.insightsDashboardDiv}>
                    <div className={styles.dashboardDivInside}>
                        <div className={styles.insightsDashboardTitle}>
                            <div>Top Questions by {selectedDashboardView}</div>
                            <div>
                                <select className={styles.dashboardSelect} value={selectedDashboardView}
                                onChange={(e) => {setSelectedDashboardView(e.target.value); generateGraph1(null, e.target.value); generateGraph2(null, e.target.value, null);}}>
                                    <option value="Chapter">Chapter</option>
                                    <option value="Topic">Topic</option>
                                </select>
                            </div>
                        </div>
                    { !graph2data && graph1data &&
                        <Bar
                            data={graph1data}
                            width={400}
                            height={200}
                            options={{
                                scales: {
                                    x: {
                                        ticks: {
                                            callback: function(value, index, values) {
                                                var newString = graph1data['labels'][index].substring(0,5) + '...'
                                                return newString;//truncate
                                            },
                                        }
                                    },
                                }
                            }}
                        />
                    }
                    { graph2data && 
                        <>
                        <Bar
                           data={graph2data}
                           width={400}
                           height={200}
                           options={{
                               scales: {
                                   x: {
                                       ticks: {
                                           callback: function(value, index, values) {
                                               var newString = graph2data['labels'][index].substring(0,5) + '...'
                                               return newString;//truncate
                                           },
                                       }
                                   },
                               }
                           }}
                        />
                        </>
                    }
                    {!graph2data && <div className={styles.loadingText}>Loading historical average...</div>}
                    </div>
                    <div className={styles.dashboardDivInside}>
                        <span dangerouslySetInnerHTML={{ __html: summarytext}}></span>
                        <a href="https://byjus.com/" rel="noreferrer" target="_blank">
                            <div className={styles.ctaBanner}>
                                <Image src="https://cdn1.byjus.com/wp-content/uploads/2021/08/SEO_Popup_Banner_Latest.jpg?imwidth=3840" layout='fill'></Image>
                            </div>
                        </a>
                        <a href="https://byjus.com/" rel="noreferrer" target="_blank"><div className={styles.bookClassCTA}>Book A Free Class</div></a>
                    </div>
                </div>
            </div>
        </div>
        
        <div className={styles.paperContainer}>        
            <div className={styles.header}>
                <div className={styles.left}>
                    <span>{titleGenerator(assesmentDetails['title'])}</span>
                </div>
                <div className={styles.right}>
                    <span>Maximum marks : {assesmentDetails['totalMarks']}</span><br></br><br></br>
                    {assesmentDetails['duration'] && <span>Time Limit : {assesmentDetails['duration']} minutes</span>}
                </div>
            </div>
            <MathJaxContext version={2} config={mathjaxConfig}>
                <MathJax>
                    <div className={styles.contentContainer}>
                        <div className={styles.instructionsDiv} dangerouslySetInnerHTML={{ __html: assesmentDetails['instructions']}}>
                        </div>
                        {questionsList.map((el,a) =>
                        <div key={"section_" + a} className={styles.sectionDiv}>
                            {assesmentDetails['paperSections'][a]['info'] &&
                            <>
                            <div className={styles.sectionTitle}>
                                {assesmentDetails['paperSections'][a]['info']['name']}
                            </div>
                            <div className={styles.sectionInstructions}>
                                {assesmentDetails['paperSections'][a]['info']['instructions']}
                            </div>
                            </>
                            }
                            {el['groups'].map((elT,i) => 
                            <div className={styles.groupDiv} key={'group_' + i}>
                                {elT['questions'].map((el,j) =>
                                <div key={'elt_' + j}>
                                { 
                                <div  style={(filterSelected == null || filterSelected == el['question']['matchingRelation']['topic'] || filterSelected == el['question']['matchingRelation']['bloomsIndex'] || filterSelected == el['question']['type']) ? {opacity:1} : {opacity:0.2}}>
                                    { j==0 &&
                                    <>
                                    <div className={styles.groupTitle}>{elT['info']['name']}</div>
                                    <div className={styles.groupInstructions}>{elT['info']['instructions']}</div>
                                    </>
                                    }
                                    <div className={styles.questionDiv} key={'question_' + j}>
                                        <div>Q{(j+1)}. </div>
                                        <div>
                                            <div dangerouslySetInnerHTML={{ __html: (el['question']['text'])}}></div>
                                            {el['question']['mcOptions'] &&
                                            <>
                                                {el['question']['mcOptions'].map((el,k) =>
                                                <div className={styles.optionsHolder} key={'options_' + j + '_' + k}>
                                                    <div className={styles.optionCircle}>{alphabet[k]}</div>
                                                    <div dangerouslySetInnerHTML={{ __html: (el['value'])}}></div>
                                                </div>
                                                )}
                                            </>
                                            }
                                            {el['question']['mtcOptions']['matching'].length>0 && 
                                            <div className={styles.matchTheColumnsDiv}>
                                                <div>
                                                    {el['question']['mtcOptions']['leftColumn'].map((el,l) =>
                                                        <span key={'left_' + l} dangerouslySetInnerHTML={{ __html: (el)}}></span>
                                                    )}
                                                </div>
                                                <div>
                                                    {el['question']['mtcOptions']['rightColumn'].map((el,l) =>
                                                        <span key={'right_' + l} dangerouslySetInnerHTML={{ __html: (el)}}></span>
                                                    )}
                                                </div>
                                            </div>
                                            }
                                            <div className={styles.tagsDiv}>
                                                { el['question']['matchingRelation']['topic'] &&
                                                <div onClick={()=>{setFilterSelected(el['question']['matchingRelation']['topic'])}} className={styles.tag} style={{backgroundColor: 'orange'}}>
                                                    <span>{el['question']['matchingRelation']['topic']}</span>
                                                </div>
                                                }
                                                { bloomsMapping[el['question']['matchingRelation']['bloomsIndex']+1] &&
                                                <div onClick={()=>{setFilterSelected(el['question']['matchingRelation']['bloomsIndex'])}} className={styles.tag} style={{backgroundColor: '#ff6f6f'}}>
                                                    <span>{bloomsMapping[el['question']['matchingRelation']['bloomsIndex']+1]}</span>
                                                </div>
                                                }
                                                { el['question']['type'] &&
                                                <div onClick={()=>{setFilterSelected(el['question']['type'])}} className={styles.tag} style={{backgroundColor: '#8fc752'}}>
                                                    <span>{el['question']['type']}</span>
                                                </div>
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div className={styles.marksText}>{el['marks']} Mark{(el['marks'])>1 ? 's' : ''}</div>
                                            <div className={styles.viewSolutionButton} onClick={()=>{setShowSolutionPopup(true);setClickedSolution(el['question']['solutionText'])}}>View Solution</div>
                                            { el['question']['rubrics'][0]['steps'].length>1 && <div className={styles.viewSolutionButton} onClick={()=>{setShowMarkingAssistPopup(true);setMarkingAssist(el['question']['rubrics'][0]['steps'])}}>Marking Assist</div>}
                                        </div>
                                    </div>
                                </div>
                                }
                                </div>
                                )}
                            </div>
                            )}
                        </div>
                       
                        
                        )}
                    </div>
                </MathJax>
            </MathJaxContext>

            {/* <div className={styles.filterDiv} onClick={()=>{setOpenDahboardPanel(true)}}>
                <Image src="/images/filter.png" height="30" width="30"></Image>
            </div> */}

            <div className={styles.dashboardDiv} onClick={()=>{setOpenDahboardPanel(true)}}>
                <Image src="/images/table.png" height="30" width="30"></Image>
            </div>
        
            <SlidingPanel type={'right'} isOpen={openDahboardPanel} size={(window.innerWidth>600) ? 40 : 100}>
            <>
                <div className={styles.dashboardTitle}>
                    <div onClick={()=>{setOpenDahboardPanel(false)}} className={styles.sidebarCloseButton}><Image src="/images/x-mark.png" height="15" width="15"></Image></div>
                    <div>Question Paper Dashboard</div>
                    <div className={styles.dashboardTypeDiv}>
                        { dashboardType=='count' && <button onClick={()=>{setDashboardType('marks')}}>View question marks</button>}
                        { dashboardType=='marks' && <button onClick={()=>{setDashboardType('count')}}>View question count</button>}
                    </div>
                </div>
                <table className={styles.mytable}>
                    <tbody>
                    <tr>
                        <th>Type/Blooms Index</th>
                        <th>MC</th>
                        <th>FITB</th>
                        <th>TF</th>
                        <th>MTC</th>
                        <th>VSA</th>
                        <th>SA</th>
                        <th>LA</th>
                    </tr>
                    <tr>
                        <th>Remember</th>
                        { dashboardType=='count' && <>
                            <td>{dashboardMatrix['Remember']['MC']['count']}</td>
                            <td>{dashboardMatrix['Remember']['FITB']['count']}</td>
                            <td>{dashboardMatrix['Remember']['TF']['count']}</td>
                            <td>{dashboardMatrix['Remember']['MTC']['count']}</td>
                            <td>{dashboardMatrix['Remember']['VSA']['count']}</td>
                            <td>{dashboardMatrix['Remember']['SA']['count']}</td>
                            <td>{dashboardMatrix['Remember']['LA']['count']}</td>
                        </>}
                        { dashboardType=='marks' && <>
                            <td>{dashboardMatrix['Remember']['MC']['marks']}</td>
                            <td>{dashboardMatrix['Remember']['FITB']['marks']}</td>
                            <td>{dashboardMatrix['Remember']['TF']['marks']}</td>
                            <td>{dashboardMatrix['Remember']['MTC']['marks']}</td>
                            <td>{dashboardMatrix['Remember']['VSA']['marks']}</td>
                            <td>{dashboardMatrix['Remember']['SA']['marks']}</td>
                            <td>{dashboardMatrix['Remember']['LA']['marks']}</td>
                        </>}
                    </tr>
                    <tr>
                        <th>Understand</th>
                        { dashboardType=='count' && <>
                            <td>{dashboardMatrix['Understand']['MC']['count']}</td>
                            <td>{dashboardMatrix['Understand']['FITB']['count']}</td>
                            <td>{dashboardMatrix['Understand']['TF']['count']}</td>
                            <td>{dashboardMatrix['Understand']['MTC']['count']}</td>
                            <td>{dashboardMatrix['Understand']['VSA']['count']}</td>
                            <td>{dashboardMatrix['Understand']['SA']['count']}</td>
                            <td>{dashboardMatrix['Understand']['LA']['count']}</td>
                        </>}
                        { dashboardType=='marks' && <>
                            <td>{dashboardMatrix['Understand']['MC']['marks']}</td>
                            <td>{dashboardMatrix['Understand']['FITB']['marks']}</td>
                            <td>{dashboardMatrix['Understand']['TF']['marks']}</td>
                            <td>{dashboardMatrix['Understand']['MTC']['marks']}</td>
                            <td>{dashboardMatrix['Understand']['VSA']['marks']}</td>
                            <td>{dashboardMatrix['Understand']['SA']['marks']}</td>
                            <td>{dashboardMatrix['Understand']['LA']['marks']}</td>
                        </>}
                    </tr>
                    <tr>
                        <th>Apply</th>
                        { dashboardType=='count' && <>
                            <td>{dashboardMatrix['Apply']['MC']['count']}</td>
                            <td>{dashboardMatrix['Apply']['FITB']['count']}</td>
                            <td>{dashboardMatrix['Apply']['TF']['count']}</td>
                            <td>{dashboardMatrix['Apply']['MTC']['count']}</td>
                            <td>{dashboardMatrix['Apply']['VSA']['count']}</td>
                            <td>{dashboardMatrix['Apply']['SA']['count']}</td>
                            <td>{dashboardMatrix['Apply']['LA']['count']}</td>
                        </>}
                        { dashboardType=='marks' && <>
                            <td>{dashboardMatrix['Apply']['MC']['marks']}</td>
                            <td>{dashboardMatrix['Apply']['FITB']['marks']}</td>
                            <td>{dashboardMatrix['Apply']['TF']['marks']}</td>
                            <td>{dashboardMatrix['Apply']['MTC']['marks']}</td>
                            <td>{dashboardMatrix['Apply']['VSA']['marks']}</td>
                            <td>{dashboardMatrix['Apply']['SA']['marks']}</td>
                            <td>{dashboardMatrix['Apply']['LA']['marks']}</td>
                        </>}
                    </tr>
                    <tr>
                        <th>Analyse</th>
                        { dashboardType=='count' && <>
                            <td>{dashboardMatrix['Analyse']['MC']['count']}</td>
                            <td>{dashboardMatrix['Analyse']['FITB']['count']}</td>
                            <td>{dashboardMatrix['Analyse']['TF']['count']}</td>
                            <td>{dashboardMatrix['Analyse']['MTC']['count']}</td>
                            <td>{dashboardMatrix['Analyse']['VSA']['count']}</td>
                            <td>{dashboardMatrix['Analyse']['SA']['count']}</td>
                            <td>{dashboardMatrix['Analyse']['LA']['count']}</td>
                        </>}
                        { dashboardType=='marks' && <>
                            <td>{dashboardMatrix['Analyse']['MC']['marks']}</td>
                            <td>{dashboardMatrix['Analyse']['FITB']['marks']}</td>
                            <td>{dashboardMatrix['Analyse']['TF']['marks']}</td>
                            <td>{dashboardMatrix['Analyse']['MTC']['marks']}</td>
                            <td>{dashboardMatrix['Analyse']['VSA']['marks']}</td>
                            <td>{dashboardMatrix['Analyse']['SA']['marks']}</td>
                            <td>{dashboardMatrix['Analyse']['LA']['marks']}</td>
                        </>}
                    </tr>
                    <tr>
                        <th>Evaluate</th>
                        { dashboardType=='count' && <>
                            <td>{dashboardMatrix['Evaluate']['MC']['count']}</td>
                            <td>{dashboardMatrix['Evaluate']['FITB']['count']}</td>
                            <td>{dashboardMatrix['Evaluate']['TF']['count']}</td>
                            <td>{dashboardMatrix['Evaluate']['MTC']['count']}</td>
                            <td>{dashboardMatrix['Evaluate']['VSA']['count']}</td>
                            <td>{dashboardMatrix['Evaluate']['SA']['count']}</td>
                            <td>{dashboardMatrix['Evaluate']['LA']['count']}</td>
                        </>}
                        { dashboardType=='marks' && <>
                            <td>{dashboardMatrix['Evaluate']['MC']['marks']}</td>
                            <td>{dashboardMatrix['Evaluate']['FITB']['marks']}</td>
                            <td>{dashboardMatrix['Evaluate']['TF']['marks']}</td>
                            <td>{dashboardMatrix['Evaluate']['MTC']['marks']}</td>
                            <td>{dashboardMatrix['Evaluate']['VSA']['marks']}</td>
                            <td>{dashboardMatrix['Evaluate']['SA']['marks']}</td>
                            <td>{dashboardMatrix['Evaluate']['LA']['marks']}</td>
                        </>}
                    </tr>
                    <tr>
                        <th>Create</th>
                        { dashboardType=='count' && <>
                            <td>{dashboardMatrix['Create']['MC']['count']}</td>
                            <td>{dashboardMatrix['Create']['FITB']['count']}</td>
                            <td>{dashboardMatrix['Create']['TF']['count']}</td>
                            <td>{dashboardMatrix['Create']['MTC']['count']}</td>
                            <td>{dashboardMatrix['Create']['VSA']['count']}</td>
                            <td>{dashboardMatrix['Create']['SA']['count']}</td>
                            <td>{dashboardMatrix['Create']['LA']['count']}</td>
                        </>}
                        { dashboardType=='marks' && <>
                            <td>{dashboardMatrix['Create']['MC']['marks']}</td>
                            <td>{dashboardMatrix['Create']['FITB']['marks']}</td>
                            <td>{dashboardMatrix['Create']['TF']['marks']}</td>
                            <td>{dashboardMatrix['Create']['MTC']['marks']}</td>
                            <td>{dashboardMatrix['Create']['VSA']['marks']}</td>
                            <td>{dashboardMatrix['Create']['SA']['marks']}</td>
                            <td>{dashboardMatrix['Create']['LA']['marks']}</td>
                        </>}
                    </tr>
                    </tbody>
                </table>
            </>
            </SlidingPanel>
           

        </div>
        </>
        }

        <Popup open={showSolutionPopup} closeOnDocumentClick onClose={() => {setShowSolutionPopup(false);}}>
            <SolutionPopup clickedSolution={clickedSolution}></SolutionPopup>
        </Popup>

        <Popup open={showMarkingAssistPopup} closeOnDocumentClick onClose={() => {setShowMarkingAssistPopup(false);}}>
            <MarkingAssistPopup rubrics={markingAssist}></MarkingAssistPopup>
        </Popup>

        </>
    )
}

export default QuestionPaper
