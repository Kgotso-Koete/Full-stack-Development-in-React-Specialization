import React, { Component } from 'react';
import { Media } from 'reactstrap';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Card, CardImg, CardImgOverlay, CardText, CardBody, CardTitle } from 'reactstrap';
 
class DishdetailComponent extends Component {
 
    constructor(props) {
        super(props);
        this.state = {   
        } 
    }
    renderDish(dish) {
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

    renderComments(dish){
    
        if (dish != null)
        {
            const comments = dish.comments.map((comment) => {
                return (
                <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit'  }).format(new Date(comment.date))}</p>
                </li>
                );
            });
            return (
                    <div>
                        <h4>Comments</h4>
                        <ul className="list-unstyled">
                            {comments}
                        </ul>
                    </div>
                    ); 
        } 
        else
        {
            return( <div></div>);
        }
            
    }
   
    render() {
        const dish = this.props.selectedDish;
        
        return(
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    {this.renderDish(dish)}
                </div>
                <div className="col-12 col-md-5 m-1 text-left">
                    {this.renderComments(dish)}
                </div>
            </div>
        );
    }
     
}

export default DishdetailComponent ;