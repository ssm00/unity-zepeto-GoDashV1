import { Text } from "UnityEngine.UI";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { GetRangeRankResponse, LeaderboardAPI, ResetRule } from "ZEPETO.Script.Leaderboard";

export default class MyRanking extends ZepetoScriptBehaviour {
  public leaderBoardID: string;

  public start: number;
  public end: number;
  public rule: ResetRule;

  private num: number;
  private myRank: Text;

  Start() {
    this.myRank = this.gameObject.GetComponent<Text>();
    LeaderboardAPI.GetRangeRank(
      this.leaderBoardID,
      this.start,
      this.end,
      this.rule,
      false,
      (result: GetRangeRankResponse)=>{
        if (result.rankInfo.myRank) {
        this.num = result.rankInfo.myRank.rank;
        this.myRank.text = this.num.toString();
      }
      },
      this.OnError
    );
  }


  OnError(error: string) {
    console.error(error);
  }
}
