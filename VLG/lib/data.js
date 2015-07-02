if (Posts.find().count() === 0){
  now = new Date().getTime();
  Posts.insert({
    post: "This is a test post.",
    likes: 0,
    dislikes: 0,
    views: 0,
    postedOn: new Date(now),
    fbShares: 0,
    twitterShares: 0
  });
  Posts.insert({
    post: "This is test 2.",
    likes: 0,
    dislikes: 0,
    views: 0,
    postedOn: new Date(now),
    fbShares: 0,
    twitterShares: 0
  });
  Posts.insert({
    post: "This is test 3.",
    likes: 0,
    dislikes: 0,
    views: 0,
    postedOn: new Date(now),
    fbShares: 0,
    twitterShares: 0
  });
}
