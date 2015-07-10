Meteor.publish('posts', function() {
  var self = this, postHandle = null;

  var initializing = true;

  postHandle = Posts.find({}).observeChanges({
    added: function(id, post) {
      if (initializing){
          console.log('got a new post');
          self.added('posts', id, post);
      }
    },
    changed: function(id, fields) {
      self.changed('posts', id, fields);
    }
  });

  self.ready();
  initializing = false;
  self.onStop(function() { postHandle.stop(); });
});

Meteor.publish('comments', function(options){
  return Comments.find({});
});
