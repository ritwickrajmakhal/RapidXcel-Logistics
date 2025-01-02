import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal.js';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [registerModal, setRegisterModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  });
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.title_container}>
          <div className={styles.logo}>
            <img src="https://images.vexels.com/media/users/3/137615/isolated/svg/5af2a9cbd8cd93aa90889fbc05656cb5.svg" alt="logo" />
          </div>
          <div>
            <div className={styles.brand_title}>RapidXcel Logistics</div>

            <div className={styles.tagline}></div>
          </div>
        </div>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={() => { setRegisterModal(true) }} id="registerBtn">Sign In/Register</button>
          <button className={styles.button} onClick={() => { setLoginModal(true) }} id="loginBtn">Login</button>
        </div>
      </div>

      {registerModal && <RegisterModal enableRegisterModal={setRegisterModal} enableLoginModal={setLoginModal} />}
      {loginModal && <LoginModal enableLoginModal={setLoginModal} enableRegisterModal={setRegisterModal} />}
    </div>
  );
}

export default Home;
