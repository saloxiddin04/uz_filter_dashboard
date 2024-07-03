import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../../redux/slices/dashboard/dashboardSlice";
import { PieChart } from "@mui/x-charts/PieChart";
import { Header, Loader } from "../../components";
import chroma from 'chroma-js'

const Dashboard = () => {
  const dispatch = useDispatch();

  const { dashboard, loading } = useSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const keysCount = Object.keys(dashboard ? dashboard?.all_contract_short_info : []);
  const dataCount = keysCount.map((key) => ({
    label: `${key}: ${dashboard.all_contract_short_info[key]?.count}`,
    value: parseFloat(dashboard.all_contract_short_info[key]?.count),
  }));

  const dataSum = keysCount.map((key) => ({
    label: `${key}`,
    value: parseFloat(dashboard.all_contract_short_info[key]?.total_sum),
    item: dashboard.all_contract_short_info[key]?.total_sum?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }));

  const colorScale = chroma.scale('Spectral').mode('lch').colors(dataCount.length);
  const colors = ['#1A97F5', '#03C9D7', '#7352FF', '#1E4DB7', '#FB9678']

  const dataCountWithColors = dataCount.map((item, index) => ({
    ...item,
    color: colors[index]
  }));

  const dataSumWithColors = dataSum.map((item, index) => ({
    ...item,
    color: colors[index]
  }));


  // --------------------------------------- //
  const userColors = chroma.scale('Spectral').mode('lch').colors(2);
  const dataUserCount = [
    { label: 'Fizik', value: parseFloat(dashboard?.user_info?.physic_users), color: colors[0] },
    { label: 'Yuridik', value: parseFloat(dashboard?.user_info?.juridic_users), color: colors[3] }
  ];

  const dataUserContracts = [
    { label: 'Fizik (shartnomalar)', value: parseFloat(dashboard?.user_info?.physic_contracts), color: colors[1] },
    { label: 'Yuridik (shartnomalar)', value: parseFloat(dashboard?.user_info?.juridic_contracts), color: colors[2] }
  ];

  const dataUserContractsSum = [
    { label: 'Fizik', value: parseFloat(dashboard?.user_info?.physic_sum), color: colors[0] },
    { label: 'Yuridik', value: parseFloat(dashboard?.user_info?.juridic_sum), color: colors[1] }
  ];

  if (loading) return <Loader />

  return (
    <div className={'m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded'}>
      <Header category="Sahifa" title="Statistika"/>
      <div className={'flex flex-wrap justify-between gap-7'}>
        <div className={'w-[49%] h-2/4'}>
          <h1 className={'text-2xl p-4 font-bold'}>Foydalanuvchilar</h1>
          <div className={'w-full h-full relative overflow-hidden shadow-md sm:rounded flex'}>
            <div>
              <PieChart
                series={[
                  {
                    innerRadius: 0,
                    outerRadius: 80,
                    id: "series-3",
                    data: dataUserCount
                  },
                  {
                    innerRadius: 100,
                    outerRadius: 120,
                    id: "series-4",
                    data: dataUserContracts
                  },
                ]}
                width={400}
                height={300}
                slotProps={{
                  legend: {hidden: true},
                }}
              />
            </div>
            <div className={'flex flex-col items-start justify-center'}>
              {dataUserCount.map((item, index) => (
                <div key={index} className={'flex items-center'}>
                  <div className={'w-4 h-4 mr-2'} style={{ backgroundColor: item.color }}></div>
                  <span>{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={'w-[49%] h-2/4'}>
          <h1 className={'text-2xl p-4 font-bold'}>Foydalanuvchilar (sum)</h1>
          <div className={'w-full h-full relative overflow-hidden shadow-md sm:rounded flex'}>
            <div>
              <PieChart
                series={[
                  {
                    innerRadius: 0,
                    outerRadius: 80,
                    id: "series-5",
                    data: dataUserContracts
                  },
                  {
                    innerRadius: 100,
                    outerRadius: 120,
                    id: "series-6",
                    data: dataUserContractsSum
                  },
                ]}
                width={400}
                height={300}
                slotProps={{
                  legend: {hidden: true},
                }}
              />
            </div>
            <div className={'flex flex-col items-start justify-center'}>
              {dataUserContractsSum.map((item, index) => (
                <div key={index} className={'flex items-center'}>
                  <div className={'w-4 h-4 mr-2'} style={{backgroundColor: item.color}}></div>
                  <span>{item.label}: {item?.value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={'w-[49%] h-2/4'}>
          <h1 className={'text-2xl p-4 font-bold'}>Shartnomalar</h1>
          <div className={'w-full h-full relative overflow-hidden shadow-md sm:rounded flex'}>
            <div>
              <PieChart
                series={[
                  {
                    innerRadius: 0,
                    outerRadius: 80,
                    id: "series-1",
                    data: dataCountWithColors
                  },
                  {
                    innerRadius: 100,
                    outerRadius: 120,
                    id: "series-2",
                    data: dataSumWithColors
                  }
                ]}
                width={400}
                height={300}
                slotProps={{
                  legend: {hidden: true},
                }}
              />
            </div>
            <div className={'flex flex-col items-start justify-center'}>
              {dataCountWithColors.map((item, index) => (
                <div key={index} className={'flex items-center'}>
                  <div className={'w-4 h-4 mr-2'} style={{backgroundColor: item.color}}></div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={'w-[49%] h-2/4'}>
          <h1 className={'text-2xl p-4 font-bold'}>Shartnomalar (sum)</h1>
          <div className={'w-full h-full relative overflow-hidden shadow-md sm:rounded flex'}>
            <div>
              <PieChart
                series={[
                  {
                    innerRadius: 0,
                    outerRadius: 80,
                    id: "series-1",
                    data: dataSumWithColors
                  },
                  {
                    innerRadius: 100,
                    outerRadius: 120,
                    id: "series-2",
                    data: dataCountWithColors
                  }
                ]}
                width={400}
                height={300}
                slotProps={{
                  legend: {hidden: true},
                }}
              />
            </div>
            <div className={'flex flex-col items-start justify-center'}>
              {dataSumWithColors.map((item, index) => (
                <div key={index} className={'flex items-center'}>
                  <div className={'w-4 h-4 mr-2'} style={{backgroundColor: item.color}}></div>
                  <span>{item.label}: {item?.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
