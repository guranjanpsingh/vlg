Template.postList.helpers({
  posts: function(){
    return Posts.find({}, {sort: {postedOn: -1}});
  }
});
