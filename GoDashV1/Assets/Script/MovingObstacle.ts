import { AudioSource, GameObject, Time, Transform, Vector3, WaitForSeconds } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import Manager from "./Manager";

export default class MovingObstacle extends ZepetoScriptBehaviour {
  private manager: Manager;

  //
  private obstaclePosition: Vector3;
  private distance: number;
  private use: boolean = false;
  private audioSource: AudioSource;
  private audioPlayed: boolean = false;

  //singleton
  private static movingOtcInstance: MovingObstacle;
  public static GetMovingOtc(): MovingObstacle {
    return this.movingOtcInstance;
  }

  Start() {
    this.audioSource = this.gameObject.GetComponent<AudioSource>();
    this.manager = Manager.GetInstance();
  }

  LateUpdate() {
    this.obstaclePosition = this.gameObject.GetComponent<Transform>().position;
    this.distance = this.obstaclePosition.z - this.manager.GetPlayerPos().z;
    if (this.distance < 30) {
      this.transform.Translate(Vector3.op_Multiply(Vector3.right, 20 * Time.deltaTime));
    }
    if (this.distance < 20 && !this.audioPlayed) {
      this.audioSource.Play();
      this.audioPlayed = true;
    }
  }
}
