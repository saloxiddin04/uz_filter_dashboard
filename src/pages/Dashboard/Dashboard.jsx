import React from 'react';
import {ResponsivePie} from '@nivo/pie'
import {Header} from "../../components";

const data = [
  {
    "id": "erlang",
    "label": "erlang",
    "value": 185,
    "color": "hsl(162, 70%, 50%)"
  },
  {
    "id": "ruby",
    "label": "ruby",
    "value": 273,
    "color": "hsl(274, 70%, 50%)"
  },
  {
    "id": "make",
    "label": "make",
    "value": 102,
    "color": "hsl(341, 70%, 50%)"
  },
  {
    "id": "java",
    "label": "java",
    "value": 173,
    "color": "hsl(136, 70%, 50%)"
  },
  {
    "id": "elixir",
    "label": "elixir",
    "value": 460,
    "color": "hsl(22, 70%, 50%)"
  }
]

const Dashboard = () => {
  return (
    <div className={'h-screen m-1 md:mx-4 md:my-10 mt-24 p-2 md:px-4 md:py-10 bg-white rounded'}>
      <Header category="Sahifa" title="Statistika"/>
      <div className={'flex flex-wrap justify-between gap-6 h-full'}>
        <div className={'w-[49%] h-2/4'}>
          <h1 className={'text-2xl p-4 font-bold'}>Shartnomalar</h1>
          <div className={'w-full h-full relative overflow-x-auto overflow-hidden shadow-md sm:rounded'}>
            <ResponsivePie
              data={data}
              margin={{top: 10, right: 80, bottom: 100, left: 80}}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              animate={true}
              borderColor={{
                from: 'color',
                modifiers: [
                  [
                    'darker',
                    0.2
                  ]
                ]
              }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{from: 'color'}}
              arcLabelsSkipAngle={10}
              defs={[
                {
                  id: 'dots',
                  type: 'patternDots',
                  background: 'inherit',
                  color: 'rgba(255, 255, 255, 0.3)',
                  size: 4,
                  padding: 1,
                  stagger: true
                }
              ]}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;