import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import {connect} from 'react-redux'

import MainPage from './MainPage'
import PostDetail from './PostDetail'
import {
  initializeCategories,
  initializePosts,
  initializeComments
} from '../actions'

class App extends Component {
  componentDidMount(){
    console.log('componentDidMount')

    var myHeaders = { 'Authorization': 'esats server' }
    var myInit = { method: 'GET', headers: myHeaders }
    var api = 'http://localhost:5001'

    /*fetch(`${api}/posts/8xf0y6ziyjabvozdd253nd/comments`, myInit)
    .then(resp => resp.json())
    .then(responses => {
      console.log(responses)
    })*/

    fetch(`${api}/posts`, myInit)
    .then(res => res.json())
    .then(posts => {
      this.props.initializePosts(posts)
      posts.map((post) => {
        var allComments = []
        fetch(`${api}/posts/${post.id}/comments`, myInit)
        .then(resp => resp.json())
        .then(comments => {
          if (typeof comments !== 'undefined' && comments.length > 0) {
            comments.map((comment) => {
              allComments.push(comment)
            })
          }
          this.props.initializeComments(allComments)
        })
      })
    })

    //categories
    var newCategories
    fetch(`${api}/categories`, myInit)
    .then(res => res.json())
    .then(response => {
      let categories = response.categories
      categories.map(newCategory => {
        newCategories = {
          ...newCategories,
          [newCategory.name]: newCategory
        }
      })
      this.props.initializeCategories(newCategories)
    })
  }

  getAllURLs(){
    var urlArray = []
    urlArray.push(
      <Route exact path='/' key="main" render={({ history }) => (
        <MainPage categories={this.props.category} categoryFilter= {null}/>
      )}/>
    )
    for (let category in this.props.category){
      console.log(category)
      let url = `/${category}`
      console.log(url)
      urlArray.push(
        <Route exact path={url} key={category} render={({ history }) => (
          <MainPage categories={this.props.category} categoryFilter={category}/>
        )}/>
      )
    }
    console.log(urlArray)
    return urlArray
  }

  render() {
    var mainPage = this.getAllURLs()
    return (
      <div>
        {mainPage}
      </div>
    );
  }
}

function mapStateToProps({category, post, comment}) {
  return {
    category,
    post,
    comment
  }
}

function mapDispatchToProps(dispatch) {
  return {
    initializeCategories: (data) => dispatch(initializeCategories(data)),
    initializePosts: (posts) => dispatch(initializePosts(posts)),
    initializeComments: (allComments) => dispatch(initializeComments(allComments)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
