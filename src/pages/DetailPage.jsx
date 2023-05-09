import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArticle } from "../api/articles";
import { postComment, getComments, deleteComments } from "../api/comments";
import { useState } from "react";
import {
  WrapperTop,
  SecondWrapper,
  ArticleImage,
  ArticleBody,
  ArticleTitle,
  WrapperBottom,
  ArticleBottom,
  CommentInput,
  Button,
  PostComment,
  CommentWrapper,
  CommentContent,
  DeleteButtonWrapper,
} from "../redux/componants/detailPage/styles";
import { useQuery, useMutation, queryClient } from "react-query";

function DetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { isLoading, isError, data } = useQuery("getArticle", () =>
    getArticle(params.id)
  );
  const [commentContent, setCommentContent] = useState("");
  const { mutate } = useMutation((content) => postComment(params.id, content), {
    onSuccess: () => {
      setCommentContent("");
      queryClient.invalidateQueries(["getArticle", params.id]);
      queryClient.invalidateQueries(["getComments", params.id]);
    },
  });

  const {
    isLoading: isLoadingComments,
    isError: isErrorComments,
    data: comments,
    refetch: refetchComments,
  } = useQuery(["getComments", params.id], () => getComments(params.id));

  const handleDeleteComment = async (commentId) => {
    await deleteComments(commentId);
    refetchComments();
  };
  const handleSubmitComment = (e) => {
    e.preventDefault();
    mutate(commentContent);
    // ,

    // {
    // onSuccess: () => {
    setCommentContent("");
    // queryClient.invalidateQueries(["getArticle", params.id]);
    // queryClient.invalidateQueries(["getComments", params.id]);
    // },
    // }
    // );
  };
  if (isLoading || isLoadingComments) {
    return <div>로딩중입니다...</div>;
  }
  if (isError || isErrorComments) {
    return <div>오류가 발생했습니다.</div>;
  }

  return (
    <>
      <WrapperTop>
        <ArticleTitle>
          {data.category} / {data.title}
        </ArticleTitle>
        <SecondWrapper>
          <ArticleImage>
            <img src="" alt="Article" />
          </ArticleImage>
          <ArticleBody>
            <div>{data.content}</div>
          </ArticleBody>
        </SecondWrapper>
        <ArticleBottom>
          {/* <p style={{ marginLeft: "10px" }}>좋아요 수 {data.goodCount} </p> */}
          <p>&nbsp;작성 시간 {data.createdAt}</p>
          <p>작성자{data.nickname} </p>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "10px",
            }}
          >
            <Button
              style={{ marginRight: "10px" }}
              onClick={() => {
                navigate("/updatearticle");
              }}
            >
              수정
            </Button>
            <Button>삭제</Button>
          </div>
        </ArticleBottom>
      </WrapperTop>
      <WrapperBottom>
        <h2>댓글</h2>
        {/* 댓글 쓸 때마다 늘어나게 하기*/}
        <PostComment>
          {/* 댓 작성 공간 */}
          <p style={{ marginLeft: "10px" }}>지역 </p>
          <p style={{ marginLeft: "10px" }}>닉네임 </p>
          <CommentInput
            placeholder="&nbsp;내용을 입력해주세요."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
          ></CommentInput>
          <p style={{ marginRight: "20px" }}></p>
          <button
            type="submit"
            style={{ margin: "10px" }}
            onClick={handleSubmitComment}
          >
            작성
          </button>
        </PostComment>
        {comments &&
          comments.map((comment) => (
            <CommentWrapper key={comment.id}>
              {/* 댓글  작성자 정보 */}
              <p style={{ marginLeft: "10px" }}>지역 </p>
              <p style={{ marginLeft: "10px", flexGrow: 1 }}>닉네임 </p>
              {/* 댓글 내용 */}
              <CommentContent>&nbsp; {comment.content}</CommentContent>
              {/* 작성시간 */}
              <p style={{ marginRight: "20px" }}>{comment.createdAt}</p>
              {/* 삭제 버튼 */}
              <DeleteButtonWrapper>
                <button
                  style={{ margin: "10px" }}
                  onClick={() => {
                    handleDeleteComment(comment.id);
                    // console.log(comment.id);
                  }}
                >
                  삭제
                </button>
              </DeleteButtonWrapper>
            </CommentWrapper>
          ))}
      </WrapperBottom>
    </>
  );
}

export default DetailPage;
