import React from "react";
import { Link } from "react-router-dom";

const ArticlesList = ({ articles }) => {
  return (
    <>
      {articles.map((article, key) => (
        <Link key={key} to={`/article/${article.name}`}>
          <h3 key={key}>{article.title}</h3>
          <p>{article.content[0].substring(0, 5)}...</p>
        </Link>
      ))}
    </>
  );
};

export default ArticlesList;
