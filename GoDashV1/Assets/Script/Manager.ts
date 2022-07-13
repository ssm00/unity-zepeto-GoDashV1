import {
  Animator,
  CapsuleCollider,
  CharacterController,
  CollisionDetectionMode,
  GameObject,
  Rigidbody,
  RigidbodyConstraints,
  Vector3,
  WaitForSeconds,
} from "UnityEngine";
import { Button } from "UnityEngine.UI";
import {
  SpawnInfo,
  ZepetoCamera,
  ZepetoCameraControl,
  ZepetoCharacter,
  ZepetoPlayers,
} from "ZEPETO.Character.Controller";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import { WorldService } from "ZEPETO.World";
import CharacterMove from "./CharacterMove";
import CollisionCheck from "./CollisionCheck";
import MovingObstacle from "./MovingObstacle";
import Score from "./Score";
import TileManager from "./TileManager";


export default class Manager extends ZepetoScriptBehaviour {
  //UI
  public titleUi: GameObject;
  public startButton: Button;
  public startLeaderBoardButton : Button;
  public gameUi: GameObject;
  public gameOverUi: GameObject;
  public mainMenuButton: Button;
  public leaderBoardButton: Button;
  public leaderBoardUi: GameObject;
  public leaderBoardBackButton: Button;
  
  //component
  private m_player: ZepetoCharacter;
  private m_spawn: SpawnInfo;
  private m_playerRb: Rigidbody;
  private m_animator: Animator;
  private m_collider: CapsuleCollider;
  private m_move: CharacterMove;

  //Script
  private playerController: CharacterController;
  private movingOtc: MovingObstacle;
  private score: Score;
  private tileManager: TileManager;

  //state
  private loading: boolean = false;
  private scoreStart: boolean = false;
  private isAlive: boolean = true;
  private swipeState : boolean = false;

  //singleton
  private static instance: Manager = null;
  public static GetInstance(): Manager {
    return this.instance;
  }
  Awake() {
    Manager.instance = this;
  }

  //set get
  GetLoading(): boolean {
    return this.loading;
  }

  GetScoreStart(): boolean {
    return this.scoreStart;
  }

  SetAlive(alive: boolean) {
    this.isAlive = alive;
  }
  GetAlive(): boolean {
    return this.isAlive;
  }

  GetPlayerPos() {
    return this.m_player.transform.position;
  }

  Start() {
    this.SetTitleUI();
    this.movingOtc = MovingObstacle.GetMovingOtc();
    this.score = Score.GetScoreInstance();
    this.tileManager = TileManager.GetTileManager();
    this.startButton.onClick.AddListener(() => {
      this.StartGame();
    });
    this.startLeaderBoardButton.onClick.AddListener(() => {
      this.SetLeaderBoardUi();
    });
    this.mainMenuButton.onClick.AddListener(() => {
      this.GoMainMenu();
    });
    this.leaderBoardButton.onClick.AddListener(() => {
      this.SetLeaderBoardUi();
    });
    this.leaderBoardBackButton.onClick.AddListener(() => {
      this.GoMainMenu();
    });
    this.Loading();
  }

  Update() {
    this.SetGameOverUi();
  }

  //method
  SetTitleUI() {
    this.titleUi.gameObject.SetActive(true);
    this.startButton.gameObject.SetActive(false);
    this.gameUi.gameObject.SetActive(false);
    this.gameOverUi.gameObject.SetActive(false);
    this.leaderBoardUi.gameObject.SetActive(false);
  }

  setGameUi() {
    this.titleUi.gameObject.SetActive(false);
    this.gameUi.gameObject.SetActive(true);
    this.gameOverUi.gameObject.SetActive(false);
    this.leaderBoardUi.gameObject.SetActive(false);
  }

  SetGameOverUi() {
    if (!this.isAlive) {
      this.titleUi.gameObject.SetActive(false);
      this.gameOverUi.gameObject.SetActive(true);
    }
  }

  SetLeaderBoardUi() {
    this.titleUi.gameObject.SetActive(false);
    this.gameUi.gameObject.SetActive(false);
    this.gameOverUi.gameObject.SetActive(false);
    this.leaderBoardUi.gameObject.SetActive(true);
  }


  StartGame() {
    this.titleUi.gameObject.SetActive(false);
    this.gameUi.gameObject.SetActive(true);
    this.gameOverUi.gameObject.SetActive(false);
    this.m_move.setFwdSpeed(15);
    this.scoreStart = true; //scoreUP 조건
  }

  
  GoMainMenu() {
    this.Reset();
    this.SetTitleUI();
    this.startButton.gameObject.SetActive(true);
  }

  RestartGame(){
    this.Reset();
    this.StartGame();
  }

  Loading() {
    this.m_spawn = new SpawnInfo();
    this.m_spawn.position = new Vector3(0, 1, 3);
    ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, this.m_spawn, true);
    ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
      this.m_player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character;
      this.playerController = this.m_player.GetComponent<CharacterController>();

      //Collider set
      this.m_collider = this.m_player.gameObject.AddComponent<CapsuleCollider>();
      this.m_collider.height = 1.2;
      this.m_collider.center = new Vector3(0, 0.6, 0);
      this.m_collider.radius = 0.23;

      //CollsionCheck
      this.m_player.gameObject.AddComponent<CollisionCheck>();
      this.m_player.gameObject.tag = "Player";

      //Rigidbody
      this.m_playerRb = this.m_player.gameObject.AddComponent<Rigidbody>();
      this.m_playerRb.constraints = RigidbodyConstraints.FreezeRotation;
      this.m_playerRb.collisionDetectionMode = CollisionDetectionMode.Continuous;

      //Movement
      this.m_move = this.m_player.gameObject.AddComponent<CharacterMove>();

      //Animator
      this.m_animator = this.m_player.gameObject.GetComponentInChildren<Animator>();

      //tileGenerator
      this.tileManager.Initialize();
    });
    //camera move false
    this.startButton.gameObject.SetActive(true);
    this.loading = true;
  }

  Reset() {
    this.m_player.Teleport(new Vector3(0, 1, 3), this.m_player.transform.rotation);
    this.m_move.setFwdSpeed(0);
    this.m_move.ResetSide();
    this.isAlive = true;
    this.score.ResetScore();
    this.m_animator.Play("MoveRunFast");
    this.tileManager.RestartTile();
  }

  SwipeOk() : boolean{
    if(this.titleUi.activeSelf == true || this.gameOverUi.activeSelf == true || this.leaderBoardUi.activeSelf == true){
      this.swipeState = false;
    }else{
      this.swipeState = true;
    }
    return this.swipeState;
  }

}
