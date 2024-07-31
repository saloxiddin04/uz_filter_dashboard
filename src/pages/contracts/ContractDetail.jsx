import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getContractDetail} from "../../redux/slices/contracts/contractsSlice";
import {Loader} from "../../components";
import EmailDetail from "./EmailDetail/EmailDetail";
import ColocationDetail from "./ColocationDetail/ColocationDetail";
import VpsDetail from "./VpsDetail/VpsDetail";
import ExpertiseDetail from "./ExpertiseDetail/ExpertiseDetail";
import CertificationDetail from "./CertificationDetail/CertificationDetail";

const ContractDetail = () => {
  const dispatch = useDispatch();
  const {id, slug} = useParams();
  const {loading} = useSelector(state => state.contracts);

  useEffect(() => {
    dispatch(getContractDetail({id, slug}));
  }, [id, slug]);

  if (loading) return <Loader/>;

  return (
    <>
      {slug === 'e-xat' && (
        <EmailDetail />
      )}
      {slug === 'colocation' && (
        <ColocationDetail />
      )}
      {slug === 'vps' && (
        <VpsDetail />
      )}
      {slug === 'expertise' && (
        <ExpertiseDetail />
      )}
      {slug === 'tte_certification' && (
        <CertificationDetail />
      )}
    </>
  );
};

export default ContractDetail;
