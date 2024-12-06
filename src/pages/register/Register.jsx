import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerService } from "../../services/auth.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import User from "../../model/User"
import "./Register.css"
const Register =() =>{
   const [user, setUser] = useState(new User('','',''));
   const [loading, setLoading] = useState(false);
   const [submitted, setSubmitted] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const currentUser = useSelector((state) => state.user); //현재상태의 유저를 들고온다
   const navigate = useNavigate();

   useEffect(() =>{ // 컴포넌트가 새로 생성될때 영향을 준다 변화가있을때마다 이프작업이 수행된다.
    if (currentUser?.id){  //커런트에 유저가 존재한다면 프로필로 넘어가라
        navigate('/profile');
    }
   },[]);
   const handleChange = (e) => { //이벤트 타켓에 발생하는 네임, 밸류값을 계속업데이트
    const {name, value} = e.target;
    console.log(name, value);
    setUser((prevState)=>{
        return {
            ...prevState,
            [name]:value,
        };
    });
   };
   const handleRegister = (e) =>{ 
    e.preventDefault();
    setSubmitted(true); //트루

    if(!user.username || !user.password || !user.name) { //만얀에 이프조건이 널이라면 
        return;
    }

    setLoading(true);  

    registerService(user) //import { registerService } from "../../services/auth.service";
    .then((ok) =>{ 
        navigate("/login")
    })
    .catch((error)=>{ 
        console.log(error);
        if(error?.respones?.status ===409){ 
            setErrorMessage("중복된 username 입니다.")
        }else{
            setErrorMessage("예상하지 못한 에러가 발생했습니다.")
        }
        setLoading(false);
    });
   }
   return ( //리턴이 보여지는 화면부분 리턴안에 엘리먼트는 하나만 올수있다 
    <div className="container mt-5">
        <div className="card ms-auto me-auto p-3 shadow-lg custom-card" >
        <FontAwesomeIcon icon={faUserCircle} className="ms-auto me-auto user-icon" />
        {errorMessage && <div className="alert-danger">{errorMessage}</div>}

        <form onSubmit={handleRegister} noValidate className={submitted ? 'was-validated':''}>
    
            <div className="form-group mb-2">
                <label htmlFor="name">이 름</label>
                <input type="text" name="name" className="form-control"
                placeholder="name" value={user.name} onChange={handleChange} required />
                <div className="invalid-feedback">이름을 입력해주세요</div>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="username">유저네임</label>
                <input type="text" name="username" className="form-control"
                placeholder="username" value={user.username} onChange={handleChange} required />
                <div className="invalid-feedback">유저네임을 입력해주세요</div>
            </div>
            <div className="form-group mb-2">
                <label htmlFor="password">패스워드</label>
                <input type="password" name="password" className="form-control"
                placeholder="password" value={user.password} onChange={handleChange} required />
                <div className="invalid-feedback">패스워드를 입력해주세요</div>
            </div>
            <button className="btn btn-info text-white w-100 mt-3" disabled={loading}>
                가입하기
            </button>
        </form>
    </div>
    </div>
   )
}
export default Register;