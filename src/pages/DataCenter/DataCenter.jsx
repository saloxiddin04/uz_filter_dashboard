import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getDataCenterList, getDataCenterListDetail} from "../../redux/slices/dataCenter/dataCenterSlice";
import {Header, Loader} from "../../components";

const DataCenter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {id} = useParams();
  const {loading, dataCenterListDetail} = useSelector(state => state.dataCenter);

  useEffect(() => {
    dispatch(getDataCenterList()).then((res) => {
      navigate(`/data-center/${res?.payload[0]?.id}`);
    })
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getDataCenterListDetail(id))
    }
  }, [id]);

  if (loading) return <Loader/>

  return (
    <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded">
      <div className={'flex items-center justify-between'}>
        <Header category="Data markaz" title={dataCenterListDetail?.display_name}/>
      </div>
      <div
        className="relative overflow-x-auto shadow-md sm:rounded w-full h-screen py-2"
        style={{ backgroundImage: `url(${dataCenterListDetail?.background_image})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
      </div>
    </div>
  );
};

export default DataCenter;