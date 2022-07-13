import { GameObject, Mathf, Object, Random, Vector3, WaitForSeconds } from "UnityEngine";
import { ZepetoScriptBehaviour } from "ZEPETO.Script";
import Manager from "./Manager";

export default class TileManager extends ZepetoScriptBehaviour {
  public tilePrefabs: GameObject[];
  
  private manager: Manager;
  private zSpawn: number;
  private tileLength: number = 80;
  private numberTile: number = 4;
  private gObject: Object;
  private activeTile: Object[];
  private cnt: number;
  private deletecnt: number;

  private static tileManager: TileManager = null;
  public static GetTileManager(): TileManager {
    return this.tileManager;
  }
  Awake() {
    TileManager.tileManager = this;
  }

  Start() {
    this.activeTile = [];
    this.manager = Manager.GetInstance();
  }

  Initialize() {
    this.cnt = 0;
    this.deletecnt = 0;
    this.zSpawn = 120;
    try{
      for (let i = 0; i < 4; i++) {
        this.SpwanTile(Mathf.Round(Random.Range(0, this.tilePrefabs.length)));
      }
    }catch(err){
      this.Initialize();
    }
  }

  Update() {
    if (this.manager.GetPlayerPos().z - 60 > this.zSpawn - this.numberTile * this.tileLength) {
      this.SpwanTile(Mathf.Round(Random.Range(0, this.tilePrefabs.length)));
      this.DeleteTile();
    }
  }

  SpwanTile(tileIndex: number) {
    this.gObject = GameObject.Instantiate(
      this.tilePrefabs[tileIndex],
      new Vector3(0, 0, 1 * this.zSpawn),
      this.transform.rotation
    );
    this.zSpawn += this.tileLength;
    this.activeTile[this.cnt] = this.gObject;
    this.cnt++;
  }

  DeleteTile() {
    GameObject.Destroy(this.activeTile[this.deletecnt]);
    this.deletecnt++;
  }

  RestartTile() {
    for (let i = 0; i < this.activeTile.length; i++) {
      GameObject.Destroy(this.activeTile[this.deletecnt]);
      this.deletecnt++;
    }
    this.Initialize();
  }

}
