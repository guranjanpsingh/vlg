Meteor.publish('posts', function(limit) {
  return Posts.find({}, {sort: {postedOn: -1}, limit:limit});
});

Meteor.publish('comments', function(options){
  return Comments.find({});
});

Meteor.publish('singlePost', function(id) {
  check(id, String)
  return Posts.find(id);
});
