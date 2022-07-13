import { AudioClip, AudioSource } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import Manager from "./Manager";

export default class PlayerAudio extends ZepetoScriptBehaviour {
  public sideHitSound: AudioClip;
  public swipeSound: AudioClip;
  public deadSound: AudioClip;
  public jumpSound: AudioClip;
  
  //
  private manager: Manager;
  private static soundInstance: PlayerAudio = null;
  public static GetSoundInstance(): PlayerAudio {
    return this.soundInstance;
  }


  Awake() {
    PlayerAudio.soundInstance = this;
  }

  Start() {
    this.manager = Manager.GetInstance();
  }

  PlaySideHitSound() {
    AudioSource.PlayClipAtPoint(this.sideHitSound, this.manager.GetPlayerPos());
  }

  PlaySwipeSound() {
    AudioSource.PlayClipAtPoint(this.swipeSound, this.manager.GetPlayerPos());
  }

  PlayDeadSound() {
    AudioSource.PlayClipAtPoint(this.deadSound, this.manager.GetPlayerPos());
  }

  PlayJumpSound() {
    AudioSource.PlayClipAtPoint(this.jumpSound, this.manager.GetPlayerPos());
  }
}
