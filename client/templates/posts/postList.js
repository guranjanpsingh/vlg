Template.postList.helpers({
  posts: function(){
    return Posts.find({}, {sort: {postedOn: -1}});
  }
});

Posts.find().observe({
  added: function(){
    console.log('hello');
  }
})
