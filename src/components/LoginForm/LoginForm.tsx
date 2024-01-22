import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hook';
import { fetchAuthorization } from '../../store/api';
import { fetchAccountInfo } from '../../store/slice/accountInfoSlice';
import { ButtonLoader } from '../Loader/ButtonLoader';
import type { IUserData } from '../../types/data';

import styles from './LoginForm.module.scss';
import googleIcon from '../../assets/icons/google.svg';
import fbIcon from '../../assets/icons/fb.svg';
import yaIcon from '../../assets/icons/yandex.svg';
import lockIcon from '../../assets/images/login__lock-img.svg';


export const LoginForm: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [isValue, setIsValue] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorLogin, setErrorLogin] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const userdata: IUserData = {
        login: login.trim(),
        password: password.trim(),
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (login.trim() && password.trim()) {
            setLoading(true);
            fetchAuthorization(userdata)
            .then((response) => {
                localStorage.setItem('token', response.accessToken);
                dispatch(fetchAccountInfo(response.accessToken));
                setErrorLogin(false);
                setErrorPassword(false);
                setLoading(false);
                navigate("/");
            })
            .catch((error) => {
                console.error(error);
                setErrorLogin(true);
                setErrorPassword(true);
                setLoading(false);
            })

            setLogin('');
            setPassword('');
        }
    }

    useEffect(() => {
        if (login.trim()) setErrorLogin(false);
        if (password.trim()) setErrorPassword(false);

        if (login.trim() && password.trim()) {
            setIsValue(true);
        } else {
            setIsValue(false);
        }
    }, [login, password])
    

    return (
        <div className={styles.wrapper}>

            <img src={lockIcon} alt='' className={styles.lock__icon} />

            <div className={styles.content__wrapper}>
                <div className={styles.nav}>
                    <span className={styles.nav__item_active}>Войти</span>
                    <span className={styles.nav__item}>Зарегистрироваться</span>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.form__text__container}>
                        <h3>Логин или номер телефона: sf_student1</h3>
                        <input 
                            type='text' 
                            autoComplete='off'
                            className={errorLogin ? styles.error__input : styles.input}
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    <div className={styles.error__container}>
                        {errorLogin && <span>Введите корректные данные</span>}
                    </div>

                    <div className={styles.form__text__container}>
                        <h3>Пароль: 4i2385j</h3>
                        <input 
                            type='password' 
                            autoComplete='off'
                            className={errorPassword ? styles.error__input : styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.error__container}>
                        {errorPassword && <span>Неправильный пароль</span>}
                    </div>

                    <button 
                        type='submit' 
                        className={isValue ? styles.button__active : styles.button}
                    >
                        {loading ? <ButtonLoader /> : 'Войти'}
                    </button>
                    <span className={styles.restore_password}>Восстановить пароль</span>
                </form>

                <div className={styles.icons__wrapper}>
                    <span className={styles.icons__title}>Войти через:</span>
                    <div className={styles.icons__list}>
                        <img src={googleIcon} alt='' />
                        <img src={fbIcon} alt='' />
                        <img src={yaIcon} alt='' />
                    </div>
                </div>

            </div>

        </div>
    )
}