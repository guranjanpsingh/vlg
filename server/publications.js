Meteor.publish('posts', function(options) {
  return Posts.find({}, options);
});

Meteor.publish('comments', function(options){
  return Comments.find({});
});

Meteor.publish('singlePost', function(id) {
  check(id, String)
  return Posts.find(id);
});
