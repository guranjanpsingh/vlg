Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return [Meteor.subscribe('comments')]; }
});

Router.route('/', {
  name: 'postList',
  subscriptions: function(){
    Session.setDefault("limit", 15);
    this.postsSub = Meteor.subscribe('posts', {sort: {postedOn: -1}, limit: Session.get("limit")});
  },
  data: function() {
    Session.setDefault("limit", 15);
    return {
        morePosts: Posts.find().count() === Session.get("limit"),
        posts: Posts.find({}, {sort: {postedOn: -1}, limit: Session.get("limit")}),
        ready: this.postsSub.ready
      }
  }
});
Router.route('/submit', {name: 'createPost'});
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});
