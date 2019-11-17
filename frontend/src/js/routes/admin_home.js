import React, {useState} from 'react'
import NavBar from "../navbar";
import {getClubs} from "../cloud";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import db from "../../firebase.js";

function get_user_uid() {
    let uid = 'none';
    db.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser) {
            uid = firebaseUser.uid;
            console.log('firebaseUser', firebaseUser);
        }
    });

    return uid;
}

function check_login_type() {
    return "admin";
    let user_provider = 'none';
    db.auth().onAuthStateChanged(firebaseUser => {
            user_provider = firebaseUser.providerId;
            console.log('firebaseUser', firebaseUser);
        }
    );

    switch (user_provider) {
        case "Google":
            return "user";
        case "none":
            throw new Error('user could not be authenticated');

        default:
            return "admin";
    }
}

class AdminHome extends React.Component {

	closeInfo() {
		this.setState({
			editInfo: false
		})
	}

	closeTag() {
		this.setState({
			editTag: false
		})
	}

	closeEvent() {
		this.setState({
			editEvent: false
		})
	}

	handleEditInfo() {
		this.setState({editInfo: true})
	}

	handleEditTag() {
		this.setState({editTag: true})
	}

	handleEditEvent() {
		this.setState({editEvent: true})
	}

    render() {

        if (check_login_type() === 'user') {
            this.view_switch_login();
        }

        if (this.state.orgs === undefined) {
            this.state = {
                orgs: []
            };
        }

        let club = this.get_club_data();

        if (club === undefined)
            club = {name: 'YEET MEATY', desc: 'FUCK THE BACKEND'};

		
        return (
            <div>
                {/*start the rest of the page*/}
                <main className='mt-5 pt-5'>
                    <h2 className="h1 text-center mb-5" >{club.name}</h2>
                    <h5 className="text-center mb-5">{club.desc}</h5>

					<Button onClick={this.handleEditInfo}>Edit Club</Button>
					<Modal
					size="lg"
					show={this.state.editInfo}
					onHide={this.closeInfo}
					aria-labelledby="example-modal-sizes-title-lg"
					>
						<Modal.Header closeButton>
						<Modal.Title id="example-modal-sizes-title-lg">
							Club Info
						</Modal.Title>
						</Modal.Header>
 
						<Modal.Body>
						<Form.Group controlId="formName">
							<Form.Label>Club Name</Form.Label>
							<Form.Control type="name" placeholder="Enter Club Name" />
						</Form.Group>
						<Form.Group controlId="formImage">
							<Form.Label>Image URL</Form.Label>
							<Form.Control type="name" placeholder="Enter Image URL" />
						</Form.Group>
						<Form.Group controlId="formName">
							<Form.Label>Description</Form.Label>
							<Form.Control type="name" placeholder="Enter Club Description" />
						</Form.Group>
							<Button variant="primary" type="submit" >
							Submit
							</Button>
						</Modal.Body>
					</Modal>

					<Button onClick={this.handleEditTag}>Edit Tag</Button>
					<Modal
					size="sm"
					show={this.state.editTag}
					onHide={this.closeTag}
					aria-labelledby="example-modal-sizes-title-sm"
					>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
								Tag Info
							</Modal.Title>
						</Modal.Header>
        
						<Modal.Body>
							<Form.Group controlId="formName">
								<Form.Label>Tag Name</Form.Label>
								<Form.Control type="name" placeholder="Enter Tag Name" />
							</Form.Group>
							<Button variant="primary" type="submit" >
								Submit
							</Button>
						 </Modal.Body>
					</Modal>

					<Button onClick={this.handleEditEvent}>Edit Event</Button>
						<Modal
						size="lg"
						show={this.state.editEvent}
						onHide={this.closeEvent}
						aria-labelledby="example-modal-sizes-title-lg"
						>
							<Modal.Header closeButton>
								<Modal.Title id="example-modal-sizes-title-lg">
									Event Info
								</Modal.Title>
							</Modal.Header>
        
							<Modal.Body>
								<Form.Group controlId="formName">
									<Form.Label>Event Name</Form.Label>
									<Form.Control type="name" placeholder="Enter Event Name" />
								</Form.Group>
  
								<Form.Group controlId="formPlaceTime">
									<Form.Label>Place/Time</Form.Label>
									<Form.Control type="place/time" placeholder="Enter Place/Time" />
								</Form.Group>
	  
								<Form.Group controlId="formDetails">
									<Form.Label>Details</Form.Label>
									<Form.Control type="details" placeholder="Enter Details" />
								</Form.Group>
								<Button variant="primary" type="submit" >
									Submit
								</Button>
							</Modal.Body>        
					  </Modal>

                </main>
            </div>
        );
    }

    /***
     * Finds the club from the state of the component
     * @returns {*}
     */
    get_club_data = () => {
        let uid = get_user_uid();
        return this.state.orgs[uid];
    };

    /**
     * If the user is not authorized as an admin, then we just take them to the home page.
     */
    view_switch_login = () => {
        console.log('WARN: Unauthorized user tried to access admin page.');
        this.props.history.push('/home');
    };

    constructor(props) {
        super(props);
        console.log('AdminHome element created with props', props);

        this.state = {
            orgs: [],
			editInfo: false,
			editTag: false,
			editEvent: false
        };

        // get data from firebase
        getClubs().then((json) => {
            this.setState({orgs: json.clubs});
        });

        if (this.state.orgs === undefined) {
            this.state = {
                orgs: []
            };
        }

		this.closeInfo = this.closeInfo.bind(this);
		this.closeTag = this.closeTag.bind(this);
		this.closeEvent = this.closeEvent.bind(this);
		this.handleEditInfo = this.handleEditInfo.bind(this);
		this.handleEditTag = this.handleEditTag.bind(this);
		this.handleEditEvent = this.handleEditEvent.bind(this);
    };
}

export default AdminHome;