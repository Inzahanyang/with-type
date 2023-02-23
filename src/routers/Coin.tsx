import { useState } from "react";
import { useQuery } from "react-query";
import {
  useParams,
  useLocation,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import styled from "styled-components";
import { coinInfoFetch, coinPriceInfoFetch } from "../api";
import Loader from "../Loader";
import Chart from "./Chart";
import Price from "./Price";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { darkmode } from "../atom";
import {
  InfoData,
  ITab,
  PriceData,
  RouteParams,
  RouteState,
  ThemeBtnProps,
} from "../interface/Icoin";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 360px;
  margin: 0 auto;
`;
const Header = styled.header`
  margin: 20px auto 14px;
  background-color: white;
  border-radius: 12px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const GoHome = styled.button`
  position: absolute;
  left: 16px;
  background-color: inherit;
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
  cursor: pointer;
`;
const Img = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 10px;
`;
const Title = styled.h1`
  font-size: 24px;
  color: #7e7b32;
  margin-right: 24px;
  letter-spacing: 1.2px;
  font-weight: bold;
`;
const PriceView = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px 20px;
  border-radius: 10px;
`;
const Overview = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: ${(props) => props.theme.cardColor};
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    margin-bottom: 5px;
    color: darksalmon;
  }
`;
const Description = styled.p`
  font-size: 12px;
  margin: 20px 0;
`;
const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 25px 0 0;
  gap: 10px;
`;
const Tab = styled.span<ITab>`
  background-color: ${(props) => props.theme.cardColor};
  padding: 7px 0;
  border-radius: 10px;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 400;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;
const More = styled.span`
  font-size: 4px;
  color: ${(props) => props.theme.bgColor};
  letter-spacing: 4px;
  background-color: ${(props) => props.theme.textColor};
  border-radius: 20px;
  margin-left: 4px;
`;
const EmptyDiv = styled.div`
  margin: 20px 0;
`;
const ThemeBtn = styled.button<ThemeBtnProps>`
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  position: fixed;
  right: 25px;
  bottom: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.textColor};
  z-index: 9999;
`;

export default function Coin() {
  const [more, setMore] = useState<boolean>(false);
  const onMore = () => setMore((prev) => !prev);
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const history = useHistory();

  const { isLoading: loadingForInfo, data: info } = useQuery<InfoData>(
    ["info", coinId],
    () => coinInfoFetch(coinId)
  );
  const { isLoading: loadingForPrice, data: priceInfo } = useQuery<PriceData>(
    ["price", coinId],
    () => coinPriceInfoFetch(coinId)
  );

  const loading = loadingForInfo || loadingForPrice;
  const setDarkmode = useSetRecoilState(darkmode);
  const darkMode = useRecoilValue(darkmode);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDarkmode((prev) => !prev);
  };
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </title>
      </Helmet>
      <ThemeBtn isDark={darkMode} onClick={onClick}>
        {darkMode ? "dark" : "light"}
      </ThemeBtn>
      <Header>
        <GoHome onClick={() => history.push("/")}></GoHome>
        <Img
          src={`https://coinicons-api.vercel.app/api/icon/${info?.symbol.toLowerCase()}`}
        />
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : info?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PriceView>
            <OverviewItem>
              <span>Highest Price</span>
              <span>$ {priceInfo?.quotes?.USD.ath_price.toFixed(2)}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Now Price</span>
              <span>$ {priceInfo?.quotes?.USD.price.toFixed(2)}</span>
            </OverviewItem>
          </PriceView>
          <Overview>
            <OverviewItem>
              <span>Rank</span>
              <span>{info?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol</span>
              <span>{info?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Open Source</span>
              <span>{info?.open_source ? "Yes" : "No"}</span>
            </OverviewItem>
          </Overview>
          {info?.description === "" ? (
            <EmptyDiv />
          ) : (
            <Description>
              {more ? (
                info?.description
              ) : (
                <span>
                  {info?.description.length! < 299
                    ? `${info?.description.slice(0, 299)}`
                    : `${info?.description.slice(0, 299)}...`}
                </span>
              )}
              {info?.description.length! < 299 ? null : (
                <More onClick={onMore}>{more ? " Close" : " More"}</More>
              )}
            </Description>
          )}
          <Overview>
            <OverviewItem>
              <span>Total Suply</span>
              <span>{priceInfo?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Supply</span>
              <span>{priceInfo?.max_supply}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
            <Tab isActive={chartMatch === null && priceMatch === null}>
              <Link to={`/${coinId}/chart&price`}>with</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/:coinId/price`}>
              <Price coinId={coinId} />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
            <Route path={`/:coinId/chart&price`}>
              <Chart coinId={coinId} />
              <Price coinId={coinId} double={true} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}
