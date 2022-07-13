import { GameObject, Mathf, Time, Transform } from "UnityEngine";
import { MaskableGraphic } from "UnityEngine.UI";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import Manager from "./Manager";

export default class Score extends ZepetoScriptBehaviour {
   //componenet
  public scoreText: MaskableGraphic;
  public score: number = 0;
  public nextscore: number = 0;
  public s: number;
  
  //Manager
  private manager: Manager;

  private static scoreInstance: Score = null;

  public static GetScoreInstance(): Score {
    return this.scoreInstance;
  }

  Awake() {
    Score.scoreInstance = this;
  }

  Start() {
    this.manager = Manager.GetInstance();
  }

  Update() {
    if (this.manager.GetAlive() && this.manager.GetScoreStart() == true) {
      this.ScoreUp();
    }
  }

  GetCoin() {
    this.score += 1000;
  }

  ScoreUp() {
    this.nextscore = this.score;
    this.score += Time.deltaTime * 1230;
    this.s = Mathf.SmoothStep(this.nextscore, this.score, Time.deltaTime);
    this.s = Mathf.Round(this.s);
    this.scoreText["text"] = this.s.toString();
  }

  ResetScore() {
    this.score = 0;
  }

  GetFinishedScore() {
    return this.s;
  }
}
