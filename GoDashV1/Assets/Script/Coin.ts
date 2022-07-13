import { AudioClip, AudioSource, Collision, GameObject } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import Score from "./Score";

export default class Coin extends ZepetoScriptBehaviour {
  private score: Score;
  private audioCheck: boolean = false;
  public coinSound: AudioClip;

  Start() {
    this.score = Score.GetScoreInstance();
  }

  OnTriggerEnter(col: Collision) {
    if (col.transform.CompareTag("Player")) {
      if (!this.audioCheck) {
        AudioSource.PlayClipAtPoint(this.coinSound, this.transform.position);
        this.audioCheck = true;
      }
      //CoinMovement
      GameObject.Destroy(this.gameObject);
      this.score.GetCoin();
    } else {
      return;
    }
  }

  CoinMovement() {}
}
