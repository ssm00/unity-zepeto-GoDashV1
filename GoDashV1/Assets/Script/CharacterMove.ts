import {
  Animator,
  CapsuleCollider,
  CharacterController,
  GameObject,
  Input,
  KeyCode,
  Mathf,
  Physics,
  RaycastHit,
  Time,
  Transform,
  Vector3,
  WaitForSeconds,
} from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import Manager from "./Manager";
import PlayerAudio from "./PlayerAudio";
import Swipe from "./Swipe";

enum SIDE {
  Left = -2.2,
  Mid = 0,
  Right = 2.2,
}

export default class CharacterMove extends ZepetoScriptBehaviour {
  //audio
  private playerSound: PlayerAudio;
  private manager: Manager;

  //controll
  private m_controller: CharacterController;
  private m_animator: Animator;
  private m_swipeInput: Swipe;
  private m_collider: CapsuleCollider;

  //side
  private m_Side: SIDE = SIDE.Mid;
  private lastSide: SIDE;
  private swipeLeft: boolean;
  private swipeRight: boolean;
  private swipeUp: boolean;
  private swipeDown: boolean;

  //position
  private x: number;
  private y: number = 1;
  private inJump: boolean;
  private inRoll: boolean;
  private rollCounter: number;
  private fallingState: boolean = false;

  //power
  @SerializeField()
  public fwdSpeed: number = 0;
  public jumpPower: number = 35;

  public setFwdSpeed(speed: number) {
    this.fwdSpeed = speed;
  }


  private static charaterMoveInstance: CharacterMove = null;
  public static GetMoveInstance(): CharacterMove {
    return this.charaterMoveInstance;
  }
  Awake() {
    CharacterMove.charaterMoveInstance = this;
  } 

  ResetSide(){
    this.m_Side = SIDE.Mid;
  }

  Start() {
    this.m_controller = this.gameObject.GetComponent<CharacterController>();
    this.m_animator = this.gameObject.GetComponentInChildren<Animator>();
    this.m_swipeInput = this.gameObject.AddComponent<Swipe>();
    this.m_collider = this.gameObject.GetComponent<CapsuleCollider>();
    this.playerSound = PlayerAudio.GetSoundInstance();
    this.manager = Manager.GetInstance();
  }

  Update() {
    this.CharacterMove();
  }

  CharacterMove() {
    if (!this.manager.GetAlive() || !this.manager.SwipeOk()) {
      return;
    }
    this.m_controller.Move(new Vector3(0, 0, this.fwdSpeed * Time.deltaTime));
    if (this.m_swipeInput.SwipeLeft() && !this.inRoll) {
      if (this.m_Side == SIDE.Mid) {
        this.lastSide = this.m_Side;
        this.m_Side = SIDE.Left;
        this.m_animator.Play("Dodging");
        this.playerSound.PlaySwipeSound();
      } else if (this.m_Side == SIDE.Right) {
        this.lastSide = this.m_Side;
        this.m_Side = SIDE.Mid;
        this.m_animator.Play("Dodging");
        this.playerSound.PlaySwipeSound();
      }else{
        this.lastSide = this.m_Side;
      }
    } else if (this.m_swipeInput.SwipeRight() && !this.inRoll) {
      if (this.m_Side == SIDE.Mid) {
        this.lastSide = this.m_Side;
        this.m_Side = SIDE.Right;
        this.m_animator.Play("Dodging");
        this.playerSound.PlaySwipeSound();
      } else if (this.m_Side == SIDE.Left) {
        this.lastSide = this.m_Side;
        this.m_Side = SIDE.Mid;
        this.m_animator.Play("Dodging");
        this.playerSound.PlaySwipeSound();
      }else{
        this.lastSide = this.m_Side;
      }
    }
    
    this.x = Mathf.Lerp(this.transform.position.x, this.m_Side, Time.deltaTime * 10);
    this.m_controller.Move(new Vector3(this.x - this.transform.position.x,this.y * Time.deltaTime,0));
    this.Jump();
    this.Roll();
  }
  
  CheckGround(): boolean {
    let isGround: boolean;
    let ray = this.m_controller.transform.position;
    let ref = $ref<RaycastHit>();
    if (Physics.Raycast(ray, Vector3.down, ref, 0.01)) {
      isGround = true;
    } else {
      isGround = false;
    }
    return isGround;
  }
  
  Jump() {
    if (this.m_controller.isGrounded) {
      if (this.fallingState == true) {
        this.inJump = false;
        this.fallingState = false;
      }
      if (this.m_swipeInput.SwipeUp()) {
        this.playerSound.PlayJumpSound();
        this.y = this.jumpPower;
        this.m_animator.CrossFadeInFixedTime("Jump", 0.1);
        this.inJump = true;
      }
    } else {
      this.y -= this.jumpPower * 2 * Time.deltaTime;
      this.fallingState = true;
    }
  }
  
  Roll() {
    this.rollCounter -= Time.deltaTime;
    if (this.rollCounter <= 0) {
      this.m_controller.center = new Vector3(0, 0.6, 0);
      this.m_controller.height = 1.2;
      this.m_collider.center = new Vector3(0, 0.6, 0);
      this.m_collider.height = 1.2;
      this.rollCounter = 0;
      this.inRoll = false;
    }
    if (this.m_swipeInput.SwipeDown() && !this.inJump) {
      this.playerSound.PlayJumpSound();
      this.rollCounter = 1;
      this.m_controller.center = new Vector3(0, 0.2, 0);
      this.m_controller.height = 0.4;
      this.m_collider.center = new Vector3(0, 0.2, 0);
      this.m_collider.height = 0.4;
      this.m_animator.Play("Roll");
      this.inRoll = true;
      this.inJump = false;
    }
  }
  
  RewindSide() {
    this.m_Side = this.lastSide;
  }

}
