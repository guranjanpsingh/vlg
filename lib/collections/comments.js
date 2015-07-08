var commentsSchema = new SimpleSchema ({
  comment: {
    type: String,
    max: 2000
  },
  postID: {
    type: String
  },
  postedOn: {
    type: Date,
      autoValue: function(){
        if (this.isInsert) {
          return new Date();
        }
      },
    denyUpdate: true

  },
  user: {
    type: String
  },
  likes: {
    type: Number
  },
  dislikes: {
    type: Number
  },
  likedBy: {
    type: [String],
    optional: true
  },
  dislikedBy: {
    type: [String],
    optional: true
  },
});

Comments = new Mongo.Collection('comments');

Comments.allow({
  insert: function(){
    return true;
  }
});
Comments.allow({
  update: function(){
      return Meteor.user();
  }
})

Comments.attachSchema(commentsSchema);
