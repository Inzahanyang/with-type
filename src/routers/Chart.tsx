import { useQuery } from "react-query";
import { coinHistoryPriceInfoFetch } from "../api";
import Loader from "../Loader";
import ApexChart from "react-apexcharts";
import styled from "styled-components";

interface ChartProps {
  coinId: string;
}

interface IHistoryPrice {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

const ErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 55px;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.textColor};
  padding: 12px 24px;
`;

export default function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistoryPrice[]>(
    ["history", coinId],
    () => coinHistoryPriceInfoFetch(coinId)
  );

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          {data ? (
            <ApexChart
              type="candlestick"
              series={[
                {
                  name: "CandleStick Chart",
                  data: data?.map((v) => ({
                    x: new Date(v.time_open * 1000).toDateString(),
                    y: [v.open, v.high, v.low, v.close],
                  })),
                },
              ]}
              options={{
                theme: {
                  mode: "dark",
                },
                chart: {
                  height: 300,
                  width: 500,
                  toolbar: {
                    show: false,
                  },
                  background: "transparent",
                },
                grid: { show: false },
                yaxis: {
                  show: false,
                },
                xaxis: {
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: { show: false },
                },

                tooltip: {
                  y: {
                    formatter: (value) => `$${value.toFixed(2)}`,
                  },
                },
              }}
            />
          ) : (
            <ErrorDiv>So sorry ! We'll fix it soon</ErrorDiv>
          )}
        </div>
      )}
    </div>
  );
}
