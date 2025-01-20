import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Loader} from "../../components";
import ColocationDetail from "./ColocationDetail/ColocationDetail";

const ContractDetail = () => {
  const dispatch = useDispatch();
  const {id, slug} = useParams();

  return (
    <>
      {slug === 'colocation' && (
        <ColocationDetail />
      )}
    </>
  );
};

export default ContractDetail;
