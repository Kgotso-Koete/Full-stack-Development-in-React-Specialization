import React, { Component } from 'react';
import { Media } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Card, CardImg, CardText, CardBody, CardTitle, CardImgOverlay, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Button, Modal, ModalHeader, ModalBody,Label, Row, Col} from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
 

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
 
class DishDetail extends Component{

    render() {
 
        const RenderDish = ({dish}) =>
        {

            if (dish != null)
            {
                return(
                    <Card>
                        <CardImg top src={dish.image} alt={dish.name} />
                        <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card> 
                );
            }
            else
            {
                return( <div></div>);
            }
        }

        const RenderComments = ({dish_comments}) =>
        {
            if (dish_comments != null)
            {
                const comments = dish_comments.map((comment) => {
                    return (
                    <li key={comment.id}>
                        <p>{comment.comment}</p>
                        <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                    </li>
                    );
                });
                return (
                        <div>
                            <h4>Comments</h4>
                            <ul className="list-unstyled">
                                {comments}
                                <CommentForm />
                            </ul>
                        </div>
                        ); 
            } 
            else
            {
                return( <div></div>);
            }
                
        }

        class CommentForm extends Component
        {
            constructor(props){
                super(props);
                this.state = {
                    isModalOpen: false
                };
                this.toggleModal = this.toggleModal.bind(this);
            }
          
            toggleModal() {
                this.setState({
                isModalOpen: !this.state.isModalOpen
                });
            }
        
            handleSubmit(values) {
                console.log('Current State is: ' + JSON.stringify(values));
                alert('Current State is: ' + JSON.stringify(values));
                //event.preventDefault();
            }

            render ()
            { 
                return(
                    <div>
                        <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
                        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                            <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                            <ModalBody> 
                                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                    <Row className="form-group">
                                        <Label htmlFor="author" md={12}>Rating</Label>
                                        <Col md={12}>
                                            <Control.select model=".rating" name="rating"
                                                className="form-control">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Control.select>
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Label htmlFor="author" md={12}>Your Name</Label>
                                        <Col md={12}>
                                            <Control.text model=".author" id="author" name="author"
                                                placeholder="Your Name"
                                                className="form-control"
                                                validators={{minLength: minLength(3), maxLength: maxLength(15)}}
                                                    />
                                            <Errors
                                                className="text-danger"
                                                model=".author"
                                                show="touched"
                                                messages={{
                                                    required: 'Required',
                                                    minLength: 'Must be greater than 2 characters',
                                                    maxLength: 'Must be 15 characters or less'
                                                }}
                                                />
                                        </Col>
                                    </Row> 
                                    <Row className="form-group">
                                        <Label htmlFor="comment" md={12}>Comment</Label>
                                        <Col md={12}>
                                            <Control.textarea model=".comment" id="comment" name="comment"
                                                rows="6"
                                                className="form-control" />
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Col md={12}>
                                            <Button type="submit" color="primary">
                                            Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </LocalForm>
                            </ModalBody>
                        </Modal>
                    </div>
                );
            }
        }
        
        
        return(
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{this.props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{this.props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row text-left">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={this.props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments dish_comments={this.props.comments} />
                    </div>
                </div>
            </div>
        );
    } 
}


export default DishDetail ;