var postSchema = new SimpleSchema ({
  post: {
    type: String,
    max: 2000
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
  commentsCount: {
    type: Number
  },
  postedBy: {
    type: String,
    optional: true
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
  views: {
    type: Number
  },
  fb_shares: {
    type: Number
  },
  tweets: {
    type: Number
  }
});

Posts = new Mongo.Collection('posts');

Posts.allow({
  insert: function(){
    return true;
  },
  update: function(){
      return true;
  }
})

Posts.attachSchema(postSchema);
