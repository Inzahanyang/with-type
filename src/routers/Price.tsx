import React, { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { coinHistoryPriceInfoFetch } from "../api";
import Loader from "../Loader";

interface ChartProps {
  coinId: string;
  double?: boolean;
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

const List = styled.li`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 6px;
  border-bottom: 1px solid ${(props) => props.theme.accentColor};
`;

const PriceDate = styled.div`
  font-size: 12px;
`;

const SelectList = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #444;
  background-color: #fff;
  padding: 0.2em 1.4em 0.2em 0.8em;
  border: 1px solid #aaa;
  border-radius: 0.5em;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  margin: 12px auto;
  width: 100%;
  &:hover {
    border-color: #888;
  }
  &:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px ${(props) => props.theme.accentColor};
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }
  &:disabled {
    opacity: 0.5;
  }
`;

const OptionList = styled.option`
  text-align: center;
`;

export default function Price({ coinId, double }: ChartProps) {
  const { isLoading, data } = useQuery<IHistoryPrice[]>(
    ["history", coinId],
    () => coinHistoryPriceInfoFetch(coinId)
  );

  const [selectPrice, setSelectPrice] = useState("time_open");

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectPrice(e.currentTarget.value);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {data ? (
            <SelectList onChange={onChange}>
              {data?.slice(0, 1).map((v) =>
                Object.keys(v)
                  .slice(2, 6)
                  .map((x) => (
                    <OptionList value={x}>day by {x} price history</OptionList>
                  ))
              )}
            </SelectList>
          ) : null}
          <ul>
            {data ? (
              data
                .slice(0)
                .reverse()
                .map((v) => (
                  <List>
                    <PriceDate>
                      {new Date(v.time_open * 1000).toLocaleDateString()}
                    </PriceDate>
                    <div>
                      {selectPrice === "open"
                        ? `$${parseFloat(v.open).toFixed(3)}`
                        : selectPrice === "high"
                        ? `$${parseFloat(v.high).toFixed(3)}`
                        : selectPrice === "low"
                        ? `$${parseFloat(v.low).toFixed(3)}`
                        : `$${parseFloat(v.close).toFixed(3)}`}
                    </div>
                  </List>
                ))
            ) : (
              <div>
                {double ? null : (
                  <ErrorDiv>So sorry ! We'll fix it soon</ErrorDiv>
                )}
              </div>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
