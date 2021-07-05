import React from "react";

const UpvotesSections = ({ articleName, upvotes, setArticleInfo}) => {

    const upvoteArticle = async () => {
        const result = await fetch(`/api/articles/${articleName}/upvote`, {
            method:'post',
        });

        const body = await result.json();
        setArticleInfo(body);
    } 

    return ( 
        <div>
            <button onClick = { () => upvoteArticle()} >Add Upvote</button>
            <p>This post has been upvoted { upvotes }</p>
        </div>
    );
}


export default UpvotesSections;