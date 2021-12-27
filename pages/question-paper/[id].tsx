import type { NextPage } from 'next'
import styles from '../../styles/question-paper.module.css'
import {useState} from "react";
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getQuestionPaperDetails } from '../../common';
import dynamic from "next/dynamic";
import SolutionPopup from '../../components/solutionPopup';
import MarkingAssistPopup from '../../components/markingassistPopup';
const Popup = dynamic(() => import("reactjs-popup"));

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
    const alphabet = ['A','B','C','D','E']

    useEffect(() => {
        if(id){
        getQuestionPaperDetails(id).then(r=>r.json()).then(res=>{
            if(res['assessment']){
            console.log(res['assessment']);
            setAssesmentDetails(res['assessment'])
            var questions = res['assessment']['paperSections'][0]['groups'];
            console.log(questions)
            setQuestionsList(questions);

            setLoaded(true);
            }
        })
        }
      }, [router.query.id])

    function dateDormatter(dateStr:any){
        var exDate = new Date(dateStr);
        var returnString = exDate.getDate() + '/' + (exDate.getMonth() + 1) + '/' + exDate.getFullYear()
        return returnString
    }

    return (
        <>
        { loaded && <div className={styles.paperContainer}>
            <div className={styles.header}>
                <div>
                    <span>Board : {assesmentDetails['board']}</span><br></br><br></br>
                    <span>Grade : {assesmentDetails['grade']}</span>
                </div>
                <div>
                    <span>Subject : {assesmentDetails['subject']} {assesmentDetails['year']}</span><br></br><br></br>
                    <span>Date : {dateDormatter(assesmentDetails['assessmentDate'])}</span>
                </div>
                <div>
                    <span>Maxmimum marks : {assesmentDetails['totalMarks']}</span><br></br><br></br>
                    {assesmentDetails['duration'] && <span>Time Limit : {assesmentDetails['duration']} minutes</span>}
                </div>
            </div>
            <div className={styles.contentContainer}>
                {questionsList.map((el,i) =>
                <div className={styles.groupDiv} key={'group_' + i}>
                    <div className={styles.groupTitle}>{el['info']['name']} ({el['info']['marks']} Marks)</div>
                    {questionsList[i]['questions'].map((el,j) =>
                        <div className={styles.questionDiv} key={'question_' + j}>
                            <div>Q{(j+1)}. </div>
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: el['question']['text']}}></div>
                                {el['question']['mcOptions'] &&
                                <>
                                     {el['question']['mcOptions'].map((el,k) =>
                                     <div className={styles.optionsHolder} key={'options_' + j + '_' + k}>
                                        <div className={styles.optionCircle}>{alphabet[k]}</div>
                                        <div dangerouslySetInnerHTML={{ __html: el['value']}}></div>
                                    </div>
                                     )}
                                </>
                                }
                                {el['question']['mtcOptions']['matching'].length>0 && 
                                <div className={styles.matchTheColumnsDiv}>
                                    <div>
                                        {el['question']['mtcOptions']['leftColumn'].map((el,l) =>
                                            <span key={'left_' + l} dangerouslySetInnerHTML={{ __html: el}}></span>
                                        )}
                                    </div>
                                    <div>
                                        {el['question']['mtcOptions']['rightColumn'].map((el,l) =>
                                            <span key={'right_' + l} dangerouslySetInnerHTML={{ __html: el}}></span>
                                        )}
                                    </div>
                                </div>
                                }
                            </div>
                            <div>
                                <div className={styles.marksText}>{el['marks']} Mark{(el['marks'])>1 ? 's' : ''}</div>
                                <div className={styles.viewSolutionButton} onClick={()=>{setShowSolutionPopup(true);setClickedSolution(el['question']['solutionText'])}}>View Solution</div>
                                { el['question']['rubrics'][0]['steps'].length>1 && <div className={styles.viewSolutionButton} onClick={()=>{setShowMarkingAssistPopup(true);setMarkingAssist(el['question']['rubrics'][0]['steps'])}}>Marking Assist</div>}
                            </div>
                        </div>
                    )}
                </div>
                
                )}
            </div>
        </div>
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
