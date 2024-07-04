import React from 'react';
import {Header, Input} from "../../components";
import {useSelector} from "react-redux";

const Profile = () => {
  const {user} = useSelector((state) => state.user);

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <Header category="Sahifa" title="Profil"/>
      <div className="relative container overflow-x-auto shadow-md sm:rounded">
        <div className={'flex justify-between items-center flex-wrap gap-4 md:px-4 md:py-4'}>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Ism'}
              label="Ism"
              value={user?.first_name || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Familiya'}
              label="Familiya"
              value={user?.sur_name || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Otasining ismi'}
              label="Otasining ismi"
              value={user?.mid_name || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Yashash joyi'}
              label="Yashash joyi"
              value={user?.per_adr || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Passport raqami'}
              label="Passport raqami"
              value={user?.pport_no || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'PINFL'}
              label="PINFL"
              value={user?.pin || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={"Tug'ilgan sanasi"}
              label="Tug'ilgan sanasi (yil.oy.sana)"
              value={user?.birth_date || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Telefon raqami'}
              label="Telefon raqami"
              value={user?.mob_phone_no || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Email'}
              label="Email"
              value={user?.email || ''}
              disabled={true}
            />
          </div>
          <div className={'w-[49%]'}>
            <Input
              type={'text'}
              placeholder={'Lavozim'}
              label="Lavozim"
              value={user?.userdata?.role?.name || ''}
              disabled={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;