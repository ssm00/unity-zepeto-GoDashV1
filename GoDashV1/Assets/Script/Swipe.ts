import { Input, Mathf, TouchPhase, Vector2, Vector3 } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";

export default class Swipe extends ZepetoScriptBehaviour {
  private tap: boolean;
  private swipeLeft: boolean;
  private swipeRight: boolean;
  private swipeUp: boolean;
  private swipeDown: boolean;
  private startTouch: Vector2;
  private swipeDelta: Vector2;
  private isDraging: boolean;

  //getter
  public SwipeDelta(): Vector2 {
    return this.swipeDelta;
  }
  public SwipeLeft(): boolean {
    return this.swipeLeft;
  }
  public SwipeRight(): boolean {
    return this.swipeRight;
  }
  public SwipeUp(): boolean {
    return this.swipeUp;
  }
  public SwipeDown(): boolean {
    return this.swipeDown;
  }

  Update() {
    this.tap = false;
    this.swipeLeft = false;
    this.swipeRight = false;
    this.swipeUp = false;
    this.swipeDown = false;

    //#region mouseInput
    if (Input.GetMouseButtonDown(0)) {
      this.tap = true;
      this.isDraging = true;
      this.startTouch = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
    } else if (Input.GetMouseButtonUp(0)) {
      this.isDraging = false;
      this.Reset();
    }
    //#endregion

    // mobileInput
    if (Input.touches.length > 0) {
      if (Input.touches[0].phase == TouchPhase.Began) {
        this.tap = true;
        this.isDraging = true;
        this.startTouch = Input.touches[0].position;
      } else if (
        Input.touches[0].phase == TouchPhase.Ended ||
        Input.touches[0].phase == TouchPhase.Canceled
      ) {
        this.isDraging = false;
        this.Reset();
      }
    }

    this.swipeDelta = Vector2.zero;
    if (this.isDraging) {
      if (Input.touches.length > 0) {
        this.swipeDelta = Vector2.op_Subtraction(Input.touches[0].position, this.startTouch);
      } else if (Input.GetMouseButton(0)) {
        this.swipeDelta = new Vector2(
          Input.mousePosition.x - this.startTouch.x,
          Input.mousePosition.y - this.startTouch.y
        );
      }
    }
    if (this.swipeDelta.magnitude > 20) {
      let x: number = this.swipeDelta.x;
      let y: number = this.swipeDelta.y;
      if (Mathf.Abs(x) > Mathf.Abs(y)) {
        if (x < 0) {
          this.swipeLeft = true;
        } else {
          this.swipeRight = true;
        }
      } else {
        if (y < 0) {
          this.swipeDown = true;
        } else {
          this.swipeUp = true;
        }
      }
      //console.log(this.swipeLeft);
      this.Reset();
    }
  }

  private Reset() {
    this.startTouch = Vector2.zero;
    this.swipeDelta = Vector2.zero;
    this.isDraging = false;
  }
}
