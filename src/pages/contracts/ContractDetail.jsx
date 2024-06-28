import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getContractDetail } from "../../redux/slices/contracts/contractsSlice";
import { Loader, TabsRender } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

const tabs = [
  {
    title: 'Shartnoma',
  },
  {
    title: "Shaxs ma'lumotlari",
  },
  {
    title: "Ko'rib chiqish jarayoni",
  },
];

const ContractDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentColor } = useStateContext();
  const { contractDetail, loading } = useSelector(state => state.contracts);

  const [openTab, setOpenTab] = useState(tabs.findIndex(tab => tab.active));

  console.log(openTab);

  useEffect(() => {
    dispatch(getContractDetail(id));
  }, [id]);

  if (loading) return <Loader />;

  return (
    <>
      <div className="m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-4 bg-white rounded-3xl">
        <TabsRender
          tabs={tabs}
          color={currentColor}
          openTab={openTab}
          setOpenTab={setOpenTab}
        />
      </div>
    </>
  );
};

export default ContractDetail;
