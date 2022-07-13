import {
  Animator,
  AudioClip,
  AudioSource,
  Bounds,
  BoxCollider,
  CharacterController,
  Collider,
  Collision,
  GameObject,
  Mathf,
  WaitForSeconds,
} from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import CharacterMove from "./CharacterMove";
import GameOverScore from "./GameOverScore";
import Manager from "./Manager";
import PlayerAudio from "./PlayerAudio";

enum HitX {
  Left,
  Mid,
  Right,
  None,
}
enum HitY {
  Top,
  Mid,
  Bottom,
  None,
}
enum HitZ {
  Foward,
  Mid,
  Backward,
  None,
}


export default class CollisionCheck extends ZepetoScriptBehaviour {
  //components
  private m_Controller: CharacterController;
  private m_Animator: Animator;
  private m_moveScript: CharacterMove;
  private manger: Manager;
  private playerSound: PlayerAudio;
  private gameOverScore: GameOverScore;

  //hit
  public hitX: HitX = HitX.None;
  public hitY: HitY = HitY.None;
  public hitZ: HitZ = HitZ.None;


  Start() {
    this.m_Controller = this.gameObject.GetComponent<CharacterController>();
    this.m_Animator = this.gameObject.GetComponentInChildren<Animator>();
    //Script 는 getcomponent로 안가져와짐.. this.gameObject.Getcomponenet<CollisionCheck>() 제페토에서만 오류
    this.m_moveScript = CharacterMove.GetMoveInstance();
    this.manger = Manager.GetInstance();
    this.playerSound = PlayerAudio.GetSoundInstance();
    this.gameOverScore = GameOverScore.GetInstance();

  }

  OnCollisionEnter(col: Collision) {
    if (col.transform.tag == "Player" || col.transform.tag == "Ground" ||  col.transform.tag == "Ignore") {
      return;
    }
    let hitX: HitX = this.GetHitX(col.collider);
    let hitY: HitY = this.GetHitY(col.collider);
    let hitZ: HitZ = this.GetHitZ(col.collider);
    
    this.Death(hitY, hitZ);
    this.SideHit(hitX, hitZ, hitY);
    
  }

  GetHitX(col: Collider) {
    let Charater_bound: Bounds = this.m_Controller.bounds;
    let Collider_bound: Bounds = col.bounds;
    let minX: number = Mathf.Max(Charater_bound.min.x, Collider_bound.min.x);
    let maxX: number = Mathf.Min(Charater_bound.max.x, Collider_bound.max.x);
    let average: number = (minX + maxX) / 2 - Collider_bound.min.x;
    let hitx: HitX;
    if (average > Collider_bound.size.x - 0.3) {
      hitx = HitX.Right;
    } else if (average < 0.3) {
      hitx = HitX.Left;
    } else {
      hitx = HitX.Mid;
    }
    return hitx;
  }

  GetHitY(col: Collider) {
    let Charater_bound: Bounds = this.m_Controller.bounds;
    let Collider_bound: Bounds = col.bounds;
    let minY: number = Mathf.Max(Charater_bound.min.y, Collider_bound.min.y);
    let maxY: number = Mathf.Min(Charater_bound.max.y, Collider_bound.max.y);
    let average: number = ((minY + maxY) / 2 - Charater_bound.min.y) / Charater_bound.size.y;
    let hity: HitY;
    if (average < 0.3) {
      hity = HitY.Bottom;
    } else if (average < 0.6) {
      hity = HitY.Mid;
    } else {
      hity = HitY.Top;
    }
    return hity;
  }

  GetHitZ(col: Collider) {
    let Charater_bound: Bounds = this.m_Controller.bounds;
    let Collider_bound: Bounds = col.bounds;
    let minZ: number = Mathf.Max(Charater_bound.min.z, Collider_bound.min.z);
    let maxZ: number = Mathf.Min(Charater_bound.max.z, Collider_bound.max.z);
    let average: number = ((minZ + maxZ) / 2 - Charater_bound.min.z) / Charater_bound.size.z;
    let hitz: HitZ;
    if (average < 0.3) {
      hitz = HitZ.Backward;
    } else if (average < 0.6) {
      hitz = HitZ.Mid;
    } else {
      hitz = HitZ.Foward;
    }
    return hitz;
  }

  Death(hitY: HitY, hitZ: HitZ) {
    if (hitZ == HitZ.Foward) {
      if (hitY == HitY.Mid) {
        this.playerSound.PlayDeadSound();
        this.manger.SetAlive(false);
        this.m_Animator.Play("HitMid");
        this.gameOverScore.SetGameOverScore();
        this.gameOverScore.RankingUpdate();
        console.log("MID");
      } else if (hitY == HitY.Bottom) {
        return;
      } else if (hitY == HitY.Top) {
        this.playerSound.PlayDeadSound();
        this.manger.SetAlive(false);
        this.m_Animator.Play("HitTop");
        this.gameOverScore.SetGameOverScore();
        this.gameOverScore.RankingUpdate();
        console.log("Top");
      }
    }
  }

  SideHit(hitX: HitX, hitZ: HitZ, hitY: HitY) {
    //console.log(hitX, hitY, hitZ);
    if (hitY == HitY.Bottom) {
      return;
    }
    if (hitZ == HitZ.Mid) {
      if (hitX == HitX.Right || hitX == HitX.Left) {
        this.playerSound.PlaySideHitSound();
        this.m_Animator.Play("MoveRunFast");
        this.m_Animator.SetLayerWeight(1, 1);
        this.m_Animator.Play("Stumble");
        this.StartCoroutine(this.Doroutine());
        this.m_moveScript.RewindSide();
      }
    }
  }
  
  *Doroutine() {
    yield new WaitForSeconds(1);
    this.m_Animator.SetLayerWeight(1, 0);
  }
}
