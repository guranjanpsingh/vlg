Router.configure({
  layoutTemplate: 'layout',
  waitOn: function() { return [Meteor.subscribe('comments')]; }
});

Router.route('/', {
  name: 'postList',
  subscriptions: function(){
    this.postsSub = Meteor.subscribe('posts');
  },
  data: function() {
    return {
        posts: Posts.find({}, {sort: {postedOn: -1}}),
        ready: this.postsSub.ready
      }
    }
});
Router.route('/submit', {name: 'createPost'});
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});
