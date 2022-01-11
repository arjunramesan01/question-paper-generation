// @ts-nocheck
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import dynamic from "next/dynamic";
const Image = dynamic(() => import('next/image'));

const Textbook: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    var [currentTextbookData, setCurrentTextBookData] = useState([]);
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
    };

    useEffect(()=>{
        if(id){
            var data = require('../../public/json/convertcsv.json');
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
                <AccordionItem key={'acc_' + a}> 
                    <AccordionItemHeading>
                        <AccordionItemButton>
                            {el['chapter']}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <Slider {...{
                                dots: true,
                                infinite: true,
                                speed: 500,
                                slidesToShow: (el['topics'].length>=3 ? 3 : el['topics'].length),
                                slidesToScroll: 1
                        }}>
                        {el['topics'].map((el,a) =>
                            <div key={'topic_' + a} className={styles.topicDiv}>
                                <div className={styles.topicDiv2}>
                                    <span>{el['name']}</span>
                                    <div className={styles.thumbnailDiv}>
                                    { el['thumbnail'][0] &&   <Image src={el['thumbnail'][0]} layout='fill'></Image>}
                                    { !el['thumbnail'][0] &&   <Image src='/images/thumbnail.png' layout='fill'></Image>}
                                    </div>
                                </div>
                            </div>
                        )}    
                        </Slider>
                    </AccordionItemPanel>
                </AccordionItem>
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
