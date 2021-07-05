import React, { useState } from "react";
const AddCommentsForms = ( { articleName, setArticleInfo}) => {
    
    const [ username, setUsername ] = useState('');
    const [ commentText, setCommentText ] = useState('');

    const addComment = async () => {
        const result = await fetch(`/api/articles/${articleName}/comment`, {
            method:'post',
            body: JSON.stringify({ username, text: commentText}),
            headers: {
                'Content-type':'application/json',
            }
        });
        const body = await result.json();
        setArticleInfo(body);
        setUsername('');
        setCommentText('');
    }

    return(
    <div>
        <h3> Add a comment</h3>
        <label>
            Name:
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)}/>
        </label>
       <label>
            Comment:
            <textarea rows="4" cols="50" value={commentText} onChange={(event) => setCommentText(event.target.value)}/>
       </label>
        <button onClick = { () => addComment()}>Add Comment</button>
    </div>
)};

export default AddCommentsForms;