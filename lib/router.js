Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return [Meteor.subscribe('comments')]; }
});

Router.route('/', {
  name: 'postList'
});
Router.route('/submit', {name: 'createPost'});
Router.route('/posts/:_id', {
  name: 'postPage',
  waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
  },
  data: function() {
    return Posts.findOne(this.params._id);
  }
});
