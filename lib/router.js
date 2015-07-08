Router.configure({
  layoutTemplate: 'layout',
  waitOn: function() { return [Meteor.subscribe('posts'), Meteor.subscribe('comments')]; }
});

Router.route('/', {name: 'postList'});
Router.route('/submit', {name: 'createPost'});
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});
