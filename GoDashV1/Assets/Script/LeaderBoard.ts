import { GameObject, RectTransform, Transform, Vector3 } from "UnityEngine";
import { Text } from "UnityEngine.UI";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { GetRangeRankResponse, GetRankResponse, LeaderboardAPI, ResetRule } from "ZEPETO.Script.Leaderboard";

export default class LeaderBoard extends ZepetoScriptBehaviour {
  private container: Transform;
  private line: GameObject;
  private cnt: number = 0;
  private pcnt: number = 0;
  private number: Text;
  private playerName: Text;
  private score: Text;

  //leaderboard
  public leaderID: string;
  public startRank: number;
  public endRank: number;
  public resetRule: ResetRule;

  Start() {
    
    LeaderboardAPI.GetRangeRank(
      this.leaderID,
      this.startRank,
      this.endRank,
      this.resetRule,
      false,
      (result : GetRankResponse) => {
        for (let i = 2; i < 31; i++) {
          this.line = this.transform.GetChild(i).gameObject;
          console.log(this.line, "LINE");
          this.number = this.line.transform.Find("Number").GetComponent<Text>();
          this.playerName = this.line.transform.Find("Name").GetComponent<Text>();
          this.score = this.line.transform.Find("Score").GetComponent<Text>();
          if (result.rankInfo.rankList.get_Item(this.cnt)) {
            var rank = result.rankInfo.rankList.get_Item(this.cnt);
            this.number.text = this.cnt.toString()+1;
            this.playerName.text = rank.name;
            this.score.text = rank.score.toString();
            this.cnt++;
          }else{
            return;
          }
        }
        
      }
      ,this.OnError);
    
  }


  OnError(error: string) {
    console.error(error);
  }
}
