const parserRss = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data.data.contents, 'text/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    const error = new Error('parseError');
    error.isParsingError = true;
    throw error;
  }
  console.log(doc);
  const titleFeed = doc.querySelector('title');
  const descriptionFeed = doc.querySelector('description');
  const feedLink = doc.querySelector('link');
  const feed = {
    title: titleFeed.textContent,
    description: descriptionFeed.textContent,
    link: feedLink,
  };
  const postList = [...doc.querySelectorAll('item')];
  const posts = postList.map((post) => {
    const title = post.querySelector('title').textContent;
    const description = post.querySelector('description').textContent;
    const link = post.querySelector('link').textContent;
    return {
      title,
      description,
      link,
    };
  });
  return {
    feed,
    posts,
  };
};

export default parserRss;
