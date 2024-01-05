import { useContext, useState } from "react";
import styles from './ShortAnsQ.module.css'
import { QuestionFieldsContext } from "../../context/QuestionFieldsContext";


const ShortAnswerQField = ({fieldId, labelValue}) => {

    const {questionFieldList, setQuestionFieldList} = useContext(QuestionFieldsContext);

        /* To be passed into children components: ShortAnsQ and MCQuestionField
    PARAMS: e: event, fieldId: id of the field
    EFFECT: removes the question field with id fieldId from questionFieldList
    */
    const handleRemoveField = (e, fieldId) => {
        e.preventDefault();
        let newList = [...questionFieldList];
        
        //console.log('Field id: ' + fieldId);

        const newFilteredList = newList.filter((question) => question.id !== fieldId);

        setQuestionFieldList(newFilteredList);
        //console.log('Set new list');
    }

    const handleFieldChange = (e, fieldId) => {
        let newList = [...questionFieldList];
        for (let i = 0; i < questionFieldList.length; i++) {
            if (questionFieldList[i].id === fieldId) {
                questionFieldList[i].questionLabel = e.target.value;
            }
        }
        setQuestionFieldList(newList);
    }


    return (
    <div className={`${styles.questionContainer}`}>
        <input key='shortanswer_question_field' type='text' placeholder="Question" value={labelValue}
        onChange={(e) => handleFieldChange(e, fieldId)} required></input>
        <button onClick={(e) => handleRemoveField(e, fieldId)}>Remove</button>        
    </div>
    
    );
}

export default ShortAnswerQField;