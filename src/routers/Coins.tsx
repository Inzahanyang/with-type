import styled from "styled-components";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { coinFetch } from "../api";
import Loader from "../Loader";
import { Helmet } from "react-helmet";
import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { darkmode } from "../atom";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0 12px;
`;

const CoinList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardColor};
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 10px;
  border-radius: 15px;
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: bold;
  position: relative;
  a {
    display: flex;
    align-items: center;
    padding: 16px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Img = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`;

const Rank = styled.span`
  font-size: 1px;
  position: absolute;
  right: 10px;
  top: 8px;
  color: ${(props) => props.theme.textColor};
  letter-spacing: 0.5px;
`;
interface ThemeBtnProps {
  isDark: boolean;
}
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

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

export default function Coins() {
  const { isLoading, data: coins } = useQuery<CoinInterface[]>(
    "coins",
    coinFetch
  );

  const setDarkmode = useSetRecoilState(darkmode);
  const darkMode = useRecoilValue(darkmode);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setDarkmode((prev) => !prev);
  };

  return (
    <Container>
      <Helmet>
        <title>Defiantly Coin</title>
      </Helmet>
      <Header>
        <Title>Defiantly Coin</Title>

        <ThemeBtn isDark={darkMode} onClick={onClick}>
          {darkMode ? "dark" : "light"}
        </ThemeBtn>
      </Header>
      {isLoading ? (
        <Loader />
      ) : (
        <CoinList>
          {coins &&
            coins.slice(0, 99).map((coin) => (
              <Coin key={coin.id}>
                <Link
                  to={{
                    pathname: `/${coin.id}/chart`,
                    state: { name: coin.name },
                  }}
                >
                  <Img
                    src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                  />
                  {coin.name}
                  <Rank>#{coin.rank}</Rank>
                </Link>
              </Coin>
            ))}
        </CoinList>
      )}
    </Container>
  );
}
