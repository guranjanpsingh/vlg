Meteor.publish('posts', function(options){
  return Posts.find({});
});

Meteor.publish('comments', function(options){
  return Comments.find({});
});
