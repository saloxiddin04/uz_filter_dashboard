import React, {useEffect, useState} from 'react';
import {Button, Header, Input} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {useStateContext} from "../../contexts/ContextProvider";
import {toast} from "react-toastify";
import instance from "../../API";
import {getUserDetail, setUser} from "../../redux/slices/auth/authSlice";

const Profile = () => {
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.user);
  const {currentColor} = useStateContext();
  
  const [first_name, setFirstName] = useState(null)
  const [last_name, setLastName] = useState(null)
  const [email, setEmail] = useState(null)
  
  useEffect(() => {
    setFirstName(user?.first_name)
    setLastName(user?.last_name)
    setEmail(user?.email)
  }, [user]);
  
  const updateProfile = async () => {
    if (!first_name || !last_name || !email) return toast.error('All inputs required')
    
    try {
      await instance.patch('user/update', {first_name, last_name, email}).then((response) => {
        if (response.status === 200) {
          dispatch(getUserDetail()).then(({payload}) => {
            if (payload) {
              dispatch(setUser(payload))
              toast.success('Updated successfully!')
            }
          })
        }
      })
    } catch (e) {
      return e;
    }
  }

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 dark:bg-secondary-dark-bg bg-white rounded">
      <Header category="Страница" title="Профил"/>
      <div className="relative container overflow-x-auto shadow-md sm:rounded">
        <div className={'flex justify-between items-center flex-wrap gap-4 md:px-4 md:py-4'}>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Имя'}
              label="Имя"
              value={first_name || ''}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Фамилия'}
              label="Фамилия"
              value={last_name || ''}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Телефон номер'}
              label="Телефон номер"
              value={user?.phone_number || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'email'}
              placeholder={'Емаил'}
              label="Емаил"
              value={email || ''}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'email'}
              placeholder={'Рол'}
              label="Рол"
              value={user?.user_roles || ''}
              disabled={true}
            />
          </div>
          <div className="flex ml-auto">
            <Button
              text={'Update'}
              style={{backgroundColor: currentColor}}
              className="text-white rounded flex ml-auto"
              onClick={updateProfile}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;