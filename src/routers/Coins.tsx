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
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const CoinList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0 12px;
  gap: 12px 6px;
`;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardColor};
  color: ${(props) => props.theme.textColor};
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: start;
  border-radius: 15px;
  font-size: 12px;
  font-weight: bold;
  position: relative;
  a {
    display: flex;
    align-items: center;
    transition: color 0.2s ease-in;
    padding: 12px;
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
  margin-right: 6px;
`;

const Rank = styled.span`
  font-size: 1px;
  position: absolute;
  right: 8px;
  top: 6px;
  color: ${(props) => props.theme.textColor};
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
                  {coin.name.length > 9 ? coin.name.slice(0, 8) : coin.name}
                  <Rank>#{coin.rank}</Rank>
                </Link>
              </Coin>
            ))}
        </CoinList>
      )}
    </Container>
  );
}
