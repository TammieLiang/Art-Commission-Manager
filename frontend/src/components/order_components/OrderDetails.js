import styles from './OrderDetails.module.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const OrderDetails = () => {

    const { id } = useParams();
    const [order, setOrder] = useState('');
    const [fillouts, setFillouts] = useState([]);
    const [status, setStatus] = useState(null);
    const [artistNotes, setArtistNotes] = useState('');    

    const fetchOrder = async () => {
        const response = await fetch('http://localhost:4000/api/orders/' + id);
        
        if (response.ok) {
            const json = await response.json();
            setOrder(json);
            console.log("Fetched order: ", json);
        } else {
            console.log("response not ok");
        }
    }

    const selectStatus = (e) => {
        setStatus(e.target.value);
        console.log("Status selected: ", e.target.value);
    }

    const handleSave = async (e) => {
        e.preventDefault();
        let newOrder = order;
        newOrder.status = status;
        newOrder.artistNotes = artistNotes;

        const response = await fetch('http://localhost:4000/api/orders/' + id, {
            method: 'PATCH',
            body: JSON.stringify(newOrder),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = response.json();

        if (response.ok) {
            console.log("Updated order! ", json);
        } else {
            console.log("Error: Order was NOT updated :(")
        }

    }

    const handleArtistNotesChange = (e) => {
        setArtistNotes(e.target.value);
    }

    useEffect(() => {
        fetchOrder();
    }, [])


    useEffect(() => {
        let questions = [];
        if (Array.isArray(order.fillouts)) {
            for (let i = 0; i < order.fillouts.length; i++) {
                const question = JSON.parse(order.fillouts[i]);
                console.log(question);
                questions.push(question);
            }
        }
        setFillouts(questions);

        // Checking the radio button with the order's status
        setStatus(order.status);
        const statusRadios = Array.from(document.getElementsByName("statusSelection"));
        console.log("Fetched order's status: ", order.status);
        for (let i = 0; i < statusRadios.length; i++) {
            if (statusRadios[i].id === order.status) {
                statusRadios[i].checked = true;
                break;
            }
        }
        
        // Filling in the artistNotes textarea with order's artistNotes
        setArtistNotes(order.artistNotes);
        const artistNoteTextArea = document.getElementById("artistNotes");
        artistNoteTextArea.value = order.artistNotes;


    }, [order])

    return (
        <div className={styles.order_details}>
            <h3><strong>Client name: </strong>{order && order.clientName}</h3>
            <p><strong>Client contact: </strong>  { order && order.clientContact}</p>
            <p><strong>Request: </strong> {order && order.requestDetail}</p>
            <p><strong>Requested on: </strong> {order && order.dateReqqed}</p>
            <p><strong>Deadline:</strong> {order && order.deadline}</p>
            <div className={styles.status}>
                
            </div>

            <div className={styles.fillouts}>
                <h4>Form fillouts:</h4>
                {fillouts && fillouts.map((question) => {
                    return <div className={styles.question}>
                        <ul>
                            <li><b>{question.questionLabel + ": "}</b>
                                {question.questionAns}
                            </li>
                        </ul>
                    </div> 
                })}
            </div>
            <div><b>Reference images: </b></div>
            <div className={styles.images}>
                {order && order.referenceImages.map((refImgURL) => {
                    return <img className={styles.refImg} id={refImgURL + order.id} src={refImgURL}></img>
                } )}
            </div>
            <div className={styles.orderNotes}>
                <b>Order notes:</b>
                <br></br>
                <textarea placeholder="Order notes" name="" id="artistNotes" cols="30" rows="10" onChange={handleArtistNotesChange}></textarea>
            </div>
            <div className={styles.status}>
                <h4>Status:</h4>
                <ul>
                    <li><label><input type="radio" name="statusSelection" id="Not Started Yet" value="Not Started Yet" onChange={selectStatus}></input>Not Started Yet</label></li>
                    <li><label><input type="radio" name="statusSelection" id="WIP" value="WIP" onChange={selectStatus}></input>WIP</label></li>
                    <li><label><input type="radio" name="statusSelection" id="Paused" value="Paused" onChange={selectStatus}></input>Paused</label></li>
                    <li><label><input type="radio" name="statusSelection" id="Completed" value="Completed" onChange={selectStatus}></input>Completed</label></li>
                </ul>
            </div>

            <div className={styles.buttons}>
                <button className={styles.saveBtn} onClick={handleSave}>Save</button>
                <button className={styles.deleteBtn}>Delete</button>
                <button className={styles.editBtn}>Edit</button>
            </div>

        </div>
    )
}

export default OrderDetails;
