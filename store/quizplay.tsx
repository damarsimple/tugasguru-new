import create from "zustand";
import { Quizplay, User, Examplay, Quizsession } from "../types/type";

interface GameSetting {
  music: boolean;
  sound_effect: boolean;
  timer: boolean;
  memes: boolean;
  multiplayer: boolean;
}

interface GameState {
  index: number;
  myquizplay: Quizplay | null | undefined;
  quizsession: Quizsession | null | undefined;
  started: boolean;
  finished: boolean;

  setting: GameSetting;
  quizplays: Quizplay[];
  players: User[];

  setSetting: (by: GameSetting) => void;
  setQuizsession: (by: Quizsession) => void;
  setStarted: (by: boolean) => void;
  setFinished: (by: boolean) => void;
  setQuizplays: (by: Quizplay[]) => void;
  setMyquizplay: (by: Quizplay | null | undefined) => void;
  setPlayers: (by: User[]) => void;
  setIndex: (by: number) => void;
}

export const useQuizplayStore = create<GameState>((set) => ({
  index: 0,
  myquizplay: null,
  quizsession: null,
  finished: false,
  started: false,
  setting: {
    music: false,
    timer: false,
    sound_effect: false,
    memes: false,
    multiplayer: false,
  },
  quizPlay: [],
  players: [],
  quizplays: [],

  setIndex: (index: number) => set({ index }),
  setQuizsession: (quizsession: Quizsession | null | undefined) =>
    set({ quizsession }),
  setSetting: (setting: GameSetting) => set({ setting }),
  setStarted: (started: boolean) => set({ started }),
  setFinished: (finished: boolean) => set({ finished }),
  setQuizplays: (quizplays: Quizplay[]) => set({ quizplays }),
  setMyquizplay: (myquizplay: Quizplay | null | undefined) =>
    set({ myquizplay }),
  setPlayers: (players: User[]) => set({ players }),
}));
