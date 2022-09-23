import { useLocalStorage } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useContext } from "react";
import { boardInfo } from "../types";
import { UserContext } from "../context";
import { get } from "../utils/http";
import style from "./GameHistory.module.css";

export default function GameHistory() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [games, setGames] = useState<boardInfo[]>();

  const fetchGameDetails = useCallback(async () => {
    try {
      const fetchedMovie = await get<boardInfo[]>("http://localhost:5000/api/games");
      setGames(fetchedMovie);
      //! CHANGE THE BOARDINFO TYPE TO ACCEPT _ID SO WE CAN USE IT FOR THE INDIVIDUAL PAGES
      console.log(fetchedMovie.map((e) => e));
    } catch (error) {
      console.log(error);
    }
  }, [logout, navigate]);

  useEffect(() => {
    fetchGameDetails();
  }, [fetchGameDetails]);

  return (
    <div className={style.container}>
      {games?.map((board, key) => {
        const { size, created, winner, moves, _id } = board;
        return (
          <div className={style.list} key={key}>
            <p className={style.title}>
              {`Game #${key}}
                   @ ${created}  - Winner is ${winner}`}
            </p>
            <button
              className={style.button}
              onClick={() => navigate(`/game-log:${_id}`)}
            >
              View game log
            </button>
          </div>
        );
      })}
    </div>
  );
}
