import React, { Component } from 'react';
import { DISHES } from '../shared/dishes';
import { Text, View, ScrollView, FlatList, StyleSheet, Modal, Button } from 'react-native';
import { COMMENTS } from '../shared/comments';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { postComment } from '../redux/ActionCreators';

     
const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: []
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    dishId={dishId}
                    handleComment={(dishId, rating, author, comment) => this.props.postComment(dishId, rating, author, comment)} 
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
         
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                imageSize={20}
                readonly
                startingValue={item.rating}
                style={[styles.rating]}
                />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class RenderDish extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dishId:null,
            showModal: false,
            author:"",
            comment:"",
            rating:null
        };
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
        
    }

    render(){
 
    const dish = this.props.dish;
    
    if (dish != null) {

        return(
            <Card
            featuredTitle={dish.name}
            image={{uri: baseUrl + dish.image}}>
                <Text style={{margin: 10}}>
                    {dish.description}
                </Text>
                <View style={[styles.Icons]}>
                    <Icon
                        raised
                        reverse
                        name={ this.props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => this.props.favorite ? console.log('Already favorite') : this.props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name={ 'pencil'}
                        type='font-awesome'
                        color='#512DA8'
                        onPress = {() =>{this.toggleModal()}}
                    />
                    <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal} 
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal()}
                    > 
                        <View style = {styles.modal}>
                            <Rating 
                            showRating 
                            fractions="{0}" 
                            startingValue="{5}"
                            onFinishRating={(rating) => {this.setState({rating: rating})}} 
                            />
                            <Input 
                            placeholder='Author'
                            leftIconContainerStyle={{ marginRight: 20 }} 
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={(author) => {this.setState({author: author})}} 
                            /> 
                            <Input 
                            placeholder='Comment'
                            leftIconContainerStyle={{ marginRight: 20 }} 
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={(comment) => {this.setState({comment: comment})}} 
                            />
                            <Text h1></Text>
                            <Button   
                                onPress = {() =>{this.toggleModal(); this.props.handleComment(this.props.dishId, this.state.rating, this.state.author, this.state.comment); }}
                                color="#512DA8"
                                title="Submit" 
                            />
                            <Text h1></Text> 
                            <Button 
                                onPress = {() =>{this.toggleModal()}} 
                                color="#808080"
                                title="Cancel" 
                            />
                        
                            </View>
                    </Modal>
                </View> 
            </Card>
        );
    }
    else {
        return(<View></View>);
    }
    }
}

const styles = StyleSheet.create({
    Icons: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row'
      },
    modal: {
        justifyContent: 'center',
        margin: 20
       },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
       },
    modalText: {
        fontSize: 18,
        margin: 10
       },
    rating: {
        flex: 1,
        flexDirection: 'row'
       }  
  });
 
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail); 