import React from 'react';
import {Header} from "../../components";
import {PieChart} from "@mui/x-charts";

const Dashboard = () => {
  
  const colors = ['#1A97F5', '#03C9D7', '#7352FF', '#1E4DB7', '#FB9678']
  
  const dataUserCount = [
    {label: 'Sotilgan', value: 20, color: colors[0]},
    {label: 'Qolgan', value: 50, color: colors[3]}
  ];
  
  const dataProducts = [
    {label: 'Tayyor mahsulot', value: 1000, color: colors[2]},
    {label: 'Buyurtma asosida', value: 50, color: colors[1]}
  ];
  
  return (
    <div className="card">
      <div>
        <Header category="Page" title="Dashboard"/>
        
        <div className="w-full flex justify-between flex-wrap mt-4">
          <div className="card_dashboard w-full flex gap-4 justify-between">
            <div className="w-[25%] p-3 border rounded border-green-400 bg-green-500 text-white">
              <p className="text-2xl">Kirim</p>
              <h1 className="text-2xl font-bold">+5000$</h1>
            </div>
            <div className="w-[25%] p-3 border rounded border-red-400 bg-red-500 text-white">
              <p className="text-2xl">Chiqim</p>
              <h1 className="text-2xl font-bold">-1000$</h1>
            </div>
            <div className="w-[25%] p-3 border rounded border-blue-400 bg-blue-500 text-white">
              <p className="text-2xl">Jami mahsulotlar</p>
              <h1 className="text-2xl font-bold">700 ta</h1>
            </div>
            <div className="w-[25%] p-3 border rounded border-yellow-400 bg-yellow-500 text-white">
              <p className="text-2xl">Sotilganlar</p>
              <h1 className="text-2xl font-bold">500 ta</h1>
            </div>
          </div>
          
          <div className="w-[49%] h-2/4">
            <h1 className="text-2xl p-4 font-bold">Sotuv</h1>
            <div className="w-full h-full relative overflow-hidden shadow-md sm:rounded flex">
              <div>
                <PieChart
                  series={[
                    {
                      innerRadius: 0,
                      outerRadius: 80,
                      id: "series-3",
                      data: dataUserCount
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
                    <div className={'w-4 h-4 mr-2'} style={{backgroundColor: item.color}}></div>
                    <span>{item.label}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-[49%] h-2/4">
          <h1 className="text-2xl p-4 font-bold">Mahsulotlar</h1>
            <div className="w-full h-full relative overflow-hidden shadow-md sm:rounded flex">
              <div>
                <PieChart
                  series={[
                    {
                      innerRadius: 0,
                      outerRadius: 80,
                      id: "series-3",
                      data: dataProducts
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
                {dataProducts.map((item, index) => (
                  <div key={index} className={'flex items-center'}>
                    <div className={'w-4 h-4 mr-2'} style={{backgroundColor: item.color}}></div>
                    <span>{item.label}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;