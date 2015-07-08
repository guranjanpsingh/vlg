Template.post.helpers({
  posted: function(){
    return moment(this.postedOn).fromNow();
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.likedBy, userId)) {
      return '';
    } else {
      return 'voted';
    }
  },
  downvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.dislikedBy, userId)) {
      return '';
    } else {
      return 'voted';
    }
  }
});
Template.post.events({
  'click .voteUp': function(e){
    e.preventDefault;
    var post = Posts.findOne(this._id);
    if (!Meteor.user()){
      return throwError('Please log in to vote.');
    }
    if (_.include(post.dislikedBy, Meteor.userId())){
      Posts.update(this._id,
        {
          $inc: {dislikes: -1},
          $pull: {dislikedBy: Meteor.userId()}
        }
      )
    }
    if (_.include(post.likedBy, Meteor.userId())){
      Posts.update(this._id,
        {
          $pull: {likedBy: Meteor.userId()},
          $inc: {likes: -1}
        }
      )
    }
    else{
      Posts.update(this._id,
        {
          $addToSet: {likedBy: Meteor.userId()},
          $inc: {likes: 1}
        }
      )
    }
  },
  'click .voteDown': function(e){
    e.preventDefault;
    var post = Posts.findOne(this._id);
    if (!Meteor.user()){
      return throwError('Please log in to vote.');
    }
    if (_.include(post.likedBy, Meteor.userId())){
      Posts.update(this._id,
        {
          $inc: {likes: -1},
          $pull: {likedBy: Meteor.userId()}
        }
      )
    }
    if (_.include(post.dislikedBy, Meteor.userId())){
      Posts.update(this._id,
        {
          $pull: {dislikedBy: Meteor.userId()},
          $inc: {dislikes: -1}
        }
      )
    }
    else{
      Posts.update(this._id,
        {
          $addToSet: {dislikedBy: Meteor.userId()},
          $inc: {dislikes: 1}
        }
      )
    }
  }
})
