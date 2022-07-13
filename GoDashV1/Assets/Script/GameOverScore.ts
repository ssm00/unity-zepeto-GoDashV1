import { Text } from "UnityEngine.UI";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { LeaderboardAPI, SetScoreResponse } from "ZEPETO.Script.Leaderboard";
import Manager from "./Manager";
import Score from "./Score";

export default class GameOverScore extends ZepetoScriptBehaviour {
  private s: number;
  public gameOverText: Text;
  public leaderBoardId: string;

  private scoreInstance: Score;
  private static gamOverInstance: GameOverScore = null;

  public static GetInstance(): GameOverScore {
    return this.gamOverInstance;
  }

  Awake() {
    GameOverScore.gamOverInstance = this;
  }

  Start() {}

  SetGameOverScore() {
    this.scoreInstance = Score.GetScoreInstance();
    this.s = this.scoreInstance.GetFinishedScore();
    this.gameOverText.text = this.s.toString();
  }

  RankingUpdate() {
    LeaderboardAPI.SetScore(this.leaderBoardId, this.s, this.OnResult, this.OnError);
  }

  OnResult(result: SetScoreResponse) {
    console.log(`result.isSuccess: ${result.isSuccess}`);
  }
  OnError(error: string) {
    console.error(error);
  }
}
