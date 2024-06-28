import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getContractDetail} from "../../redux/slices/contracts/contractsSlice";
import {Loader} from "../../components";

const ContractDetail = () => {
  const dispatch = useDispatch()
  const {id} = useParams()

  const {contractDetail, loading} = useSelector(state => state.contracts)

  console.log(contractDetail)

  useEffect(() => {
    dispatch(getContractDetail(id))
  }, [id]);

  if (loading) return <Loader/>

  return (
    <div>
      detail
    </div>
  );
};

export default ContractDetail;