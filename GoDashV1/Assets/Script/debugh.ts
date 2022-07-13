import { Text } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Manager from './Manager';

export default class debugh extends ZepetoScriptBehaviour {

    private tbox : Text;
    private manager : Manager;

    private static instanceDe: debugh = null;
    public static GetInstance(): debugh {
    return this.instanceDe;
    }
    Awake() {
    debugh.instanceDe = this;
    } 

    Start(){
        this.tbox = this.gameObject.GetComponent<Text>();
        this.manager = Manager.GetInstance();
    }

    Update(){
        //this.tbox.text = this.manager.GetPlayerPos().ToString();
    }

    Print1(num1 : number){
        this.tbox.text = num1.toString(); 
    }

    PrintS(str : string){
        this.tbox.text = str;
    }

    Print2(num1 :number, num2:number, num3:number){
        let num1t = num1.toString();
        let num2t = num2.toString();
        let num3t = num3.toString();
        let numsum = num1t+","+num2t+", "+num3t;
        this.tbox.text = numsum;
    }

}