Meteor.publish('posts', function(options) {
  var self = this, postHandle = null;

  var initializing = true;

  postHandle = Posts.find({}, options).observeChanges({
    added: function(id, post) {
      if (initializing){
          self.added('posts', id, post);
      } else {
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
