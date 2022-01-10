// @ts-nocheck
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from '../../styles/textbook.module.css'
import {useEffect, useState} from "react";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

const Textbook: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    var [currentTextbookData, setCurrentTextBookData] = useState([]);

    useEffect(()=>{
        if(id){
            var data = require('../../public/json/convertcsv.json');
            console.log(data[id]);
            var bookname = data[id]['book'];
            var currentbookArray = {}

            for(var i=0;i<data.length;i++){
                if(data[i]['book'] == bookname){
                    currentbookArray[data[i]['chapter']] = []
                }
            }


            for(var i=0;i<data.length;i++){
                if(data[i]['book'] == bookname){
                    currentbookArray[data[i]['chapter']][data[i]['topic']] = [];
                }
            }

            for(var i=0;i<data.length;i++){
                if(data[i]['book'] == bookname){
                    currentbookArray[data[i]['chapter']][data[i]['topic']].push(data[i]['byjus tackle thumbnail urls']);
                }
            }

            var finalArray = [];

            for(var key in currentbookArray){
                var topics = [];
                for(var key_i in currentbookArray[key]){
                    var thumbnail = [];
                    for(var key_j in currentbookArray[key][key_i]){
                        if(currentbookArray[key][key_i][key_j] && currentbookArray[key][key_i][key_j]!=''){
                            thumbnail.push(currentbookArray[key][key_i][key_j])
                        }
                    }
                    topics.push({
                        'name' : key_i,
                        'thumbnail' : thumbnail
                    })

                }
               
                finalArray.push({
                    'book' : bookname,
                    'chapter' : key,
                    'topics' : topics,
                })
            }

            setCurrentTextBookData(finalArray);
            console.log(finalArray)
        }
       
      },[router.query.id])

    return(
        <>
        { currentTextbookData.length>0 && 
        <>
            <div className={styles.bookTitle}>
                <div className={styles.bodyContainer}>
                    {currentTextbookData[0]['book']}
                </div>
            </div>
            <div className={styles.bodyContainer}>
                <h4>Chapters</h4>
                <Accordion allowZeroExpanded>
                {currentTextbookData.map((el,a) =>
                <>
                    <AccordionItem>
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                {el['chapter']}
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            {el['topics'].map((el,a) =>
                                <>
                                <div className={styles.topicDiv}>
                                    {el['name']}
                                    {el['thumbnail'].map((el,a) => 
                                    <>
                                    <div className={styles.thumbnailDiv}>
                                        <Image src={el} height="50" width="50"></Image>
                                    </div>
                                    </>
                                    )}
                                </div>
                                </>
                            )}
                        </AccordionItemPanel>
                    </AccordionItem>
                </>
                )}         
                </Accordion>           
            </div>
        </>
        }
        <br></br>
        </>
    )
}

export default Textbook
