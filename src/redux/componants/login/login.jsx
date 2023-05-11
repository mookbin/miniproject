import React, { useState } from "react";
import {
  InputStyle,
  InputWrapper,
  Label,
  Titlestyle,
  Wrapbox,
  Backgroundbox,
} from "./styles";
import Inputs from "../inputs/inputs";
import Buttons from "../buttons/Buttons";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";
import { loginUsers } from "../../../api/users";
import Navbar from "../navbar/Navbar";
import { useCookies } from "react-cookie";
// 깃터짐 테스트용 주석

function Loginbox(props) {
  const navigate = useNavigate();

  //입력값을 받을 state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //yarn add react-cookie
  const [cookies, setCookies, removeCookie] = useCookies(["authorization"]);

  const queryClient = useQueryClient();

  const mutation = useMutation(loginUsers, {
    onSuccess: (tokenValue) => {
      queryClient.invalidateQueries("users");
      console.log("로그인이 완료되었습니다");
      setCookies("authorization", tokenValue, { path: "/" });
      navigate("/");
    },
    onError: (error) => {
      if (error.response.status !== null) {
        alert(error.response.data.errorMessage);
      }
    },
  });


  // const { isLoading, isError, data } = useQuery("users", getUsers)

  // if (isLoading) {
  //   return <h1>로딩중입니다...!</h1>
  // }

  // if (isError) {
  //   return <h1>오류가 발생하였습니다...!</h1>
  // }

  // const usernamecheck = data.find(item => item.username === username)
  // const userpasswordcheck = data.find(item => item.password === password)

  // 에러 메시지 발생 함수
  const getErrorMsg = (errorCode) => {
    switch (errorCode) {
      case "01":
        return alert(`이메일을 입력해주세요.`);
      case "02":
        return alert(`비밀번호를 입력해주세요.`);
      case "03":
        return alert(`가입되지 않은 이메일 입니다.`);
      case "04":
        return alert(`비밀번호가 일치하지 않습니다.`);
      default:
        return `시스템 내부 오류가 발생하였습니다.`;
    }
  };

  // username 변경을 감지하는 함수
  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  // password 변경을 감지하는 함수
  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  // form 태그 내부에서의 submit이 실행된 경우 호출되는 함수
  const handleSubmitButtonClick = (event) => {
    // submit의 고유 기능인, 새로고침(refresh)을 막아주는 역함
    event.preventDefault();

    // 제목과 내용이 모두 존재해야만 정상처리(하나라도 없는 경우 오류 발생)
    // "01" : 필수 입력값 검증 실패 안내
    if (!username) {
      return getErrorMsg("01");
    }
    if (!password) {
      return getErrorMsg("02");
    }

    // if (!usernamecheck) {
    //   return getErrorMsg("03");
    // }

    // if (usernamecheck && !userpasswordcheck) {
    //   return getErrorMsg("04");
    // }

    // if (usernamecheck && userpasswordcheck) {
    //   return
    // }

    const inUsers = {
      username,
      password,
    };

    //로그인을 위한 mutation 메소드
    mutation.mutate(inUsers);
    setUsername("");
    setPassword("");
  };

  return (
    <>
      <Navbar isActive={true} />
      <Backgroundbox>
        {/* 로그인 */}
        <form onSubmit={handleSubmitButtonClick}>
          <Wrapbox>
            <Titlestyle>{props.title}</Titlestyle>
            <div>
              {/* ID input */}
              <Inputs
                value={username}
                onChange={changeUsername}
                type="email"
                label="ID"
                widthinput="200px"
                width="210px"
                height="30px"
                marginbottom="30px"
                maxLength="30"
              />
              {/* PW input */}
              <Inputs
                value={password}
                onChange={changePassword}
                type="password"
                label="PW"
                widthinput="200px"
                width="210px"
                height="30px"
                marginbottom="30px"
                maxLength="20"
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Buttons
                type="button"
                backgroundcolor="darkgray"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                회원가입
              </Buttons>
              <Buttons backgroundcolor="darkgray" type="submit">
                로그인
              </Buttons>
            </div>
          </Wrapbox>
        </form>
      </Backgroundbox>
    </>
  );
}

export default Loginbox;
