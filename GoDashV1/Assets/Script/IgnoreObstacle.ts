import { Collider, Collision, GameObject, WaitForSeconds } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

export default class IgnoreObstacle extends ZepetoScriptBehaviour {
  Start() {}

  OnCollisionEnter(col: Collision) {
    if (col.transform.CompareTag("Player")) {
      GameObject.Destroy(this.gameObject, 2);
    }
  }
}
