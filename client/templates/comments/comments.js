Template.comment.helpers({
  postedRelative: function(){
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
Template.comment.events({
  'click .voteUpComment': function(e){
    e.preventDefault;
    var comment = Comments.findOne(this._id);
    if (!Meteor.user()){
      return throwError('Please log in to vote.');
    }
    if (_.include(comment.dislikedBy, Meteor.userId())){
      Comments.update(this._id,
        {
          $inc: {dislikes: -1},
          $pull: {dislikedBy: Meteor.userId()}
        }
      )
    }
    if (_.include(comment.likedBy, Meteor.userId())){
      Comments.update(this._id,
        {
          $pull: {likedBy: Meteor.userId()},
          $inc: {likes: -1}
        }
      )
    }
    else{
      Comments.update(this._id,
        {
          $addToSet: {likedBy: Meteor.userId()},
          $inc: {likes: 1}
        }
      )
    }
  },
  'click .voteDownComment': function(e){
    e.preventDefault;
    var comment = Comments.findOne(this._id);
    if (!Meteor.user()){
      return throwError('Please log in to vote.');
    }
    if (_.include(comment.likedBy, Meteor.userId())){
      Comments.update(this._id,
        {
          $inc: {likes: -1},
          $pull: {likedBy: Meteor.userId()}
        }
      )
    }
    if (_.include(comment.dislikedBy, Meteor.userId())){
      Comments.update(this._id,
        {
          $pull: {dislikedBy: Meteor.userId()},
          $inc: {dislikes: -1}
        }
      )
    }
    else{
      Comments.update(this._id,
        {
          $addToSet: {dislikedBy: Meteor.userId()},
          $inc: {dislikes: 1}
        }
      )
    }
  }
});
