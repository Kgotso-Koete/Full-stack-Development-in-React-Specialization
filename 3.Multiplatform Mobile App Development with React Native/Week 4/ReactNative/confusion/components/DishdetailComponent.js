import React, { Component } from 'react';
import { DISHES } from '../shared/dishes';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { COMMENTS } from '../shared/comments';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

     
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
        <Animatable.View 
        animation="fadeInUp" 
        duration={2000} 
        delay={1000}
        >

            <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
            </Card>

        </Animatable.View>
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

        const handleViewRef = ref => this.view = ref;
 
        const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
            if ( dx < -200 )
                return true;
            else
                return false;
        }

        const recognizeComment = ({ moveX, moveY, dx, dy }) => {
            if ( dx > 200 )
                return true;
            else
                return false;
        }
             
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => {
                return true;
            }, 
            onPanResponderGrant: () => {this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
            onPanResponderEnd: (e, gestureState) => {
                console.log("pan responder end", gestureState);
                if (recognizeDrag(gestureState))
                {
                    Alert.alert(
                        'Add Favorite',
                        'Are you sure you wish to add ' + dish.name + ' to favorite?',
                        [
                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                        {text: 'OK', onPress: () => {this.props.favorite ? console.log('Already favorite') : this.props.onPress()}},
                        ],
                        { cancelable: false }
                    );
                }

                if (recognizeComment(gestureState))
                {
                    this.toggleModal();
                }

                return true;
            }
        })

        const shareDish = (title, message, url) => {
            Share.share({
                title: title,
                message: title + ': ' + message + ' ' + url,
                url: url
            },{
                dialogTitle: 'Share ' + title
            })
        }
    
        if (dish != null) {

            return(
                <Animatable.View 
                animation="fadeInDown" 
                duration={2000} 
                delay={1000} 
                ref={handleViewRef} 
                {...panResponder.panHandlers}
                >
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
                            <Icon
                                raised
                                reverse 
                                name='share'
                                type='font-awesome'
                                color='#51D2A8'
                                style={styles.cardItem}
                                onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} 
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
                </Animatable.View>
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